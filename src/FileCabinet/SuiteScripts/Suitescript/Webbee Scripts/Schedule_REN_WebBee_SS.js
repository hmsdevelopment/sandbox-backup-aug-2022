/*
Name                -   Schedule_REN_WebBee_SS.js
Script Type       -   Scheduled
Purpose            -   Send REN to Primary BSR
Company          -   WebBee-ESolutions-PVT-LTD.
Created By        -   PRANJAL GOYAL
Client                -   HMS Marketing Services
Date                  -   15th November 2016
*/

var body = '';
var author = '-5';
var subject = 'HMS Marketing , REN Reminder';
var bcc = ['ratul@webbee.biz', 'aj@webbeeglobal.com'];
var deployIds = ['customdeploy_procs_resend_ren_every_hour','customdeploy_procs_ren_every_24_hour'];
var cFields = ['custevent_property','custevent_email_notification_attempts'];

var tmpBODY = 76;
var tmpFOOTER = 77; 
var bsrTemplate = 82;
var smTemplate = 74;
var callCenter = 3847;

var today = new Date();
var hours = today.getHours();
var time = today.getTime();
var fromIndex = 0;
var toIndex = 500;

var filters = [];
filters.push(new nlobjSearchFilter('createddate', null, 'onorafter', '11/1/2016')); 
filters.push(new nlobjSearchFilter('stage', null, 'is', 'OPEN'));
filters.push(new nlobjSearchFilter('custevent_bsr_opt_out', null, 'is', 'F'));


var columns = [];
columns.push(new nlobjSearchColumn('category')); //0
columns.push(new nlobjSearchColumn('status')); //1
columns.push(new nlobjSearchColumn('company')); //2
columns.push(new nlobjSearchColumn('custevent_showing_date_time')); //3
columns.push(new nlobjSearchColumn('custevent_hms_last_ren_sent_date_time'));//4
columns.push(new nlobjSearchColumn('custevent_builder_lead'));//5
columns.push(new nlobjSearchColumn('custevent_email_notification_attempts'));//6
columns.push(new nlobjSearchColumn('custevent_property'));//7
columns.push(new nlobjSearchColumn('custevent_caller_name'));//8
columns.push(new nlobjSearchColumn('custevent_builder_sales_rep_subd'));//9
columns.push(new nlobjSearchColumn('custevent_bsr_opt_out'));//10
columns.push(new nlobjSearchColumn('custevent_ren_sent'));//11
columns.push(new nlobjSearchColumn('custevent_ren_enabled'));//12
columns.push(new nlobjSearchColumn('custevent_builder'));//13
columns.push(new nlobjSearchColumn('custevent_subdivision_for_ren'));//14
columns.push(new nlobjSearchColumn('email','custevent7'));//15
columns.push(new nlobjSearchColumn('email','custevent_builder_sales_rep_subd'));//16
columns.push(new nlobjSearchColumn('custentity_appt_notification_method','customer'));//17
columns.push(new nlobjSearchColumn('custentity8','customer'));//18
columns.push(new nlobjSearchColumn('custrecord_house_number','custevent_property'));//19
columns.push(new nlobjSearchColumn('custrecord31','custevent_property'));//20
columns.push(new nlobjSearchColumn('custrecord_lot_number','custevent_property'));//21
columns.push(new nlobjSearchColumn('custevent_agent_for_ren'));//22
columns.push(new nlobjSearchColumn('custevent_linked_cases'));//23
columns.push(new nlobjSearchColumn('company'));//24

var delpoymentID = nlapiGetContext().getDeploymentId();
var SecretKey = nlapiLookupField('customrecord_auth_pass_phrase',1, 'custrecord_secret_key');

var MCaseIds = [];

