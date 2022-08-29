/*
Author:  Michael Hulshult
Date: 8/16/2012
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to submit sales information
and documentation for properties that have recently sold.
*/

function uploader(request, response)
{
   if (request.getMethod() == 'GET')
   {
      //This portion of the script is executed when the page is loaded

      var form = nlapiCreateForm('Request Sale Information of an MLS Listing');

      //Add a field to link the information to the property record
      var propertyField = form.addField('custpage_sn_pending_property', 'select', 'Property', '18');

      //Disable the field so the end user can't change it
      propertyField.setDisplayType('disabled');

      //Get the property id based on the link that was sent to the user
      var propertyValue = request.getParameter('custrecord_property');

      //Add field for Lot Number and get the value from the URL
      var lotNumber = form.addField('custpage_sn_pending_lot_number', 'text', 'Lot Number');
      var lotNumberValue = request.getParameter('lotnumber');
      lotNumber.setDisplayType('disabled');

      //Add in a field to allow the user to upload the sales contract file
      var fileField = form.addField('custpage_sn_pending_contract_file', 'file', 'Upload Sales Contract Here');
      fileField.setMandatory(true)

      //Add field for stage of construction at time of sale, and create a dropdown list so they're able to select the entry
      	//Without the list, they would have to type in a status without choices to choose from
      var stageOfConstruction = form.addField('custpage_sn_pending_stage', 'select', 'Stage of Construction at Sale');
      var fromGhostListing = request.getParameter('fromGhostListing');

      if (fromGhostListing && fromGhostListing == "T") {
        stageOfConstruction.addSelectOption('4','To Be Built');
        stageOfConstruction.addSelectOption('10','Complete');
      } else {
        stageOfConstruction.addSelectOption('10','Complete');
        stageOfConstruction.addSelectOption('4','To Be Built');        
      }

      stageOfConstruction.addSelectOption('6','Drywall Complete');
      stageOfConstruction.addSelectOption('5','Existing Structure');
      stageOfConstruction.addSelectOption('2','Foundation');
      stageOfConstruction.addSelectOption('9','Framed');
      stageOfConstruction.addSelectOption('7','Permit Filed');
      stageOfConstruction.addSelectOption('3','Prepared');
      stageOfConstruction.addSelectOption('8','Trim Stage');
      stageOfConstruction.addSelectOption('1','Under Roof');

      //Add in the rest of the fields
      var contractExecuted = form.addField('custpage_sn_pending_contract', 'date', 'Date Contract Executed');
      contractExecuted.setMandatory(true);
      var earliestClosingDate = form.addField('custpage_sn_pending_closing', 'date', 'Earliest Possible Closing Date');
      earliestClosingDate.setMandatory(true);
      var brokerInvolved = form.addField('custpage_sn_pending_broker', 'select', 'Broker Was Involved');
      brokerInvolved.addSelectOption('1', 'Yes');
      brokerInvolved.addSelectOption('2', 'No');
      var agentFirst = form.addField('custpage_sn_pending_agent', 'text', 'Agent First Name');
      var agentLast = form.addField('custpage_sn_pending_agent_last', 'text', 'Agent Last Name');
      var agentID = form.addField('custpage_sn_pending_agent_id', 'text', 'Agent ID');
      agentID.setMandatory(false);
      var brokerage = form.addField('custpage_sn_pending_brokerage', 'text', 'Brokerage Name');
      var buyerFirst = form.addField('custpage_sn_pending_buyer_first', 'text', 'Buyer First Name');
      var buyerLast = form.addField('custpage_sn_pending_buyer_last', 'text', 'Buyer Last Name');

      //Set the property id and lot number to the value retrieved earlier
      form.setFieldValues({custpage_sn_pending_property:propertyValue,custpage_sn_pending_lot_number:lotNumberValue});

      form.addSubmitButton();
      form.addResetButton();
      response.writePage(form);
   }
   else
   {
      //This portion of the script is executed when the page is submitted via the "Submit" button

      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth();
      month++;
      var year = date.getFullYear();
      var dateFormatted = month + "/" + day + "/" + year;

      //Retrieve all the information entered by the user
      var property = request.getParameter("custpage_sn_pending_property");
      var file = request.getFile("custpage_sn_pending_contract_file");
      var stage = request.getParameter("custpage_sn_pending_stage");
      var contractDate = request.getParameter("custpage_sn_pending_contract");
      var closingDate = request.getParameter("custpage_sn_pending_closing");
      //var broker = request.getParameter("custpage_sn_pending_broker");
      var agentFirst = request.getParameter("custpage_sn_pending_agent");
      var agentLast = request.getParameter("custpage_sn_pending_agent_last");
      var agentName = agentFirst + " " + agentLast;
      var brokerageName = request.getParameter("custpage_sn_pending_brokerage");
      var buyerFirst = request.getParameter("custpage_sn_pending_buyer_first");
      var buyerLast = request.getParameter("custpage_sn_pending_buyer_last");
      var buyer = buyerLast + ", " + buyerFirst;
      var agentID = request.getParameter("custpage_sn_pending_agent_id");

      // set the folder where this file will be added. In this case, 41 is the internal ID
     	// of the Sales Contracts folder in the NetSuite file cabinet
      file.setFolder(41);

      // now create file and upload it to the file cabinet.
      var fileID = nlapiSubmitFile(file);

      // now attach file to property record
      nlapiAttachRecord("file", fileID, "customrecord_property_record", property);

      //Here we set field values on the property record for Construction Status at Contract,
      	//Contract Approval Date, Contract Received from Builder, Estimated Closing Date,
      	//and Purchase Contract.
      var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
      propertyRecord.setFieldValue('custrecord_contract_approval_date', contractDate);
      propertyRecord.setFieldValue('custrecord_contract_received_date', dateFormatted);
      propertyRecord.setFieldValue('custrecord_estimated_closing_date', closingDate);
      propertyRecord.setFieldValue('custrecord_construction_status_contract', stage);
      propertyRecord.setFieldValue('custrecord_purchase_contract', fileID);
      propertyRecord.setFieldValue('custrecord_agent_name_sn', agentName);
      propertyRecord.setFieldValue('custrecord_brokerage_name_sn', brokerageName);
      propertyRecord.setFieldValue('custrecord_buyers_last_name', buyer);
      propertyRecord.setFieldValue('custrecord_real_estate_agent_id_region_1', agentID);
      var mlsRegion1 = propertyRecord.getFieldValue('custrecord15');
      var mlsRegion2 = propertyRecord.getFieldValue('custrecord16');
      var mlsNumber1 = propertyRecord.getFieldValue('custrecord_mls_number_region1');
      var mlsNumber2 = propertyRecord.getFieldValue('custrecord_mls_number_region2');
      var propName = propertyRecord.getFieldValue('name');
      nlapiSubmitRecord(propertyRecord);

      //Now we will send the notification to HMS personnel
      var attachment = nlapiLoadFile(fileID);
      var subject = 'Request for Sale of Market Home Submitted: ' + propName;
      //The recipient gets set using a paramter on the deployment of the script.  Open the script in NetSuite, click on 'Deployments',
      	//then the 'Parameters' tab to find or set this value
      var recipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_sn_submission_notification');

      var records = new Object();
      records['recordtype'] = '18';
      records['record'] = property;

      //var body = nlapiMergeRecord(10, 'customrecord_property_record', property);
	  var emailMerger1 = nlapiCreateEmailMerger(69);//69 is converted type of 10
		emailMerger1.setCustomRecord('customrecord_property_record',property);
		var mergeResult1 = emailMerger1.merge();
		var emailBody1 = mergeResult1.getBody();
		
      nlapiSendEmail('3847', recipient, subject, emailBody1, null, null, records, attachment);

      // now navigate to a landing page
      response.sendRedirect('EXTERNAL', 'http://hmsrealestate.com/images/submission.htm');
   }
}