/*
 * File-Name : listingAmendment_webbee.js
 * Script Type : User Event
 * Purpose : Merge PDF Template Listing Amendment..
 * Client : HMS Marketing Services..
 * Author : Pranjal Goyal (Webbee-eSolutions-Pvt-Ltd.)
 * Date : 20/05/2016
 * Modified : 18/05/2017
 */

var cc = [];
cc.push('pranjal@webbee.biz');
cc.push('aj@webbeeglobal.com');

var author = 3847;
var body = '';
var subject = 'HMS Listing Amendment';
var recipient = 'mlsinfo@hmsmarketingservices.com';
//var recipient = 'listings@hmsmarketingservices.com';

function listingAmendment()
{
	try
	{
		var generateAmendment = nlapiGetFieldValue('custrecord_generate_amendment');
        var listCreated = nlapiGetFieldValue('custrecord_listing_amendment_created');
		if(generateAmendment == 'T' && listCreated  == 'F')
		{
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
			var newExpDate = nlapiGetFieldValue('custrecord_mls_expiration_date');
			if(previousPrice != newPrice || previousExpDate !=  newExpDate)
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
                    var mlsRegionCode = propertyRecord.getFieldText('custrecord15'); 
					var builderID = propertyRecord.getFieldValue('custrecord12');
					var tempRecord = nlapiCreateRecord('customrecord_merge');
	                tempRecord.setFieldValue('custrecord_temp_mls_number', mlsNumber);
					tempRecord.setFieldValue('custrecord_temp_mls_area_code', mlsRegionCode);
					tempRecord.setFieldValue('custrecord_temp_address', address);
					tempRecord.setFieldValue('custrecord_temp_city', city);
					tempRecord.setFieldText('custrecord_temp_state', state);
					tempRecord.setFieldValue('custrecord_temp_zip', zipCode);
					tempRecord.setFieldValue('custrecord_temp_date', dateFormatted);
				
					if(previousPrice != newPrice)
					{
						tempRecord.setFieldValue('custrecord_temp_listing_price', previousPrice);
						tempRecord.setFieldValue('custrecord_temp_listing_price_new', newPrice);
						tempRecord.setFieldValue('custrecord_temp_price_change', true);
					}
					if(previousExpDate != newExpDate)
					{
						tempRecord.setFieldValue('custrecord_temp_exp_date_new', newExpDate);
						tempRecord.setFieldValue('custrecord_temp_exp_date', previousExpDate);
						tempRecord.setFieldValue('custrecord_temp_date_change', true);
					}
					if(previousExpDate != newExpDate && previousPrice != newPrice)
					{
						tempRecord.setFieldValue('custrecord_temp_both_change', true);
						tempRecord.setFieldValue('custrecord_temp_date_change', false);
						tempRecord.setFieldValue('custrecord_temp_price_change', false);
					}
					
					
					var tempRecordID = nlapiSubmitRecord(tempRecord);								
					var mergeFields = new Array();
					mergeFields[0] = 'nlcustrecord_temp_mls_number';
					mergeFields[1] = 'nlcustrecord_temp_mls_area_code'; 
					mergeFields[2] = 'nlcustrecord_temp_city';
					mergeFields[3] = 'nlcustrecord_temp_state';
					mergeFields[4] = 'nlcustrecord_temp_zip';
					mergeFields[5] = 'nlcustrecord_temp_date';
					mergeFields[6] = 'nlcustrecord_temp_exp_date_new';
					mergeFields[7] = 'nlcustrecord_temp_exp_date';
					mergeFields[8] = 'nlcustrecord_temp_listing_price';
					mergeFields[9] = 'nlcustrecord_temp_listing_price_new';
                    mergeFields[10] = 'nlcustrecord_temp_address'; 
					mergeFields[11] = 'nlcustrecord_temp_price_change';
					mergeFields[12] = 'nlcustrecord_temp_date_change';
					mergeFields[13] = 'custrecord_temp_both_change';			
					templateID = 87;
					var listingDoc = nlapiMergeRecord(templateID, 'customrecord_merge', tempRecordID, null, null, mergeFields);
					var pdfDoc = nlapiCreateFile(address + 'Listing_Amendment - MLS' + mlsNumber + ' - ' + dateFormattedForFile + '.pdf', 'PDF', listingDoc.getValue());
					//pdfDoc.setFolder('2269');
					//var fileID = nlapiSubmitFile(pdfDoc);
				//	nlapiAttachRecord('file', fileID, 'customrecord_property_record', propertyID, null);
					
                    nlapiSendEmail(author,recipient,subject, 'PFA',null,null,null,pdfDoc, true);
					nlapiSubmitField('customrecord_property_changes',  nlapiGetRecordId(), 'custrecord_listing_amendment_created', 'T');
					nlapiDeleteRecord('customrecord_merge', tempRecordID);
					nlapiLogExecution('DEBUG', 'Template Deleted  with id : '+tempRecordID);
				}
			}
		}
	}
	catch(ex)
	{
		body = 'Exception in listingAmendment : '+ex+' : '+ex.message+' : '+ex.name;
        nlapiLogExecution('DEBUG',body);
		nlapiSendEmail(author,cc,subject,body);
	}
}
