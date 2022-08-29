function init()
{
	nlapiDisableField('name', true);
}

function fieldChange(type, name)
{
	if(name == 'custrecord_street_name' || name == 'custrecord_prefix' || name == 'custrecord_suffix')
	{
	
		var streetName = nlapiGetFieldValue('custrecord_street_name');
		var prefix = nlapiGetFieldText('custrecord_prefix');
		var suffix = nlapiGetFieldText('custrecord_suffix');
		
		if((prefix != null && prefix != '') && (suffix != null && suffix != ''))
		{
			var setField = nlapiSetFieldValue('name', trim(nlapiGetFieldValue('custrecord_street_name')) + ' ' + trim(nlapiGetFieldText('custrecord_suffix')) + ' ' + trim(nlapiGetFieldText('custrecord_prefix')));
		}
		
		else if((prefix == null || prefix == '') && (suffix != null && suffix != ''))
		{
			var setField = nlapiSetFieldValue('name', trim(nlapiGetFieldValue('custrecord_street_name')) + ' ' + trim(nlapiGetFieldText('custrecord_suffix')));		
		}
		
		else if((prefix != null && prefix != '') && (suffix == null || suffix == ''))
		{
			var setField = nlapiSetFieldValue('name', trim(nlapiGetFieldValue('custrecord_street_name')) + ' ' + trim(nlapiGetFieldText('custrecord_prefix')));		
		}
		
		else
		{
			var setField = nlapiSetFieldValue('name', trim(nlapiGetFieldValue('custrecord_street_name')));
		}
	}
}