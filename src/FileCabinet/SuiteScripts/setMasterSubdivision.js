function setMasterSubdivision(type)
{
	if(type != 'delete')
	{
		
		//Creates the Master Subdivision record if it doesn't currently exist
		var currentMasterSubdivision = nlapiGetFieldValue('custrecord_master_subdivision');
		var subdivisionID = nlapiGetRecordId();

		if(currentMasterSubdivision == null || currentMasterSubdivision == '')
		{
			var name = nlapiGetFieldValue('custrecord_subdivision_id');
			var city = nlapiGetFieldValue('custrecord_mailing_address_city');
			var state = nlapiGetFieldValue('custrecord_mailing_address_state');

			var n = 0;
			var filters = new Array();
			if(name != null && name != '')
			{
				filters[n] = new nlobjSearchFilter('name', null, 'is', name);
				n++;
			}
			
			if(city != null && city != '')
			{
				filters[n] = new nlobjSearchFilter('custrecord_master_subdivision_city', null, 'is', city);
				n++;
			}
			
			if(state != null && state != '')
			{
				filters[n] = new nlobjSearchFilter('custrecord_master_subdivision_state', null, 'is', state);
				n++;
			}

			var results = nlapiSearchRecord('customrecord_master_subdivision', null, filters);

			if(results == null)
			{
				var masterSubdivision = nlapiCreateRecord('customrecord_master_subdivision');
				masterSubdivision.setFieldValue('name', name);
				masterSubdivision.setFieldValue('custrecord_master_subdivision_city', city);
				masterSubdivision.setFieldValue('custrecord_master_subdivision_state', state);
				nlapiSubmitRecord(masterSubdivision);

				var updatedResults = nlapiSearchRecord('customrecord_master_subdivision', null, filters);

				for(var j=0; updatedResults != null && 1 > j; j++)
				{
					var masterSubdivisionID = updatedResults[0].getId();
					nlapiSubmitField('customrecord_subdivision', subdivisionID, 'custrecord_master_subdivision', masterSubdivisionID);
				}
			}

			else if(results != null && results.length > 1)
			{
				alert('Data entered matches more than 1 Master Subdivion record.  Please set this value manually.');
			}

			else
			{
				for(var i = 0; results != null && i < 1; i++)
				{
					var masterSubdivisionID = results[i].getId();
					nlapiSubmitField('customrecord_subdivision', subdivisionID, 'custrecord_master_subdivision', masterSubdivisionID);
				}
			}
		}
	}
	
	return true;
}