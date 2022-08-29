/*
Author:  Michael Hulshult
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

      //Disable the field so the end user can't change it
      propertyField.setDisplayType('hidden');

      //Get the property id based on the link that was sent to the user
      var propertyValue = request.getParameter('custrecord_property');

      //Add field for Lot Number and get the value from the URL
      var lotNumber = form.addField('custpage_cn_pending_lot_number', 'text', 'Lot Number');
      var lotNumberValue = request.getParameter('lotnumber');
      lotNumber.setDisplayType('hidden');

      //Add in the rest of the fields
      var label = form.addField('custpage_cn_pending_label', 'label', 'This closing has been cancelled and the property will go back on the market.');

      //Set the property id and lot number to the value retrieved earlier
      form.setFieldValues({custpage_cn_pending_property:propertyValue,custpage_cn_pending_lot_number:lotNumberValue});

      //Here we set field values on the property record
      var propertyRecord = nlapiLoadRecord('customrecord_property_record', propertyValue);
      var houseNumber = propertyRecord.getFieldValue('custrecord_house_number');
     	var houseStreet = propertyRecord.getFieldValue('custrecord31');
      propertyRecord.setFieldValue('custrecord_user_entered_sales_status', '1');

      var propName = propertyRecord.getFieldValue('name');
      nlapiSubmitRecord(propertyRecord);

      //Now we will send the notification to HMS personnel
      //var subject = 'Closing of Market Home Cancelled: ' + propName;
      var subject = 'Closing of Market Home Canceled: ' + propName;
      //The recipient gets set using a paramter on the deployment of the script.  Open the script in NetSuite, click on 'Deployments',
      	//then the 'Parameters' tab to find or set this value
      var recipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_cn_submission_notification_c');

      var records = new Object();
      records['recordtype'] = '18';
      records['record'] = property;

     // var body = nlapiMergeRecord(12, 'customrecord_property_record', propertyValue);
	var emailMerger1 = nlapiCreateEmailMerger(103);//58 is converted type of 12
	emailMerger1.setCustomRecord('customrecord_property_record', propertyValue);
	var mergeResult1 = emailMerger1.merge();
	var emailBody1 = mergeResult1.getBody();
    nlapiSendEmail('3847', recipient, subject, emailBody1, null, null, records, null, true);
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

      //Here we set field values on the property record
      var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
     	var houseNumber = propertyRecord.getFieldValue('custrecord_house_number');
     	var houseStreet = propertyRecord.getFieldValue('custrecord31');
      propertyRecord.setFieldValue('custrecord_property_status', '1');
			
			var propName = houseNumber + ' ' + street
      //var propName = propertyRecord.getFieldValue('name');
      nlapiSubmitRecord(propertyRecord);

      //Now we will send the notification to HMS personnel
      var subject = 'Action Required - Closing of Market Home Canceled: ' + houseNumber + ' ' + houseStreet;
      //The recipient gets set using a paramter on the deployment of the script.  Open the script in NetSuite, click on 'Deployments',
      	//then the 'Parameters' tab to find or set this value
      var recipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_cn_submission_notification');

      var records = new Object();
      records['recordtype'] = '18';
      records['record'] = property;

    //  var body = nlapiMergeRecord(12, 'customrecord_property_record', property);
	  var emailMerger1 = nlapiCreateEmailMerger(103);//58 is converted type of 12
	  emailMerger1.setCustomRecord('customrecord_property_record', property);
	  var mergeResult1 = emailMerger1.merge();
	  var emailBody1 = mergeResult1.getBody();
      nlapiSendEmail('3847', recipient, subject, emailBody1, null, null, records, null, true);

      // now navigate to a landing page
      response.sendRedirect('EXTERNAL', 'http://hmsrealestate.com/images/submission.htm');
   }
}