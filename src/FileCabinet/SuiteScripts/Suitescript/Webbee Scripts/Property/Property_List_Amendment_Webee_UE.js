/*
 * File              : Property_List_Amendment_Webee_UE.js
 * Script           : User Event
 * Purpose       : Merge Listing Amendment PDF Template
 * Client           : HMS Marketing Services..
 * Author         : Pranjal Goyal (Webbee-eSolutions-Pvt-Ltd.)
 * Date            : 22nd June 2016
 * Modified :   18/05/2017
 */

var to = [];

var cc = [];
//cc.push('listings@hmsmarketingservices.com');
cc.push('mlsinfo@hmsmarketingservices.com');

var author = 3847;
var details = '';
var subject = 'HMS Listing Amendment Property List';
var recipient = 'pranjal@webbee.biz';

function beforeLoadProperty(type, form, request)
{
	try
	{
		form.addField('custpage_is_changed','checkbox','Property Changed').setDisplayType('hidden');	
		form.addField('custpage_email_to_mlsinfo','checkbox','Mail to MLS Info').setDisplayType('hidden');	
		form.setScript('customscript_list_amendment_propty_cs_wb');
	}
	catch(ex)
	{
		details = 'Exception in beforeLoadProperty : '+ex+', Message : '+ex.message+' Name : '+ex.name;
		nlapiLogExecution('DEBUG', details);
		nlapiSendEmail(author,recipient,subject,details);
	}
}
function beforeSubmitProperty(type)
{
	try
	{
		var isChanged= nlapiGetFieldValue('custpage_is_changed');		
		if(isChanged == 'T')
		{
			var mlsRegionId =checkIfNull(nlapiGetFieldValue('custrecord15'));	
			var topLevelBuilder = checkIfNull(nlapiGetFieldValue('custrecord_top_level_builder'));
			var builderDivision = checkIfNull(nlapiGetFieldValue('custrecord12'));							  
			if(mlsRegionId != '' && topLevelBuilder == '509')
            {
				var templateId  = null;
				to.push(checkIfNull(nlapiLookupField('location', mlsRegionId , 'custrecord_mls_email')));
				
				var filters = [];
				filters.push(new nlobjSearchFilter('custrecord_mls_template_mls', null, 'is',mlsRegionId));
				filters.push(new nlobjSearchFilter('custrecord_mls_template_builder_div', null, 'is',builderDivision));
				filters.push(new nlobjSearchFilter('custrecord_template_type', null, 'is',2));
				
				var columns = [];
				columns.push(new nlobjSearchColumn('custrecord_template_id'));
				
				var tempSelSearch = nlapiSearchRecord('customrecord_mls_template_selection', null, filters, columns);
				if(tempSelSearch != null && tempSelSearch.length >0 )
				{
					var tempSrchId = tempSelSearch[0].getId();
					templateId = tempSelSearch[0].getValue(columns[0]);
					nlapiLogExecution('DEBUG', 'tempSrchId : '+tempSrchId, 'templateId : '+templateId);
				}	
				
				if(checkIfNull(templateId)!= '')
				generateListAmendment(templateId);
          }
		}	 
	}
	catch(ex)
	{
		details = 'Exception in beforeSubmitProperty '+ex+', Message : '+ex.message+' Name : '+ex.name;
		nlapiLogExecution('DEBUG', details);
		nlapiSendEmail(author,recipient,subject,details);
	}
}

