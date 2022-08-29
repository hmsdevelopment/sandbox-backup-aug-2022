/**************************21st October 2016*Pranjal Goyal******************************/

var body = '';
var author = 4276;
var subject = 'HMS, Send Listing Agreement';
var recipient = 'pranjal@webbee.biz';
var cc = 'mlsinfo@hmsmarketingservices.com';

function SendListingAgreementToMLS()
{
	try
	{
		var sendAgreementToMLS = nlapiGetFieldValue('custrecord_emailed_listing_mls');
		var listingDocValue = nlapiGetFieldValue('custrecord_listing_agreement_doc');
		var createListingDoc = nlapiGetFieldValue('custrecord_listing_agreement');
		var propertyID = nlapiGetRecordId();
		
		if(createListingDoc == 'T')
		{
			var today = new Date();
			var month = today.getMonth();
			month = month + 1;
			var day = today.getDate();
			var year = today.getFullYear();
			var dateFormatted = month + '/' + day;
			var monthName = GetMonthName(month);
			var builderID = nlapiGetFieldValue('custrecord12');
			var sellerInitials = nlapiGetFieldValue('custrecord_sellers_iniitals');
			var mlsRegion = nlapiGetFieldValue('custrecord15');
			var mlsRegionRecord = nlapiLoadRecord('location', mlsRegion);
			var mlsAreaCode = mlsRegionRecord.getFieldValue('custrecord_mls_area_code');
			var mlsEmail = mlsRegionRecord.getFieldValue('custrecord_mls_email');
			var mlsNumber = nlapiGetFieldValue('custrecord_mls_number_region1');
			var address = nlapiGetFieldValue('custrecord_simple_name');
			var city = nlapiGetFieldValue('custrecord_city');
			var state = nlapiGetFieldText('custrecord_state');
			var zipCode = nlapiGetFieldValue('custrecord_zip_code');
			var builderName = nlapiGetFieldText('custrecord_top_level_builder');
			var commDollars = nlapiGetFieldValue('custrecord_commission');
			var commPercent = nlapiGetFieldValue('custrecord_commission_percent');
			var coopCommission = nlapiGetFieldValue('custrecord_coop_commission');
			var sellerSig = nlapiGetFieldValue('custrecord_sellers_signature');
			var county = nlapiGetFieldText('custrecord10');
			var listingPrice = nlapiGetFieldValue('custrecord_current_list_price');
			var expirationDate1 = nlapiGetFieldValue('custrecord_expiration_date');
			var expirationDate = new Date(expirationDate1);
			var expDay = expirationDate.getDate();
			var expMonth = expirationDate.getMonth() + 1;
			var expYear = expirationDate.getFullYear();	
			var expMonthName = GetMonthName(expMonth);
			var expTextDate = expMonthName + ', ' + expYear
			var listDate = nlapiGetFieldValue('custrecord_list_date');
			var tempRecord = nlapiCreateRecord('customrecord_merge');
			var subdID = nlapiGetFieldValue('custrecordcustrecordsubdname');
			var subdivision = '';
			if(subdID)
			subdivision =  nlapiLookupField('customrecord_subdivision', subdID, 'custrecord_subdivision_id');
			
          
          nlapiLogExecution('DEBUG', 'line 60 : ','60');
			tempRecord.setFieldValue('custrecord_temp_mls_number', mlsNumber);
			tempRecord.setFieldValue('custrecord_temp_address', address);
			tempRecord.setFieldValue('custrecord_temp_city', city);
			tempRecord.setFieldValue('custrecord_temp_state', state);
			tempRecord.setFieldValue('custrecord_temp_zip', zipCode);
			tempRecord.setFieldValue('custrecord_temp_county', county);
			tempRecord.setFieldValue('custrecord_temp_listing_price', listingPrice);
			tempRecord.setFieldValue('custrecord_temp_builder_name', builderName);
			tempRecord.setFieldValue('custrecord_temp_mls_area_code', mlsAreaCode);
			tempRecord.setFieldValue('custrecord_temp_date', dateFormatted);
			tempRecord.setFieldValue('custrecord_temp_day', day);
			tempRecord.setFieldValue('custrecord_temp_month', monthName);
			tempRecord.setFieldValue('custrecord_temp_year', year);
			tempRecord.setFieldValue('custrecord_temp_exp_date', expirationDate1);
			tempRecord.setFieldValue('custrecord_temp_exp_day', expDay);
			tempRecord.setFieldValue('custrecord_temp_exp_month', expMonthName);
			tempRecord.setFieldValue('custrecord_temp_exp_year', expYear);
			tempRecord.setFieldValue('custrecord_temp_exp_text_date', expTextDate);
			tempRecord.setFieldValue('custrecord_temp_list_date', listDate);
			tempRecord.setFieldValue('custrecord_temp_subdivision', defVal(subdivision));
			tempRecord.setFieldValue('custrecord_temp_comm_dollars', commDollars);
			tempRecord.setFieldValue('custrecord_temp_comm_percent', commPercent);
			tempRecord.setFieldValue('custrecord_temp_coop_commission', coopCommission);
			tempRecord.setFieldValue('custrecord_temp_seller_sig', sellerSig);
			var tempRecordID = nlapiSubmitRecord(tempRecord);
			nlapiLogExecution('DEBUG', 'line : ','86');
			var mergeFields = new Array();
			mergeFields[0] = 'nlcustrecord_temp_mls_number';
			mergeFields[1] = 'nlcustrecord_temp_address';
			mergeFields[2] = 'nlcustrecord_temp_city';
			mergeFields[3] = 'nlcustrecord_temp_state';
			mergeFields[4] = 'nlcustrecord_temp_zip';
			mergeFields[5] = 'nlcustrecord_temp_county';
			mergeFields[6] = 'nlcustrecord_temp_listing_price';
			mergeFields[7] = 'nlcustrecord_temp_builder_name';
			mergeFields[8] = 'nlcustrecord_temp_mls_area_code';
			mergeFields[9] = 'nlcustrecord_temp_date';
			mergeFields[10] = 'nlcustrecord_temp_day';
			mergeFields[11] = 'nlcustrecord_temp_month';
			mergeFields[12] = 'nlcustrecord_temp_year';		
			mergeFields[13] = 'nlcustrecord_temp_exp_date';
			mergeFields[14] = 'nlcustrecord_temp_exp_day';
			mergeFields[15] = 'nlcustrecord_temp_exp_month';
			mergeFields[16] = 'nlcustrecord_temp_exp_year';
			mergeFields[17] = 'nlcustrecord_temp_exp_text_date';
			mergeFields[18] = 'nlcustrecord_temp_list_date';
			mergeFields[19] = 'custrecord_temp_subdivision';
			mergeFields[20] = 'nlcustrecord_temp_comm_dollars';
			mergeFields[21] = 'nlcustrecord_temp_comm_percent';
			mergeFields[22] = 'nlcustrecord_temp_coop_commission';
			mergeFields[23] = 'nlcustrecord_temp_seller_sig';
			
			var filters = [];
			filters.push(new nlobjSearchFilter('custrecord_mls_template_mls', null, 'is', mlsRegion));
			filters.push(new nlobjSearchFilter('custrecord_mls_template_builder_div', null, 'is', builderID));
			filters.push(new nlobjSearchFilter('custrecord_template_type', null, 'is',1));
			
			var results = nlapiSearchRecord('customrecord_mls_template_selection', null, filters);
          nlapiLogExecution('DEBUG', 'line : ','119');
			for(var i=0; results != null && results.length > i; i++)
			{
				var templateRecord = nlapiLoadRecord('customrecord_mls_template_selection', results[i].getId());
				var templateID = templateRecord.getFieldValue('custrecord_template_id');
				var emailTemplateID = templateRecord.getFieldValue('custrecord_email_template_id');
				var emailSubject = templateRecord.getFieldValue('custrecord_email_subject');
			}
			nlapiLogExecution('DEBUG', 'line : ','127');
			if(results == null)
			{
				nlapiDeleteRecord('customrecord_merge', tempRecordID);
				return true;
			}
nlapiLogExecution('DEBUG', 'line : ','133');
			var records = new Object();
			records['record'] = propertyID;
			records['recordtype'] = 18;
			nlapiLogExecution('DEBUG', 'line : ','137'+templateID+"tempRecordID"+tempRecordID+"mergeFields"+mergeFields);
			var listingDoc = nlapiMergeRecord(templateID, 'customrecord_merge', tempRecordID, null, null, mergeFields);
          nlapiLogExecution('DEBUG', 'line : ','139');
			var pdfDoc = nlapiCreateFile(address + ' Listing_Agreement - MLS' + mlsNumber + '.pdf', 'PDF', listingDoc.getValue());
          nlapiLogExecution('DEBUG', 'line : ','141');
			pdfDoc.setFolder(2269);
          nlapiLogExecution('DEBUG', 'line : ','143');
			var fileID = nlapiSubmitFile(pdfDoc);
          nlapiLogExecution('DEBUG', 'line : ','142');
			nlapiAttachRecord('file', fileID, 'customrecord_property_record', propertyID, null);
          nlapiLogExecution('DEBUG', 'line : ','143');
			nlapiSetFieldValue('custrecord_listing_agreement_doc', fileID);
			nlapiLogExecution('DEBUG', 'line : ','146');
          nlapiSetFieldValue('custrecord_listing_agreement', 'F');
nlapiLogExecution('DEBUG', 'line : ','145');
			if(sendAgreementToMLS == 'T')
			{
              nlapiLogExecution('DEBUG', 'line : ','148');
				var emailMerger = nlapiCreateEmailMerger(emailTemplateID);
				emailMerger.setCustomRecord('customrecord_property_record', propertyID);
				var mergeResult = emailMerger.merge();
				var emailBody = mergeResult.getBody();
              nlapiLogExecution('DEBUG', 'line : ','153');
				nlapiSendEmail(3847, mlsEmail, emailSubject, emailBody, cc, null, records, pdfDoc);
				nlapiSetFieldValue('custrecord_emailed_listing_mls', 'F');
			}
		}

		else if(sendAgreementToMLS == 'T' && listingDocValue != '')
		{
			var fileID = nlapiLoadFile(listingDocValue);
			var mlsRegion = nlapiGetFieldValue('custrecord15');
			var mlsRegionRecord = nlapiLoadRecord('location', mlsRegion);
			var mlsEmail = mlsRegionRecord.getFieldValue('custrecord_mls_email');
			var builderID = nlapiGetFieldValue('custrecord12');
			
			var records = new Object();
			records['record'] = propertyID;
			records['recordtype'] = '18';
			
			var filters = [];
			filters.push(new nlobjSearchFilter('custrecord_mls_template_mls', null, 'is', mlsRegion));
			filters.push(new nlobjSearchFilter('custrecord_mls_template_builder_div', null, 'is', builderID));
			filters.push(new nlobjSearchFilter('custrecord_template_type', null, 'is',1));
			
			var results = nlapiSearchRecord('customrecord_mls_template_selection', null, filters);
			for(var i=0; results != null && results.length > i; i++)
			{
				var templateRecord = nlapiLoadRecord('customrecord_mls_template_selection', results[i].getId());
				var templateID = templateRecord.getFieldValue('custrecord_template_id');
				var emailTemplateID = templateRecord.getFieldValue('custrecord_email_template_id');
				var emailSubject = templateRecord.getFieldValue('custrecord_email_subject');
			}
			
			var emailMerger = nlapiCreateEmailMerger(emailTemplateID);
			emailMerger.setCustomRecord('customrecord_property_record', propertyID);
			var mergeResult = emailMerger.merge();
			var emailBody = mergeResult.getBody();
			if(defVal(mlsEmail)!= '')
			nlapiSendEmail(3847, mlsEmail, emailSubject, emailBody, cc, null, records, fileID);
			else
			nlapiSendEmail(3847,cc,emailSubject, emailBody, null, null, records, fileID);	
			nlapiSetFieldValue('custrecord_emailed_listing_mls', 'F');
		}
	}
	catch(ex)
	{
		body =  'Exception : '+ex.name;
		body += '\n Function : SendListingAgreementToMLS, propertyID : '+propertyID;
		body += '\n Message : '+ex.message;
		nlapiSendEmail(author,recipient,subject,body);	
		nlapiLogExecution('DEBUG', 'Body : ', body);
	}
	
}

