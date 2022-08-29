/*
This script processed BSR Confirmation Survey records that have been completed by the BSR.
*/

function processBSRConfirmation()
{
	var results = nlapiSearchRecord('customrecord_survey_bsr_confirmation', '111');
	
	for(var i=0; results != null && results.length > i; i++)
	{
		var survey = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var caseID = survey.getFieldValue('custrecord_bsr_confirmation_case');
		var confirmation = survey.getFieldValue('custrecord_showing_confirmation');
		var reason = survey.getFieldValue('custrecord_cancellation_reason');
		var revisedShowingDate = survey.getFieldValue('custrecord_revised_showing_date');
		
		var caseRecord = nlapiLoadRecord('supportcase', caseID);
		if(reason != null && reason != '')
		{
			var messages = caseRecord.getFieldValue('custevent_special_messages');
			var newMessage = messages + '  Reason for cancellation: ' + reason;
			caseRecord.setFieldValue('custevent_special_messages', newMessage);
		}
		
		if(revisedShowingDate != null && revisedShowingDate != '')
		{
			caseRecord.setFieldValue('custevent_showing_date_scheduled', revisedShowingDate);
			caseRecord.setFieldValue('custevent_bsr_conf_request_1', '');
			caseRecord.setFieldValue('custevent_bsr_conf_request_2', '');
			caseRecord.setFieldValue('custevent_bsr_conf_request_3', '');
		}
		
		else
		{
			caseRecord.setFieldValue('custevent_bsr_confirmation_received', 'T');
		}
		
		caseRecord.setFieldValue('custevent_showing_confirmation', confirmation);
		nlapiSubmitRecord(caseRecord);
		
		survey.setFieldValue('custrecord_processed', 'T');
		nlapiSubmitRecord(survey);
	}
}