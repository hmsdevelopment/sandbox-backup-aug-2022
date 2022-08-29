/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * 
 * Change Log
 * 2019.05.23 BCT Remove reference to deprecated addListingAgreementToProperty function.
 * 2020.05.05 BCT If Requires LIsting Contract Email checked on MLS record, then send email.
 */
define(['N/runtime','N/search','N/record', 'N/file', './pdffiller', "./hms_pdf_queue_manager", "N/email"],

function(runtime,s,record,file,pdffiller,PDF_QM, email) {
	
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} context
     * @param {string} context.type - The context in which the script is executed. It is one of the values from the context.InvocationType enum.
     * @Since 2015.2
     */
    function execute(context) {
    	handleQueue(context);
    }
    
    function handleQueue(context){
    	log.audit("handleQueue","START");
    	var queueSearch = s.create({
 		   type: "customrecord_hms_pdf_queue",
 		   columns:
 		   [
 		      "custrecord_hms_pq_pdf_type",
 		      "custrecord_hms_pq_record_type",
 		      "custrecord_hms_pq_property",
 		      "custrecord_hms_pq_region",
 		      "custrecord_hms_pq_mls_number",
 		      s.createColumn({
 		         name: "custrecord_hms_pq_download_now",
 		         sort: s.Sort.DESC
 		      }),
 		      "custrecord_hms_pq_schedule_download",
 		      "custrecord_hms_pq_processing",
 		      "custrecord_hms_pq_had_error",
 		      "custrecord_hms_pq_error_details"
 		   ]
 		});
 		var queueCount = queueSearch.runPaged().count;
 		
 		log.audit("handleQueue","PDFs to generate: " + queueCount);
 		queueSearch.run().each(generatePDF);
 		log.audit("handleQueue","FINISH");
    }
    
    function generatePDF(result){
    	log.audit("generatePDF","START");
    	//Used in Error Trapping to alert of errors
    	var author = 3847;
    	var details = '';
    	var subject = 'HMS Listing Amendment Property List';
    	var recipient = ['bturk183@gmail.com', 'jmcdonald@hmsmarketingservices.com'];
    	
    	try{
    		var pdfType = result.getValue("custrecord_hms_pq_pdf_type");
    	    var recordType = result.getValue("custrecord_hms_pq_record_type");
    	    var propertyId = result.getValue("custrecord_hms_pq_property");
    	    var regionId = result.getValue("custrecord_hms_pq_region");
    	    var mlsNumber = result.getValue("custrecord_hms_pq_mls_number");
    	    var downloadNow = result.getValue("custrecord_hms_pq_download_now");
    	    var isProcessing = result.getValue("custrecord_hms_pq_processing");
    	    var hadError = result.getValue("custrecord_hms_pq_had_error");
    	    var errorDetails = result.getValue("custrecord_hms_pq_error_details");
    	    var queueId = result.id;
        	
    	    log.debug('generatePDF', 'Current PDF Details' + [pdfType, recordType, propertyId, regionId, mlsNumber, downloadNow, isProcessing, hadError, errorDetails].join(', '));
    	    
    	    PDF_QM.flagProcessing(queueId);
    	    
    	    var property = record.load({
    	    	type: recordType, 
    		    id: propertyId
    	    });
    	    
    	    var builderId = property.getValue("custrecord12");
    	    var subDivisionId = property.getValue("custrecordcustrecordsubdname");
    	    var region1MLS = property.getValue("custrecord_mls_number_region1");

    	    var templateId = pdffiller.getTemplateId(builderId,subDivisionId);
			log.debug("pdffiller.getTemplateId","templateId");

			if(templateId){

				var fillableFields = pdffiller.getFillableFields({templateId:templateId});
				var dataFields = fillFields(property, fillableFields);
				var pdfId = pdffiller.fillPDFTemmplate(templateId, dataFields);

			  	if(pdfId){
					var fileName = getFileName(property,mlsNumber);
					var pdfContents = pdffiller.downloadFilledPDF(pdfId);

					//log.debug('PDF Filler Results', [pdfId, templateId, regionId, fileName].join(', '));

					//Generate the file
					var filePDF = file.create({
						name: fileName,
						fileType: file.Type.PDF,
						contents:pdfContents,
						folder: pdffiller.getFolderId()
					});

					//save to NetSuite
					var fileId = filePDF.save();

					//log.debug('mlsNumber', mlsNumber);
					//log.debug('region1MLS', region1MLS);
					if(mlsNumber == region1MLS){
						log.debug('Update Property');
						property.setValue({fieldId:"custrecord_listing_agreement_doc", value:fileId});
						property.save({ignoreMandatoryFields:true});
						log.debug('Done');
					}

					//Attach to Property Record
					record.attach({
						record:{
							type:'file',
							id: fileId
						},
						to:{
							type:property.type,
							id:property.id
						}
					});


					var lookupMlsDetails = s.lookupFields({
						type: 'location',
						id: regionId,
						columns: ['custrecord_hms_req_listcontract_email','custrecord_mls_email', 'name']
					});

					var regionMlsEmail = lookupMlsDetails.custrecord_mls_email;
					var regionRequiresEmail = lookupMlsDetails.custrecord_hms_req_listcontract_email;
					var regionName = lookupMlsDetails.name;

					log.debug('requires email', regionRequiresEmail);
					log.debug('email', regionMlsEmail);

					if(regionRequiresEmail){
						log.audit('generatePDF', 'Selected Region Requires Email');

						if(!regionMlsEmail){
							log.error("MISSING EMAIL", "No email found for selected region");
							email.send({
								author: 3847,
								recipients: 3,
								subject: "Listing Agreement - MLS Region Missing Email",
								body: "Listing Agreement file, " + fileName + " was generated for " + property.getText('custrecord_simple_name') +
										" in MLS Region: " + regionName + ", which does not have an MLS Email."
							});
						}else{
							email.send({
								author: 3847,
								//recipients: 'mlsdocs@cincymls.com',
								recipients: regionMlsEmail,
								subject: 'Listing Agreement MLS# ' +mlsNumber,
								body: 'Attached find a listing contract.',
								attachments:[filePDF],
								relatedRecords: {
									customRecord:{
										id:property.id,
										recordType:property.type
									}
								}
							});
						}
					}

					//2019.05.23 addListinAgreementToProperty has been deprecated
					//PDF_QM.addListingAgreementToProperty(fileId, propertyId, regionId);

					log.debug('File URL', filePDF.url);
				}
				else {
					email.send({
						author: author,
						recipients: ["jmcdonald@hmsmarketingservices.com", "hms@midware.net"],
						subject: subject,
						body: "PDF Filler does not return the PDF id: " + propertyId,
					});
				}
            } else {
              email.send({
                author: author,
                recipients: ["jmcdonald@hmsmarketingservices.com", "hms@midware.net"],
                subject: subject,
                body: "There is no template Id: " + propertyId,
              });
            }
    	}catch(ex){
    		details = 'Exception in generatePDF : '+ex+', Message : '+ex.message+' Name : '+ex.name;
    		log.error('beforeLoad', details);
    		log.error('beforeLoad', ex);

    		email.send({
                author: author,
                recipients: recipient,
                subject: subject,
                body: details,
            });
    		
    	}finally{
    		
    		PDF_QM.removeFromQueue(queueId);
    		log.audit("beforeLoad", "Removed Property from Queue");
    	}
    	
    	return true;
    }
    
	function fillFields(record, fillableFields) {
		var dataFields = {};
		var missingFields = [];
		
		for(var i=0;i<fillableFields.length;i++){
			var curField = JSON.parse(JSON.stringify(fillableFields[i]));

			//log.debug('curField',curField);
			//Check if the field is a NetSuite Field
			var nsField = record.getField(curField.name);
          	//log.debug('Looking up: ' + curField.name);
			if(nsField){
				//log.debug('Yes, in NS');
				dataFields[curField.name] = record.getText(curField.name);
			}else{
				//log.debug('No, not in NS');
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
			log.debug("Missing Fields: ", JSON.stringify(missingFields));
    	}
		
		return dataFields;
		
	}
	
	function getFileName(rec, mlsNumber){
        var houseNumber = rec.getText("custrecord_house_number");
    	var street = rec.getText("custrecord31");
    	var fileName = houseNumber + " " + street + " Listing_Agreement - MLS"+mlsNumber+".pdf";
        return fileName;
    }
	
	function fieldToFunctionMap(record, fieldName) {
    	
    	var fieldMap = {
                "getAddress": getAddress,
                "getBuilder": getBuilder,
                "getSubdivision" : getSubdivision
            };
    	

            if (typeof fieldMap[fieldName] !== "function") {
                return;
            }

            return fieldMap[fieldName](record); //getAddress(record);
	}
   
   //functions used in the fieldToFunctionMap section
	
	function getSubdivision(rec){
		var subDivId = rec.getValue("custrecordcustrecordsubdname");
		
		var recSubDiv = record.load({
			type: "customrecord_subdivision",
			id: subDivId
		});
		
		var subDivisionName = recSubDiv.getValue("custrecord_subdivision_id");
		
		return subDivisionName;
	}
    
    function getAddress(rec){
    	return rec.getText("custrecord_house_number") + " " + rec.getText("custrecord31");
    }
    
    function getBuilder(rec){
    	var topLevelBuilder = rec.getText("custrecord_top_level_builder");
    	var builder = rec.getText("custrecord12");
    	
    	if(!builder){builder="NA";}
    	
    	if(topLevelBuilder){
    		return topLevelBuilder;
    	}else{
    		return builder;
    	}
    	
    }
    
    return {
        execute: execute
    };
    
});
