/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/url"],

function(url) {
   
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
    	form.clientScriptFileId = 139170;
    
    	var urlSelector = url.resolveScript({
    	    scriptId: 'customscript_hms_mls_entry_sl',
    	    deploymentId: 'customdeploy_hms_mls_entry_sl',
    	    params:{pid:context.newRecord.id}
    	});
    	
    	form.addButton({
    		id:'custpage_hms_mls_view',
    		label:'MLS Entry View',
    		functionName:'openMlsView("'+urlSelector+'")'
    	});

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
        //beforeSubmit: beforeSubmit,
       // afterSubmit: afterSubmit
    };
    
});
