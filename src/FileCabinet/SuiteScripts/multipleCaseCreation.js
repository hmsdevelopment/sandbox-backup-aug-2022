/*
Author:  Michael Hulshult
Date: 11/16/2012
Purpose:  This Suitelet is deployed to internal users, and allows users to create multiple cases and link them together.
*/

function multipleCaseCreation(request, response)
{
   if (request.getMethod() == 'GET')
   {
      //This portion of the script is executed when the page is loaded

      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth();
      month++;
      var year = date.getFullYear();
      var dateFormatted = month + "/" + day + "/" + year;

      var form = nlapiCreateForm('Multiple Case Creation');
      form.setScript('customscript_mccclient');

      var link = request.getParameter('custpage_link');
      
      //Add a field to link the information to the property record
      var propertyField = form.addField('custpage_mcc_property', 'select', 'Property', '18');
      
      var linkField = form.addField('custpage_mcc_link', 'select', 'Link', '56');
      linkField.setDisplayType('hidden');

      var propertyValue = request.getParameter('custpage_property');
      var agentValue = request.getParameter('custpage_agent');

      //Add in the rest of the fields
      var agent = form.addField('custpage_mcc_agent', 'select', 'Agent', '36');
      var showingDate = form.addField('custpage_mcc_showingdate', 'date', 'Showing Date');
      var showingTime = form.addField('custpage_mcc_showingtime', 'timeofday', 'Showing Time');
      var bsr = form.addField('custpage_mcc_bsr', 'select', 'BSR', '-5');

      //Set the property id and lot number to the value retrieved earlier
      form.setFieldValues({custpage_mcc_showingdate:dateFormatted,custpage_mcc_link:link,custpage_mcc_agent:agentValue});

      form.addSubmitButton();
      form.addResetButton();
      form.addButton('custpage_createcases', 'Create Cases', "createCases();");
      form.addButton('custpage_getbsr', 'Get BSR', "getBSR();");
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
      var property = request.getParameter("custpage_mcc_property");
      var agent = request.getParameter("custpage_mcc_agent");
      var showingDate = request.getParameter("custpage_mcc_showingdate");
      var showingTime = request.getParameter("custpage_mcc_showingtime");
      var bsr = request.getParameter("custpage_mcc_bsr");
      var link = request.getParameter("custpage_mcc_link");
      
      if(link == null || link == '')
      {
   	var linkRecord = nlapiCreateRecord('customrecord_linked_cases');
      	linkRecord.setFieldValue('custrecord_linked_case_agent', agent);
      	link = nlapiSubmitRecord(linkRecord);
      }
      
      var mccRecord = nlapiCreateRecord('customrecord_multiple_case_creation');
      mccRecord.setFieldValue('custrecord_mcc_property', property);
      mccRecord.setFieldValue('custrecord_mcc_agent_name', agent);
      mccRecord.setFieldValue('custrecord_mcc_showing_date', showingDate);
      mccRecord.setFieldValue('custrecord_mcc_showing_time', showingTime);
      mccRecord.setFieldValue('custrecord_mcc_bsr', bsr);
      mccRecord.setFieldValue('custrecord_mcc_link', link);
      nlapiSubmitRecord(mccRecord);
      

      // now navigate to a landing page
      var parameters = new Object();
      parameters['custpage_link'] = link;
      parameters['custpage_property'] = property;
      parameters['custpage_agent'] = agent;
      response.sendRedirect('SUITELET', 'customscript61', 'customdeploy1', null, parameters);
   }
}