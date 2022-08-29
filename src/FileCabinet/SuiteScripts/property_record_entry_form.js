/**
 * @author Jeff McDonald
 */
var oldSaleStatusId = nlapiGetFieldValue('custrecord_property_status');
function updateProperty(type, name)
{
	var today = new Date();
	var month = today.getMonth();
	month = month + 1;
	var day = today.getDate();
	var year = today.getFullYear();
	var dateFormatted = month + '/' + day + '/' + year;

	/*
	
	*/
	if (name == 'custrecord31' || name == 'custrecord_house_number' || name == 'custrecordcustrecordsubdname' || name == 'custrecord_property_status') 
		{
			nlapiSetFieldValue('name', trim(nlapiGetFieldText('custrecord31')) + ' ' +
				trim(nlapiGetFieldValue('custrecord_house_number')) + ' (' +
				trim(nlapiGetFieldText('custrecord_property_status')) + ') ' +
				trim(nlapiGetFieldText('custrecordcustrecordsubdname')));
			nlapiSetFieldValue('custrecord_simple_name', trim(nlapiGetFieldValue('custrecord_house_number')) + ' ' +
				trim(nlapiGetFieldText('custrecord31')));
		}
	
	/*COMMENTED OUT BY JEFF 7/1/14 FOR TESTING
	if(name == 'custrecordcustrecordsubdname')
	{
		var subdivision = nlapiGetFieldValue('custrecordcustrecordsubdname');
		if(subdivision != '' && subdivision != null)
		{
			
			var subdivisionRecord = nlapiLoadRecord('customrecord_subdivision', subdivision);
			var county = subdivisionRecord.getFieldValues('custrecord_county');
			var schoolDistrict = subdivisionRecord.getFieldValues('custrecord_school_district');
			
			
			if(county != null && county != '')
			{
				var countyToString = county.toString();
				var oneCounty = countyToString.indexOf(",");
				if(oneCounty == '-1')
				{
					nlapiSetFieldValue('custrecord10', county);
				}
			}
			
			if(schoolDistrict != null && schoolDistrict != '')
			{
				var schoolDistrictToString = schoolDistrict.toString();
				var oneSchoolDistrict = schoolDistrictToString.indexOf(",");
				if(oneSchoolDistrict == '-1')
				{
					nlapiSetFieldValue('custrecord11', schoolDistrict);
				}
			}
		}
	}*/

	if(name == 'custrecord13')
	{
		var bsr = nlapiGetFieldValue('custrecord13');
		if(bsr != null && bsr != '')
		{
			var bsrRecord = nlapiLoadRecord('partner', bsr);
			var teamMembers = bsrRecord.getFieldValues('custentity_team_members');
			nlapiSetFieldValues('custrecord_property_bsr_team_members', teamMembers,false,false);
		}
	}
	
	if(name == 'custrecord31')
	{
		var street = nlapiGetFieldText('custrecord31');
		nlapiSetFieldValue('custrecord_street', street,false,false);
	}
	
	if(name == 'custrecord_current_construction')
	{
		nlapiSetFieldValue('custrecord_property_date_const_update', dateFormatted,false,false);
	}
	
	//Added by Jeff to duplucate the functionality in the above code, but for Sales Status
	
	if(name == 'custrecord_property_status')
	{
		var saleStatusId = nlapiGetFieldValue('custrecord_property_status');
		//alert(saleStatusId);
		if (saleStatusId == '11' || saleStatusId == '12')
		{
			alert('Selecting this status will initiate the process of sending an automated sales and closing notification request to this builder.');
		}	
		nlapiSetFieldValue('custrecord_property_date_sales_st_update', dateFormatted,false,false);
		
		if (oldSaleStatusId == '11' && saleStatusId != '3' && saleStatusId != '9')
		{
			alert('When changing from Available (Pending Contigency) be sure to check the property in FischerNet. See Al with any questions.')
		}
	}
	
	if(name == 'custrecord_original_listing_price' && (nlapiGetFieldValue('custrecord_current_list_price') == '' || nlapiGetFieldValue('custrecord_current_list_price') == null))
	{
		var listPrice = nlapiGetFieldValue('custrecord_original_listing_price');
		nlapiSetFieldValue('custrecord_current_list_price', listPrice,false,false);
	}
	
	if(name == 'custrecord_construction_status_listing')
	{
		var status = nlapiGetFieldValue('custrecord_construction_status_listing');
		nlapiSetFieldValue('custrecord_current_construction', status,false,false);
	}
	
	if(name == 'custrecord_property_bsr_team') // The following bit seems unecessary so I commented it out: || name == 'custrecord_house_number' )
	{
		var bsrTeam = nlapiGetFieldValue('custrecord_property_bsr_team');
		if(bsrTeam != null && bsrTeam != '')
		{
			var bsrTeamRecord = nlapiLoadRecord('partner', bsrTeam);
			var teamMembers = bsrTeamRecord.getFieldValues('custentity_team_members');
			if(teamMembers != null)
			{
				try
				{
					nlapiSetFieldValues('custrecord_property_bsr_team_members', teamMembers,false,false);
				}
				catch(e)
				{
				}
			}
		}
	}
	
	if(name == 'custrecord_selling_price')
	{
		var price = nlapiGetFieldValue('custrecord_selling_price');
		nlapiSetFieldValue('custrecord50', price,false,false);
	}
	
	if(name == 'custrecord12')
	{
		var  builder = nlapiGetFieldValue('custrecord12');
		topLevelParent(builder);
	}
	
	if(name == 'custrecord_property_bsr_team_members')
	{
		var teamMembers = nlapiGetFieldValue('custrecord_property_bsr_team_members');
		
		var j = 0;
		var updatedTeamMembers = new Array();
		for(var k=0; teamMembers != null && teamMembers.length > k; k++)
		{
			var char = teamMembers.charAt(k);
			if(updatedTeamMembers[j] == undefined)
			{
				updatedTeamMembers[j] = '';
			}
			
			switch(char)
			{
				case '0':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				case '1':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				case '2':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				case '3':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				case '4':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				case '5':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				case '6':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				case '7':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				case '8':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				case '9':
				updatedTeamMembers[j] = updatedTeamMembers[j] + char;
				break;
				
				default:
				j++;
			}
		}
			
		var subdivision = nlapiGetFieldValue('custrecordcustrecordsubdname');
		var id = nlapiGetFieldValue('id');
		var bsr = nlapiGetFieldValue('custrecord_property_bsr_team');

		if(subdivision != null && subdivision != '')
		{
			var subdivisionRecord = nlapiLoadRecord('customrecord_subdivision', subdivision);
			subdivisionRecord.setFieldValues('custrecord48', updatedTeamMembers);
			nlapiSubmitRecord(subdivisionRecord, true, true);
		}
		
		if(bsr != null && bsr != '')
		{
			var bsrRecord = nlapiLoadRecord('partner', bsr);
			bsrRecord.setFieldValues('custentity_team_members', updatedTeamMembers);
			nlapiSubmitRecord(bsrRecord, true, true);
		}
		
		var propertyFilters = new Array();
		propertyFilters[0] = new nlobjSearchFilter('custrecord_property_bsr_team', null, 'anyof', bsr);
		propertyFilters[1] = new nlobjSearchFilter('id', null, 'noneof', id);
		propertyFilters[2] = new nlobjSearchFilter('internalid', null, 'is', 'F');
		
		var propertyResults = nlapiSearchRecord('customrecord_property_record', null, propertyFilters);
		
		for(var n=0; propertyResults != null && propertyResults.length > n; n++)
		{
			try
			{
				var property = nlapiLoadRecord(propertyResults[n].getRecordType(), propertyResults[n].getId());
				
				property.setFieldValues('custrecord_property_bsr_team_members', updatedTeamMembers);
				nlapiSubmitRecord(property, true, true);
			}
			catch(e)
			{
			}
		}
		
	}
}

