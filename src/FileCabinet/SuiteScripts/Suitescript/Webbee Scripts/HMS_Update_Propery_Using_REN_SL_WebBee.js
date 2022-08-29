//HMS_Update_Propery_Using_REN_SL_WebBee.js

var body = '';
var author = -5;
var callCenter = 3847;
var subject = 'HMS ,Update Property Fields';
var recipient = 'pranjal@webbee.biz';
var cc =  'mlsinfo@hmsmarketingservices.com';

var emailContaint="";
var flag=0;

function UpdateProperty(request, response)
{
	try
	{	
		if(request.getMethod() == 'GET')
		{
		    var SecretCode = request.getParameter('ssno2');
		    var  propertyId = '';
		    if(defVal(SecretCode) != '')
		    {
		    	var filters = new nlobjSearchFilter('custrecord_secret_code', null, 'is', SecretCode);
		    	var PSearch = nlapiSearchRecord('customrecord_property_record', null, filters);
		    	if(PSearch != null && PSearch.length > 0)
		        propertyId = PSearch[0].getId();    	
		    }	
		    
			if(defVal(propertyId) != '')
			{				
				var approveform = nlapiCreateForm('Status Updates', true);
				var fldGrpPropertyInfo = approveform.addFieldGroup('custpage_propdetails','Property Details...');
				var loadrecord = nlapiLoadRecord('customrecord_property_record',propertyId);
				var subdivisionID = loadrecord.getFieldValue('custrecordcustrecordsubdname');
				var subdivisionRecord = nlapiLoadRecord('customrecord_subdivision', subdivisionID);
				var houseno = loadrecord.getFieldValue('custrecord_house_number');
				var streetname = loadrecord.getFieldValue('custrecord31');
				var subdivision = subdivisionRecord.getFieldValue('custrecord_subdivision_id');
				var lotnumber = loadrecord.getFieldValue('custrecord_lot_number');
				var currentconststatus = loadrecord.getFieldText('custrecord_current_construction');
				var currentstatus = loadrecord.getFieldText('custrecord_property_status');
				var currentlistprice = loadrecord.getFieldValue('custrecord_current_list_price');
								
				var fielddet = approveform.addField('custpage_houseno', 'text', 'House Number:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(houseno);
				fielddet.setDisplayType('inline');
				
				var fielddet = approveform.addField('custpage_streetname', 'select', 'Street Name:','customrecord_street_name','custpage_propdetails');			
				fielddet.setDefaultValue(streetname);
				fielddet.setDisplayType('inline');
				
				var fielddet = approveform.addField('custpage_subdivision', 'text', 'Subdivision:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(subdivision);
				fielddet.setDisplayType('inline');
				
				var fielddet = approveform.addField('custpage_lotno', 'text', ' Lot Number:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(lotnumber);
				fielddet.setDisplayType('inline');
				
				fldGrpPropertyInfo.setShowBorder(true);
				
				var fielddet = approveform.addField('custpage_currentstatus', 'text', ' Current Sales Status:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(currentstatus);
				fielddet.setDisplayType('inline');
									
				var fielddet = approveform.addField('custpage_currentconsstatus', 'text', ' Current Construction Status:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(currentconststatus);
				fielddet.setDisplayType('inline');
					
				var fielddet = approveform.addField('custpage_currentlistprice', 'text', ' Current List Price:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(currentlistprice);
				fielddet.setDisplayType('inline');
				
				fldGrpPropertyInfo.setShowBorder(true);
				
				var fldGrpPropertyInfo = approveform.addFieldGroup('custpage_propdata','Provide Data.');
				fldGrpPropertyInfo.setSingleColumn(true);
				
				var ftranid = approveform.addField('custpage_propertyid', 'text', 'internalid');			
				ftranid.setDefaultValue(propertyId);
				ftranid.setDisplayType('hidden');
				
				var ftranid1 = approveform.addField('custpage_construction_status', 'select', 'Construction Status',null,'custpage_propdata');			
				ftranid1.setMandatory(false);
				ftranid1.addSelectOption('','');
				
				var record = nlapiCreateRecord('customrecord_property_record');
				var myFld = record.getField('custrecord_current_construction');
				var options = myFld.getSelectOptions();
				
				for(var ab=0; ab < options.length; ab++)
				{
					var gid = options[ab].getId();
					var gtext = options[ab].getText();
					ftranid1.addSelectOption(gid,gtext);
				}
						
				var salesstatusfield = approveform.addField('custpage_sales_status', 'select', 'Sales Status',null,'custpage_propdata');
				salesstatusfield.addSelectOption('','');
				salesstatusfield.addSelectOption('2','Under Contract');
				salesstatusfield.addSelectOption('3','Closed ');
				salesstatusfield.addSelectOption('1','Back on Market');
				salesstatusfield.setMandatory(false);
			
				var priceField = approveform.addField('custpage_price', 'currency', 'List Price (If Back on Market)',null,'custpage_propdata');
				priceField.setDisplayType('disabled');
				fldGrpPropertyInfo.setShowBorder(true);
				
				approveform.addSubmitButton('Submit');
				approveform.setScript('customscript_hms_update_field_cs');
				response.writePage(approveform);					
		}
		else
		UnauthorizedForm(response);
	}
	else
	{
		var propertyid = request.getParameter('custpage_propertyid');
		if(defVal(propertyid) != '')
		{
			var constructionstatus = request.getParameter('custpage_construction_status');
			var salesstatus = request.getParameter('custpage_sales_status');
			var newprice = request.getParameter('custpage_price');
			var Fields = [];
			var Values = [];
			
			
			//---------------------------------Edited on 5/oct/2018----------------------------
			
			var timestamp = new Date();
			timestamp .setMilliseconds((timestamp .getMilliseconds())+3*3600*1000);
			timestamp =nlapiDateToString(timestamp,'date');
			
			var record = nlapiLoadRecord('customrecord_property_record',propertyid);
			var constructionstatus_old=record.getFieldValue('custrecord_current_construction');
			var salesstatus_old=record.getFieldValue('custrecord_user_entered_sales_status');
			var propertyPrize_old = record.getFieldValue('custrecord_hms_update_price_hidden');
			
			if(defVal(constructionstatus) != '')
			{
			record.setFieldValue('custrecord_current_construction',constructionstatus);
			}
			if(defVal(salesstatus) != '')
			{
			record.setFieldValue('custrecord_user_entered_sales_status',salesstatus);
			}
			var gtext
			if(constructionstatus_old!=constructionstatus && constructionstatus !=0){
				record.setFieldValue('custrecord_property_date_const_update',timestamp);
				
				var myFld = record.getField('custrecord_current_construction');
				var options = myFld.getSelectOptions();
				for(var ab=0; ab < options.length; ab++)
				{
				var gid = options[ab].getId();
				if(gid == constructionstatus){
				gtext = options[ab].getText();
				nlapiLogExecution("DEBUG","GTECT",gtext)
				}
				}
				emailContaint += "The construction status has changed to "+gtext+"\n";
				flag = 2
			}
			
			if(salesstatus_old!=salesstatus && salesstatus !=0){
				record.setFieldValue('custrecord_property_date_sales_st_update',timestamp);
				
				var textValue = '';
				
				if(salesstatus == 1){
					
					textValue ="Back on Market"
				}else if(salesstatus == 2){
					
					textValue = "Under Contract"
					
				}else if(salesstatus == 3){
					
					textValue = "Closed"
				}
				
				emailContaint+= "The sales status has changed to "+textValue+"\n";
				
				if(salesstatus ==1 || salesstatus == "1"){
					
					if(newprice !=0 ){ //&& propertyPrize_old != newprice
						
						emailContaint += "And the property has gone from pending to back on market the new price is "+newprice+"\n";
					}
				}
				flag = 1
			}
			
			var ridi = nlapiSubmitRecord(record,true,true);
			nlapiLogExecution("DEBUG", "Submited record id is ", ridi)
			
			
			//---------------------------------END ----------------------------------
			
			
			if(defVal(constructionstatus) != '')
			{
				Fields.push('custrecord_current_construction');
				Values.push(constructionstatus);
			}	
			
			if(defVal(salesstatus) != '')
			{
				Fields.push('custrecord_user_entered_sales_status');
				Values.push(salesstatus);
			}	
			
			if(defVal(newprice) != '')
			{
				Fields.push('custrecord_hms_update_price_hidden');
				Values.push(newprice);
			}	
			
			if(Fields.length > 0 && Values.length > 0)
			{
			   nlapiSubmitField('customrecord_property_record', propertyid, Fields,Values, true);

				var records = {};
				records['recordtype'] = 18;
				records['record'] = propertyid;
				
				
				var emailMerger = nlapiCreateEmailMerger(92);
				emailMerger.setCustomRecord('customrecord_property_record',propertyid);
				var mergeResult = emailMerger.merge();
				var emailBody = mergeResult.getBody();
				var emailsubject = mergeResult.getSubject();
				
							
				
				var renderEmail = nlapiCreateTemplateRenderer()
				renderEmail.setTemplate(emailBody);	
				
				var replaceURL = "EmailContaintAccordingToConfdition";
				var email_body = renderEmail.renderToString();
              
              if(emailContaint){
				email_body = email_body.replace(replaceURL,emailContaint);
              }else{
                email_body = email_body.replace(replaceURL," ");
                
              }
				
				if(flag>0){
				nlapiSendEmail(callCenter, cc, emailsubject, email_body, null,null, records);
				//nlapiSendEmail(callCenter, "vikash.singh@webbee.biz", emailsubject, email_body, null,null, records);
				
				}
			}	
		  }
		  SuccessForm(response);
	  }	
	}
	catch(ex)
	{
		body = 'UpdateProperty , Exception : '+ex.name;
		body += ', Message : '+ex.message;
		nlapiSendEmail(author,recipient, subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);	
		response.write('');
	}	
}

function UpdatePropertyStatus(request, response)
{
	try
	{	
		if(request.getMethod() == 'GET')
		{
		   var propertyId = request.getParameter('propertyId');
		   var ssno = GetSSNO(propertyId);
			if(defVal(ssno) != '')
			{				
				var approveform = nlapiCreateForm('Status Updates', true);
				var fldGrpPropertyInfo = approveform.addFieldGroup('custpage_propdetails','Property Details...');
				approveform.setScript('customscript_hms_update_field_cs');
				var loadrecord = nlapiLoadRecord('customrecord_property_record',propertyId);
				var subdivisionID = loadrecord.getFieldValue('custrecordcustrecordsubdname');
				var subdivisionRecord = nlapiLoadRecord('customrecord_subdivision', subdivisionID);
				var houseno = loadrecord.getFieldValue('custrecord_house_number');
				var streetname = loadrecord.getFieldValue('custrecord31');
				var subdivision = subdivisionRecord.getFieldValue('custrecord_subdivision_id');
				var lotnumber = loadrecord.getFieldValue('custrecord_lot_number');
				var currentconststatus = loadrecord.getFieldText('custrecord_current_construction');
				var currentstatus = loadrecord.getFieldText('custrecord_property_status');
				var currentlistprice = loadrecord.getFieldValue('custrecord_current_list_price');
								
				var fielddet = approveform.addField('custpage_houseno', 'text', 'House Number:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(houseno);
				fielddet.setDisplayType('inline');
				
				var fielddet = approveform.addField('custpage_streetname', 'select', 'Street Name:','customrecord_street_name','custpage_propdetails');			
				fielddet.setDefaultValue(streetname);
				fielddet.setDisplayType('inline');
				
				var fielddet = approveform.addField('custpage_subdivision', 'text', 'Subdivision:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(subdivision);
				fielddet.setDisplayType('inline');
				
				var fielddet = approveform.addField('custpage_lotno', 'text', ' Lot Number:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(lotnumber);
				fielddet.setDisplayType('inline');
				
				fldGrpPropertyInfo.setShowBorder(true);
				
				var fielddet = approveform.addField('custpage_currentstatus', 'text', ' Current Sales Status:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(currentstatus);
				fielddet.setDisplayType('inline');
									
				var fielddet = approveform.addField('custpage_currentconsstatus', 'text', ' Current Construction Status:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(currentconststatus);
				fielddet.setDisplayType('inline');
					
				var fielddet = approveform.addField('custpage_currentlistprice', 'text', ' Current List Price:',null,'custpage_propdetails');			
				fielddet.setDefaultValue(currentlistprice);
				fielddet.setDisplayType('inline');
				
				fldGrpPropertyInfo.setShowBorder(true);
				
				var fldGrpPropertyInfo = approveform.addFieldGroup('custpage_propdata','Provide Data.');
				fldGrpPropertyInfo.setSingleColumn(true);
				
				var ftranid = approveform.addField('custpage_propertyid', 'text', 'internalid');			
				ftranid.setDefaultValue(propertyId);
				ftranid.setDisplayType('hidden');
				
				var ssnofield = approveform.addField('custpage_ssno', 'text', 'SS NO');			
				ssnofield.setDefaultValue(ssno);
				ssnofield.setDisplayType('hidden');
				
				var ftranid1 = approveform.addField('custpage_construction_status', 'select', 'Construction Status',null,'custpage_propdata');			
				ftranid1.setMandatory(false);
				ftranid1.addSelectOption('','');
				
				var record = nlapiCreateRecord('customrecord_property_record');
				var myFld = record.getField('custrecord_current_construction');
				var options = myFld.getSelectOptions();
				
				for(var ab=0; ab < options.length; ab++)
				{
					var gid = options[ab].getId();
					var gtext = options[ab].getText();
					ftranid1.addSelectOption(gid,gtext);
				}
						
				var salesstatusfield = approveform.addField('custpage_sales_status', 'select', 'Sales Status',null,'custpage_propdata');
				salesstatusfield.addSelectOption('','');
				salesstatusfield.addSelectOption('2','Under Contract');
				salesstatusfield.addSelectOption('3','Closed ');
				salesstatusfield.addSelectOption('1','Back on Market');
				salesstatusfield.setMandatory(false);
			
				var priceField = approveform.addField('custpage_price', 'currency', 'List Price (If Back on Market)',null,'custpage_propdata');
				priceField.setDisplayType('disabled');
				fldGrpPropertyInfo.setShowBorder(true);
				
				approveform.addSubmitButton('Submit');
				response.writePage(approveform);					
		}
		else
		UnauthorizedForm(response);
	}
	else
	{
		var propertyid = request.getParameter('custpage_propertyid');
		if(defVal(propertyid) != '')
		{
			 var timestamp = new Date();
			 timestamp .setMilliseconds((timestamp .getMilliseconds())+3*3600*1000);
			 timestamp =nlapiDateToString(timestamp,'date');
			var constructionstatus = request.getParameter('custpage_construction_status');
			var salesstatus = request.getParameter('custpage_sales_status');
			var newprice = request.getParameter('custpage_price');
			var ssnumber = request.getParameter('custpage_ssno');
			var record = nlapiLoadRecord('customrecord_property_record',propertyid);
			var constructionstatus_old=record.getFieldValue('custrecord_current_construction');
			var salesstatus_old=record.getFieldValue('custrecord_user_entered_sales_status');
			record.setFieldValue('custrecord_current_construction',constructionstatus);
			record.setFieldValue('custrecord_user_entered_sales_status',salesstatus);
			if(salesstatus_old!=salesstatus){
				record.setFieldValue('custrecord_property_date_sales_st_update',timestamp);
			}
			if(constructionstatus_old!=constructionstatus){
				record.setFieldValue('custrecord_property_date_const_update',timestamp);
			}
			record.setFieldValue('custrecord_hms_update_price_hidden',newprice);
			var ridi = nlapiSubmitRecord(record,true,true);
			var records = {};
			records['recordtype'] = 18;
			records['record'] = ridi;

			var cc =  'mlsinfo@hmsmarketingservices.com';
			var emailMerger = nlapiCreateEmailMerger(92);
			emailMerger.setCustomRecord('customrecord_property_record',ridi);
			var mergeResult = emailMerger.merge();
			var emailBody = mergeResult.getBody();
			var emailsubject = mergeResult.getSubject();
			nlapiSendEmail(callCenter, cc, emailsubject, emailBody, null, null, records);
		    LockSecurityNo(ridi, ssnumber);
		}
		SuccessForm(response);
	  }	
	}
	catch(ex)
	{
		body = 'UpdatePropertyStatus , Exception : '+ex.name;
		body += ', Message : '+ex.message;
		nlapiSendEmail(author,recipient, subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);	
		response.write('');
	}	
}

function GetSSNO(propertyId)
{
	try
	{
		var ssno = null;	
		var filters = new nlobjSearchFilter('custrecord_hms_property_no', null,  'is', propertyId);	
		var columns = new nlobjSearchColumn('custrecord_hms_security_codes');
		var Results = nlapiSearchRecord( 'customrecord_hms_security_number', null, filters, columns );
		if(Results != null && Results.length > 0)
		ssno  = Results[0].getValue('custrecord_hms_security_codes');	
		
		if(defVal(ssno) != '')
		{
			body = 'SSNO Record Found with SSno : '+ssno;
			nlapiLogExecution('DEBUG', 'Body : ', body);
			return ssno;
		}	
		else
		{
			var alreadythere = true;
			do 
			{
				ssno = GetRandomString();
				alreadythere = CheckSecurity(ssno);		
			}while(alreadythere);
			
			var ssnrecord = nlapiCreateRecord('customrecord_hms_security_number');
			ssnrecord.setFieldValue('custrecord_hms_security_codes',ssno);
			ssnrecord.setFieldValue('custrecord_hms_property_no',propertyId);		
			var recordId = nlapiSubmitRecord(ssnrecord, true);
			body = 'SSNO Record Created with Id : '+recordId;
			nlapiLogExecution('DEBUG', 'Body : ', body);
			return ssno;
		}	
	}
	catch(ex)
	{
	   body = 'GetSSNO, Exception : '+ex+', Message : '+ex.message;
	   nlapiLogExecution('DEBUG', 'Body : ', details);
	   nlapiSendEmail(author,recipient, subject, body);
       return null;
	}
}

function LockSecurityNo(propertyid, ssnumber)
{
	try
	{
		var filters = [];	
		filters.push(new nlobjSearchFilter('custrecord_hms_security_codes', null,  'is', ssnumber));
		filters.push(new nlobjSearchFilter('custrecord_hms_property_no', null,  'anyof', propertyid));		
		var Results = nlapiSearchRecord( 'customrecord_hms_security_number', null, filters);
		if(Results != null && Results.length >0)
		{
			var ssoid = Results[0].getId();
			nlapiSubmitField('customrecord_hms_security_number', ssoid, 'custrecord_hms_code_utilized', 'F');
		}
	}		
	catch(e)
	{
		body = 'LockSecurityNo , Exception : '+ex.name;
		body += ', Message : '+ex.message;
		nlapiSendEmail(author,recipient, subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);	
	}
}

function GetRandomString()
{
	try
	{
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var string_length = 4;
		var randomstring = '';
		for (var i=0; i<string_length; i++)
		{
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum,rnum+1);
		}
		chars = '123456789';
		for (var i=0; i<string_length; i++)
		{
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum,rnum+1);
		}
		chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		for (var i=0; i<string_length; i++)
		{
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum,rnum+1);
		}
		return randomstring;
	}
	catch(ex)
	{
		body = 'GetRandomString , Exception : '+ex.name;
		body += ', Message : '+ex.message;
		nlapiSendEmail(author,recipient, subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);	
		return null;
	}	
}


function CheckSecurity(ssno)
{
	try
	{
		var filters = new nlobjSearchFilter('custrecord_hms_security_codes', null,  'is', ssno);	
		var columns = new nlobjSearchColumn('custrecord_hms_security_codes');
		var Results = nlapiSearchRecord( 'customrecord_hms_security_number', null, filters, columns );
		if(Results != null && Results.length > 0)
		{
			for(var i=0; i<Results.length; i++)
			{
				var sscodes = Results[i].getValue('custrecord_hms_security_codes');			
				if(sscodes == ssno)
				return true;
			}
		}
		return false;
	}
	catch(ex)
	{
		body = 'CheckSecurity , Exception : '+ex.name;
		body += ', Message : '+ex.message;
		nlapiSendEmail(author,recipient, subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);	
		return false;
	}
}

function defVal(value)
{	
	try
	{ 
	    if(value == null || value == undefined || value == 'undefined')
	    value = '';	    
	    return value;
	}
	catch(ex)
	{
	   body = 'defVal, Exception : '+ex+', Message : '+ex.message;
	   nlapiLogExecution('DEBUG', 'Body : ', details);
	   nlapiSendEmail(author,recipient, subject, body);
       return '';
	}
}

function SuccessForm(response)
{
	var form = nlapiCreateForm("Success");
	var success=form.addField('success', 'text', 'Property Updated Succesfully.');
	success.setDisplayType('inline');
	form.addButton('custpage_ok','OK','window.close();');
	response.writePage(form);
}

function UnauthorizedForm(response)
{
	var form = nlapiCreateForm("Unauthorized");
	var success=form.addField('success', 'text', 'You Are Not Authorized to update now!');
	success.setDisplayType('inline');
	form.addButton('custpage_ok','OK','window.close();');
	response.writePage(form);
}

