/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/log", "N/search", "N/ui/dialog", "N/currentRecord", "N/record"],

function(log, search, dialog, currentRecord, record) {
	
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(context) {

    }
    
    function closeShowing(url){
    	window.open(url);
    }
    
    function cancelShowing(){
    	log.debug("Clicked", "Cancel!");
    	//alert("Cancel!");
    	log.debug("1");
    	var rec = currentRecord.get();
    	rec = record.load({
    		type:rec.type,
    		id:rec.id
    	});
    	//log.debug("rec", rec);
    	//console.log(rec);
    	log.debug("2");
    	var primaryBsrId = rec.getValue({fieldId:"custevent_builder_sales_rep_subd"});
    	var salesManagerId = rec.getValue("custevent7");
    	var builderId = rec.getValue("company");
    	
    	log.debug("primaryBsrId",primaryBsrId);
    	log.debug("salesManagerId",salesManagerId);
    	log.debug("builderId",builderId);
    	
    	log.debug("3");
    	var primaryBsr = search.lookupFields({
    	    type: search.Type.PARTNER,
    	    id: primaryBsrId,
    	    columns: ['entityid', 'email', 'custentity_opt_out_rtan', 'custentity_enable_two_way_sms']
    	});
    	log.debug("4");
    	log.debug("primaryBsr",primaryBsr);
    	
    	var salesManager;
    	if(salesManagerId){
    		salesManager = search.lookupFields({
        	    type: search.Type.PARTNER,
        	    id: salesManagerId,
        	    columns: ['entityid', 'email', 'custentity_opt_out_rtan', 'custentity_enable_two_way_sms']
        	});
    	}
    	
    	log.debug("salesManager",salesManager);
    	log.debug("5");
    	var builder = search.lookupFields({
    		type: search.Type.CUSTOMER,
    		id: builderId,
    		columns: ['custentity_copy_on_ren']
    	});
    	log.debug("builder",builder);
    	
    	var renId = builder.custentity_copy_on_ren.value;
    	var ren;
    	
    	if(renId){
    		ren = search.lookupFields({
        		type: search.Type.PARTNER,
        		id: renId,
        		columns: ['entityid', 'email', 'custentity_opt_out_rtan', 'custentity_enable_two_way_sms']
        	});
    		log.debug("ren",ren);
    	};
    	
    	var options = {
                title: 'Cancel Showing',
                message: '<h1>Cancel Showing</h1><p>This will cancel the showing and alert the following people</p><input type="checkbox" id="alertlist">Person 1</input>',
                buttons: [
                    { label: 'Proceed', value: 1 },
                    { label: 'Cancel', value: 2 }]
            };
    	
    	function success(result) { console.log('Success with value: ' + result); }
        function failure(reason) { console.log('Failure: ' + reason); }

        dialog.create(options).then(success).catch(failure);

    	
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     * @param {string} context.fieldId - Field name
     * @param {number} context.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} context.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(context) {

    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     * @param {string} context.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(context) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(context) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(context) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     * @param {string} context.fieldId - Field name
     * @param {number} context.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} context.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(context) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(context) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(context) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(context) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(context) {

    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        sublistChanged: sublistChanged,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete,
        saveRecord: saveRecord,
        cancelShowing: cancelShowing,
        closeShowing : closeShowing
    };
    
});
