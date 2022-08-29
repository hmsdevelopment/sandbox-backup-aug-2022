// Date : 11th November 2016 
// Modified : 8th May 2017
// HMS_ReSend_REN_SL_CS_UE_WebBee.js

var body = '';
var tmpBODY = 76;
var tmpFOOTER = 77; 
var bsrTemplate = 82;
var smTemplate = 74;
var author = 4276;
var subject = 'HMS Marketing , Resending REN';
var bcc = 'pranjal@webbee.biz';
var cc1 = 'aj@webbeeglobal.com';
var cc = '';
var callCenter = 3847;
var url = nlapiResolveURL('SUITELET', 204, 1);
var SecretKey = nlapiLookupField('customrecord_auth_pass_phrase',1, 'custrecord_secret_key'); 

function ResendREN(type,form,request)
{
	try
	{
		if(type == 'view')
		{
			var surl = 'https://1309901.app.netsuite.com'+url+'&recordid='+nlapiGetRecordId();
			var script = 'window.open(\''+surl+'\',\'_blank\')';
			form.addButton('custpage_email_ren_tran','Resend Inquiry Emails...',script);
		}
	}
	  catch(ex)
	   {
		  body = 'Exception ,sendRenTran  ';
		  body +='Name : '+ex.name+', Message : '+ex.message;
		  nlapiLogExecution('DEBUG', 'Body : ', body);
		  nlapiSendEmail(author,bcc, subject, body);
	   }
}


function OnSubmit()
{
	try
	{
		var ren1 = nlapiGetFieldValue('custpage_rencheckbox');
		var sm1 = nlapiGetFieldValue('custpage_salesmanager');
		var adm1 = nlapiGetFieldValue('custpage_administrative');
		var bsrName =  defValue(nlapiGetFieldValue('custpage_bsr_for_ren'));
		var msgCount = Number(nlapiGetFieldValue('custpage_total_emails_send'));
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
		nlapiLogExecution('DEBUG', 'Body : ', body);
      	alert(body);
	}
}

