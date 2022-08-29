/*
Author:  Michael Hulshult
TEST
Date: 8/16/2012
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to submit closing information
and documentation for properties that have recently closed.
*/

function uploader(request, response)
{
   if (request.getMethod() == 'GET')
   {
      //This portion of the script is executed when the page is loaded

      var form = nlapiCreateForm('Closing of an MLS Listing');

      //Add a field to link the information to the property record
      var propertyField = form.addField('custpage_cn_pending_property', 'select', 'Property', '18');

	  //Add in the rest of the fields
      propertyField.setLayoutType('normal','startcol')
      var lotNumber = form.addField('custpage_cn_pending_lot_number', 'text', 'Lot Number');
      var lotNumberValue = request.getParameter('lotnumber');
      lotNumber.setDisplayType('disabled');
      var instruction = form.addField('custpage_instruction', 'inlinehtml');
	  var instructionValue = '<HTML><HEAD><body><p><b>Please provide the earliest possible date that this property might close.</b></p></body></HEAD></HTML>';
	  instruction.setDefaultValue(instructionValue);
      var updatedClosingDate = form.addField('custpage_cn_pending_updatedclosingdate', 'date', 'Updated Estimated Closing Date');

      //Disable the field so the end user can't change it
      propertyField.setDisplayType('disabled');

      //Get the property id based on the link that was sent to the user
      var propertyValue = request.getParameter('custrecord_property');

      //Set the property id and lot number to the value retrieved earlier
      form.setFieldValues({custpage_cn_pending_property:propertyValue,custpage_cn_pending_lot_number:lotNumberValue});

      form.addSubmitButton();
      form.addResetButton();
      response.writePage(form);
   }
   else
   {
      //This portion of the script is executed when the page is submitted via the "Submit" button

      var date = new Date();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();
      var dateFormatted = month + "/" + day + "/" + year;

      //Retrieve all the information entered by the user
      var property = request.getParameter("custpage_cn_pending_property");
      var updatedClosingDateValue = request.getParameter("custpage_cn_pending_updatedclosingdate");

      //Here we set field values on the property record
      var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
      propertyRecord.setFieldValue('custrecord_estimated_closing_date', updatedClosingDateValue);

      var propName = propertyRecord.getFieldValue('name');
      nlapiSubmitRecord(propertyRecord);

      //Now we will send the notification to HMS personnel
      var subject = 'Closing of Market Home Rescheduled: ' + propName;
      //The recipient gets set using a paramter on the deployment of the script.  Open the script in NetSuite, click on 'Deployments',
      	//then the 'Parameters' tab to find or set this value
      var recipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_cn_submission_notification_r');

      var records = new Object();
      records['recordtype'] = '18';
      records['record'] = property;

     // var body = nlapiMergeRecord(18, 'customrecord_property_record', property);
	    var emailMerger1 = nlapiCreateEmailMerger(58);//58 is converted type of 12
	emailMerger1.setCustomRecord('customrecord_property_record', property);
	var mergeResult1 = emailMerger1.merge();
	var emailBody1 = mergeResult1.getBody();
      nlapiSendEmail('3847', recipient, subject, emailBody1, null, null, records, null, true);

      // now navigate to a landing page
      response.sendRedirect('EXTERNAL', 'http://hmsrealestate.com/images/submission.htm');
   }
}