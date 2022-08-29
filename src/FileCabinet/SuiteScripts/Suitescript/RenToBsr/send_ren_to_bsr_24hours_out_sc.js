/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Jul 2017     Admin
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */

/*
 * Type: Schedule 
 * Script : Send REN to BSR (webbee) 24 hours out
 * ScriptUrl : https://1309901.app.netsuite.com/app/common/scripting/script.nl?id=225
 * Dependency : Crypto.js
 */


var body = '';
var author = 4276;
var subject = 'Error | HMS Marketing , REN SC';
var bcc = ['ratul@webbee.biz','aj@webbeeglobal.com'];


var tmpBODY = 76;
var tmpFOOTER = 77; 
var bsrTemplate = 82;
var SecretKey = nlapiLookupField('customrecord_auth_pass_phrase',1, 'custrecord_secret_key');
var propertyRecType = 'customrecord_property_record';
var date = new Date();

function sendRenToBSR24HoursOut()
{
	try{
	var hour = date.getHours();
	if(hour >= 18)
	{
		return;
	}
	else
	{   
		var BsrIds = [];
		var results = nlapiSearchRecord('supportcase', '350');//Refer to line 357 for search structure.
		
		for(var i=0; results != null && results.length > i; i++) {
			
			var bsr = results[i].getValue('custevent_builder_sales_rep_subd');
	   		  if(BsrIds.indexOf(bsr) == -1){
	   			BsrIds.push(bsr); 
	   		  }
		}
		nlapiLogExecution('Debug','BSR ids:',BsrIds);
		var linkCaseObj = {};
		var NLCaseIds = [];
		
        //put BSR id below for the test Appointment/Inquiry record .
		
		//BsrIds = [''];
		
		if(BsrIds != null && BsrIds.length > 0)
	    {		
		      var columns = new nlobjSearchColumn('custevent_linked_cases');				     				 	
		      for(var j=0; j<BsrIds.length; j++)
		 	  {
		      var filters = [];  //
		      filters.push(new nlobjSearchFilter('stage', null, 'is', 'OPEN'));
		      filters.push(new nlobjSearchFilter('createddate', null, "onorafter","11/1/2015 12:00 am"));
	   	      filters.push(new nlobjSearchFilter('custevent_builder_sales_rep_subd', null, 'is', BsrIds[j]));	
	   	      
			     var cSearch = nlapiSearchRecord('supportcase', null, filters, columns);		
		
			     if(cSearch != null && cSearch.length >0)
		    	 {
			    	 
			    	 for(var i=0; i<cSearch.length; i++)
			    	  {				
			    		   var caseId =  cSearch[i].getId();
			    		   var linkedCase = cSearch[i].getValue(columns);
			    		   if(linkedCase){
			    			   if(!linkCaseObj[linkedCase]){
			    				   linkCaseObj[linkedCase] = [];
			    			   }
			    			   linkCaseObj[linkedCase].push(caseId);
			    		   }
			    	       else{
			    	    	   if(NLCaseIds.indexOf(caseId) == -1){
			    	    		   NLCaseIds.push(caseId);
			    	    	   }
			    	       }
			    	       
			    	  }	 
			    	 
		    	 }		
		 	  }	
	    }
	    var LogBody = 'NLCaseIds : '+NLCaseIds+', linkCaseObj : '+JSON.stringify(linkCaseObj);	
	    nlapiLogExecution('DEBUG', ' Body : ',LogBody);	
	    for(var i=0; i<NLCaseIds.length ; i++){
	    	processRen([NLCaseIds[i]]);
	    }
	    
		for(var cases in linkCaseObj){
			processRen(linkCaseObj[cases]);
		}
		
	}
}catch(e){
	 nlapiLogExecution('DEBUG', ' err : ',e);	
}
}


