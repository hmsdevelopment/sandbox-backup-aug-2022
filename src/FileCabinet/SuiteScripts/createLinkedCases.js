function createCopy()
{
	var makeCopy = nlapiGetFieldValue('custevent_create_copy');
	var currentID = nlapiGetFieldValue('id');
	var agent = nlapiGetFieldValue('custevent_caller_name');
	var inquiryType = nlapiGetFieldValue('category');
	var builderSuppliedLead = nlapiGetFieldValue('custevent_builder_lead');
	var linkedCase = nlapiGetFieldValue('custevent_linked_cases');

	if(makeCopy == 'T')
	{
		if(linkedCase == null || linkedCase == '')
		{
			var link = nlapiCreateRecord('customrecord_linked_cases');
			link.setFieldValue('custrecord_linked_case_agent', agent);
			var linkID = nlapiSubmitRecord(link);

			var currentRecord = nlapiLoadRecord('supportcase', currentID);
			currentRecord.setFieldValue('custevent_linked_cases', linkID);
			currentRecord.setFieldValue('custevent_create_copy', 'F');
			nlapiSubmitRecord(currentRecord, true);
		}

		else
		{
			var currentRecord = nlapiLoadRecord('supportcase', currentID);
			currentRecord.setFieldValue('custevent_create_copy', 'F');
			nlapiSubmitRecord(currentRecord, true);
		}

		var newRecord = nlapiCopyRecord('supportcase', currentID);
		newRecord.setFieldValue('custevent_property', '');
		/*newRecord.setFieldValue('custevent_showing_time_scheduled', '');
		newRecord.setFieldValue('custevent_showing_end_time', '');*/
		newRecord.setFieldValue('custevent_showing_assist_link', '');
		newRecord.setFieldValue('custevent_hms_copy_to_builder', '');
		//newRecord.setFieldValue('company', '');
		newRecord.setFieldValue('custevent_bsr_notify_sent', 'F');
		newRecord.setFieldValue('category', inquiryType);
		newRecord.setFieldValue('custevent_hms_last_ren_sent_date_time', '');
		newRecord.setFieldValue('custevent_add_new_agent', 'F');
		newRecord.setFieldValue('custevent_mw_new_linked_case', 'T');
		if (builderSuppliedLead == 'T')
		{
			newRecord.setFieldValue('custevent_builder_sales_rep_subd', '');
		}
		var newRecordID = nlapiSubmitRecord(newRecord, true, true);

		nlapiSetRedirectURL('record', 'supportcase', newRecordID, true);
	}
}

//need to create another custom record to create the link between the cases that share a builder...can be a process that runs after all linked cases are created to go through the linked cases and match up builders



