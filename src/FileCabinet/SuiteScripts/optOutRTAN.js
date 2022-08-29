/*
Author:  Michael Hulshult
Date: 1/28/2014
Purpose:  This Suitelet allows users to opt out of RTANs.  If you don't know what that is, ask Jeff.
*/

function optOutRTAN(request, response)
{
   if (request.getMethod() == 'GET')
   {
      var form = nlapiCreateForm('Opt Out');
	  var group = form.addFieldGroup('fieldgroup', 'Enter your email address below');
	  
	  var emailField = form.addField('emailaddress', 'email', 'Email Address');
	  
	  form.addSubmitButton('Submit');
	  group.setSingleColumn(true);
      response.writePage(form);
	  
   }
   
   else
   {
      //This portion of the script is executed when the page is loaded

      var form = nlapiCreateForm('Opt Out');

      //Get the property id based on the link that was sent to the user
      var emailAddress = request.getParameter('emailaddress');
  	  var filter = new nlobjSearchFilter('email', null, 'is', emailAddress);
	  
	  var results = nlapiSearchRecord('partner', null, filter);
	  for(var i=0; results != null && results.length > i; i++)
	  {
		var partnerRecord = nlapiLoadRecord('partner', results[i].getId());
		partnerRecord.setFieldValue('custentity_opt_out_rtan', 'T');
		var partnerRecordID = nlapiSubmitRecord(partnerRecord, false, true);
	  }

	  if(results == null)
	  {
		var group = form.addFieldGroup('fieldgroup', 'Enter your email address below');
		var noticeField = form.addField('notice', 'label', 'No contact record with that email address could be found.');
		var emailField = form.addField('emailaddress', 'email', 'Email Address');
	  
		form.addSubmitButton('Submit');
		group.setSingleColumn(true);
		response.writePage(form);
	  }
	  
	  else
	  {
		var confirmation = form.addField('confirmationfield', 'label', 'You will no longer receive these email notifications for scheduled showings.');
		response.writePage(form);
	  }
   }
}