/*
Author:  Michael Hulshult
Date: 8/16/2012
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to submit sales information
and documentation for properties that have recently sold.
*/
var html = '<!DOCTYPE html>';
		html += '<html>';
		html += '<head>';
		html += '<title>Appointment Confirmation</title>';
		html += '<style>';
		html += '#customers';
		html += '{';
		html += '	font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;';
		html += '	width:30%;';
		html += '	border-collapse:collapse;';
		html += '}';
		html += '#customers td, #customers th ';
		html += '{';
		html += '	font-size:1em;';
		html += '	text-align:center;';
		html += '	border:1px solid #F2F7E5;';
		html += '	padding:3px 7px 2px 7px;';
		html += '}';
		html += '#customers th ';
		html += '{';
		html += '	font-size:1.1em;';
		html += '	text-align:center;';
		html += '	padding-top:5px;';
		html += '	padding-bottom:4px;';
		html += '	background-color:#CCCCCC;';
		html += '	color:#ffffff;';
		html += '}';
		html += '#customers tr.alt td ';
		html += '{';
		//html += '	color:#F2F2F2;';
		html += '	background-color:#F2F2F2;';
		html += '}';
		html += '#form';
		html += '{';
		html += '	text-align:center;';
		html += '}';
		html += '</style>';
		html += '</head>';
		html += '<body>';
function bsrApptConfirmation(request, response)
{
   if (request.getMethod() == 'GET')
   {
   
		var apptID = request.getParameter('apptid');
		var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
		var subdivisionValue = appointmentRecord.getFieldValue('custevent_subdivision_for_ren');
		var propertyValue = appointmentRecord.getFieldValue('custevent_property_for_ren');
		var currentDate = appointmentRecord.getFieldValue('custevent_showing_date_scheduled');
		var currentTime = appointmentRecord.getFieldValue('custevent_showing_time_scheduled');
		
		
		html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=83&deploy=1&compid=1309901&h=69bcb3388e9380c93265" method="post">';
		html += '<table align = "center" id="customers">';
		html += '<tr>';
		html += '<th colspan="2" ><span align="center">Confirm Appointment Details</span></th>';
		html += '</tr>';
		html += '<tr>';
		html += '<td>Subdivision: </td>';
		if(subdivisionValue)
		{
		html += '<td><span id="subdivision">'+subdivisionValue+'</span></td>';
		}
		else
		{
			html += '<td><span id="subdivision"></span></td>';
		}
		html += '</tr>';
		html += '<tr class="alt">';
		html += '<td>Property: </td>';
		if(propertyValue)
		{
			html += '<td><span id="property">'+propertyValue+'</span></td>';
		}
		else
		{
			html += '<td><span id="property"></span></td>';
		}
		html += '</tr>';
		html += '<tr>';
		html += '<td>Current Date: </td>';
		if(currentDate)
		{
			html += '<td><span id="currentdate">'+currentDate+'</span></td>';
		}
		else
		{
			html += '<td><span id="property"></span></td>';
		}
		html += '</tr>';
		html += '<tr class="alt">';
		html += '<td>Current Time:</td>';
		if(currentTime)
		{
			html += '<td><span id="currenttime">'+currentTime+'</span><input type="hidden" id= "apptid" name ="apptid" value="'+apptID+'"></td>';
		}
		else
		{
			html += '<td><span id="currenttime"></span><input type="hidden" id= "apptid" name ="apptid" value="'+apptID+'"></td>';
		}
		html += '</tr>';
		html += '</table>';
		html += '<input type="submit" value="Submit">';
		html += '</form>';
		html += '</body>';
		html += '</html>';

      //This portion of the script is executed when the page is loaded
		/*
		var form = nlapiCreateForm('Appointment Confirmation');
		var group = form.addFieldGroup('fieldgroup', 'Confirm Appointment Details');

		var apptID = request.getParameter('apptid');
		var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
		var subdivisionValue = appointmentRecord.getFieldValue('custevent_subdivision_for_ren');
		var propertyValue = appointmentRecord.getFieldValue('custevent_property_for_ren');
		var currentDate = appointmentRecord.getFieldValue('custevent_showing_date_scheduled');
		var currentTime = appointmentRecord.getFieldValue('custevent_showing_time_scheduled');
		  
		var subdivisionField = form.addField('subdivision', 'text', 'Subdivision: ', null, 'fieldgroup').setDisplayType('inline');
		var propertyField = form.addField('property', 'text', 'Property: ', null, 'fieldgroup').setDisplayType('inline');
		var currentDateField = form.addField('currentdate', 'date', 'Current Date: ', null, 'fieldgroup').setDisplayType('inline');
		var currentTimeField = form.addField('currenttime', 'timeofday', 'Current Time: ', null, 'fieldgroup').setDisplayType('inline');
		var appointmentIDField = form.addField('apptid', 'text', 'appt').setDisplayType('hidden');

		form.setFieldValues({property:propertyValue,currentdate:currentDate,currenttime:currentTime,subdivision:subdivisionValue,apptid:apptID});
		form.addSubmitButton('Submit');
		group.setSingleColumn(true);
		response.writePage(form);
		*/
		response.write(html);
		
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

    //  var form = nlapiCreateForm('Appointment Confirmation');

      //Get the property id based on the link that was sent to the user
      var appointmentID = request.getParameter('apptid');
  	  var appointmentRecord = nlapiLoadRecord('supportcase', appointmentID);
	  var bsrApptConfirmed = appointmentRecord.getFieldValue('custevent_bsr_appt_confirmation');
	  appointmentRecord.setFieldValue('custevent_bsr_appt_confirmation', dateFormatted);
	  appointmentRecord.setFieldValue('status', '5');
	  var recordID = nlapiSubmitRecord(appointmentRecord, false, true);

	//Now we will send the notification to HMS personnel
	if (bsrApptConfirmed == '')
	{
		var subject = 'Showing Assist Appointment Confirmed';
	
		//The recipient gets set using a paramter on the deployment of the script.  Open the script in NetSuite, click on 'Deployments',
			//then the 'Parameters' tab to find or set this value
		
		
		//commented out by Jeff for debugging 3/27/14
		//var recipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_notification');
		var recipient = 'mlsinfo@hmsmarketingservices.com';
		
		//var body = nlapiMergeRecord('24', 'supportcase', appointmentID);
		var emailMerger1 = nlapiCreateEmailMerger(55);//55 is converted type of 24
		emailMerger1.setSupportCase(appointmentID);
		var mergeResult1 = emailMerger1.merge();
		var emailBody1 = mergeResult1.getBody();
	
	nlapiSendEmail('3847', recipient, subject, emailBody1);	  
		}
	html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=83&deploy=1&compid=1309901&h=69bcb3388e9380c93265" method="post">';
			html += '<table align = "center" id="customers">';
			html += '<tr>';
			html += '<td>Thank you for confirming the appointment details.';
			html += '</td>';
			html += '</tr>';
			html += '<table>';
			html += '</table>';
			html += '</form>';
			html += '</body>';
			html += '</html>';
			
		 // var confirmation = form.addField('confirmationfield', 'label', 'Thank you for confirming the appointment details.');

		 // response.writePage(form);
	 
	 response.write(html);
	 
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