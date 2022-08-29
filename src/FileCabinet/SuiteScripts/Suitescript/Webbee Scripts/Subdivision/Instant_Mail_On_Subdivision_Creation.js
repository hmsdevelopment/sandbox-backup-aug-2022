/*
Name                -   Instant_Mail_On_Subdivision_Creation.js
Script Type       -   User Event
Purpose            -   Send Instant Mail On Subdivision Creation
Company          -   WebBee-ESolutions-PVT-LTD.
Created By        -   PRANJAL GOYAL
Client                -   HMS Marketing Services
Date                  -   18th May 2016
*/


function sendInstantEmail(type)
{
	try
	{
		if(type == 'create')
		{

			 var recordType = nlapiGetRecordType();
			 var recordId = nlapiGetRecordId();
			 var bareBonesChecked = nlapiGetFieldValue('custrecord_entered_as_bare_bones');
			 
			 nlapiLogExecution('DEBUG', 'bareBonesChecked : '+bareBonesChecked);
		 
			 if(bareBonesChecked == 'T')
			 {
				     var empsCC = [];
				     
				     var filters = [];
				     filters.push(new nlobjSearchFilter('custentity_get_notified_of_subd_updates', null, 'is', 'T'));
				     filters.push(new nlobjSearchFilter('email', null, 'isnotempty'));
				     
				     var cols = [];
				     cols.push(new nlobjSearchColumn('email'));
				     
				     var empSearch = nlapiSearchRecord('employee', null, filters, cols);
				     
				     if(empSearch != null && empSearch.length > 0)
				    {
				    	 nlapiLogExecution('DEBUG', 'Total '+empSearch.length+' Employees Found ');
				    	 for(var i=0 ;i<empSearch.length ; i++)
				    		 {
				    		    var id = empSearch[i].getId();
				    		    var email = empSearch[i].getValue('email');
				    		    nlapiLogExecution('DEBUG', 'Employee Id : '+id , 'Email : '+email);
                                                    empsCC.push(email);
				    		 }
				    }	 
				     
					 var emailMerger = nlapiCreateEmailMerger(SubDiv_Instant); 
				        emailMerger.setCustomRecord(recordType, recordId);
					 var mergeResult = emailMerger.merge();
					 body = mergeResult.getBody(); 
			            
                                         if(empsCC != null && empsCC.length > 0)
					 nlapiSendEmail(author, empsCC, subject, body,null,recipient);	 
                                         else
                                         nlapiSendEmail(author,recipient, subject, body);	 
			    
			 }    
		}
		return true;
	}
	catch(ex)
	{
		 body =  'EXCEPTION : '+ex.name+'\n Function : sendInstantEmail,  '+'\n Message : '+ex.message;
	 	 nlapiSendEmail(author,recipient,subject,body);	
	}
}