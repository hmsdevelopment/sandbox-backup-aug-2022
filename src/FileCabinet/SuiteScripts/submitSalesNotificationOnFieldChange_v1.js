function onFieldChanged(fieldName, fieldType)
{
	if(fieldName == 'custpage_builder' || fieldName == 'custpage_subdivision')
	{
		var builder = request.getParameter('custpage_builder');
		var subdivision = request.getParameter('custpage_subdivision');
		var property = request.getParameter('custpage_property');
		if(builder != null && builder != '' && (subdivision ==null || subdivision == ''))
		{
			var builderForm = nlapiCreateForm('Submit Sales Notification');
			var builderField = builderForm.addField('custpage_builder', 'text', 'Please enter your builder number');
			var subdivisionField = builderForm.addField('custpage_subdivision', 'select', 'Subdivision');
			subdivisionField.addSelectOption('-2', '', true);

			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builder);
			filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

			var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
			if(results == null)
			{
				subdivisionField.addSelectOption('-1', 'No Subdivisions Found for this Builder Number');
			}
			else
			{
				for(var i=0; results != null && results.length > i; i++)
				{
					var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
					var subdivisionName = subdivisionRecord.getFieldValue('custrecord_subdivision_id');
					subdivisionField.addSelectOption(results[i].getId(), subdivisionName);
				}
			}
			builderForm.setFieldValues({custpage_builder:builder});
			builderForm.addSubmitButton('Confirm Subdivision');
			response.writePage(builderForm);
		}

		else if(subdivision != null && subdivision != '' && (property == null || property == ''))
		{
			var subdivisionForm = nlapiCreateForm('Submit Sales Notification');
			var builderField = subdivisionForm.addField('custpage_builder', 'text', 'Please enter your builder number');
			var subdivisionField = subdivisionForm.addField('custpage_subdivision', 'select', 'Subdivision');
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builder);
			filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

			var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
			if(results == null)
			{
				subdivisionField.addSelectOption('-1', 'No Subdivisions Found for this Builder Number');
			}
			else
			{
				for(var i=0; results != null && results.length > i; i++)
				{
					var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
					var subdivisionName = subdivisionRecord.getFieldValue('custrecord_subdivision_id');
					subdivisionField.addSelectOption(results[i].getId(), subdivisionName);
				}
			}
			var propertyField = subdivisionForm.addField('custpage_property', 'select', 'Property');
			propertyField.addSelectOption('-2', '', true);
			var lotNumber = subdivisionForm.addField('custpage_lot_number', 'text', 'Lot Number');
			var fileField = subdivisionForm.addField('custpage_contract_file', 'file', 'Upload Closing Document Here');
		fileField.setMandatory(true);

		//Add field for Financing Type at time of sale, and create a dropdown list so they're able to select the entry
			//Without the list, they would have to type in a status without choices to choose from
			var financingType = subdivisionForm.addField('custpage_financing', 'select', 'Financing Type');
			financingType.addSelectOption('13','1031E');
			financingType.addSelectOption('4','Assumable');
			financingType.addSelectOption('11','Cash');
			financingType.addSelectOption('1','Conventional');
			financingType.addSelectOption('9','Exchange');
			financingType.addSelectOption('2','FHA');
			financingType.addSelectOption('14','FMHA');
			financingType.addSelectOption('15','ICON');
			financingType.addSelectOption('16','IHFA');
			financingType.addSelectOption('3','Land Contract');
			financingType.addSelectOption('10','Lease Option');
			financingType.addSelectOption('7','Lease/Purchase Option');
			financingType.addSelectOption('18','Other');
			financingType.addSelectOption('5','Owner');
			financingType.addSelectOption('17','RHS');
			financingType.addSelectOption('8','USDA');
			financingType.addSelectOption('12','USDAR');
			financingType.addSelectOption('6','VA');


			//Add in the rest of the fields
			var actualClosingDate = subdivisionForm.addField('custpage_closingdate', 'date', 'Actual Closing Date');
			//var cancelledDelayedNote = subdivisionForm.addField('custpage_cancelleddelayed', 'label', 'Was the closing ');
			var cancelledDelayed = subdivisionForm.addField('custpage_cancelleddelayedlist', 'select', 'Was the closing cancelled or delayed?');
			cancelledDelayed.addSelectOption('3', '');
			cancelledDelayed.addSelectOption('1', 'Cancelled');
			cancelledDelayed.addSelectOption('2', 'Delayed');
			var updatedClosingDate = subdivisionForm.addField('custpage_updatedclosingdate', 'date', 'Updated Closing Date');
			var closingPrice = subdivisionForm.addField('custpage_closingprice', 'currency', 'Closing Price');
			var loanAmount = subdivisionForm.addField('custpage_loanamount', 'currency', 'Loan Amount');
			var closingNotes = subdivisionForm.addField('custpage_closingnotes', 'textarea', 'Closing Notes');

			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecordcustrecordsubdname', null, 'is', subdivision);
			filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

			var results = nlapiSearchRecord('customrecord_property_record', null, filters);
			if(results == null)
			{
				propertyField.addSelectOption('-1', 'Builder Number Not Found');
			}
			else
			{
				for(var i=0; results != null && results.length > i; i++)
				{
					var propertyRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
					var propertyName = propertyRecord.getFieldValue('custrecord_simple_name');
					propertyField.addSelectOption(results[i].getId(), propertyName);
				}
			}
			subdivisionForm.setFieldValues({custpage_builder:builder,custpage_subdivision:subdivision});
			subdivisionForm.addSubmitButton('Submit Closing Information');
			response.writePage(subdivisionForm);
		}

		else if(property != null && property != '')
		{
			//This portion of the script is executed when the page is submitted via the "Submit" button

			var date = new Date();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var year = date.getFullYear();
			var dateFormatted = month + "/" + day + "/" + year

			//Retrieve all the information entered by the user
			var property = request.getParameter("custpage_property");
			var file = request.getFile("custpage_contract_file");
			var financingTypeValue = request.getParameter("custpage_financing");
			var updatedClosingDateValue = request.getParameter("custpage_updatedclosingdate");
			var cancelledDelayedValue = request.getParameter("custpage_cancelleddelayedlist");
			var closingDateValue = request.getParameter("custpage_closingdate");
			var closingPriceValue = request.getParameter("custpage_closingprice");
			var loanAmountValue = request.getParameter("custpage_loanamount");
			var closingNotesValue = request.getParameter("custpage_closingnotes");

			// set the folder where this file will be added. In this case, 41 is the internal ID
				// of the Sales Contracts folder in the NetSuite file cabinet
			file.setFolder(41);

			// now create file and upload it to the file cabinet.
			var fileID = nlapiSubmitFile(file);

			// now attach file to property record
			nlapiAttachRecord("file", fileID, "customrecord_property_record", property);

			//Here we set field values on the property record
			var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
			propertyRecord.setFieldValue('custrecord_actual_closing_date', closingDateValue);
			propertyRecord.setFieldValue('custrecord50', closingPriceValue);
			propertyRecord.setFieldValue('custrecord_loan_amount', loanAmountValue);
			propertyRecord.setFieldValue('custrecord_financing_type', financingTypeValue);
			propertyRecord.setFieldValue('custrecord_hud1', fileID);
			propertyRecord.setFieldValue('custrecord_closing_notes', closingNotesValue);
			propertyRecord.setFieldValue('custrecord_hud_received_date', dateFormatted);

			if(cancelledDelayedValue == '2')
			{
				propertyRecord.setFieldValue('custrecord_estimated_closing_date', updatedClosingDateValue);
			}
			else if(cancelledDelayedValue == '1')
			{
				propertyRecord.setFieldValue('custrecord_property_status', '1');
			}
			var mlsRegion1 = propertyRecord.getFieldValue('custrecord15');
			var mlsRegion2 = propertyRecord.getFieldValue('custrecord16');
			var mlsNumber1 = propertyRecord.getFieldValue('custrecord_mls_number_region1');
			var mlsNumber2 = propertyRecord.getFieldValue('custrecord_mls_number_region2');
			var propName = propertyRecord.getFieldValue('name');
			nlapiSubmitRecord(propertyRecord);

			//Now we will send the notification to HMS personnel
			var attachment = nlapiLoadFile(fileID);
			var subject = 'Closing of Market Home Submitted: ' + propName;
			//The recipient gets set using a paramter on the deployment of the script.  Open the script in NetSuite, click on 'Deployments',
				//then the 'Parameters' tab to find or set this value
			var recipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_closing_recipient');

			var records = new Object();
			records['recordtype'] = '18';
			records['record'] = property;

			//var body = nlapiMergeRecord(12, 'customrecord_property_record', property);
			var emailMerger1 = nlapiCreateEmailMerger(60);//60 is converted type of 12
			emailMerger1.setCustomRecord('customrecord_property_record',property);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
			nlapiSendEmail('3847', recipient, subject, emailBody1, null, null, records, attachment);

			var confirmationForm = nlapiCreateForm('Confirmation');
			var confirmationField = confirmationForm.addField('custpage_confirmation', 'label', 'Thank you for submitting Closing  Information');
			confirmationField.setDisplayType('disabled');
			response.writePage(confirmationForm);
		}
	}
}