function processRen(CaseIds){
	
	   CheckGovernance();
	    var file=nlapiLoadFile('39813');
		var data=file.getValue();
	    var emailSubject = '';
	    var emailMerger = nlapiCreateEmailMerger(97); 
	    emailMerger.setSupportCase(CaseIds[0]);
	    var mergeResult = emailMerger.merge();
       var emailBody = mergeResult.getBody();
       nlapiLogExecution('DEBUG', '206');
       var emailBody_table = '';
   	for(var i=0; i<CaseIds.length ; i++)
	    {        	   
   	   var SecretCode = SetPropertyForREN(CaseIds[i]);	
   	var emailMerger_table = nlapiCreateEmailMerger(98); 
	        emailMerger_table.setSupportCase(CaseIds[i]);
		    var mergeResult_table = emailMerger_table.merge();
		    var eBody = mergeResult_table.getBody()
   	eBody = eBody.replace('encryptId', defVal(SecretCode)); 
		    eBody=eBody.replace(/{/g, '<');
		    eBody=eBody.replace(/}/g, '>'); 
	 	emailBody_table+=eBody;
	 	
	 	CheckGovernance();
	    }
	    data=data.replace('{propertyrequested}',emailBody_table);
	    emailBody=emailBody.replace('propertyrequested',data);
   	nlapiLogExecution('DEBUG', '140');
		
		
		var record = nlapiLoadRecord('supportcase', CaseIds[0]);
		var id = record.getFieldValue('id');
		var builderSuppliedLead = record.getFieldValue('custevent_builder_lead');
		var category = record.getFieldValue('category');
		var showingDateTime = record.getFieldValue('custevent_showing_date_time');
		var lastEmailTime = record.getFieldValue('custevent_hms_last_ren_sent_date_time');
		var hoursSinceLastEmail = 1;
		var minutesSinceLastEmail = 1;
		if(lastEmailTime)
		{
			var convertLastEmailToDateObject = new Date(lastEmailTime);
			hoursSinceLastEmail = ((date.getTime() - convertLastEmailToDateObject.getTime())/3600000);
			minutesSinceLastEmail = hoursSinceLastEmail * 60;
			//nlapiLogExecution('DEBUG', 'Variables', 'hoursSinceLastEmail = ' + hoursSinceLastEmail);
		}
		
		var hoursUntilShowing = '';
		if(showingDateTime) {
			var convertToDateObject = new Date(showingDateTime);			
		    hoursUntilShowing = ((convertToDateObject.getTime() - date.getTime())/3600000);
		}
		
		var emailNotificationAttempts = record.getFieldValue('custevent_email_notification_attempts');
		nlapiLogExecution('Debug','emailNotificationAttempts before email',emailNotificationAttempts);
		var records = new Object();
		records['activity'] = id;

		
		if(emailNotificationAttempts > 2)
		{
			//This is where an email will get sent out to the 'assigned to' and mlsinfo@hmsmarketingservices.com
			var emailMerger = nlapiCreateEmailMerger(48);//48 is converted type of 22
			emailMerger.setSupportCase(id);
			var mergeResult = emailMerger.merge();
//			var emailBody = mergeResult.getBody();

			var assignedTo = record.getFieldValue('assigned');
			/*if(assignedTo)
			{
				var employeeRecord = nlapiLoadRecord('employee', assignedTo);
				var employeeEmail = employeeRecord.getFieldValue('email');
				nlapiSendEmail('3847', employeeEmail, 'Lead follow up required', emailBody, 'mlsinfo@hmsmarketingservices.com', null, records);
				return;
			}
			else
			{
				nlapiSendEmail('3847', 'mlsinfo@hmsmarketingservices.com', 'Lead follow up required', emailBody, null, null, records);
				return;
			}*/
		}
		
		if(hoursUntilShowing != '' && hoursUntilShowing > 24 && minutesSinceLastEmail > 30 && emailNotificationAttempts < 3)
		{   
			var imageurl='';
			nlapiLogExecution('DEBUG', 'Variables', 'Entered the main if statement on record ' + id);
			var statusID = record.getFieldValue('status');
			var propertyId = record.getFieldValue('custevent_property');
			var renSent = record.getFieldValue('custevent_ren_sent');
			var renEnabled = record.getFieldValue('custevent_ren_enabled');
			var topLevelBuilder = record.getFieldValue('custevent_builder');
			var subdivision = record.getFieldValue('custevent_subdivision_for_ren');
			var copyOnREN = null;
			var division = record.getFieldValue('company');
			try{
				var imageid=nlapiLookupField('customer',division,'image');
				if(!imageid){
					var builder_parent=nlapiLookupField('customer',division,'parent');
					imageid=nlapiLookupField('customer',builder_parent,'image');
					nlapiLogExecution('debug','builder_parent',builder_parent);
					image_file=nlapiLoadFile(imageid);
					imageurl=image_file.getURL();
				}else{
					var image_file=nlapiLoadFile(imageid);
				    imageurl=image_file.getURL();
				}
			}catch(ier){
				nlapiLogExecution('debug','err image',ier);
			}
			if(imageurl==''){
				imageurl='https://1309901.app.netsuite.com/core/media/media.nl?id=39790&amp;c=1309901&amp;h=48dbf824375dd894c511';
			}
			else{
				imageurl='https://1309901.app.netsuite.com'+imageurl;
			}
			nlapiLogExecution('debug','url',imageurl);
			emailBody=emailBody.replace('logoimage', imageurl);
			var copyOnRENDivision = '';
			var notificationMethod = '';
			var enableEmailNotification = '';
			
		    if (division) {
		    	 copyOnRENDivision = nlapiLookupField('customer', division,'custentity_copy_on_ren');
				 notificationMethod = nlapiLookupField('customer', division,'custentity_appt_notification_method');
				 enableEmailNotification = nlapiLookupField('customer', division,'custentity8');
		    }
			var showingAssist = record.getFieldValue('custevent_showing_assist');
			var agent = record.getFieldValue('custevent_caller_name');
			var bsrID = record.getFieldValue('custevent_builder_sales_rep_subd');
			var bsrOptOut = record.getFieldValue('custevent_bsr_opt_out');
			
			if(propertyId)
			{
				var lot = nlapiLookupField('customrecord_property_record',propertyId,'custrecord_lot_number');
			}
			
			var agentFullName = '';
			if(agent){
				var agentFirstName = nlapiLookupField('customrecord_agent', agent,'custrecord_agent_first_name');
				var agentLastName = nlapiLookupField('customrecord_agent', agent,'custrecord_agent_last_name');
				agentFullName = agentFirstName + ' ' + agentLastName;
			}else{
				agentFullName = record.getFieldValue('custevent_agent_for_ren');//AGENT NAME FOR REN..
			}
			
			var subject = "Reminder: New Inquiry From " + agentFullName + " For " + subdivision;
			if(defVal(lot) != ''){
				subject += " Lot " + lot;
			}
			
			var bsrEmail = '';
			if(bsrID){
				bsrEmail = nlapiLookupField('partner', bsrID,'email');
			}
			var cc = [];
			var salesManager = record.getFieldValue('custevent7');
			if(salesManager)
			{
				var salesManagerEmail = nlapiLookupField('partner', salesManager,'email');
				cc[0] = salesManagerEmail;
			}
			
			if(notificationMethod == '1' && enableEmailNotification == 'T')
			{
				if(statusID == '1' || statusID == '10' || statusID == '2' || statusID == '3') 
				{
					/*if(showingAssist == 'T')
					{
						var body = nlapiMergeRecord(20, 'supportcase', id);
						nlapiSendEmail('3847', bsrEmail, subject, body.getValue(), null, null, records);
					}
					
					else
					{*/
						//var body = nlapiMergeRecord(22, 'supportcase', id);
						
						nlapiLogExecution('DEBUG', 'Variables', 'Getting ready to send the email on record ' + id);
						

						nlapiLogExecution('Debug','bsrEmail',bsrEmail);
						var body = emailBody
						body=body.replace('bsrid', bsrID);
						nlapiLogExecution('Debug','cc',cc);
                        if(bsrEmail){
							nlapiSendEmail('3847', bsrEmail, subject, body, cc, null, records);
							emailNotificationAttempts++;	
							//nlapiSubmitField('supportcase', CaseIds[0],'custevent_email_notification_attempts',emailNotificationAttempts);
							//nlapiLogExecution('Debug','emailNotificationAttempts after email',emailNotificationAttempts);
						}else{
							nlapiLogExecution('Debug','BSRemail empty ',CaseIds[0]);
						}
					/*}*/
				}		
			}
		}else{
			nlapiLogExecution('Debug','Not applicable for REN:',CaseIds);
		}
	
}


