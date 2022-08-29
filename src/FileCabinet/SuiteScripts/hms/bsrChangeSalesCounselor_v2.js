/*
Author:  Michael Hulshult
Contributor : Abhishek Jain
Date: 8/16/2012
Edited : 14/02/2018
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to submit sales information
and documentation for properties that have recently sold.
*/

function bsrChangeSalesCounselor(request, response)
{
   if (request.getMethod() == 'GET')
   {
		//This portion of the script is executed when the page is loaded

		var form = nlapiCreateForm('Reassign Sales Counselor');
		form.setScript('customscript_hms_bsr_change_sales_cs');
		var group = form.addFieldGroup('fieldgroup', 'Please complete the following required fields');

		var apptID = request.getParameter('apptid');
		var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
		var builderDivision = appointmentRecord.getFieldValue('company');
		
		
	  
	  
		//var label = form.addField('label', 'label', 'Please complete the following required fields.', null, 'fieldgroup');
		//var label = form.addField('label', 'text', 'Please complete the following', null, 'fieldgroup').setDisplayType('inline');
		var bsrField = form.addField('custpage_bsrlist', 'select', 'New Sales Counselor', null, 'fieldgroup');
		//bsrField.setMandatory(true);
		bsrField.addSelectOption('', '');
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custentity1', null, 'is', builderDivision);
		filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[2] = new nlobjSearchFilter('category', null, 'noneOf', '11');

		var columns = [];
		columns.push(new nlobjSearchColumn('category'));
		columns.push(new nlobjSearchColumn('firstname'));
		columns.push(new nlobjSearchColumn('lastname'));
		columns[0].setSort();
		columns[1].setSort();
		columns[2].setSort();
				

	  var results = nlapiSearchRecord('partner', null, filters, columns);
	  if(results == null)
	  {
	 	  bsrField.addSelectOption('-1', 'No Sales Counselors available.');
	  }
	 else
	  {
		
		  for(var i=0; results != null && results.length > i; i++)
		  {
				var partnerName = results[i].getValue('firstname') + ' ' + results[i].getValue('lastname');
				/*
				var partnerRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
				// var partnerName = partnerRecord.getFieldValue('entityid');
				var partnerName = partnerRecord.getFieldValue('firstname') + ' ' + partnerRecord.getFieldValue('lastname');
				*///this is not good way as this will cause limit exceed
				bsrField.addSelectOption(results[i].getId(), partnerName);
		  }
	  }
	  
	  var notify = form.addField('custpage_hms_notification', 'inlinehtml', null, null, 'fieldgroup');
		notify.setDefaultValue('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Or to change divisions, click the checkbox below and tell us the new division to assign it to.');
		


		form.addField('custpage_hms_change_division', 'checkbox', 'Change Division', null, 'fieldgroup');
		form.addField('custpage_hms_new_division', 'text', 'New Division', null, 'fieldgroup');
		
		
		


	  var justification = form.addField('justification', 'textarea', 'Reason for Reassignment', null, 'fieldgroup');
	  var changeRequestor = form.addField('changerequestor', 'text', 'Please enter your name', null, 'fieldgroup');
	  changeRequestor.setMandatory(true);
	  
	  
	  
	  justification.setMandatory(true);
	  var apptIDField = form.addField('apptid', 'text', 'appt ID').setDisplayType('hidden');
	  form.setFieldValues({apptid:apptID});
	  group.setSingleColumn(true);
	  form.addSubmitButton('Submit');
	  
      response.writePage(form);
   }
   
   else
   {
	  var date = new Date();
	  var day = date.getDate();
	  var month = date.getMonth();
	  month++;
	  var year = date.getFullYear();
	  var hours = date.getHours();
	  var amPM;
	  if (hours >= '12')
	  {
		amPM = 'pm';
	  }
	  
	  else
	  {
		amPM = 'am';
	  }

	  if(hours > '12')
	  {
		hours = hours - '12';
	  }
	  
	  hours = addZero(hours);
	  
	  var minutes = date.getMinutes();
	  minutes = addZero(minutes);
	  
	  var seconds = date.getSeconds();
	  seconds = addZero(seconds);
	  
	  var dateFormatted = month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds + " " + amPM;
	  var apptID = request.getParameter('apptid');
	  var justificationValue = request.getParameter('justification');
	  var changeRequestorValue = request.getParameter('changerequestor');
	  var bsr = request.getParameter('custpage_bsrlist');
	  var ndivision = request.getParameter('custpage_hms_new_division');
	  var nchangediv = request.getParameter('custpage_hms_change_division');
	  var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
	  var rcompany = appointmentRecord.getFieldValue('company');
	  var salesManager = appointmentRecord.getFieldValue('custevent7');
	  if (salesManager)
	  {
		var salesManagerRecord = nlapiLoadRecord('partner', salesManager);
		var salesManagerEmail = salesManagerRecord.getFieldValue('email');
	  }
      var subdivision = appointmentRecord.getFieldValue('custevent_subdivision_for_ren');
	  var companyText = appointmentRecord.getFieldText('company');
	 
	 var dmID = appointmentRecord.getFieldValue('custevent8');
		var optOutBuilderLeads = 'F';
		if (dmID)
		{
			var dmRecord = nlapiLoadRecord('partner', dmID);
			optOutBuilderLeads = dmRecord.getFieldValue('custentity_opt_out_builder_leads');
		}
		
	  var oldBSR = appointmentRecord.getFieldValue('custevent_builder_sales_rep_subd');
	  var assignedTo = appointmentRecord.getFieldValue('assigned');
	  var builderSuppliedLead = appointmentRecord.getFieldValue('custevent_builder_lead');
	  var searchType = appointmentRecord.getFieldValue('custevent_subdivision_search');
	  var divManagerEmail = appointmentRecord.getFieldValue('custeventdivision_mgr_email');
	  var topLevelBuilder = appointmentRecord.getFieldValue('custevent_builder');
	  var copyOnBuilderLeads = null;
	  var oldBSRRecord = nlapiLoadRecord('partner', oldBSR);
	  var oldBSREmail = oldBSRRecord.getFieldValue('email');
	  var oldBSRFirstName = oldBSRRecord.getFieldValue('firstname');
	  var oldBSRLastName = oldBSRRecord.getFieldValue('lastname');
	  appointmentRecord.setFieldValue('custevent_previous_bsr_fname', oldBSRFirstName);
	  appointmentRecord.setFieldValue('custevent_previous_bsr_lname', oldBSRLastName);
  	  appointmentRecord.setFieldValue('custevent_bsr_follow_up', dateFormatted);
	  if(bsr)
	  {
		appointmentRecord.setFieldValue('custevent_builder_sales_rep_subd', bsr);
	  }
	  //appointmentRecord.setFieldValue('custevent_bsr_assignment_note', justificationValue);//commented by abhi
	  appointmentRecord.setFieldValue('custevent_new_note', justificationValue+' [Reassigned by '+changeRequestorValue+']');//used  by abhi
	  appointmentRecord.setFieldValue('custevent_bsr_reassign_submit', changeRequestorValue);
	  if(assignedTo)
	  {
		var assignedRecord = nlapiLoadRecord('employee', assignedTo);
		var assignedEmail =  assignedRecord.getFieldValue('email');
	  }
	  appointmentRecord.setFieldValue('custevent_hms_new_division', ndivision);
	  appointmentRecord.setFieldValue('custevent_hms_change_division', nchangediv);
	  nlapiSubmitRecord(appointmentRecord, false, true);
	  
	  
	var records = new Object();
	records['activity'] = apptID;
	  
	  
		if(bsr)
		{
			var bsrRecord = nlapiLoadRecord('partner', bsr);
			var bsrEmail = bsrRecord.getFieldValue('email');
			var agent = appointmentRecord.getFieldValue('custevent_caller_name');
			var agentFirstName = '';
			var agentLastName = '';
			var agentFullName = '';
			if(agent)
			{
				var agentRecord = nlapiLoadRecord('customrecord_agent', agent);
				agentFirstName = agentRecord.getFieldValue('custrecord_agent_first_name');
				agentLastName = agentRecord.getFieldValue('custrecord_agent_last_name');
				agentFullName = agentFirstName + ' ' + agentLastName;
			}
			var callerType=appointmentRecord.getFieldValue('custevent_caller_type');
			var bsrID = appointmentRecord.getFieldValue('custevent_builder_sales_rep_subd');
			var bsr_email={};
			nlapiLogExecution('DEBUG', '301',builderDivision);
			try{
			if(callerType=='10'||callerType=='3'){
				var bsrTobeNotified=nlapiLookupField('customer', builderDivision, 'custentity_copy_appt_insp_req');
				nlapiLogExecution('DEBUG', 'bsrTobeNotified',bsrTobeNotified);
				var arr=[];
				arr=bsrTobeNotified.split(',');
				nlapiLogExecution('DEBUG', 'arr',arr.length);
				for(var z=0;z<arr.length;z++){
					var b_mail=nlapiLookupField('partner', arr[z], 'email');
					bsr_email[arr[z]]=b_mail;
				}
			}}catch(eb){
				bsr_email={};
				nlapiLogExecution('DEBUG', 'eb',eb);
			}
nlapiLogExecution('DEBUG', 'bsr_email', JSON.stringify(bsr_email));

			var imageurl='';
			try{
				var imageid=nlapiLookupField('customer',rcompany,'image');
			if(!imageid){
				var builder_parent=nlapiLookupField('customer',rcompany,'parent');
				imageid=nlapiLookupField('customer',builder_parent,'image');
				nlapiLogExecution('debug','builder_parent',builder_parent);
					image_file=nlapiLoadFile(imageid);
					imageurl=image_file.getURL();
				}else{
					var image_file=nlapiLoadFile(imageid);
				    imageurl=image_file.getURL();
				}
			}catch(ier){
				nlapiLogExecution('debug','err image',ier);
			}
			if(imageurl==''){
			imageurl='https://1309901.app.netsuite.com/core/media/media.nl?id=39790&amp;c=1309901&amp;h=48dbf824375dd894c511';
			}
			else{
				imageurl='https://1309901.app.netsuite.com'+imageurl;
			}
			nlapiLogExecution('debug','url',imageurl);
			var bsrFname = '';
			var bsrLname = '';
			if(bsrID)
			{
				var bsrRecord = nlapiLoadRecord('partner', bsrID);
				bsrFname = bsrRecord.getFieldValue('firstname');
				bsrLname = bsrRecord.getFieldValue('lastname');
			}

			if (searchType == '1')
			{
				var propertyId = appointmentRecord.getFieldValue('custevent_property');
				var lot = '';
				if(propertyId)
				{
					var property = nlapiLoadRecord('customrecord_property_record', propertyId);
					lot = property.getFieldValue('custrecord_lot_number');
					bsrTemplate = 22
					smTemplate = 23
				}
				if (builderSuppliedLead == 'T')
				{
					var subject = "REASSIGNED: Web Lead Assigned To " + bsrFname + ' ' + bsrLname + " For " + subdivision + " Lot " + lot;
				}
				else
				{
					//nlapiLogExecution('DEBUG', 'Message', 'Agent ' + agentFullName + ' Sub ' + subdivision + ' lot ');
					var subject = "REASSIGNED: New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;
				}
			}
			else if (searchType == '2')
			{
				var subject = "REASSIGNED: Web Lead Assigned To " + bsrFname + ' ' + bsrLname + " For " + subdivision;
				bsrTemplate = 34
				smTemplate = 35
			}
			else if (searchType == '3')
			{
				var subject = "REASSIGNED: Web Lead Assigned To " + bsrFname + ' ' + bsrLname; + " For " + companyText;
				//if (copyToBuilderCount == 1)
				//{
					bsrTemplate = 39;
				//}
				//else
				//{
				//	bsrTemplate = 36;
				//}
				
			}

			var showingAssist = appointmentRecord.getFieldValue('custevent_showing_assist');

			var form = nlapiCreateForm('Appointment Confirmation');
			var confirmation = form.addField('confirmationfield', 'label', 'Thank you, the sales counselor has been updated.');

			  var cc = new Array();
			  cc[0]='mlsinfo@hmsmarketingservices.com'
			  cc[1]='ahencheck@hmsmarketingservices.com'
			  if(assignedEmail)
			  {
				  cc[2] = assignedEmail
				  var i = 3
			  }
			  else
			  {
				  var i = 2
			  }
			  
			  
			  if (salesManagerEmail)
			  {
				cc[i]=salesManagerEmail;
				i++;
			  }
			  if(builderSuppliedLead == 'T')
			  {
				if(divManagerEmail != '' && divManagerEmail != null && optOutBuilderLeads == 'F')
				{
					cc[i] = divManagerEmail;
					i++;
				}
				
				if(topLevelBuilder != null && topLevelBuilder != '')
				{
					var topLevelBuilderRecord = nlapiLoadRecord('customer', topLevelBuilder);
					if (builderSuppliedLead == 'T')
					{
						copyOnBuilderLeads = topLevelBuilderRecord.getFieldValues('custentity_copy_on_builder_leads');
					}
				}
				
				if(copyOnBuilderLeads != null && copyOnBuilderLeads != '')
				{
					if(copyOnBuilderLeads[0].length == 1)
					{
						var copyUser = nlapiLoadRecord('partner', copyOnBuilderLeads);
						var copyUserEmail = copyUser.getFieldValue('email');
						cc[i] = copyUserEmail;
						i++;
					}

					else
					{
						for(var j=0; copyOnBuilderLeads.length > j; j++)
						{
							var copyUser = nlapiLoadRecord('partner', copyOnBuilderLeads[j]);
							var copyUserEmail = copyUser.getFieldValue('email');
							cc[i] = copyUserEmail;
							i++;
						}
					}
				}
			  }

			



			var emailMerger1 = nlapiCreateEmailMerger(53);//53 is converted type of 27
			emailMerger1.setSupportCase(apptID);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
			emailBody1=emailBody1.replace('logoimage',imageurl);
			body = emailBody1
			var recipient = cc[0];			
		    if(defVal(bsrEmail) != '')
		    recipient = bsrEmail;
		    body=body.replace('bsrid', bsrID);
			nlapiSendEmail('3847', bsrEmail, subject, emailBody1, cc, null, records, null, true);
			for(var bm in bsr_email){
        		var t_body=emailBody;
        		var bsr_nsid=bm;
        		bsr_mail_id=bsr_email[bm];
        		t_body=t_body.replace('bsrid', bsr_nsid);
        		nlapiSendEmail('3847', bsr_mail_id, subject, t_body, cc, null, records, null, true);
        		
        	}

			var emailMerger2 = nlapiCreateEmailMerger(101);// 54 is for old template id 26
			emailMerger2.setSupportCase(apptID);
			var mergeResult2 = emailMerger2.merge();
			var emailBody2 = mergeResult2.getBody();
			emailBody2=emailBody2.replace('logoimage',imageurl);
			nlapiSendEmail('3847', oldBSREmail, subject, emailBody2, null, null, records, null, true);
			/*
			var body = nlapiMergeRecord(27, 'supportcase', apptID);
			nlapiLogExecution('DEBUG','Message ', 'Email ' + bsrEmail + 'subject ' + subject + 'cc ' + cc);
			nlapiSendEmail('3847', bsrEmail, subject, body.getValue(), cc, null, records);

			var body = nlapiMergeRecord(26, 'supportcase', apptID);
			nlapiSendEmail('3847', oldBSREmail, subject, body.getValue(), null, null, records);
			*/
		}
		else
		{
			var caseurl = nlapiResolveURL('RECORD', 'supportcase', apptID);
			var receiptient = 'mlsinfo@hmsmarketingservices.com';
			//var receiptient = 'abhirules01@gmail.com';
			var subject = 'Change of Division Requested, Action Required.';
			var remailbody = 'The following case needs to be changed from '+companyText+' to '+ndivision+' as the request of changerequestor for the following reason '+justificationValue+'.followed by a link to the case record being referenced.';
			remailbody = remailbody+'<br><a href="'+caseurl+'">click to view record</a>';
			 nlapiSendEmail('3847', receiptient, subject, remailbody, null, null, records, null, true);
			 var form = nlapiCreateForm('Appointment Confirmation');
			var confirmation = form.addField('confirmationfield', 'label', 'Thank you, HMS will make this change as soon as possible.');
		}
	  response.writePage(form);
   }
}

