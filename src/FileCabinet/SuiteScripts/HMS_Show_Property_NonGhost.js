/*
Author:  Abhishek Tripathi
Date: 11/4/2016
Purpose:  This suitelet is used to show data and process data if property has different floor plan, if it is not Ghost site
*/

function uploader(request, response)
{
   if (request.getMethod() == 'GET')
   {
      //This portion of the script is executed when the page is loaded

      var form = nlapiCreateForm('Move existing Ghost Listing.');
	  var propertyValue = request.getParameter('propid');
      //Add a field to link the information to the property record
      
	  
		var proprecord = nlapiLoadRecord('customrecord_property_record',propertyValue);
	  
		var floorplan = proprecord.getFieldValue('custrecord_floorplan');
		var oldhouseno = proprecord.getFieldValue('custrecord_house_number');
		var oldstreet = proprecord.getFieldValue('custrecord31');
		var oldlotno = proprecord.getFieldValue('custrecord_lot_number');
		var subdivision = proprecord.getFieldValue('custrecordcustrecordsubdname');
		if(subdivision)
		{
			subdivision = nlapiLookupField('customrecord_subdivision',subdivision,'custrecord_subdivision_id');
		}
		
		var oldgroup = form.addFieldGroup( 'oldfields', 'Current Values...');
		var propertyField = form.addField('custpage_sn_pending_property', 'select', 'Property', '18','oldfields');
		propertyField.setDefaultValue(propertyValue);
		propertyField.setDisplayType('hidden');	
		var propertyField = form.addField('custpage_subdivision', 'text', 'Sub Division', null,'oldfields');
		propertyField.setDefaultValue(subdivision);
		propertyField.setDisplayType('disabled');
     
		var oldfloorplan = form.addField('custpage_oldfloorplan', 'select', 'Old Floor Plan','customrecord_floorplan','oldfields');
		oldfloorplan.setDefaultValue(floorplan);
		oldfloorplan.setDisplayType('disabled');
		
		var oldhouse = form.addField('custpage_oldhouseno', 'text', 'Old House No.',null,'oldfields');
		oldhouse.setDefaultValue(oldhouseno);
		oldhouse.setDisplayType('disabled');
		
		var oldstreetfield = form.addField('custpage_oldstreet', 'select', 'Old Street','customrecord_street_name','oldfields');
		oldstreetfield.setDefaultValue(oldstreet);
		oldstreetfield.setDisplayType('disabled');
		
		var oldlotnofield = form.addField('custpage_oldlotno', 'text', 'Old Lot No',null,'oldfields');
		oldlotnofield.setDefaultValue(oldlotno);
		oldlotnofield.setDisplayType('disabled');
		
		oldgroup.setShowBorder(true);
		
		var newgroup = form.addFieldGroup( 'newfields', 'New Values...');

		var nfloorfield = form.addField('custpage_newfloorplan', 'select', 'New Floor Plan',null,'newfields');
		nfloorfield.addSelectOption('', '');
		var myfloor = proprecord.getField('custrecord_floorplan');
		var flooroptions = myfloor.getSelectOptions();
		for(var i=0; (flooroptions) && (i < flooroptions.length); i++)
		{
			nfloorfield.addSelectOption(flooroptions[i].getId(), flooroptions[i].getText());
		}
		
		form.addField('custpage_newhouseno', 'text', 'New House No.',null,'newfields');		
		var nstreetfield = form.addField('custpage_newstreet', 'select', 'New Street',null,'newfields');
		nstreetfield.addSelectOption('', '');
		var mystreet = proprecord.getField('custrecord31');
		var streetoption = mystreet.getSelectOptions();
		for(var i=0; (streetoption) && (i < streetoption.length); i++)
		{
			nstreetfield.addSelectOption(streetoption[i].getId(), streetoption[i].getText());
		}
		form.addField('custpage_newlotno', 'text', 'New Lot No',null,'newfields');
		newgroup.setShowBorder(true);

      

      

      form.addSubmitButton();
      form.addResetButton();
      response.writePage(form);
   }
   else
   {
      //This portion of the script is executed when the page is submitted via the "Submit" button

      
      var nfloor = request.getParameter("custpage_newfloorplan");
	  var nhouseno = request.getParameter("custpage_newhouseno");
	  var nstreet = request.getParameter("custpage_newstreet");
	  var nlotno = request.getParameter("custpage_newlotno");
	  var property = request.getParameter("custpage_sn_pending_property");

      
      //var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
	  var propertyRecord = nlapiCopyRecord('customrecord_property_record', property);
	  if(nfloor)
	  {
		propertyRecord.setFieldValue('custrecord_floorplan', nfloor);
	  }
	  if(nhouseno)
	  {
		propertyRecord.setFieldValue('custrecord_house_number', nhouseno);
	  }
	  if(nstreet)
	  {
		propertyRecord.setFieldValue('custrecord31', nstreet);
	  }
	  if(nlotno)
	  {
		propertyRecord.setFieldValue('custrecord_lot_number', nlotno);
	  }
      
      var propName = propertyRecord.getFieldValue('name');
      property = nlapiSubmitRecord(propertyRecord, true, true);

      //Now we will send the notification to HMS personnel
      var subject = 'Request for Update of Market Home Submitted: ' + propName;
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
		recipient = 'jeff@jeffmcdonald.net';
      nlapiSendEmail('3847', recipient, subject, emailBody1, 'abhirules01@gmail.com', null, records, null);

      // now navigate to a landing page
      response.sendRedirect('EXTERNAL', 'http://hmsrealestate.com/images/submission.htm');
   }
}