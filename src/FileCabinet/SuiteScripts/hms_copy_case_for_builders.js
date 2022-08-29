function CopySupportCase(type)
{
	try
	{
	if(type == 'create')
	{
		var id = nlapiGetRecordId();
		var record = nlapiLoadRecord('supportcase',id);
		var builderids = record.getFieldValues('custevent_hms_copy_to_builder');
		var buildersubdivision = record.getFieldValue('company');
		nlapiLogExecution('AUDIT','builderids','builderids '+builderids);   
		if(builderids)
		{
		record.setFieldValues('custevent_hms_copy_to_ren1',builderids);
		}
		nlapiSubmitRecord(record,false,false);
		var copyids = '';
		for(var i in builderids)
		{
			var value = builderids[i];
			if(copyids == '')
			{
				copyids = value;
			}
			else
			{
				copyids = copyids + ',' +value;
			}
		
		}
		
		for(var i in builderids)
		{
			var value = builderids[i];
			nlapiLogExecution('AUDIT','value','value '+value+' i '+i);  
			if(value && (value != 'null'))
			{
				if(buildersubdivision != value)
				{
				var url = nlapiResolveURL('SUITELET','customscript_hms_copy_support','customdeploy_hms_copy_support',true);
				url = url+'&id='+id+'&value='+value+'&copyids='+copyids;
				nlapiRequestURL(url);
				/*
				var copyrecord = nlapiCopyRecord('supportcase',id);
				copyrecord.setFieldValue('company',value);
				var id1 = nlapiSubmitRecord(copyrecord,true,true);
				nlapiLogExecution('AUDIT','id1',id1); 
				*/
				}
			}
		}
		
	}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR','emessage ',e.message);      
	}
}

/*
function copyinquiry(request,response)
{
	var id = request.getParameter('id');
	var value = request.getParameter('value');
	nlapiLogExecution('AUDIT','id'+id+' value '+value); 
	var precord = nlapiLoadRecord('supportcase',id);
	var prevrecids = '';//precord.getFieldValues('custevent_hms_copy_to_ren1');
	var aids = [];
	for(var i1 in prevrecids)
	{
		var iidi = prevrecids[i1];
		aids.push(iidi);
	}
	nlapiLogExecution('AUDIT','prevrecids'+prevrecids,'aids '+aids);
	if(value && (value != 'null'))
	{
		var copyrecord = nlapiCopyRecord('supportcase',id);
		copyrecord.setFieldValue('company',value);
		var idvalues = copyrecord.getFieldValues('custevent_hms_copy_to_builder');
		var idvalues1 = '';
		var primarybsr = getPrimaryBSR(value);
		nlapiLogExecution('AUDIT','primarybsr'+primarybsr+' idvalues '+idvalues+' idvalues1 '+idvalues1); 
		copyrecord.setFieldValue('custevent_builder_sales_rep_subd',primarybsr);
		copyrecord.setFieldValue('custevent_hms_copy_to_builder','');
		//copyrecord.setFieldValues('custevent_hms_copy_to_ren1',aids);
		copyrecord.setFieldValue('custevent_ren_sent','F');
		copyrecord.setFieldValue('custevent_bsr_notify_sent','F');
		var id1 = nlapiSubmitRecord(copyrecord,true,true);
		nlapiLogExecution('AUDIT','id1',id1);      
	}
}

function getPrimaryBSR(value)
{
	var prmbsr = '';
	try
	{
		var filters = [];
		filters.push(new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
		filters.push(new nlobjSearchFilter( 'internalid', null, 'anyof', value, null));
		var columns = [];												
		columns.push(new nlobjSearchColumn('custentity_hms_sales_manager'));
		var searchresults = nlapiSearchRecord('customer', null,filters, columns);
		if(searchresults)
		{
			prmbsr = searchresults[0].getValue('custentity_hms_sales_manager');
		}
		
	}
	catch(e)
	{
		errmsg = '';
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
		nlapiLogExecution( 'ERROR',  ' 999 Error', errmsg);
	}
	return prmbsr;
}
*/

function optinpartner(request,response)
{
	var id = request.getParameter('id');
	nlapiLogExecution('AUDIT','id'+id); 
	try
	{
	
		if(id)
		{
			var record = nlapiLoadRecord('partner',id);
			record.setFieldValue('custentity_opt_out_builder_leads','F');
			var aid = nlapiSubmitRecord(record,false,false);
			nlapiLogExecution('AUDIT','aid'+aid); 
		}
	
	}
	catch(e)
	{
		nlapiLogExecution('ERROR','emessage ',e.message);      
	}
	nlapiLogExecution('AUDIT','pass till after catch'); 
	var html = '<html>'
	html += '<head><title>Success...</title></head>';
	html += '<body><form align="center"><div align="center"><span>Thank you, you will now receive notifications for web leads.</span><br>';
	html += '<input type="button" value="OK"  onclick="window.close();" />';
	html += '</div></form></body>';
	html += '</html>';
	response.write(html);
	

}

