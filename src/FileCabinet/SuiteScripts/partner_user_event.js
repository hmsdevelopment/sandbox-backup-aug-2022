function afterSubmit(type)
{
	//Checks the value of the subdivisionMS field and sets the current BSR as the BSR on the and subdivisions
	var bsr = nlapiGetFieldValue('id');
	var teamType = nlapiGetFieldValue('custentity_team_type');
	var bsrMembers = nlapiGetFieldValues('custentity_team_members');
	
	var subdivisionMS = nlapiGetFieldValues('custentity_subdivision_ms');
		
	if(subdivisionMS != null && subdivisionMS != '')
	{				
		for(var i=0; subdivisionMS.length > i; i++)
		{
			var subdivisionId = subdivisionMS[i];
			nlapiLogExecution('debug', 'debug', 'subdivisionId = ' + subdivisionId);
			var subdivisionRecord = nlapiLoadRecord('customrecord_subdivision', subdivisionId);
			var bsrValue = subdivisionRecord.getFieldValue('custrecord_bsr_team');
			if(bsrValue != bsr)
			{
				nlapiLogExecution('debug', 'debug', 'bsr values do not match');
				subdivisionRecord.setFieldValue('custrecord_bsr_team', bsr);
				subdivisionRecord.setFieldValue('custrecord_sub_bsr_team_type', teamType);
				subdivisionRecord.setFieldValues('custrecord48', bsrMembers);
				nlapiSubmitRecord(subdivisionRecord);
				
				//Remove the subdivision value from the previous BSR record's subdivision field
				if(bsrValue != null && bsrValue != '')
				{
					var subdivisionArray = new Array();
					var oldBSR = nlapiLoadRecord('partner', bsrValue);
					var oldSubdivisions = oldBSR.getFieldValues('custentity_subdivision_ms');
					var k = 0;
					for(var j=0; oldSubdivisions != null && oldSubdivisions.length > j; j++)
					{
						if(oldSubdivisions[j] != subdivisionId)
						{
							subdivisionArray[k] = oldSubdivisions[j];
							k++;
						}
					}
					
					if(subdivisionArray.length == 1)
					{
						oldBSR.setFieldValue('custentity_subdivision_ms', subdivisionArray);
					}
					
					else
					{
						oldBSR.setFieldValues('custentity_subdivision_ms', subdivisionArray);
					}
					
					nlapiSubmitRecord(oldBSR);
				}
				
/*				//Set the bsr on all properties of the subdivision
				var filters = new Array();
				filters[0] = new nlobjSearchFilter('custrecordcustrecordsubdname', null, 'anyof', subdivisionId);
				
				var propertySearchResults = nlapiSearchRecord('customrecord_property_record', null, filters);
				
				for(var m=0; propertySearchResults != null && propertySearchResults.length > m; m++)
				{
					var propertyRecord = nlapiLoadRecord('customrecord_property_record', propertySearchResults[m].getId());
					propertyRecord.setFieldValue('custrecord_property_bsr_team', bsr);
					propertyRecord.setFieldValue('custrecord_property_bsr_team_members', bsrMembers);
					propertyRecord.setFieldValue('custrecord_property_bsr_team_type', teamType);
					nlapiSubmitRecord(propertyRecord);
				}
*/				
				
			}
		}
	}
}