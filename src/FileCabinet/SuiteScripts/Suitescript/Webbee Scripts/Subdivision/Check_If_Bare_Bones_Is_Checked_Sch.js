/*
Name                -   Check_If_Bare_Bones_Is_Checked_Sch.js
Script Type       -   Scheduled
Purpose            -   Send Scheduled Mails to notify Bare Bones has checked or not  
Company          -   WebBee-ESolutions-PVT-LTD.
Created By        -   PRANJAL GOYAL
Client                -   HMS Marketing Services
Date                  -   16th May 2016
*/
function ScheduleEmailNotification(type)
{
	try
	{  
		 var recordType = 'customrecord_subdivision';
	     var filters = [];
	     filters.push( new nlobjSearchFilter('id', null, 'greaterthanorequalto', '2771'));
	     
	     var recs = nlapiSearchRecord(recordType,null,filters);
        if(recs != null && recs.length > 0)
        {
            nlapiLogExecution('DEBUG', 'Total Subdiv Found : ', recs.length);
            for(var i=0 ;i<recs.length ; i++)
            {
            	     var recordId = recs[i].getId();
            	     
            	     var subdRec = nlapiLoadRecord(recordType,recordId);            	     
            	     var salesMgrEmail = checkIfNull(subdRec.getFieldValue('custrecord_sales_mgr_email'));
            	     var sudvName =  checkIfNull(subdRec.getFieldValue('custrecord_subdivision_id'));
            		 var isOnCalendar =checkIfNull(subdRec.getFieldValue('custrecord_is_this_subd_not_on_calendar'));         	     
            		 var isEnteredAsBarBones =checkIfNull(subdRec.getFieldValue('custrecord_entered_as_bare_bones'));   
            	    
            		  var createdtime = checkIfNull(subdRec.getFieldValue('created'));
            		  var createdDate = nlapiStringToDate(createdtime);
            		  var today = new Date();
            		       		 	  
            		  var time2 = today.getTime();
            	      var time1 = createdDate.getTime();
            	     var dateDiff = parseInt((time2-time1)/(24*3600*1000));
            	     var todayDate = today.getDate();

            nlapiLogExecution('DEBUG', 'dateDiff  : '+dateDiff +', todayDate  : '+todayDate+', recordId  : '+recordId);            	     

            	     if(dateDiff  % 30 == 0) //  10
            	     {	
                         body = '<b>Subdivision Name : </b>'+sudvName;
            	         if(isEnteredAsBarBones == 'T')
            	        {
            	        	     body += ', <br/> Bare bones is checked, please complete the subdivision';   
            	         }
            	         else
            	         {
            	        	   body += ',<br/> Please Check the Bare bones, to complete the subdivision'; 
            	          }
            		 	 nlapiSendEmail(author,'jmcdonald@hmsmarketingservices.com',subject,body,recipient[1]);	
            	     }
            	     if(todayDate == 20) // 16
         	    	{
         	        	  if(isOnCalendar == 'T') // on Calendar..
         	 				 emailMerger = nlapiCreateEmailMerger(SubDiv_Not_On_Calendar); //SubDiv_Not_On_Calendar
         	 		     else // not on Calendar ..
         	 		    	 emailMerger = nlapiCreateEmailMerger(SubDiv_On_Calendar); 	  
         	 		   
         	 		     emailMerger.setCustomRecord(recordType, recordId);
         	 			 mergeResult = emailMerger.merge();
         	 			 body = mergeResult.getBody();  	 	            
         	 		     nlapiSendEmail(author, 'jmcdonald@hmsmarketingservices.com', subject, body,recipient[1]);
         	    	}
            		  
            }
        }
   
  
	     
	}
	catch(ex)
	{
		 body =  'EXCEPTION : '+ex.name+'\n Function : ScheduleEmailNotification,  '+'\n Message : '+ex.message;
	 	 nlapiSendEmail(author,recipient[0],subject,body);	
		 nlapiLogExecution('DEBUG',body);
	}
}






