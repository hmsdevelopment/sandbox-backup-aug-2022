function propertyChangesCleanup()
{
	var results = nlapiSearchRecord('customrecord_property_changes', 'customsearch_prop_change_not_committed');
	
	for(var i=0; results != null && results.length > i; i++)
	{
		nlapiDeleteRecord('customrecord_property_changes', results[i].getId());
	}
}