/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/url", "N/redirect"],

function(url, redirect) {
	
	var SELECTOR_SCRIPT_ID = 'customscript_hms_appointment_sl';
	var SELECTOR_DEPLOYMNET_ID = 'customdeploy_hms_appointment_sl';
   
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
    	var rec = context.newRecord;
    	var form = context.form;
    	var stage = rec.getValue("stage");
    	
    	form.clientScriptFileId = 100212;
    	
    	if(stage != "CLOSED"){
    		
    		var urlSelector = url.resolveScript({
        	    scriptId: SELECTOR_SCRIPT_ID,
        	    deploymentId: SELECTOR_DEPLOYMNET_ID,
        	    params:{appt_id:context.newRecord.id}
        	});
    		
    		log.debug("url", urlSelector);
    		
    		//clickFunction = "window.open("
        	
        	form.addButton({
        		id:'custpage_hms_cancel_showing',
        		label:'Cancel Showing',
        		functionName:'closeShowing("'+urlSelector+'")'
        	});
    		
//    		form.addButton({
//    			id : "custpage_hms_cancel_showing",
//    			label : "Cancel Showing",
//    			functionName : "cancelShowing"
//    		});
    	}
    	log.debug("Stage", rec.getValue("stage") + " - " + rec.getText("stage"));

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

    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
