function sendSalesNotificationWednesday()
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	month++;
	var year = date.getFullYear();
	var dateFormatted = month + "/" + day + "/" + year;

	var searchID = nlapiGetContext().getSetting('SCRIPT', 'custscriptsales_notification_search_id')
	var results = nlapiSearchRecord('customrecord_property_record', searchID);

	for(var i=0; results != null && results.length > i; i++)
	{
		var property = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var id = property.getFieldValue('id');
		var builderID = property.getFieldValue('custrecord12');
		var houseNumber = property.getFieldValue('custrecord_house_number');
		var street = property.getFieldValue('custrecord_street_text');
		var subdivision = property.getFieldValue('custrecord_subdivision_text');
		var builder = nlapiLoadRecord('customer', builderID);
		var contactID = builder.getFieldValue('custentity_sales_notification_contact');
		if (contactID)
		{
			var contact = nlapiLoadRecord('partner', contactID);
			var contactEmail = contact.getFieldValue('email');
			var subject = makeSubject("Request Sale of a Market Home", houseNumber, street);

			nlapiLogExecution('AUDIT', 'Email Subject for property ' + id, subject);

			if(contactEmail != null && contactEmail != '')
			{
				var records = new Object();
				records['recordtype'] = 18;
				records['record'] = id;

				var cc = new Array();
				cc[0] = 'callcenter@hmsmarketingservices.com';

				//var body = nlapiMergeRecord(9, 'customrecord_property_record', id);
				var emailMerger1 = nlapiCreateEmailMerger(71);//71 is converted type of 9
				emailMerger1.setCustomRecord('customrecord_property_record',id);
				var mergeResult1 = emailMerger1.merge();
				var emailBody1 = mergeResult1.getBody();
				nlapiSendEmail('3847', contactEmail, subject, emailBody1, cc, null, records, null, true);

				property.setFieldValue('custrecord_sales_notification_sent', dateFormatted);
				nlapiSubmitRecord(property);
			}
		}
	}
}

function makeSubject(pSubjectBaseString, pHouseNumber, pStreetName){

	var subject = pSubjectBaseString;

	if (pHouseNumber){

		subject += ' - ' + pHouseNumber;
		if (pStreetName){
			subject += ' ' + pStreetName;
		}
	}
	else {
		if (pStreetName){
			subject += ' - ' + pStreetName;
		}
	}

	return subject
}