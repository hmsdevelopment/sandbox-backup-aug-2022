/*
This script executes a search which returns appointments that match the following criteria:
	1)  The 3rd request for showing confirmation was sent out yesterday
	2)  No response has been received

	When these appointments are found, an email is sent to the sales manager notifying him/her of this information.
*/

function bsrConfirmationNoResponse()
{
	var today = new Date();
	var month = today.getMonth();
	month = month + 1;
	var day = today.getDate();
	var year = today.getFullYear();
	var dateFormatted = month + '/' + day + '/' + year;

	var results = nlapiSearchRecord('supportcase', '112');

	for(var i=0; results != null && results.length > i; i++)
	{
		var appointment = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var id = appointment.getFieldValue('id');
		var propertyId = appointment.getFieldValue('custevent_property');
		var salesManagerEmail = appointment.getFieldValue('custevent_sales_mgr_email');
		var divisionManagerEmail = appointment.getFieldValue('custeventdivision_mgr_email');
		var DMOptOut = appointment.getFieldValue('custevent_dm_opt_out');
		var subdivision = appointment.getFieldValue('custevent_subdivision_for_ren');
		if(salesManagerEmail != null && salesManagerEmail != '')
		{
			//var salesManager = nlapiLoadRecord('partner', salesManagerId);
			//var salesManagerEmail = salesManager.getFieldValue('email');
			var showingDate = appointment.getFieldValue('custevent_showing_date_scheduled');
			var showingTime = appointment.getFieldValue('custevent_showing_time_scheduled');

			var property = nlapiLoadRecord('customrecord_property_record', propertyId);
			var houseNumber = property.getFieldValue('custrecord_house_number');
			var street = property.getFieldText('custrecord31');
			var lot = property.getFieldValue('custrecord_lot_number');
			var subject = "No Reply to Showing Confirmation for " + houseNumber + " " + street + ", " + showingDate + ", " + showingTime + ", Subdivision: " + subdivision + ", Lot: " + lot;

			var records = new Object();
			records['activity'] = id;

			var n=0;
			var cc = new Array();
			cc[n] = 'callcenter@hmsmarketingservices.com';
			n++;


			if(divisionManagerEmail != null && divisionManagerEmail != '' && DMOptOut == 'F')
			{
				cc[n] = divisionManagerEmail;
				n++;
			}
			
			
			var emailMerger1 = nlapiCreateEmailMerger(56);//56 is converted type of 5
			emailMerger1.setSupportCase(id);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
			//var body = nlapiMergeRecord(5, 'supportcase', id);
			nlapiSendEmail('3847', salesManagerEmail, subject, emailBody1, cc, null, records);

			appointment.setFieldValue('custevent_no_response_bsr', 'T');
			nlapiSubmitRecord(appointment);
		}
	}
}
