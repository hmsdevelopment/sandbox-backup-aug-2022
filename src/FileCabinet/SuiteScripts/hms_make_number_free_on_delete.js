function makeNumberFree(type)
{
	try
	{
		var rectype = nlapiGetRecordType();
		if(rectype == 'supportcase')
		{
			if(type == 'delete')
			{
				var currentid = nlapiGetRecordId();
				var messageid = nlapiGetFieldValue('custevent_hms_sms_message_id');
				nlapiLogExecution( 'DEBUG',' messageid ', messageid);
				var bsrID = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
				var bsrRecord = nlapiLoadRecord('partner', bsrID);
				var enable2waymessaging = bsrRecord.getFieldValue('custentity_enable_two_way_sms');
				if((enable2waymessaging == 'T') && (messageid))
				{
					var needremoved = searchCase(messageid, currentid);
					nlapiLogExecution( 'DEBUG',' unblock number ', needremoved);
					if(needremoved == true)
					{
						updateLogin(messageid);
					}
				}
			}
			if(type != 'delete')
			{
				if(type != 'create')
				{
					var currentid = nlapiGetRecordId();
					var oldrecord = nlapiGetOldRecord();
					var oldstatus = '';
					if(oldrecord)
					{
						oldstatus = oldrecord.getFieldValue('status');
					}
					var newstatus = nlapiGetFieldValue('status');
					var messageid = nlapiGetFieldValue('custevent_hms_sms_message_id');
					if((oldstatus) && (newstatus == 5) && (oldstatus != 5))
					{
						var bsrID = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
						var bsrRecord = nlapiLoadRecord('partner', bsrID);
						var enable2waymessaging = bsrRecord.getFieldValue('custentity_enable_two_way_sms');
						if((enable2waymessaging == 'T') && (messageid))
						{
							var needremoved = searchCase(messageid, currentid);
							nlapiLogExecution( 'DEBUG',' unblock number ', needremoved);
							if(needremoved == true)
							{
								updateLogin(messageid);
							}
						}
					}
				}
				/*
				if(type == 'create')
				{
					var currentid = nlapiGetRecordId();
					var newstatus = nlapiGetFieldValue('status');
					var messageid = nlapiGetFieldValue('custevent_hms_sms_message_id');
					if((newstatus == 5))
					{
						var bsrID = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
						var bsrRecord = nlapiLoadRecord('partner', bsrID);
						var enable2waymessaging = bsrRecord.getFieldValue('custentity_enable_two_way_sms');
						if((enable2waymessaging == 'T') && (messageid))
						{
							var needremoved = searchCase(messageid, currentid);
							nlapiLogExecution( 'DEBUG',' unblock number ', needremoved);
							if(needremoved == true)
							{
								updateLogin(messageid);
							}
						}
					}
				}
				*/
			}
			
		}
		else if(rectype == 'phonecall')
		{
			
			var supportcaseid = nlapiGetFieldValue('supportcase');
			if(supportcaseid)
			{
				var newstatus = nlapiGetFieldValue('custevent_call_status');
				nlapiLogExecution( 'DEBUG',' newstatus ', newstatus);
				if(newstatus == 5 || newstatus == '5')
				{
					
					var supportrecord = nlapiLoadRecord('supportcase', supportcaseid);
					var messageid = supportrecord.getFieldValue('custevent_hms_sms_message_id');
					nlapiLogExecution( 'DEBUG',' messageid ', messageid);
					var bsrID = supportrecord.getFieldValue('custevent_builder_sales_rep_subd');
					var bsrRecord = nlapiLoadRecord('partner', bsrID);
					var enable2waymessaging = bsrRecord.getFieldValue('custentity_enable_two_way_sms');
					if((enable2waymessaging == 'T') && (messageid))
					{
						var needremoved = searchCase(messageid, supportcaseid);
						nlapiLogExecution( 'DEBUG',' unblock number ', needremoved);
						if(needremoved == true)
						{
							updateLogin(messageid);
						}
					}
					
				}
			}
		}
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
	}
}

function updateLogin(usernamei)
{
	var filters = [];
	filters.push( new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
	filters.push( new nlobjSearchFilter( 'custrecord_hms_magic_text_username', null, 'is', usernamei, null));
	
	
	var columns = [];
	columns.push(new nlobjSearchColumn('internalid'));	
	columns.push(new nlobjSearchColumn('custrecord_hms_magic_text_username'));	
	columns.push(new nlobjSearchColumn('custrecord_hms_magic_text_password'));	
	columns[0].setSort(false);
	var searchresults = nlapiSearchRecord('customrecord_hms_magic_text_logins', null, filters, columns);
	var assignedvalue = '';
	
	if(searchresults)
	{
		var searchlength = searchresults.length;
		//for(var i=0;i < searchlength;i++)
		{
			var searchid = searchresults[0].getId();
			var searchtype = searchresults[0].getRecordType();
			//username = searchresults[0].getValue('custrecord_hms_magic_text_username');
			//password = searchresults[0].getValue('custrecord_hms_magic_text_password');
			var loginrecord = nlapiLoadRecord(searchtype, searchid);
			loginrecord.setFieldValue('custrecord_hms_is_blocked','F');
            loginrecord.setFieldValue('custrecord_hms_support_ref','');
			var sid = nlapiSubmitRecord(loginrecord,true,true);
			nlapiLogExecution( 'DEBUG',   ' sid ', ' sid '+sid);
			
			
		}
	}

}


function searchCase(messageid, currentid)
{
	var idmatched = false;
	try
    {
		var filters = new Array();
	   
		filters.push( new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
		filters.push(new nlobjSearchFilter('custevent_hms_sms_message_id',null,'is',messageid));
		
		var columns = [];
		columns.push(new nlobjSearchColumn('internalid'));	
		columns[0].setSort(true);
		finalresults = nlapiSearchRecord('supportcase', null,filters, columns);
		if(finalresults)
		{
			var recordid = finalresults[0].getId();
			nlapiLogExecution( 'DEBUG',' recordid ', recordid+' currentid '+currentid);
			if(currentid == recordid)
			{
				idmatched = true;
			}
			
		}
		else
		{
			idmatched = false;
		}
           
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
	return idmatched;
}