function disableOnInit()
{
	nlapiDisableField('custpage_hms_new_division', true);
}

function disableFields(type, name, i)
{
	if(name == 'custpage_hms_change_division')
	{
		var val = nlapiGetFieldValue('custpage_hms_change_division');
		if(val == 'T')
		{
			nlapiSetFieldValue('custpage_bsrlist', '');
			nlapiDisableField('custpage_bsrlist', true);
			nlapiDisableField('custpage_hms_new_division', false);
			
		}
		else
		{
			
			nlapiSetFieldValue('custpage_hms_new_division', '');
			nlapiDisableField('custpage_hms_new_division', true);
			nlapiDisableField('custpage_bsrlist', false);
			
		}
	}
	
}

function onSaveAlert()
{
	var val = nlapiGetFieldValue('custpage_hms_change_division');
	if(val == 'T')
	{
		var newdivision = nlapiGetFieldValue('custpage_hms_new_division');
		if(newdivision)
		{
			//do nothing
		}
		else
		{
			alert('If you are assigning this to a new division, please leave the New Sales Counselor field blank. If you are reassigning to a new sales counselor within your division, please uncheck "Change Division"');
			return false;
		}
	}
	else
	{
		var bsrlist = nlapiGetFieldValue('custpage_bsrlist');
		if(bsrlist)
		{
			//do nothing
		}
		else
		{
			alert("Please select a New Sales Counselor");
			return false;
		}
	}
	return true;
}


function addZero(intValue)
{
	  switch(intValue)
	  {
		case '0':
			intValue = '00';
			break;
		case '1':
			intValue = '01';
			break;
		case '2':
			intValue = '02';
			break;
		case '3':
			intValue = '03';
			break;
		case '4':
			intValue = '04';
			break;
		case '5':
			intValue = '05';
			break;
		case '6':
			intValue = '06';
			break;
		case '7':
			intValue = '07';
			break;
		case '8':
			intValue = '08';
			break;
		case '9':
			intValue = '09';	
			break;
	  }
	  return intValue;
}
function defVal(value)
{
	try
	{ 
	    if(value == null || value == undefined || value == 'undefined') 
	    value = '';
	    return value;
	}
	catch(ex)
	{
		body = 'defVal : '+ex;
		body += ex.name+' : '+ex.message;
		nlapiSendEmail(author, bcc, subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);
		return '';
	}
}