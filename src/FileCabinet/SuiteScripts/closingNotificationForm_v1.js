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
      propertyField.setDisplayType('disabled');

      //Get the property id based on the link that was sent to the user
      var propertyValue = request.getParameter('custrecord_property');

      //Add field for Lot Number and get the value from the URL
      var lotNumber = form.addField('custpage_cn_pending_lot_number', 'text', 'Lot Number');
      var lotNumberValue = request.getParameter('lotnumber');
      lotNumber.setDisplayType('disabled');

      //Add in a field to allow the user to upload the closing document
      var fileField = form.addField('custpage_cn_pending_contract_file', 'file', 'Upload Closing Document Here');
      fileField.setMandatory(true)

      //Add field for Financing Type at time of sale, and create a dropdown list so they're able to select the entry
      	//Without the list, they would have to type in a status without choices to choose from
      var financingType = form.addField('custpage_cn_pending_financing', 'select', 'Financing Type');
      financingType.addSelectOption('13','1031E');
      financingType.addSelectOption('4','Assumable');
      financingType.addSelectOption('11','Cash');
      financingType.addSelectOption('1','Conventional');
      financingType.addSelectOption('9','Exchange');
      financingType.addSelectOption('2','FHA');
      financingType.addSelectOption('14','FMHA');
      financingType.addSelectOption('15','ICON');
      financingType.addSelectOption('16','IHFA');
      financingType.addSelectOption('3','Land Contract');
      financingType.addSelectOption('10','Lease Option');
      financingType.addSelectOption('7','Lease/Purchase Option');
      financingType.addSelectOption('18','Other');
      financingType.addSelectOption('5','Owner');
      financingType.addSelectOption('17','RHS');
      financingType.addSelectOption('8','USDA');
      financingType.addSelectOption('12','USDAR');
      financingType.addSelectOption('6','VA');

      //Add in the rest of the fields
      var actualClosingDate = form.addField('custpage_cn_pending_closingdate', 'date', 'Actual Closing Date');
      var cancelledDelayedNote = form.addField('custpage_cn_pending_cancelleddelayed', 'label', 'Was the closing');
      var cancelledDelayed = form.addField('custpage_cn_pending_cancelleddelayedlist', 'select', 'cancelled or delayed?');
	  cancelledDelayed.addSelectOption('3', '');
	  cancelledDelayed.addSelectOption('1', 'Cancelled');
	  cancelledDelayed.addSelectOption('2', 'Delayed');
      var updatedClosingDate = form.addField('custpage_cn_pending_updatedclosingdate', 'date', 'Updated Closing Date');
      var closingPrice = form.addField('custpage_cn_pending_closingprice', 'currency', 'Closing Price');
      var loanAmount = form.addField('custpage_cn_pending_loanamount', 'currency', 'Loan Amount');
      var closingNotes = form.addField('custpage_cn_pending_closingnotes', 'textarea', 'Closing Notes');

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
      var file = request.getFile("custpage_cn_pending_contract_file");
      var financingTypeValue = request.getParameter("custpage_cn_pending_financing");
      var updatedClosingDateValue = request.getParameter("custpage_cn_pending_updatedclosingdate");
      var cancelledDelayedValue = request.getParameter("custpage_cn_pending_cancelleddelayedlist");
      var closingDateValue = request.getParameter("custpage_cn_pending_closingdate");
      var closingPriceValue = request.getParameter("custpage_cn_pending_closingprice");
      var loanAmountValue = request.getParameter("custpage_cn_pending_loanamount");
      var closingNotesValue = request.getParameter("custpage_cn_pending_closingnotes");

      // set the folder where this file will be added. In this case, 41 is the internal ID
     	// of the Sales Contracts folder in the NetSuite file cabinet
      file.setFolder(41);

      // now create file and upload it to the file cabinet.
      var fileID = nlapiSubmitFile(file);

      // now attach file to property record
      nlapiAttachRecord("file", fileID, "customrecord_property_record", property);

      //Here we set field values on the property record
      var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
      propertyRecord.setFieldValue('custrecord_actual_closing_date', closingDateValue);
      propertyRecord.setFieldValue('custrecord50', closingPriceValue);
      propertyRecord.setFieldValue('custrecord_loan_amount', loanAmountValue);
      propertyRecord.setFieldValue('custrecord_financing_type', financingTypeValue);
      propertyRecord.setFieldValue('custrecord_hud1', fileID);
      propertyRecord.setFieldValue('custrecord_closing_notes', closingNotesValue);
      propertyRecord.setFieldValue('custrecord_hud_received_date', dateFormatted);

      if(cancelledDelayedValue == '2')
      {
      	propertyRecord.setFieldValue('custrecord_estimated_closing_date', updatedClosingDateValue);
  	  }
  	  else if(cancelledDelayedValue == '1')
  	  {
		propertyRecord.setFieldValue('custrecord_property_status', '1');
	  }
      var mlsRegion1 = propertyRecord.getFieldValue('custrecord15');
      var mlsRegion2 = propertyRecord.getFieldValue('custrecord16');
      var mlsNumber1 = propertyRecord.getFieldValue('custrecord_mls_number_region1');
      var mlsNumber2 = propertyRecord.getFieldValue('custrecord_mls_number_region2');
      var propName = propertyRecord.getFieldValue('name');
      nlapiSubmitRecord(propertyRecord);

      //Now we will send the notification to HMS personnel
      var attachment = nlapiLoadFile(fileID);
      var subject = 'Closing of Market Home Submitted: ' + propName;
      //The recipient gets set using a paramter on the deployment of the script.  Open the script in NetSuite, click on 'Deployments',
      	//then the 'Parameters' tab to find or set this value
      var recipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_cn_submission_notification');

      var records = new Object();
      records['recordtype'] = '18';
      records['record'] = property;//

     // var body = nlapiMergeRecord(12, 'customrecord_property_record', property);
	   var emailMerger1 = nlapiCreateEmailMerger(60);//60 is converted type of 12
	emailMerger1.setCustomRecord('customrecord_property_record', property);
	var mergeResult1 = emailMerger1.merge();
	var emailBody1 = mergeResult1.getBody();
      nlapiSendEmail('3847', recipient, subject, emailBody1, null, null, records, attachment, true);

      // now navigate to a landing page
      response.sendRedirect('EXTERNAL', 'http://hmsrealestate.com/images/submission.htm');
   }
}