function sendClosingNotification()
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	month++;
	var year = date.getFullYear();
	var dateFormatted = month + "/" + day + "/" + year;

	var searchID = nlapiGetContext().getSetting('SCRIPT', 'custscript_search_id')
	var results = nlapiSearchRecord('customrecord_property_record', searchID);

	for(var i=0; results != null && (i < results.length); i++)
	{
		var property = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var id = property.getFieldValue('id');
		var builderID = property.getFieldValue('custrecord12');
		var houseNumber = property.getFieldValue('custrecord_house_number');
		var street = property.getFieldValue('custrecord_street_text');
		var subdivision = property.getFieldValue('custrecord_subdivision_text');
		nlapiLogExecution('DEBUG', 'builderID ', 'builderID '+builderID);
		if(builderID)
		{
			var builder = nlapiLoadRecord('customer', builderID);
			var contactID = builder.getFieldValue('custentity_close_notification');
			nlapiLogExecution('DEBUG', 'contactID ', 'contactID '+contactID);
			var subject = makeSubject("Request for Closing Information of Market Home", houseNumber, street);
			nlapiLogExecution('DEBUG', 'Property ', id);
			nlapiLogExecution('AUDIT', 'Email Subject for property ' + id, subject);
			if(contactID)
			{
				var contact = nlapiLoadRecord('partner', contactID);
				var contactEmail = contact.getFieldValue('email');
				

				if(contactEmail != null && contactEmail != '')
				{
					var records = new Object();
					records['recordtype'] = 18;
					records['record'] = id;

					var cc = new Array();
					cc[0] = 'callcenter@hmsmarketingservices.com';

					//var body = nlapiMergeRecord(13, 'customrecord_property_record', id);
					var emailMerger1 = nlapiCreateEmailMerger(70);//70 is converted type of 13
					emailMerger1.setCustomRecord('customrecord_property_record',id);
					var mergeResult1 = emailMerger1.merge();
					var emailBody1 = mergeResult1.getBody();
					nlapiSendEmail('3847', contactEmail, subject, emailBody1, cc, null, records, null, true);
				}
			}
			else
			{
				var contactID = builder.getFieldValue('custentity_administrative_contact');
				if(contactID)
				{
					var contact = nlapiLoadRecord('partner', contactID);
					var contactEmail = contact.getFieldValue('email');	
					if(contactEmail != null && contactEmail != '')
					{
						var records = {};
						records['recordtype'] = 18;
						records['record'] = id;

						var cc = [];
						cc[0] = 'callcenter@hmsmarketingservices.com';

						//var body = nlapiMergeRecord(13, 'customrecord_property_record', id);
						var emailMerger1 = nlapiCreateEmailMerger(70);//70 is converted type of 13
						emailMerger1.setCustomRecord('customrecord_property_record',id);
						var mergeResult1 = emailMerger1.merge();
						var emailBody1 = mergeResult1.getBody();
						nlapiSendEmail('3847', contactEmail, subject, emailBody1, cc, null, records, null, true);
					}
				}
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