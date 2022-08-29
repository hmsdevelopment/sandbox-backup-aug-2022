function leaveManagement(request,response)
{
	if(request.getMethod() == 'GET')
	{
		createForm(request);
	}
	else
	{
		transferEmployee(request);
	}
}
function pnvl(value, number) 
{
    if(number)
    {
        if(isNaN(parseFloat(value))) return 0;
        return parseFloat(value);
    }
    if(value == null) return '';
    return value;
}
function createForm(request)
{
	try
	{
	//--------- add customer info here ---------
	var date = new Date();
	var mm = date.getMonth() + 1;
	var yyyy = date.getFullYear();
	var dd = date.getDate();
	date = mm+'/'+dd+'/'+yyyy;
	var customerForm = nlapiCreateForm('Leave Management System');
	//customerForm.setScript('customscript_ceba_picklist_cs');
	
	var partnerid = pnvl(request.getParameter('partnerid'));
	
	var recordtype = pnvl(request.getParameter('recordtype'));
	
	var parent = nlapiLookupField(recordtype,partnerid,'custentity1');//for parent
	var inlinefield = customerForm.addField('custpage_message', 'inlinehtml');
	var html1 = '<span>Please choose start and end dates.</span>';
	inlinefield.setDefaultValue(html1);
	var field = customerForm.addField('custpage_start_date', 'date','Leave Start Date:').setMandatory(true); 
	
	field.setDefaultValue(date);
	
	var field1 = customerForm.addField('custpage_end_date', 'date','Leave End Date:').setMandatory(true);
	var from = customerForm.addField('custpage_transferfrom', 'select','Current BSR:',recordtype).setDisplayType('inline');
	if(partnerid)
	from.setDefaultValue(partnerid);
	var select = customerForm.addField('custpage_employee', 'select','Transfer to BSR:').setMandatory(true);
	select.addSelectOption('','');
	if(partnerid)
	{
		var results = searchParticularSalesOrder(recordtype,partnerid,parent);
		for(var i=0;results&& (i<results.length);i++)
		{
			var emid= results[i].getId();
			var name = results[i].getValue('entityid');
			select.addSelectOption(emid,name);
		}
	}
	
	//----------- for lower button --------------
	customerForm.addField('company_cust_hidden','text','Hidden').setDisplayType('hidden');//for lower button
	customerForm.addField('company_cust_payment','float','Hidden').setDisplayType('hidden');//for lower button
	customerForm.addField('company_cust_paymenttext','float','Hidden').setDisplayType('hidden');//for lower button
	customerForm.addField('company_so_proccessed','textarea','Hidden').setDisplayType('hidden');//for lower button
	customerForm.setFieldValues({ company_cust_hidden:'hidden_field',company_cust_payment:0,company_cust_paymenttext:0,company_so_proccessed:0});
	
	//-------------------------------------------
	customerForm.addSubmitButton('Submit');
	//var url = nlapiResolveURL('SUITELET','customscript_ceba_custom_picklist','customdeploy_ceba_custom_picklist');
	//var script = 'var date = nlapiGetFieldValue(\'custpage_date\');';
	//script = script + 'window.open("'+url+'&date=\'+nlapiGetFieldValue("custpage_date")+\'","_self");';
	//var script = 'var salesorderid = nlapiGetFieldValue(\'custpage_salesorder\');var date = nlapiGetFieldValue(\'custpage_date\');var reprint = nlapiGetFieldValue(\'custpage_reprint\'); window.open(\''+url+'&salesorderid=\'+salesorderid+\'&reprint=\'+reprint+\'&date=\'+date,\'_self\');';
	//customerForm.addButton('custpage_updateorder','Refresh',script);
	customerForm.addResetButton();
	
	
	response.writePage(customerForm);
	//------------------------------------------
	}
	catch(e)
	{
			nlapiLogExecution('ERROR', 'Unable To Load Account', 'Unable To Load Account - Reason : ' + e.toString());
	}
}

