var bcc = [];
bcc.push('pranjal@webbee.biz');
bcc.push('aj@webbeeglobal.com');

function rapidEmailNotification(type)
{
	try
	{
		nlapiLogExecution('DEBUG', 'type : '+type);
	//	if(type == 'edit' || type== 'create')
		//{
		var builder=nlapiGetFieldValue('company');
		if(builder!='3643'&&builder!='3642'){
			var statusID = nlapiGetFieldValue('status');
			var id = nlapiGetRecordId();
			var searchType = nlapiGetFieldValue('custevent_subdivision_search');
			var subdivisionId = nlapiGetFieldValue('custevent_subdivision');
			var propertyText = nlapiGetFieldText('custevent_property');
			var copyToBuilder = nlapiGetFieldValues('custevent_hms_copy_to_ren1');
			var copytobuilderarray = [];
			if(copyToBuilder)
			{
				for(var a in copyToBuilder)
				copytobuilderarray.push(copyToBuilder[a]);
			}
			var copyToBuilderCount = 0
			if(copytobuilderarray);
			copyToBuilderCount = copytobuilderarray.length;
				
			var builderSuppliedLead = nlapiGetFieldValue('custevent_builder_lead');
			var index = propertyText.indexOf("|");
			var builder = propertyText.substring(index);
			var category = nlapiGetFieldValue('category');
			var renSent = nlapiGetFieldValue('custevent_ren_sent');
			var renEnabled = nlapiGetFieldValue('custevent_ren_enabled');
			var topLevelBuilder = nlapiGetFieldValue('custevent_builder');
			var subdivision = nlapiGetFieldValue('custevent_subdivision_for_ren');
			var copyOnREN = null;
			var copyOnBuilderLeads = null;
			var copyOnBuilderLeadsDivision = null;
			var division = nlapiGetFieldValue('company')|| '';
			var companyText = nlapiGetFieldText('company');
			var copyOnRENDivision = '';
			var notificationMethod = '';
			var enableEmailNotification = '';
			var bsrTemplate = 0
			var smTemplate = 0
			if(division)
			{
				var builderDivision = nlapiLoadRecord('customer', division);
				
				copyOnRENDivision = builderDivision.getFieldValues('custentity_copy_on_ren');
				notificationMethod = builderDivision.getFieldValue('custentity_appt_notification_method');
				enableEmailNotification = builderDivision.getFieldValue('custentity8');
			}
			var showingAssist = nlapiGetFieldValue('custevent_showing_assist');
			var bsrNotifySent = nlapiGetFieldValue('custevent_bsr_notify_sent');

			var agent = nlapiGetFieldValue('custevent_caller_name');
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
			
			var bsrID = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
			var bsrFname = '';
			var bsrLname = '';
			if(bsrID)
			{
				var bsrRecord = nlapiLoadRecord('partner', bsrID);
				bsrFname = bsrRecord.getFieldValue('firstname');
				bsrLname = bsrRecord.getFieldValue('lastname');
			}
			var smOptOut = nlapiGetFieldValue('custevent_sm_opt_out');
			var dmOptOut = nlapiGetFieldValue('custevent_dm_opt_out');
			var adminOptOut = nlapiGetFieldValue('custevent_admin_opt_out');
			var smOptOutRTAN = nlapiGetFieldValue('custevent_sm_opt_out_rtan');
			var dmOptOutRTAN = nlapiGetFieldValue('custevent_dm_opt_out_rtan');
			var dmID = nlapiGetFieldValue('custevent8');
			var optOutBuilderLeads = 'F';
			if (dmID)
			{
				var dmRecord = nlapiLoadRecord('partner', dmID);
				optOutBuilderLeads = dmRecord.getFieldValue('custentity_opt_out_builder_leads');
			}
			var smID = nlapiGetFieldValue('custevent7');
			if (smID)
			{
				var smRecord = nlapiLoadRecord('partner', smID);
				smOptOutBuilderLeads = smRecord.getFieldValue('custentity_opt_out_builder_leads');
			}
			var adminOptOutRTAN = nlapiGetFieldValue('custevent_admin_opt_out_rtan');
			var bsrOptOut = nlapiGetFieldValue('custevent_bsr_opt_out');
			if (searchType == '1')
			{
				var propertyId = nlapiGetFieldValue('custevent_property');
				var houseNumber = '';
					var street = '';
					var lot = '';
				if(propertyId)
				{
					var property = nlapiLoadRecord('customrecord_property_record', propertyId);
					 houseNumber = property.getFieldValue('custrecord_house_number');
					 street = property.getFieldText('custrecord31');
					 lot = property.getFieldValue('custrecord_lot_number');
					 bsrTemplate = 48;//22
					 smTemplate = 62;//23
				}
				if (builderSuppliedLead == 'T')
				{
					var subject = "New Web Lead Assigned To " + bsrFname + ' ' + bsrLname + " For " + agentFullName; //subdivision + " Lot " + lot;
				}
				else
				{
					if(lot)
					{
						var subject = "New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;
					}
					else
					{
						var subject = "New Inquiry From " + agentFullName + " For " + subdivision
					}
					
				}
			}
			else if (searchType == '2')
			{
				var subject = "New Web Lead Assigned To " + bsrFname + ' ' + bsrLname + " For " + agentFullName; //subdivision;
				bsrTemplate = 63;//34
				smTemplate = 64;//35
			}
			else if (searchType == '3')
			{
				var subject = "New Web Lead Assigned To " + bsrFname + ' ' + bsrLname + " For " + agentFullName; // companyText;
				//if (copyToBuilderCount == 1)
				//{
					bsrTemplate = 66;//39
					smTemplate = 67;//41
				//}
				//else
				//{
				//	bsrTemplate = 36;
				//}
				
			}
			var salesManagerEmail = nlapiGetFieldValue('custevent_sales_mgr_email');
			var divManagerEmail = nlapiGetFieldValue('custeventdivision_mgr_email');
			var adminAsstEmail = nlapiGetFieldValue('custevent_administrative_contact_email');
			var bsrEmail = bsrRecord.getFieldValue('email');
			var bsrOptOutRTAN = bsrRecord.getFieldValue('custentity_opt_out_rtan');
			var bsrOneTimeOptOut = nlapiGetFieldValue('custevent_one_time_rtan_opt_out');
			
			if(topLevelBuilder != null && topLevelBuilder != '')
			{
				var topLevelBuilderRecord = nlapiLoadRecord('customer', topLevelBuilder);
				copyOnREN = topLevelBuilderRecord.getFieldValues('custentity_copy_on_ren');
				if (builderSuppliedLead == 'T')
				{
					copyOnBuilderLeads = topLevelBuilderRecord.getFieldValues('custentity_copy_on_builder_leads');
				}
			}

			var cc = new Array();
			var n = 0;
			
			if(copyOnREN != null && copyOnREN != '')
			{
				if(copyOnREN[0].length == 1)
				{
					var copyUser = nlapiLoadRecord('partner', copyOnREN);
					var copyUserEmail = copyUser.getFieldValue('email');
					cc[n] = copyUserEmail;
					n++;
				}

				else
				{
					for(var i=0; copyOnREN.length > i; i++)
					{
						var copyUser = nlapiLoadRecord('partner', copyOnREN[i]);
						var copyUserEmail = copyUser.getFieldValue('email');
						cc[n] = copyUserEmail;
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
					cc[n] = copyUserEmail;
					n++;
				}

				else
				{
					for(var i=0; copyOnRENDivision.length > i; i++)
					{
						var copyUser = nlapiLoadRecord('partner', copyOnRENDivision[i]);
						var copyUserEmail = copyUser.getFieldValue('email');
						cc[n] = copyUserEmail;
						n++;
					}
				}
			}

			if(divManagerEmail != '' && divManagerEmail != null && dmOptOut == 'F')
			{
				cc[n] = divManagerEmail;
				n++;
			}
		
			if (salesManagerEmail)
			{
				if(salesManagerEmail != '' && salesManagerEmail != null && smOptOut == 'F')
				{
					cc[n] = salesManagerEmail;
					n++;
				}
			}
			/*
			if(adminAsstEmail != '' && adminAsstEmail != null && adminOptOut == 'F')
			{
				cc[n] = adminAsstEmail;
				n++;
			}*/
			
			if(division != null && division != '')
			{
				var divisionRecord = nlapiLoadRecord('customer', division);
				copyOnBuilderLeadsDivision = divisionRecord.getFieldValues('custentity_copy_on_builder_leads');
			}
			
			var ccRTAN = new Array();
			
			
			if (builderSuppliedLead == 'T')
			{
				ccRTAN[0] = 'ahencheck@hmsmarketingservices.com'
				var r = 1;
				if(copyOnBuilderLeads != null && copyOnBuilderLeads != '')
				{
					if(copyOnBuilderLeads[0].length == 1)
					{
						var copyUser = nlapiLoadRecord('partner', copyOnBuilderLeads);
						var copyUserEmail = copyUser.getFieldValue('email');
						ccRTAN[r] = copyUserEmail;
						r++;
					}

					else
					{
						for(var i=0; copyOnBuilderLeads.length > i; i++)
						{
							var copyUser = nlapiLoadRecord('partner', copyOnBuilderLeads[i]);
							var copyUserEmail = copyUser.getFieldValue('email');
							ccRTAN[r] = copyUserEmail;
							r++;
						}
					}
				}
				if(copyOnBuilderLeadsDivision != null && copyOnBuilderLeadsDivision != '')
				{
					if(copyOnBuilderLeadsDivision[0].length == 1)
					{
						var copyUser = nlapiLoadRecord('partner', copyOnBuilderLeadsDivision);
						var copyUserEmail = copyUser.getFieldValue('email');
						ccRTAN[r] = copyUserEmail;
						r++;
					}

					else
					{
						for(var i=0; copyOnBuilderLeadsDivision.length > i; i++)
						{
							var copyUser = nlapiLoadRecord('partner', copyOnBuilderLeadsDivision[i]);
							var copyUserEmail = copyUser.getFieldValue('email');
							ccRTAN[r] = copyUserEmail;
							r++;
						}
					}
				}
			}
			else
			{
				r = 0;
			}
			
			if (builderSuppliedLead == 'F')
			{
				if(copyOnREN != null && copyOnREN != '')
				{
					if(copyOnREN[0].length == 1)
					{
						var copyUser = nlapiLoadRecord('partner', copyOnREN);
						var copyUserEmail = copyUser.getFieldValue('email');
						ccRTAN[r] = copyUserEmail;
						r++;
					}

					else
					{
						for(var i=0; copyOnREN.length > i; i++)
						{
							var copyUser = nlapiLoadRecord('partner', copyOnREN[i]);
							var copyUserEmail = copyUser.getFieldValue('email');
							ccRTAN[r] = copyUserEmail;
							r++;
						}
					}
				}

				if(copyOnRENDivision != null && copyOnRENDivision != '')
				{
					if(copyOnRENDivision[0].length == 1)
					{
						var copyUser = nlapiLoadRecord('partner', copyOnRENDivision);
						var copyUserEmail = copyUser.getFieldValue('email');
						ccRTAN[r] = copyUserEmail;
						r++;
					}

					else
					{
						for(var i=0; copyOnRENDivision.length > i; i++)
						{
							var copyUser = nlapiLoadRecord('partner', copyOnRENDivision[i]);
							var copyUserEmail = copyUser.getFieldValue('email');
							ccRTAN[r] = copyUserEmail;
							r++;
						}
					}
				}
			}
			
			if(builderSuppliedLead == 'T')
			{
				if(divManagerEmail != '' && divManagerEmail != null && optOutBuilderLeads == 'F')
				{
					ccRTAN[r] = divManagerEmail;
					r++;
				}
			}
			else
			{
				if(divManagerEmail != '' && divManagerEmail != null && dmOptOutRTAN == 'F')
				{
					ccRTAN[r] = divManagerEmail;
					r++;
				}
			}
			if(builderSuppliedLead == 'T')
			{
				if(salesManagerEmail != '' && salesManagerEmail != null && smOptOutBuilderLeads == 'F')
				{
					ccRTAN[r] = salesManagerEmail;
					r++;
				}
			}
			else
			{
				if(salesManagerEmail != '' && salesManagerEmail != null && smOptOutRTAN == 'F')
				{
					ccRTAN[r] = salesManagerEmail;
					r++;
				}
			}

			/*if(adminAsstEmail != '' && adminAsstEmail != null && adminOptOutRTAN == 'F')
			{
				ccRTAN[r] = adminAsstEmail;
				r++;
			}*/

			
			var records = new Object();
			//records['record'] = propertyId;
			//records['recordtype'] = '18';
			records['activity'] = id;

			var stage = nlapiGetFieldValue('stage');
			var currenttime = currentdatetime();
			if(renSent == 'F')
			{
				if(bsrNotifySent == 'F' && notificationMethod == '1' && enableEmailNotification == 'T' && bsrOptOutRTAN =='F' && bsrOneTimeOptOut =='F' && stage =='OPEN')
				{
					
					//var body = nlapiMergeRecord(bsrTemplate, 'supportcase', id);
					var emailBody1 = '';
					if(bsrID == 4126)
					{
						var url = nlapiResolveURL('SUITELET',181,1,true);
						url += '&apptid='+id;
						
						emailBody1 += '<br/><br/>';
						emailBody1 += '<b>Please click over ';
						emailBody1 += '<a target = "_blank" href = "'+url+'">';
						emailBody1 += 'I Will Follow Up';
						emailBody1 += '</a>';
						emailBody1 +=' link to close this case ..</b><br/><br/>';
					}	
					
					var emailMerger1 = nlapiCreateEmailMerger(bsrTemplate);
					emailMerger1.setSupportCase(id);
					var mergeResult1 = emailMerger1.merge();
					 emailBody1 += mergeResult1.getBody();
					
				    if(bsrID == 4126)
					nlapiSendEmail('3847', bsrEmail, subject, emailBody1, null, bcc, records, null, true);
					else
					nlapiSendEmail('3847', bsrEmail, subject, emailBody1, null, null, records, null, true); 
	    
					nlapiSubmitField('supportcase', id, 'custevent_bsr_notify_sent', 'T');			
					nlapiSubmitField('supportcase', id, 'custevent_hms_last_ren_sent_date_time',currenttime);
					
					if(ccRTAN[0])
					{
						//var noLinksBody = nlapiMergeRecord(smTemplate, 'supportcase', id);
						var emailMerger2 = nlapiCreateEmailMerger(smTemplate);
						emailMerger2.setSupportCase(id);
						var mergeResult2 = emailMerger2.merge();
						var emailBody2 = mergeResult2.getBody();
						nlapiSendEmail('3847', ccRTAN[0], subject, emailBody2, ccRTAN, null, records, null, true);				
						return true;
					}
							
				}
				
				else if(renEnabled == 'T')
				{
					//*TEST ON SINGLE APPOINTMENT RECORD*if(renSent == 'F' && (statusID == '5' || statusID == '6') && (category == '1' || category == '2') && id == '695')
					if(bsrOptOutRTAN == 'T' && (statusID == '5' || statusID == '6' || statusID == '11'))
					{
						//var body = nlapiMergeRecord(1, 'supportcase', id);
						var emailMerger2 = nlapiCreateEmailMerger(68);
						emailMerger2.setSupportCase(id);
						var mergeResult2 = emailMerger2.merge();
						var emailBody2 = mergeResult2.getBody();
						
						if(bsrEmail != '' && bsrEmail != null)
							nlapiSendEmail('3847', bsrEmail, subject, emailBody2, cc, null, records, null, true);
						else				
							nlapiSendEmail('3847', cc[0], subject, emailBody2, cc, null, records, null, true);

						nlapiSubmitField('supportcase', id, 'custevent_ren_sent', 'T');
						nlapiSubmitField('supportcase', id, 'custevent_hms_last_ren_sent_date_time',currenttime);
					}
				}
			}
	//	}	
	
	}}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Message', e.message);
	}
}

function currentdatetime()
{
	var cdate = new Date();
	var time = nlapiDateToString(cdate,'datetimetz');
	//time = nlapiStringToDate(time,'datetimetz');
	return time;
}

function setPropertyForREN()
{
	try
	{
	 var builder=nlapiGetFieldValue('company');
		if(builder!='3643'&&builder!='3642'){
	var propertyId = nlapiGetFieldValue('custevent_property');
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
	}}

	return true;
	}
	catch(e)
	{
		return true;
	}

}