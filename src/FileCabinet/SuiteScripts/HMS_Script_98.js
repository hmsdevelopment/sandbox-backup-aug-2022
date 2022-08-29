/*
Author:  Michael Hulshult
Date: 2/1/2014
Purpose:  This Suitelet is deployed to external users, and acts as a submission form for builders to be able to create new properties.
*/

function createListing(request, response)
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

      var form = nlapiCreateForm('Create New Listing');
	  var fieldgroup = form.addFieldGroup('fieldgroup', 'Please enter information below');

      //Get the property id based on the link that was sent to the user
      var currentUser = request.getParameter('partnerid');
	  var builderID = request.getParameter('builderid');
	  var propertyID = request.getParameter('propertyid');
	  var currentUserField = form.addField('user', 'text', 'user').setDisplayType('hidden');
	  var builderDivisionField = form.addField('builderdivision', 'text', 'builder').setDisplayType('hidden');
	  var propertyField = form.addField('property', 'text', 'property').setDisplayType('hidden');
	  var setPermitField = 'F';
  	  //-----------------added by abhishek ---------------
	  var filtersbuilderpersonnel = [];
	  var columnsbuilderpersonnel = [];
	  columnsbuilderpersonnel.push(new nlobjSearchColumn('firstname'));
	  columnsbuilderpersonnel.push(new nlobjSearchColumn('lastname'));
	  filtersbuilderpersonnel[0] = new nlobjSearchFilter('custentity1', null, 'anyof', builderID);
	  filtersbuilderpersonnel[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	  var resultsbuilderpersonnel = nlapiSearchRecord('partner', null, filtersbuilderpersonnel, columnsbuilderpersonnel);
	  var custpage_builder_personnel = form.addField('custpage_builder_personnel', 'select', 'Builder Personnel', null, 'fieldgroup');
	  custpage_builder_personnel.addSelectOption('', '');
	  if(resultsbuilderpersonnel)
	  {
			for(var a=0; a < resultsbuilderpersonnel.length; a++)
			{
				var lastname = resultsbuilderpersonnel[a].getValue('lastname');
				var firstname = resultsbuilderpersonnel[a].getValue('firstname');
				var bperid = resultsbuilderpersonnel[a].getId();
				custpage_builder_personnel.addSelectOption(bperid, lastname+','+firstname);
			}
	  }
	  
	  form.addField('custpage_building_permit', 'file', 'Upload Building Permit Here');
	  //----------- end added by abhishek ----------------
	  
	  var subdivisionField = form.addField('subdivisionselection', 'select', 'Subdivision', null, 'fieldgroup').setMandatory(true);
	  
	  var filters = new Array();
	  filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'anyof', builderID);
	  filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	  var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
	  if(results == null)
	  {
		subdivisionField.addSelectOption('-1', 'No Subdivisions Found for this Builder');
	  }
	  
	  else
	  {
		for(var i=0;results != null && results.length > i; i++)
		{
			var recordID = results[i].getId();
			var record = nlapiLoadRecord('customrecord_subdivision', recordID);
			var subdivisionName = record.getFieldValue('custrecord_subdivision_id');
			subdivisionField.addSelectOption(recordID, subdivisionName);
			var mlsRegion1 = record.getFieldValue('custrecord_mls_region_1');
			var mlsRegion2 = record.getFieldValue('custrecord_mls_region_2');
			if(mlsRegion1 != null && mlsRegion1 != '' && setPermitField == 'F')
			{
				var mlsRegionRecord = nlapiLoadRecord('location', mlsRegion1);
				var permitRequired = mlsRegionRecord.getFieldValue('custrecord_permit_required');
				if(permitRequired == 'T')
				{
					setPermitField = 'T';
				}
			}
			
			if(mlsRegion2 != null && mlsRegion1 != '' && setPermitField == 'F')
			{
				var mlsRegionRecord = nlapiLoadRecord('location', mlsRegion2);
				var permitRequired = mlsRegionRecord.getFieldValue('custrecord_permit_required');
				if(permitRequired == 'T')
				{
					setPermitField = 'T';
				}
			}		
		}
	  }
	  
	  var lotField = form.addField('lotnumber', 'text', 'Lot Number', null, 'fieldgroup').setMandatory(true);
	  var streetDirectionField = form.addField('streetdirection', 'select', 'Street Direction', null, 'fieldgroup');
	  streetDirectionField.addSelectOption('', '', true);
	  streetDirectionField.addSelectOption('1', 'W');
	  streetDirectionField.addSelectOption('2', 'S');
	  streetDirectionField.addSelectOption('3', 'E');
	  streetDirectionField.addSelectOption('4', 'N');
	  var streetField = form.addField('streetname', 'text', 'Street Name', null, 'fieldgroup').setMandatory(true);
	  var streetTypeField = form.addField('streettype', 'select', 'Street Type', null, 'fieldgroup').setMandatory(true);
	  streetTypeField.addSelectOption('', '', true);
	  streetTypeField.addSelectOption('8', 'Aly');
	  streetTypeField.addSelectOption('9', 'Ave');
	  streetTypeField.addSelectOption('10', 'Blvd');
	  streetTypeField.addSelectOption('11', 'Cir');
	  streetTypeField.addSelectOption('12', 'Crk');
	  streetTypeField.addSelectOption('13', 'Ct');
	  streetTypeField.addSelectOption('14', 'Ctr');
	  streetTypeField.addSelectOption('36', 'Dr');
	  streetTypeField.addSelectOption('15', 'Expwy');
	  streetTypeField.addSelectOption('16', 'Hgwy');
	  streetTypeField.addSelectOption('17', 'Jct');
	  streetTypeField.addSelectOption('40', 'Knl');
	  streetTypeField.addSelectOption('20', 'Ln');
	  streetTypeField.addSelectOption('22', 'Lp');
	  streetTypeField.addSelectOption('37', 'Pass');
	  streetTypeField.addSelectOption('23', 'Pike');
	  streetTypeField.addSelectOption('24', 'Pkwy');
	  streetTypeField.addSelectOption('25', 'Pl');
	  streetTypeField.addSelectOption('43', 'Pt');
	  streetTypeField.addSelectOption('26', 'Rd');
	  streetTypeField.addSelectOption('27', 'Rdg');
	  streetTypeField.addSelectOption('28', 'Rt');
	  streetTypeField.addSelectOption('29', 'Sq');
	  streetTypeField.addSelectOption('35', 'St');
	  streetTypeField.addSelectOption('31', 'Ter');
	  streetTypeField.addSelectOption('42', 'Trc');
	  streetTypeField.addSelectOption('38', 'Trl');
	  streetTypeField.addSelectOption('41', 'Trls');
	  streetTypeField.addSelectOption('39', 'View');
	  streetTypeField.addSelectOption('32', 'Vly');
	  streetTypeField.addSelectOption('33', 'Way');
	  var houseNumberField = form.addField('housenumber', 'text', 'House Number', null, 'fieldgroup').setMandatory(true);
	  var constructionStatusField = form.addField('constructionstatus', 'select', 'Current Construction Status', null, 'fieldgroup').setMandatory(true);
      constructionStatusField.addSelectOption('','', true);
	  constructionStatusField.addSelectOption('10','Complete');
      constructionStatusField.addSelectOption('6','Drywall Complete');
      constructionStatusField.addSelectOption('5','Existing Structure');
      constructionStatusField.addSelectOption('2','Foundation');
      constructionStatusField.addSelectOption('9','Framed');
      constructionStatusField.addSelectOption('3','Paper');
	  constructionStatusField.addSelectOption('12','Prepared');
	  constructionStatusField.addSelectOption('7','Permit Filed');
      constructionStatusField.addSelectOption('4','To Be Built');
      constructionStatusField.addSelectOption('8','Trim Stage');
      constructionStatusField.addSelectOption('1','Under Roof');	  
	  constructionStatusField.addSelectOption('11','Vacant Lot');
	  var underRoofField = form.addField('underroofdate', 'date', 'Estimated Under Roof Date', null, 'fieldgroup').setMandatory(true);
	  var completionDate = form.addField('completiondate', 'date', 'Estimated Completion Date', null, 'fieldgroup').setMandatory(true);
	  var notesField = form.addField('notes', 'textarea', 'Listing Notes', null, 'fieldgroup');
	  var salesStatusField = form.addField('salesstatus', 'select', 'Sales Status', null, 'fieldgroup').setMandatory(true);
	  salesStatusField.addSelectOption('1', 'Available');
	  salesStatusField.addSelectOption('12', 'Pending (for Comp Purposes)');
	  salesStatusField.addSelectOption('10', 'Sold Before Listed');
	  salesStatusField.addSelectOption('11', 'Available Pending Contingency');
	  var listPriceField = form.addField('listprice', 'currency', 'List Price', null, 'fieldgroup').setMandatory(true);
	  var floorplanField = form.addField('floorplan', 'select', 'Floorplan', null, 'fieldgroup');
	  floorplanField.addSelectOption('-1', '', true);

	  var floorPlanFilters = new Array();
	  floorPlanFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	  
	  var floorPlanResults = nlapiSearchRecord('customrecord_floorplan', null, floorPlanFilters);
	  for(var n=0; floorPlanResults != null && floorPlanResults.length > n; n++)
	  {
		var floorPlanID = floorPlanResults[n].getId();
		var floorPlanRecord = nlapiLoadRecord('customrecord_floorplan', floorPlanID);
		var floorPlanName = floorPlanRecord.getFieldValue('name');
		floorplanField.addSelectOption(floorPlanID, floorPlanName);
	  }
	  
	  var addFloorplanField = form.addField('addfloorplan', 'text', 'Add Floorplan (if not listed above)', null, 'fieldgroup');
	  var floorplanElevationField = form.addField('elevation', 'text', 'Floorplan Elevation', null, 'fieldgroup');
	  var cornerLotField = form.addField('cornerlot', 'checkbox', 'Check if this is a corner lot', null, 'fieldgroup');
	  
      //Set the property
	  if(propertyID != null && propertyID != '' && propertyID != undefined)
	  {
		var buttonurl = nlapiResolveURL('SUITELET', 'customscript_hms_upload_multiple_files', 'customdeploy_hms_upload_multiple_files', true)+'&propertyid='+propertyID;
		var scriptbutton = 'window.open(\''+buttonurl+'\', \'\', \'width=900,height=600,resizable=yes,scrollbars=yes\');';
		form.addButton('custpage_upload_multiple_files', 'Upload Multiple Files (Instead of Market Home Info Sheet)',scriptbutton);
 	    var photoField = form.addField('photo', 'file', 'Upload Front Elevation Photo or Rendering');
	    var useRenderingOnFileField = form.addField('userendering', 'checkbox', 'Use Rendering on File with HMS');
		if(setPermitField == 'T')
	    {
		  var permitField = form.addField('permit', 'file', 'Upload Building Permit');
	    }
		
	    
		var completeField = form.addField('formcomplete', 'checkbox', 'Mark Property as Complete');
		//var fileURL1 = form.addField('custpage_fileurl', 'url', 'Download Market Home Information Sheet Here (Right Click and Save As to Your Computer)');
		//fileURL1.setDisplayType('inline');
	    
		var propertyRecord = nlapiLoadRecord('customrecord_property_record', propertyID);
  	    var subdivisionValue = propertyRecord.getFieldValue('custrecordcustrecordsubdname');
		nlapiLogExecution('DEBUG', 'subdivisionValue ' + subdivisionValue);
		if(subdivisionValue)
		{
			var marketHomeInfoURL = nlapiLookupField('customrecord_subdivision', subdivisionValue, 'custrecord49');
			if(marketHomeInfoURL)
			{
				var filerec = nlapiLoadFile(marketHomeInfoURL);
				marketHomeInfoURL = filerec.getURL();
				var marketHomeInfoField = form.addField('custpage_mhisurl', 'inlinehtml');
				marketHomeInfoField.setDefaultValue('<b>You must right click on the link below, <br> select "Save Link As..." or "Save Target As..."<br>  and save it to your desktop (or any other temporaray location).<br>  Go to your desktop (or where you saved it) and open the file you just saved with Acrobat Reader.<br>  You can then save the filled PDF and upload it below.</b></p><br><a href="'+marketHomeInfoURL+'"  target="_blank" style="color: #0052cc" >Download Market Home Information Sheet Here</a>');
			}
			
		}
		
		var marketHomeInfoField = form.addField('markethomeinfo', 'file', 'Upload Completed Market Home Information Sheet');
		/*
		var fileurl11 = '';
		if(subdivisionValue)
		{
			var sfileid = nlapiLookupField('customrecord_subdivision',subdivisionValue,'custrecord49');
			nlapiLogExecution('DEBUG', 'sfileid ' + sfileid);
			if(sfileid)
			{
				var filerec = nlapiLoadFile(sfileid);
				fileurl11 = filerec.getURL();
				var filename = filerec.getName();
				nlapiLogExecution('DEBUG', 'fileurl11 ' + fileurl11);
				fileURL1.setLinkText(filename);
			}
		}
		*/
	    var lotValue = propertyRecord.getFieldValue('custrecord_lot_number');
	    var streetValue = propertyRecord.getFieldValue('custrecord31');
		var streetText = propertyRecord.getFieldText('custrecord31');
		var streetRecord = nlapiLoadRecord('customrecord_street_name', streetValue);
		var streetDirectionValue = streetRecord.getFieldValue('custrecord_prefix');
	    var streetTypeValue = streetRecord.getFieldValue('custrecord_suffix');
	    var houseNumberValue = propertyRecord.getFieldValue('custrecord_house_number');
	    var constructionStatusValue = propertyRecord.getFieldValue('custrecord_current_construction');
	    var underRoofValue = propertyRecord.getFieldValue('custrecord_estimated_under_roof_date');
	    var completionDateValue = propertyRecord.getFieldValue('custrecord_estimated_completion_date');
	    var photoFieldValue = propertyRecord.getFieldValue('custrecord_initial_photo');
	    var permitFieldValue = propertyRecord.getFieldValue('custrecord_permit');
	    var notesFieldValue = propertyRecord.getFieldValue('custrecord_listing_notes');
	    var salesStatusFieldValue = propertyRecord.getFieldValue('custrecord_property_status');
	    var listPriceFieldValue = propertyRecord.getFieldValue('custrecord_current_list_price');
	    var floorplanFieldValue = propertyRecord.getFieldValue('custrecord_floorplan');

    	subdivisionField.setMandatory(false);
	    lotField.setMandatory(false);
	    streetDirectionField.setMandatory(false);
	    streetField.setMandatory(false);
	    streetTypeField.setMandatory(false);
	    houseNumberField.setMandatory(false);
	    constructionStatusField.setMandatory(false);
	    underRoofField.setMandatory(false);
	    completionDate.setMandatory(false);
	    //photoField.setMandatory(false);
	    //if(setPermitField == 'T')
		//{
		//	permitField.setMandatory(false);
		//}
	    notesField.setMandatory(false);
	    salesStatusField.setMandatory(false);
	    listPriceField.setMandatory(false);
	    floorplanField.setMandatory(false);
		addFloorplanField.setMandatory(false);
		marketHomeInfoField.setMandatory(true);
		
		//form.setFieldValues({user:currentUser,custpage_mhisurl:marketHomeInfoURL,builderdivision:builderID,property:propertyID,subdivisionselection:subdivisionValue,lotnumber:lotValue,streetdirection:streetDirectionValue,streetname:streetText,streettype:streetTypeValue,housenumber:houseNumberValue,constructionstatus:constructionStatusValue,underroofdate:underRoofValue,completiondate:completionDateValue,photo:photoFieldValue,notes:notesFieldValue,salesstatus:salesStatusFieldValue,listprice:listPriceFieldValue,floorplan:floorplanFieldValue});
		form.setFieldValues({user:currentUser,builderdivision:builderID,property:propertyID,subdivisionselection:subdivisionValue,lotnumber:lotValue,streetdirection:streetDirectionValue,streetname:streetText,streettype:streetTypeValue,housenumber:houseNumberValue,constructionstatus:constructionStatusValue,underroofdate:underRoofValue,completiondate:completionDateValue,photo:photoFieldValue,notes:notesFieldValue,salesstatus:salesStatusFieldValue,listprice:listPriceFieldValue,floorplan:floorplanFieldValue});
	  }
	  
	  else
	  {
		form.setFieldValues({user:currentUser,builderdivision:builderID});
	  }
	  fieldgroup.setSingleColumn(true);

      form.addSubmitButton();
      form.addResetButton();
      response.writePage(form);
   }
   else
   {
	  var form = nlapiCreateForm('Listing Creation');
      var userID = request.getParameter('user');
	  var builderDivisionID = request.getParameter('builderdivision');
	  var subdivisionValue = request.getParameter('subdivisionselection');
	  var lotValue = request.getParameter('lotnumber');
	  var streetNameValue = request.getParameter('streetname');
	  var streetTypeValue = request.getParameter('streettype');
	  var streetDirectionValue = request.getParameter('streetdirection');
	  var houseNumberValue = request.getParameter('housenumber');
	  var constructionStatusValue = request.getParameter('constructionstatus');
	  var underRoofDateValue = request.getParameter('underroofdate');
	  var completionDateValue = request.getParameter('completiondate');
	  var photoValue = request.getFile('photo');
	  var permitValue = request.getFile('permit');
	  
	  var notesValue = request.getParameter('notes');
	  var salesStatusValue = request.getParameter('salesstatus');
	  var listPriceValue = request.getParameter('listprice');
	  var floorplanValue = request.getParameter('floorplan');
	  var addFloorplanValue = request.getParameter('addfloorplan');
	  var marketHomeInfoValue = request.getFile('markethomeinfo');
	  var propertyIDValue = request.getParameter('property');
	  var elevationValue = request.getParameter('elevation');
	  var cornerLotValue = request.getParameter('cornerlot');
	  var formCompleteValue = request.getParameter('formcomplete');
	  var useRenderingValue = request.getParameter('userendering');
	  
	  if(propertyIDValue == null || propertyIDValue == '' || propertyIDValue == undefined)
	  {
	//Get Sales Status text	  
		  var salesStatusFilters = new Array();
		  salesStatusFilters[0] = new nlobjSearchFilter('custrecord_property_status', null, 'is', salesStatusValue);
		  
		  var salesStatusResults = nlapiSearchRecord('customrecord_property_record', null, salesStatusFilters);
		  for(var j=0; salesStatusResults != null && j == 0; j++)
		  {
			var getSalesStatusRecord = nlapiLoadRecord('customrecord_property_record', salesStatusResults[j].getId());
			var salesStatusText = getSalesStatusRecord.getFieldText('custrecord_property_status');
		  }
	//Get Street Direction text
		  var streetDirectionText = null;
		  if(streetDirectionValue != null && streetDirectionValue != '')
		  {
			var streetDirectionFilters = new Array();
			streetDirectionFilters[0] = new nlobjSearchFilter('custrecord_prefix', null, 'is', streetDirectionValue);
		  
			var streetDirectionResults = nlapiSearchRecord('customrecord_street_name', null, streetDirectionFilters);
			for(var k=0; streetDirectionResults != null && k == 0; k++)
			{
				var streetDirectionRecord = nlapiLoadRecord('customrecord_street_name', streetDirectionResults[k].getId());
				streetDirectionText = streetDirectionRecord.getFieldText('custrecord_prefix');
			}
		  }
	//Get Street Type text
		  var streetTypeFilters = new Array();
		  streetTypeFilters[0] = new nlobjSearchFilter('custrecord_suffix', null, 'is', streetTypeValue);
		  
		  var streetTypeResults = nlapiSearchRecord('customrecord_street_name', null, streetTypeFilters);
		  for(var l=0; streetTypeResults != null && l == 0; l++)
		  {
			var streetTypeRecord = nlapiLoadRecord('customrecord_street_name', streetTypeResults[l].getId());
			var streetTypeText = streetTypeRecord.getFieldText('custrecord_suffix');
		  }

	//Get Subdivision text
		  var subdivisionFilters = new Array();
		  subdivisionFilters[0] = new nlobjSearchFilter('internalid', null, 'is', subdivisionValue);
		  
		  var subdivisionResults = nlapiSearchRecord('customrecord_subdivision', null, subdivisionFilters);
		  for(var m=0; subdivisionResults != null && m == 0; m++)
		  {
			var subdivisionRecord = nlapiLoadRecord('customrecord_subdivision', subdivisionResults[m].getId());
			var subdivisionText = subdivisionRecord.getFieldValue('name');
		  }

	//Check to see if the street record already exists, and if not, create it
		  var street = null;
		  var filters = new Array();
		  filters[0] = new nlobjSearchFilter('custrecord_street_name', null, 'is', streetNameValue);
		  filters[1] = new nlobjSearchFilter('custrecord_suffix', null, 'anyof', streetTypeValue);
		  filters[2] = new nlobjSearchFilter('custrecord_subdivision', null, 'anyof', subdivisionValue);
		  if(streetDirectionValue != '' && streetDirectionValue != null && streetDirectionValue != '-1')
		  {
			filters[3] = new nlobjSearchFilter('custrecord_prefix', null, 'anyof', streetDirectionValue);
		  }
		  
		  var results = nlapiSearchRecord('customrecord_street_name', null, filters);
		  if(results == null)
		  {
			var newStreetName;
			var createStreetRecord = nlapiCreateRecord('customrecord_street_name');
			createStreetRecord.setFieldValue('custrecord_subdivision', subdivisionValue);
			createStreetRecord.setFieldValue('custrecord_prefix', streetDirectionValue);
			createStreetRecord.setFieldValue('custrecord_suffix', streetTypeValue);
			createStreetRecord.setFieldValue('custrecord_street_name', streetNameValue);
			createStreetRecord.setFieldValue('custrecord_externally_created', 'T');
			
			if(streetDirectionValue == null || streetDirectionValue == '')
			{
				newStreetName = streetNameValue + ' ' + streetTypeText;
			}
			
			else
			{
				newStreetName = streetNameValue + ' ' + streetTypeText + ' ' + streetDirectionText;
			}
			createStreetRecord.setFieldValue('name', newStreetName);
			street = nlapiSubmitRecord(createStreetRecord, true, true);
		  }
		  
		  for(var i=0; results != null && results.length > i; i++)
		  {
			street = results[i].getId();
		  }
		  
		  if(streetDirectionText != null)
		  {
			var roughStreetName = streetNameValue + ' ' + streetTypeText + ' ' + streetDirectionText;
		  }
		  
		  else
		  {
			var roughStreetName = streetNameValue + ' ' + streetTypeText;
		  }
		  var propertyName = roughStreetName + ' ' + houseNumberValue + ' (' + salesStatusText + ') ' + subdivisionText;
		  var simpleName = houseNumberValue + ' ' + roughStreetName;
		  
	//Create the Floorplan, if entered
		  if(addFloorplanValue != null && addFloorplanValue != '' && addFloorplanValue != '-1' && addFloorplanValue != undefined)
		  {
			var newFloorplan = nlapiCreateRecord('customrecord_floorplan');
			newFloorplan.setFieldValue('name', addFloorplanValue);
			floorplanValue = nlapiSubmitRecord(newFloorplan);
		  }
		  
		  var propertyRecord = nlapiCreateRecord('customrecord_property_record');
		  propertyRecord.setFieldValue('name', propertyName);
		  propertyRecord.setFieldValue('custrecord12', builderDivisionID);
		  propertyRecord.setFieldValue('custrecordcustrecordsubdname', subdivisionValue);
		  propertyRecord.setFieldValue('custrecord_lot_number', lotValue);
		  propertyRecord.setFieldValue('custrecord_property_status', '6');
		  propertyRecord.setFieldValue('custrecord_user_entered_sales_status', salesStatusValue);
		  propertyRecord.setFieldValue('custrecord_simple_name', simpleName);
		  propertyRecord.setFieldValue('custrecord_house_number', houseNumberValue);
		  propertyRecord.setFieldValue('custrecord_current_construction', constructionStatusValue);
		  propertyRecord.setFieldValue('custrecord_construction_status_listing', constructionStatusValue);
		  propertyRecord.setFieldValue('custrecord_estimated_under_roof_date', underRoofDateValue);
		  propertyRecord.setFieldValue('custrecord_estimated_completion_date', completionDateValue);
		  propertyRecord.setFieldValue('custrecord_listing_notes', notesValue);
		  propertyRecord.setFieldValue('custrecord_original_listing_price', listPriceValue);
		  propertyRecord.setFieldValue('custrecord_current_list_price', listPriceValue);
		  propertyRecord.setFieldValue('custrecord31', street);
		  propertyRecord.setFieldValue('customform', '12');
		  propertyRecord.setFieldValue('custrecord_created', userID);
	      propertyRecord.setFieldValue('custrecord_elevation', elevationValue);
	      propertyRecord.setFieldValue('custrecord_corner_lot', cornerLotValue);
	      propertyRecord.setFieldValue('custrecord_use_rendering', useRenderingValue);
	  
		  if(floorplanValue != '-1')
		  {
			propertyRecord.setFieldValue('custrecord_floorplan', floorplanValue);
		  }
		  
		  if(marketHomeInfoValue != null && marketHomeInfoValue != '')
		  {
			marketHomeInfoValue.setFolder(38);
			var marketHomeInfoFile = nlapiSubmitFile(marketHomeInfoValue);
			propertyRecord.setFieldValue('custrecord_market_home_info', marketHomeInfoFile);
		  }
		  
		  if(permitValue != null && permitValue != '')
		  {
			  permitValue.setFolder(951);
			  var permitFile = nlapiSubmitFile(permitValue);
			  propertyRecord.setFieldValue('custrecord_permit', permitFile);
		  }
		  
		  if(photoValue != null && photoValue != '')
		  {
			  photoValue.setFolder(-4);
			  var photoFile = nlapiSubmitFile(photoValue);
			  propertyRecord.setFieldValue('custrecord_initial_photo', photoFile);
		  }
		  
		  var propertyRecordID = nlapiSubmitRecord(propertyRecord, true, true);
		  if(marketHomeInfoValue != null && marketHomeInfoValue != '')
		  {
			nlapiAttachRecord("file", marketHomeInfoFile, "customrecord_property_record", propertyRecordID);
		  }
		  
		  if(permitValue != null && permitValue != '')
		  {
			nlapiAttachRecord("file", permitFile, "customrecord_property_record", propertyRecordID);
		  }
		  
		  if(photoValue != null && photoValue != '')
		  {
			nlapiAttachRecord("file", photoFile, "customrecord_property_record", propertyRecordID);
		  }
		   //----------- send emails --------------
		   var proprecord = nlapiLoadRecord("customrecord_property_record", propertyRecordID);
		   var pthouseno = proprecord.getFieldValue('custrecord_house_number');
			var ptstreet = proprecord.getFieldText('custrecord31');
			var subdiv = proprecord.getFieldValue('custrecordcustrecordsubdname');
			var ptsubdivision = '';
			if(subdiv)
			{
				ptsubdivision = nlapiLookupField('customrecord_subdivision',subdiv,'custrecord_subdivision_id');
			}
			var ptlotno = proprecord.getFieldValue('custrecord_lot_number');
			var builderpersonnel = request.getParameter('custpage_builder_personnel') || '';
			if(builderpersonnel)
			{
				var partnerRecord = nlapiLoadRecord('partner',builderpersonnel);
				var pemail = partnerRecord.getFieldValue('email');
				var attachrecord = {};
				attachrecord['recordtype'] = 'customrecord_property_record';
				attachrecord['record'] = propertyRecordID;
				var pformurl = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=218&deploy=1&compid=1309901&h=a10cae482e7d12f43423&pid='+propertyRecordID;
				if(pemail)
				{
					var pemailnotification = 'This is a request for a building permit for " '+pthouseno+' '+ptstreet+' '+ptsubdivision+' " lot " '+ptlotno+' ".<br> Please click the following link to upload it to HMS.';
					pemailnotification = pemailnotification + '<br><a href="' + pformurl+'">Click Here </a>';
					nlapiSendEmail('3',pemail,'Request for Building Permit',pemailnotification,null,null, attachrecord);
				}
			}
			var buildingPermit = request.getFile('custpage_building_permit');
			if(buildingPermit)
			{
				buildingPermit.setFolder(14903);
				var buildingPermitfile = nlapiSubmitFile(buildingPermit);
				nlapiAttachRecord("file", buildingPermitfile, "customrecord_property_record", propertyRecordID);
			}
		  //------------end send emails ----------
		  //var confirmation = form.addField('custpage_confirmation', 'label', 'Listing has been created.');
		  response.sendRedirect('external', "https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=210&deploy=1&compid=1309901&h=838a6fc5192c4ce1ad77&partnerid=" + userID + "&builderid=" + builderDivisionID + "&propertyid=" + propertyRecordID);
		  
	  }
		else
	  {
		  var propertyRecord = nlapiLoadRecord('customrecord_property_record', propertyIDValue);
			var pthouseno = propertyRecord.getFieldValue('custrecord_house_number');
			var ptstreet = propertyRecord.getFieldText('custrecord31');
			var subdiv = proprecord.getFieldValue('custrecordcustrecordsubdname');
			var ptsubdivision = '';
			if(subdiv)
			{
				ptsubdivision = nlapiLookupField('customrecord_subdivision',subdiv,'custrecord_subdivision_id');
			}
			var ptlotno = propertyRecord.getFieldValue('custrecord_lot_number');
		  if(marketHomeInfoValue != null && marketHomeInfoValue != '')
		  {
			marketHomeInfoValue.setFolder(38);
			var marketHomeInfoFile = nlapiSubmitFile(marketHomeInfoValue);
			propertyRecord.setFieldValue('custrecord_market_home_info', marketHomeInfoFile);
		  }
		  
		  if(permitValue != null && permitValue != '')
		  {
			  permitValue.setFolder(951);
			  var permitFile = nlapiSubmitFile(permitValue);
			  propertyRecord.setFieldValue('custrecord_permit', permitFile);
		  }
		  
		  if(photoValue != null && photoValue != '')
		  {
			  photoValue.setFolder(-4);
			  var photoFile = nlapiSubmitFile(photoValue);
			  propertyRecord.setFieldValue('custrecord_initial_photo', photoFile);
		  }
		  
		  var propertyRecordID = nlapiSubmitRecord(propertyRecord, true, true);
		  if(marketHomeInfoValue != null && marketHomeInfoValue != '')
		  {
			nlapiAttachRecord("file", marketHomeInfoFile, "customrecord_property_record", propertyRecordID);
		  }
		  
		  if(permitValue != null && permitValue != '')
		  {
			nlapiAttachRecord("file", permitFile, "customrecord_property_record", propertyRecordID);
		  }
		  
		  if(photoValue != null && photoValue != '')
		  {
			nlapiAttachRecord("file", photoFile, "customrecord_property_record", propertyRecordID);
		  }
		  
		  //----------- send emails --------------
		var builderpersonnel = request.getParameter('custpage_builder_personnel') || '';
		if(builderpersonnel)
		{
			var partnerRecord = nlapiLoadRecord('partner',builderpersonnel);
			var pemail = partnerRecord.getFieldValue('email');
			var attachrecord = {};
			attachrecord['recordtype'] = 'customrecord_property_record';
			attachrecord['record'] = propertyRecordID;
			var pformurl = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=218&deploy=1&compid=1309901&h=a10cae482e7d12f43423&pid='+propertyRecordID;
			if(pemail)
			{
				var pemailnotification = 'This is a request for a building permit for " '+pthouseno+' '+ptstreet+' '+ptsubdivision+' " lot " '+ptlotno+' ".<br> Please click the following link to upload it to HMS.';
				pemailnotification = pemailnotification + '<br><a href="' + pformurl+'">Click Here </a>';
				nlapiSendEmail('3',pemail,'Request for Building Permit',pemailnotification,null,null, attachrecord);
			}
		}
		var buildingPermit = request.getFile('custpage_building_permit');
		if(buildingPermit)
		{
			buildingPermit.setFolder(14903);
			var buildingPermitfile = nlapiSubmitFile(buildingPermit);
			nlapiAttachRecord("file", buildingPermitfile, "customrecord_property_record", propertyRecordID);
		}
	  //------------end send emails ----------
	  
		  
		  var confirmation = form.addField('custpage_confirmation', 'label', 'Listing has been updated.');
	  }
	  
	  
	  
      response.writePage(form);
   }
}