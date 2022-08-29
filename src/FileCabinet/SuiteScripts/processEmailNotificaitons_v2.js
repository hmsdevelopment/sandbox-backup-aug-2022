function processEmailNotifications()
{
	var date = new Date();
	var hour = date.getHours();
	if(hour >= 18)
	{
		return;
	}
	else
	{
		var results = nlapiSearchRecord('supportcase', '244');
		for (var i=0; results != null && results.length > i; i++)
		{
			var record = nlapiLoadRecord('supportcase', results[i].getId());
			var id = record.getFieldValue('id');
			nlapiLogExecution('DEBUG', 'Variables', 'case id = ' + id);
			var builderSuppliedLead = record.getFieldValue('custevent_builder_lead');
			var category = record.getFieldValue('category');
			var showingDateTime = record.getFieldValue('custevent_showing_date_time');
			var lastEmailTime = record.getFieldValue('custevent_hms_last_ren_sent_date_time');
			var hoursSinceLastEmail = 1;
			var minutesSinceLastEmail = 1;
			if(lastEmailTime)
			{
				var convertLastEmailToDateObject = new Date(lastEmailTime);
				hoursSinceLastEmail = ((date.getTime() - convertLastEmailToDateObject.getTime())/3600000);
				minutesSinceLastEmail = hoursSinceLastEmail * 60;
				//nlapiLogExecution('DEBUG', 'Variables', 'hoursSinceLastEmail = ' + hoursSinceLastEmail);
			}
			
			var convertToDateObject = new Date(showingDateTime);			
			var hoursUntilShowing = ((convertToDateObject.getTime() - date.getTime())/3600000);
			var emailNotificationAttempts = record.getFieldValue('custevent_email_notification_attempts');
			var records = new Object();
			records['activity'] = id;

			
			if(emailNotificationAttempts > 2)
			{
				//This is where an email will get sent out to the 'assigned to' and mlsinfo@hmsmarketingservices.com
				var emailMerger = nlapiCreateEmailMerger(48);//48 is converted type of 22
				emailMerger.setSupportCase(id);
				var mergeResult = emailMerger.merge();
				var emailBody = mergeResult.getBody();

				var assignedTo = record.getFieldValue('assigned');
				/*if(assignedTo)
				{
					var employeeRecord = nlapiLoadRecord('employee', assignedTo);
					var employeeEmail = employeeRecord.getFieldValue('email');
					nlapiSendEmail('3847', employeeEmail, 'Lead follow up required', emailBody, 'mlsinfo@hmsmarketingservices.com', null, records);
					return;
				}
				else
				{
					nlapiSendEmail('3847', 'mlsinfo@hmsmarketingservices.com', 'Lead follow up required', emailBody, null, null, records, null, true);
					return;
				}*/
			}
			
			if(((hoursUntilShowing < 24 && hoursUntilShowing > 2) || builderSuppliedLead == 'T' || category == '1') && minutesSinceLastEmail > 30)
			{
				nlapiLogExecution('DEBUG', 'Variables', 'Entered the main if statement on record ' + id);
				var statusID = record.getFieldValue('status');
				var propertyId = record.getFieldValue('custevent_property');
				var renSent = record.getFieldValue('custevent_ren_sent');
				var renEnabled = record.getFieldValue('custevent_ren_enabled');
				var topLevelBuilder = record.getFieldValue('custevent_builder');
				var subdivision = record.getFieldValue('custevent_subdivision_for_ren');
				var copyOnREN = null;
				var division = record.getFieldValue('company');
				var builderDivision = nlapiLoadRecord('customer', division);
				var copyOnRENDivision = builderDivision.getFieldValues('custentity_copy_on_ren');
				var notificationMethod = builderDivision.getFieldValue('custentity_appt_notification_method');
				var enableEmailNotification = builderDivision.getFieldValue('custentity8');
				var showingAssist = record.getFieldValue('custevent_showing_assist');

				var agent = record.getFieldValue('custevent_caller_name');
				var bsrID = record.getFieldValue('custevent_builder_sales_rep_subd');
				var bsrRecord = nlapiLoadRecord('partner', bsrID);
				var bsrOptOut = record.getFieldValue('custevent_bsr_opt_out');
				if(propertyId)
				{
					var property = nlapiLoadRecord('customrecord_property_record', propertyId);
					var houseNumber = property.getFieldValue('custrecord_house_number');
					var street = property.getFieldText('custrecord31');
					var lot = property.getFieldValue('custrecord_lot_number');
				}
				var agentRecord = nlapiLoadRecord('customrecord_agent', agent);
				var agentFirstName = agentRecord.getFieldValue('custrecord_agent_first_name');
				var agentLastName = agentRecord.getFieldValue('custrecord_agent_last_name');
				var agentFullName = agentFirstName + ' ' + agentLastName;
				var subject = "Reminder: New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;
				var bsrEmail = bsrRecord.getFieldValue('email');
				var cc = new Array();
				var salesManager = record.getFieldValue('custevent7');
				if(salesManager)
				{
					var salesManagerRecord = nlapiLoadRecord('partner', salesManager);
					var salesManagerEmail = salesManagerRecord.getFieldValue('email');
					cc[0] = salesManagerEmail;
				}
				
				if(notificationMethod == '1' && enableEmailNotification == 'T')
				{
					if(statusID == '1' || statusID == '10' || statusID == '2' || statusID == '3') 
					{
						/*if(showingAssist == 'T')
						{
							var body = nlapiMergeRecord(20, 'supportcase', id);
							nlapiSendEmail('3847', bsrEmail, subject, body.getValue(), null, null, records);
						}
						
						else
						{*/
							//var body = nlapiMergeRecord(22, 'supportcase', id);
							
							nlapiLogExecution('DEBUG', 'Variables', 'Getting ready to send the email on record ' + id);
							var emailMerger1 = nlapiCreateEmailMerger(48);//48 is converted type of 22
							emailMerger1.setSupportCase(id);
							var mergeResult1 = emailMerger1.merge();
							var emailBody1 = mergeResult1.getBody();
							nlapiSendEmail('3847', bsrEmail, subject, emailBody1, cc, null, records, null, true);
							emailNotificationAttempts++;
							record.setFieldValue('custevent_email_notification_attempts', emailNotificationAttempts);
							nlapiSubmitRecord(record);
						/*}*/
					}		
				}
			}
		}
	}
}