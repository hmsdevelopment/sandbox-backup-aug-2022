function getBSR()
{
	var property = nlapiGetFieldValue('custpage_mcc_property');
	var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
	var bsr = propertyRecord.getFieldValue('custrecord_property_bsr_team');
	nlapiSetFieldValue('custpage_mcc_bsr',bsr);
}

function createCases()
{
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    month++;
    var year = date.getFullYear();
    var dateFormatted = month + "/" + day + "/" + year;

	var link = nlapiGetFieldValue('custpage_mcc_link');
	var property = nlapiGetFieldValue('custpage_mcc_property');
	if(property != null && property != '')
	{
		alert("All fields should be blank prior to creating linked cases.  Please submit information on all appointments before creating cases.");
		return;
	}

	var filter = new Array();
	filter[0] = new nlobjSearchFilter('custrecord_mcc_link', null, 'is', link);
	var results = nlapiSearchRecord('customrecord_multiple_case_creation', null, filter);
	for(var i=0; results != null && results.length > 0; i++)
	{
		var mccRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var propertyValue = mccRecord.getFieldValue('custrecord_mcc_property');
		var agentValue = mccRecord.getFieldValue('custrecord_mcc_agent_name');
		var showingDateValue = mccRecord.getFieldValue('custrecord_mcc_showing_date');
		var showingTimeValue = mccRecord.getFieldValue('custrecord_mcc_showing_time');
		var bsrValue = mccRecord.getFieldValue('custrecord_mcc_bsr');
		var linkValue = mccRecord.getFieldValue('custrecord_mcc_link');

		var propertyRecord = nlapiLoadRecord('customrecord_property_record', propertyValue);
		var builderDivision = propertyRecord.getFieldValue('custrecord12');

		var caseRecord = nlapiCreateRecord('supportcase');

		caseRecord.setFieldValue('custevent_property', propertyValue);
		caseRecord.setFieldValue('custevent_caller_name', agentValue);
		caseRecord.setFieldValue('custevent_showing_time_scheduled', showingTimeValue);
		caseRecord.setFieldValue('custevent_showing_date_scheduled', showingDateValue);
		caseRecord.setFieldValue('custevent_builder_sales_rep_subd', bsrValue);
		caseRecord.setFieldValue('custevent_linked_cases', linkValue);
		caseRecord.setFieldValue('title', 'Property Inquiry');
		caseRecord.setFieldValue('company', builderDivision);
		caseRecord.setFieldValue('startdate', dateFormatted);
		caseRecord.setFieldValue('status', '1');
		nlapiSubmitRecord(caseRecord);
	}
}