/*function propertyChange()
{
	var today = new Date();
	var month = today.getMonth();
	month = month + 1;
	var day = today.getDate();
	var year = today.getFullYear();
	var dateFormatted = month + '/' + day + '/' + year;

	var propertyId = nlapiGetFieldValue('id');
	var price = nlapiGetFieldValue('custrecord_current_list_price');
	var constructionStatus = nlapiGetFieldValue('custrecord_construction_status_listing');
	var estCompletionDate = nlapiGetFieldValue('custrecord_estimated_completion_date');
	var MLSExpirationDate = nlapiGetFieldValue('custrecord_expiration_date');
	var estUnderRoofDate = nlapiGetFieldValue('custrecord_estimated_under_roof_date');
	var propertyStatus = nlapiGetFieldValue('custrecord_property_status');
	var enteredIntoMLS = nlapiGetFieldValue('custrecord_entered_mls');

	var propertyChangeRecord = nlapiCreateRecord('customrecord_property_changes');
	propertyChangeRecord.setFieldValue('custrecord_property', propertyId);
	propertyChangeRecord.setFieldValue('custrecord_property_price_change', price);
	propertyChangeRecord.setFieldValue('custrecord_change_construction_status', constructionStatus);
	propertyChangeRecord.setFieldValue('custrecord_new_estimated_under_roof', estUnderRoofDate);
	propertyChangeRecord.setFieldValue('custrecord_date_modified', dateFormatted);
	propertyChangeRecord.setFieldValue('custrecord_new_estimated_completion', estCompletionDate);
	propertyChangeRecord.setFieldValue('custrecord_new_expiration_date', MLSExpirationDate);
	propertyChangeRecord.setFieldValue('custrecord_new_property_status', propertyStatus);
	propertyChangeRecord.setFieldValue('custrecord_entered_in_mls_changes', enteredIntoMLS);

	nlapiSubmitRecord(propertyChangeRecord);
	return;
}*/