function SetPropertyForREN(caseId)
{
	try
	{
	    var  PropertyId = 	 nlapiLookupField('supportcase', caseId,'custevent_property');
		if(defVal(PropertyId) != '')
		{
		    var encrypted = CryptoJS.AES.encrypt(PropertyId,SecretKey);
			var decrypted = CryptoJS.AES.decrypt(encrypted,SecretKey).toString(); 
			var houseNumber =  nlapiLookupField(propertyRecType, PropertyId,'custrecord_house_number');//house number
			var enableREN = nlapiLookupField(propertyRecType, PropertyId,'custrecord12.custentity_enable_ren');//builder division /enable ren
			var street = nlapiLookupField(propertyRecType, PropertyId,'custrecord31',true); //street text
			var fields = ['custevent_ren_enabled','custevent_property_for_ren'];// REN_ENABLED, PROPERTY FOR REN
	 		//nlapiSubmitField('supportcase',caseId, fields, [enableREN,houseNumber+' '+street], true);//set
	 		//nlapiSubmitField(propertyRecType, PropertyId, 'custrecord_secret_code', decrypted, true);
	 	    return decrypted;
		}
		return null;
	}
	catch(ex)
	{
		body = 'SetPropertyForREN : '+ex;
		body += ex.name+' : '+ex.message;
		nlapiSendEmail(author, bcc, subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);	
		return null;
	}
}



