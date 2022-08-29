/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record','./pdffiller', 'N/file'],
/**
 * @param {render} render
 * @param {record} record
 */
function(record, pdffiller, file) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
        var response = context.response;
      
    	var recProperty = record.load({
    		type:'customrecord_merge',
    		id:1000
    	});
      
      var expDate = recProperty.getValue('custrecord_temp_exp_date');
      
       response.write("Exp Date : " + expDate + "<br />");
       response.write("Exp Date : " + typeof expDate + "<br />");
      
      
      
      
    	//log.debug('merge record', recProperty);
    	
    	//var templateId = 288666501; //pdffiller.getTemplateId(builderId);
    	//log.debug('Template', templateId);
    	//var fillableFields = pdffiller.getFillableFields({templateId:templateId});
    	//log.debug('fillableFields', fillableFields);
    	//var dataFields = fillFields(recProperty, fillableFields);
    	//log.debug('dataFields', dataFields);
      	//var pdfId = pdffiller.fillPDFTemmplate(templateId, dataFields);
      	//log.debug('pdfId', pdfId);
        //var fileName = 'pdffiller_test_list_amend.pdf';
        //var pdfContents = pdffiller.downloadFilledPDF(pdfId);
        //log.debug('pdfContents', pdfContents);
       // var deletePDF = pdffiller.deletePDFTemplate(pdfId);
        //log.debug('deletePDF', deletePDF);
    	
    	
        //var filePDF = file.create({
    	//	name: fileName,
    	//	fileType: file.Type.PDF,
    	//	contents:pdfContents,
    	//	folder: pdffiller.getFolderId()
    	//});
    	
        
    	//save to NetSuite
    	//var fileId = filePDF.save();
    	
    	//log.debug('fileId', fileId);
    	
    }
    
    function fillFields(record, fillableFields) {
		var dataFields = {};
		var missingFields = [];
		
		for(var i=0;i<fillableFields.length;i++){
			var curField = JSON.parse(JSON.stringify(fillableFields[i]));
			var nsName = curField.name.toLowerCase();

			log.debug('curField',curField);
			if(nsName.substring(0,2)=='nl'){
				nsName = nsName.substring(2);
			}
			
			//Check if the field is a NetSuite Field
			var nsField = record.getField(nsName);
          	log.debug('Looking up: ' + nsName);
			if(nsField){
				log.debug('Yes, in NS');
				dataFields[curField.name] = record.getText(nsName);
			}else{
				log.debug('No, not in NS');
				//Check if the field maps to a function
				var functionResult = fieldToFunctionMap(record, curField.name);
				//log.debug('curField:'+curField, functionResult);
				if (functionResult) {
					dataFields[ curField.name] = functionResult;
				}else{
					missingFields.push(curField.name);
				}
			}
		}
		
		if(missingFields.length>0){
			log.debug("Missing Fields: " , JSON.stringify(missingFields));
    	}
		
		return dataFields;
		
	}
    
function fieldToFunctionMap(record, fieldName) {
    	
    	var fieldMap = {};
    	

            if (typeof fieldMap[fieldName] !== "function") {
                return;
            }

            return fieldMap[fieldName](record); //getAddress(record);
	}
    	
    	
    	
//    	var response = context.response;
//    	
//    	var propertyId = context.request.parameters.property_id;
//    	
//    	if(!propertyId){
//    		response.write("Missing Property.  Please contact your administrator.");
//    		return;
//    	}
//    	
//    	//var propertyId = 7879;
//    	
//    	//Load the property record
//    	var recProperty = record.load({
//    		type:'customrecord_property_record',
//    		id:propertyId
//    	});
//    	
//    	var renderer = render.create();
//    	renderer.setTemplateByScriptId({
//    	    scriptId: "CUSTTMPL_LA_TEMPLATE_KENTUCKY"
//    	});
//    	renderer.addRecord('record', recProperty);
//    	
//    	var amendPDF = renderer.renderAsPdf();
//    	context.response.writeFile(amendPDF);
    	
    
    return {
        onRequest: onRequest
    };
    
});
