function createSuitlet(request,response)
{
	if (request.getMethod() == 'GET')
	{
		var ren = nlapiCreateForm('Send Ren eMail');
		ren.setScript('customscript_test_send_ren_cs');
		ren.addField('custpage_status', 'text', 'status');//.setDisplayType('hidden');
		ren.addField('custpage_id', 'text', 'Id');//.setDisplayType('hidden');
		ren.addField('custpage_property', 'text', 'property');//.setDisplayType('hidden');
		ren.addField('custpage_property_text', 'text', 'property');//.setDisplayType('hidden');
		ren.addField('custpage_category', 'text', 'property');//.setDisplayType('hidden');
		ren.addField('custpage_ren_sent', 'text', 'rensent');//.setDisplayType('hidden');
		ren.addField('custpage_ren_enabled', 'text', 'ren Enabled');//.setDisplayType('hidden');
		ren.addField('custpage_builder', 'text', 'Builder');//.setDisplayType('hidden');
		ren.addField('custpage_subdivision_for_ren', 'text', 'ren subdivision');//.setDisplayType('hidden');
		ren.addField('custpage_company', 'text', 'Company');//.setDisplayType('hidden');
		ren.addField('custpage_showing_assist', 'text', 'Showing Assist');//.setDisplayType('hidden');
		ren.addField('custpage_bsr_notify_sent', 'text', 'BSR Notification Sent');//.setDisplayType('hidden');
		ren.addField('custpage_caller_name', 'text', 'Caller Name');//.setDisplayType('hidden');
		ren.addField('custpage_builder_sales_rep_subd', 'text', 'Sales Rep Subd');//.setDisplayType('hidden');
		ren.addField('custpage_sm_opt_out', 'text', 'SM Opt Out');//.setDisplayType('hidden');
		ren.addField('custpage_dm_opt_out', 'text', 'DM Opt Out');//.setDisplayType('hidden');
		ren.addField('custpage_admin_opt_out', 'text', 'Admin Opt Out');//.setDisplayType('hidden');
		ren.addField('custpage_sm_opt_out_rtan', 'text', 'SM Opt Out Rtan');//.setDisplayType('hidden');
		ren.addField('custpage_dm_opt_out_rtan', 'text', 'DM Opt Out Rtan');//.setDisplayType('hidden');
		ren.addField('custpage_admin_opt_out_rtan', 'text', 'Admin Opt Out Rtan');//.setDisplayType('hidden');
		ren.addField('custpage_bsr_opt_out', 'text', 'BSR Opt Out Rtan');//.setDisplayType('hidden');
		ren.addField('custpage_sales_mgr_email', 'text', 'Sales Manager Email');//.setDisplayType('hidden');
		ren.addField('custpage_division_mgr_email', 'text', 'Division Manager Email');//.setDisplayType('hidden');
			   
		ren.addField('custpage_stage', 'text', 'Stage');//.setDisplayType('hidden');
		ren.addField('custpage_ccrtan_emails', 'text', 'ccRtan Emails');//.setDisplayType('hidden');
		ren.addField('custpage_cc_emails', 'text', 'CC Emails');//.setDisplayType('hidden');
		ren.addField('custpage_copy_on_ren', 'text', 'Copy On Ren');//.setDisplayType('hidden');
		ren.addField('custpage_one_time_rtan_opt_out', 'text', 'Copy On Ren');//.setDisplayType('hidden');
		ren.addField('custpage_administrative_contact_email', 'text', 'Administrative Contact Email');//.setDisplayType('hidden');
		ren.addSubmitButton('Send Emails');
		response.writePage(ren);	
	}
	else
	{
	//request.getParameter
		var statusID = request.getParameter('custpage_status');
		var id = request.getParameter('custpage_id');
		var propertyId = request.getParameter('custpage_property');
		var propertyText = nlapiGetFieldText('custpage_property_text');
		var index = '';
		var builder ='';
		var category = request.getParameter('custpage_category');
		var renSent = request.getParameter('custpage_ren_sent');
		var renEnabled = request.getParameter('custpage_ren_enabled');
		var topLevelBuilder = request.getParameter('custpage_builder');
		var subdivision = request.getParameter('custpage_subdivision_for_ren');
		var copyOnREN = null;
		var division = request.getParameter('custpage_company');
		nlapiLogExecution( 'DEBUG',  'division', 'division '+division);
		var builderDivision = nlapiLoadRecord('customer', division);
		var copyOnRENDivision = builderDivision.getFieldValues('custentity_copy_on_ren');
		var notificationMethod = builderDivision.getFieldValue('custentity_appt_notification_method');
		var enableEmailNotification = builderDivision.getFieldValue('custentity8');
		var showingAssist = request.getParameter('custpage_showing_assist');
		var bsrNotifySent = request.getParameter('custpage_bsr_notify_sent');

		var agent = request.getParameter('custpage_caller_name');
		nlapiLogExecution( 'DEBUG',  'agent', 'agent '+agent);
		var agentRecord = nlapiLoadRecord('customrecord_agent', agent);
		var agentFirstName = agentRecord.getFieldValue('custrecord_agent_first_name');
		var agentLastName = agentRecord.getFieldValue('custrecord_agent_last_name');
		var agentFullName = agentFirstName + ' ' + agentLastName;
		var bsrID = request.getParameter('custpage_builder_sales_rep_subd');
		nlapiLogExecution( 'DEBUG',  'bsrID', 'bsrID '+bsrID);
		var bsrRecord = nlapiLoadRecord('partner', bsrID);
		var smOptOut = request.getParameter('custpage_sm_opt_out');
		var dmOptOut = request.getParameter('custpage_dm_opt_out');
		var adminOptOut = request.getParameter('custpage_admin_opt_out');
		var smOptOutRTAN = request.getParameter('custpage_sm_opt_out_rtan');
		var dmOptOutRTAN = request.getParameter('custpage_dm_opt_out_rtan');
		var adminOptOutRTAN = request.getParameter('custpage_admin_opt_out_rtan');
		var bsrOptOut = request.getParameter('custpage_bsr_opt_out');
		nlapiLogExecution( 'DEBUG',  'propertyId', 'propertyId '+propertyId);
		var property = nlapiLoadRecord('customrecord_property_record', propertyId);
		var houseNumber = property.getFieldValue('custrecord_house_number');
		var street = property.getFieldText('custrecord31');
		var lot = property.getFieldValue('custrecord_lot_number');
		var subject = "New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;
		var salesManagerEmail = request.getParameter('custpage_sales_mgr_email');
		var divManagerEmail = request.getParameter('custpage_division_mgr_email');
		var adminAsstEmail = request.getParameter('custpage_administrative_contact_email');
		var bsrEmail = bsrRecord.getFieldValue('email');
		var bsrOptOutRTAN = bsrRecord.getFieldValue('custentity_opt_out_rtan');
		var bsrOneTimeOptOut = request.getParameter('custpage_one_time_rtan_opt_out');
		
		if(topLevelBuilder)
		{
			nlapiLogExecution( 'DEBUG',  'topLevelBuilder', 'topLevelBuilder '+topLevelBuilder);
			var topLevelBuilderRecord = nlapiLoadRecord('customer', topLevelBuilder);
			copyOnREN = topLevelBuilderRecord.getFieldValues('custentity_copy_on_ren');
		}

		var cc = request.getParameter('custpage_cc_emails');;
		var n = 0;
			
		var ccRTAN = request.getParameter('custpage_ccrtan_emails');;
		var r = 0;
		
		
		
		var records = new Object();
		//records['record'] = propertyId;
		//records['recordtype'] = '18';
		records['activity'] = id;
		//bsrEmail = 'abhirules01@gmail.com';//for now
		var stage = request.getParameter('custpage_stage');
		nlapiLogExecution( 'DEBUG',  'id', 'id '+id);
		//if(renSent == 'F')
		{
			//if(bsrNotifySent == 'F' && notificationMethod == '1' && enableEmailNotification == 'T' && bsrOptOutRTAN =='F' && bsrOneTimeOptOut =='F' && stage =='OPEN')
			
			{
				nlapiLogExecution( 'DEBUG',  'before  merge record id', 'id '+id);
				var body = nlapiMergeRecord(22, 'supportcase', id);
				nlapiLogExecution( 'DEBUG',  'before  send email BSR id', 'id '+id);
				if(bsrEmail)
				nlapiSendEmail('3847', bsrEmail, subject, body.getValue(), null, null, records);
				nlapiLogExecution( 'DEBUG',  'after email bsr id', 'id '+id);
				//nlapiSubmitField('supportcase', id, 'custevent_bsr_notify_sent', 'T');
				nlapiLogExecution( 'DEBUG',  'after submit field id', 'id '+id);
				if(ccRTAN && ccRTAN != undefined)
				{
					var noLinksBody = nlapiMergeRecord(23, 'supportcase', id);
					nlapiSendEmail('3847', ccRTAN, subject, noLinksBody.getValue(), ccRTAN, null, records);		
					nlapiLogExecution( 'DEBUG',  'after  ccRTAN email  id', 'id '+id);					
					//return true;
				}
			}
			
			//else if(renEnabled == 'T')
			{
				//*TEST ON SINGLE APPOINTMENT RECORD*if(renSent == 'F' && (statusID == '5' || statusID == '6') && (category == '1' || category == '2') && id == '695')
				//if(bsrOptOutRTAN == 'T' && (statusID == '5' || statusID == '6' || statusID == '11'))
				{
					var body = nlapiMergeRecord(1, 'supportcase', id);
					if(bsrEmail)
					{
						nlapiLogExecution( 'DEBUG',  'BEFORE   cc email  cc', 'cc '+cc);
						if(cc)
						{
							nlapiSendEmail('3847', bsrEmail, subject, body.getValue(), cc, null, records);
						}
						else
						{
							nlapiSendEmail('3847', bsrEmail, subject, body.getValue(), null, null, records);
						}
						nlapiLogExecution( 'DEBUG',  'after   cc email  cc', 'cc '+cc);					
					}
					
					else
					{
						nlapiLogExecution( 'DEBUG',  'BEFORE   cc email else  cc', 'cc '+cc);		
						if(cc)
						{
							var ccarr = cc.split(',');
							if(ccarr && (ccarr != 'undefined'))
							{
								nlapiSendEmail('3847', ccarr[0], subject, body.getValue(), cc, null, records);
							}
						}
						nlapiLogExecution( 'DEBUG',  'after   cc email else  cc', 'cc '+cc);					
					}

					//nlapiSubmitField('supportcase', id, 'custevent_ren_sent', 'T');
				}
			}
		}
		successForm();
	}
}

