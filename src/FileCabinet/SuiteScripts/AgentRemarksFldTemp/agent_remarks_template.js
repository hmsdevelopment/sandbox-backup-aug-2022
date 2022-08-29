/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/currentRecord", "N/ui/dialog", "N/ui/message"], 


/**
 * @param{currentRecord} currentRecord
 * @param{dialog} dialog
 * @param{message} message
 */ function (currentRecord, dialog, message) {
	function setAgentRemarks(scriptContext){
		var showMe = message.create({
			title: "Heads Up",
			message: "Agent Remarks has been filled with a suggestion ",
			type: message.Type.INFORMATION,
			duration: 10000
		});
	
		var propertyName = scriptContext.currentRecord.getText({ fieldId: "name" });
		var agentRemark = scriptContext.currentRecord.getText({ fieldId: "custrecord_automated_agent_remark" });
		var listingType = scriptContext.currentRecord.getText({ fieldId: "custrecord_listing_type" });
		var mlsRegOne = scriptContext.currentRecord.getText({ fieldId: "custrecord15" });
		var mlsRegTwo = scriptContext.currentRecord.getText({ fieldId: "custrecord16" });
		var topLvlBuilder = scriptContext.currentRecord.getText({ fieldId: "custrecord_top_level_builder" });
		var builderRec = scriptContext.currentRecord.getField({fieldId: 'custrecord12'});
		var builderDiv = scriptContext.currentRecord.getText({ fieldId: "custrecord12" });
		var subDivName = scriptContext.currentRecord.getText({ fieldId: "custrecord_subdivision_text" });
		var floorPlan = scriptContext.currentRecord.getText({ fieldId: "custrecord_floorplan" });
		var contractApprovalDate = scriptContext.currentRecord.getText({ fieldId: "custrecord_contract_approval_date" });
		var lotNum = scriptContext.currentRecord.getText({ fieldId:"custrecord_lot_number"});

		log.debug({title:"BuildRec:", details: builderRec});
	
		if (agentRemark == "" || agentRemark == null) {
			var changeTo = "";
			if (listingType == "Market Home") {
				if (mlsRegOne == "Columbus OH" || mlsRegOne == "Dayton OH" || mlsRegTwo == "Columbus OH" || mlsRegTwo == "Dayton OH") {
					var inplace = topLvlBuilder;
					if (topLvlBuilder == "" || topLvlBuilder == null) {
						inplace = builderDiv;
					}
					changeTo = changeTo + "New construction by " + inplace + " in beautiful " + subDivName + " featuring the " + floorPlan + " plan. \n";
				}
	
				changeTo = changeTo + "Agents are encouraged and empowered to work directly with the builder without limitations. \n";
				changeTo = changeTo + "Purchase agreement will be written on " + topLvlBuilder + " documents.\n";
				log.audit("ListingType", "Market Home");
			} else if (listingType == "Comp Listing") {
				changeTo =
					changeTo +
					"This home was sold before it was entered into the MLS for comp purposes. Actual contract date: " +
					contractApprovalDate +
					". Agents are encouraged and empowered to work directly with the builder without limitations. *CTB* \n";
				if (mlsRegOne == "Columbus OH" || mlsRegOne == "Dayton OH" || mlsRegTwo == "Columbus OH" || mlsRegTwo == "Dayton OH") {
					var inplace = topLvlBuilder;
					if (topLvlBuilder == "" || topLvlBuilder == null) {
						inplace = builderDiv;
					}
					changeTo = changeTo + "New construction by " + inplace + " in beautiful " + subDivName + " featuring the " + floorPlan + " plan. \n";
				}
			}
			changeTo = changeTo + "Lot Number: " + lotNum + "\n";
			log.audit("Property Name", propertyName);
			log.debug("Output", changeTo);
			scriptContext.currentRecord.setText({
				fieldId:"custrecord_automated_agent_remark",
				text: changeTo
			});
			showMe.show();
		}
	}
	/**
	 * Function to be executed after page is initialized.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.currentRecord - Current form record
	 * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
	 *
	 * @since 2015.2
	 */
	
	function pageInit(scriptContext) {
		
	}

	/**
	 * Function to be executed when field is changed.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.currentRecord - Current form record
	 * @param {string} scriptContext.sublistId - Sublist name
	 * @param {string} scriptContext.fieldId - Field name
	 * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
	 * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
	 *
	 * @since 2015.2
	 */
	function fieldChanged(scriptContext) {
		//if(scriptContext.currentRecord.f)
		/*   var agentFld = currentRecord.getField({
            fieldId:'custrecord_agent_remarks'
        });
        log.debug("Agent Field:",agentFld); */
	}

	/**
	 * Validation function to be executed when record is saved.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.currentRecord - Current form record
	 * @returns {boolean} Return true if record is valid
	 *
	 * @since 2015.2
	 */
	function saveRecord(scriptContext) {
	setAgentRemarks(scriptContext);
	return true;
	}
	return {
		saveRecord: saveRecord,
		pageInit: pageInit,
		fieldChanged: fieldChanged
	};
});
