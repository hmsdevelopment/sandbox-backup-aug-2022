function sendEmail()
{
	try
	{
		var id = nlapiGetRecordId();
		var ssno = '';
		var alreadythere = '';
		do 
		{
			ssno = randomString();
			alreadythere = checkSecurity(ssno);
			
		}while(alreadythere == true);
		
		nlapiLogExecution('DEBUG', " ssno   ","ssno "+ssno);
		var ssnrecord = nlapiCreateRecord('customrecord_hms_security_number');
		ssnrecord.setFieldValue('custrecord_hms_security_codes',ssno);
		ssnrecord.setFieldValue('custrecord_hms_property_no',id);		
		var recordid = nlapiSubmitRecord(ssnrecord, true, true);
		var url = nlapiResolveURL('SUITELET','customscript_hms_update_field_sl','customdeploy_hms_update_field_sl',true)+'&ssno='+ssno;
		var body = ' Use below URL to update <br> <a href="'+url+'">Update Property</a>;'
		var records = {};
		records['recordtype'] = 18;
		records['record'] = id;

		nlapiSendEmail(3847,'abhirules01@gmail.com','please update url ',body,'jeff@jeffmcdonald.net',null,records);
		
		
		nlapiLogExecution('DEBUG', " email send    "," end of function ");
	}
	catch(e)
	{
	}
}


function updatePropRecord(request, response)
{
	try
	{
		var ssno = request.getParameter('ssno');
		var id = '';//now using id of security record
		
		if (request.getMethod() == 'GET')
		{
			id = getTransactionId(ssno);
			nlapiLogExecution('DEBUG', "id   "," id "+id+' ssno '+ssno);
			if(id && (id != 'null'))
			{
				
				if(id && (id != 'null'))
				{
					
					var approveform = nlapiCreateForm('Status Updates', true);
					var fldGrpPropertyInfo = approveform.addFieldGroup('custpage_propdetails','Property Details...');
					//fldGrpPropertyInfo.setSingleColumn(true);
					approveform.setScript('customscript_hms_update_field_cs');
					var loadrecord = nlapiLoadRecord('customrecord_property_record',id);
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
					
					//var fldGrpPropertyInfo = approveform.addFieldGroup('custpage_propstatus','Current Property Status...');
					//fldGrpPropertyInfo.setSingleColumn(true);
					
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
					ftranid.setDefaultValue(id);
					ftranid.setDisplayType('hidden');
					
					var ssnofield = approveform.addField('custpage_ssno', 'text', 'SS NO');			
					ssnofield.setDefaultValue(ssno);
					ssnofield.setDisplayType('hidden');
					
					var ftranid1 = approveform.addField('custpage_construction_status', 'select', 'Construction Status',null,'custpage_propdata');			
					ftranid1.setMandatory(true);
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
					salesstatusfield.setMandatory(true);
				
					var priceField = approveform.addField('custpage_price', 'currency', 'List Price (If Back on Market)',null,'custpage_propdata');
					priceField.setDisplayType('disabled');
					fldGrpPropertyInfo.setShowBorder(true);
					
					approveform.addSubmitButton('Submit');
					response.writePage(approveform);
					var html = '<html>';
					html += '<head>';
					html += '</head>';
					html += '<body>';
					html += '</body>';
					html += '</html>'
					
				}
			}
			else
			{
				unauthorizedForm();
			}
		}
		else
		{
			var propertyid = request.getParameter('custpage_propertyid');
			nlapiLogExecution('DEBUG', "propertyid   "," propertyid "+propertyid);
			if(propertyid && (propertyid != 'null'))
			{
				var constructionstatus = request.getParameter('custpage_construction_status');
				var salesstatus = request.getParameter('custpage_sales_status');
				var newprice = request.getParameter('custpage_price');
				var ssnumber = request.getParameter('custpage_ssno');
				var record = nlapiLoadRecord('customrecord_property_record',propertyid);
				record.setFieldValue('custrecord_current_construction',constructionstatus);
				record.setFieldValue('custrecord_user_entered_sales_status',salesstatus);
				record.setFieldValue('custrecord_hms_update_price_hidden',newprice);
				var ridi = nlapiSubmitRecord(record,true,true);
				nlapiLogExecution('DEBUG', "ridi   "," ridi "+ridi);
				var records = {};
				records['recordtype'] = 18;
				records['record'] = ridi;

				var cc = [];
				cc[0] = 'jeff@jeffmcdonald.net';
				var emailMerger1 = nlapiCreateEmailMerger(92);
				emailMerger1.setCustomRecord('customrecord_property_record',ridi);
				var mergeResult1 = emailMerger1.merge();
				var emailBody1 = mergeResult1.getBody();
				var emailsubject = mergeResult1.getSubject();
			//	nlapiSendEmail('3847', 'mlsinfo@hmsmarketingservices.com', emailsubject, emailBody1, cc, null, records);
			nlapiSendEmail('3847', 'abhirules01@gmail.com', emailsubject, emailBody1, cc, null, records);
			lockSecurityNo(ridi, ssnumber);
			}
			successForm();
		}
		
	}
	catch(e)
	{
		var errmsg = '';
        var err = '';
		var fx='';
        if ( e instanceof nlobjError )
        {
            err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
        }
        else
        {
            err = 'Unexpected error: ' + e.toString();
        }
        errmsg += '\n' + err;
        nlapiLogExecution( 'ERROR',  ' 999 Error', errmsg);
		response.write(false);
	}
}

