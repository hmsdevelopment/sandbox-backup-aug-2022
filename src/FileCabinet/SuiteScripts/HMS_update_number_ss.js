function updateNumber()
{
	try
	{
		var idused = '';
		var filters = new Array();
		var oldids = nlapiGetContext().getSetting('SCRIPT', 'custscript_skipids') || '';
		var newids = '';
		if(oldids)
		{
			newids = oldids.split(',');
		}
		filters.push( new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
		filters.push(new nlobjSearchFilter('status',null,'anyof',[5,'5']));
		//filters.push(new nlobjSearchFilter('lastmodifieddate',null,'on','today'));
		if(newids)
		filters.push(new nlobjSearchFilter('internalid',null,'noneof',newids));
		
		var columns = [];
		columns.push(new nlobjSearchColumn('internalid'));
		columns.push(new nlobjSearchColumn('custevent_hms_sms_message_id'));
		columns.push(new nlobjSearchColumn('custevent_builder_sales_rep_subd'));
		columns[0].setSort(true);
		finalresults = nlapiSearchRecord('supportcase', null,filters, columns);
		if(finalresults)
		{
			nlapiLogExecution( 'DEBUG',' finalresults ', finalresults.length);
			for(var i=0; i < finalresults.length; i++)
			{
				var recordid = finalresults[i].getId();	
				if(idused == '')
				{
					idused = recordid;
				}
				else
				{
					idused = idused+','+recordid;
				}
				var currentid = recordid;
				var messageid = finalresults[i].getValue('custevent_hms_sms_message_id');
				{
					var bsrID = finalresults[i].getValue('custevent_builder_sales_rep_subd');
					if(bsrID)
					{
						var bsrRecord = nlapiLoadRecord('partner', bsrID);
						var enable2waymessaging = bsrRecord.getFieldValue('custentity_enable_two_way_sms');
						nlapiLogExecution( 'DEBUG',' messageid '+ messageid, ' enable2waymessaging '+enable2waymessaging+' recordid '+recordid);
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
					else
					{
						if((messageid))
						{
							var needremoved = searchCase(messageid, currentid);
							nlapiLogExecution( 'DEBUG',' no bsrid so unblock number ', needremoved);
							if(needremoved == true)
							{
								updateLogin(messageid);
							}
						}
					}
				}
			}
			
			if(finalresults.length == 1000)
			{
				
				var params = {};
				params['custscript_skipids'] = idused;
				
				nlapiScheduleScript(nlapiGetContext().getScriptId(), nlapiGetContext().getDeploymentId(), params )
				
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
		finalresults1 = nlapiSearchRecord('supportcase', null,filters, columns);
		if(finalresults1)
		{
			var recordid = finalresults1[0].getId();
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

function findCurrentStatus()
{
	var filters = [];
	filters.push( new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
	filters.push(new nlobjSearchFilter('custrecord_hms_is_blocked',null,'is','T'));
	
	
	var columns = [];
	columns.push(new nlobjSearchColumn('internalid'));
	columns.push(new nlobjSearchColumn('custrecord_hms_support_ref'));
	columns[0].setSort(true);
	var finalresults = nlapiSearchRecord('customrecord_hms_magic_text_logins', null,filters, columns);
	if(finalresults)
	{
		nlapiLogExecution( 'DEBUG','finalresults', finalresults.length);
	for(var i=0; i < finalresults.length; i++)
	{	
		var recid = finalresults[i].getId();
		var supportid = finalresults[i].getValue('custrecord_hms_support_ref');
		if(supportid)
		{
			var status = nlapiLookupField('supportcase', supportid, 'status');
			nlapiLogExecution( 'DEBUG','status', status);
			if(status == '5' || status == 5)
			{
				nlapiSubmitField('customrecord_hms_magic_text_logins',recid, 'custrecord_hms_is_blocked', 'F' );
              nlapiSubmitField('customrecord_hms_magic_text_logins',recid, 'custrecord_hms_support_ref', '' );
			}
		}
		else
		{
			nlapiSubmitField('customrecord_hms_magic_text_logins',recid, 'custrecord_hms_is_blocked', 'F' );
            nlapiSubmitField('customrecord_hms_magic_text_logins',recid, 'custrecord_hms_support_ref', '' );
		}
	}
	}
}