function updateNotes(type)
{
	try
	{
		if(type != 'delete')
		{
			var d1 = new Date();
			//nlapiLogExecution( 'DEBUG', 'd1',  d1);
			var time = (d1.getTime() + 3*3600*1000);
			var d = new Date(time);
			//nlapiLogExecution( 'DEBUG', 'd',  d);
			var today = nlapiDateToString(d, 'datetime');
			//nlapiLogExecution( 'DEBUG', 'today',  today);
			var newrecord = nlapiGetNewRecord();
			var newnote = newrecord.getFieldValue('custevent_new_note');
			var temptext = '';
			if(type == 'edit')
			{
				var oldrec = nlapiGetOldRecord();
				var oldambcheck = oldrec.getFieldValue('custevent_hms_abhi_sub_div_assign');
				var newambcheck = newrecord.getFieldValue('custevent_hms_abhi_sub_div_assign');
				nlapiLogExecution( 'DEBUG', 'newambcheck '+newambcheck,  'oldambcheck '+oldambcheck);
				if(newambcheck == 'T' && (oldambcheck == 'F'))
				{
					temptext = today+' Temporary Text ';
				}
			}
			if(newnote)
			{
				var oldnotes = newrecord.getFieldValue('custevent_bsr_assignment_note');
				if(oldnotes==null||oldnotes=='null'){
					oldnotes='';
				}
				newnote = today+' - '+newnote;
				if(temptext)
				{
					oldnotes = temptext+' '+newnote + '\n' +oldnotes;
				}
				else
				{
					oldnotes = newnote + '\n' + oldnotes;
				}	
				nlapiLogExecution( 'DEBUG', 'oldnotes ',  oldnotes);
				newrecord.setFieldValue('custevent_bsr_assignment_note', oldnotes);
				newrecord.setFieldValue('custevent_new_note', '');
			}
			else
			{
				var oldnotes = newrecord.getFieldValue('custevent_bsr_assignment_note');
				if(oldnotes==null||oldnotes=='null'){
					oldnotes='';
				}
				if(temptext)
				{
					if(oldnotes)
					{
						oldnotes = temptext+'\n' +oldnotes;
					}
					else
					{
						oldnotes = temptext;
					}
					
					nlapiLogExecution( 'DEBUG', 'oldnotes no new note ',  oldnotes);
					newrecord.setFieldValue('custevent_bsr_assignment_note', oldnotes);
					newrecord.setFieldValue('custevent_new_note', '');
				}
				
			}
			
			
		}
	}
	catch(e)
	{
		var err = '';
		if ( e instanceof nlobjError )
		{
			err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
		}
		else
		{
			err = 'Unexpected error: ' + e.toString();
		}			
		nlapiLogExecution( 'ERROR', 'Error while setting notes',  err);
	}
}


function getMessage(type)
{
	try
	{
		var recid = nlapiGetRecordId();
		var rectype = nlapiGetRecordType();
		var recordtype = nlapiGetFieldValue('recordtype');
		var subject = nlapiGetFieldValue('subject');
		var record = nlapiGetFieldValue('record');
		var transaction = nlapiGetFieldValue('transaction');
		var activity = nlapiGetFieldValue('activity');
		var entity = nlapiGetFieldValue('entity');
		var entitytype = nlapiGetFieldValue('entitytype');
		var author = nlapiGetFieldValue('author');
		nlapiLogExecution( 'DEBUG', 'recordtype '+recordtype+' record '+record,  'transaction '+transaction +' activity '+activity+' entity '+entity+' entitytype '+entitytype);
		if(activity)
		{
			var filter = [];
			filter.push(new nlobjSearchFilter('internalid',null,'anyof',activity));
			var searchid = nlapiSearchRecord('supportcase', 'customsearch335', filter, null);
			nlapiLogExecution( 'DEBUG', 'searchid ',searchid);
			if(searchid)
			{
				var record = nlapiLoadRecord('supportcase',activity);
				var newstatus = record.getFieldValue('status');
				nlapiLogExecution( 'DEBUG', 'newstatus ',newstatus);
				if(newstatus == 4 || newstatus == '4')
				{
					var assigned = record.getFieldValue('assigned');
					var sendto = '';
					if(assigned)
					{
						sendto = nlapiLookupField('employee',assigned,'email');
					}
					else
					{
						sendto = 'mlsinfo@hmsmarketingservices.com';
					}
					var records = {};
					   records['activity'] = activity;
						
					   
					   //nlapiSendEmail( 4018, sendto, 'Case reopened',  'case reopened' , 'mlsinfo@hmsmarketingservices.com', null, records );
					  var wfid = nlapiTriggerWorkflow('supportcase', activity, 'customworkflow29','workflowaction176');
					  var wfid = nlapiInitiateWorkflow('supportcase', activity, 'customworkflow29');
					  nlapiLogExecution( 'DEBUG', 'wfid ',wfid);
				}
			}
		}
	}
	catch(e)
	{
		var err = '';
		if ( e instanceof nlobjError )
		{
			err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
		}
		else
		{
			err = 'Unexpected error: ' + e.toString();
		}			
		nlapiLogExecution( 'ERROR', 'Error while setting notes',  err);
	}
}

