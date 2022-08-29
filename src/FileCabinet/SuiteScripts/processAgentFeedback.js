/*
This script processes Agent Feedback Survey records that have been completed by the agent.
*/

function processAgentFeedback()
{
	var results = nlapiSearchRecord('customrecord_survey_agent', '115');
	
	for(var i=0; results != null && results.length > i; i++)
	{
		var survey = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var caseID = survey.getFieldValue('custrecord_survey_agent_case');
		
		var caseRecord = nlapiLoadRecord('supportcase', caseID);
		
		caseRecord.setFieldValue('custevent_agent_survey_received', 'T');
		nlapiSubmitRecord(caseRecord);
		
		survey.setFieldValue('custrecord57', 'T');
		nlapiSubmitRecord(survey);
	}
}