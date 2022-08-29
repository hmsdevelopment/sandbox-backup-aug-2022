function surveyBSRConfirmation()
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	month++;
	var year = date.getFullYear();
	var dateFormatted = month + "/" + day + "/" + year;

	var results = nlapiSearchRecord('supportcase', '109');

	for(var i=0; results != null && results.length > i; i++)
	{
		var appointment = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var id = appointment.getFieldValue('id');
		var propertyId = appointment.getFieldValue('custevent_property');
		var propertyText = appointment.getFieldText('custevent_property');
		var index = propertyText.indexOf("|");
		var builder = propertyText.substring(index);
		var bsrEmail;
		var showingDate = appointment.getFieldValue('custevent_showing_date_scheduled');
		var showingTime = appointment.getFieldValue('custevent_showing_time_scheduled');
		var request1 = appointment.getFieldValue('custevent_bsr_conf_request_1');
		var request2 = appointment.getFieldValue('custevent_bsr_conf_request_2');
		var request3 = appointment.getFieldValue('custevent_bsr_conf_request_3');
		var subdivision = appointment.getFieldValue('custevent_subdivision_for_ren');

		var showingEndTime = appointment.getFieldValue('custevent_showing_end_time');
	
		var rangeTime = isApptPrevious(showingEndTime);
	
		nlapiLogExecution('DEBUG','Range time ' + rangeTime );

		var agent = appointment.getFieldValue('custevent_caller_name');
		var bsrID = appointment.getFieldValue('custevent_builder_sales_rep_subd');

		nlapiLogExecution('DEBUG','brsID ' +bsrID, 'property '+ propertyId);

		if(bsrID != null && bsrID != '' && propertyId != null && propertyId != '' && rangeTime == false)
		{
			var bsrRecord = nlapiLoadRecord('partner', bsrID);
			bsrEmail = bsrRecord.getFieldValue('email');
			var type = bsrRecord.getFieldValue('custentity_team_type');
			var members = type == '6' ? String(bsrRecord.getFieldValue('custentity_team_members')).split("\u0005") : ''
			nlapiLogExecution('DEBUG','members ' +  members) ;

			nlapiLogExecution('DEBUG','property',propertyId);

			if(bsrEmail != '' && bsrEmail != null)
			{
			  
				nlapiLogExecution('DEBUG','Email will be sent to BSR Email',bsrEmail);
				var property = nlapiLoadRecord('customrecord_property_record', propertyId);
				var houseNumber = property.getFieldValue('custrecord_house_number');
				var street = property.getFieldText('custrecord31');
				var lot = property.getFieldValue('custrecord_lot_number');
				nlapiLogExecution('DEBUG','Appointment id ' +  id) ;
				//var subject = "Confirming Appointment for " + houseNumber + " " + street + ", " + showingDate + ", " + showingTime + ", Subdivision: " + subdivision + ", Lot: " + lot;
				
              	if(request1 == null || request1 == '')
                {
                  var subject = "Did Your Showing for " + houseNumber + " " + street + " Today at " + showingTime + " Take Place as Scheduled?";
                }
              	else if(request2 == null || request2 == '')
                {
                  var subject = "Did Your Showing for " + houseNumber + " " + street + " Yesterday at " + showingTime + " Take Place as Scheduled?";
                }
              	else if(request3 == null || request3 == '')
                {
                  var subject = "Did Your Showing for " + houseNumber + " " + street + " Two Days Ago at " + showingTime + " Take Place as Scheduled?";
                }
              	else
                {
                  var subject = "Did Your Showing for " + houseNumber + " " + street + " on " + showingDate + " at " + showingTime + " Take Place as Scheduled?";
                }

				var records = new Object();
				records['activity'] = id;

				var cc = new Array();
				cc[0] = 'callcenter@hmsmarketingservices.com';

				nlapiLogExecution('DEBUG','members ' +  members.length) ;


				// Add new logic for Team members
				for (var j = 0; type == '6' ? j < members.length : j < 1; j++) {
					nlapiLogExecution('DEBUG','j ' +  members[j]) ;

					if (type == '6') {
						var member = nlapiLoadRecord('partner', members[j]);
						var emailMember = member.getFieldValue('email')
					}
			
					//var body = nlapiMergeRecord(4, 'supportcase', id);
					var emailMerger1 = nlapiCreateEmailMerger(117);//73 is converted type of 4
					emailMerger1.setSupportCase(id);
					var mergeResult1 = emailMerger1.merge();
					var emailBody1 = mergeResult1.getBody();
					nlapiSendEmail('3847', type == '6' ?  emailMember : bsrEmail, subject, emailBody1, cc, null, records);
					nlapiLogExecution('DEBUG','EMAIL Sended - Subject' ,subject);
				}
				

				if(request1 == null || request1 == '')
				{
					appointment.setFieldValue('custevent_bsr_conf_request_1', dateFormatted);
					nlapiSubmitRecord(appointment);
				}

				else if(request2 == null || request2 == '')
				{
					appointment.setFieldValue('custevent_bsr_conf_request_2', dateFormatted);
					nlapiSubmitRecord(appointment);
				}

				else if(request3 == null || request3 == '')
				{
					appointment.setFieldValue('custevent_bsr_conf_request_3', dateFormatted);
					nlapiSubmitRecord(appointment);
				}
			}
		}
	}
}

function isApptPrevious(pShowingEndTime){
	if(pShowingEndTime){
		var now = moment().tz("America/New_York");
		var appt = moment().tz("America/New_York");

		nlapiLogExecution('DEBUG','ntTime',now);
		now.seconds(0);
		now.minutes(0);

		appt.seconds(0);
		appt.minutes();
		appt.hours(0);

		//NY time format 2020-03-30T10:57:49-04:00

		var showingEndTimeHour = Number(pShowingEndTime.split(':')[0]);
		var showingEndTimeMinutes = Number(pShowingEndTime.split(":")[1].split(' ')[0]);
		var showingEndTimeAmPm = pShowingEndTime.split(' ')[1];

		//If the hour is greater than 12, add 12 to make it 24h format
		showingEndTimeHour = (showingEndTimeAmPm == "pm"  && showingEndTimeHour < 12) ? (showingEndTimeHour + 12) : showingEndTimeHour; 

		appt.hours(showingEndTimeHour);
		appt.minutes(showingEndTimeMinutes);

		var hourDifference = now.diff(appt, 'hours', true);
		
		nlapiLogExecution('DEBUG','nowHour ', now.format());

		nlapiLogExecution('DEBUG','showingEndTimeHour', appt.format());

	
		nlapiLogExecution('DEBUG','hour difference', hourDifference);	
		nlapiLogExecution('DEBUG','hour difference gt 0', hourDifference > 0);	

		return hourDifference > 0 ? true : false;
		
	}
	else {
		return false;
	}
}