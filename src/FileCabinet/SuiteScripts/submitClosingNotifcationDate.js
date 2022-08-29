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

	  var date = new Date();
	  var day = date.getDate();
	  var month = date.getMonth();
	  month++;
	  var year = date.getFullYear();
	  var dateFormatted = month + "/" + day + "/" + year;

      var form = nlapiCreateForm('Closing Notification Date');

      //Get the property id based on the link that was sent to the user
      var propertyValue = request.getParameter('custrecord_property');
  	  var propertyField = form.addField('custpage_cn_closing_property', 'select', 'Property', '18');
	  var notificationDate = form.addField('custpage_cn_date', 'date', 'Closing Notification Date');

      //Set the property
      form.setFieldValues({custpage_cn_closing_property:propertyValue,custpage_cn_date:dateFormatted});

      form.addSubmitButton();
      form.addResetButton();
      response.writePage(form);
   }
   else
   {
	  var propertyValue = request.getParameter('custpage_cn_closing_property');
	  var notificationDateValue = request.getParameter('custpage_cn_date');
      var property = nlapiLoadRecord('customrecord_property_record', propertyValue);	  
      property.setFieldValue('custrecord_closing_date_mls_region1', notificationDateValue);
      property.setFieldValue('custrecord_property_date_sales_st_update', notificationDateValue);
      property.setFieldValue('custrecord_property_status', '3');
      property.setFieldValue('name', property.getFieldText('custrecord31') + ' ' +
				property.getFieldValue('custrecord_house_number') + ' (Closed) ' +
				property.getFieldText('custrecordcustrecordsubdname'));      
	  nlapiSubmitRecord(property);

      var form = nlapiCreateForm('Closing Notification Date has been set');
      var confirmation = form.addField('custpage_confirmation', 'label', 'Closing Notifcation Date has been set');
      response.writePage(form);
   }
}