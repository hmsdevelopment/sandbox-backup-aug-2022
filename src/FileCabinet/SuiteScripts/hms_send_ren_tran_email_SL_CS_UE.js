// Date : 6th November 2016
var details = '';
var url = nlapiResolveURL('SUITELET', 114, 1);

function sendRenTran(type,form,request)
{
	try
	{
	/*	if(type == 'view')
		{
			form.addButton('custpage_email_ren_tran','Resend Inquiry Emails...','ConfirmREN();');
			form.setScript(201);  
		}*/
      	if(type == 'view')
		{
			var id = nlapiGetRecordId();
			var url = 'https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=114&deploy=1&recordid='+id;
			var openscript = 'window.open(\''+url+'\',\'_blank\')';
			form.addButton('custpage_email_ren_tran','Resend Inquiry Emails...',openscript);
		}
      
	}
	  catch(ex)
	   {
		  details = 'Exception ,sendRenTran  ';
		  details +='Name : '+ex.name+', Message : '+ex.message;
		  nlapiLogExecution('DEBUG', 'Body : ', details);
	   }
}

function ConfirmREN()
{
	try
	{
		var id = nlapiGetRecordId();
		var surl = 'https://1309901.app.netsuite.com'+url+'&recordid='+id;
		var FValues = nlapiLookupField('supportcase', id, ['custevent_bsr_for_ren','custevent_email_notification_attempts']);
		var bsrName =  defValue(FValues.custevent_bsr_for_ren);
		var msgCount = new Number(FValues.custevent_email_notification_attempts);
		details = "This will also send a reminder for "+bsrName+"'s "+msgCount+" open inquiries for this agent.";
		if(confirm(details))
	    window.open(surl,'_blank');		
	}
	catch(ex)
	{
		details = 'Exception : '+ex+', Message : '+ex.message;
      	alert(details);
	}
}


function defValue(value)
{	
	try
	{ 
	    if(value == null || value == undefined || value == '' || value == 'undefined')
	    value = '';	    
	    return value;
	}
	catch(ex)
	{
	   details = 'defValue, Exception : '+ex+', Message : '+ex.message;
	   nlapiLogExecution('DEBUG', 'Body : ', details);
       return '';
	}
}