function ScheduleREN() 
{
  try
  {
    if(hours < 18)
   {
	   var Search = nlapiCreateSearch('supportcase', filters, columns);
	   var resultSet = Search.runSearch();				
	   var results = resultSet.getResults(fromIndex,toIndex);	
	   nlapiLogExecution('DEBUG', ' Results Supportcase : ',JSON.stringify(results));
	   while(results != null && results.length > 0)
	   {
	     body = fromIndex+' to '+toIndex+' '+results.length+' results found ';
		 nlapiLogExecution('DEBUG', ' Body : ',body);	
		 for(var i=0 ; i<results.length ; i++)
		 {
			var CaseId = results[i].getId();	
			if(MCaseIds.indexOf(CaseId) < 0)
			{   
                var builderDivision = results[i].getValue(columns[24]);//(Testing)from company 
                nlapiLogExecution('Debug','builder div',builderDivision);
				var builderSuppliedLead = results[i].getValue(columns[5]);
				var totalAttempts = results[i].getValue(columns[6]);
				var category =results[i].getValue(columns[0]);
				var showingDateTime = results[i].getValue(columns[3]);
				var lastEmailTime = results[i].getValue(columns[4]);
				var statusID =  results[i].getValue(columns[1]);
				var propertyId =  results[i].getValue(columns[7]);
				var subdivision = results[i].getValue(columns[14]);				
				var division = results[i].getValue(columns[2]);			
				var notificationMethod = results[i].getValue(columns[17]);	
				var enableEmailNotification = results[i].getValue(columns[18]);	
				var agent =  results[i].getValue(columns[8]);
				var bsrID = results[i].getValue(columns[9]);
				var bsrEmail = results[i].getValue(columns[16]);	
				var LinkedCaseId = results[i].getValue(columns[23]);	
				var houseNumber = results[i].getValue(columns[19]);
				var street = results[i].getText(columns[20]);
				var lot = results[i].getValue(columns[21]);
				var FullName = defVal(results[i].getValue(columns[22]));
				var SMEmail = defVal(results[i].getValue(columns[15]));
				var records = new Object();
				records['activity'] = CaseId;
							
				var emailSubject = 'Reminder: New Inquiry From '+FullName;
				emailSubject += ' For '+subdivision+' Lot '+lot;
				
				var emailMerger = nlapiCreateEmailMerger(bsrTemplate);
				emailMerger.setSupportCase(CaseId);
				var mergeResult = emailMerger.merge();
				var emailHeader = mergeResult.getBody();
				    			
				emailMerger = nlapiCreateEmailMerger(tmpFOOTER); 
			    emailMerger.setSupportCase(CaseId);
				mergeResult = emailMerger.merge();
				var emailFooter = mergeResult.getBody();
				 					
				var hoursSinceLastEmail = 1;
				var minutesSinceLastEmail = 1;
				var hoursUntilShowing = 0;
					
				if(defVal(lastEmailTime) != '')
				{
					var lastDate = new Date(lastEmailTime);
					var lastTime = lastDate.getTime();
					hoursSinceLastEmail = ((time - lastTime)/3600000).toFixed(2);
					minutesSinceLastEmail = (hoursSinceLastEmail * 60).toFixed(2);
				}		
				
			if(defVal(showingDateTime) != '')
			{
			   var currDate = new Date(showingDateTime);	
			   var currTime = currDate.getTime();
			   hoursUntilShowing = ((time - currTime)/3600000).toFixed(2);
			}
					
			var toProcess = false;
			var condition1 = ((hoursUntilShowing < 24 && hoursUntilShowing > 2) || builderSuppliedLead == 'T' || category == '1') && minutesSinceLastEmail > 30;	                
			var condition2 = hoursUntilShowing > 24 && minutesSinceLastEmail > 30 && totalAttempts < 3;

	        if(delpoymentID == deployIds[0]) // every 1 hour
	        toProcess = condition1;
	        if(delpoymentID == deployIds[1]) // every 24 hour
	        toProcess = condition2;	

			if(toProcess && notificationMethod == '1' && enableEmailNotification == 'T')
			{
				var CaseIds = [];
				if(defVal(LinkedCaseId) != '' && defVal(bsrID) != '' )
				{
					 var filters1 = [];
				     filters1.push(new nlobjSearchFilter('custevent_builder_sales_rep_subd', null, 'is', bsrID));				     
				     filters1.push(new nlobjSearchFilter('custevent_linked_cases', null, 'is', LinkedCaseId));		
				     		     
					 var cSearch = nlapiSearchRecord('supportcase', null, filters1);
					 if(cSearch != null && cSearch.length >0)
					 {
						 for(var ii=0; ii<cSearch.length ; ii++)
						 CaseIds.push(cSearch[ii].getId());	   
					 }
				}	
		    else
		    CaseIds.push(CaseId);	
				
			 if(CaseIds.length > 0)
			 {			
				  var emailBody = '';
				  for(var j=0; j<CaseIds.length ; j++)
				  {			  
					  var cInfo =  nlapiLookupField('supportcase',CaseIds[j], cFields);
					  var totalAttemp = Number(cInfo.custevent_email_notification_attempts)+1;
					  var PropertyId = cInfo.custevent_property;	   
					  var decrypted  = '';					  
					   if(defVal(PropertyId) != '')
	   				    {
	   					    var encrypted = CryptoJS.AES.encrypt(PropertyId,SecretKey);
	                		decrypted = CryptoJS.AES.decrypt(encrypted,SecretKey).toString();
                            if(builderDivision == '3643' || builderDivision == '3642'){
                              nlapiSubmitField('customrecord_property_record', PropertyId, 'custrecord_secret_code', decrypted, true);
                            }
	            		    
	   				    }	
						  emailMerger = nlapiCreateEmailMerger(tmpBODY); // Body Email..
						  emailMerger.setSupportCase(CaseIds[j]);
						  mergeResult = emailMerger.merge();
						  var eBody = mergeResult.getBody();
	       				  eBody = eBody.replace('encryptId', decrypted); 
	       				  emailBody += eBody;   		
					      if(builderDivision == '3643' || builderDivision == '3642'){
                            nlapiSubmitField('supportcase', CaseIds[j], cFields[1],totalAttemp, true);
                          }
                           
	       				  if(MCaseIds.indexOf(CaseIds[j]) < 0)
	       				  MCaseIds.push(CaseIds[j]);  
				   }	
					body = ' Resent REN to Cases : '+CaseIds;
					nlapiLogExecution('DEBUG', ' Body : ',body);	
					
				    emailBody = emailHeader+emailBody+emailFooter;
				   // nlapiSendEmail(callCenter,bcc,emailSubject,emailBody);
				   //
                    if(builderDivision == '3643' || builderDivision == '3642'){
                      nlapiSendEmail(callCenter,bsrEmail,emailSubject,emailBody,SMEmail,bcc,records);
                      nlapiLogExecution('Debug','Email sent for builderDivision',builderDivision);
                    }
				    
			      }		// if Cases Exist		
			  }// if to Process
			}	// Already Emailed		
		}// loop ends here	
		fromIndex = toIndex;
		toIndex += 500;
	    results = resultSet.getResults(fromIndex,toIndex);	
	   }	// Search has data 
		nlapiLogExecution('DEBUG', 'MCaseIds : '+MCaseIds);
	 }	 // time is before 6:00 pm 
  }
  catch(ex)
 {
	body = 'ScheduleREN : '+ex;
	body += ex.name+' : '+ex.message;
	nlapiSendEmail(author,bcc[0], subject, body);
	nlapiLogExecution('DEBUG', ' Body : ',body);	
 }
}


function defVal(value)
{	
	try
	{ 
	    if(value == null || value == undefined) 
	    value = '';
	    return value;
	}
	catch(ex)
	{
		body = 'defVal : '+ex;
		body += ex.name+' : '+ex.message;
		nlapiSendEmail(author, bcc[0], subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);	
        return '';
	}
}

