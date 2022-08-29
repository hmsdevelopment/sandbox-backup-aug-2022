function sendSalesNotification()
{
	try
	{
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth();
		month++;
		var year = date.getFullYear();
		var dateFormatted = month + "/" + day + "/" + year;
		var internalid = nlapiGetRecordId();
		var recordtype = nlapiGetRecordType();
		var record = nlapiLoadRecord(recordtype, internalid);
		var id = record.getFieldValue('id');
		var builderID = record.getFieldValue('custrecord12');
		var houseNumber = record.getFieldValue('custrecord_house_number');
		var street = record.getFieldValue('custrecord_street_text');
		var subdivision = record.getFieldValue('custrecord_subdivision_text');
		
		if(builderID)
		{
		
			var builder = nlapiLoadRecord('customer', builderID);
			var contactID = builder.getFieldValue('custentity_sales_notification_contact');
			var contactEmail = '';
			var flname = '';
			//alert(contactID);
			if(contactID)
			{
				var contact = nlapiLoadRecord('partner', contactID);
				contactEmail = contact.getFieldValue('email');
				var fname = contact.getFieldValue('firstname')|| '';
				var lname = contact.getFieldValue('lastname')|| '';
				flname = fname+' '+lname;
			}
			else
			{
				var contactID = builder.getFieldValue('custentity_administrative_contact');
				if(contactID)
				{
					var contact = nlapiLoadRecord('partner', contactID);
					contactEmail = contact.getFieldValue('email');	
					var fname = contact.getFieldValue('firstname') || '';
					var lname = contact.getFieldValue('lastname') || '';
					flname = fname+' '+lname;
				}
              nlapiLogExecution('DEBUG','property id',id);
			nlapiLogExecution('DEBUG','contact email',contactEmail);
			}
			var opt = 'This will send a sales notification request to '+flname+'. Do you wish to continue?';
			var r = confirm(opt);
			if(r == true)
			{
				var url = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=192&deploy=1&compid=1309901&h=7bc861d1f9245b6daddb&contactemail='+contactEmail+'&recid='+id;
				var resbody = nlapiRequestURL(url);
				var body = resbody.getBody();
              nlapiLogExecution('DEBUG','resbody',JSON.stringify(resbody));
				nlapiLogExecution('DEBUG','body',JSON.stringify(body));
				if(body == true || body == 'true')
				{
					record.setFieldValue('custrecord_sales_notification_sent', dateFormatted);
					nlapiSubmitRecord(record);
					alert('Email Sent');
				}
				else
				{
					alert('Unable to Send Email');
				}
			}
		}
		else
		{
			
		}
	
	
	}
	catch(e)
	{
		alert(e.message);
	}
	
}

function addsalebutton(type, form, request)
{
	try
	{
		if(type == 'view')
		{	
			form.setScript('customscript190');
			form.addButton('custpage_salesnotify','Send Sales Notification Request','sendSalesNotification()');
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR','error ',e);
	}
}

function sendEmail(request, response)
{
	var contactEmail = request.getParameter('contactemail');
	var id = request.getParameter('recid');
	var subject = "Request Sale of a Market Home";

	nlapiLogExecution('DEBUG','property id',id);
	nlapiLogExecution('DEBUG','contact email ',contactEmail);

	if(contactEmail != null && contactEmail != '')
	{
		var records = new Object();
		records['recordtype'] = 18;
		records['record'] = id;

		var cc = [];
	
		cc[0] = 'callcenter@hmsmarketingservices.com';
		
		

		//var body = nlapiMergeRecord(9, 'customrecord_property_record', id);
		var emailMerger1 = nlapiCreateEmailMerger(71);//71 is converted type of 9
		emailMerger1.setCustomRecord('customrecord_property_record',id);
		var mergeResult1 = emailMerger1.merge();
		var emailBody1 = mergeResult1.getBody();
		nlapiSendEmail('3847', contactEmail, subject, emailBody1, cc, null, records, null, true);

		response.write(true);
		return;
		
	}
	response.write(false);
	return;
}

