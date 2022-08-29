/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record'],

function(record) {
    
    
    function OnSubmit(scriptContext) {
    	
    		try
    		{
    			
    			var ren1 = record.getValue({
    				fieldId:'custpage_rencheckbox'
    			})
    			
    			var sm1 = record.getValue({
    				fieldId:'custpage_salesmanager'
    					})
    			
    			var adm1 = record.getValue({
    				fieldId:'custpage_administrative'
    			})
    			
    			var bsrName = defValue(record.getValue({
    				fieldId:' custpage_bsr_for_ren'
    			}))
    			
    			var msgCount = Number(record.getValue({
    				fieldId:'custpage_total_emails_send'
    			}))
    			body = "This will also send a reminder for "+bsrName+"'s "+msgCount+" open inquiries for this agent.";	
    			if(ren1 == 'T' || sm1 == 'T' || adm1 == 'T')
    			{
    				alert(body)
    				return true;
    			}	
    			return false;	
    		}
    		catch(ex)
    		{
    			body = 'Exception : '+ex+', Message : '+ex.message;
    		  log.debug({title: 'Body : ',details: body});
    	      	alert(body);
    		}
    	
    }

	function defValue(value)
	{	
		try
		{ 
		    if(value == null || value == undefined  || value == 'undefined')
		    value = '';	    
		    return value;
		}
		catch(ex)
		{
		   body = 'defValue, Exception : '+ex+', Message : '+ex.message;
		   nlapiLogExecution('DEBUG', 'Body : ', body);
	       return '';
		}
	}

    return {
       
        saveRecord: OnSubmit
    };
    
});
