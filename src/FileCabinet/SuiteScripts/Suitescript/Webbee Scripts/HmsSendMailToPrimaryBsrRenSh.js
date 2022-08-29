/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/format','N/search','N/render','N/runtime','N/email'],

function(record,format,search,render,runtime,email) {
	var author = 4276;
	var subject = 'test'//HMS Marketing , REN UE';
	var bcc = 'pranjal@webbee.biz';

	function SendRENSCH(scriptContext)
	{/////yielding of script is done automatically in 2.0
     log.debug("scriptContext.type "+scriptContext.type)
			var d1 = new Date();
	log.debug({title:'d1',details:d1});

	function stdTimezoneOffset() {
	    var jan = new Date(d1.getFullYear(), 0, 1);
	    log.debug({title:'jan',details:jan});
	    var jul = new Date(d1.getFullYear(), 6, 1);
	log.debug({title:'jul',details:jul});
	    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}
	var dd = d1.getDate();
	var mm = d1.getMonth() + 1;
	var yy = d1.getFullYear();
	var today = mm + '/' + dd + '/' + yy;
	log.debug({title:'today1', details:today})
	Date.prototype.dst = function() {
	    return this.getTimezoneOffset() < stdTimezoneOffset();
	}
	log.debug({title: 'this.stdTimezoneOffset()',details: stdTimezoneOffset()});
	log.debug({title: 'this.getTimezoneOffset()',details: d1.getTimezoneOffset()});
	var today2 = new Date();
	if (today2.dst()) {
	    offset = -4.0

	} else {
	    offset = -5.0
	}
	clientDate = new Date();
	utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);

	date = new Date(utc + (3600000 * offset));
		var type = scriptContext.type;
	    log.debug(type);
			var context = runtime.getCurrentScript()
	     log.debug({
	        	title:'context ',
	        	details:context 
	        });
			var CaseId = context.getParameter({name:"custscript_caseidsch"});
			log.debug({
	        	title:'CaseId',
	        	details:CaseId
	        });
			var script  = runtime.getCurrentScript();
			var scriptParam = script.getParameter({name:'custscript_caseidsch'})
			log.debug({
	        	title:'scriptParam',
	        	details:scriptParam
	        });
			
			
		/*	CaseId ='81157'
				log.debug({
		        	title:'CaseId',
		        	details:CaseId
		        });*/
			var today = new Date();
			log.debug({
	        	title:'today ',
	        	details:today 
	        });
			var dd = today.getDate();
			log.debug({
	        	title:'dd ',
	        	details:dd
	        });
			var mm = today.getMonth()+1; //January is 0!
			log.debug({
	        	title:'mm',
	        	details:mm
	        });
			var yyyy = today.getFullYear();
			log.debug({
	        	title:'yyyy ',
	        	details:yyyy 
	        });
            
	try
		{

			
	      
	    

//	        {
//	        	var SecretCode = SetPropertyForREN(CaseId);
//	        	var emailSubject = 'HMS Test';
//			    var emailMerger = nlapiCreateEmailMerger(97); // Footer Email..
//			    emailMerger.setSupportCase(CaseId);
//			    var mergeResult = emailMerger.merge();
//		        var emailBody = mergeResult.getBody();
//		        
//			    var emailBody_table = '';
//		        var emailMerger_table = nlapiCreateEmailMerger(98); 
//		        emailMerger_table.setSupportCase(CaseId);
//			    var mergeResult_table = emailMerger_table.merge();
//			    var eBody = mergeResult_table.getBody()
//	     	 	    eBody = eBody.replace('encryptId', defVal(SecretCode)); 
//			    eBody=eBody.replace(/{/g, '<');
//			    eBody=eBody.replace(/}/g, '>');
//	     	 	   
//	     		  emailBody_table+=eBody;
//			    nlapiLogExecution('DEBUG', emailBody_table, emailBody_table);
//			    data=data.replace('{propertyrequested}',emailBody_table);
//			    emailBody=emailBody.replace('propertyrequested',data);
//			    
//		       	nlapiSendEmail(4276,'nd@webbee.biz',emailSubject,emailBody);
//	        }
	        if(defVal(CaseId) != '')  {
			
				 record.submitFields({
				        type: record.Type.SUPPORT_CASE,
				        id: CaseId,
				        values:  'T',
				       enableSourcing: true
				         });
				 log.debug('81')
		       	var BsrIds = [];	
		       	var LCaseIds = [];
		       	var NLCaseIds = [];

		            
	            
	            log.debug({
	            	title:' today : ',
	            	details:today
	            });
                    
	            
	            
	            var cSearch =search.create({
					type:search.Type.SUPPORT_CASE,
					filters:[
					         search.createFilter({
						name:'custevent_bsr_notify_sent', 
						operator:'is',
						value: 'F'////////F///////
					}),
					
					search.createFilter({
						name:'custevent_ren_session', 
						operator:'is',
						value:'T'
					}),
					search.createFilter({
						name:'stage', 
						operator:'is',
						value:'OPEN'/////open/////
					}),
					search.createFilter({
						name:'createddate', 
						operator:'on',
						value:today
					})
					],
					//////////////////////////////////////////////////////////////
	            columns:[
				         search.createColumn({
					name:'custevent_builder_sales_rep_subd', 
					join:null,
					summary:'group'
				}),]
				 });
	            log.debug({
	            	title:'cSearch ',
	            	details:cSearch 
	            });
	            if(cSearch != null && cSearch.length >0)
	       	   {log.debug('131')
	           	  for(var i=0; i<cSearch.length; i++)
	           	  BsrIds.push(cSearch[i].getValue(columns));
	       	   }		 log.debug(BsrIds)
	       	   log.debug(JSON.stringify(BsrIds))
	            if(BsrIds != null && BsrIds.length > 0)
	            {		log.debug('136')
	       	       				     				 	
	       	      for(var j=0; j<BsrIds.length; j++)
	       	 	  {		log.debug('139')
	           	     	
	       		     cSearch =search.create({
	       		    	type:search.Type.SUPPORT_CASE,
	       		    	filters:[
	       		    	         search.createFilter({
	       		    	        	name:'custevent_builder_sales_rep_subd' ,
	       		    	        	operator:'is',
	       		    	        	value:BsrIds[j]
	       		    	         })
	       		    	         ],
	       		    	         columns:[
	       		    	                  search.createColumn({
	       		    	                	  name:'custevent_linked_cases'
	       		    	                  })
	       		    	                  ]
	       		     });
	       	       log.debug({
	       	    	   title:'cSearch2',
	       	    	   details:cSearch
	       	       });
	       		     if(cSearch != null && cSearch.length >0)
	       	    	 {log.debug('161')
	       		    	 var 	LCIds = [];
	       		    	 for(var i=0; i<cSearch.length; i++)
	       		    	  {				
	       		    		  log.debug('165')
	       		    		   var caseId = cSearch[i].id
	       		            //nlapiLogExecution('DEBUG', ' caseId : ',caseId);
	       		    		   log.debug({
	       		    			  title:'caseId',
	       		    			  details:caseId
	       		    		   });

	       		    		   var linkedCase = cSearch[i].getValue(columns);
	       		    	       if(defVal(linkedCase) != '')
	       		    	       LCIds.push(caseId);
	       		    	       else
	       		    	       NLCaseIds.push(caseId);
	       		    	  }	 
	       		    	 if(LCIds.length>0)
	       		    	 LCaseIds.push(LCIds.join('='));
	       	    	 }		
	       	 	  }	
	            }
	            body = 'NLCaseIds : '+NLCaseIds,+' LCaseIds : '+LCaseIds;	
	           
	            log.debug({
	            	title:' Body : ',
	            	details:body
	            });
	            for(var i=0; i<NLCaseIds.length ; i++)
	            	
	            ProcessREN([NLCaseIds[i]]);
	       		for(var i=0; i<LCaseIds.length ; i++)
	       		
	       		ProcessREN(LCaseIds[i].split('='));	 
	       		
	       }	     
		}
		catch(ex)
		{
			body = 'SendRENSCH : '+ex;
			body += ex.name+' : '+ex.message;
	
			email.send({
				author:author,
				recipients:bcc,
				subject:subject,
				body:body
			});
			
			log.debug({
				title:' Exception Body : ',
				details:body
			});
		}
	     
	}
	//schedule
	function ProcessREN(CaseIds)
	{
		try
		{			log.debug('231')
			 //   CheckGovernance();
			
			    var file =file.load({
			    	id:'39813'
			    });log.debug({
			    	title:'file ',
			    	details:file 
			    });
			   var fileObj = file.save();
			   log.debug({
			    	title:'fileObj ',
			    	details:fileObj 
			    });
				var data=file.getValue();
				log.debug({
			    	title:'data',
			    	details:data
			    });
			    var emailSubject = '';
			    log.debug({
			    	title:'emailSubject ',
			    	details:emailSubject 
			    });
			    var emailMerger = render.mergeEmail({
				    templateId: 97,
				    entity:null,
				    recipient:null,
				    supportCaseId: CaseIds[0],
				    transactionId: null,
				    customRecord: null
				   });
			    log.debug({
			    	title:'emailMerger ',
			    	details:emailMerger 
			    });
			   
		        var emailBody = emailMerger.body;
		        log.debug({
			    	title:'emailBody ',
			    	details:emailBody 
			    });
		        var emailBody_table = '';
	        	for(var i=0; i<CaseIds.length ; i++)
			    {  log.debug('279')      	   
	        	   var SecretCode = SetPropertyForREN(CaseIds[i]);	
			    log.debug('281')      	   
	   	     var emailMerger_table = render.mergeEmail({
				    templateId: 97,
				    entity:null,
				    recipient:null,
				    supportCaseId: CaseIds[1],
				    transactionId: null,
				    customRecord: null
				         
				    });
	   		    
	   		    var eBody = emailMerger_table.body
	        	eBody = eBody.replace('encryptId', defVal(SecretCode)); 
	   		    eBody=eBody.replace(/{/g, '<');
	   		    eBody=eBody.replace(/}/g, '>'); 
	     	 	emailBody_table+=eBody;
	     	 	log.debug('297')
	     	 	//CheckGovernance();
			    }
			    data=data.replace('{propertyrequested}',emailBody_table);
			    emailBody=emailBody.replace('propertyrequested',data);
	        	log.debug('303')
			  
			    var CaseRec =record.load({
			    	type:record.Type.SUPPORT_CASE,
			    	id:CaseIds[0]
			    });
	        	log.debug({title:'CaseRec ',details:CaseRec })
			    var renEnabled = CaseRec.getValue({fieldId:'custevent_ren_enabled'});
			    var statusID =  CaseRec.getValue({fieldId:'status'});
				var searchType =  CaseRec.getValue({fieldId:'custevent_subdivision_search'});	
				var builderSuppliedLead =  CaseRec.getValue({fieldId:'custevent_builder_lead'});
				var topLevelBuilder =  CaseRec.getValue({fieldId:'custevent_builder'});
				var subdivision =  CaseRec.getValue({fieldId:'custevent_subdivision_for_ren'});
				var division =  CaseRec.getValue({fieldId:'company'});
				var bsrNotifySent =  CaseRec.getValue({fieldId:'custevent_bsr_notify_sent'});
				var agentName =  CaseRec.getValue({fieldId:'custevent_agent_for_ren'});
				var salesManagerEmail =  CaseRec.getValue({fieldId:'custevent_sales_mgr_email'});
				log.debug('319')
				var divManagerEmail =  CaseRec.getValue({fieldId:'custeventdivision_mgr_email'});
				var adminAsstEmail =  CaseRec.getValue({fieldId:'custevent_administrative_contact_email'});
				var bsrID =  CaseRec.getValue({fieldId:'custevent_builder_sales_rep_subd'});
				var bsrOneTimeOptOut =  CaseRec.getValue({fieldId:'custevent_one_time_rtan_opt_out'});
				var smOptOut =  CaseRec.getValue({fieldId:'custevent_sm_opt_out'});
				var dmOptOut =  CaseRec.getValue({fieldId:'custevent_dm_opt_out'});
				var adminOptOut =  CaseRec.getValue({fieldId:'custevent_admin_opt_out'});
				var smOptOutRTAN =  CaseRec.getValue({fieldId:'custevent_sm_opt_out_rtan'});
				var dmOptOutRTAN =  CaseRec.getValue({fieldId:'custevent_dm_opt_out_rtan'});
				var dmID =  CaseRec.getValue({fieldId:'custevent8'});
				var smID =  CaseRec.getValue({fieldId:'custevent7'});
				var adminOptOutRTAN =  CaseRec.getValue({fieldId:'custevent_admin_opt_out_rtan'});
				var bsrOptOut = 'F'; // CaseRec.getFieldValue('custevent_bsr_opt_out');
				var stage = CaseRec.getFieldValue('stage');
				var callerType=CaseRec.getValue({fieldId:'custevent_caller_type'});
				log.debug('335')
	           var imageurl='';
				try{
					
					var imageid=search.lookupFields({
						type:search.Type.CUSTOMER,
						id:division,
						columns:'image'
							});
					if(!imageid){
					
						var builder_parent=search.lookupFields({
							type:search.Type.CUSTOMER,
							id:division,
							columns:'parent'
								});
						
						 imageid=search.lookupFields({
							type:search.Type.CUSTOMER,
							id:builder_parent,
							columns:'image'
								});
				
						log.debug({
							title:'builder_parent',
							details:builder_parent
						});
						
						
						image_file=file.load({
							id:imageid
						});
						imageurl=image_file.url;
					}else{
						var image_file=file.load({
							id:imageid
						});
						imageurl=image_file.url;
					}
				}catch(ier){
					
					log.debug({
						title:'err image',
						details:ier
					});
				}
				if(imageurl==''){
					imageurl='https://1309901.app.netsuite.com/core/media/media.nl?id=39790&amp;c=1309901&amp;h=48dbf824375dd894c511';
				}
				else{
					imageurl='https://1309901.app.netsuite.com'+imageurl;
				}
				
				log.debug({
					title:'url',
					details:imageurl
				});
				emailBody=emailBody.replace('logoimage', imageurl);
				var bsr_email={};
				
				log.debug({
					title:'301',
					details:division
				});
				try{
				if(callerType=='10'||callerType=='3'){
			
					var bsrTobeNotified=search.lookupFields({
						type:search.Type.CUSTOMER,
						id:division,
						columns:'custentity_copy_appt_insp_req'
							});
			
					log.debug({
						title:'bsrTobeNotified',
						details:bsrTobeNotified
					});
					var arr=[];
					arr=bsrTobeNotified.split(',');
					
					log.debug({
						title:'arr',
						details:arr.length
					});
					for(var z=0;z<arr.length;z++){
						
						var b_mail=search.lookupFields({
							type:search.Type.PARTNER,
							id:arr[z],
							columns:'email'
								});
				
						bsr_email[arr[z]]=b_mail;
					}
				}}catch(eb){
					bsr_email={};
					
					log.debug({
						title:' exception eb',
						details:eb
					});
				}

	log.debug({
		title:'bsr_email',
		details:JSON.stringify(bsr_email)
	});
				var optOutBuilderLeads = 'F';
				var bsrEmail =  '';
				var bsrOptOutRTAN ='';
				var bsrName = '';
				var cc = [];
				var ccRTAN = [];
				var records = new Object();
				records['activity'] = CaseIds[0];	
				var copyOnRENDivision = '';
				var notificationMethod = '';
				var enableEmailNotification = '';
				var copyOnREN = null;
				var copyOnBuilderLeads = null;
				var copyOnBuilderLeadsDivision = null;
				if(defVal(dmID) != '')
				
				 optOutBuilderLeads=search.lookupFields({
					type:search.Type.PARTNER,
					id:dmID,
					columns:'custentity_opt_out_builder_leads'
						});
				if(defVal(smID) != '')
			
				smOptOutBuilderLeads=search.lookupFields({
						type:search.Type.PARTNER,
						id:smID,
						columns:'custentity_opt_out_builder_leads'
							});
				
				if(defVal(division) != '')
				{
				
					var builderDivision = record.load({
						type:record.Type.CUSTOMER,
						id:division});	
					copyOnRENDivision = builderDivision.getValues({fieldId:'custentity_copy_on_ren'});
					notificationMethod = builderDivision.getValue({fieldId:'custentity_appt_notification_method'});
					enableEmailNotification = builderDivision.getValue({fieldId:'custentity8'});
					copyOnBuilderLeadsDivision = builderDivision.getValue({fieldId:'custentity_copy_on_builder_leads'});
				}
				if(defVal(bsrID) != '')
				{	
					bsrName = defVal(CaseRec.getValue({fieldId:'custevent_bsr_first_name'}))+' ';
					bsrName += defVal(CaseRec.getValue({fieldId:'custevent_bsr_last_name'}));
					
					var partnerInfo=search.lookupFields({
						type:search.Type.PARTNER,
						id:bsrID,
						columns:['email','custentity_opt_out_rtan']
							});
					bsrEmail =  partnerInfo.email;
					bsrOptOutRTAN = 'F'; //partnerInfo.custentity_opt_out_rtan;
				}
				if(searchType == '1')
				{
					var propertyId = CaseRec.getValue({fieldId:'custevent_property'});
					if(defVal(propertyId) != '')
					{
						emailSubject = "New Inquiry From " +agentName + " For " +subdivision;		
						
						var lot=search.lookupFields({
							type:propertyRecType,
							id:propertyId,
							columns:custrecord_lot_number
								});
						if(defVal(lot) != '')
					    emailSubject +=" Lot "+lot;
					}
				}
			//	nlapiLogExecution('DEBUG', '302');
				if(builderSuppliedLead == 'T')
				 emailSubject = "New Web Lead Assigned To "+bsrName+" For "+agentName;  
				
				if(defVal(topLevelBuilder) != '')
				{
					var topLevelBuilderRecord = nlapiLoadRecord('customer', topLevelBuilder);
					var topLevelBuilderRecord =record.load({
						Type:record.Type.CUSTOMER,
						id:topLevelBuilder
					});
					copyOnREN = topLevelBuilderRecord.getValues({fieldId:'custentity_copy_on_ren'});
					if (builderSuppliedLead == 'T')
					copyOnBuilderLeads = topLevelBuilderRecord.getValues({fieldId:'custentity_copy_on_builder_leads'});
				}
				
				if(copyOnREN != null)
				{
					for(var i=0; copyOnREN.length > i; i++)
					{
						
						var copyUserEmail=search.lookupFields({
							type:search.Type.PARTNER,
							id: copyOnREN[i],
							columns:'email'
								});
						cc.push(copyUserEmail);
						//CheckGovernance() ;
					}
				}
				
				if(copyOnRENDivision != null)
				{							
					for(var i=0; copyOnRENDivision.length > i; i++)
					{
						
						var copyUserEmail=search.lookupFields({
							type:search.Type.PARTNER,
							id:copyOnRENDivision[i],
							columns:'email'
								});
						cc.push(copyUserEmail);
					//	CheckGovernance();
					}		
				}
				if(defVal(divManagerEmail) != '' && dmOptOut == 'F')
				cc.push(divManagerEmail);
			
				if (defVal(salesManagerEmail) != '' && smOptOut == 'F')
				cc.push(salesManagerEmail);
		
				if (builderSuppliedLead == 'T')
				{
					ccRTAN.push('ahencheck@hmsmarketingservices.com');
					if(copyOnBuilderLeads != null && copyOnBuilderLeads != '')
					{
						for(var i=0; copyOnBuilderLeads.length > i; i++)
						{
							
							var copyUserEmail=search.lookupFields({
								type:search.Type.PARTNER,
								id: copyOnBuilderLeads[i],
								columns:'email'
									});
						
							ccRTAN.push(copyUserEmail);
						}
					}
					if(defVal(copyOnBuilderLeadsDivision) != '')
					{
						for(var i=0; copyOnBuilderLeadsDivision.length > i; i++)
						{
						
							var copyUserEmail=search.lookupFields({
								type:search.Type.PARTNER,
								id:  copyOnBuilderLeadsDivision[i],
								columns:'email'
									});
							ccRTAN.push(copyUserEmail);
							//CheckGovernance();
						}
					}
				}					
				else
				{
					if(copyOnREN != null && copyOnREN != '')
					{					
						for(var i=0; copyOnREN.length > i; i++)
						{
				
							var copyUserEmail=search.lookupFields({
								type:search.Type.PARTNER,
								id:copyOnREN[i],
								columns:'email'
									});
							ccRTAN.push(copyUserEmail);
						//	CheckGovernance();
						}
					}
					
					if(copyOnRENDivision != null && copyOnRENDivision != '')
					{
						for(var i=0; copyOnRENDivision.length > i; i++)
						{
					
							var copyUserEmail=search.lookupFields({
								type:search.Type.PARTNER,
								id: copyOnRENDivision[i],
								columns:'email'
									});
							ccRTAN.push(copyUserEmail);
							//CheckGovernance();
						}
					}
				  if(builderSuppliedLead == 'T')
				  {
					if(defVal(divManagerEmail) != '' && optOutBuilderLeads == 'F')
					ccRTAN.push(divManagerEmail);
					
					if(defVal(salesManagerEmail) != '' && smOptOutBuilderLeads == 'F')
					ccRTAN.push(salesManagerEmail);
				  }
				 else
				 {
					if(defVal(divManagerEmail) != '' && dmOptOutRTAN == 'F')
				    ccRTAN.push(divManagerEmail);
					if(defVal(salesManagerEmail) != '' && smOptOutRTAN == 'F')
					ccRTAN.push(salesManagerEmail);
				 }
			}
//			if(defVal(adminAsstEmail) != '' && adminOptOutRTAN == 'F') commented on 11-04-18 on Jeff request
//			ccRTAN.push(adminAsstEmail);	
			
			log.debug({
				title:'ccRTAN',
				details:ccRTAN
			});
//			if(bsrNotifySent == 'F' && notificationMethod == '1' && enableEmailNotification == 'T' && bsrOptOutRTAN =='F' && bsrOneTimeOptOut =='F' && stage =='OPEN')
			if(notificationMethod == '1' && enableEmailNotification == 'T' && bsrOptOutRTAN =='F' && bsrOneTimeOptOut =='F')
			{
		
				body = emailBody
				body=body.replace('bsrid', bsrID);
	          
	            	for(var bm in bsr_email){
	            		var t_body=emailBody;
	            		var bsr_nsid=bm;
	            		bsr_mail_id=bsr_email[bm];
	            		t_body=t_body.replace('bsrid', bsr_nsid);

	            		
	            		email.send({
	            		    author: callCenter,
	            		    recipients: bsr_mail_id,
	            		    subject:emailSubject,
	            		    body: t_body,
	            		    cc:null,
	            		    bcc:null,
	            		    relatedRecords:records,
	            		    attachments:null,
	            		  
	            		});
	            	}

	            
				for(var j=0; j<CaseIds.length ; j++)
				{
					var fields = ['custevent_bsr_notify_sent','custevent_hms_last_ren_sent_date_time'];
					var values = ['T',CurrTime];
				 
				    record.submitFields({
				        type: record.Type.SUPPORT_CASE,
				        id: CaseIds[j],
				        values:  values,
				       enableSourcing: true
				                
				    });
				    record.s
					//CheckGovernance();
				}
				 
				if(defVal(ccRTAN[0]) != '')
				{
					 //smTemplate
				
					var emailMerger = render.mergeEmail({
					    templateId: 99,
					    entity:null,
					    recipient:null,
					    supportCaseId: CaseIds[0],
					    transactionId: null,
					    customRecord: null
					    });
					
					var emailbody_nl = emailMerger.body;
					emailbody_nl=emailbody_nl.replace('propertyrequested',data);
	                emailbody_nl=emailbody_nl.replace('logoimage',imageurl);
	        //		nlapiSendEmail(callCenter,'vikash.singh@webbee.biz',emailSubject,emailbody_nl);
	     //             nlapiLogExecution("DEBUG","emailSubject",emailSubject)
	 // nlapiLogExecution("DEBUG","emailbody_nl",emailbody_nl)
	 //   nlapiLogExecution("DEBUG","ccRTAN",ccRTAN)
	  //  nlapiLogExecution("DEBUG","records",JSON.stringify(records))
	    
	     //   nlapiSendEmail(callCenter, "vikash.singh@webbeeglobal.com", emailSubject, emailbody_nl, ccRTAN,null, JSON.stringify(records),null, true);    
				 	nlapiSendEmail(callCenter, ccRTAN[0], emailSubject, emailbody_nl, ccRTAN,null, JSON.stringify(records),null, true);
				 	email.send({
            		    author: callCenter,
            		    recipients: ccRTAN[0],
            		    subject:emailSubject,
            		    body: emailbody_nl,
            		    cc:ccRTAN,
            		    bcc:null,
            		    relatedRecords:JSON.stringify(records),
            		    attachments:null,
            		  
            		});
					log.debug({
						title:'Case2',
						details:' Case2 : Email Sent To Primary BSR of Cases'+ CaseIds
					});
					return true;
				}						
			}						
		    else if(renEnabled == 'T')
			{
				if(bsrOptOutRTAN == 'T' && ['5','6','11'].indexOf(statusID) != -1) 
			    {
//					emailMerger = nlapiCreateEmailMerger(bsrTemplate); //68
//					emailMerger.setSupportCase(CaseIds[0]);
//					mergeResult = emailMerger.merge();
//					emailHeader = mergeResult.getBody();
					body = emailBody
					var recipient = cc[0];			
				    if(defVal(bsrEmail) != '')
				    recipient = bsrEmail;
				    body=body.replace('bsrid', bsrID);
					
					email.send({
            		    author: callCenter,
            		    recipients:recipient,
            		    subject:emailSubject,
            		    body: body,
            		    cc:cc,
            		    bcc:null,
            		    relatedRecords:records,
            		    attachments:null,
            		  });
	            	for(var bm in bsr_email){
	            		var t_body=emailBody;
	            		var bsr_nsid=bm;
	            		bsr_mail_id=bsr_email[bm];
	            		t_body=t_body.replace('bsrid', bsr_nsid);
	            	
	            		email.send({
	            		    author: callCenter,
	            		    recipients:bsr_mail_id,
	            		    subject:emailSubject,
	            		    body: t_body,
	            		    cc:cc,
	            		    bcc:null,
	            		    relatedRecords:records,
	            		    attachments:null,
	            		  });
	            		
	            	}
			            	

				  for(var j=0; j<CaseIds.length ; j++)
				  {
					  var fields = ['custevent_ren_sent','custevent_hms_last_ren_sent_date_time'];
					  var values = ['T',CurrTime];
					
					  record.submitFields({
					        type: record.Type.SUPPORT_CASE,
					        id: CaseIds[j],
					        values:  values,
					       enableSourcing: true
					                
					    });
					//  CheckGovernance();
				   }
				  
					log.debug({
						title:'Case3',
						details:'Case3 : Email Sent To Primary BSR of Cases'+ CaseIds
					});
				}
			 }
		}
		catch(ex)
		{
			body = 'ProcessREN : '+ex;
			body += ex.name+' : '+ex.message;
		
			email.send({
    		    author: author,
    		    recipients:bcc,
    		    subject:subject,
    		    body: body,
    		    cc:null,
    		    bcc:null,
    		    relatedRecords:null,
    		    attachments:null,
    		  });
				
			log.debug({
				title:'Exception Body',
				details:body
			});
			
		}
	}
	//common
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
		
			email.send({
    		    author: author,
    		    recipients:bcc,
    		    subject:subject,
    		    body: body,
    		    cc:null,
    		    bcc:null,
    		    relatedRecords:null,
    		    attachments:null,
    		  });

			log.debug({
				title:'Body',
				details:body
			});
			
			return '';
		}
	}

	//schedule
	function SetPropertyForREN(caseId)
	{log.debug('861')
		try
		{log.debug({title:'caseId',details:caseId})
		    
		    var  PropertyId =   search.lookupFields({
				type:search.Type.SUPPORT_CASE,
				id:'81157',//caseId,
				columns:'custevent_property'
					});
		log.debug('870')
			if(defVal(PropertyId) != '')
			{
			  //  var encrypted = CryptoJS.AES.encrypt(PropertyId,SecretKey);
				//var decrypted = CryptoJS.AES.decrypt(encrypted,SecretKey).toString(); 
				log.debug('861')
				var  houseNumber =   search.lookupFields({
					type:propertyRecType,
					id:PropertyId,
					columns:'custrecord_house_number'
						});
				log.debug('881')
				var  enableREN =   search.lookupFields({
					type:propertyRecType,
					id:PropertyId,
					columns:'custrecord12.custentity_enable_ren'
						});
				log.debug('887')
				var  street =   search.lookupFields({
					type:propertyRecType,
					id:PropertyId,
					columns:'custrecord31'
						});
				var fields = ['custevent_ren_enabled','custevent_property_for_ren'];
		 		
		 		record.submitFields({
			        type: record.Type.SUPPORT_CASE,
			        id: CaseId,
			        values:  [enableREN,houseNumber+' '+street],
			       enableSourcing: true
			                
			    });
		 		
		 		record.submitFields({
			        type:propertyRecType,
			        id: PropertyId,
			        values: decrypted,
			       enableSourcing: true
			                
			    });
		 	    return decrypted;
			}
			return null;
		}
		catch(ex)
		{
			body = 'SetPropertyForREN : '+ex;
			body += ex.name+' : '+ex.message;
	
			email.send({
    		    author: author,
    		    recipients:bcc,
    		    subject:subject,
    		    body: body,
    		    cc:null,
    		    bcc:null,
    		    relatedRecords:null,
    		    attachments:null,
    		  });
			
			log.debug({
				title:'Exception Body',
				details:body
			});
			return null;
		}
	}

	//Function CheckGovernance
	//schedule
	/*function CheckGovernance()///automatic yielding of script is done in 2.0 
	{
	    try 
	    {
	  
	    	var currentContext = runtime.getCurrentScript()
	        if (currentContext.getRemainingUsage() < 100) 
	        {
	        	body = 'Remaining Usage :', currentContext.getRemainingUsage();

				log.debug({
					title:'Body',
					details:body
				});
	            var state = nlapiYieldScript();//////////////////////////////
	            if (state.status == 'FAILURE') 
	            {
	            	body =  'Failed to yield script, exiting:'+', Reason = ' + state.reason +' / Size = '+state.size;
	            	

	    			log.debug({
	    				title:'Body',
	    				details:body
	    			});
	            }
	            else if (state.status == 'RESUME')
	            {
	            	body =  'Resuming script because of : '+state.reason+'/ Size = '+state.size;
	            	

	    			log.debug({
	    				title:'Body',
	    				details:body
	    			});
	            }
	        }
	    }
	    catch (ex) 
	    {
	    	body =  'Exception : '+ex.name;
			body += '\n Function : CheckGovernance';
			body += '\n Message : '+ex.message;
			

			log.debug({
				title:' Exception Body',
				details:body
			});
			
			email.send({
    		    author: author,
    		    recipients:bcc,
    		    subject:subject,
    		    body: body,
    		    cc:null,
    		    bcc:null,
    		    relatedRecords:null,
    		    attachments:null,
    		  });
	    }
	}*/
   

    return {
        execute: SendRENSCH
    };
    
});