function defVal(value)
{	
	try
	{ 
	    if(value == null || value == undefined || value == 'undefined') 
	    value = '';
	    return value;
	}
	catch(ex)
	{
		body = 'defVal : '+ex;
		body += ex.name+' : '+ex.message;
		nlapiSendEmail(author, bcc, subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);
		return '';
	}
}

//Function CheckGovernance

function CheckGovernance() 
{
    try 
    {
        var currentContext = nlapiGetContext();
        if (currentContext.getRemainingUsage() < 100) 
        {
        	body = 'Remaining Usage :', currentContext.getRemainingUsage();
        	nlapiLogExecution('DEBUG',body);
            var state = nlapiYieldScript();
            if (state.status == 'FAILURE') 
            {
            	body =  'Failed to yield script, exiting:'+', Reason = ' + state.reason +' / Size = '+state.size;
            	nlapiLogExecution('DEBUG',body);
            }
            else if (state.status == 'RESUME')
            {
            	body =  'Resuming script because of : '+state.reason+'/ Size = '+state.size;
            	nlapiLogExecution('DEBUG',body);
            }
        }
    }
    catch (ex) 
    {
    	body =  'Exception : '+ex.name;
		body += '\n Function : CheckGovernance';
		body += '\n Message : '+ex.message;
		nlapiLogExecution('DEBUG',body);
		nlapiSendEmail(author,bcc,subject,body);
    }
}


//Search Used id:350
//var supportcaseSearch = nlapiSearchRecord("supportcase",null,
//		[
//		   ["stage","anyof","OPEN"], 
//		   "AND", 
//		   ["custevent_builder_sales_rep_subd.custentity_opt_out_rtan","is","F"], 
//		   "AND", 
//		   ["createddate","onorafter","11/1/2015 12:00 am"]
//		], 
//		[
//		   new nlobjSearchColumn("custevent_builder_sales_rep_subd",null,null)
//		]
//		);