function propertyChangeCreate(type)

{
	if(type == 'create')
	{
		var today = new Date();
		var month = today.getMonth();
		month = month + 1;
		var day = today.getDate();
		var year = today.getFullYear();
		var dateFormatted = month + '/' + day + '/' + year;
		
		nlapiSetFieldValue('custrecord_property_date_sales_st_update', dateFormatted,false,false);
	
		var  builder = nlapiGetFieldValue('custrecord12');
		topLevelParent(builder);
		
		nlapiDisableField('name', 'T');
		nlapiDisableField('custrecord_top_level_builder', 'T');
	}
	
	if(type == 'edit')
	{
		var today = new Date();
		var month = today.getMonth();
		month = month + 1;
		var day = today.getDate();
		var year = today.getFullYear();
		var dateFormatted = month + '/' + day + '/' + year;

		var propertyId = nlapiGetFieldValue('id');
		var price = nlapiGetFieldValue('custrecord_current_list_price');
		var constructionStatus = nlapiGetFieldValue('custrecord_construction_status_listing');
		//var estCompletionDate = nlapiGetFieldValue('custrecord_estimated_completion_date');
		//var MLSExpirationDate = nlapiGetFieldValue('custrecord_expiration_date');
		//var estUnderRoofDate = nlapiGetFieldValue('custrecord_estimated_under_roof_date');
		var propertyStatus = nlapiGetFieldValue('custrecord_property_status');
		var enteredIntoMLS = nlapiGetFieldValue('custrecord_entered_mls');
		var MLSNumber = nlapiGetFieldValue('custrecord_mls_number_region1');
		var listDate = nlapiGetFieldValue('custrecord_list_date');
		var oldSaleStatusId = nlapiGetFieldValue('custrecord_property_status');
		
		//if(price != '' || constructionStatus != '' || estCompletionDate != '' || MLSExpirationDate != '' || estUnderRoofDate != '' || propertyStatus != '' || enteredIntoMLS != 'F' || MLSNumber != '' || listDate != '')
		if(price != '' || constructionStatus != '' || propertyStatus != '' || enteredIntoMLS != 'F' || MLSNumber != '' || listDate != '')
		{
			var propertyChangeRecord = nlapiCreateRecord('customrecord_property_changes');
			propertyChangeRecord.setFieldValue('custrecord_property', propertyId);
			propertyChangeRecord.setFieldValue('custrecord_property_price_change', price);
			propertyChangeRecord.setFieldValue('custrecord_change_construction_status', constructionStatus);
		//	propertyChangeRecord.setFieldValue('custrecord_new_estimated_under_roof', estUnderRoofDate);
			propertyChangeRecord.setFieldValue('custrecord_date_modified', dateFormatted);
		//	propertyChangeRecord.setFieldValue('custrecord_new_estimated_completion', estCompletionDate);
		//	propertyChangeRecord.setFieldValue('custrecord_new_expiration_date', MLSExpirationDate);
			propertyChangeRecord.setFieldValue('custrecord_new_property_status', propertyStatus);
			propertyChangeRecord.setFieldValue('custrecord_entered_in_mls_changes', enteredIntoMLS);
			propertyChangeRecord.setFieldValue('custrecord_previous_mls_number', MLSNumber);
			propertyChangeRecord.setFieldValue('custrecord_previous_list_date', listDate);

			nlapiSubmitRecord(propertyChangeRecord);
			return;
		}
	}
}