var subId = '';
function transferEmployee(request)
{
	    
	try
	{	
		var startdate = pnvl(request.getParameter('custpage_start_date'));
		var enddate = pnvl(request.getParameter('custpage_end_date'));
		var fromEmployee = pnvl(request.getParameter('custpage_transferfrom'));
		var toEmployee = pnvl(request.getParameter('custpage_employee'));
		nlapiLogExecution('DEBUG', 'startdate', 'startdate : ' + startdate+' enddate '+enddate+' fromEmployee '+fromEmployee+' toEmployee '+toEmployee);
		var record1 = nlapiLoadRecord('partner',fromEmployee);
		var ids1 = record1.getFieldValues('custentity_subdivision_ms');
		
		var subRecord = nlapiLoadRecord('partner',fromEmployee);
		//var currentsubdivision = subRecord.getFieldValues('custentity_subdivision_ms');
		//subRecord.setFieldValues('custentity_transfer_subdivision',ids1);
		//subRecord.setFieldValues('custentity_previous_subdivision',currentsubdivision);
		subRecord.setFieldValue('custentity_transfer_from',toEmployee);
		subRecord.setFieldValue('custentity_transfer_date',startdate);
		subRecord.setFieldValue('custentity_transfer_end_date',enddate);
		subId = nlapiSubmitRecord(subRecord,true,true);
		nlapiLogExecution('DEBUG', 'subId', 'subId : ' + subId);
		
		var datetoday = nlapiDateToString(new Date());
		
		if(datetoday == startdate)
		{
			var record = nlapiLoadRecord('partner',subId);
			/*var ids = record.getFieldValues('custentity_transfer_subdivision');
			var prevIds = record.getFieldValues('custentity_subdivision_ms');
			if(prevIds)
			{
				if(ids)
				{
					newIds = prevIds.concat(ids);
				}
				else
				{
					newIds = prevIds;
				}
			}
			else if(ids)
			{
				newIds = ids;
			}
			
			record.setFieldValues('custentity_subdivision_ms',newIds);*/
			record.setFieldValue('custentity_is_transfered','T');
			var idds = nlapiSubmitRecord(record,true,true);
			//nlapiLogExecution('DEBUG', 'newIds', 'newIds : ' + newIds+'Submitted Business Personnel Id : '+idds);
		}
		successForm();
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
        nlapiLogExecution( 'ERROR',  fx + ' 999 Error', errmsg);
		if(subId)
		{
			successForm();
		}
		else
		{
			failureForm();
		}
	}
	
}

function successForm()
{
	var form = nlapiCreateForm("Success");
	//form.setScript(42);

	var success=form.addField('success', 'text', 'Record Updated .',null);
		success.setDisplayType('inline');
		form.addButton('custpage_ok','OK','window.close();');
	
	response.writePage(form);
}

function failureForm()
{
	var form = nlapiCreateForm("Error..");
	//form.setScript(42);

	var success=form.addField('success', 'text', 'Sorry! Error Occured. .',null);
		success.setDisplayType('inline');
		form.addButton('custpage_ok','OK','window.close();');
	
	response.writePage(form);
}

