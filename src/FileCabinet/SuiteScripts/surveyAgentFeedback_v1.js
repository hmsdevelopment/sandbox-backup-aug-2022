function surveyAgentFeedback()
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	month++;
	var year = date.getFullYear();
	var dateFormatted = month + "/" + day + "/" + year;

	var results = nlapiSearchRecord('supportcase', '113');

	for(var i=0; results != null && results.length > i; i++)
	{
		var appointment = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var id = appointment.getFieldValue('id');
		var propertyId = appointment.getFieldValue('custevent_property');
		var propertyText = appointment.getFieldText('custevent_property');
		var index = propertyText.indexOf("|");
		var builder = propertyText.substring(index);
		var callerType = appointment.getFieldValue('custevent_caller_type');
        var reasonForCall = appointment.getFieldValue('category');
		var bsrEmail;
		var showingDate = appointment.getFieldValue('custevent_showing_date_scheduled');
		var showingTime = appointment.getFieldValue('custevent_showing_time_scheduled');
		var request1 = appointment.getFieldValue('custevent_agent_survey_1');
		var request2 = appointment.getFieldValue('custevent_agent_survey_2');
		var request3 = appointment.getFieldValue('custevent_agent_survey_3');
		var sender = appointment.getFieldValue('custevent_send_as_email_user');

		if(sender == '' || sender == null)
		{
			sender = '3847';
		}

		var agent = appointment.getFieldValue('custevent_caller_name');
		var agentEmail = appointment.getFieldValue('custevent_caller_email');
		var bsrID = appointment.getFieldValue('custevent_builder_sales_rep_subd');
		if(bsrID != null && bsrID != '' && propertyId != null && propertyId != '' && agentEmail != null && agentEmail != '' && callerType == '2' && reasonForCall == '2')
		{
			var bsrRecord = nlapiLoadRecord('partner', bsrID);
			bsrEmail = bsrRecord.getFieldValue('email');

			var property = nlapiLoadRecord('customrecord_property_record', propertyId);
			var houseNumber = property.getFieldValue('custrecord_house_number');
			var street = property.getFieldText('custrecord31');
			var subdivision = property.getFieldText('custrecordcustrecordsubdname');
			var lot = property.getFieldText('custrecord_lot_number');
			var subject = "Feedback for " + houseNumber + " " + street + ", " + showingDate + ", " + showingTime;

			var records = new Object();
			records['activity'] = id;

			var cc = new Array();
			cc[0] = 'callcenter@hmsmarketingservices.com';

			//var body = nlapiMergeRecord(3, 'supportcase', id);
			var emailMerger1 = nlapiCreateEmailMerger(72);//72 is converted type of 3
			emailMerger1.setSupportCase(id);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
			nlapiSendEmail(sender, agentEmail, subject, emailBody1, cc, null, records);

			if(request1 == null || request1 == '')
			{
				appointment.setFieldValue('custevent_agent_survey_1', dateFormatted);
				nlapiSubmitRecord(appointment);
			}

			else if(request2 == null || request2 == '')
			{
				appointment.setFieldValue('custevent_agent_survey_2', dateFormatted);
				nlapiSubmitRecord(appointment);
			}

			else if(request3 == null || request3 == '')
			{
				appointment.setFieldValue('custevent_agent_survey_3', dateFormatted);
				nlapiSubmitRecord(appointment);
			}
		}
	}

	/*if(results != null)
	{
		nlapiSendEmail(sender, 'jmcdonald@hmsmarketingservices.com', 'Agent Survey Sent', 'Agent Survey script has successfully run');
	}*/
}