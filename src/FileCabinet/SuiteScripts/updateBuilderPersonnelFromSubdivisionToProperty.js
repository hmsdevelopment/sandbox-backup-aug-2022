function updateBuilderPersonnelFromSubToProperty()
{
	var results = nlapiSearchRecord('customrecord_property_record', '120');
	
	for(var i=0; results != null && results.length > i; i++)
	{
		var propertyRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var subdivisionId = propertyRecord.getFieldValue('custrecordcustrecordsubdname');
		var subdivisionRecord = nlapiLoadRecord('customrecord_subdivision', subdivisionId);
		
		var subAdmin = subdivisionRecord.getFieldValue('custrecord_administrative_contact');
		var subAdminPhone = subdivisionRecord.getFieldValue('custrecord_administrative_contact_phone');
		var subAdminEmail = subdivisionRecord.getFieldValue('custrecord_administrative_contact_email');
		var propAdmin = propertyRecord.getFieldValue('custrecord17');
		var subDM = subdivisionRecord.getFieldValue('custrecord_division_manager');
		var subDMEmail = subdivisionRecord.getFieldValue('custrecord_division_mgr_email');
		var propDM = propertyRecord.getFieldValue('custrecord29');
		var subSM = subdivisionRecord.getFieldValue('custrecord27');
		var subSMEmail = subdivisionRecord.getFieldValue('custrecord_sales_mgr_email');
		var propSM = propertyRecord.getFieldValue('custrecord28');
		
		if(subAdmin != propAdmin)
		{
			propertyRecord.setFieldValue('custrecord17', subAdmin);
			propertyRecord.setFieldValue('custrecord18', subAdminEmail);
			propertyRecord.setFieldValue('custrecord19', subAdminPhone);	
		}
		
		if(subDM != propDM)
		{
			propertyRecord.setFieldValue('custrecord29', subDM);
			propertyRecord.setFieldValue('custrecordprop_division_mgr_email', subDMEmail);
		}
		
		if(subSM != propSM)
		{
			propertyRecord.setFieldValue('custrecord28', subSM);
			propertyRecord.setFieldValue('custrecord_prop_sales_mgr_email', subSMEmail);
		}
		
		nlapiSubmitRecord(propertyRecord);
		
	}
}