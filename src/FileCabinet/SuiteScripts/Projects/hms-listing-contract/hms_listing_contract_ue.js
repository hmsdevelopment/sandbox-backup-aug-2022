/**
 *  Author Brian Turk <bturk183@gmail.com>
 *  
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * 
 * 
 * ==========================================================
 * Change Log
 * ==========================================================
 * 
 * 2019.11.09 BT Clean-up.  Add trapping. 
 * 
 */

define(["N/url", "N/redirect"],

function(url, redirect) {
	
	var SELECTOR_SCRIPT_ID = 'customscript_hms_lc_selector_sl';
	var SELECTOR_DEPLOYMNET_ID = 'customdeploy_hms_lc_selector_sl';
    
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
    	log.audit({title:"beforeLoad-start", details:"type: "+ context.type});
    	
    	try{
        	addContractButton(context);
    	}catch(e){
    		 log.error({
    		        title: "Error Adding Button",
    		        details: e.name+ " - " + e.message
    		    });
    	}
    }
    
    function afterSubmit(context){
    	log.audit({title:"afterSubmit", details:"type: "+ context.type});
    	
    	var enteredMLS = context.newRecord.getValue({fieldId: 'custrecord_entered_mls'});
    	log.debug('enteredMLS',enteredMLS);
    	
//    	if(enteredMLS){
//    		redirect.toSuitelet({
//    		    scriptId: SELECTOR_SCRIPT_ID,
//    		    deploymentId: SELECTOR_DEPLOYMNET_ID,
//    		    parameters: {'custpage_propertyid':context.newRecord.id} 
//    		});
//    	}
    }
    
    function addContractButton(context){
    	var form =  context.form;

    	var urlSelector = url.resolveScript({
    	    scriptId: SELECTOR_SCRIPT_ID,
    	    deploymentId: SELECTOR_DEPLOYMNET_ID,
    	    params: {'custpage_propertyid':context.newRecord.id}
    	});
    	
    	form.addButton({
    		id:'custpage_btn_gen_listing_contract',
    		label:'Create Listing Contract',
    		functionName:"window.open('"+urlSelector+"');"
    	});
    }

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };
    
});