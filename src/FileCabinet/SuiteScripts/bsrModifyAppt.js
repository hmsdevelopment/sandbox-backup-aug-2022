/*
Author:  Michael Hulshult
Date: 8/14/2013
*/

function bsrApptModification(request, response)
{
   if (request.getMethod() == 'GET')
   {
      //This portion of the script is executed when the page is loaded

      var form = nlapiCreateForm('Appointment Modification');
	  var group = form.addFieldGroup('fieldgroup', 'Modify Appointment Details');
	  var cancelGroup = form.addFieldGroup('cancelfieldgroup', 'Cancel Appointment');
	  
      var apptID = request.getParameter('apptid');
  	  var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
	  var property = appointmentRecord.getFieldValue('custevent_property_for_ren');
	  var currentDate = appointmentRecord.getFieldValue('custevent_showing_date_scheduled');
	  var currentTime = appointmentRecord.getFieldValue('custevent_showing_time_scheduled');
	  
	  var propertyField = form.addField('property', 'text', 'Property', null, 'fieldgroup').setDisplayType('inline');
	  var currentDateField = form.addField('currentdate', 'date', 'Current Date', null, 'fieldgroup').setDisplayType('inline');
	  var currentTimeField = form.addField('currenttime', 'timeofday', 'Current Time', null, 'fieldgroup').setDisplayType('inline');
	  var newDateField = form.addField('newdate', 'date', 'New Date', null, 'fieldgroup');
	  var newTimeField = form.addField('newtime', 'timeofday', 'New Time', null, 'fieldgroup');
	  var appointmentIDField = form.addField('apptid', 'text', 'appt').setDisplayType('hidden');
	  var cancelField = form.addField('cancel', 'checkbox', 'Cancel Appointment', null, 'cancelfieldgroup');
	  var cancellationReason = form.addField('cancelreason', 'text', 'Cancellation Reason', null, 'cancelfieldgroup');
	  
	  form.setFieldValues({property:property,currentdate:currentDate,currenttime:currentTime,apptid:apptID});
	  form.addSubmitButton('Submit');
	  group.setSingleColumn(true);
	  cancelGroup.setSingleColumn(true);
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
	  
	  var form = nlapiCreateForm('Appointment Modification');

      var apptID = request.getParameter('apptid');
	  var cancel = request.getParameter('cancel');
	  if(cancel == 'T')
	  {
		var reason = request.getParameter('cancelreason');
		var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
		appointmentRecord.setFieldValue('status', '5');
		appointmentRecord.setFieldValue('custevent_reason_for_cancellation', reason);
		//***********NEED TO HAVE SOME INDICATION THAT THE APPT WAS CANCELLED**************
		nlapiSubmitRecord(appointmentRecord, false, true);
	  }
	  
	  else
	  {
		var newDate = request.getParameter('newdate');
		var newTime = request.getParameter('newtime');
		var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
		appointmentRecord.setFieldValue('custevent_bsr_appt_confirmation', dateFormatted);
		appointmentRecord.setFieldValue('custevent_showing_date_scheduled', newDate);
		appointmentRecord.setFieldValue('custevent_showing_time_scheduled', newTime);
		nlapiSubmitRecord(appointmentRecord, false, true);
	  }
	  
	  var confirmation = form.addField('confirmationfield', 'label', 'Thank you for confirming the appointment details.');  
	  response.writePage(form);
   }
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