function successForm(request,response)
{
	nlapiLogExecution('AUDIT','pass till inside success form'); 
	var form = nlapiCreateForm("Success");
	var success=form.addField('success', 'text', 'Record Updated .',null);
		success.setDisplayType('inline');
		form.addButton('custpage_ok','OK','window.close();');
	
	response.writePage(form);
	nlapiLogExecution('AUDIT','pass  after form'); 
	
}


function failure(request,response)
{
	nlapiLogExecution('AUDIT','pass till inside success form'); 
	var form = nlapiCreateForm("Failure");
	var success=form.addField('success', 'text', 'Unable to find required value .',null);
		success.setDisplayType('inline');
		form.addButton('custpage_ok','OK','window.close();');
	
	response.writePage(form);
	nlapiLogExecution('AUDIT','pass  after form'); 
	
}

function optInReverse(request,response)
{
	var id = request.getParameter('recid');
	nlapiLogExecution('AUDIT','id '+id); 
	if(request.getMethod()=='GET')
	{
		try
		{
		
			if(id)
			{
				var record = nlapiLoadRecord('partner',id);
				var optoutrtan = record.getFieldValue('custentity_opt_out_rtan');
				
				if(optoutrtan == 'T')
				{
					optoutrtan = 'F';
				}
				else
				{
					optoutrtan = 'T';
				}
				var enabletext = record.getFieldValue('custentity_enable_two_way_sms');
				var fname = record.getFieldValue('firstname');
				var lname = record.getFieldValue('lastname');
				nlapiLogExecution('AUDIT','optoutrtan '+optoutrtan,' enabletext '+enabletext); 
				var form1 = nlapiCreateForm('Communication Preferences for ' + fname + ' ' + lname);
				//var optin = form1.addField('custpage_optin','checkbox','Enable Email Notifications',null,null);
				//optin.setDefaultValue(optoutrtan);
				var enabletext1 = form1.addField('custpage_enabletext','checkbox','Enable Two Way Texting',null,null);
				enabletext1.setDefaultValue(enabletext);
				
				var fnamefield = form1.addField('custpage_fname','text','First Name',null,null);
				fnamefield.setDefaultValue(fname);
				
				var lnamefield = form1.addField('custpage_lname','text','Last Name',null,null);
				lnamefield.setDefaultValue(lname);
				
				var email = record.getFieldValue('email');
				var emailfield = form1.addField('custpage_email','email','Email',null,null);
				emailfield.setDefaultValue(email);
				
				var mobilephone = record.getFieldValue('mobilephone');
				var mobilephonefield = form1.addField('custpage_mobilephone','phone','Phone',null,null);
				mobilephonefield.setDefaultValue(mobilephone);
				
				var altphone = record.getFieldValue('custentity_alternative_mobile_phone');
				var altphonefield = form1.addField('custpage_altphone','phone','Alternative Phone Number',null,null);
				altphonefield.setDefaultValue(altphone);
				
				
				var enabletext2 = form1.addField('custpage_recordid','text','Recordid',null,null);
				enabletext2.setDefaultValue(id);
				enabletext2.setDisplayType('hidden');
				form1.addSubmitButton('Submit');
				response.writePage( form1 ); 
				return;
			}
			else
			{
				failure(request,response);
			}
		
		}
		catch(e)
		{
			nlapiLogExecution('ERROR','emessage ',e.message);      
		}
		nlapiLogExecution('AUDIT','pass till after catch'); 
		
	}
	else
	{
		/*var optin = request.getParameter('custpage_optin') || '';	
		if(optin == 'T')
		{
			optin = 'F';
		}
		else
		{
			optin = 'T';
		}*/
		var enabletext = request.getParameter('custpage_enabletext') || 'F';	
		
		var recordid = request.getParameter('custpage_recordid') || '';	
		
		var firstname = request.getParameter('custpage_fname') || '';	
		var lastname = request.getParameter('custpage_lname') || '';	
		var emailid = request.getParameter('custpage_email') || '';	
		var mobilephone = request.getParameter('custpage_mobilephone') || '';	
		var altphoneno = request.getParameter('custpage_altphone') || '';	
		
		nlapiLogExecution('AUDIT','recordid '+recordid); 
		if(recordid)
		{
			var record = nlapiLoadRecord('partner',recordid);
			//record.setFieldValue('custentity_opt_out_rtan',optin);
			record.setFieldValue('custentity_enable_two_way_sms',enabletext);
			
			
			record.setFieldValue('firstname',firstname);
			record.setFieldValue('lastname',lastname);
			record.setFieldValue('email',emailid);
			record.setFieldValue('mobilephone',mobilephone);
			record.setFieldValue('custentity_alternative_mobile_phone',altphoneno);
			
			
			var iidi = nlapiSubmitRecord(record,false,false);
			nlapiLogExecution('AUDIT','iidi '+iidi); 
			var html = '<html>'
			html += '<head><title>Success...</title></head>';
			html += '<body><form align="center"><div align="center"><span>Thank you, your preferences have been updated.</span><br>';
			html += '<input type="button" value="OK"  onclick="window.close();" />';
			html += '</div></form></body>';
			html += '</html>';
			response.write(html);
			return;
		}
		else
		{
		}
		
		
		
		
	}

}






