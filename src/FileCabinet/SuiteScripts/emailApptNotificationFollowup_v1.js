function emailApptNotificationFollowup()
{
	var results = nlapiSearchRecord('supportcase', '238');
	
	for(var i=0; results != null && results.length > i; i++)
	{
		var id = results[i].getId();
		var appointment = nlapiLoadRecord('supportcase', id);
		var searchType = nlapiGetFieldValue('custevent_subdivision_search');
		var showingAssist = appointment.getFieldValue('custevent_showing_assist');
		var subdivision = appointment.getFieldValue('custevent_subdivision_for_ren');
		var topLevelBuilder = appointment.getFieldValue('custevent_builder');
		//var propertyID = appointment.getFieldValue('custevent_property');
		//var property = nlapiLoadRecord('customrecord_property_record', propertyID);
		//var houseNumber = property.getFieldValue('custrecord_house_number');
		//var street = property.getFieldText('custrecord31');
		//var lot = property.getFieldValue('custrecord_lot_number');
		//var subject = "Reminder: New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;
		var bsrTemplate = 0;
		var smTemplate = 0;
		var copyOnREN = null;
		var division = appointment.getFieldValue('company');
		if (division)
		{
			var builderDivision = nlapiLoadRecord('customer', division);
		}
		var copyOnRENDivision = builderDivision.getFieldValues('custentity_copy_on_ren');
		
		var bsrID = appointment.getFieldValue('custevent_builder_sales_rep_subd');
		var bsrRecord = nlapiLoadRecord('partner', bsrID);
		var smOptOut = appointment.getFieldValue('custevent_sm_opt_out');
		var dmOptOut = appointment.getFieldValue('custevent_dm_opt_out');
		var adminOptOut = appointment.getFieldValue('custevent_admin_opt_out');
		var bsrOptOut = appointment.getFieldValue('custevent_bsr_opt_out');
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
			var subject = "Reminder: New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;
		}
		else if (searchType == '2')
		{
			var subject = "Reminder: New Web Lead Assigned To " + bsrFname + ' ' + bsrLname + " For " + subdivision;
			bsrTemplate = 63;//34
			smTemplate = 64;//35
		}
		else if (searchType == '3')
		{
			var subject = 'Builder Division Filler Here'
		}
		var salesManagerEmail = appointment.getFieldValue('custevent_sales_mgr_email');
		var divManagerEmail = appointment.getFieldValue('custeventdivision_mgr_email');
		var adminAsstEmail = appointment.getFieldValue('custevent_administrative_contact_email');
		var bsrEmail = bsrRecord.getFieldValue('email');
		nlapiLogExecution('error', 'bsremail', 'bsrEmail = ' + bsrEmail);
		if(topLevelBuilder != null && topLevelBuilder != '')
		{
			var topLevelBuilderRecord = nlapiLoadRecord('customer', topLevelBuilder);
			copyOnREN = topLevelBuilderRecord.getFieldValues('custentity_copy_on_ren');
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

		if(salesManagerEmail != '' && salesManagerEmail != null && smOptOut == 'F')
		{
			cc[n] = salesManagerEmail;
			n++;
		}

		if(adminAsstEmail != '' && adminAsstEmail != null && adminOptOut == 'F')
		{
			cc[n] = adminAsstEmail;
			n++;
		}

		var records = new Object();
		records['supportcase'] = id;

		if(showingAssist == 'T')
		{
			//var body = nlapiMergeRecord(bsrTemplate, 'supportcase', id);
			var emailMerger1 = nlapiCreateEmailMerger(bsrTemplate);//60 is converted type of 12
			emailMerger1.setSupportCase(id);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
			nlapiSendEmail('3847', bsrEmail, subject, emailBody1, null, null, records);
			
			
			var emailMerger2 = nlapiCreateEmailMerger(smTemplate);//60 is converted type of 12
			emailMerger2.setSupportCase(id);
			var mergeResult2 = emailMerger2.merge();
			var emailBody2 = mergeResult2.getBody();
			//var noLinksBody = nlapiMergeRecord(smTemplate, 'supportcase', id);
			nlapiSendEmail('3847', cc[0], subject, emailBody2, cc, null, records);				
		}
		
		else
		{
			var emailMerger1 = nlapiCreateEmailMerger(bsrTemplate);//60 is converted type of 12
			emailMerger1.setSupportCase(id);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
			//var body = nlapiMergeRecord(bsrTemplate, 'supportcase', id);
			nlapiSendEmail('3847', bsrEmail, subject, emailBody1, null, null, records);
			nlapiLogExecution('error', 'email', 'Sent email');
			
			var emailMerger2 = nlapiCreateEmailMerger(smTemplate);//60 is converted type of 12
			emailMerger2.setSupportCase(id);
			var mergeResult2 = emailMerger2.merge();
			var emailBody2 = mergeResult2.getBody();
			//var noLinksBody = nlapiMergeRecord(smTemplate, 'supportcase', id);
			nlapiSendEmail('3847', cc[0], subject, emailBody2, cc, null, records);				
		}
	}
}