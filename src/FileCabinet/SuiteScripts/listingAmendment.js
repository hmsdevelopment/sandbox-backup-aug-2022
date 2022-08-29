function listingAmendment()
{
	var generateAmendment = nlapiGetFieldValue('custrecord_generate_amendment');
	if(generateAmendment == 'F')
	{
                nlapiLogExecution('DEBUG', 'File .. created ...');
		var today = new Date();
		var month = today.getMonth();
		month = month + 1;
		var day = today.getDate();
		var year = today.getFullYear();
		var dateFormatted = month + '/' + day + '/' + year;
		var dateFormattedForFile = year + month + day;
		
		var previousPrice = nlapiGetFieldValue('custrecord_property_price_change');
		var newPrice = nlapiGetFieldValue('custrecord_new_price');
		var previousExpDate = nlapiGetFieldValue('custrecord_new_expiration_date');
		//previousExpDate = new Date(previousExpDate);
		var newExpDate = nlapiGetFieldValue('custrecord_mls_expiration_date');
		//newExpDate = new Date(newExpDate);
		
		if((previousPrice && newPrice) || (previousExpDate && newExpDate))
		{
			var propertyID = nlapiGetFieldValue('custrecord_property');
			if(propertyID)
			{
				var propertyRecord = nlapiLoadRecord('customrecord_property_record', propertyID);
				var mlsNumber = propertyRecord.getFieldValue('custrecord_mls_number_region1');
				var address = propertyRecord.getFieldValue('custrecord_simple_name');
				var city = propertyRecord.getFieldValue('custrecord_city');
				var state = propertyRecord.getFieldText('custrecord_state');
				var zipCode = propertyRecord.getFieldValue('custrecord_zip_code');
				var sellerSig = propertyRecord.getFieldValue('custrecord_sellers_signature');
				var mlsRegion = propertyRecord.getFieldValue('custrecord15');
				var builderID = propertyRecord.getFieldValue('custrecord12');
				
				var tempRecord = nlapiCreateRecord('customrecord_merge');
				tempRecord.setFieldValue('custrecord_temp_mls_number', mlsNumber);
				tempRecord.setFieldValue('custrecord_temp_address', address);
				tempRecord.setFieldValue('custrecord_temp_city', city);
				tempRecord.setFieldValue('custrecord_temp_state', state);
				tempRecord.setFieldValue('custrecord_temp_zip', zipCode);
				tempRecord.setFieldValue('custrecord_temp_date', dateFormatted);
				tempRecord.setFieldValue('custrecord_temp_seller_sig', sellerSig);
				tempRecord.setFieldValue('custrecord_temp_expiration_date_new', newExpDate);
				tempRecord.setFieldValue('custrecord_temp_exp_date', previousExpDate);
				tempRecord.setFieldValue('custrecord_temp_listing_price', previousPrice);
				tempRecord.setFieldValue('custrecord_temp_listing_price_new', newPrice);
				var tempRecordID = nlapiSubmitRecord(tempRecord);
				
				var mergeFields = new Array();
				mergeFields[0] = 'nlcustrecord_temp_mls_number';
				mergeFields[1] = 'nlcustrecord_temp_address';
				mergeFields[2] = 'nlcustrecord_temp_city';
				mergeFields[3] = 'nlcustrecord_temp_state';
				mergeFields[4] = 'nlcustrecord_temp_zip';
				mergeFields[5] = 'nlcustrecord_temp_date';
				mergeFields[6] = 'nlcustrecord_temp_seller_sig';
				mergeFields[7] = 'nlcustrecord_temp_expiration_date_new';
				mergeFields[8] = 'nlcustrecord_temp_exp_date';
				mergeFields[9] = 'nlcustrecord_temp_listing_price';
				mergeFields[10] = 'nlcustrecord_temp_listing_price_new';
			
				var filters = new Array();
				filters[0] = new nlobjSearchFilter('custrecord_mls_template_mls', null, 'is', mlsRegion);
				filters[1] = new nlobjSearchFilter('custrecord_mls_template_builder_div', null, 'is', builderID);
				filters[2] = new nlobjSearchFilter('custrecord_template_type', null, 'is', '2');
				
				var results = nlapiSearchRecord('customrecord_mls_template_selection', null, filters);
				for(var i=0; results != null && results.length > i; i++)
				{
					var templateRecord = nlapiLoadRecord('customrecord_mls_template_selection', results[i].getId());
					var templateID = templateRecord.getFieldValue('custrecord_template_id');
					nlapiLogExecution('DEBUG', 'Info', 'Template ID = ' + templateID);
					var emailTemplateID = templateRecord.getFieldValue('custrecord_email_template_id');
					var emailSubject = templateRecord.getFieldValue('custrecord_email_subject');
				}
				
				if(results == null)
				{
					nlapiDeleteRecord('customrecord_merge', tempRecordID);
					return true;
				}

				//var records = new Object();
				//records['record'] = propertyID;
				//records['recordtype'] = '18';
				var listingDoc = nlapiMergeRecord(templateID, 'customrecord_merge', tempRecordID, null, null, mergeFields);
				var pdfDoc = nlapiCreateFile(address + ' Listing_Amendment - MLS' + mlsNumber + ' - ' + dateFormattedForFile + '.pdf', 'PDF', listingDoc.getValue());
				pdfDoc.setFolder('2269');
				var fileID = nlapiSubmitFile(pdfDoc);
				nlapiAttachRecord('file', fileID, 'customrecord_property_record', propertyID, null);
				
nlapiSendEmail(nlapiGetUser(), 'pranjal@webbee.biz', 'List Agreement', 'Info',null, null, null, pdfDoc);
				var currentRecordId = nlapiGetRecordId();
				nlapiSubmitField('customrecord_property_changes', currentRecordId, 'custrecord_listing_amendment_created', 'T');
				nlapiDeleteRecord('customrecord_merge', tempRecordID);
			}
		}
	}
}
