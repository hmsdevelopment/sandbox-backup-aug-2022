/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

define(["N/render", "N/record", "N/file", "N/http", "N/ui/serverWidget","N/error", "N/https"],

function(render,record,file,http,serverWidget,error,https) {
	
	//TODO: Move to ScriptParameters - Company Level
	//var API_KEY = "Bearer ekd7iulSwfaezaGry5aLKbzr7XB6H6FaCgZ9kyPd";
  	var API_KEY = "Bearer AlzDX4me1h5Q5435uEfzt9IhEVS6kCZ7H2YLIrOs";
	var DEFAULT_TEMPLATE_ID = 236083113;
  	//var DEFAULT_TEMPLATE_ID = 231492505;
	var FILE_FOLDER = 2269; //Listing Agreement
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	log.audit("Generate Listing Contract");
    	//TODO: wrap in try/catch for graceful error handling.  check request type.
    	handlePDFFiller(context);
    }
    
    function handlePDFFiller(context){
    	context.response.write("Starting");
    	//The property_id parameter is passed when the button is clicked on the property record
    	var propertyId = context.request.parameters.property_id;
    	
    	//Load the property record
    	var recProperty = record.load({
    		type:'customrecord_property_record',
    		id:propertyId
    	});
    	
    	//TODO: Dynamic based on Builder Division and Region
    	//Get the template we want to fill and a list of fillable fields
    	var templateId = getTemplateId();
    	var fillableFields = getFillableFields(templateId);
    	
    	//Fill the template on pdffiler.com and get the filled document id
    	var filledPdfId = fillPDFTemmplate(templateId, fillableFields, recProperty);
    	//Use the document ID to download the pdf contents from pdffiller.com  Since this call streams
    	//the contents, we will use the N/file module to create the file.
    	var pdfContents = downloadFilledPDF(filledPdfId);
    	
    	//TODO: Dynamic Name - Need naming convention
    	//Naming Convention : 10738 Anna Ln Listing_Agreement - MLS461903.pdf
    	
    	var houseNumber = recProperty.getText("custrecord_house_number");
    	var street = recProperty.getText("custrecord31");
    	var mlsNumber = recProperty.getText("custrecord_mls_number_region1");
    	var fileName = houseNumber + " " + street + " Listing_Agreement - MLS"+mlsNumber+".pdf";
    	
        log.debug('recDetails', houseNumber + ' | ' + street + ' | ' + mlsNumber + ' | ' + fileName );
        log.debug('pdfContents', pdfContents);
      
    	//Generate the file
    	var filePDF = file.create({
    		name: fileName,
    		fileType: file.Type.PDF,
    		contents:pdfContents,
    		folder: FILE_FOLDER
    	});
    	
    	//save to NetSuite
    	var fileId = filePDF.save();
    	
    	//Attach to Property Record
    	record.attach({
    		record:{
    			type:'file',
    			id: fileId
    		},
    		to:{
    			type:recProperty.type,
    			id:recProperty.id
    		}
    	});
    	 

    	context.response.write("File Saved");
    	
    }
    
   
/**
 * ---------------------------------
 * START fieldToFunctionMap section
 * ---------------------------------
 * Description:  Some fields in the PDF template may need to be based on a formula, concatenation, or some other logic.
 * 				 To work around this, we create a fillable field in PDFfiller and use a function name to name it.  When
 * 				 This suitelet picks up the fillable fields and finds a field not in NetSuite, it will check here to 
 * 				 see if maps to a function.  If it does, it will execute the function.
 * 
 *  Usage:
 *  	var fieldMap={
 *  		"<functionName used in PDFFiller>" : function To Call In Suitelet
 *  	}
 *  
 *   */    
   function fieldToFunctionMap(property, fieldName) {
    	
    	var fieldMap = {
                "getAddress": getAddress,
            };

            if (typeof fieldMap[fieldName] !== "function") {
                return;
            }

            return fieldMap[fieldName](property);
	}
   
   //functions used in the fieldToFunctionMap section
    
    function getAddress(property){
    	return property.getText("custrecord_house_number") + " " + property.getText("custrecord31");
    }
    
    /**
     * ---------------------------------
     * END fieldToFunctionMap section
     * ---------------------------------
     */
    
    function getTemplateId(){
    	//TODO: Add to Builder Record in the Builder Preferences Tab.  By Region.
    	return 236083113;
    	//return 236091173;
    }
    
    function getFillableFields(templateId){
    	log.debug("getFillableFields", "START");

    	var results = https.get({
    		url:"https://api.pdffiller.com/v1/fillable_template/"+templateId,
    		headers: {
    			"Content-Type":"application/json",
    			"authorization":API_KEY
    		}
    	});
    	
    	var fields = JSON.parse(results.body);
        log.debug('field', fields);
    	return fields;
    }
    
    function fillPDFTemmplate(templateId, fillableFields, recProperty){
    	log.debug("fillPDFTemmplate","START");
    	
    	var data = {};
    	var dataFields = {};
    	var missingFields = [];
    	
    	for(var i=0;i<fillableFields.length;i++){
    		var curField = JSON.parse(JSON.stringify(fillableFields[i]));

    		//Check if the field is a NetSuite Field
    		var nsField = recProperty.getField(curField.name);
    		if(nsField){
    			dataFields[curField.name] = recProperty.getValue(curField.name);
    		}else{
    			//Check if the field maps to a function
    			var functionResult = fieldToFunctionMap(recProperty, curField.name);
    			
    			if (functionResult) {
    				dataFields[ curField.name] = functionResult;
				}else{
					missingFields.push(curField.name);
				}
    		}
    	}
    	
    	data.document_id = templateId;
    	data.fillable_fields = dataFields;
    	
    	if(missingFields.length>0){
    		log.debug("Missing Fields", JSON.stringify(missingFields));
    		//TODO: Should we alert someone via email?
    	}
    	
    	var results = https.post({
    		url:"https://api.pdffiller.com/v1/fillable_template",
    		body: JSON.stringify(data),
    		headers: {
    			"Content-Type":"application/json",
    			"authorization":API_KEY
    		}
    	});
    	
        var docDetails = JSON.parse(results.body);
        log.debug('docDetails', docDetails);
    	log.debug("fillPDFTemmplate","FINISH");
    	
    	return docDetails.document_id;
    }
    
    function downloadFilledPDF(filledPdfId) {
      	var fileResults = https.get({
    		url:"https://api.pdffiller.com/v1/fillable_template/"+ filledPdfId +"/download",
    		headers: {"authorization": "Bearer AlzDX4me1h5Q5435uEfzt9IhEVS6kCZ7H2YLIrOs"}
      	//var fileResults = https.get({
    	//	url:"https://api.pdffiller.com/v1/fillable_template/"+ filledPdfId +"/download",
    	//	headers: {"authorization": "Bearer ekd7iulSwfaezaGry5aLKbzr7XB6H6FaCgZ9kyPd"}
    	});
    	
    	return fileResults.body;
	}

    return {
        onRequest: onRequest
    };
    
});