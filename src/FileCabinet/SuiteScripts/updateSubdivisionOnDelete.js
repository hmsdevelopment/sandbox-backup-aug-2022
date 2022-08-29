function updateSubdivisionOnDelete(type)
{
	//Removes subdivision value from the former partner set as BSR/Team
	var bsr = nlapiGetFieldValue('custrecord_bsr_team');
	var subdivisionId = nlapiGetFieldValue('id');
	var filters = new Array();

	if(bsr != null && bsr != '')
	{
		filters[0] = new nlobjSearchFilter('entityid', null, 'is', bsr);
		var results = nlapiSearchRecord('partner', null, filters);

		for(var n=0; results != null && results.length > n; n++)
		{
			var removeSubdivisionArray = new Array();
			var oldBSR = nlapiLoadRecord('partner', results[n].getId());
			var oldSubdivisions = oldBSR.getFieldValues('custentity_subdivision_ms');
			if(oldSubdivisions != null)
			{
				var string = oldSubdivisions.toString();
				var oneSubdivision = string.indexOf(",");
				if(oneSubdivision == '-1')
				{
					oldBSR.setFieldValues('custentity_subdivision_ms', null);
					nlapiSubmitRecord(oldBSR);
				}

				else
				{
					oldSubdivisions = string.split(',');
					var l = oldSubdivisions.length;
					var k = 0;
					for(var j=0; oldSubdivisions != null && l > j; j++)
					{
						if(oldSubdivisions[j] != subdivisionId)
						{
							removeSubdivisionArray[k] = oldSubdivisions[j];
							k++;				
						}
					}

					oldBSR.setFieldValues('custentity_subdivision_ms', removeSubdivisionArray);
					nlapiSubmitRecord(oldBSR);
				}
			}
		}
	}
	
}