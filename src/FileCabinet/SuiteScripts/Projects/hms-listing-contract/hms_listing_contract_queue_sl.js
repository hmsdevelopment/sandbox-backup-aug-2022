/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * 
 * 
 * 2019.05.23 - Patch getExistingAgreement function.  See function for notes. 
 */
define(["N/ui/serverWidget", "N/search", "N/file", "N/record", "N/http", "N/error", "./hms_pdf_queue_manager"],

function(serverWidget, s, file, record, http, error, PDF_QM) {
	var PROPERTY_ID;
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	log.debug("onRequest::Entry");
    	
    	PROPERTY_ID = context.request.parameters.custpage_propertyid;

        if(!PROPERTY_ID){
            log.debug("Missing Argument", "Valid Property ID is required for this function");
            return;
        }
        
        handleRequest(context);
    }
    
    function handleRequest(context){
    	 
    	var recProperty = record.load({
     		type:'customrecord_property_record',
     		id:PROPERTY_ID
     	});
    	
    	var regions = [];
    	var regions = getPropertyRegions(recProperty);
    	
    	var form = buildForm(context);
    	form.clientScriptModulePath = 'SuiteScripts/Projects/hms-listing-contract/hms_listing_contract_cl.js';
    	
    	var sublist = form.getSublist({
    		id : 'listing_agreements'
    	});
    	for(var i = 0; i < regions.length; i++){
    		sublist.setSublistValue({id:'regionid',line:i,value:regions[i].id});
    		sublist.setSublistValue({id:'region',line:i,value:regions[i].name});
    		sublist.setSublistValue({id:'mlsnumber',line:i,value:regions[i].mlsnumber});
    		
    		var pdfStatus = getPDFStatus(PROPERTY_ID, regions[i].id);
    		
    		sublist.setSublistValue({id:'pdf_status',line:i,value:pdfStatus.pdf_status});
    		sublist.setSublistValue({id:'details',line:i,value:pdfStatus.details});
    	}
    	
    	context.response.writePage(form);
    }
    
    function getPDFStatus(propertyId, regionId){
    	var status = {};
    	var pdfQueueStatus = PDF_QM.checkRegionQueueStatus(propertyId, regionId);
    	var existingAgreement = getExistingAgreement(propertyId,regionId);
    	
    	log.debug("pdfQueueStatus",pdfQueueStatus);
    	log.debug("existingAgreement",existingAgreement);
    	if(pdfQueueStatus){
    		var queuedHtml = '<span style="color:#fff;background-color:#ff9800;display:inline-block;padding-left:8px;padding-right:8px;text-align:center;" >Queued</span>';
    		var processingHtml = '<span style="color:#fff;background-color:#4caf50;display:inline-block;padding-left:8px;padding-right:8px;text-align:center;" >Processing</span>';
    		status = {
    				pdf_status : '<div id="pdf_status">' + ((pdfQueueStatus.processing) ? processingHtml : queuedHtml) + '</div>',
    				details: (existingAgreement) ? "Updating Existing Agreement" : "New Listing Agreement"
    		};
    	}else if(existingAgreement){
    		status = {
    				"pdf_status" : '<a href="'+existingAgreement.url+'" target="_blank">' +existingAgreement.listing_agreement+'</a>' ,
    				"details" : "Last Modified " + existingAgreement.lastmodified
    		};
    	}else{
    		status = {
    				"pdf_status" : "Not Queued",
    				"details" : "No Existing Listing Agreement"
    		};
    	};
    	
    	log.debug("pdfQueueStatus", pdfQueueStatus);
    	return status;
    }
    
    function getPropertyRegions(recProperty){
    	var propertyRegions = [];
    	   	
    	if(recProperty.getValue('custrecord15')) {
    		propertyRegions.push({
    			"id" : recProperty.getValue('custrecord15'),
    			"name" : recProperty.getText('custrecord15'),
    			"mlsnumber" : recProperty.getValue('custrecord_mls_number_region1')
    		});
    	}
    	
    	if(recProperty.getValue('custrecord16')) {
    		propertyRegions.push({
    			"id" : recProperty.getValue('custrecord16'),
    			"name" : recProperty.getText('custrecord16'),
    			"mlsnumber" : recProperty.getValue('custrecord_mls_number_region2')
    		});
    	}
    	
    	return propertyRegions;
    	
    }
    
    function getExistingAgreement(propertyId, regionId){
      //2019.05.23 Patch Fix - Wrap Function with Error Trap and Return false on error.  Need to adjust existing file logic to fix
    	var existingRegions = [];
      
      try{
        var agreementSearch = s.create({
			   type: "customrecord_hms_listing_agreements",
			   filters:
			   [
			      ["custrecord_hms_la_property","is",propertyId],
			      "AND",
			      ["custrecord_hms_la_region","is",regionId],
			      "AND",
			      ["isinactive", "is", false]
			   ],
			   columns:
			   [
			      "created",
			      "lastmodified",
			      "custrecord_hms_la_listing_agreement"
			   ]
			});
		
		var agreementCount = agreementSearch.runPaged().count;
		
		if(agreementCount>0){
			var results = agreementSearch.run().getRange(0,1);
			var fileId = results[0].getValue("custrecord_hms_la_listing_agreement");
			var fileLA = file.load({id:fileId});
			
			return{
				"id":results[0].id,
				"created":results[0].getValue("created"),
				"lastmodified":results[0].getValue("lastmodified"),
				"listing_agreement":fileLA.name,
				"url":fileLA.url
			};
		}else{
			return false;
		}
        
      }catch(e){
        log.error("Error:getExistingAgreement", e);
        return false;
      }
		
    }
    
    function buildForm(context){
    	
    	log.debug("buildForm :: Entry");
    	
        var recProperty = record.load({
    		type:'customrecord_property_record',
    		id:PROPERTY_ID
    	});
    	
    	var form = serverWidget.createForm({
            title : 'Listing Agreements'
        });
    	
        var fgGenerate = form.addFieldGroup({
            id : 'generategroup',
            label : 'Generate'
        });

        fgGenerate.isSingleColumn = true;
        fgGenerate.isBorderHidden = true;

        var fldPropertyId = form.addField({
           id:'custpage_propertyid',
           label:'Property ID',
           type: serverWidget.FieldType.TEXT
        });

        fldPropertyId.updateDisplayType({
           displayType:serverWidget.FieldDisplayType.HIDDEN
        });

        fldPropertyId.defaultValue = PROPERTY_ID;

        var sublist = form.addSublist({
            id : 'listing_agreements',
            type : serverWidget.SublistType.LIST,
            label : 'Listing Agreements'
        });
        
        sublist.addField({
            id : 'regionid',
            label : 'Region ID',
            type : serverWidget.FieldType.TEXT
        }).updateDisplayType({
           displayType:serverWidget.FieldDisplayType.HIDDEN
        });;

        sublist.addField({
            id : 'region',
            label : 'Region',
            type : serverWidget.FieldType.TEXT
        });
        
        sublist.addField({
            id : 'mlsnumber',
            label : 'MLS Number',
            type : serverWidget.FieldType.TEXT
        });
        
        sublist.addField({
            id : 'pdf_status',
            label : 'Status',
            type : serverWidget.FieldType.TEXT
        });
        
        sublist.addField({
            id : 'details',
            label : 'Details',
            type : serverWidget.FieldType.TEXT
        });
 		
 		log.debug("buildForm :: Exit");
 		
 		return form;
    }

    return {
        onRequest: onRequest
    };
    
});
