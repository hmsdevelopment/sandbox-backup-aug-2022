/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/log','N/record','N/ui/serverWidget','N/search','N/https','N/render','N/email','N/format'],
function(log,record,serverWidget,search,https,render,email,format) {
   
    
    function onRequest(context) {
    	

   	 log.debug('suitlet  if part start' );
   	if (context.request.method === 'GET')
   	{
   		
   		var recordid =context.request.parameters.recordid
   		
   	 log.debug(recordid);
   		 var ren = serverWidget.createForm({
                title: 'Resend Inquiry Emails To:'
                });
     		var ren0 = ren.addField({
   		    id : 'custpage_recordid',
   		    type : serverWidget.FieldType.TEXT,
   		    label : 'support'
   		});
   
   		ren.updateDefaultValues({
   			custpage_recordid : recordid
   		})
   		ren0.updateDisplayType({
				displayType: serverWidget.FieldDisplayType.HIDDEN
			});
   	   		if(recordid)
   		{
   			var appointmentrec = record.load({
   				type:record.Type.SUPPORT_CASE,
   				id:recordid
   			});
   			var primaryBsr = appointmentrec.getValue({
   				fieldId:'custevent_builder_sales_rep_subd'
   					});
   			var salesManager = appointmentrec.getValue({
   				fieldId:'custevent7'
   					});
   			var adminContact = appointmentrec.getValue({
   					fieldId:'custevent_admin_contact'
   						});
   			var bsrName = '';
   			if(primaryBsr)
   			{
   				var bsrRecord = record.load({
   					type:record.Type.PARTNER,
   					id:primaryBsr
   					}); 
   				bsrName = bsrRecord.getValue({fieldId:'firstname'}) + ' ' + bsrRecord.getValue({fieldId:'lastname'});
   			}	
   			var salesManagerName = '';
   			if(salesManager)
   			{
   				var salesManagerRecord = record.load({
   					type:record.Type.PARTNER,
   					id:salesManager}); 
   				salesManagerName = salesManagerRecord.getValue({fieldId:'firstname'}) + ' ' + salesManagerRecord.getValue({fieldId:'lastname'});
   			}
   			var adminName = '';
   			if(adminContact)
   			{
   				var adminRecord =record.load({
   					type:record.Type.PARTNER,
   					id:adminContact
   					}); 
   				adminName = adminRecord.getValue({fieldId:'firstname'}) + ' ' + adminRecord.getValue({fieldId:'lastname'});
   			}
   			
   			var optren = '';
   			var optrtan = '';
   			var bsremail = ''
   			if(primaryBsr)
   			{
   				var fields = ['email','custentity_opt_opt_ren','custentity_opt_out_rtan'];
   				var bpfields = search.lookupFields({
   					type:record.Type.PARTNER,
   					id:primaryBsr,
   					columns:fields
   					});
   				optren = bpfields.custentity_opt_opt_ren;
   				optrtan = bpfields.custentity_opt_out_rtan;
   				bsremail = bpfields.email;
   			}
   			var salesmanagerEmail = appointmentrec.getValue({
   				fieldId:'custevent_sales_mgr_email'
   					});
   			var adminContactId = appointmentrec.getValue({
   				fieldId:'custevent_admin_contact'
   					});
   			var adminContactEmail = '';
   			if(adminContactId)
   			{
   				adminContactEmail = search.lookupFields({
   					type:record.Type.PARTNER,
   					id:adminContactId,
   					columns:'email'
   						});
   			}
   			adminContactEmail = adminContactEmail.email
   			
   			var gotren = false;
   			if((optren ==false) || (optrtan ==false))
   			{
   				gotren = true;
   			}
   				var ren1 = ren.addField({
   			    id : 'custpage_rencheckbox',
   			    type : serverWidget.FieldType.CHECKBOX,
   			    label : 'Resend to Builder Sales Rep:' + ' ' + bsrName
   			});
   			var ren2 = ren.addField({
   				id:'custpage_renemail',
   				type:serverWidget.FieldType.EMAIL,
   				label:'BSR Email'});
   			ren.updateDefaultValues({
   				custpage_renemail:"aj@webbeeglobal.com"//bsremail
   				});
   			ren2.updateDisplayType({
   				displayType: serverWidget.FieldDisplayType.HIDDEN
   			});
   			if(optren == gotren)
   			{
   				ren1.updateDisplayType({
   					displayType:serverWidget.FieldDisplayType.DISABLED
   					});
   				ren2.updateDisplayType({
   					displayType:serverWidget.FieldDisplayType.DISABLED});
   			}
   			
   			var ren5 = ren.addField({
   				id:'custpage_salesmanager',
   				type:serverWidget.FieldType.CHECKBOX,
   				label:'Resend to Sales Manager:' + ' ' + salesManagerName
   				});
   			var ren6 = ren.addField({
   				id:'custpage_salesmanageremail',
   				type:serverWidget.FieldType.EMAIL,
   				label:'Sales Manager Email'
   					});
   			ren.updateDefaultValues({
   				custpage_salesmanageremail:salesmanagerEmail
   				});
   			ren6.updateDisplayType({
   				displayType:serverWidget.FieldDisplayType.HIDDEN
   				});
   			var ren7 = ren.addField({
   				id:'custpage_administrative',
   				type:serverWidget.FieldType.CHECKBOX,
   				label:'Resend to Division Coordinator:' + ' ' + adminName
   				});
   			var ren8 = ren.addField({
   				id:'custpage_administrativeemail',
   				type:serverWidget.FieldType.EMAIL,
   				label:'Division Coordinator Email'
   					});
   			ren.updateDefaultValues({
   				custpage_administrativeemail:adminContactEmail
   				});
   			ren8.updateDisplayType({
   				displayType:serverWidget.FieldDisplayType.HIDDEN
   				});
   			
   			ren.addSubmitButton({
   			    label : 'Send Emails'
   			});
   		
   		}
   		context.response.writePage(ren);
   		
   	}
   	else
   	{
   	   log.debug({
   		  title:'suitelet else part start' 
   	   });
   		try
   		{
   			var request = context.request;
   			
   			log.debug("request",JSON.stringify(request))
   			
   			var ren1 = request.parameters.custpage_rencheckbox || 'F';
   		//	var renemail =request.parameters.inpt_custpage_renemail;
   			var renemail = "aj@webbeeglobal.com"
   			var rtan1 = request.parameters.custpage_rtancheckbox || 'F';
   			var rtanemail =request.parameters.custpage_rtanemail
   			
   			var sm1=request.parameters.custpage_salesmanager || 'F'
   		//	var smemail=request.parameters.custpage_salesmanageremail;
   			var smemail = "aj@webbeeglobal.com"
   		   			
   			var adm1 = request.parameters.custpage_administrative || 'F';
   		//	var admemail = request.parameters.custpage_administrativeemail ;
   			var admemail = "aj@webbeeglobal.com"
   			
   			var id= Number(request.parameters.custpage_recordid);
   			log.debug("id",id)
   			
   			if(defValue(id) != '')
   			{
   				var supportcase = record.load({
   					type:record.Type.SUPPORT_CASE,
   					id:id 
   					});
   				var agent = supportcase.getValue({
   					fieldId:'custevent_caller_name'
   						});
   				var agentFirstName = '';
   				var agentLastName = '';
   				
   				if(agent)
   				{
   					
   					var agentRecord = record.load({
   						type:'customrecord_agent',
   						id:agent
   					});
   					agentFirstName = agentRecord.getValue({
   						fieldId:'custrecord_agent_first_name'
   							});
   				}
   					agentLastName = agentRecord.getValue({
   						fieldId:'custrecord_agent_last_name'});
   				}
   				var agentFullName = agentFirstName + ' ' + agentLastName;
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   				var subdivision = supportcase.getValue({
   					fieldId:'custevent_subdivision_for_ren'
   						});	
   				var propertyId = supportcase.getValue({
   					fieldId:'custevent_property'
   						});
   				var houseNumber = '';
   				var street = '';
   				var lot = '';
   			
   				if(propertyId)
   				{
   					var property = record.load({
   						type:'customrecord_property_record',
   						id:propertyId
   						});
   					houseNumber = property.getValue({
   						fieldId:'custrecord_house_number'
   							});
   					street = property.getText({
   						fieldId:'custrecord31'
   							});
   					lot = property.getValue({
   						fieldId:'custrecord_lot_number'
   							});
   				}		
   			
   				var subject = "Re-sending : New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;			
   				var records = new Object();
   				records['activity'] = id;
   				var searchType1 = supportcase.getValue({
   					fieldId:'custevent_subdivision_search'
   						});
   				
   		
   				var needupdate1 = false;
   				
  
   			if(ren1 == 'T')
   			{		
   				if(searchType1 == 1)
   				{
   					
   					var emailMerger = render.mergeEmail({
   						templateId: 48,
   						supportCaseId: id
   						});
   					
   					if(renemail)
   			
   								
   					email.send({
   						author:'3847',
   						recipients:renemail,
   						replyTo:null,
   						cc:null,
   						bcc:null,
   						subject:subject,
   						body:emailMerger.body,
   						attachments:null,
   						relatedRecords:records
   					});
   					
   					log.debug({
   						title: 'after email in ren1 ',
   						details:'ren1  '+ren1
   					})
   					needupdate1 = true;
   				}
   				if(searchType1 == 2)
   				{
   			
   					var emailMerger = render.mergeEmail({
   						templateId: 34,
   						supportCaseId: id
   						});
   					
   					if(renemail)
   				
   					
   					email.send({
   						author:'3847',
   						recipients:renemail,
   						replyTo:null,
   						cc:null,
   						bcc:null,
   						subject:subject,
   						body:emailMerger.body,
   						attachments:null,
   						relatedRecords:records
   					});
   					
   					log.debug({
   						title:'after email in ren1',
   						details:'ren1  '
   					})          
   					needupdate1 = true;
   				}
   				if(searchType1 == 3)
   				{   
   					var emailMerger = render.mergeEmail({
   						templateId: 39,
   						supportCaseId: id
   						});
   					
   				
   					if(renemail)
   					
   					
   					email.send({
   						author:'3847',
   						recipients:renemail,
   						replyTo:null,
   						cc:null,
   						bcc:null,
   						subject:subject,
   						body:emailMerger.body,
   						attachments:null,
   						relatedRecords:records
   					});
   					
   					log.debug({
   						title:'after email in ren1 ',
   						details:'ren1  '+ren1
   					});
   					needupdate1 = true;
   				}				
   			}
   		
   			if(sm1 == 'T')
   			{
   				if(searchType1 == 1)
   				{
   					
   					
   					var emailMerger=render.mergeEmail({
   					    templateId: "23",
   					    supportCaseId: id,
   					    
   					    });
   				
   					if(smemail)
   						
   					email.send({
   						author:'3847',
   						recipients:smemail,
   						replyTo:null,
   						cc:null,
   						bcc:null,
   						subject:subject,
   						body:emailMerger.body,
   						attachments:null,
   						relatedRecord:records
   					});
   					
   					log.debug({
   						title:'after  smemail  email id',
   						details:'id '+id
   					});
   					needupdate1 = true;
   				}
   				if(searchType1 == 2)
   				{
   				
   					var emailMerger=render.mergeEmail({
   						templateId:35,
   						supportCaseId:id
   					});
   					
   					if(smemail)
   				
   					email.send({
   						author:'3847',
   						recipients:smemail,
   						replyTo:null,
   						cc:null,
   						bcc:null,
   						subject:subject,
   						body:emailMerger.body,
   						attachments:null,
   						relatedRecords:records
   					});
   					
   					log.debug({
   						title:'after smemail email id',
   						details:'id '+id
   					});
   					needupdate1 = true;
   				}
   				if(searchType1 == 3)
   				{
   				
   					var emailMerger=render.mergeEmail({
   						templateId:41,
   						supportcaseId:id
   					});
   					
   					if(smemail)
   				
   					email.send({
   						author:'3847',
   						recipients:smemail,
   						replyTo:null,
   						cc:null,
   						bcc:null,
   						subject:subject,
   						body:emailMerger.body,
   					    attachments:null,
   					    relatedRecords:records
   					});
   					
   					log.debug({
   						title:'after smemail email id',
   						details:'id '+id
   					});
   					needupdate1 = true;
   				}
   			}
   			
   			if(adm1 == 'T')
   			{
   				if(searchType1 == 1)
   				{
   					
   					var emailMerger=render.mergeEmail
   					({
   						templateId:23,
   						supportCaseId:id
   					});
   					
   					
   					if(admemail)
   							
   					email.send({
   						author:'3847',
   						recipients:admemail,
   						replyTo:null,
   						cc:null,
   						bcc:null,
   						subject:subject,
   						body:emailMerger.body,
   						attachments:null
   					});
   				
   					log.debug({
   						title:'after  admemail email  id',
   						details:'id '+id
   					});
   					needupdate1 = true;
   				}
   				if(searchType1 == 2)
   				{
   					
   					var emailMerger=render.mergeEmail
   					({
   						templateId:35,
   						supportCaseId:id
   					});
   					
   					if(admemail)
   					
   					email.send({
   						author:'3847',
   						recipients:admemail,
   						replyTo:null,
   						cc:null,
   						bcc:null,
   						subject:subject,
   						body:emailMerger.body,
   						attachment:null,
   						relatedRecord:records
   					});
   					
   				
   					log.debug({
   						title:'after  admemail email id',
   						details:'id '+id
   					});
   					needupdate1 = true;
   				}
   				if(searchType1 == 3)
   				{
   				
   					var emailMerger=render.mergeEmail
   					({
   						templateId:41,
   						supportCaseId:id
   					});
   					
   				
   					if(admemail)
   				
   					email.send({
   						author:'3847',
   						recipients:admemail,
   						replyTo:null,
   						cc:null,
   						bcc:null,
   						subject:subject,
   						body:emailMerger.body,
   					    attachments:null,
   					    relatedRecord:record
   					});
   					
   					log.debug({
   						title:'after admemail email id',
   						details:'id  '+id
   					});
   					needupdate1 = true;
   				}
   		   }								
   				
   		
   		if(needupdate1 == true)
   		{
   			log.debug("In needupdate1")
//   			var currenttime = currentdatetime();
//   			supportcase.setValue({
//   				fieldId:'custevent_hms_last_ren_sent_date_time',
//   				value:currenttime
//   				});
//   			
//   			
//   			supportcase.save({
//   			    enableSourcing: false,
//   			    ignoreMandatoryFields: false
//   			});
   		}		
   		
   		var form=serverWidget.createForm({
   			title:'Success'
   		});
   		
   		var success=form.addField({
   			id:'success',
   			type:serverWidget.FieldType.TEXT,
   			label:'Email Sent Successfully'
   		});
   		success.updateDisplayType({
   			displayType:serverWidget.FieldDisplayType.INLINE
   			});
   		form.addButton({
   			id:'custpage_ok',
   			label:'OK',
   			functionName:'window.close()'
   				});
   	 log.debug({
			title:'suitlet  else part end' 
		 });
   		context.response.writePage(form);
   		
   	}
   	catch(e)
   	{
   		 log.debug({
   				title:'after suitlet catch part start' 
   			 });
   		var errmsg = '';
   		var err = '';
   		var fx='';
   		if ( e instanceof nlobjError )
   		err 
   		= 'System error: ' + e.getCode() + '\n' + e.getDetails();
   		else
   		err = 'Unexpected error: ' + e.toString();
   		errmsg += '\n' + err;
   		
   		log.error({
   			title: fx + ' 999 Error',
   			details:errmsg
   		});
   	}
    }
   	 log.debug({
   			title:' suitlet  part end' 
   		 });	

    }
    

    return {
        onRequest: onRequest
    };
    
});
function currentdatetime()
{   
	 log.debug({
			title:'currentdatetime() start' 
		 });
	var cdate = new Date();
	var time = nlapiDateToString(cdate,'datetime');//////////////////////////////
	return time;
	 log.debug({
			title:'currentdatetime() end' 
		 });
}


function defValue(value) {
	
	try
	{ 
	    if(value == null || value == undefined || value == '' || value == 'undefined')
	    value = '';	    
	    return value;
	}catch(ex)
	{
		   details = 'defValue, Exception : '+ex+', Message : '+ex.message;
		   log.debug("Exception ",details);
	       return '';
		}
	
	
}
