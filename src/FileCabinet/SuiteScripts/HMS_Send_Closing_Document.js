function sendClosingNotification()
{
  
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	month++;
	var year = date.getFullYear();
	var dateFormatted = month + "/" + day + "/" + year;
  var dateFormatted= nlapiDateToString(date);
	var internalid = nlapiGetRecordId();
	var recordtype = nlapiGetRecordType();
	
	{
		var property = nlapiLoadRecord(recordtype, internalid);
		var id = property.getFieldValue('id');
		var builderID = property.getFieldValue('custrecord12');
		var houseNumber = property.getFieldValue('custrecord_house_number');
		var street = property.getFieldValue('custrecord_street_text');
		var subdivision = property.getFieldValue('custrecord_subdivision_text');
		nlapiLogExecution('AUDIT', 'builderID ', 'builderID '+builderID);
		var subject = "Request for Closing Information of Market Home";
		if(builderID)
		{
			var builder = nlapiLoadRecord('customer', builderID);
			var contactID = builder.getFieldValue('custentity_close_notification');
			nlapiLogExecution('AUDIT', 'contactID ', 'contactID '+contactID);
			var contactEmail = '';
			var flname = '';
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
			}
			var opt = 'This will send a closing document request to '+flname+'. Do you wish to continue?';
			var r = confirm(opt);
			if(r == true)
			{
				var url = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=195&deploy=1&compid=1309901&h=b91feae64df789fd80a3&contactemail='+contactEmail+'&recid='+id;
				nlapiLogExecution('DEBUG','contact email',contactEmail);
				//var url = 'https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=195&deploy=1&contactemail='+contactEmail+'&recid='+id;
				var resbody = nlapiRequestURL(url);
              
				//alert(' resbody '+resbody);
				var body = resbody.getBody();
				//alert('body '+body);
				if(body == true || body == 'true')
				{
					//property.setFieldValue('custrecord_sales_notification_sent', dateFormatted);
					//nlapiSubmitRecord(property);
					nlapiSubmitRecord(property,internalid,"custrecord_sales_notification_sent",dateFormatted);
                  alert('Email Sent');
				}
				else
				{
					alert('Unable to Send Email');
				}
			}
		}
	}
 
  
}


function addCancelbutton(type, form, request)
{
	try
	{
		if(type == 'view')
		{	
			form.setScript('customscript_hms_send_close_noti_cs');
			form.addButton('custpage_closenotify','Send Closing Notification Request','sendClosingNotification()');
          
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
	var subject = "Request for Closing Information of Market Home";
	nlapiLogExecution('DEBUG','contactEmail '+contactEmail,' id '+id);
	if(contactEmail != null && contactEmail != '')
	{
		var records = new Object();
		records['recordtype'] = 18;
		records['record'] = id;

		var cc = [];
		cc[0] = 'callcenter@hmsmarketingservices.com';

		//var body = nlapiMergeRecord(9, 'customrecord_property_record', id);
		var emailMerger1 = nlapiCreateEmailMerger(70);//71 is converted type of 9
		emailMerger1.setCustomRecord('customrecord_property_record',id);
		var mergeResult1 = emailMerger1.merge();
		var emailBody1 = mergeResult1.getBody();
	nlapiSendEmail('3847', contactEmail, subject, emailBody1, cc, null, records);
//nlapiSendEmail('3847', "vikash.singh@webbee.biz", subject, emailBody1, cc, null, records);
		response.write(true);
		return;
		
	}
	response.write(false);
	return;
}