function generateListAmendment(templateID)
{	
	try
	{
	    var oldRec = nlapiGetOldRecord();
		var oldListPrice = oldRec.getFieldValue('custrecord_current_list_price');
		var oldExpDate = oldRec.getFieldValue('custrecord_expiration_date');
		var newListPrice = nlapiGetFieldValue('custrecord_current_list_price');	
		var newExpDate = nlapiGetFieldValue('custrecord_expiration_date');	
		var houseNo = checkIfNull(nlapiGetFieldValue('custrecord_house_number'));
		var street = checkIfNull(nlapiGetFieldText('custrecord31'));
		var today = new Date();
		var dateFormatted =  (today.getMonth()+1) + '/' + today.getDate()+ '/' + today.getFullYear();
		var dateFileFormatted = (today.getMonth()+1) + '-' + today.getDate()+ '-' + today.getFullYear();
		var mlsNumber = checkIfNull(nlapiGetFieldValue('custrecord_mls_number_region1'));
		var address = checkIfNull(nlapiGetFieldValue('custrecord_simple_name'));
		var city = checkIfNull(nlapiGetFieldValue('custrecord_city'));
		var state = checkIfNull(nlapiGetFieldText('custrecord_state'));
		var zipCode = checkIfNull(nlapiGetFieldValue('custrecord_zip_code'));
		var sellerSig = checkIfNull(nlapiGetFieldValue('custrecord_sellers_signature'));
		var mlsRegion = checkIfNull(nlapiGetFieldValue('custrecord15'));
		var mlsRegionCode =checkIfNull(nlapiGetFieldText('custrecord15')); 
		var builderID = checkIfNull(nlapiGetFieldText('custrecord12'));
		var tempRecord = nlapiCreateRecord('customrecord_merge');

		tempRecord.setFieldValue('custrecord_temp_mls_number', mlsNumber);
		tempRecord.setFieldValue('custrecord_temp_mls_area_code', mlsRegionCode);
		tempRecord.setFieldValue('custrecord_temp_address', address);
		tempRecord.setFieldValue('custrecord_temp_city', city);
		tempRecord.setFieldValue('custrecord_temp_state', state);
		tempRecord.setFieldValue('custrecord_temp_zip', zipCode);
		tempRecord.setFieldValue('custrecord_temp_date', dateFormatted);
		tempRecord.setFieldValue('custrecord_temp_seller_sig', sellerSig);
		if (oldListPrice != newListPrice)
		{
			tempRecord.setFieldValue('custrecord_temp_listing_price', oldListPrice);
			tempRecord.setFieldValue('custrecord_temp_listing_price_new', newListPrice);
			tempRecord.setFieldValue('custrecord_temp_price_change', 'X');
		}
		if (oldExpDate != newExpDate)
		{
			tempRecord.setFieldValue('custrecord_temp_exp_date_new', newExpDate);
			tempRecord.setFieldValue('custrecord_temp_exp_date', oldExpDate);
			tempRecord.setFieldValue('custrecord_temp_date_change', 'X');
		}
		if (oldExpDate != newExpDate && oldListPrice != newListPrice)
		{
			tempRecord.setFieldValue('custrecord_temp_both_change', 'X');
			tempRecord.setFieldValue('custrecord_temp_date_change', '');
			tempRecord.setFieldValue('custrecord_temp_price_change', '');
		}
		/*tempRecord.setFieldValue('custrecord_temp_exp_date_new', newExpDate);
		tempRecord.setFieldValue('custrecord_temp_exp_date', oldExpDate);
		tempRecord.setFieldValue('custrecord_temp_listing_price',oldListPrice);
		tempRecord.setFieldValue('custrecord_temp_listing_price_new', newListPrice);*/
		var tempRecordID = nlapiSubmitRecord(tempRecord);

		nlapiLogExecution('DEBUG', 'Template Created with id : '+tempRecordID+', templateID: '+templateID);

		if(templateID)
		{
			var mergeFields = new Array();
			mergeFields[0] = 'nlcustrecord_temp_mls_number';
			mergeFields[1] = 'nlcustrecord_temp_mls_area_code'; 
			mergeFields[2] = 'nlcustrecord_temp_city';
			mergeFields[3] = 'nlcustrecord_temp_state';
			mergeFields[4] = 'nlcustrecord_temp_zip';
			mergeFields[5] = 'nlcustrecord_temp_date';
			mergeFields[6] = 'nlcustrecord_temp_seller_sig';
			mergeFields[7] = 'nlcustrecord_temp_exp_date_new';
			mergeFields[8] = 'nlcustrecord_temp_exp_date';
			mergeFields[9] = 'nlcustrecord_temp_listing_price';
			mergeFields[10] = 'nlcustrecord_temp_listing_price_new';
			mergeFields[11] = 'nlcustrecord_temp_address'; 
			mergeFields[12] = 'nlcustrecord_temp_price_change';
			mergeFields[13] = 'nlcustrecord_temp_date_change';
			mergeFields[14] = 'nlcustrecord_temp_both_change';

            var records = new Object();
			records['record'] = nlapiGetRecordId();
			records['recordtype'] = 18;
		
			var listingDoc = nlapiMergeRecord(templateID, 'customrecord_merge', tempRecordID, null, null, mergeFields);
			var pdfDoc = nlapiCreateFile(mlsNumber + ' Listing Amendment ' + dateFileFormatted + '.pdf', 'PDF', listingDoc.getValue());
			pdfDoc.setFolder('13017');
			var fileID = nlapiSubmitFile(pdfDoc);
			nlapiAttachRecord('file', fileID, 'customrecord_property_record', nlapiGetRecordId());
			var mailTOMLS = nlapiGetFieldValue('custpage_email_to_mlsinfo');
			var subject1 = 'Listing Amendment MLS# ' +mlsNumber+ ' ' + dateFileFormatted;
			if(mailTOMLS  == 'T')
			nlapiSendEmail(author,cc,subject1 ,'Attached find a listing amendment.',to, null, records, pdfDoc);
			nlapiDeleteRecord('customrecord_merge', tempRecordID);
			nlapiLogExecution('DEBUG', 'File Submitted with id :  '+fileID+'Template Deleted  with id : '+tempRecordID);
		}
		else
		{
			nlapiDeleteRecord('customrecord_merge', tempRecordID);
			nlapiLogExecution('DEBUG', 'Template Merging Falied ,  '+'Template Deleted  with id : '+tempRecordID);
		}
	}
	catch(ex)
	{
	    details = 'Exception in generateListAmendment: '+ex+', Message : '+ex.message+' Name : '+ex.name;
	    nlapiLogExecution('DEBUG', details);
		nlapiSendEmail(author,recipient,subject,details);
	}
}


function checkIfNull(value)
{	
	try
	{ 
	    if(value == null || value == undefined || value == '')
	    value = '';	    
	    return value;
	}
	catch(ex)
	{
	    details = 'Exception in  checkIfNull: '+ex+', Message : '+ex.message+' Name : '+ex.name;
	    nlapiLogExecution('DEBUG', details);
	    nlapiSendEmail(author,recipient,subject,details);
	    return '';
	}
}



