/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */





define(['N/ui/serverWidget','N/record','N/search','N/file','N/render','N/email','N/format','SuiteScripts/Suitescript/Webbee Scripts/Crypto/Crypto.js','N/crypto'],

function(serverWidget,record,search,file,render,email,format,crypto ) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function CreateRENPage(context) {

    	var body = '';
    	var tmpBODY = 76;
    	var tmpFOOTER = 77; 
    	var bsrTemplate = 82;
    	var smTemplate = 74;
    	var author = 4276;
    	var subject = 'HMS Marketing , Resending REN';
    	var cc = 'shikha@webbee.biz';
    	var callCenter = 3847;
    	var SecretKey = search.lookupFields({type:'customrecord_auth_pass_phrase',id:1,columns: 'custrecord_secret_key'}); 
    	
    	

  	{
		try
  	    {
			log.debug({
				title:'SecretKey',
				details:SecretKey
			})
			
			
    			/*if(context.request.method == 'GET')
    			{
    				var recordid =context.request.parameters.recordid;
    				log.debug({title:'recordids ',details:recordid })
    				var ren =serverWidget.createForm({
    					title:'Resend Inquiry Emails To :'
    				});
    				
    				
    				log.debug({title:'ren ',details:ren })
    			
    				var ren0 = ren.addField({
    					id:'custpage_recordid2',
    					type:serverWidget.FieldType.TEXT,
    					label:'support',
    					displayType:serverWidget.FieldDisplayType.HIDDEN
    					});
    				log.debug({title:'ren0 ',details:ren0 })
    				ren0.updateDisplayType({
    	                 displayType: serverWidget.FieldDisplayType.HIDDEN
    	            });
    				
    				ren0.defaultValue = recordid;
    				 log.debug(41)
    			
    				var ren01 =ren.addField({
    					id:'custpage_total_emails_send2',
    					type:serverWidget.FieldType.TEXT,
    					label:'Email Notification Attempts',
    						});
    				 ren01.updateDisplayType({
    	                 displayType: serverWidget.FieldDisplayType.HIDDEN
    	            });
    				log.debug({title:'ren01 ',details:ren01 })
    				var ren02 = ren.addField({
    					id:'custpage_bsr_for_ren2',
    					type:serverWidget.FieldType.TEXT,
    					label:'BSR Name',
    					});
    				ren02.updateDisplayType({
   	                 displayType: serverWidget.FieldDisplayType.HIDDEN
   	            });
    				log.debug({title:'ren01 ',details:ren02 })
    				
    				if(defValue(recordid) != '')
    				{
    					var appointmentrec = record.load({
    						type:record.Type.SUPPORT_CASE,
    						id:recordid
    					});
    				
    					
    				var primaryBsr = appointmentrec.getValue({
    						fieldId:'custevent_builder_sales_rep_subd'
    					});
    				log.debug({title:'primaryBsr ',details:primaryBsr })
    					var salesManager = appointmentrec.getValue({
    						fieldId:'custevent7'
    					});
    				log.debug({title:'salesManager ',details:salesManager })
    					var adminContact = appointmentrec.getValue({
    						fieldId:'custevent_admin_contact'
    					});
    				log.debug({title:'adminContact ',details:adminContact })
    			
    		
    				var bsrName = appointmentrec.getValue({
    						fieldId:'custevent_bsr_for_ren'
    					});
    				log.debug({title:'bsrName ',details:bsrName })
    				var salesmanagerEmail = appointmentrec.getValue({
    						fieldId:'custevent_sales_mgr_email'
    					});
    				log.debug({title:'salesmanagerEmail ',details:salesmanagerEmail })
    					var linkedCaseId = appointmentrec.getValue({
    						fieldId:'custevent_linked_cases'
    					});
    				log.debug({title:'linkedCaseId ',details:linkedCaseId })
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
    						log.debug('102')
    			            var cSearch =search.create({
    			            	type:search.Type.SUPPORT_CASE,
    			            	filters:[
    			            		search.createFilter({
                                      name:'custevent_linked_cases',
                                      operator:'is',
                                      values:linkedCaseId
    			            		}),
    			            		search.createFilter({
    			            			name:'custevent_builder_sales_subd',
    			            			operator:'is',
    			            			values:primaryBsr
    			            		})
    			            	]
    			            });
    						log.debug({title:'cSearch ',details:cSearch })
    			            if(cSearch != null && cSearch.length >0)
    			            totalMailSent = cSearch.length;
    					}
    						log.debug('122')
    					ren01.defaultValue=totalMailSent;
    					ren02.defaultValue=bsrName;
    					
    					if(defValue(salesManager) != '')
    					{
    						log.debug('128')
    						
    						var smInfo =search.lookupFields({
    							type:search.Type.PARTNER,
    							id:salesManager,
    							columns:['firstname','lastname']
    						});
    						log.debug({title:'smInfo ',details:smInfo })
    						salesManagerName = smInfo.firstname+' '+smInfo.lastname;
    					}
    					
    					if(defValue(adminContact) != '')
    					{
    						 
    						var adminInfo =search.lookupFields({
    							type:search.Type.PARTNER,
    							id:adminContact,
    							columns:['firstname','lastname','email']
    						
    						});
    						log.debug({title:'adminInfo ',details:adminInfo })

    						adminName = adminInfo.firstname+' '+adminInfo.lastname;
    						adminContactEmail = adminInfo.email;
    					}
    					
    					if(defValue(primaryBsr) != '')
    					{
    						var fields = ['email','custentity_opt_opt_ren','custentity_opt_out_rtan'];
    						
    						var bpfields = search.lookupFields({
    							type:search.Type.PARTNER,
    							id:primaryBsr,
    							columns:fields
    						});
    						//optren = bpfields.custentity_opt_opt_ren;
    						optrtan = bpfields.custentity_opt_out_rtan;
    						bsremail = bpfields.email;
    						log.debug({title:'bpfields ',details:bpfields })
    					}
    					if(optrtan == 'F')  // (optren == 'F' || optrtan == 'F')
    					gotren = 'T';
    					
    					log.debug('171')

    				var ren1 =ren.addField ({
    						id:'custpage_rencheckbox2',
    						type:serverWidget.FieldType.CHECKBOX,
    						label:'Resend to Builder Sales Rep:'+ ' ' + bsrName
    					});
    					log.debug({title:'ren1 ',details:ren1 })
    				var ren2 =ren.addField({
    						id:'custpage_renemail2',
    						type:serverWidget.FieldType.EMAIL,
    						label:'Bsr Email',
    						displayType:serverWidget.FieldDisplayType.HIDDEN
    					});

    					ren2.updateDisplayType({
    						displayType:serverWidget.FieldDisplayType.HIDDEN
    					});
    					log.debug({title:'ren2 ',details:ren2 })
    					ren2.defaultValue=bsremail;
    					
    					/*if(optren == gotren)
    					{
    						ren1.setDisplayType('disabled');
    						ren2.setDisplayType('disabled');
    					}*/			
    				//	 log.debug({title:'salesManagerName',details:salesManagerName})
    					
    				/*	var ren5 = ren.addField({
    						id:'custpage_salesmanager2',
    						type:serverWidget.FieldType.CHECKBOX,
    						label:'Resend to Sales Manager:' + ' ' + salesManagerName
   					});
    					log.debug({title:'ren5 ',details:ren5 })    					
    					
    					var ren6 =ren.addField({
    						id:'custpage_salesmanageremail2',
    						type:serverWidget.FieldType.EMAIL,
    						label:'Sales Manager Email',
    						displayType:serverWidget.FieldDisplayType.HIDDEN
    					});
    					ren6.updateDisplayType({
    						displayType:serverWidget.FieldDisplayType.HIDDEN
    					})
    					log.debug({title:'ren6 ',details:ren6 })
    					ren6.defaultValue=salesmanagerEmail;
    					
    					
    					var ren7 =ren.addField({
    						id:'custpage_administrative2',
    						type:serverWidget.FieldType.CHECKBOX,
    						label:'Resend to Division Coordinator:' + ' ' + adminName
    					});
    					log.debug({title:'ren7 ',details:ren7 })
                        var ren8 =ren.addField({
                        	id:'custpage_administrativeemail2',
                        	type:serverWidget.FieldType.EMAIL,
                        	label:'Division Coordinator Email',
                        	
                           });
    					ren8.updateDisplayType({
    						displayType:serverWidget.FieldDisplayType.HIDDEN
    					})
    					log.debug({title:'ren8 ',details:ren8 })
    					ren8.defaultValue=adminContactEmail;
    					
    					
    					ren.addSubmitButton({
    						label:'Send Emails'
    					});
    					log.debug('232')
    					 ////////////////////////////Client scriptId/////////////////
    			ren.clientScriptFileId = 94179;
    					log.debug('235')
    				}
    				context.response.writePage(ren);	
    				log.debug('238')
    			}
    			else*/
    			{
    					var ren1 = context.request.parameters.custpage_rencheckbox|| 'F';
    					log.debug({title:'ren1 ',details:ren1 })
    					var renemail = context.request.parameters.custpage_renemail;
    					log.debug({title:'renemail ',details:renemail })
    					var sm1 = context.request.parameters.custpage_salesmanager|| 'F';
    					log.debug({title:'sm1 ',details:sm1 })
    					var smemail = context.request.parameters.custpage_salesmanageremail;
    					log.debug({title:'smemail ',details:smemail })
    					var adm1 = context.request.parameters.custpage_administrative|| 'F';
    					log.debug({title:'adm1 ',details:adm1 })
    					var admemail = context.request.parameters.custpage_administrativeemail;
    					log.debug({title:'admemail ',details:admemail })
    					var CaseId = context.request.parameters.custpage_recordid;
    					log.debug({title:'CaseId ',details:CaseId })
    					
    					body = 'params ren1 '+ren1+', renemail '+renemail+', sm1 '+sm1;
    					body += ', smemail '+smemail+', adm1 '+adm1+', admemail '+admemail+', CaseId '+CaseId;
    				//	nlapiLogExecution('DEBUG', 'Body : ', body);
    					
    					if(defValue(CaseId) != '')
    					{
    							
    						var supportcase = record.load({
    							type:record.Type.SUPPORT_CASE,
    							id:CaseId
    						});
    						log.debug({title:'supportcase ',details:supportcase })
    				
    						var agentFullName =supportcase.getValue({
    							fieldId:'custevent_agent_for_ren'
    								});
    						log.debug({title:'agentFullName ',details:agentFullName })
    						var subdivision = supportcase.getValue({
    							fieldId:'custevent_subdivision_for_ren'
    								});	
    						log.debug({title:'subdivision ',details:subdivision })
    						var propertyId = supportcase.getValue({
    							fieldId:'custevent_property'
    								});
    						log.debug({title:'propertyId ',details:propertyId })
    						var linkedCaseId = supportcase.getValue({
    							fieldId:'custevent_linked_cases'
    								});
    						log.debug({title:'linkedCaseId ',details:linkedCaseId })
    						var primaryBsr = supportcase.getValue({
    							fieldId:'custevent_builder_sales_rep_subd'
    								});
    						log.debug({title:'primaryBsr ',details:primaryBsr })
    						var emailSubject = "Re-sending : New Inquiry From "+agentFullName+" For "+subdivision;
    						var needupdate1 = false;
    						var emailBody = '';
    						
    						 log.debug('296')
    				
    						var callerType=supportcase.getValue({fieldId:'custevent_caller_type'});
    						log.debug({title:'callerType',details:callerType})
    						var division =  supportcase.getValue({fieldId:'company'});
    						var bsr_email={};
    					
    						log.debug({
    							title:'division ',
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
    									id: arr[z],
    									columns:'email'
    								});
    								bsr_email[arr[z]]=b_mail;
    							}
    						}}catch(eb){
    							bsr_email={};
    							log.debug({
    								title:'error eb',
    								details:eb
    							});
    						}
    						  var imageurl='';
    							try{
    							
    								var imageid=search.lookupFields({
    									type:search.Type.CUSTOMER,
    									id: division,
    									columns:'image'
    								});
    								if(!imageid){
    									
    									var builder_parent=search.lookupFields({
    										type:search.Type.CUSTOMER,
    										id: division,
    										columns:'parent'
    									});
    								
    									imageid=search.lookupFields({
    										type:search.Type.CUSTOMER,
    										id: builder_parent,
    										columns:'image'
    									});
    									
    									log.debug({
    										title:'builder_parent',
    										details:builder_parent
    									});
    								
    									image_file=file.load({
    									    id: imageid
    									});
    									;
    									var fileId = image_file.save;
    									imageurl=image_file.url;
    								}else{
    								
    									var image_file =file.load({
    										id:imageid
    									});
    								    imageurl=image_file.url;
    								}
    							}catch(ier){
    							
    								log.debug({
    									title:'error image',
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
    							
    		 // Footer Email..
    					  
    					   var emailMerger = render.mergeEmail({
   						    templateId: 77,
   						    entity:null,
   						    recipient:null,
   						    supportCaseId:81157 ,
   						    transactionId: null,
   						    customRecord: null
   						        
   						    });
    					   log.debug({title:'emailMerger ',details:emailMerger })
    					 // var mergeResult = emailMerger.merge;
    					  // log.debug({title:'mergeResult ',details:mergeResult })

    				       var emailFooter = emailMerger.body;
    					   log.debug({title:'emailFooter ',details:emailFooter })
    					   var CaseIds = [];
    						
    				       
    						log.debug('422')
    						if(defValue(linkedCaseId) != '' && defValue(primaryBsr) != '')
    						{log.debug('424')
    							 var cSearch =search.create({
    	    			            	type:search.Type.SUPPORT_CASE,
    	    			            	filters:[
    	    			            	         search.createFilter({
    	    			            	        	name:'internalid',
    	    			            	        	operator:'is',
    	    			            	        	values:CaseId
    	    			            	         }),
    	    			            	         search.createFilter({
    	     			            	        	name:'custevent_linked_cases',
    	     			            	        	operator:'is',
    	     			            	        	values:linkedCaseId
    	     			            	         }),
    	     			            	        search.createFilter({
    	    			            	        	name:'custevent_builder_sales_rep_subd',
    	    			            	        	operator:'is',
    	    			            	        	values:primaryBsr
    	    			            	         }),
    	    			            	         ],
    							 columns:[
    							         search.createColumn({
    							        	 name:'custevent_property'
    							         })
    							          ]
    	    			            });  
    						
    						var cSearchCount = cSearch .runPaged().count;
   log.debug("searchRcd result count",cSearchCount );
var cSearchRun = cSearch.run();
var cSearchResult = cSearchRun .getRange({start:0,end:1})
log.debug({title:'cSearch ',details:cSearch })
log.debug({title:'cSearchResult ',details:cSearchResult })

log.debug({title:'cSearchRun ',details:cSearchRun })
   						}
    			
	            	    	
    			            if(cSearchResult != null && cSearchResult .length >0)
    			            {
    			            	log.debug('464')
    			            	  var file1 = file.load({
    			            		  id:'39813'
    			            	  })
    			        			var data=file1.getContents();
    			        		   log.debug({title:'data',details:data})
    			        		    var emailMerger = render.mergeEmail({
    		   						    templateId: 97,
    		   						    entity:null,
    		   						    recipient:null,
    		   						    supportCaseId: 81157,
    		   						    transactionId: null,
    		   						    customRecord: null
    		   						   		   						        
    		   						    });
    			        		    //var mergeResult = emailMerger.merge();
    			        	        var emailBody = emailMerger.body;
    			        	        log.debug( '206');
    			        	        var emailBody_table = '';
    			            	for(var i=0; i<cSearchResult .length; i++)
    		            	    {
    		            	    	//var PropertyId = cSearchResult [i].getValue({name:'custevent_property'});
    		            	    	//log.debug({title:'PropertyId',details:PropertyId})
    		            	    	var CaseIId = cSearchResult [i].id
    		            	    	log.debug('489',CaseIId )
    		            	    	var decrypted  = '';
    		                     	CaseIds.push(CaseIId);		
    		                    	log.debug('CaseIds',CaseIds )
    			           	     var emailMerger_table = render.mergeEmail({
 		   						    templateId: 98,
 		   						    entity:null,
 		   						    recipient:null,
 		   						    supportCaseId: 81157,
 		   						    transactionId: null,
 		   						    customRecord: null
 		   						   		   						        
 		   						    });
log.debug('502')
    			           	        //  var mergeResult_table = emailMerger_table.merge();
    			           		    var eBody = emailMerger_table .body
    			           		    log.debug('eBody')
    			           		   // var CryptoJS = require("crypto-js");
    			           		    /////////-------to be checked for crypto module----////////////
    		       				    if(defValue(PropertyId) != '')
    		       				    {log.debug('506')
    		       					   var encrypted = crypto.AES.encrypt(PropertyId,SecretKey);
    		       				 log.debug('525 encrypted ',encrypted )
    			                		decrypted = CryptoJS.AES.decrypt(encrypted,SecretKey).toString();  
    			                		log.debug('509')
    		                		     record.submitFields({
    		                		    	 type:'customrecord_property_record',
    		                		    	 id:PropertyId,
    		                		    	 fields:'custrecord_secret_code',
    		                		    	 values:decrypted,
    		                		    	 enableSourcing:true
    		                		     })
    		                		     log.debug('517')
    		       				    }
    		       	        	  
    			                	//eBody = eBody.replace('encryptId', decrypted); 
    			           		    eBody=eBody.replace(/{/g, '<');
    			           		    eBody=eBody.replace(/}/g, '>'); 
    			             	 	emailBody_table+=eBody;
    			             	 	     				         
    		            	    }	
    			            	  log.debug('517')
    		        		    data=data.replace('{propertyrequested}',emailBody_table);
    		        		    emailBody=emailBody.replace('propertyrequested',data);
    		        		    emailBody=emailBody.replace('logoimage', imageurl);
    		        		    log.debug('517')
    			            }		
    					  if(CaseIds.length > 0)
    					  {		
    			 			   var records =  new Object();
    			 			   records['activity'] = CaseId;	
    			 			   
    							if(defValue(propertyId) != '')
    							{
    								var fields = ['custrecord_house_number','custrecord_lot_number'];
    							
    								var propertyInfo =search.lookupFields({
    									type:'customrecord_property_record',
    									id:propertyId,
    									columns:fields
    								})
    								var houseNumber = propertyInfo.custrecord_house_number;
    								var lot = propertyInfo.custrecord_lot_number;
    								emailSubject +=lot+' '+houseNumber;	
    							}		
    						   if(ren1 == 'T')
    						   {					
    								body = emailBody
    								body=body.replace('bsrid', primaryBsr);
//    								nlapiSendEmail(callCenter,'govind@webbee.biz',emailSubject,body);
    								if(defValue(renemail) != '')
    								{		
    									
    									email.send({
    										author:callCenter,
    										recipients:renemail,
    										replyTo:null,
    										cc:null,
    										bcc:null,
    										subject:emailSubject,
    										body:body,
    										relatedRecords:records
    									})

    									for(var bm in bsr_email){
    					            		var t_body=emailBody;
    					            		var bsr_nsid=bm;
    					            		bsr_mail_id=bsr_email[bm];
    					            		t_body=t_body.replace('bsrid', bsr_nsid);
//    					            		nlapiSendEmail(callCenter,'govind@webbee.biz',emailSubject,t_body);
    					                  
    					                    email.send({
        										author:callCenter,
        										recipients:bsr_mail_id,
        										replyTo:null,
        										cc:null,
        										bcc:null,
        										subject:emailSubject,
        										body:t_body,
        										relatedRecords:records
        									})
    					            	}
    								
    								//	nlapiSendEmail(callCenter,bcc, emailSubject, emailBody1,null,null, records);		
    									needupdate1 = true;	
    								}
    						   }	
    						 if(sm1 == 'T' || adm1 == 'T')
    						 {

    							 //smTemplate
    								
    								var emailMerger = render.mergeEmail({
     		   						    templateId: 99,
     		   						    entity:null,
     		   						    recipient:null,
     		   						    supportCaseId:81157,//CaseIds[0],
     		   						    transactionId: null,
     		   						    customRecord: null
     		   						   		   						        
     		   						    });
    								//var mergeResult = emailMerger.merge();
    								var emailbody_nl = emailMerger.body;
    								emailbody_nl=emailbody_nl.replace('propertyrequested',data);
    				                emailbody_nl=emailbody_nl.replace('logoimage',imageurl);
    					        var CC = [];
    					    	if(sm1 == 'T' && defValue(smemail) != '')
    					    	CC.push(smemail);	
    					    	
    					    	if(adm1 == 'T' && defValue(admemail) != '')
    						    CC.push(admemail);	
    						        
    							if(CC.length > 0)
    							{				
    					        	
    					        	 email.send({
 										author:callCenter,
 										recipients:CC,
 										replyTo:null,
 										cc:null,
 										bcc:null,
 										subject:emailSubject,
 										body:emailbody_nl,
 										relatedRecords:records
 									})
    								//nlapiSendEmail(callCenter,bcc,emailSubject, emailBody1,null, null, records);	
    								needupdate1 = true;
    							}	
    						 }	
    						if(needupdate1)
    						{
    							
    						var currenttime =	 format.format({value:new Date(), type: format.Type.DATETIMETZ})
    							 var fields = ['custevent_email_notification_attempts','custevent_hms_last_ren_sent_date_time'];					
    							 for(var j=0; j<CaseIds.length ; j++)
    							
    							 record.submitFields({
	                		    	 type:record.Type.SUPPORT_CASE,
	                		    	 id:CaseIds[j],
	                		    	 fields:fields[1],
	                		    	 values:currenttime,
	                		    	 enableSourcing:true
	                		     })
    							 body = 'Cases : '+CaseIds+' REN Email Resent';
    							log.debug({title: 'Body : ',details: body});
    						}	
    						 SuccessForm(context);			
    					  }	  // if cases exist		
    				}					
    		   }
   	    }	
    		catch(ex)
   		{
    		   body = 'CreateRENPage, Exception : '+ex+', Message : '+ex.message;
    		   log.debug({title: 'error : ',details: body});
    		
    		   email.send({	
    			   author:4276,
					recipients:'shikha@webbee.biz',
					replyTo:null,					
					cc:null,
					bcc:null,
				subject:'test',
				body:body
								})
    		}
    	}
    }
    	function SuccessForm(context)
    	{
    		try
    		{
    			

    			var form = serverWidget.createForm({
    			    title : 'Success'
    			});
    			
    			var success = form.addField({
					id:'success2',
					type:serverWidget.FieldType.TEXT,
					label: 'Email Sent Successfully .',
					displayType:serverWidget.FieldDisplayType.INLINE
						
				});
				//ren0.defaultValue(recordid);
    					
    			
    			form.addButton({
    			    id : 'custpage_ok',
    			    label : 'OK',
    			    	functionName:'window.close()'
    			});
    			context.response.writePage(form);
    		}
    		catch(ex)
    		{
    		   body = 'SuccessForm, Exception : '+ex+', Message : '+ex.message;
    		   log.debug({title: 'Body : ',details: body});
    		   email.send({
					author:'4276',
					recipients:'shikha@webbee.biz',
					replyTo:null,
					cc:null,
					bcc:null,
					subject:'HMS Marketing , Resending REN',
					body:body
									})
    		   context.response.write('ex');
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
    		   log.debug({title: 'Body : ',details: body});

    	       return '';
    		}
    	}
    

    return {
        onRequest:CreateRENPage
    };
    
});
