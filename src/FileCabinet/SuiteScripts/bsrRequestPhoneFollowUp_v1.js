/*
Author:  Michael Hulshult
Date: 8/16/2012
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to submit sales information
and documentation for properties that have recently sold.
*/

function bsrRequestPhoneFollowUp(request, response)
{
   if (request.getMethod() == 'GET')
   {
      var form = nlapiCreateForm('Request Phone Follow Up');
	  var group = form.addFieldGroup('fieldgroup', 'Enter or confirm your contact information below');
	  
	  var apptID = request.getParameter('apptid');
	  var appointmentIDField = form.addField('apptid', 'text', 'appt').setDisplayType('hidden');
	  var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
	  var nameFromApptRecord = appointmentRecord.getFieldValue('custevent_bsr_for_ren');
	  var phoneFromApptRecord = appointmentRecord.getFieldValue('custevent2');
	  var manager = request.getParameter('manager');
      var nameField = form.addField('namefield', 'text', 'Name: ', null, 'fieldgroup');
	  var phoneField = form.addField('phonefield', 'phone', 'Callback Number: ', null, 'fieldgroup');
	  
	  if(manager != 'T')
	  {
		form.setFieldValues({apptid:apptID,namefield:nameFromApptRecord,phonefield:phoneFromApptRecord});
	  }
	  
	  else
	  {
		form.setFieldValues({apptid:apptID});
	  }
	  form.addSubmitButton('Submit');
	  group.setSingleColumn(true);
      response.writePage(form);
	  
   }
   
   else
   {
      //This portion of the script is executed when the page is loaded

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

      var form = nlapiCreateForm('Appointment Confirmation');

      //Get the property id based on the link that was sent to the user
      var apptID = request.getParameter('apptid');
  	  var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
	  appointmentRecord.setFieldValue('custevent_bsr_follow_up', dateFormatted);
	  var id = nlapiSubmitRecord(appointmentRecord, false, true);
	  
	  var subject = 'Showing Followup Phone Call Request';
	  var recipient = 'mlsinfo@hmsmarketingservices.com';

	 // var body = nlapiMergeRecord('21', 'supportcase', id);
	var emailMerger1 = nlapiCreateEmailMerger(57);//57 is converted type of 21
	emailMerger1.setSupportCase(id);
	var mergeResult1 = emailMerger1.merge();
	var emailBody1 = mergeResult1.getBody();
	  
	  
	  nlapiSendEmail('3847', recipient, subject, emailBody1);
	  
	  
	  var confirmation = form.addField('confirmationfield', 'label', 'An HMS representative will follow up with you via phone.');

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