//Function defVal..	  

function defVal(value)
{	
	try
	{ 
	    if(value == null || value == undefined || value == '')
	    value = '';	    
	    return value;
	}
	catch(ex)
	{
		body =  'Exception : '+ex.name;
		body += '\n Function : defVal';
		body += '\n Message : '+ex.message;
		nlapiLogExecution('DEBUG', 'Body : ', body);
		nlapiSendEmail(author,recipient,subject,body);	
		return '';
	}
}

// After Submitting Property

function AfterSubmitProperty(type)
{
	try
	{
		var States = ['2','8','10'];
		var recordId = nlapiGetRecordId();
		var old = nlapiGetOldRecord();
		var status = nlapiGetFieldValue('custrecord_property_status');
		var statusText = nlapiGetFieldText('custrecord_property_status');
		var builderId = nlapiGetFieldValue('custrecord12');
	//	var createdDate = nlapiGetFieldValue('created').split(' ');
        var propertyName = nlapiGetFieldValue('name');
        var today = nlapiDateToString(new Date(), 'date');
        
        if(type != 'create' && defVal(builderId) != '')
        {
    		var filters = [];
    		filters.push(new nlobjSearchFilter('custrecord_open_property', null, 'is', recordId));
    		filters.push(new nlobjSearchFilter('custrecord_builder', null, 'is', builderId));
    		filters.push(new nlobjSearchFilter('custrecord_open_date', null, 'onorafter',today)); //createdDate[0]
    				
    		var results = nlapiSearchRecord('customrecord_open_house_properties', null, filters);
    		if(results != null && results.length >0 && defVal(old) != '')
    		{
    			var oldStatus = old.getFieldValue('custrecord_property_status');
    			var oldStatusText = old.getFieldText('custrecord_property_status');
    			if(oldStatus != status && States.indexOf(status)!=-1 )
    			{
    				body = '<b>Open House Property : </b>'+propertyName+'<b> Status : </b>';
    				body += oldStatusText+' has <b> changed to : </b>'+statusText;
    				nlapiLogExecution('DEBUG', 'today : '+today, body);
    				nlapiSendEmail(author,cc,'Open House Property Status Changed',body,null,recipient);
    			}	
    		}	
        }				
	}
    catch(ex)
    {
    	body =  'Exception : '+ex.name;
		body += '\n Function : AfterSubmitProperty '+recordId;
		body += '\n Message : '+ex.message;
		nlapiLogExecution('DEBUG', 'Body : ', body);
		nlapiSendEmail(author,recipient,subject,body);
        return false;
    }
}

function GetMonthName(month)
{
	try
	{
		switch(month)
		{
			case 1:
			month = 'January';
			break;
			case 2:
			month = 'February';
			break;
			case 3:
			month = 'March';
			break;
			case 4:
			month = 'April';
			break;
			case 5:
			month = 'May';
			break;
			case 6:
			month = 'June';
			break;
			case 7:
			month = 'July';
			break;
			case 8:
			month = 'August';
			break;
			case 9:
			month = 'September';
			break;
			case 10:
			month = 'October';
			break;
			case 11:
			month = 'November';
			break;
			case 12:
			month = 'December';
			break;
		}
		return month ;
	}
	catch(ex)
	{
		body =  'Exception : '+ex.name;
		body += '\n Function : GetMonthName';
		body += '\n Message : '+ex.message;
		nlapiLogExecution('DEBUG', 'Body : ', body);
		nlapiSendEmail(author,recipient,subject,body);	
		return 'January';
	}
}