function propertyDelete(type)
{
	if(type == 'delete')
	{
		var id = nlapiGetFieldValue('id');
		
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custrecord_property', null, 'is', id);
		filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		
		var results = nlapiSearchRecord('customrecord_property_changes', null, filters);
		
		for(var i = 0; results != null && results.length > i; i++)
		{
			nlapiDeleteRecord(results[i].getRecordType(), results[i].getId());
		}
	}
	
	return true;
}

function propertyChangeAudit(type)
{
	if(type == 'edit')
	{
		var today = new Date();
		var month = today.getMonth();
		month = month + 1;
		var day = today.getDate();
		var year = today.getFullYear();
		var dateFormatted = month + '/' + day + '/' + year;

		var propertyId = nlapiGetRecordId();
		var property = nlapiLoadRecord('customrecord_property_record', propertyId);

		var price = property.getFieldValue('custrecord_current_list_price');
		if(price == '')
		{
			price = null;
		}

		var constructionStatus = property.getFieldValue('custrecord_construction_status_listing');
		if(constructionStatus == '')
		{
			constructionStatus = null;
		}

		var estCompletionDate = property.getFieldValue('custrecord_estimated_completion_date');
		if(estCompletionDate == '')
		{
			estCompletionDate = null;
		}

		var MLSExpirationDate = property.getFieldValue('custrecord_expiration_date');
		if(MLSExpirationDate == '')
		{
			MLSExpirationDate = null;
		}

		var estUnderRoofDate = property.getFieldValue('custrecord_estimated_under_roof_date');
		if(estUnderRoofDate == '')
		{
			estUnderRoofDate = null;
		}

		var propertyStatus = property.getFieldValue('custrecord_property_status');
		if(propertyStatus == '')
		{
			propertyStatus = null;
		}

		var enteredIntoMLS = property.getFieldValue('custrecord_entered_mls');
		if(enteredIntoMLS == '')
		{
			enteredIntoMLS = null;
		}
		
		var MLSNumber = property.getFieldValue('custrecord_mls_number_region1');
		if(MLSNumber == '')
		{
			MLSNumber = null;
		}
		
		var listDate = property.getFieldValue('custrecord_list_date');
		if(listDate == '')
		{
			listDate = null;
		}		

		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custrecord_property', null, 'is', propertyId);
		filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

		var columns = new Array();
		columns[0] = new nlobjSearchColumn('internalid');

		var results = nlapiSearchRecord('customrecord_property_changes', null, filters, columns);
		for( var i = 0; results != null && results.length > i; i++)
		{
			var sortArray = new Array();
			sortArray[i] = results[i].getValue(columns[0]);
		}

		if(sortArray != null)
		{
			sortArray.sort(sortList);

			var propertyChangeRecord = nlapiLoadRecord('customrecord_property_changes', sortArray[0]);
			var pcPrice = propertyChangeRecord.getFieldValue('custrecord_property_price_change');
			var pcConstructionStatus = propertyChangeRecord.getFieldValue('custrecord_change_construction_status');
			var pcEstCompletionDate = propertyChangeRecord.getFieldValue('custrecord_new_estimated_completion');
			var pcMLSExpirationDate = propertyChangeRecord.getFieldValue('custrecord_new_expiration_date');
			var pcEstUnderRoofDate = propertyChangeRecord.getFieldValue('custrecord_new_estimated_under_roof');
			var pcPropertyStatus = propertyChangeRecord.getFieldValue('custrecord_new_property_status');
			var pcDateModified = propertyChangeRecord.getFieldValue('custrecord_date_modified');
			var pcEnteredIntoMLS = propertyChangeRecord.getFieldValue('custrecord_entered_in_mls_changes');
			var pcMLSNumber = propertyChangeRecord.getFieldValue('custrecord_previous_mls_number');
			var pcListDate = propertyChangeRecord.getFieldValue('custrecord_previous_list_date');

			if(price == pcPrice && constructionStatus == pcConstructionStatus && estCompletionDate == pcEstCompletionDate && MLSExpirationDate == pcMLSExpirationDate && estUnderRoofDate == pcEstUnderRoofDate && propertyStatus == pcPropertyStatus && dateFormatted == pcDateModified && enteredIntoMLS == pcEnteredIntoMLS && MLSNumber == pcMLSNumber && listDate == pcListDate)
			{
				nlapiDeleteRecord('customrecord_property_changes', propertyChangeRecord.getId());
			}

			else
			{
				if(price == pcPrice)
				{
					propertyChangeRecord.setFieldValue('custrecord_property_price_change', '');
				}
				
				else
				{
					propertyChangeRecord.setFieldValue('custrecord_new_price', price);
				}
				
				if(constructionStatus == pcConstructionStatus)
				{
					propertyChangeRecord.setFieldValue('custrecord_change_construction_status', '');
				}
				
				else
				{
					propertyChangeRecord.setFieldValue('custrecord_new_construction_status', constructionStatus);
				}
				
				if(estCompletionDate == pcEstCompletionDate)
				{
					propertyChangeRecord.setFieldValue('custrecord_new_estimated_completion', '');
				}
				
				else
				{
					propertyChangeRecord.setFieldValue('custrecord_pc_estimated_completion_date', estCompletionDate);
				}
				
				if(MLSExpirationDate == pcMLSExpirationDate)
				{
					propertyChangeRecord.setFieldValue('custrecord_new_expiration_date', '');
				}
				
				else
				{
					propertyChangeRecord.setFieldValue('custrecord_mls_expiration_date', MLSExpirationDate);
				}
				
				if(estUnderRoofDate == pcEstUnderRoofDate)
				{
					propertyChangeRecord.setFieldValue('custrecord_new_estimated_under_roof', '');
				}
				
				else
				{
					propertyChangeRecord.setFieldValue('custrecord_estimated_under_roof', estUnderRoofDate);
				}
				
				if(propertyStatus == pcPropertyStatus)
				{
					propertyChangeRecord.setFieldValue('custrecord_new_property_status', '');
				}
				
				else
				{
					propertyChangeRecord.setFieldValue('custrecord_update_property_status', propertyStatus);
				}			
				
				if(MLSNumber == pcMLSNumber)
				{
					propertyChangeRecord.setFieldValue('custrecord_previous_MLS_Number', '');
				}
				
				else
				{
					propertyChangeRecord.setFieldValue('custrecord_new_mls_number', MLSNumber);
				}				
				
				if(listDate == pcListDate)
				{
					propertyChangeRecord.setFieldValue('custrecord_previous_list_date', '');
				}
				
				else
				{
					propertyChangeRecord.setFieldValue('custrecord_new_list_date', listDate);
				}
				
				propertyChangeRecord.setFieldValue('custrecord_changes_committed', 'T');
				nlapiSubmitRecord(propertyChangeRecord);
				return;
			}
		}
	}	
}