function lockSecurityNo(propertyid, ssnumber)
{
	var transactionidi = '';
	var filters = [];	
	filters.push(new nlobjSearchFilter('custrecord_hms_security_codes', null,  'is', ssnumber));
	filters.push(new nlobjSearchFilter('custrecord_hms_property_no', null,  'anyof', propertyid));
	var columns = [];
	columns.push(new nlobjSearchColumn('custrecord_hms_security_codes'));
	columns.push(new nlobjSearchColumn('custrecord_hms_property_no'));
	columns.push(new nlobjSearchColumn('custrecord_hms_code_utilized'));
	var searchRecordResults = nlapiSearchRecord( 'customrecord_hms_security_number', null, filters, columns );
	if(searchRecordResults)
	{
		try
		{
			var ssoid = searchRecordResults[0].getId();
			var ssotype = searchRecordResults[0].getRecordType();
			//nlapiSubmitField(ssotype, ssoid, 'custrecord_hms_code_utilized', 'T');
			nlapiSubmitField(ssotype, ssoid, 'custrecord_hms_code_utilized', 'F');
		}
		catch(e)
		{
			return false;
		}
	}
	return false;
}

function setPriceMandatory()
{
	var salestatus = nlapiGetFieldValue('custpage_sales_status');
	if(salestatus == 1)
	{
		var price = nlapiGetFieldValue('custpage_price');
		if(price)
		{
		}
		else
		{
			alert('Please enter Price.');
			return false;
		}
		
	}
	
	return true;
}

function disablePriceField(type,name,i)
{
	if(name == 'custpage_sales_status')
	{
		var salestatus = nlapiGetFieldValue('custpage_sales_status');
		if(salestatus == 1)
		{
			var price = nlapiGetField('custpage_price');		
			price.setDisplayType('normal');
		}
		else
		{
			nlapiSetFieldValue('custpage_price','');
			var price = nlapiGetField('custpage_price');			
			price.setDisplayType('disabled');
		}
	}
}

function randomString() {
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 4;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	chars = '123456789';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	//document.randform.randomfield.value = randomstring;
	return randomstring;
}


function checkSecurity(ssno)
{
	var present = false;
	var filters = [];	
	filters.push(new nlobjSearchFilter('custrecord_hms_security_codes', null,  'is', ssno));
	var columns = [];
	columns.push(new nlobjSearchColumn('custrecord_hms_security_codes'));
	var searchRecordResults = nlapiSearchRecord( 'customrecord_hms_security_number', null, filters, columns );
	if(searchRecordResults)
	{
		var searchlength = searchRecordResults.length;
		for(var i=0;i < searchlength;i++)
		{
			var sscodes = searchRecordResults[i].getValue('custrecord_hms_security_codes');
			
			if(sscodes == ssno)
			{
				present = true;
			}
			
		}
	}
	return present;
}


function getTransactionId(ssno)
{
	
	var transactionidi = '';
	var filters = [];	
	filters.push(new nlobjSearchFilter('custrecord_hms_security_codes', null,  'is', ssno));
	filters.push(new nlobjSearchFilter('custrecord_hms_code_utilized', null,  'is', 'F'));
	var columns = [];
	columns.push(new nlobjSearchColumn('custrecord_hms_security_codes'));
	columns.push(new nlobjSearchColumn('custrecord_hms_property_no'));
	var searchRecordResults = nlapiSearchRecord( 'customrecord_hms_security_number', null, filters, columns );
	nlapiLogExecution('DEBUG', " searchRecordResults   ","searchRecordResults "+searchRecordResults);
	if(searchRecordResults)
	{
		var searchlength = searchRecordResults.length;
		for(var i=0;i < searchlength;i++)
		{
			var sscodes = searchRecordResults[i].getValue('custrecord_hms_security_codes');
			var transactionid = searchRecordResults[i].getValue('custrecord_hms_property_no');
			
			if(sscodes == ssno)
			{
				transactionidi = transactionid;
				break;
			}
			
		}
	}
	return transactionidi;
}

function successForm()
{
	var form = nlapiCreateForm("Success");
	var success=form.addField('success', 'text', 'Property Updated Succesfully.',null);
	success.setDisplayType('inline');
	form.addButton('custpage_ok','OK','window.close();');
	response.writePage(form);
}
function unauthorizedForm()
{
	var form = nlapiCreateForm("Unauthorized");
	var success=form.addField('success', 'text', 'You Are Not Authorized to update now!',null);
	success.setDisplayType('inline');
	form.addButton('custpage_ok','OK','window.close();');
	response.writePage(form);
}