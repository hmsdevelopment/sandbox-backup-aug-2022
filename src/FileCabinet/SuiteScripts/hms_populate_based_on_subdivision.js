function onFieldChange(type,name,i)
{
	if(name == 'custevent_subdivision_search')
	{
		var usesubdivision = nlapiGetFieldValue('custevent_subdivision_search');
		var usesubdivisionid = nlapiGetFieldValue('custevent_subdivision');
		//alert(' usesubdivision '+usesubdivision+' usesubdivisionid '+usesubdivisionid);
		if((usesubdivision == '1') && (usesubdivisionid))
		{
			var filters = [];
			filters.push(new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
			filters.push(new nlobjSearchFilter( 'internalid', null, 'anyof', usesubdivisionid, null));
			var columns = [];
			columns.push(new nlobjSearchColumn('name'));
			columns.push(new nlobjSearchColumn('custrecord_builder_division'));
			columns.push(new nlobjSearchColumn('custrecord_mls_region_1'));
			columns.push(new nlobjSearchColumn('custrecord_mls_region_2'));
			columns.push(new nlobjSearchColumn('custrecord_subdivision_instructions'));
			var results = nlapiSearchRecord('customrecord_subdivision',null,filters,columns);
			//for(var ab=0;results && (ab < results.length);ab++)
			if(results)
			{
				var name = results[0].getValue('name');
				var buildersubdivision = results[0].getValue('custrecord_builder_division');
				var mls1 = results[0].getText('custrecord_mls_region_1');
				var mls2 = results[0].getText('custrecord_mls_region_2');
				var subdivioninstruction = results[0].getValue('custrecord_subdivision_instructions');
				//alert('name '+name+' buildersubdivision '+buildersubdivision+' mls1 '+mls1+' mls2 '+mls2);
				nlapiSetFieldValue('company',buildersubdivision);
				nlapiSetFieldValue('custevent_mls_region1',mls1);
				nlapiSetFieldValue('custevent_mls_region2',mls2);
				nlapiSetFieldValue('custevent11',subdivioninstruction);
			}
		}
	}
	if(name == 'custevent_subdivision')
	{
		var usesubdivision = nlapiGetFieldValue('custevent_subdivision_search');
		var usesubdivisionid = nlapiGetFieldValue('custevent_subdivision');
		//alert(' usesubdivision '+usesubdivision+' usesubdivisionid '+usesubdivisionid);
		if((usesubdivision == '1') && (usesubdivisionid))
		{
			var filters = [];
			filters.push(new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
			filters.push(new nlobjSearchFilter( 'internalid', null, 'anyof', usesubdivisionid, null));
			var columns = [];
			columns.push(new nlobjSearchColumn('name'));
			columns.push(new nlobjSearchColumn('custrecord_builder_division'));
			columns.push(new nlobjSearchColumn('custrecord_mls_region_1'));
			columns.push(new nlobjSearchColumn('custrecord_mls_region_2'));
			columns.push(new nlobjSearchColumn('custrecord_subdivision_instructions'));
			var results = nlapiSearchRecord('customrecord_subdivision',null,filters,columns);
			//for(var ab=0;results && (ab < results.length);ab++)
			if(results)
			{
				var name = results[0].getValue('name');
				var buildersubdivision = results[0].getValue('custrecord_builder_division');
				var mls1 = results[0].getText('custrecord_mls_region_1');
				var mls2 = results[0].getText('custrecord_mls_region_2');
				var subdivioninstruction = results[0].getValue('custrecord_subdivision_instructions');
				//alert('name '+name+' buildersubdivision '+buildersubdivision+' mls1 '+mls1+' mls2 '+mls2);
				nlapiSetFieldValue('company',buildersubdivision);
				nlapiSetFieldValue('custevent_mls_region1',mls1);
				nlapiSetFieldValue('custevent_mls_region2',mls2);
				nlapiSetFieldValue('custevent11',subdivioninstruction);
			}
		}
	}
}