function createSuitlet(request,response)
{
	if (request.getMethod() == 'GET')
	{
		var recordid = request.getParameter('recordid');
		var ren = nlapiCreateForm('Resend Inquiry Emails To:');
		var ren0 = ren.addField('custpage_recordid', 'text', 'support');
		ren0.setDefaultValue(recordid);
		ren0.setDisplayType('hidden');
		if(recordid)
		{
			var appointmentrec = nlapiLoadRecord('supportcase', recordid);
			var primaryBsr = appointmentrec.getFieldValue('custevent_builder_sales_rep_subd');
			var salesManager = appointmentrec.getFieldValue('custevent7');
			var adminContact = appointmentrec.getFieldValue('custevent_admin_contact');
			var bsrName = '';
			if(primaryBsr)
			{
				var bsrRecord = nlapiLoadRecord('partner', primaryBsr); 
				bsrName = bsrRecord.getFieldValue('firstname') + ' ' + bsrRecord.getFieldValue('lastname');
			}	
			var salesManagerName = '';
			if(salesManager)
			{
				var salesManagerRecord = nlapiLoadRecord('partner', salesManager); 
				salesManagerName = salesManagerRecord.getFieldValue('firstname') + ' ' + salesManagerRecord.getFieldValue('lastname');
			}
			var adminName = '';
			if(adminContact)
			{
				var adminRecord = nlapiLoadRecord('partner', adminContact); 
				adminName = adminRecord.getFieldValue('firstname') + ' ' + adminRecord.getFieldValue('lastname');
			}
			
			var optren = '';
			var optrtan = '';
			var bsremail = ''
			if(primaryBsr)
			{
				var fields = ['email','custentity_opt_opt_ren','custentity_opt_out_rtan'];
				var bpfields = nlapiLookupField('partner',primaryBsr,fields);
				optren = bpfields.custentity_opt_opt_ren;
				optrtan = bpfields.custentity_opt_out_rtan;
				bsremail = bpfields.email;
			}
			var salesmanagerEmail = appointmentrec.getFieldValue('custevent_sales_mgr_email');
			var adminContactId = appointmentrec.getFieldValue('custevent_admin_contact');
			var adminContactEmail = '';
			if(adminContactId)
			{
				adminContactEmail = nlapiLookupField('partner',adminContactId,'email');
			}
			
			var gotren = false;
			if((optren == 'F') || (optrtan == 'F'))
			{
				gotren = true;
			}
			var ren1 = ren.addField('custpage_rencheckbox', 'checkbox', 'Resend to Builder Sales Rep:' + ' ' + bsrName ,null,null);
			var ren2 = ren.addField('custpage_renemail', 'email', 'BSR Email',null,null);
			ren2.setDefaultValue(bsremail);
			ren2.setDisplayType('hidden');
			if(optren == gotren)
			{
				ren1.setDisplayType('disabled');
				ren2.setDisplayType('disabled');
			}
			
			var ren5 = ren.addField('custpage_salesmanager', 'checkbox', 'Resend to Sales Manager:' + ' ' + salesManagerName,null,null);
			var ren6 = ren.addField('custpage_salesmanageremail', 'email', 'Sales Manager Email',null,null);
			ren6.setDefaultValue(salesmanagerEmail);
			ren6.setDisplayType('hidden');
			var ren7 = ren.addField('custpage_administrative', 'checkbox', 'Resend to Division Coordinator:' + ' ' + adminName,null,null);
			var ren8 = ren.addField('custpage_administrativeemail', 'email', 'Division Coordinator Email',null,null);
			ren8.setDefaultValue(adminContactEmail);
			ren8.setDisplayType('hidden');
			ren.addSubmitButton('Send Emails');
		}
		response.writePage(ren);
		
	}
	else
	{
	
		try
		{
			var ren1 = request.getParameter('custpage_rencheckbox')|| 'F';
			var renemail = request.getParameter('custpage_renemail');
			
			var rtan1 = request.getParameter('custpage_rtancheckbox')|| 'F';
			var rtanemail = request.getParameter('custpage_rtanemail');
			
			var sm1 = request.getParameter('custpage_salesmanager')|| 'F';
			var smemail = request.getParameter('custpage_salesmanageremail');
			
			var adm1 = request.getParameter('custpage_administrative')|| 'F';
			var admemail = request.getParameter('custpage_administrativeemail');
			var id = request.getParameter('custpage_recordid');
			if(defValue(id) != '')
			{
				var supportcase = nlapiLoadRecord('supportcase',id);
				var agent = supportcase.getFieldValue('custevent_caller_name');
				var agentFirstName = '';
				var agentLastName = '';
				if(agent)
				{
					var agentRecord = nlapiLoadRecord('customrecord_agent', agent);
					agentFirstName = agentRecord.getFieldValue('custrecord_agent_first_name');
					agentLastName = agentRecord.getFieldValue('custrecord_agent_last_name');
				}
				var agentFullName = agentFirstName + ' ' + agentLastName;
				var subdivision = supportcase.getFieldValue('custevent_subdivision_for_ren');	
				var propertyId = supportcase.getFieldValue('custevent_property');
				var houseNumber = '';
				var street = '';
				var lot = '';
				if(propertyId)
				{
					var property = nlapiLoadRecord('customrecord_property_record', propertyId);
					houseNumber = property.getFieldValue('custrecord_house_number');
					street = property.getFieldText('custrecord31');
					lot = property.getFieldValue('custrecord_lot_number');
				}		
				var subject = "Re-sending : New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;			
				var records = new Object();
				records['activity'] = id;
				var searchType1 = supportcase.getFieldValue('custevent_subdivision_search');
				var needupdate1 = false;
			if(ren1 == 'T')
			{		
				if(searchType1 == 1)
				{
					var emailMerger = nlapiCreateEmailMerger(48);
					emailMerger.setSupportCase(id);
					var mergeResult = emailMerger.merge(); 
					var emailBody = mergeResult.getBody();
					if(renemail)
					nlapiSendEmail('3847', renemail, subject, emailBody, null, null, records);				
					nlapiLogExecution( 'DEBUG',  'after email in ren1 ', 'ren1  '+ren1);
					needupdate1 = true;
				}
				if(searchType1 == 2)
				{
					var body = nlapiMergeRecord(34, 'supportcase', id);
					if(renemail)
					nlapiSendEmail('3847', renemail, subject, body.getValue(), null, null, records);
					nlapiLogExecution( 'DEBUG',  'after email in ren1 ', 'ren1  '+ren1);
					needupdate1 = true;
				}
				if(searchType1 == 3)
				{
					var body = nlapiMergeRecord(39, 'supportcase', id);
					if(renemail)
					nlapiSendEmail('3847', renemail, subject, body.getValue(), null, null, records);
					nlapiLogExecution( 'DEBUG',  'after email in ren1 ', 'ren1  '+ren1);
					needupdate1 = true;
				}				
			}			
			if(sm1 == 'T')
			{
				if(searchType1 == 1)
				{
					var noLinksBody = nlapiMergeRecord(23, 'supportcase', id);
					if(smemail)
					nlapiSendEmail('3847', smemail, subject, noLinksBody.getValue(), null, null, records);		
					nlapiLogExecution( 'DEBUG',  'after  smemail email  id', 'id '+id);
					needupdate1 = true;
				}
				if(searchType1 == 2)
				{
					var noLinksBody = nlapiMergeRecord(35, 'supportcase', id);
					if(smemail)
					nlapiSendEmail('3847', smemail, subject, noLinksBody.getValue(), null, null, records);		
					nlapiLogExecution( 'DEBUG',  'after  smemail email  id', 'id '+id);
					needupdate1 = true;
				}
				if(searchType1 == 3)
				{
					var noLinksBody = nlapiMergeRecord(41, 'supportcase', id);
					if(smemail)
					nlapiSendEmail('3847', smemail, subject, noLinksBody.getValue(), null, null, records);		
					nlapiLogExecution( 'DEBUG',  'after  smemail email  id', 'id '+id);
					needupdate1 = true;
				}
			}
			
			if(adm1 == 'T')
			{
				if(searchType1 == 1)
				{
					var noLinksBody = nlapiMergeRecord(23, 'supportcase', id);
					if(admemail)
					nlapiSendEmail('3847', admemail, subject, noLinksBody.getValue(), null, null, records);		
					nlapiLogExecution( 'DEBUG',  'after  admemail email  id', 'id '+id);
					needupdate1 = true;
				}
				if(searchType1 == 2)
				{
					var noLinksBody = nlapiMergeRecord(35, 'supportcase', id);
					if(admemail)
					nlapiSendEmail('3847', admemail, subject, noLinksBody.getValue(), null, null, records);		
					nlapiLogExecution( 'DEBUG',  'after  admemail email  id', 'id '+id);
					needupdate1 = true;
				}
				if(searchType1 == 3)
				{
					var noLinksBody = nlapiMergeRecord(41, 'supportcase', id);
					if(admemail)
					nlapiSendEmail('3847', admemail, subject, noLinksBody.getValue(), null, null, records);		
					nlapiLogExecution( 'DEBUG',  'after  admemail email  id', 'id '+id);
					needupdate1 = true;
				}
		   }								
		}		
			
		if(needupdate1 == true)
		{
			var currenttime = currentdatetime();
			supportcase.setFieldValue('custevent_hms_last_ren_sent_date_time',currenttime);
			nlapiSubmitRecord(supportcase,false,false);
		}		
		successForm();
	}
	catch(e)
	{
		var errmsg = '';
		var err = '';
		var fx='';
		if ( e instanceof nlobjError )
		err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
		else
		err = 'Unexpected error: ' + e.toString();
		errmsg += '\n' + err;
		nlapiLogExecution( 'ERROR',  fx + ' 999 Error', errmsg);
	}
 }
}

function currentdatetime()
{
	var cdate = new Date();
	var time = nlapiDateToString(cdate,'datetime');
	return time;
}

function successForm()
{
	var form = nlapiCreateForm("Success");
	var success=form.addField('success', 'text', 'Email Sent Successfully .',null);
	success.setDisplayType('inline');		
	form.addButton('custpage_ok','OK','window.close()');
	response.writePage(form);
}

