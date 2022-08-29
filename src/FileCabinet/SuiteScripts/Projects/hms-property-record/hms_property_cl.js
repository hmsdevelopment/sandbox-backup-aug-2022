/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/ui/message", "N/ui/dialog"],

function(message, dialog) {
	
	var sampleMap = {
			ClosingAmount : 'custrecord_estimated_closing_price',
			AgreementWritten : 'custrecord_contract_approval_date',
			ClosingDatePlanned : 'custrecord_estimated_closing_date',
			ClosingDateActual : 'custrecord_actual_closing_date',
			Customer1 : 'custrecord_buyers_last_name',
			City : 'custrecord_city',
			State : 'custrecord_state',
			Zip : 'custrecord_zip_code'
	};
    
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
    	
    	if(context.fieldId == 'custrecord_sale_notes'){
    		var dlgOptions = {
    				title:"Parse Sale Notes",
    				message: "Parse Sale Notes?",
    				buttons: [{label:"Yes", value: 1},{label:"No", value: 0}]
    		};
    		
    		function success(result) {
    			if(result==1){
    				parseSaleNotes(context.currentRecord);
    			}
    		}
            function failure(reason) { console.log('Parse Dialog Failure: ' + reason); }

            dialog.create(dlgOptions).then(success).catch(failure);
    		
    	};

    }
    
    function parseSaleNotes(rec){
    	var rawSaleNotes = rec.getValue("custrecord_sale_notes");
    	var lineBreakCount = (rawSaleNotes.match(/\n/g)||[]).length;
    	var mapped = 0;
    	var missingMap = 0;
    	var duplicates = 0;
    	var missingValue = 0;
    	var objMapped = {}
    	
    	if(lineBreakCount>0){
    		var saleNoteLines = rawSaleNotes.split("\n");
    		for(var i=0; i<saleNoteLines.length;i++){
    			var curSaleNote = saleNoteLines[i].split(" : ");
    			var curNoteField = curSaleNote[0].trim();
    			var curNoteValue = curSaleNote[1];
    			
    			//console.log("Field: " + curNoteField + "  =   " + curNoteValue);
    			
    			if(sampleMap.hasOwnProperty(curNoteField)){
    				nsField = sampleMap[curNoteField];
    				console.log("Mapping " + curNoteField + " ===> " + nsField);
    				
    				if(curNoteValue){
    					try{
    						
    						if(!objMapped[curNoteField]){
    							rec.setText({
        							fieldId:nsField,
        							text:curNoteValue
        						});
    							objMapped[curNoteField]=true;
    							mapped++;
    						}else{
    							duplicates++;
    						};
    						
    					}catch(e){
    						console.log(e);
    					};
    				}else{
    					missingValue++;
					};
    			}else{
    				missingMap++;
    				//console.log("Unable to find mapping for Sale Note field: " + curNoteField);
    			};
    		};
    		
    		console.log("============================================");
    		console.log("===========      SUMMARY     ===============");
    		console.log("============================================");
    		console.log("");
    		
    		console.log("Lines Parsed: " + lineBreakCount);
    		console.log("Data Mapped: " + mapped);
    		console.log("Duplicates: " + duplicates);
    		console.log("No Mapping: " + missingMap);
    		console.log("Missing Value: " + missingValue);
    		console.log("");
    		console.log("============================================");
    		
    		for(var nf in sampleMap){
    			if(!objMapped[nf]){
    				console.log("MAP Expects Field: " + nf);
    			};
    		}
    		
    		console.log("");
    		console.log("============================================");
    		console.log("============================================");
    		
    	}else{
    		alert('Unable to Parse: No Line Breaks Found.');
    	};
    	
    	
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
//        pageInit: pageInit,
        fieldChanged: fieldChanged,
//        postSourcing: postSourcing,
//        sublistChanged: sublistChanged,
//        lineInit: lineInit,
//        validateField: validateField,
//        validateLine: validateLine,
//        validateInsert: validateInsert,
//        validateDelete: validateDelete,
//        saveRecord: saveRecord
    };
    
});
