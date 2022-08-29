function updateSubdivisionMS()
{
	//Sets Subdivision MS field on the Builder Personnel record
	var bsr = nlapiGetFieldValue('custrecord_bsr_team');
	var subdivisionId = nlapiGetFieldValue('id');

	if(bsr != null && bsr != '')
	{
		var bsrRecord = nlapiLoadRecord('partner', bsr);
		var subdivisionMS = bsrRecord.getFieldValues('custentity_subdivision_ms');
		if(subdivisionMS == null || subdivisionMS == '')
		{
			var subdivisionArray = new Array(1);
			subdivisionArray[0] = subdivisionId;
			bsrRecord.setFieldValues('custentity_subdivision_ms', subdivisionArray);
			nlapiSubmitRecord(bsrRecord);
		}

		else
		{
			var string = subdivisionMS.toString();
			var oneSubdivision = string.indexOf(",");
			if(oneSubdivision == '-1')
			{
				if(subdivisionMS != subdivisionId)
				{
					var updatedSubdivisionArray = new Array(2);
					updatedSubdivisionArray[0] = subdivisionMS;
					updatedSubdivisionArray[1] = subdivisionId;
					bsrRecord.setFieldValues('custentity_subdivision_ms', updatedSubdivisionArray);
					nlapiSubmitRecord(bsrRecord);
				}

			}
			else
			{
				subdivisionMS = string.split(',');
				var j = subdivisionMS.length;
				var k = j + 1;
				var updatedSubdivisionArray = new Array(k);
				var noUpdate;

				for(var i=0; j >= i; i++)
				{
					var subdivisionValue = subdivisionMS[i];
					updatedSubdivisionArray[i] = subdivisionValue;
					if(subdivisionValue == subdivisionId)
					{
						noUpdate = true;
					}
				}

				if(noUpdate != true)
				{
					updatedSubdivisionArray[j] = subdivisionId;
					bsrRecord.setFieldValues('custentity_subdivision_ms', updatedSubdivisionArray);
					nlapiSubmitRecord(bsrRecord, false, true);
				}
			}
		}
	}
}