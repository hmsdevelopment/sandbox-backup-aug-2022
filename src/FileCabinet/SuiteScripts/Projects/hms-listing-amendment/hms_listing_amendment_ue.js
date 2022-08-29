/**
 *  Author Brian Turk <bturk183@gmail.com>
 *  
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * 
 * 
 * 
 * 
 * ==========================================================
 * Change Log
 * ==========================================================
 * 
 * 2018.04.25 BT Initial Conversion from SS 1.0 to 2.0
 * 2019.11.05 BT Fix issue with email always sending to MLS
 * 2019.11.09 BT Add function to lookup template id from builder record
 */
define(['N/ui/serverWidget', 'N/record', './pdffiller', 'N/file', 'N/format', 'N/search', 'N/email', 'N/ui/message'],
		
function(serverWidget, record, pdffiller, file, format, search, email, message) {
	//Initial Module Level variables
	var DEFAULT_TEMPLATE_ID = 288666501;
	// var DEFAULT_TEMPLATE_ID = 7559;

	//Email to MLS variables
	var to = [];
	var cc = [];
	//cc.push('listings@hmsmarketingservices.com');
	cc.push('mlsdocs@cincymls.com');

	//Used in Error Trapping to alert of errors
	var author = 3847;
	var details = '';
	var subject = 'HMS Listing Amendment Property List';
	var recipient = 'bturk183@gmail.com';
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} context
     * @param {Record} context.newRecord - New record
     * @param {string} context.type - Trigger type
     * @param {Form} context.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(context) {
    	var form = context.form;

    	//Adding two hidden fields to the property record that will get set by the client script (hms_listing_amendment_cl)
    	//These fields control the actions on whether a Listing Amendment gets Generated and whether an email is sent.
    	try
    	{
    		// form.addField({
    		// 	id:'custrecord_is_changed',
    		// 	type:'checkbox',
    		// 	label: 'Property Changed'
    		// }).updateDisplayType({
    		//     displayType : serverWidget.FieldDisplayType.HIDDEN
    		// });
    		
    		// form.addField({
    		// 	id:'custrecord_email_to_mls',
    		// 	type:'checkbox',
    		// 	label:'Mail to MLS Info'
    		// }).updateDisplayType({
    		//     displayType : serverWidget.FieldDisplayType.HIDDEN
    		// });
    		
    	}
    	catch(ex)
    	{
    		details = 'Exception in beforeLoadProperty : '+ex+', Message : '+ex.message+' Name : '+ex.name;
    		log.error('beforeLoad', details);
    		log.error('beforeLoad', ex);

    		email.send({
                author: author,
                recipients: recipient,
                subject: subject,
                body: details,
            });
    	}

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} context
     * @param {Record} context.newRecord - New record
     * @param {Record} context.oldRecord - Old record
     * @param {string} context.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(context) {
    	var rec = context.newRecord;
    	var oldRec = context.oldRecord;
    	
    	try
    	{
    		var isChanged= rec.getValue('custrecord_is_changed');
    		log.audit('Save Record', 'Checking for Listing Amendment request');
			log.audit('isChanged', isChanged);
    		if(isChanged)
    		{
    			log.audit('Save Record', 'Listing Amendment REQUESTED');
    			
    			var mlsRegionId = rec.getValue('custrecord15');	
    			var topLevelBuilder = rec.getValue('custrecord_top_level_builder');
    			var builderDivision = rec.getValue('custrecord12');		
    			var propertyName = rec.getText('name');
    			var mlsRegionName = rec.getText('custrecord15');
    			
				log.audit('Save Record', 'Property: ' + propertyName);
				log.audit('Save Record', 'mlsRegionId: ' + mlsRegionId);
				log.audit('Save Record', 'topLevelBuilder: ' + topLevelBuilder);
				log.audit('Save Record', 'Property: ' + propertyName);
				log.audit('Save Record', 'mlsRegionName: ' + mlsRegionName);
    			
				// if(mlsRegionId && (topLevelBuilder == '509' || topLevelBuilder == '4903' || topLevelBuilder == '3990' || topLevelBuilder == '5053'))
				if(mlsRegionId)
                {


    				var lookupMls = search.lookupFields({
    				    type: 'location',
    				    id: mlsRegionId,
    				    columns: ['custrecord_mls_email','custrecord_mw_requires_listing_amd']
					});
					
					log.audit('lookupMls', lookupMls);
					
					var regionMlsEmail = lookupMls.custrecord_mls_email;
					var mslRegionRequireAMD = lookupMls.custrecord_mw_requires_listing_amd;



					if (mslRegionRequireAMD){
						log.audit('Save Record', 'Listing Amendment PROCESSING');
						var templateId  = null;



						if(regionMlsEmail){
							log.audit('Save Record', 'Found MLS email for the ' + mlsRegionName + ' region: ' + regionMlsEmail);
							to.push(regionMlsEmail);
							cc.push(regionMlsEmail);
						}
						
						var tempSelSearch = search.create({
							type: 'customrecord_mls_template_selection',
							columns: ['custrecord_template_id'],
							filters: [
								['custrecord_mls_template_mls', 'is', mlsRegionId],
								'and', ['custrecord_mls_template_builder_div', 'is', builderDivision],
								'and', ['custrecord_template_type', 'is', 2]
							]
						});
						
						var searchResult = tempSelSearch.run().getRange({
							start: 0,
							end: 1
							});
						
						if(searchResult != null && searchResult.length >0)
							{
								var tempSrchId = searchResult[0].id;
								templateId = searchResult[0].getValue('custrecord_template_id');
							}


						generateListAmendment(templateId,rec,oldRec);

					}

              }
    		}	 
    	}
    	catch(ex)
    	{
    		details = 'Exception in beforeSubmitProperty '+ex+', Message : '+ex.message+' Name : '+ex.name;
    		log.error('DEBUG', details);

    		email.send({
                author: author,
                recipients: recipient,
                subject: subject,
                body: details,
			});
			
			context.newRecord.setValue({fieldId:"custrecord_mw_last_listing_amd",value: "3"});  
    	}

    }
    
    
    function generateListAmendment(templateID, rec, oldRec)
    {	
    	log.audit('generateListAmendment', 'START');
    	try
    	{
    		var oldListPrice = oldRec.getValue('custrecord_current_list_price');
    		var oldExpDate = oldRec.getValue('custrecord_expiration_date');
    		var newListPrice = rec.getValue('custrecord_current_list_price');	
    		var newExpDate = rec.getValue('custrecord_expiration_date');	
    		var houseNo = rec.getValue('custrecord_house_number');
    		var street = rec.getValue('custrecord31');
    		var today = new Date();
          	var listDate = rec.getValue('custrecord_list_date');
    		var dateFormatted =  (today.getMonth()+1) + '/' + today.getDate()+ '/' + today.getFullYear();
    		var dateFileFormatted = (today.getMonth()+1) + '-' + today.getDate()+ '-' + today.getFullYear();
    		var mlsNumber = rec.getValue('custrecord_mls_number_region1');
			var mlsNumber2 = rec.getValue('custrecord_mls_number_region2');
    		
//    		if(mlsNumber){
//    			log.debug('format mlsNumber', format.format({value: mlsNumber, type: format.Type.INTEGER}));
//    		}
    		
    		if(oldExpDate){
    			oldExpDate = format.format({value: oldExpDate, type: format.Type.DATE});
    		}
    		
    		if(newExpDate){
    			newExpDate = format.format({value: newExpDate, type: format.Type.DATE});
    		}
    		
          	if(listDate){
              listDate = format.format({value: listDate, type: format.Type.DATE});
			}
            if(newListPrice){
              newListPrice = format.format({value: newListPrice, type: format.Type.TEXT});
            }
            
            if(oldListPrice){
              oldListPrice = format.format({value: oldListPrice, type: format.Type.TEXT});
            }
              
            if(mlsNumber){
              mlsNumber = format.format({value: mlsNumber, type: format.Type.TEXT});
            }

			if(mlsNumber2){
				mlsNumber2 = format.format({value: mlsNumber2, type: format.Type.TEXT});
			}
              
            
    		var address = rec.getValue('custrecord_simple_name');
    		var city = rec.getValue('custrecord_city');
    		var state = rec.getText('custrecord_state');
    		var zipCode = rec.getValue('custrecord_zip_code');
    		var sellerSig = rec.getValue('custrecord_sellers_signature');
    		var mlsRegion = rec.getValue('custrecord15');
    		var mlsRegionCode =rec.getText('custrecord15'); 
    		var builderId = rec.getValue('custrecord12');
    		var subDivisionId = rec.getValue('custrecordcustrecordsubdname');
			
			// Get Mls Region 2
			var mlsRegion = rec.getValue('custrecord16');
			var mlsRegionCode2 = rec.getText('custrecord16');

  		
    		var tempRecord = record.create({type:'customrecord_merge'});
    		var tempRecord2 = record.create({type:'customrecord_merge'}); // Record Template Merge for MLS 2

    		tempRecord.setValue({fieldId:'custrecord_temp_mls_number', value:mlsNumber});
    		tempRecord2.setValue({fieldId:'custrecord_temp_mls_number', value:mlsNumber2});

    		tempRecord.setValue({fieldId:'custrecord_temp_mls_area_code', value: mlsRegionCode});
			tempRecord2.setValue({fieldId:'custrecord_temp_mls_area_code', value: mlsRegionCode2});

    		tempRecord.setValue({fieldId:'custrecord_temp_address', value: address});
			tempRecord2.setValue({fieldId:'custrecord_temp_address', value: address});

    		tempRecord.setValue({fieldId:'custrecord_temp_city', value: city});
    		tempRecord2.setValue({fieldId:'custrecord_temp_city', value: city});

    		tempRecord.setValue({fieldId:'custrecord_temp_state', value: state});
			tempRecord2.setValue({fieldId:'custrecord_temp_state', value: state});

    		tempRecord.setValue({fieldId:'custrecord_temp_zip', value: zipCode});
			tempRecord2.setValue({fieldId:'custrecord_temp_zip', value: zipCode});

    		tempRecord.setValue({fieldId:'custrecord_temp_date', value: dateFormatted});
			tempRecord2.setValue({fieldId:'custrecord_temp_date', value: dateFormatted});

    		tempRecord.setValue({fieldId:'custrecord_temp_seller_sig', value: sellerSig});
			tempRecord2.setValue({fieldId:'custrecord_temp_seller_sig', value: sellerSig});

          	tempRecord.setValue({fieldId:'custrecord_temp_list_date', value: listDate});
			tempRecord2.setValue({fieldId:'custrecord_temp_list_date', value: listDate});

    		
    		if (oldListPrice != newListPrice)
    		{
    			tempRecord.setValue({fieldId:'custrecord_temp_listing_price', value: oldListPrice});
    			tempRecord.setValue({fieldId:'custrecord_temp_listing_price_new', value: newListPrice});
    			tempRecord.setValue({fieldId:'custrecord_temp_price_change', value: 'X'});

				tempRecord2.setValue({fieldId:'custrecord_temp_listing_price', value: oldListPrice});
    			tempRecord2.setValue({fieldId:'custrecord_temp_listing_price_new', value: newListPrice});
    			tempRecord2.setValue({fieldId:'custrecord_temp_price_change', value: 'X'});
    		}
    		if (oldExpDate != newExpDate)
    		{
    			tempRecord.setValue({fieldId:'custrecord_temp_exp_date_new', value: newExpDate});
    			tempRecord.setValue({fieldId:'custrecord_temp_exp_date', value: oldExpDate});
    			tempRecord.setValue({fieldId:'custrecord_temp_date_change', value: 'X'});

				tempRecord2.setValue({fieldId:'custrecord_temp_exp_date_new', value: newExpDate});
    			tempRecord2.setValue({fieldId:'custrecord_temp_exp_date', value: oldExpDate});
    			tempRecord2.setValue({fieldId:'custrecord_temp_date_change', value: 'X'});
    		}
    		if (oldExpDate != newExpDate && oldListPrice != newListPrice)
    		{
    			tempRecord.setValue({fieldId:'custrecord_temp_both_change', value: 'X'});
    			tempRecord.setValue({fieldId:'custrecord_temp_date_change', value: ''});
    			tempRecord.setValue({fieldId:'custrecord_temp_price_change', value: ''});

				tempRecord2.setValue({fieldId:'custrecord_temp_both_change', value: 'X'});
    			tempRecord2.setValue({fieldId:'custrecord_temp_date_change', value: ''});
    			tempRecord2.setValue({fieldId:'custrecord_temp_price_change', value: ''});
    		}
          
    		var tempRecordID = tempRecord.save();
			var fileName = mlsNumber + ' Listing Amendment ' + dateFileFormatted + '.pdf';
			var amendFileId = generatePDF(builderId, subDivisionId, tempRecordID, fileName);
			

			if (mlsRegionCode2 && mlsNumber2){
				var tempRecordID2 = tempRecord2.save();  // For MLS Region 2
				var fileName2 = mlsNumber2 + ' Listing Amendment ' + dateFileFormatted + '.pdf';
				var amendFileId2 = generatePDF(builderId, subDivisionId, tempRecordID2, fileName2);
			}

			if(amendFileId){
				//Attach to Property Record
					record.attach({
						record:{
							type:'file',
							id: amendFileId
						},
						to:{
							type:rec.type,
							id:rec.id
						}
					});
			
				rec.setValue({fieldId:"custrecord_mw_last_listing_amd",value: "2"});
			  
			}
			else {
				rec.setValue({fieldId:"custrecord_mw_last_listing_amd",value: "3"});  
			} 

			if(amendFileId2){
				//Attach to Property Record
					record.attach({
						record:{
							type:'file',
							id: amendFileId2
						},
						to:{
							type:rec.type,
							id:rec.id
						}
					});
			
				rec.setValue({fieldId:"custrecord_mw_last_listing_amd",value: "2"});
			  
			}
			else if (!amendFileId && !amendFileId2) {
				rec.setValue({fieldId:"custrecord_mw_last_listing_amd",value: "3"});  
			} 
				  
          
			

    		if(amendFileId)
    		{
    			var mailTOMLS = rec.getValue('custrecord_email_to_mls');
    			var subject1 = 'Listing Amendment MLS# ' +mlsNumber+ ' ' + dateFileFormatted;
    			var pdfDoc = file.load({
    			    id: amendFileId
    			});

				log.debug("pdfDoc", pdfDoc)
    			
    			//2019.11.05 - Update to check for T vs true;
    			if(mailTOMLS){
					log.debug("Email 1", "Email 1")
    				email.send({
    	                author: author,
    	                recipients: ["bryan.badilla@midware.net"],
    	                subject: subject1,
    	                body: 'Attached find a listing amendment.',
    	                attachments:[pdfDoc],
    	                relatedRecords: {
    	                	customRecord:{
    	                		id:rec.id,
    	                		recordType:rec.type
    	                	}
    	                }
    	            });
//    				email.send({
//    	                author: author,
//    	                recipients: 'bturk183@gmail.com',
//    	                subject: subject1,
//    	                body: 'Attached find a listing amendment.',
//    	                attachments:[pdfDoc]
//    	            });
    			}
    				
    		}
    		else
    		{
    			log.debug('DEBUG', 'Template Merging Falied ,  '+'Template Deleted  with id : '+tempRecordID);
    		}

			// ***********************************************************************************************************************************/
			// For MLS Region 2
			if(templateID)
    		{
    			var mailTOMLS = rec.getValue('custrecord_email_to_mls');
    			var subject1 = 'Listing Amendment MLS# ' +mlsNumber2+ ' ' + dateFileFormatted;
    			
    			//2019.11.05 - Update to check for T vs true;
    			if(mailTOMLS && amendFileId2){
					var pdfDoc = file.load({
						id: amendFileId2
					});
					log.debug("Email 2", "Email 2")

    				email.send({
    	                author: author,
    	                recipients: ["bryan.badilla@midware.net"],
    	                subject: subject1,
    	                body: 'Attached find a listing amendment.',
    	                attachments:[pdfDoc],
    	                relatedRecords: {
    	                	customRecord:{
    	                		id:rec.id,
    	                		recordType:rec.type
    	                	}
    	                }
    	            });
//    				email.send({
//    	                author: author,
//    	                recipients: 'bturk183@gmail.com',
//    	                subject: subject1,
//    	                body: 'Attached find a listing amendment.',
//    	                attachments:[pdfDoc]
//    	            });
    			}
    				
    		}
    		else
    		{
    			log.debug('DEBUG', 'Template Merging Falied ,  '+'Template Deleted  with id : '+tempRecordID);
    		}

			// ***********************************************************************************************************************************/

    	}
    	catch(ex)
    	{
    	    details = 'Exception in generateListAmendment: '+ex+', Message : '+ex.message+' Name : '+ex.name;
    	    log.debug('DEBUG', details);
    	    email.send({
                author: author,
                recipients: recipient,
                subject: subject,
                body: details,
			});
			
			rec.setValue({fieldId:"custrecord_mw_last_listing_amd",value: "3"});  
    	}
    	
    	log.audit('generateListAmendment', 'FINISH');
    }
    
    function generatePDF(builderId, subDivisionId, recId, fileName){

		var fileId = null;

    	var recProperty = record.load({
    		type:'customrecord_merge',
    		id:recId
    	});
    	
    	
    	var templateId = getTemplateId(builderId, subDivisionId);
		log.audit('templateId', templateId);

    	var fillableFields = pdffiller.getFillableFields({templateId:templateId});
    	var dataFields = fillFields(recProperty, fillableFields);
		var pdfId = pdffiller.fillPDFTemmplate(templateId, dataFields);
		  
		if (pdfId){
			var pdfContents = pdffiller.downloadFilledPDF(pdfId);
			var deletePDF = pdffiller.deletePDFTemplate(pdfId);
			
			checkForExistingFile(fileName);
			
			var filePDF = file.create({
				name: fileName,
				fileType: file.Type.PDF,
				contents:pdfContents,
				folder: pdffiller.getFolderId()
			});
			
			
			//save to NetSuite
			var fileId = filePDF.save();
		}
        return fileId;
    }
    
    
    function checkForExistingFile(fileName){
    	
    	var fileSearchObj = search.create({
    		   type: "file",
    		   filters:
    		   [
    		      ["folder","anyof","13017"], 
    		      "AND", 
    		      ["name","is",fileName]
    		   ],
    		   columns:
    		   [
    		      search.createColumn({
    		         name: "name",
    		         sort: search.Sort.ASC,
    		         label: "Name"
    		      }),
    		      search.createColumn({name: "folder", label: "Folder"}),
    		      search.createColumn({name: "documentsize", label: "Size (KB)"}),
    		      search.createColumn({name: "url", label: "URL"}),
    		      search.createColumn({name: "created", label: "Date Created"}),
    		      search.createColumn({name: "modified", label: "Last Modified"}),
    		      search.createColumn({name: "filetype", label: "Type"})
    		   ]
    		});
    		var searchResultCount = fileSearchObj.runPaged().count;
    		log.debug("fileSearchObj result count",searchResultCount);
    		
    		fileSearchObj.run().each(function(result){
    		   log.debug('file found with id ' + result.id);
    		   file.delete({
    			   id:result.id
    		   });
    		   return true;
    		});
    	
    }
    
    function fillFields(record, fillableFields) {
		var dataFields = {};
		var missingFields = [];
		
		for(var i=0;i<fillableFields.length;i++){
			var curField = JSON.parse(JSON.stringify(fillableFields[i]));
			var nsName = curField.name.toLowerCase();

			if(nsName.substring(0,2)=='nl'){
				nsName = nsName.substring(2);
			}
			
			//Check if the field is a NetSuite Field
			var nsField = record.getField(nsName);
			if(nsField){
				dataFields[curField.name] = record.getText(nsName);
			}else{
				//Check if the field maps to a function
				var functionResult = fieldToFunctionMap(record, curField.name);
				if (functionResult) {
					dataFields[ curField.name] = functionResult;
				}else{
					missingFields.push(curField.name);
				}
			}
		}
		
		if(missingFields.length>0){
			log.audit("Missing Fields: " , JSON.stringify(missingFields));
    	}

		log.debug("Data Fields", dataFields);
		log.debug("Missing Fields", missingFields);
		
		return dataFields;
		
	}
    
function fieldToFunctionMap(record, fieldName) {
    	
    	var fieldMap = {
    			'getMLSNumber':getMLSNumber,
    			'getExpirationDate' : getExpirationDate,
    			'getNewExpirationDate' : getNewExpirationDate,
    			'getSignatureDate' : getSignatureDate
    			
    	};

            if (typeof fieldMap[fieldName] !== "function") {
                return;
            }

            return fieldMap[fieldName](record); //getAddress(record);
	}

function getMLSNumber(record){
	//this is causing the error...properties are being submitted without an MLS number..
	//if that's acceptable, we'll need to convert the null to a blank string or other placeholder
	var mlsNumber = record.getValue("custrecord_temp_mls_number");
	
	if(mlsNumber){
		log.debug('getMLSNumber', mlsNumber);
		return mlsNumber.toString();
	}else{
		log.debug('getMLSNumber', 'No MLS Number!');
	}
	
}

function getExpirationDate(record){
	var expDate = record.getValue("custrecord_temp_exp_date");
	
	if(expDate){
		log.debug('getExpirationDate', expDate);
		return expDate;
	}else{
		log.debug('getExpirationDate', 'No Exp Date!');
	}
	
}

function getNewExpirationDate(record){
	var newExpDate = record.getValue("custrecord_temp_exp_date_new");
	
	if(newExpDate){
		log.debug('getNewExpirationDate', newExpDate);
		return newExpDate;
	}else{
		log.debug('getNewExpirationDate', 'No New Exp Date!');
	}
	
}

function getSignatureDate(record){
	var createdDate = record.getValue("custrecord_temp_date");
	
	if(createdDate){
		var sigDate = format.format({value: createdDate, type: format.Type.DATE});
		log.debug('getSignatureDate', sigDate);
		return sigDate;
	}else{
		log.debug('getSignatureDate', 'No Created Date!');
	}
}
    
function getTemplateId(builderId, subDivisionId){
	log.debug("getTemplateId","builderId: "+builderId);
	log.debug("getTemplateId","subDivisionId: "+subDivisionId);
	var templateId;

	var builder = search.lookupFields({
	    type: record.Type.CUSTOMER,
	    id: builderId,
	    columns: ['custentity_listing_amendment_template_id']
	});

	var subDivision = search.lookupFields({
		type: 'customrecord_subdivision',
		id: subDivisionId,
		columns: ['custrecord_subdiv_listamendment_tmplt_id']
	});

	var builderTemplateId = builder.custentity_listing_amendment_template_id;
	var subDivisionTemplateId = subDivision.custrecord_subdiv_listamendment_tmplt_id;

	if(subDivisionTemplateId){
		templateId =  subDivisionTemplateId;
	} else if(builderTemplateId){
		templateId = builderTemplateId;
	}else{
		templateId = DEFAULT_TEMPLATE_ID;
	}

	return templateId;
	
	// if(builderTemplateId){
	// 	log.debug("builderTemplateId","Builder Template Found: "+builderTemplateId);
	// 	return builderTemplateId;
	// }else{
	// 	log.debug("builderTemplateId","Builder Template NOT Found.  Using default: "+DEFAULT_TEMPLATE_ID);
	// 	return DEFAULT_TEMPLATE_ID;
	// }
}


    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} context
     * @param {Record} context.newRecord - New record
     * @param {Record} context.oldRecord - Old record
     * @param {string} context.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(context) {
		record.submitFields({type:context.newRecord.type,id : context.newRecord.id,values : {
			custrecord_is_changed: false,
			custrecord_email_to_mls: false
		}});
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
       afterSubmit: afterSubmit
    };
    
});