function searchParticularSalesOrder(recordtype,partnerid,parent)
{
    try
    {
		var finalresults = new Array();
		var array = new Array();
            
            {
                var filters = new Array();
               
                filters.push( new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
				filters.push( new nlobjSearchFilter( 'custentity1', null, 'anyof', parent, null));
				filters.push(new nlobjSearchFilter('internalid',null,'noneof',partnerid));
				var columns = new Array();
				columns[0] = new nlobjSearchColumn('entityid');
				finalresults = nlapiSearchRecord(recordtype, null,filters, columns);
                
            }
		return finalresults;
    }
    catch(e)
    {
        var errmsg = ''
        var err = '';
        if ( e instanceof nlobjError )
        {
            err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
        }
        else
        {
            err = 'Unexpected error: ' + e.toString();
        }
        errmsg += '\n' + err;
        nlapiLogExecution( 'ERROR','ERROR'+ ' 999 Error', errmsg);
        return '';
    }
}


function beforeLoad(type,form,request)
{
	try
	{
		if(type == 'edit' || type == 'view')
		{
			
			var customform = '';
			var cf = request.getParameter('cf');
			if(cf)
			{
				customform = cf;
			}
			else
			{
				var record = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
				customform = record.getFieldValue('customform');
			}
			nlapiLogExecution('DEBUG', 'customform', 'customform : ' + customform);
			if(customform == 15 || customform == 33)
			{
				var id = nlapiGetRecordId();
				var recType = nlapiGetRecordType();
				var url = nlapiResolveURL('SUITELET','customscript_leave_management_sl','customdeploy_leave_management_sl');
				url = url + '&partnerid='+id+'&recordtype='+recType;
				nlapiLogExecution('DEBUG', 'url', 'url : ' + url);
				
				form.addButton('custpage_new_so','Vacation/Leave Management...','window.open(\''+url+'\',\'_blank\');');
			}
		}
	}
	catch(e)
	{
	}
}


function processLeaveManagement()
{
	try
	{
		var filters =	[ [ 'isinactive', 'is', 'F' ],
					'and',
					[ 'custentity_transfer_date', 'onorbefore','today' ],
					'and',
					[ 'custentity_is_transfered', 'is','F' ]] ;
	
		var col2 = new Array();
		col2[0] = new nlobjSearchColumn('internalid',null,null);
		col2[0].setSort(true);
		var partnerSearch = nlapiSearchRecord('partner', null, filters, col2);
		if(partnerSearch)
		{
			nlapiLogExecution('DEBUG', 'partnerSearch', 'partnerSearch : ' + partnerSearch.length);
			for(var i=0;i<partnerSearch.length;i++)
			{
				nlapiLogExecution('DEBUG', 'partner id', 'partner id : ' + partnerSearch[i].getId());
				var newIds = '';
				var record = nlapiLoadRecord(partnerSearch[i].getRecordType(),partnerSearch[i].getId());
				nlapiLogExecution('DEBUG', 'record', 'record : ' + record);
				var ids = record.getFieldValues('custentity_transfer_subdivision');
				/*var prevIds = record.getFieldValues('custentity_subdivision_ms');
				if(prevIds)
				{
					if(ids)
					{
						newIds = prevIds.concat(ids);
					}
					else
					{
						newIds = prevIds;
					}
				}
				else if(ids)
				{
					newIds = ids;
				}
				if(newIds)
				{
					nlapiLogExecution('DEBUG', 'newIds', 'newIds : ' + newIds);
					newIds = eliminateDuplicates(newIds);
					nlapiLogExecution('DEBUG', 'after', 'newIds : ' + newIds);
					record.setFieldValues('custentity_subdivision_ms',newIds);
				}
				record.setFieldValues('custentity_previous_subdivision',prevIds);*/
				
				record.setFieldValue('custentity_is_transfered','T');
				var idds = nlapiSubmitRecord(record,false,false);
				//nlapiLogExecution('DEBUG', 'newIds', 'newIds : ' + newIds+'Submitted Business Personnel Id : '+idds);
			}
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
        nlapiLogExecution( 'ERROR',  fx + ' 999 Error', errmsg);
	}
}

function eliminateDuplicates(arr) 
{
  var i,
      len=arr.length,
      out=[],
      obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

function resetAfterEndDate()
{
	try
	{
		var filters =	[ [ 'isinactive', 'is', 'F' ],
					'and',
					[ 'custentity_transfer_end_date', 'onorbefore','today' ],
					'and',
					[ 'custentity_is_transfered', 'is','T' ]];
	
		var col2 = new Array();
		col2[0] = new nlobjSearchColumn('internalid',null,null);
		col2[0].setSort(true);
		var partnerSearch = nlapiSearchRecord('partner', null, filters, col2);
		if(partnerSearch)
		{
			nlapiLogExecution('DEBUG', 'partnerSearch', 'partnerSearch : ' + partnerSearch.length);
			for(var i=0;i<partnerSearch.length;i++)
			{
				//var newIds = '';
				var record = nlapiLoadRecord(partnerSearch[i].getRecordType(),partnerSearch[i].getId());
				//var fromemployee = record.getFieldValue('custentity_transfer_from');
				//var ids = record.getFieldValues('custentity_transfer_subdivision');
				//var previousids = record.getFieldValues('custentity_previous_subdivision');
				//var mixedIds = record.getFieldValues('custentity_subdivision_ms');
				
				
				//var arr = getDeletedArray(ids,mixedIds);
				//nlapiLogExecution('DEBUG', 'mixedIds', 'mixedIds : ' + mixedIds+' ids '+ids+' previousids '+previousids);
				//if(arr)
				
					
				//record.setFieldValues('custentity_subdivision_ms',previousids);
				//record.setFieldValue('custentity_transfer_subdivision','');
				record.setFieldValue('custentity_transfer_date','');
				record.setFieldValue('custentity_transfer_end_date','');
				record.setFieldValue('custentity_is_transfered','F');
				record.setFieldValue('custentity_transfer_from','');
			
				
				var idds = nlapiSubmitRecord(record,false,false);
				
				//var fromPersonnel = nlapiLoadRecord(partnerSearch[i].getRecordType(),fromemployee);
				//fromPersonnel.setFieldValues('custentity_subdivision_ms',ids);
				//var fromidspers = nlapiSubmitRecord(fromPersonnel,false,false);
				
				nlapiLogExecution('DEBUG', record.getFieldValue('entityid'));
			}
			
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
        nlapiLogExecution( 'ERROR',  fx + ' 999 Error', errmsg);
	}
}

function getDeletedArray(fromArray,toArray)
{
	var finalArray = new Array();
	
	for(var ii=0; (toArray) && (ii < toArray.length) ; ii++)
	{
		var contains = false;
		var number = toArray[ii];
		for(var i = 0; fromArray && i < fromArray.length; i++) 
		{
			
			var no2 = fromArray[i];
			nlapiLogExecution( 'DEBUG',  'fromArray[i] ', 'fromArray[i] '+fromArray[i]+' number '+number+' no2 '+no2);
			if(no2 == number) 
			{
				
			   contains = true;
			}
		}
		nlapiLogExecution( 'DEBUG',  'contains', 'contains '+contains);
		if(contains == false)
		{
			finalArray.push(number);
		}
	}
	return finalArray;
}