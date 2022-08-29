function updateBSROnProperty()
{
nlapiLogExecution('ERROR','Line', 'started');
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('custrecord_bsr_team', 'custrecordcustrecordsubdname');
	
	var results = nlapiSearchRecord('customrecord_property_record', 'customsearch90', null, columns);
	
	for(var i = 0; results != null && results.length > i; i++)
	{
nlapiLogExecution('ERROR','Line', results[i].getId()+ " 2 " + results[i].getValue(columns[0]));
		nlapiSubmitField(results[i].getRecordType(), results[i].getId(), 'custrecord_property_bsr_team', results[i].getValue(columns[0]));
	}
}

//test