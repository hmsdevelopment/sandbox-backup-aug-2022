//This is copy of script 51
function sendSalesNotification()
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	month++;
	var year = date.getFullYear();
	var dateFormatted = month + "/" + day + "/" + year;

	var results = nlapiSearchRecord('customrecord_property_record', '181');

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
		if(contactID)
		{
			var contact = nlapiLoadRecord('partner', contactID);
			var contactEmail = contact.getFieldValue('email');
		}
		else
		{
			var contactID = builder.getFieldValue('custentity_administrative_contact');
			if(contactID)
			{
				var contact = nlapiLoadRecord('partner', contactID);
				var contactEmail = contact.getFieldValue('email');	
			}
		}
		//============== make url ===============
		var propstatus = property.getFieldValue('custrecord_property_status');
		var listtype = property.getFieldValue('custrecord_listing_type');
		var ghostURL = '';
		nlapiLogExecution('DEBUG', 'propstatus '+propstatus , ' listtype '+listtype);
		var templateid = 71;
		var urlf = '';
		var urls = '';
		if((propstatus == 2 || propstatus == 8) && (listtype == 2))
		{								
			
			var url = nlapiResolveURL('SUITELET','customscript98','customdeploy1',true)+'&propertyid='+id+'&partnerid='+contactID+'&builderid='+builderID;//here we have to use script 98
			urlf = ' <a href="'+url+'">Click Here</a><br>';
			var url1 = nlapiResolveURL('SUITELET','customscript_hms_no_ghost_list_sl','customdeploy_hms_no_ghost_list_sl',true)+'&propid='+id;
			urls = ' <a href="'+url1+'">Click Here</a>';
			templateid = 94;
			
			
		}
		else
		{
			//var url = nlapiResolveURL('SUITELET','customscript_hms_no_ghost_list_sl','customdeploy_hms_no_ghost_list_sl',true)+'&propid='+id;
			//ghostURL = ' <br>Is the property that sold the same floorplan as the ghost listing? <br> <a href="'+url+'">Click Here</a>;'
		}
		//============== end url ================
		var subject = "Request Sale of a Market Home";

		if(contactEmail != null && contactEmail != '')
		{
			var records = new Object();
			records['recordtype'] = 18;
			records['record'] = id;

			var cc = new Array();
			cc[0] = 'callcenter@hmsmarketingservices.com';

			//var body = nlapiMergeRecord(9, 'customrecord_property_record', id);
			var emailMerger1 = nlapiCreateEmailMerger(templateid);//71 is converted type of 9
			emailMerger1.setCustomRecord('customrecord_property_record',id);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
			
			var cap = /\+\+url1\+\+/gi;
			emailBody1 = emailBody1.replace(cap, urlf);
			var cap1 = /\+\+url2\+\+/gi;
			emailBody1 = emailBody1.replace(cap1, urls);
			nlapiLogExecution('DEBUG', 'emailBody1 ' , emailBody1);
			nlapiSendEmail('3847', contactEmail, subject, emailBody1, cc, null, records, null, true);
			

			property.setFieldValue('custrecord_sales_notification_sent', dateFormatted);
			nlapiSubmitRecord(property);
		}
	}
}