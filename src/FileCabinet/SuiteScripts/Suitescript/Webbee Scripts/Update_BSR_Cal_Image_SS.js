
var body  = '';
var author = -5;
var subject = 'HMS Marketing Services ,';
var recipient = 'pranjal@webbee.biz';

function updateBSRCalImage(type)
{
	try
	{
		var context = nlapiGetContext();
        var bsrId = defValue(context.getSetting('SCRIPT','custscript_bsrid'));
        var teamCal = defValue(context.getSetting('SCRIPT', 'custscript_bsrcal'));
        
        if(bsrId != '' && teamCal != '')
        {
        	var fromIndex = 0;
    		var toIndex = 500;
    		var totalApps = 0;
    		var appIds = []; 
    		
    		var filters = [];
    		filters[0] = new nlobjSearchFilter('custevent_crm_bsr_team', null, 'is', bsrId);
    		filters[1] = new nlobjSearchFilter('custevent_crm_team_calendar', null, 'noneof', teamCal);
    		
    		var columns = [];
    		columns[0] = new nlobjSearchColumn('internalid');
    		
    		var search = nlapiCreateSearch('supportcase', filters,columns);
    		var resultSet = search.runSearch();				
    		var results = resultSet.getResults(fromIndex	,toIndex);
    		while(results != null &&  results.length >0)
    		{			
    		    for(var i=0 ; i<results.length ; i++)
    		    {
    		    	var appId = results[i].getValue(columns[0]);
    		    	appIds.push(appId);
    		    	try
    		    	{
    		    	  nlapiSubmitField('supportcase', appId,'custevent_crm_team_calendar',teamCal, true);
    		    	}
    		    	catch(ex)
    		    	{
    		    		 body = 'Exception : '+ex+', Message : '+ex.message;
    		    		 body += 'For Updation Appointment : '+appId;
    		          	 nlapiLogExecution('DEBUG',body);
    		          	 nlapiSendEmail(author, recipient, subject, body);
    		    	}
    		    	 CheckGovernance();
    		    }	
    			
    		    fromIndex = toIndex;
    			toIndex += 500;
    			results = resultSet.getResults(fromIndex,toIndex);	
    			 CheckGovernance();
    		}	
    		totalApps += results.length;
    		body = 'Total Apps : '+totalApps;
    		body += 'bsrId : '+id+', CalImg : '+teamCal;
    		nlapiLogExecution('DEBUG',body,appIds);
        }	

	}
	catch(ex)
	{
		 body = 'Exception : '+ex+', Message : '+ex.message;
		 body += 'updateBSRCalImage ';
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

function CheckGovernance() 
{
    try 
    {
    	var context = nlapiGetContext();
  	   if(context.getRemainingUsage() <= 2000) 
  	   {
	  		var state = nlapiYieldScript();
            if (state.status == 'FAILURE') 
            {              	
             	nlapiLogExecution('ERROR', 'Failed to yield script, exiting:', 'Reason = ' + state.reason + ' / Size = ' + state.size);
		  		nlapiLogExecution('ERROR','Reschedule','Reschedule'); 		 
				nlapiScheduleScript(context.getScriptId(),context.getDeploymentId());
          }
          else if (state.status == 'RESUME')
          {
              nlapiLogExecution('DEBUG', 'Resuming script because of :', state.reason + '/ Size = ' + state.size);
          }	 
	  	 }//end of usage count if	
    }
    catch (ex) 
    {
    	body =  'Exception : '+ex.name;
		body += '\n Function : CheckGovernance';
		body += '\n Message : '+ex.message;
	    nlapiLogExecution('DEBUG','Body : ',body);	
	    nlapiSubmitField(grabber_rec_type,gId, 'custrecord_is_running', 'F');	
    }
}