function sortList(a,b)
{
	return b - a;
}

function confirmMLSEntry()
{
	//Confirm MLS Entry
	var enteredIntoMLS = nlapiGetFieldValue('custrecord_entered_mls');
	var propertyStatus = nlapiGetFieldValue('custrecord_property_status');
	var sellingPrice = nlapiGetFieldValue('custrecord_selling_price');
	var mlsNumber = nlapiGetFieldValue('custrecord_mls_number_region1');
	
	if(sellingPrice != null && sellingPrice != '')
	{
		sellingPrice = parseFloat(sellingPrice);

		if(sellingPrice > 0 && (propertyStatus == '1' || propertyStatus == '6'))
		{
			alert("If a selling price is entered, you must update the status to Pending or Closed.");
			return false;
		}
	}
	
	if(enteredIntoMLS == 'T' || propertyStatus != '6' || propertyStatus != '10')
	{
		var preventReturn;
		
		var MLSNumber = nlapiGetFieldValue('custrecord_mls_number_region1');
		if((MLSNumber == null || MLSNumber == '' || MLSNumber == undefined) && propertyStatus != '6' && propertyStatus != '10')
		{
			alert("Please enter an MLS number.");
			preventReturn = 'true';
		}
		/* Commented out by Jeff 5-21-2012 until all records are updated. By commenting this allows us to make changes to records 10+ years old where we no longer have access to certain data about the record.
	
		var constructionStatus = nlapiGetFieldValue('custrecord_construction_status_listing');
		var listDate = nlapiGetFieldValue('custrecord_list_date');
		var estUnderRoof = nlapiGetFieldValue('custrecord_estimated_under_roof_date');
		var estCompletion = nlapiGetFieldValue('custrecord_estimated_completion_date');
		var currentConstructionStatus = nlapiGetFieldValue('custrecord_current_construction');
		
		if(constructionStatus == null || constructionStatus == '')
		{
			alert("Please enter a Construction Status at Listing");
			preventReturn = 'true';
		}
		
		if(listDate == null || listDate == '')
		{
			alert("Please enter a List Date");
			preventReturn = 'true';
		}
		
		if(estCompletion == null || estCompletion == '')
		{
			if(currentConstructionStatus != '3')
			{
				alert("Please enter an Estimated Completion Date");
				preventReturn = 'true';
			}
		}
		*/
		
		/*var listingAgreement = nlapiGetFieldValue('custrecord_listing_agreement');
		if(mlsNumber != '' && mlsNumber != null && propertyStatus == '1' && listingAgreement == 'F')
		{
			var sendAgreementToMLS = confirm('Are you ready to send listing agreement to MLS?');
			if(sendAgreementToMLS == true)
			{
				nlapiSetFieldValue('custrecord_emailed_listing_mls', 'T');
			}
		}
		
		if(preventReturn == 'true')
		{
			return false;
		}
		*/
	}
	
	return true;
}