function CreateRENPage(request,response)
{
	try
    {
		if(request.getMethod() == 'GET')
		{
			var recordid = request.getParameter('recordid');
			var ren = nlapiCreateForm('Resend Inquiry Emails To:');
			var ren0 = ren.addField('custpage_recordid', 'text', 'support');
			ren0.setDefaultValue(recordid);
			ren0.setDisplayType('hidden');
			
			var ren01 = ren.addField('custpage_total_emails_send', 'text', 'Email Notification Attempts');
			ren01.setDisplayType('hidden');
			
			var ren02 = ren.addField('custpage_bsr_for_ren', 'text', 'BSR Name');
			ren02.setDisplayType('hidden');
			
			if(defValue(recordid) != '')
			{
				var appointmentrec = nlapiLoadRecord('supportcase', recordid);
				var primaryBsr = appointmentrec.getFieldValue('custevent_builder_sales_rep_subd');
				var salesManager = appointmentrec.getFieldValue('custevent7');
				var adminContact = appointmentrec.getFieldValue('custevent_admin_contact');
				var bsrName = appointmentrec.getFieldValue('custevent_bsr_for_ren');		
				var salesmanagerEmail = appointmentrec.getFieldValue('custevent_sales_mgr_email');
				var linkedCaseId = appointmentrec.getFieldValue('custevent_linked_cases');
				var salesManagerName = '';
				var adminContactEmail = '';
				var totalMailSent = 1;
				var adminName = '';
				var optren = '';
				var optrtan = '';
				var bsremail = '';
				var gotren = 'F';
							
				if(defValue(linkedCaseId) != '' && defValue(primaryBsr) != '')
				{
					var filters = [];
		            filters[0] = new nlobjSearchFilter('custevent_linked_cases', null, 'is',linkedCaseId);
		            filters[1] = new nlobjSearchFilter('custevent_builder_sales_rep_subd', null, 'is', primaryBsr);   
		            var cSearch = nlapiSearchRecord('supportcase', null, filters);		
		            if(cSearch != null && cSearch.length >0)
		            totalMailSent = cSearch.length;
				}
					
				ren01.setDefaultValue(totalMailSent);
				ren02.setDefaultValue(bsrName);
				
				if(defValue(salesManager) != '')
				{
					var smInfo = nlapiLookupField('partner', salesManager, ['firstname','lastname']); 
					salesManagerName = smInfo.firstname+' '+smInfo.lastname;
				}
				
				if(defValue(adminContact) != '')
				{
					var adminInfo = nlapiLookupField('partner', adminContact, ['firstname','lastname','email']); 
					adminName = adminInfo.firstname+' '+adminInfo.lastname;
					adminContactEmail = adminInfo.email;
				}
				
				if(defValue(primaryBsr) != '')
				{
					var fields = ['email','custentity_opt_opt_ren','custentity_opt_out_rtan'];
					var bpfields = nlapiLookupField('partner',primaryBsr,fields);
					//optren = bpfields.custentity_opt_opt_ren;
					optrtan = bpfields.custentity_opt_out_rtan;
					bsremail = bpfields.email;
				}
				if(optrtan == 'F')  // (optren == 'F' || optrtan == 'F')
				gotren = 'T';
				
				var ren1 = ren.addField('custpage_rencheckbox', 'checkbox', 'Resend to Builder Sales Rep:' + ' ' + bsrName);
				var ren2 = ren.addField('custpage_renemail', 'email', 'BSR Email');
				ren2.setDefaultValue(bsremail);
				ren2.setDisplayType('hidden');
				/*if(optren == gotren)
				{
					ren1.setDisplayType('disabled');
					ren2.setDisplayType('disabled');
				}*/			
				var ren5 = ren.addField('custpage_salesmanager', 'checkbox', 'Resend to Sales Manager:' + ' ' + salesManagerName);
				var ren6 = ren.addField('custpage_salesmanageremail', 'email', 'Sales Manager Email');
				ren6.setDefaultValue(salesmanagerEmail);
				ren6.setDisplayType('hidden');
				var ren7 = ren.addField('custpage_administrative', 'checkbox', 'Resend to Division Coordinator:' + ' ' + adminName);
				var ren8 = ren.addField('custpage_administrativeemail', 'email', 'Division Coordinator Email');
				ren8.setDefaultValue(adminContactEmail);
				ren8.setDisplayType('hidden');
				ren.addSubmitButton('Send Emails');
				ren.setScript(201);  
			}
			response.writePage(ren);			
		}
		else
		{
				var ren1 = request.getParameter('custpage_rencheckbox')|| 'F';
				var renemail = request.getParameter('custpage_renemail');						
				var sm1 = request.getParameter('custpage_salesmanager')|| 'F';
				var smemail = request.getParameter('custpage_salesmanageremail');			
				var adm1 = request.getParameter('custpage_administrative')|| 'F';
				var admemail = request.getParameter('custpage_administrativeemail');
				var CaseId = request.getParameter('custpage_recordid');
				
				body = 'params ren1 '+ren1+', renemail '+renemail+', sm1 '+sm1;
				body += ', smemail '+smemail+', adm1 '+adm1+', admemail '+admemail+', CaseId '+CaseId;
			//	nlapiLogExecution('DEBUG', 'Body : ', body);
				
				if(defValue(CaseId) != '')
				{
					var supportcase = nlapiLoadRecord('supportcase',CaseId);		
					var agentFullName = supportcase.getFieldValue('custevent_agent_for_ren');
					var subdivision = supportcase.getFieldValue('custevent_subdivision_for_ren');	
					var propertyId = supportcase.getFieldValue('custevent_property');
					var linkedCaseId = supportcase.getFieldValue('custevent_linked_cases');
					var primaryBsr = supportcase.getFieldValue('custevent_builder_sales_rep_subd');
					var emailSubject = "Re-sending : New Inquiry From "+agentFullName+" For "+subdivision;
					var needupdate1 = false;
					var emailBody = '';
					
					
					var callerType=supportcase.getFieldValue('custevent_caller_type');
					var division =  supportcase.getFieldValue('company');
					var bsr_email={};
					nlapiLogExecution('DEBUG', '301',division);
					try{
					if(callerType=='10'||callerType=='3'){
						var bsrTobeNotified=nlapiLookupField('customer', division, 'custentity_copy_appt_insp_req');
						nlapiLogExecution('DEBUG', 'bsrTobeNotified',bsrTobeNotified);
						var arr=[];
						arr=bsrTobeNotified.split(',');
						nlapiLogExecution('DEBUG', 'arr',arr.length);
						for(var z=0;z<arr.length;z++){
							var b_mail=nlapiLookupField('partner', arr[z], 'email');
							bsr_email[arr[z]]=b_mail;
						}
					}}catch(eb){
						bsr_email={};
						nlapiLogExecution('DEBUG', 'eb',eb);
					}
					  var imageurl='';
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
						
						
			       var emailMerger = nlapiCreateEmailMerger(tmpFOOTER); // Footer Email..
				   emailMerger.setSupportCase(CaseId);
				   var mergeResult = emailMerger.merge();
			       var emailFooter = mergeResult.getBody();
				   var CaseIds = [];
					
			       	var filters = [];
		            filters[0] = new nlobjSearchFilter('internalid', null, 'is',CaseId);
		            
		            var columns = new nlobjSearchColumn('custevent_property');
					
					if(defValue(linkedCaseId) != '' && defValue(primaryBsr) != '')
					{
			            filters[0] = new nlobjSearchFilter('custevent_linked_cases', null, 'is',linkedCaseId);
			            filters[1] = new nlobjSearchFilter('custevent_builder_sales_rep_subd', null, 'is', primaryBsr);   
					}
		            var cSearch = nlapiSearchRecord('supportcase', null, filters,columns);		
		            if(cSearch != null && cSearch.length >0)
		            {
		            	  var file=nlapiLoadFile('39813');
		        			var data=file.getValue();
		        		    var emailMerger = nlapiCreateEmailMerger(97); 
		        		    emailMerger.setSupportCase(CaseId);
		        		    var mergeResult = emailMerger.merge();
		        	        var emailBody = mergeResult.getBody();
		        	        nlapiLogExecution('DEBUG', '206');
		        	        var emailBody_table = '';
		            	for(var i=0; i<cSearch.length; i++)
	            	    {
	            	    	var PropertyId = cSearch[i].getValue(columns);
	            	    	var CaseIId = cSearch[i].getId();
	            	    	var decrypted  = '';
	                     	CaseIds.push(CaseIId);		
		                	var emailMerger_table = nlapiCreateEmailMerger(98); 
		           	        emailMerger_table.setSupportCase(CaseIId);
		           		    var mergeResult_table = emailMerger_table.merge();
		           		    var eBody = mergeResult_table.getBody()
	       				    if(defValue(PropertyId) != '')
	       				    {
	       					    var encrypted = CryptoJS.AES.encrypt(PropertyId,SecretKey);
		                		decrypted = CryptoJS.AES.decrypt(encrypted,SecretKey).toString();  
	                		     nlapiSubmitField('customrecord_property_record', PropertyId, 'custrecord_secret_code', decrypted, true);
	       				    }	
	       	        	  
		                	eBody = eBody.replace('encryptId', decrypted); 
		           		    eBody=eBody.replace(/{/g, '<');
		           		    eBody=eBody.replace(/}/g, '>'); 
		             	 	emailBody_table+=eBody;
		             	 	     				         
	            	    }	
	        		    data=data.replace('{propertyrequested}',emailBody_table);
	        		    emailBody=emailBody.replace('propertyrequested',data);
	        		    emailBody=emailBody.replace('logoimage', imageurl);
		            }		
				  if(CaseIds.length > 0)
				  {		
		 			   var records =  new Object();
		 			   records['activity'] = CaseId;	
		 			   
						if(defValue(propertyId) != '')
						{
							var fields = ['custrecord_house_number','custrecord_lot_number'];
							var propertyInfo = nlapiLookupField('customrecord_property_record', propertyId, fields);
							var houseNumber = propertyInfo.custrecord_house_number;
							var lot = propertyInfo.custrecord_lot_number;
							emailSubject +=lot+' '+houseNumber;	
						}		
					   if(ren1 == 'T')
					   {					
							body = emailBody
							body=body.replace('bsrid', primaryBsr);
//							nlapiSendEmail(callCenter,'govind@webbee.biz',emailSubject,body);
							if(defValue(renemail) != '')
							{		
								nlapiSendEmail(callCenter, renemail, emailSubject, body, null,null, records);		

								for(var bm in bsr_email){
				            		var t_body=emailBody;
				            		var bsr_nsid=bm;
				            		bsr_mail_id=bsr_email[bm];
				            		t_body=t_body.replace('bsrid', bsr_nsid);
//				            		nlapiSendEmail(callCenter,'govind@webbee.biz',emailSubject,t_body);
				                    nlapiSendEmail(callCenter, bsr_mail_id, emailSubject, t_body, null,null, records, null,true);

				            	}
							
							//	nlapiSendEmail(callCenter,bcc, emailSubject, emailBody1,null,null, records);		
								needupdate1 = true;	
							}
					   }	
					 if(sm1 == 'T' || adm1 == 'T')
					 {

							emailMerger = nlapiCreateEmailMerger(99); //smTemplate
							emailMerger.setSupportCase(CaseIds[0]);
							var mergeResult = emailMerger.merge();
							var emailbody_nl = mergeResult.getBody();
							emailbody_nl=emailbody_nl.replace('propertyrequested',data);
			                emailbody_nl=emailbody_nl.replace('logoimage',imageurl);
				        var CC = [];
				    	if(sm1 == 'T' && defValue(smemail) != '')
				    	CC.push(smemail);	
				    	
				    	if(adm1 == 'T' && defValue(admemail) != '')
					    CC.push(admemail);	
					        
						if(CC.length > 0)
						{				
				        	nlapiSendEmail(callCenter, CC, emailSubject, emailbody_nl, null,null, records);		
							//nlapiSendEmail(callCenter,bcc,emailSubject, emailBody1,null, null, records);	
							needupdate1 = true;
						}	
					 }	
					if(needupdate1)
					{
						 var currenttime = nlapiDateToString( new Date(),'datetimetz');
						 var fields = ['custevent_email_notification_attempts','custevent_hms_last_ren_sent_date_time'];					
						 for(var j=0; j<CaseIds.length ; j++)
						 nlapiSubmitField('supportcase', CaseIds[j], fields[1],currenttime, true);
						 body = 'Cases : '+CaseIds+' REN Email Resent';
						 nlapiLogExecution('DEBUG', 'Body : ', body);
					}	
					 SuccessForm(response);			
				  }	  // if cases exist		
			}						
	    }
    }	
	catch(ex)
	{
	   body = 'CreateRENPage, Exception : '+ex+', Message : '+ex.message;
	   nlapiLogExecution('DEBUG', 'Body : ', body);
	   nlapiSendEmail(author,bcc, subject, body);
	}
}

function SuccessForm(response)
{
	try
	{
		var form = nlapiCreateForm("Success");
		var success=form.addField('success', 'text', 'Email Sent Successfully .');
		success.setDisplayType('inline');		
		form.addButton('custpage_ok','OK','window.close()');
		response.writePage(form);
	}
	catch(ex)
	{
	   body = 'SuccessForm, Exception : '+ex+', Message : '+ex.message;
	   nlapiLogExecution('DEBUG', 'Body : ', body);
	   nlapiSendEmail(author,bcc, subject, body);
	   response.write('');
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
