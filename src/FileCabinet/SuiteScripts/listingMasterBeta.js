/*
Author:  Michael Hulshult
Date: 4/19/2014
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to create new properties.
*/

function listingMaster(request, response)
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

      var form = nlapiCreateForm('Create New Listing or Modify Incomplete Listing');
	  var fieldgroup = form.addFieldGroup('fieldgroup', 'Please choose an option below');

      var currentUser = request.getParameter('partnerid');
	  var builderID = request.getParameter('builderid');
	  var propertyID = request.getParameter('propertyid');
	  var modifyListing = request.getParameter('modify');
	  var currentUserField = form.addField('user', 'text', 'user', null, 'fieldgroup').setDisplayType('hidden');
	  var builderDivisionField = form.addField('builderdivision', 'text', 'builder', null, 'fieldgroup').setDisplayType('hidden');
	  //var propertyField = form.addField('property', 'text', 'property').setDisplayType('hidden');
	  
	  if(modifyListing == 'T')
	  {
		var modifyListingField = form.addField('modifylisting', 'select', 'Modify Incomplete Listing', null, 'fieldgroup');
		modifyListingField.addSelectOption('1', '', true);
	  
		  var filters = [['custrecord12', 'is', builderID], 'AND', ['custrecord_property_status', 'is', '6'], 'AND', ['custrecord_ready_to_be_entered', 'is', 'T']];
//		  var filters = [['custrecord12', 'is', builderID], 'AND', ['custrecord_property_status', 'is', '6'], 'AND', ['custrecord_ready_to_be_entered', 'is', 'F'], 'AND', [['custrecord_market_home_info', 'anyof', '@NONE@'], 'OR', ['custrecord_permit', 'anyof', '@NONE@'], 'OR', ['custrecord_initial_photo', 'anyof', '@NONE@']]];		  
		  
		  var results = nlapiSearchRecord('customrecord_property_record', null, filters);
		  if(results == null)
		  {
			modifyListingField.addSelectOption('-1', 'There are no Incomplete Listings');
		  }	  
		  else
		  {
			for(var i=0; results != null && results.length > i; i++)
			{
				var recordID = results[i].getId();
				var record = nlapiLoadRecord('customrecord_property_record', recordID);
				var propertyName = record.getFieldValue('custrecord_simple_name');
				modifyListingField.addSelectOption(recordID, propertyName);			
			}
		  }
	  }
	  
	  else
	  {	
		  if(builderID==364245)
          {
			//  alert('Test');
			  var createListingField = form.addField('createlistinglink', 'url', null, null, 'fieldgroup').setDisplayType('inline').setLinkText("Create New Listing").setDefaultValue("https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=259&deploy=1&compid=1309901&h=86cd4feb2e69c3b74288&partnerid=" + currentUser + "&builderid=" + builderID);
				var modifyListingField = form.addField('modifylisting', 'url', null, null, 'fieldgroup').setDisplayType('inline').setLinkText("Modify Incomplete Listing").setDefaultValue("https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=113&deploy=1&compid=1309901&h=f8be8fd8dbfe9433b360&partnerid=" + currentUser + "&builderid=" + builderID + "&modify=T");
			  
			  
		  }else{
	//	var createListingField = form.addField('createlistinglink', 'url', null, null, 'fieldgroup').setDisplayType('inline').setLinkText("Create New Listing").setDefaultValue("https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=98&deploy=1&compid=1309901&h=7d701610411dac05393d&partnerid=" + currentUser + "&builderid=" + builderID);
            var createListingField = form.addField('createlistinglink', 'url', null, null, 'fieldgroup').setDisplayType('inline').setLinkText("Create New Listing").setDefaultValue("https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=259&deploy=1&compid=1309901&h=86cd4feb2e69c3b74288&partnerid=" + currentUser + "&builderid=" + builderID);
		var modifyListingField = form.addField('modifylisting', 'url', null, null, 'fieldgroup').setDisplayType('inline').setLinkText("Modify Incomplete Listing").setDefaultValue("https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=113&deploy=1&compid=1309901&h=f8be8fd8dbfe9433b360&partnerid=" + currentUser + "&builderid=" + builderID + "&modify=T");
          }}
	  form.setFieldValues({user:currentUser,builderdivision:builderID});
	  fieldgroup.setSingleColumn(true);

      form.addSubmitButton('Modify Selected Listing');
      form.addResetButton();
      response.writePage(form);
   }

   else
   {
	  var form = nlapiCreateForm('Listing Creation');
      var userID = request.getParameter('user');
	  var builderDivisionID = request.getParameter('builderdivision');
	  var modifyListingValue = request.getParameter('modifylisting');
	  
	  if(builderDivisionID==3642 || builderDivisionID==3643 ){
		  
		  response.sendRedirect('external', "https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=259&deploy=1&compid=1309901&h=86cd4feb2e69c3b74288&partnerid=" + userID + "&builderid=" + builderDivisionID + "&propertyid=" + modifyListingValue);
  
		  
	  }
	  
	  else{
	
	  // REAL VERSION OF THE SCRIPT: 
	  response.sendRedirect('external', "https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=98&deploy=1&compid=1309901&h=7d701610411dac05393d&partnerid=" + userID + "&builderid=" + builderDivisionID + "&propertyid=" + modifyListingValue);
      }
	  
	  // TEST VERSION OF THE SCRIPT::
	  //response.sendRedirect('external', "https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=259&deploy=1&compid=1309901&h=7d701610411dac05393d&partnerid=" + userID + "&builderid=" + builderDivisionID + "&propertyid=" + modifyListingValue);
   }
}