function successForm()
{
	var form = nlapiCreateForm("Success");
	//form.setScript(42);

	var success=form.addField('success', 'text', 'Email Sent Successfully .',null);
		success.setDisplayType('inline');
		
		form.addButton('custpage_ok','OK','window.close()');
	
	response.writePage(form);
}
function openSuitlet()
{
	window.open('https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=110&deploy=1','_blank');
}
function onInit()
{
	var statusID = window.opener.nlapiGetFieldValue('status');
	nlapiSetFieldValue('custpage_status',statusID);
	var id = window.opener.nlapiGetFieldValue('id');
	nlapiSetFieldValue('custpage_id',id);
	var propertyId = window.opener.nlapiGetFieldValue('custevent_property');
	nlapiSetFieldValue('custpage_property',propertyId);
	var propertyText = window.opener.nlapiGetFieldText('custevent_property');
	nlapiSetFieldValue('custpage_property_text',propertyText);
	var index = '';
	var builder = '';
	if(propertyText)
	{
		index = propertyText.indexOf("|");
		builder = propertyText.substring(index);
	}
	var category = window.opener.nlapiGetFieldValue('category');
	nlapiSetFieldValue('custpage_category',category);
	var renSent = window.opener.nlapiGetFieldValue('custevent_ren_sent')|| 'F';
	nlapiSetFieldValue('custpage_ren_sent',renSent);
	var renEnabled = window.opener.nlapiGetFieldValue('custevent_ren_enabled');
	nlapiSetFieldValue('custpage_ren_enabled',renEnabled);
	var topLevelBuilder = window.opener.nlapiGetFieldValue('custevent_builder');
	alert(' topLevelBuilder '+topLevelBuilder);
	nlapiSetFieldValue('custpage_builder',topLevelBuilder);
	var subdivision = window.opener.nlapiGetFieldValue('custevent_subdivision_for_ren');
	nlapiSetFieldValue('custpage_subdivision_for_ren',subdivision);
	var copyOnREN = null;
	var division = window.opener.nlapiGetFieldValue('company');
	nlapiSetFieldValue('custpage_company',division);
	var copyOnRENDivision = '';
	/*
	var builderDivision = nlapiLoadRecord('customer', division);
	var copyOnRENDivision = builderDivision.getFieldValues('custentity_copy_on_ren');
	var notificationMethod = builderDivision.getFieldValue('custentity_appt_notification_method');
	var enableEmailNotification = builderDivision.getFieldValue('custentity8');
	*/
	var showingAssist = window.opener.nlapiGetFieldValue('custevent_showing_assist');
	nlapiSetFieldValue('custpage_showing_assist',showingAssist);
	var bsrNotifySent = window.opener.nlapiGetFieldValue('custevent_bsr_notify_sent');
	nlapiSetFieldValue('custpage_bsr_notify_sent',bsrNotifySent);

	var agent = window.opener.nlapiGetFieldValue('custevent_caller_name');
	nlapiSetFieldValue('custpage_caller_name',agent);
	var bsrID = window.opener.nlapiGetFieldValue('custevent_builder_sales_rep_subd');
	nlapiSetFieldValue('custpage_builder_sales_rep_subd',bsrID);
	//var bsrRecord = nlapiLoadRecord('partner', bsrID);
	var smOptOut = window.opener.nlapiGetFieldValue('custevent_sm_opt_out');
	nlapiSetFieldValue('custpage_sm_opt_out',smOptOut);
	var dmOptOut = window.opener.nlapiGetFieldValue('custevent_dm_opt_out');
	nlapiSetFieldValue('custpage_dm_opt_out',dmOptOut);
	var adminOptOut = window.opener.nlapiGetFieldValue('custevent_admin_opt_out');
	nlapiSetFieldValue('custpage_admin_opt_out',adminOptOut);
	var smOptOutRTAN = window.opener.nlapiGetFieldValue('custevent_sm_opt_out_rtan');
	nlapiSetFieldValue('custpage_sm_opt_out_rtan',smOptOutRTAN);
	var dmOptOutRTAN = window.opener.nlapiGetFieldValue('custevent_dm_opt_out_rtan');
	nlapiSetFieldValue('custpage_dm_opt_out_rtan',dmOptOutRTAN);
	var adminOptOutRTAN = window.opener.nlapiGetFieldValue('custevent_admin_opt_out_rtan');
	nlapiSetFieldValue('custpage_admin_opt_out_rtan',adminOptOutRTAN);
	var bsrOptOut = window.opener.nlapiGetFieldValue('custevent_bsr_opt_out');
	nlapiSetFieldValue('custpage_bsr_opt_out',bsrOptOut);
	//var property = nlapiLoadRecord('customrecord_property_record', propertyId);
	//var houseNumber = property.getFieldValue('custrecord_house_number');
	//var street = property.getFieldText('custrecord31');
	//var lot = property.getFieldValue('custrecord_lot_number');
	//var subject = "New Inquiry For " + houseNumber + " " + street + ", " + subdivision + ", " + lot;
	var salesManagerEmail = window.opener.nlapiGetFieldValue('custevent_sales_mgr_email');
	nlapiSetFieldValue('custpage_sales_mgr_email',salesManagerEmail);
	var divManagerEmail = window.opener.nlapiGetFieldValue('custeventdivision_mgr_email');
	nlapiSetFieldValue('custpage_division_mgr_email',divManagerEmail);
	var adminAsstEmail = window.opener.nlapiGetFieldValue('custevent_administrative_contact_email');
	nlapiSetFieldValue('custpage_administrative_contact_email',adminAsstEmail);
	
	//var bsrEmail = bsrRecord.getFieldValue('email');
	//var bsrOptOutRTAN = bsrRecord.getFieldValue('custentity_opt_out_rtan');
	var bsrOneTimeOptOut = window.opener.nlapiGetFieldValue('custevent_one_time_rtan_opt_out');
	nlapiSetFieldValue('custpage_one_time_rtan_opt_out',bsrOneTimeOptOut);
	
	if(topLevelBuilder != null && topLevelBuilder != '')
	{
		var topLevelBuilderRecord = nlapiLoadRecord('customer', topLevelBuilder);
		copyOnREN = topLevelBuilderRecord.getFieldValues('custentity_copy_on_ren');
	}
	nlapiSetFieldValue('custpage_copy_on_ren',copyOnREN);
	
	var cc = '';//new Array();
	var n = 0;

	if(copyOnREN != null && copyOnREN != '')
	{
		if(copyOnREN[0].length == 1)
		{
			var copyUser = nlapiLoadRecord('partner', copyOnREN);
			var copyUserEmail = copyUser.getFieldValue('email');
			//cc[n] = copyUserEmail;
			if(cc == '')
			{
				cc = copyUserEmail;
			}
			else
			{
				cc = cc + ',' + copyUserEmail;
			}
			n++;
		}

		else
		{
			for(var i=0; copyOnREN.length > i; i++)
			{
				var copyUser = nlapiLoadRecord('partner', copyOnREN[i]);
				var copyUserEmail = copyUser.getFieldValue('email');
				//cc[n] = copyUserEmail;
				if(cc == '')
				{
					cc = copyUserEmail;
				}
				else
				{
					cc = cc + ',' + copyUserEmail;
				}
				n++;
			}
		}
	}

	if(copyOnRENDivision != null && copyOnRENDivision != '')
	{
		if(copyOnRENDivision[0].length == 1)
		{
			var copyUser = nlapiLoadRecord('partner', copyOnRENDivision);
			var copyUserEmail = copyUser.getFieldValue('email');
			//cc[n] = copyUserEmail;
			if(cc == '')
			{
				cc = copyUserEmail;
			}
			else
			{
				cc = cc + ',' + copyUserEmail;
			}
			n++;
		}

		else
		{
			for(var i=0; copyOnRENDivision.length > i; i++)
			{
				var copyUser = nlapiLoadRecord('partner', copyOnRENDivision[i]);
				var copyUserEmail = copyUser.getFieldValue('email');
				//cc[n] = copyUserEmail;
				if(cc == '')
				{
					cc = copyUserEmail;
				}
				else
				{
					cc = cc + ',' + copyUserEmail;
				}

				n++;
			}
		}
	}


	if(divManagerEmail != '' && divManagerEmail != null && dmOptOut == 'F')
	{
		cc[n] = divManagerEmail;
		n++;
	}

	if(salesManagerEmail != '' && salesManagerEmail != null && smOptOut == 'F')
	{
		cc[n] = salesManagerEmail;
		n++;
	}

	
	nlapiSetFieldValue('custpage_cc_emails',cc); 
	var ccRTAN = '';//new Array();
	var r = 0;

	if(divManagerEmail != '' && divManagerEmail != null && dmOptOutRTAN == 'F')
	{
		//ccRTAN[r] = divManagerEmail;
		if(ccRTAN == '')
		{
			ccRTAN = divManagerEmail;
		}
		else
		{
			ccRTAN = ccRTAN + ',' + divManagerEmail;
		}
		r++;
	}

	if(salesManagerEmail != '' && salesManagerEmail != null && smOptOutRTAN == 'F')
	{
		//ccRTAN[r] = salesManagerEmail;
		if(ccRTAN == '')
		{
			ccRTAN = salesManagerEmail;
		}
		else
		{
			ccRTAN = ccRTAN + ',' + salesManagerEmail;
		}
		r++;
	}

	nlapiSetFieldValue('custpage_ccrtan_emails',ccRTAN); 
	
	var records = new Object();
	records['record'] = propertyId;
	records['recordtype'] = '18';
	records['activity'] = id;

	var stage = window.opener.nlapiGetFieldValue('stage');
	nlapiSetFieldValue('custpage_stage',ccRTAN);

}

function setPropertyForREN()
{
	var propertyId = window.opener.nlapiGetFieldValue('custevent_property');
	if(propertyId != null && propertyId != '')
	{
		var property = nlapiLoadRecord('customrecord_property_record', propertyId);
		var houseNumber = property.getFieldValue('custrecord_house_number');
		var street = property.getFieldText('custrecord31');
		var builderDivision = property.getFieldValue('custrecord12');
		var builderDivisionRecord = nlapiLoadRecord('customer', builderDivision);
		var enableREN = builderDivisionRecord.getFieldValue('custentity_enable_ren');
		nlapiSetFieldValue('custevent_ren_enabled', enableREN);
		nlapiSetFieldValue('custevent_property_for_ren', houseNumber + " " + street);
	}

	return true;

}