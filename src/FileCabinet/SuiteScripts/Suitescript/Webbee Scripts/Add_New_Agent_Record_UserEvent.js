/*Summary
 * File-Name : Add_New_Agent_Record_UserEvent.js
 * Script Type : User Event
 * Client : HMS Consulting
 * Author : Pranjal Goyal
 * Date : 12th August 2016 
 */
var body  = '';
var author = 4276;
var subject = 'HMS Marketing Services ,';
var recipient = 'pranjal@webbee.biz';

function addAgentFormBeforeLoad(type, form, request)
{
	try
	{
	   if(type == 'create' || type == 'edit')
		{  
            form.addField('custpage_sel_agent','select','Select Agent').setDisplayType('disabled');    //custom17 62
            form.addField('custpage_email_of_agent','email','Agent-Email').setDisplayType('hidden');
		    form.addField('custpage_agentid_of_agent','text','Agent-Id').setDisplayType('hidden');
            form.addField('custpage_cellno_of_agent','phone','Agent-Mobile').setDisplayType('hidden');             
		}	    
	}
	catch(ex)
	{
		 body = 'Exception : '+ex+', Message : '+ex.message;
      	 nlapiLogExecution('DEBUG',body);
      	 nlapiSendEmail(author, recipient, subject, body);
	}  
}

function afterSubmit(type)
{
	try
	{
		var bsrId = nlapiGetFieldValue('custevent_crm_bsr_team');
		var recordType = nlapiGetRecordType();
		var id = nlapiGetRecordId();
		if(defValue(bsrId) != '')
	    {
			var bsrCal = nlapiLookupField('partner', bsrId, 'custentity_team_calendar');
			if(defValue(bsrCal) != '')
			nlapiSubmitField(recordType, id,'custevent_crm_team_calendar', bsrCal, true);
	    }		
	}
	catch(ex)
	{
		 body = 'Exception : '+ex+', Message : '+ex.message;
      	 nlapiLogExecution('DEBUG',body);
      	 nlapiSendEmail(author, recipient, subject, body);
	}  
}

function defValue(value)
{	
	try
	{ 
	    if(value == null || value == undefined || value == '')
	    value = '';	    
	    return value;
	}
	catch(ex)
	{
		 body = 'Exception : '+ex+', Message : '+ex.message;
      	 nlapiLogExecution('DEBUG',body);
      	 nlapiSendEmail(author, recipient, subject, body);
	}
}
