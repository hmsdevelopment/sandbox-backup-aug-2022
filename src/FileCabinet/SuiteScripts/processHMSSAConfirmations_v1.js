function processHMSSAConfirmations()
{
	var date = new Date();
	var hour = date.getHours();
	var results = nlapiSearchRecord('supportcase', '248');
	for (var i=0; results != null && results.length > i; i++)
	{
		var record = nlapiLoadRecord('supportcase', results[i].getId());
		var bsrToFollowUpDateTime = record.getFieldValue('custevent_bsr_follow_up');
		var convertToDateObject = new Date(bsrToFollowUpDateTime);
		nlapiLogExecution('DEBUG', 'return value of bsrToFollowUpDateTime', 'bsrToFollowUpDateTime = ' + bsrToFollowUpDateTime);
		var hoursUntilbsrToFollowUp = (((date.getTime() - convertToDateObject.getTime())/3600000) + 3);
		nlapiLogExecution('DEBUG', 'return value of hoursUntilbsrToFollowUp', 'hoursUntilbsrToFollowUp = ' + hoursUntilbsrToFollowUp);
		
		if(hoursUntilbsrToFollowUp > 1)
		{
			var statusID = record.getFieldValue('status');
			var id = record.getFieldValue('id');
			var propertyId = record.getFieldValue('custevent_property');
			var category = record.getFieldValue('category');
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
			var property = nlapiLoadRecord('customrecord_property_record', propertyId);
			var houseNumber = property.getFieldValue('custrecord_house_number');
			var street = property.getFieldText('custrecord31');
			var lot = property.getFieldValue('custrecord_lot_number');
			var subject = "Showing Assist Confirmed For " + houseNumber + " " + street + ", " + subdivision + ", " + lot;
			
			
			var records = new Object();
			//records['record'] = propertyId;
			//records['recordtype'] = '18';
			records['activity'] = id;

                       
			//var body = nlapiMergeRecord(24, 'supportcase', id);
			var emailMerger1 = nlapiCreateEmailMerger(55);//55 is converted type of 24
			emailMerger1.setSupportCase(id);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
			nlapiSendEmail('3847', 'mlsinfo@hmsmarketingservices.com', subject, emailBody1, null, null, records, null, true);
			nlapiLogExecution('DEBUG', 'email sent', 'email sent for appointment = ' + id);
			record.setFieldValue('custevent_sa_notification_sent', 'T');
			nlapiSubmitRecord(record);
				
		}
	}
}