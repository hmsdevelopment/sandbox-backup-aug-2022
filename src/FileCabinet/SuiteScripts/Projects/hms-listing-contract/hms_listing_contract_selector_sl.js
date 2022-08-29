/**
 *  Author Brian Turk <bturk183@gmail.com>
 *  
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * 
 * ==========================================================
 * Change Log
 * ==========================================================
 * 
 * 2019.11.09 BT Clean-up.  Add trapping. 
 * 
 */
define(["N/ui/serverWidget", "N/ui/message", "N/search", "N/runtime", "N/redirect", "N/record", "N/http", "N/task", "N/error", "./hms_pdf_queue_manager"],

function(serverWidget, message, search, runtime, redirect, record, http, task, error, PDF_QM) {
	var SS_SCRIPT_ID = 'customscript_hms_listing_contract_ss';
	var SS_SCRIPT_DEPLOYMENT_ID = 'customdeploy_hms_listing_contract_ss';
	
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
    	log.audit("onRequest::Entry");

    	try{
    		PROPERTY_ID = context.request.parameters.custpage_propertyid;
    		log.debug("property", PROPERTY_ID);

            if(!PROPERTY_ID){
            	throw error.create({
            		name: 'MISSING_ARGUMENT',
            		message: "Valid Property ID is required for this function",
            		notifyOff: false
            	});
            }
        	
            if(context.request.method == http.Method.GET) handleGet(context);
            if(context.request.method == http.Method.POST) handlePost(context);
    		
    	}catch(e){
    		log.error({
		        title: e.name,
		        details: e.message
		    });
    	}
    }
    
    function handleGet(context){
    	var form = buildForm(context);
    	context.response.writePage(form);
    }
    
    function handlePost(context){
        log.audit("Form Posted", runtime.getCurrentUser().role);
    	
        var regionCount = context.request.getLineCount({
    	    group: 'region_list'
    	});
    	
    	for(var i=0; i<regionCount; i++){
    		var addRegion = context.request.getSublistValue({
    			group: 'region_list',
    		    name: 'includeregion',
    		    line: i
    		});
    		
    		var regionName = context.request.getSublistValue({
    			group: 'region_list',
    		    name: 'region',
    		    line: i
    		});
    		
    		if(addRegion=="T"){
    	        var regionId = context.request.getSublistValue({
        			group: 'region_list',
        		    name: 'regionid',
        		    line: i
        		});
    	        
    	        var mlsNumber = context.request.getSublistValue({
        			group: 'region_list',
        		    name: 'mlsnumber',
        		    line: i
        		});
    	        
                log.audit("Adding to Queue", runtime.getCurrentUser().role);
    	        PDF_QM.addToQueue("Listing Agreement", "customrecord_property_record", PROPERTY_ID, regionId, mlsNumber, true)
    	        log.debug("Add Region to Queue", regionName + "/"+regionId+"/"+mlsNumber);
    		}else{
    			log.debug("Skip Region", regionName);
    		}
    	}
    	
        log.audit("Initiating Queue Engine", runtime.getCurrentUser().role);
    	var scriptTask = task.create({taskType: task.TaskType.SCHEDULED_SCRIPT});

    	scriptTask.scriptId = SS_SCRIPT_ID;
    	scriptTask.deploymentId = SS_SCRIPT_DEPLOYMENT_ID;
    	
    	var scheduledScriptTaskId = scriptTask.submit();
    	
    	redirect.toRecord({
    	    type : 'customrecord_property_record', 
    	    id : PROPERTY_ID
    	});
    }
    
    function buildForm(context){
    	log.debug("buildForm :: Entry");
    	
    	var hasBuilderTemplate = false;
    	
        var recProperty = record.load({
    		type:'customrecord_property_record',
    		id:PROPERTY_ID
    	});
        
        var builderId = recProperty.getValue('custrecord12');  //BUILDER DIVISION
        var builderMessage;
        
        if(builderId){
        	var recBuilder = record.load({
        		type:'customer',
        		id:builderId
        	});
        	
        	var templateId = recBuilder.getValue('custentity_listing_agreement_template_id');
        	var builderName = recBuilder.getValue('companyname');
        	if(templateId){
        		hasBuilderTemplate = true;
        	}else{
        		builderMessage = '<b>' + builderName + '</b> does not have Listing Agreement Template.  Please reach out to Jeff';
        	}
        	
        }else{
        	builderMessage = 'No Builder selected, default template will be used.  Please reach out to Jeff';
        }
    	
    	var form = serverWidget.createForm({
            title : 'Generate Listing Agreements'
        });
    	
    	if(!hasBuilderTemplate)
    		form.addPageInitMessage({
    			type: message.Type.WARNING, 
    			message: builderMessage, 
    			duration: 0
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
            id : 'region_list',
            type : serverWidget.SublistType.LIST,
            label : 'Regions'
        });

        var fldIncludeRegion = sublist.addField({
            id : 'includeregion',
            label : 'Select',
            type : serverWidget.FieldType.CHECKBOX
        });

        sublist.addField({
            id : 'region',
            label : 'Region',
            type : serverWidget.FieldType.TEXT
        });
        
        sublist.addField({
            id : 'regionid',
            label : 'Region Id',
            type : serverWidget.FieldType.TEXT
        });
        
        sublist.addField({
            id : 'mlsnumber',
            label : 'MLS Number',
            type : serverWidget.FieldType.TEXT
        });
        
        form.addSubmitButton({
            label:'Generate Agreements'
         });

         fldIncludeRegion.updateDisplayType({displayType: serverWidget.FieldDisplayType.ENTRY});

         var region1Id = recProperty.getValue('custrecord15');
         var region2Id = recProperty.getValue('custrecord16');
 		
         var sublistIndex = 0;
         
 		if(region1Id){
 			sublist.setSublistValue({id:'includeregion',line:sublistIndex,value:'T'});
             sublist.setSublistValue({id:'regionid',line:sublistIndex,value:region1Id});
             sublist.setSublistValue({id:'region',line:sublistIndex,value:recProperty.getText('custrecord15')});
             sublist.setSublistValue({id:'mlsnumber',line:sublistIndex,value:recProperty.getText('custrecord_mls_number_region1')});
             sublistIndex++;
 		}
 		
 		if(region2Id){
 			sublist.setSublistValue({id:'includeregion',line:sublistIndex,value:'T'});
             sublist.setSublistValue({id:'regionid',line:sublistIndex,value:region2Id});
             sublist.setSublistValue({id:'region',line:sublistIndex,value:recProperty.getText('custrecord16')});
             sublist.setSublistValue({id:'mlsnumber',line:sublistIndex,value:recProperty.getText('custrecord_mls_number_region2')});
             sublistIndex++;
 		}
 		
 		log.debug("buildForm :: Exit");
 		
 		return form;
    }
    
    return {
        onRequest: onRequest
    };
    
});
