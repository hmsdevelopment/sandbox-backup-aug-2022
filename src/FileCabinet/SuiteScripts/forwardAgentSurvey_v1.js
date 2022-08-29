function forwardAgentSurvey()
{
	var results = nlapiSearchRecord('customrecord_survey_agent', '126');

	for(var i=0; results != null && results.length > i; i++)
	{
		var id = results[i].getId();
		var survey = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var appointment = survey.getFieldValue('custrecord_survey_agent_case');
		var caseRecord = nlapiLoadRecord('supportcase', appointment);
		var agentName = caseRecord.getFieldValue('custevent_agent_for_ren');
		var brokerageName = caseRecord.getFieldValue('custevent_brokerage_for_ren');
		survey.setFieldValue('custrecord_agent_name', agentName);
		survey.setFieldValue('custrecord_agent_survey_brokerage', brokerageName);
		nlapiSubmitRecord(survey);
		var salesManagerEmail = caseRecord.getFieldValue('custevent_sales_mgr_email');
		var bsr = caseRecord.getFieldValue('custevent_builder_sales_rep_subd');
		var bsrRecord = nlapiLoadRecord('partner', bsr);
		var bsrEmail = bsrRecord.getFieldValue('email');
		var salesManagerID = bsrRecord.getFieldValue('custentity_immediate_supervisor');
		if(salesManagerEmail == '' || salesManagerEmail == null)
		{
			var salesManager = nlapiLoadRecord('partner', salesManagerID);
			salesManagerEmail = salesManager.getFieldValue('email');
		}
		var propertyId = caseRecord.getFieldValue('custevent_property');
		var property = nlapiLoadRecord('customrecord_property_record', propertyId);
		var houseNumber = property.getFieldValue('custrecord_house_number');
		var street = property.getFieldText('custrecord31');
		var showingDate = caseRecord.getFieldValue('custevent_showing_date_scheduled');
		var showingTime = caseRecord.getFieldValue('custevent_showing_time_scheduled');
		var subdivision = caseRecord.getFieldValue('custevent_subdivision_for_ren');
		var lot = property.getFieldValue('custrecord_lot_number');
		var subject = "Agent Feedback Received for " + houseNumber + " " + street + ", " + showingDate + ", " + showingTime + ", Subdivision: " + subdivision + ", Lot: " + lot;

		var records = new Object();
		records['recordtype'] = '43';
		records['record'] = id;

		var cc = new Array();
		cc[0] = salesManagerEmail;

		//var body = nlapiMergeRecord(7, 'customrecord_survey_agent', id);
		var emailMerger1 = nlapiCreateEmailMerger(65);//65 is converted type of 7
		emailMerger1.setCustomRecord('customrecord_survey_agent',id);
		var mergeResult1 = emailMerger1.merge();
		var emailBody1 = mergeResult1.getBody();
		nlapiSendEmail('3847', bsrEmail, subject, emailBody1, cc, null, records);

		survey.setFieldValue('custrecord_forwarded_to_builder', 'T');
		nlapiSubmitRecord(survey);
	}
}