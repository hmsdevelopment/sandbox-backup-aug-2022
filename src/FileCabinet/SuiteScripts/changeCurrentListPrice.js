/*
Author:  Jeff McDonald
Date: 8/25/2014
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to submit property changes.
*/

function changeCurrentListPrice(request, response)
{
   if (request.getMethod() == 'GET')
   {
		//This portion of the script is executed when the page is loaded

		var form = nlapiCreateForm('Change Property Information');
		var group = form.addFieldGroup('fieldgroup', 'Please make the appropriate changes');

		var apptID = request.getParameter('apptid');
		nlapiLogExecution('DEBUG','apptID ','apptID : '+apptID);
		var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
		var propertyID = appointmentRecord.getFieldValue('custevent_property');
		var propertyRecord = nlapiLoadRecord('customrecord_property_record', propertyID);
		var currentListPrice = propertyRecord.getFieldValue('custrecord_current_list_price');
		var currentConstStatus = propertyRecord.getFieldValue('custrecord_current_construction');
		var currentSaleStatus = propertyRecord.getFieldValue('custrecord_property_status');
		var builderDivision = appointmentRecord.getFieldValue('company');

		var currentListPriceField = form.addField('custpage_price', 'currency', 'Current List Price', 'custrecord_current_list_price', 'fieldgroup');
		
		var currentSaleStatusField = form.addField('custpage_sale_status', 'select', 'Current Sale Status', 'custrecord_property_status', 'fieldgroup');
		currentSaleStatusField.addSelectOption('1', 'Available');
		currentSaleStatusField.addSelectOption('2', 'Pending');
		currentSaleStatusField.addSelectOption('3', 'Closed');
		
		var currentConstStatusField = form.addField('custpage_const_status', 'select', 'Current Construction Status', 'custrecord_current_construction', 'fieldgroup');
		currentConstStatusField.addSelectOption('10','Complete');
		currentConstStatusField.addSelectOption('6','Drywall Complete');
		currentConstStatusField.addSelectOption('5','Existing Structure');
		currentConstStatusField.addSelectOption('2','Foundation');
		currentConstStatusField.addSelectOption('9','Framed');
		currentConstStatusField.addSelectOption('7','Permit Filed');
		currentConstStatusField.addSelectOption('3','Paper');
		currentConstStatusField.addSelectOption('4','To Be Built');
		currentConstStatusField.addSelectOption('8','Trim Stage');
		currentConstStatusField.addSelectOption('1','Under Roof');
		currentConstStatusField.addSelectOption('11','Vacant Lot');

		nlapiLogExecution('DEBUG','currentListPrice ','currentListPrice : '+currentListPrice);
		currentListPriceField.setDefaultValue(currentListPrice);
		currentConstStatusField.setDefaultValue(currentConstStatus);
		currentSaleStatusField.setDefaultValue(currentSaleStatus);
		var apptIDField = form.addField('apptid', 'text', 'appt ID').setDisplayType('hidden');
		apptIDField.setDefaultValue(apptID);
		//form.setFieldValues({apptid:apptID});
		group.setSingleColumn(true);
		form.addSubmitButton('Submit');

		response.writePage(form);
   }
   
   else
   {
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
	  
	  /*
	  var dateFormatted = month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds + " " + amPM;
	  var apptID = request.getParameter('apptid');
	  var justificationValue = request.getParameter('justification');
	  var changeRequestorValue = request.getParameter('changerequestor');
	  var bsr = request.getParameter('custpage_bsrlist');
	  var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
	  var salesManager = appointmentRecord.getFieldValue('custevent7');
	  var salesManagerRecord = nlapiLoadRecord('partner', salesManager);
	  var salesManagerEmail = salesManagerRecord.getFieldValue('email');
	  var subdivision = appointmentRecord.getFieldValue('custevent_subdivision_for_ren');
	  var propertyId = appointmentRecord.getFieldValue('custevent_property');
	  var oldBSR = appointmentRecord.getFieldValue('custevent_builder_sales_rep_subd');
	  var oldBSRRecord = nlapiLoadRecord('partner', oldBSR);
	  var oldBSREmail = oldBSRRecord.getFieldValue('email');
	  var oldBSRFirstName = oldBSRRecord.getFieldValue('firstname');
	  var oldBSRLastName = oldBSRRecord.getFieldValue('lastname');
	  
	  appointmentRecord.setFieldValue('custevent_previous_bsr_fname', oldBSRFirstName);
	  appointmentRecord.setFieldValue('custevent_previous_bsr_lname', oldBSRLastName);
  	  appointmentRecord.setFieldValue('custevent_bsr_follow_up', dateFormatted);
	  appointmentRecord.setFieldValue('custevent_builder_sales_rep_subd', bsr);
	  appointmentRecord.setFieldValue('custevent_bsr_assignment_note', justificationValue);
	  appointmentRecord.setFieldValue('custevent_bsr_reassign_submit', changeRequestorValue);
	  nlapiSubmitRecord(appointmentRecord, false, true);
	  */
	  
	  var apptID = request.getParameter('apptid');
  	  var appointmentRecord = nlapiLoadRecord('supportcase', apptID);
	  var propertyID = appointmentRecord.getFieldValue('custevent_property');
	  var propertyRecord = nlapiLoadRecord('customrecord_property_record', propertyID);
	  var currentListPriceValue = request.getParameter('custpage_price');
	  var currentConstStatusValue = request.getParameter('custpage_const_status');
	  var currentSaleStatusValue = request.getParameter('custpage_sale_status');
	  nlapiLogExecution('DEBUG','currentListPriceValue ','currentListPriceValue : '+currentListPriceValue);
	  propertyRecord.setFieldValue('custrecord_current_list_price', currentListPriceValue);
	  propertyRecord.setFieldValue('custrecord_current_construction', currentConstStatusValue);
	  propertyRecord.setFieldValue('custrecord_property_status', currentSaleStatusValue);
	  nlapiSubmitRecord(propertyRecord, false, true);
	  
	  /*
	  var bsrRecord = nlapiLoadRecord('partner', bsr);
	  var bsrEmail = bsrRecord.getFieldValue('email');
	  var property = nlapiLoadRecord('customrecord_property_record', propertyId);
	  var street = property.getFieldText('custrecord31');
	  var lot = property.getFieldValue('custrecord_lot_number');	  
	  var houseNumber = property.getFieldValue('custrecord_house_number');
	  var subject = "REASSIGNED: New Inquiry For " + houseNumber + " " + street + ", " + subdivision + ", " + lot;
	  var showingAssist = appointmentRecord.getFieldValue('custevent_showing_assist');
	  */
	  
	  var form = nlapiCreateForm('Property Changes');
	  var confirmation = form.addField('confirmationfield', 'label', 'Thank you, your changes have been made.');
	  
	  	 
	  
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