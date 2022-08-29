/*
This script executes a search which returns appointments that match the following criteria:
	1)  The 3rd request for showing confirmation was sent out yesterday
	2)  No response has been received
	
	When these appointments are found, an email is sent to the sales manager notifying him/her of this information.
*/

function agentFeedbackNoResponse()
{
	var today = new Date();
	var month = today.getMonth();
	month = month + 1;
	var day = today.getDate();
	var year = today.getFullYear();
	var dateFormatted = month + '/' + day + '/' + year;

	var results = nlapiSearchRecord('supportcase', '116');
	
	for(var i=0; results != null && results.length > i; i++)
	{
		var appointment = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var id = appointment.getFieldValue('id');
		var propertyId = appointment.getFieldValue('custevent_property');
		var salesManagerEmail = appointment.getFieldValue('custevent_sales_mgr_email');
		var bsr = appointment.getFieldValue('custevent_builder_sales_rep_subd');
		var bsrRecord = nlapiLoadRecord('partner', bsr);
		var bsrEmail = bsrRecord.getFieldValue('email');
		var divisionManagerEmail = appointment.getFieldValue('custeventdivision_mgr_email');
		var DMOptOut = appointment.getFieldValue('custevent_dm_opt_out');
		
		if(salesManagerEmail != null && salesManagerEmail != '')
		{
			var showingDate = appointment.getFieldValue('custevent_showing_date_scheduled');
			var showingTime = appointment.getFieldValue('custevent_showing_time_scheduled');

			var property = nlapiLoadRecord('customrecord_property_record', propertyId);
			var houseNumber = property.getFieldValue('custrecord_house_number');
			var street = property.getFieldText('custrecord31');
			var subdivision = property.getFieldText('custrecordcustrecordsubdname');
			var lot = property.getFieldText('custrecord_lot_number');
			var subject = "No Reply to Agent Feedback for " + houseNumber + " " + street + ", " + showingDate + ", " + showingTime;
		
			var records = new Object();
			records['activity'] = id;

			var n = 0;
			var cc = new Array();
			cc[n] = salesManagerEmail;
			n++;
			
			if(divisionManagerEmail != null && divisionManagerEmail != '' && DMOptOut == 'F')
			{
				cc[n] = divisionManagerEmail;
				n++;
			}

			//var bcc = 'mhulshult@gmail.com';
		
			//var body = nlapiMergeRecord(6, 'supportcase', id);
			//nlapiSendEmail('3847', bsrEmail, subject, body.getValue(), cc, null, records);
			var emailMerger = nlapiCreateEmailMerger(6);
			emailMerger.setSupportCase(id);
			var mergeResult = emailMerger.merge();
			var emailBody = mergeResult.getBody();
			nlapiSendEmail('3847', bsrEmail, subject, emailBody, cc, null, records);
			
			
			appointment.setFieldValue('custevent_no_response_agent', 'T');
			nlapiSubmitRecord(appointment);
		}
	}
}