function afterSubmit(type)
{
	//Sets the Property value on the BSR record
	var bsr = nlapiGetFieldValue('custrecord_property_bsr_team');
	var propertyId = nlapiGetFieldValue('id');
	
	if(bsr != null && bsr != '')
	{
		var bsrRecord = nlapiLoadRecord('partner', bsr);
		var propertyMS = bsrRecord.getFieldValues('custentity_property_ms');
		if(propertyMS == null || propertyMS == '')
		{
			var propertyArray = new Array();
			propertyArray[0] = propertyId;
			bsrRecord.setFieldValues('custentity_property_ms', propertyArray);
			nlapiSubmitRecord(bsrRecord);
		}

		else
		{
			var j = propertyMS.length;
			var k = j + 1;
			var updatedPropertyArray = new Array(k);

			for(var i=0; propertyMS.length > i; i++)
			{
				var propertyValue = propertyMS[i];
				updatedPropertyArray[i] = propertyValue;
				if(propertyValue == propertyId)
				{
					return;
				}
			}

			updatedPropertyArray[j] = propertyId;
			bsrRecord.setFieldValues('custentity_property_ms', propertyMS);
			nlapiSubmitRecord(bsrRecord);
		}
	}
	
	//Removes property value from the former partner set as BSR/Team
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custentity_property_ms', null, 'anyof', propertyId);
	filters[1] = new nlobjSearchFilter('entityid', null, 'isnot', bsr);
	filters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

	var results = nlapiSearchRecord('partner', null, filters);

	for(var n=0; results != null && results.length > n; n++)
	{
		var removePropertyArray = new Array();
		var oldBSR = nlapiLoadRecord('partner', results[n].getId());
		var oldProperties = oldBSR.getFieldValues('custentity_property_ms');
		var k = 0;
		for(var j=0; oldProperties != null && oldProperties.length > j; j++)
		{
			if(propertyMS == null || propertyMS == '')
			{
				removePropertyArray[k] = oldProperties[j];
				k++;			
			}
			
			else if(oldProperties[j] != propertyMS[i])
			{
				removePropertyArray[k] = oldProperties[j];
				k++;
			}
		}

		oldBSR.setFieldValues('custentity_property_ms', removePropertyArray);
		nlapiSubmitRecord(oldBSR);			
	}
	
}

function topLevelParent(builder)
{
	if(builder != null && builder != '')
	{
		var builderRecord = nlapiLoadRecord('customer', builder);
		var parent = builderRecord.getFieldValue('parent');
		if(parent == null || parent == '')
		{
			nlapiSetFieldValue('custrecord_top_level_builder', builder,false,false);
		}
		
		else
		{
		
			var nextLevelParent = parent;				
			while(nextLevelParent != null && nextLevelParent != '' && nextLevelParent != undefined)
			{
				var parentRecord = nlapiLoadRecord('customer', nextLevelParent);
				var parent = nextLevelParent;
				var nextLevelParent = parentRecord.getFieldValue('parent');
			}
		
			nlapiSetFieldValue('custrecord_top_level_builder', parent,false,false);
		}
	}
}