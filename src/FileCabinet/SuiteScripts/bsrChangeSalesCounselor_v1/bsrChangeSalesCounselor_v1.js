/*
Author:  Michael Hulshult
Date: 8/16/2012
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to submit sales information
and documentation for properties that have recently sold.
*/

function bsrChangeSalesCounselor(request, response)
{
   if (request.getMethod() == 'GET')
   {
		//This portion of the script is executed when the page is loaded

		var form = nlapiCreateForm('Reassign Sales Counselor');
		//form.setScript('customscript_hms_bsr_change_sales_cs');
		form.setScript('customscript_hms_bsr_csc_cs_temp');
		var group = form.addFieldGroup('fieldgroup', 'Please complete the following required fields');

		var apptID = request.getParameter('apptid');
	
		//************************************************
		//************************************************
		//REMOVE THIS LINE TO REMOVE THE HARD CODED TEST
		//
		var apptID = '66210';
		//************************************************
		//************************************************
		
		var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
		var builderDivision = appointmentRecord.getFieldValue('company');
	  
		//var label = form.addField('label', 'label', 'Please complete the following required fields.', null, 'fieldgroup');
		//var label = form.addField('label', 'text', 'Please complete the following', null, 'fieldgroup').setDisplayType('inline');
		var bsrField = form.addField('custpage_bsrlist', 'select', 'New Sales Counselor *', null, 'fieldgroup');
		var newScSalutation = form.addField('custpage_new_salutation', 'select', 'Salutation', 'customlist_salutation', 'fieldgroup');
		var newScFirstNameFld = form.addField('custpage_new_firstname', 'text', 'First Name *', null, 'fieldgroup');
		var newScLastNameFld = form.addField('custpage_new_lastname', 'text', 'Last Name *', null, 'fieldgroup');
		var newScPhoneFld = form.addField('custpage_new_phone', 'phone', 'Phone', null, 'fieldgroup');
		var newScEmailFld = form.addField('custpage_new_email', 'email', 'Email *', null, 'fieldgroup');
		
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
	  
	  bsrField.addSelectOption('-99', '***ADD NEW***');
	  
	  var notify = form.addField('custpage_hms_notification', 'inlinehtml', null, null, 'fieldgroup');
		notify.setDefaultValue('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Or to change divisions, click the checkbox below and tell us the new division to assign it to.');
		


		form.addField('custpage_hms_change_division', 'checkbox', 'Change Division', null, 'fieldgroup');
		form.addField('custpage_hms_new_division', 'text', 'New Division', null, 'fieldgroup');
		
		
		


	  var justification = form.addField('justification', 'textarea', 'Reason for Reassignment *', null, 'fieldgroup');
	  var changeRequestor = form.addField('changerequestor', 'text', 'Please enter your name *', null, 'fieldgroup');
	 
//	  changeRequestor.setMandatory(true);
//	  justification.setMandatory(true);

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
	  var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
	  var rcompany = appointmentRecord.getFieldValue('company');
	  nlapiLogExecution('DEBUG','rcompany', rcompany);
	  
	  var bsr = request.getParameter('custpage_bsrlist');
	  nlapiLogExecution('DEBUG','BSR', bsr);
	  if(bsr==-99){
		  //Adding a new BSR

		  var _newSalutation = request.getParameter('custpage_new_salutation');
		  var _newFirstName = request.getParameter('custpage_new_firstname');
		  var _newLastName = request.getParameter('custpage_new_lastname');
		  var _newEmail = request.getParameter('custpage_new_email');
		  var _newPhone = request.getParameter('custpage_new_phone');
		  
		  nlapiLogExecution('DEBUG','Add BSR',  _newFirstName + ", " + _newLastName + ", " + _newEmail + ", " + _newPhone);
		  
		  var recAddBSR = nlapiCreateRecord( 'partner');
		  recAddBSR.setFieldValue('custentity_salutation', _newSalutation);
		  recAddBSR.setFieldValue('custentity1', rcompany);
		  recAddBSR.setFieldValue('customform', '15');
		  recAddBSR.setFieldValue('category', '5');
		  recAddBSR.setFieldValue('firstname', _newFirstName);
		  recAddBSR.setFieldValue('lastname', _newLastName);
		  recAddBSR.setFieldValue('email', _newEmail);
		  recAddBSR.setFieldValue('mobilephone', _newPhone);
		  //9	Sales Counselor
		  recAddBSR.setFieldValue('custentity_job_title', '9');
		  
		  
		  var propId = appointmentRecord.getFieldValue('custevent_property');
		  
		  if(propId){
			  var propSalesManager = nlapiLookupField('customrecord_property_record', propId, 'custrecord28');
		  }
		  
		  if(propSalesManager){
			  recAddBSR.setFieldValue('custentity_immediate_supervisor', propSalesManager);
		  }
		  
		  
		  nlapiLogExecution('DEBUG','Submitting BSR', bsr);
		  bsr = nlapiSubmitRecord(recAddBSR, true ,true); 
		  nlapiLogExecution('DEBUG','Submitted BSR', bsr);
		  
		  nlapiLogExecution('DEBUG','Confirm Details Email', 'Sending');
		  var newBsrConfirmSuitelet = nlapiResolveURL('SUITELET', 'customscript_hms_bsr_confirm_details', 'customdeploy_hms_bsr_confirm_details');
 		  var newBsrSubject = 'Confirm Details';
		  var newBsrEemailbody = 'Please confirm your details: <a href="'+newBsrConfirmSuitelet+"&builderid="+bsr+'">Click Here</a>';
		  //********************************************************
		  //********************************************************
		  //Use this nlapiSendEmail for Production
		  nlapiSendEmail('3847', bsr, newBsrSubject, newBsrEemailbody, null, null, null, null, true);
		  
		  //********************************************************
		  //********************************************************
		  //Use this nlapiSendEmail for Testing
		  //nlapiSendEmail('3847', 'bturk183@gmail.com', newBsrSubject, newBsrEemailbody, null, null, null, null, true);
		  //********************************************************
		  
		  nlapiLogExecution('DEBUG','Confirm Details Email', 'Sent');
	  }
	  
	  //********************************************************
	  //********************************************************
	  //Remove this return for production it's only there to 
	  //stop the process after adding a new BSR for testing.
	  //return;
	  //********************************************************
	  
	  
	  var justificationValue = request.getParameter('justification');
	  var changeRequestorValue = request.getParameter('changerequestor');
	  
	  var ndivision = request.getParameter('custpage_hms_new_division');
	  var nchangediv = request.getParameter('custpage_hms_change_division');
	  
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

			var bsrID = appointmentRecord.getFieldValue('custevent_builder_sales_rep_subd');
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
			nlapiSendEmail('3847', bsrEmail, subject, emailBody1, cc, null, records, null, true);

			var emailMerger2 = nlapiCreateEmailMerger(54);// 54 is for old template id 26
			emailMerger2.setSupportCase(apptID);
			var mergeResult2 = emailMerger2.merge();
			var emailBody2 = mergeResult2.getBody();
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
	nlapiGetField('custpage_new_salutation').setDisplayType('hidden');
	nlapiGetField('custpage_new_firstname').setDisplayType('hidden');
	nlapiGetField('custpage_new_lastname').setDisplayType('hidden');
	nlapiGetField('custpage_new_phone').setDisplayType('hidden');
	nlapiGetField('custpage_new_email').setDisplayType('hidden');
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
	
	if(name == 'custpage_bsrlist')
	{
		var val = nlapiGetFieldValue('custpage_bsrlist');
		console.log(val);
		if(val == '-99')
		{
			nlapiSetFieldValue('custpage_new_salutation', '');
			nlapiSetFieldValue('custpage_new_firstname', '');
			nlapiSetFieldValue('custpage_new_lastname', '');
			nlapiSetFieldValue('custpage_new_phone', '');
			nlapiSetFieldValue('custpage_new_email', '');
			nlapiGetField('custpage_new_salutation').setDisplayType('normal');
			nlapiGetField('custpage_new_firstname').setDisplayType('normal');
			nlapiGetField('custpage_new_lastname').setDisplayType('normal');
			nlapiGetField('custpage_new_phone').setDisplayType('normal');
			nlapiGetField('custpage_new_email').setDisplayType('normal');
			
		}
		else
		{
			nlapiSetFieldValue('custpage_new_salutation', '');
			nlapiSetFieldValue('custpage_new_firstname', '');
			nlapiSetFieldValue('custpage_new_lastname', '');
			nlapiSetFieldValue('custpage_new_phone', '');
			nlapiSetFieldValue('custpage_new_email', '');
			nlapiGetField('custpage_new_salutation').setDisplayType('hidden');
			nlapiGetField('custpage_new_firstname').setDisplayType('hidden');
			nlapiGetField('custpage_new_lastname').setDisplayType('hidden');
			nlapiGetField('custpage_new_phone').setDisplayType('hidden');
			nlapiGetField('custpage_new_email').setDisplayType('hidden');
			
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
			//Validate Form
			var _frmError = "";
			
			//If adding a new Sales Rep, validate new contact fields
			if(bsrlist == '-99'){
				
				if(!nlapiGetFieldValue('custpage_new_firstname'))
					_frmError += "\nPlease enter a value for First Name";
				if(!nlapiGetFieldValue('custpage_new_lastname'))
					_frmError += "\nPlease enter a value for Last Name";
				if(!nlapiGetFieldValue('custpage_new_email'))
					_frmError += "\nPlease enter a value for Email";
				if(!nlapiGetFieldValue('custpage_new_salutation'))
					_frmError += "\nPlease enter a value for Salutation";
			}
			
			if(!nlapiGetFieldValue('justification'))
				_frmError += "\nPlease enter a value for Reason for Reassignment";
			if(!nlapiGetFieldValue('changerequestor'))
				_frmError += "\nPlease enter a value for Your Name";
			
			if(_frmError !== ""){
				alert("Please fix the follow errors:"+_frmError);
				return false;
			}
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
