/*
Author:  Michael Hulshult
Date: 8/16/2012
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to submit sales information
and documentation for properties that have recently sold.
*/

function bsrFollowUp(request, response)
{
   if (request.getMethod() == 'GET')
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
	  appointmentRecord.setFieldValue('status', '5');
	  nlapiSubmitRecord(appointmentRecord, false, true);
	  
	  var agentID = appointmentRecord.getFieldValue('custevent_caller_name');
	  if (agentID)
	  {
		  var agentRecord = nlapiLoadRecord('customrecord_agent', agentID);
		  var agentFirstName = agentRecord.getFieldValue('custrecord_agent_first_name');
		  var agentLastName = agentRecord.getFieldValue('custrecord_agent_last_name');
		  var agentFullName = agentFirstName + ' ' + agentLastName
	  }
		
		var html = '<!DOCTYPE html>';
		html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=85&deploy=1&compid=1309901&h=8bee22aee9d22327ad7b" method="post">';
		html += '<table align = "center" id="customers">';
		html += '<tr>';
		html += '<td><font size ="16">Thank you for acknowledging that you have or will follow up with ' + agentFullName + ' regarding this inquiry.';
		html += '</font></td>';
		html += '</tr>';
		html += '<table>';
		html += '</table>';
		html += '</form>';
		html += '</body>';
		html += '</html>';
				 
		response.write(html);	  

	  //var confirmation = form.addField('confirmationfield', 'label', 'Thank you.');

      //response.writePage(form);
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
