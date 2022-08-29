function adminUpdate()
{
	var results = nlapiSearchRecord('customrecord_subdivision', 'customsearch98');
	
	
	for(var i=0; results != null && results.length > i; i++)
	{
		var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
		var builder = subdivisionRecord.getFieldValue('custrecord_builder_division');
		
		if(builder != null && builder != '')
		{
			var builderRecord = nlapiLoadRecord('customer', builder);

			var subdivisionContact = subdivisionRecord.getFieldValue('custrecord_administrative_contact');
			var subdivisionContactPhone = subdivisionRecord.getFieldValue('custrecord_administrative_contact_phone');
			var subdivisionContactEmail = subdivisionRecord.getFieldValue('custrecord_administrative_contact_email');
			var subdivisionDivisionManager = subdivisionRecord.getFieldValue('custrecord_division_manager');
			var builderContact = builderRecord.getFieldValue('custentity_administrative_contact');
			var builderContactPhone = builderRecord.getFieldValue('custentity_administrative_contact_phone');
			var builderContactEmail = builderRecord.getFieldValue('custentity_administrative_contact_email');
			var builderDivisionManager = builderRecord.getFieldValue('custentity_builder_division_manager');

			if(subdivisionContact != builderContact)
			{
				subdivisionRecord.setFieldValue('custrecord_administrative_contact', builderContact);
			}

			if(subdivisionContactPhone != builderContactPhone)
			{
				subdivisionRecord.setFieldValue('custrecord_administrative_contact_phone', builderContactPhone);
			}

			if(subdivisionContactEmail != builderContactEmail)
			{
				subdivisionRecord.setFieldValue('custrecord_administrative_contact_email', builderContactEmail);
			}

			if(subdivisionDivisionManager != builderDivisionManager)
			{
				subdivisionRecord.setFieldValue('custrecord_division_manager', builderDivisionManager);
			}

			nlapiSubmitRecord(subdivisionRecord);
		}
	}
}