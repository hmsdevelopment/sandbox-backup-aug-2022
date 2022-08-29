/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
var bcc = [];
	bcc.push('pranjal@webbee.biz');
	bcc.push('aj@webbeeglobal.com');

define(['N/record','N/render','N/email','N/format','N/url'],

function(record,render,email,format,url) {
   
	
	function rapidEmailNotification(type)
	{
	 log.debug({
		title:'rapidEmailNotification function start'
	 });
		try
		{
			log.debug({
				title:'type : ',
			    details:type
			});
				
		//	if(type == 'edit' || type== 'create')
			//{
			
             var builder=record.getValue({
            	fieldId:'company'
             });
			if(builder!='3643'&&builder!='3642'){
				var statusID = record.getValue({
					fieldId:'status'
						});
				////////////////var id = nlapiGetRecordId();
				var id=record.id();
				
				var searchType = record.getValue({
					fieldId:'custevent_subdivision_search'
				});
				
				var subdivisionId = record.getValue({
					fieldId:'custevent_subdivision'
				});
			
				var propertyText =record.getText({
					fieldId:'custevent_property'
				});
			
				var copyToBuilder = record.getValue({
					fieldId:'custevent_hms_copy_to_ren1'
				});
				var copytobuilderarray = [];
				if(copyToBuilder)
				{
					for(var a in copyToBuilder)
					copytobuilderarray.push(copyToBuilder[a]);
				}
				var copyToBuilderCount = 0
				if(copytobuilderarray);
				copyToBuilderCount = copytobuilderarray.length;
					
		
				var builderSuppliedLead = record.getValue({
					fieldId:'custevent_builder_lead'
				})
				var index = propertyText.indexOf("|");
				var builder = propertyText.substring(index);
				
				var category = record.getValue({
					fieldId:'category'
				});
			
				var renSent = record.getValue({
					fieldId:'custevent_ren_sent'
				});
				
				var renEnabled = record.getValue({
					fieldId:'custevent_ren_enabled'
				});
				
				var topLevelBuilder=record.getValue({
					fieldId:'custevent_builder'
				});
				
				var subdivision = record.getValue({
					fieldId:'custevent_subdivision_for_ren'
				});
				
				var copyOnREN = null;
				var copyOnBuilderLeads = null;
				var copyOnBuilderLeadsDivision = null;
				
				var division =record.getValue ({
					fieldId:('company')|| ''
				});
				
				var companyText = record.getText({
					fieldId:'company'
				});
				var copyOnRENDivision = '';
				var notificationMethod = '';
				var enableEmailNotification = '';
				var bsrTemplate = 0
				var smTemplate = 0
				if(division)
				{
					
					var builderDivision = record.load({
						Type:record.Type.CUSTOMER,
						Id: division
					});
					
					copyOnRENDivision = builderDivision.getValue({
						fieldId:'custentity_copy_on_ren'
					});
					
					notificationMethod = builderDivision.getValue({
						fieldId:'custentity_appt_notification_method'
					});
				
					enableEmailNotification = builderDivision.getValue({
						fieldId:'custentity8'
					});
				}
				
				var showingAssist = record.getValue({
					fieldId:'custevent_showing_assist'
				});
				
                var bsrNotifySent = record.getValue({
                	fieldId:'custevent_bsr_notify_sent'
                });
				
				var agent = record.getValue({
					fieldId : 'custevent_caller_name'
				});
				var agentFirstName = '';
				var agentLastName = '';
				var agentFullName = '';
				if(agent)
				{
					
					var agentRecord=record.load({
						type:'customrecord_agent',
						id:agent
					});
					
					agentFirstName = agentRecord.getValue({
						fieldId:'custrecord_agent_first_name'
					});
					
					agentLastName = agentRecord.getValue({
					fieldId:'custrecord_agent_last_name'
					});
					agentFullName = agentFirstName + ' ' + agentLastName;
				}
				
				
				var bsrID = record.getValue({
					fieldId:'custevent_builder_sales_rep_subd'
				});
				var bsrFname = '';
				var bsrLname = '';
				if(bsrID)
				{
					
					var bsrRecord = record.load({
						type:record.Type.PARTNER,
						Id:bsrID
					
					});
				
					bsrFname = bsrRecord.getValue({
						fieldId:'firstname'
					});
					
					bsrLname = bsrRecord.getValue({
						fieldId:'lastname'
					});
				}
				
				var smOptOut = record.getValue({
					fieldId:'custevent_sm_opt_out'
				});
				
				var dmOptOut = record.getValue({
					fieldId:'custevent_dm_opt_out'
				});
				
				var adminOptOut = record.getValue({
					fieldId:'custevent_admin_opt_out'
				});
				
				var smOptOutRTAN = record.getValue({
					fieldId:'custevent_sm_opt_out_rtan'
				});
			
				var dmOptOutRTAN = record.getValue({
					fieldId:'custevent_dm_opt_out_rtan'
				});
				
				var dmID = record.getValue({
					fieldId:'custevent8'
				});
				var optOutBuilderLeads = 'F';
				if (dmID)
				{
					
					var dmRecord = record.load({
						type:record.TYpe.PARTNER,
						id:dmID
					});
					
					optOutBuilderLeads = dmRecord.getValue({
						fieldId:'custentity_opt_out_builder_leads'
					});
				}
				
				var smID = record.getValue({
					fieldId:'custevent7'
				});
				if (smID)
				{
				
					var smRecord = record.load({
						type:record.Type.PARTNER,
						Id:smID
					});
					
					smOptOutBuilderLeads = smRecord.getValue({
						fieldId:'custentity_opt_out_builder_leads'
					});
				}
				
				var adminOptOutRTAN = record.getValue({
					fieldId:'custevent_admin_opt_out_rtan'
				})
				
				var bsrOptOut = record.getValue({
					fieldId:'custevent_bsr_opt_out'
				});
				if (searchType == '1')
				{
					
					var propertyId = record.getValue({
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
						 
						 houseNumber = propert.getValue({
							fieldId:'custrecord_house_number' 
						 });
						
						 street = property.getText({
							fieldId:'custrecord31' 
						 });
						
						 lot = property.getValue({
							fieldId:'custrecord_lot_number' 
						 });
						 bsrTemplate = 48;//22
						 smTemplate = 62;//23
					}
					if (builderSuppliedLead == 'T')
					{
						var subject = "New Web Lead Assigned To " + bsrFname + ' ' + bsrLname + " For " + agentFullName; //subdivision + " Lot " + lot;
					}
					else
					{
						if(lot)
						{
							var subject = "New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;
						}
						else
						{
							var subject = "New Inquiry From " + agentFullName + " For " + subdivision
						}
						
					}
				}
				else if (searchType == '2')
				{
					var subject = "New Web Lead Assigned To " + bsrFname + ' ' + bsrLname + " For " + agentFullName; //subdivision;
					bsrTemplate = 63;//34
					smTemplate = 64;//35
				}
				else if (searchType == '3')
				{
					var subject = "New Web Lead Assigned To " + bsrFname + ' ' + bsrLname + " For " + agentFullName; // companyText;
					//if (copyToBuilderCount == 1)
					//{
						bsrTemplate = 66;//39
						smTemplate = 67;//41
					//}
					//else
					//{
					//	bsrTemplate = 36;
					//}
					
				}/////////////////////////////////////////////////////////
				
				var salesManagerEmail = record.getValue({
					fieldId:'custevent_sales_mgr_email'
				});
				
				var divManagerEmail = record.getValue({
					fieldId:'custeventdivision_mgr_email'
				});
				
				var adminAsstEmail = record.getValue({
					fieldId:'custevent_administrative_contact_email'
				});
				
				var bsrEmail = bsrRecord.getValue({
					fieldId:'email'
				});
				
				var bsrOptOutRTAN = bsrRecord.getValue({
					fieldId:'custentity_opt_out_rtan'
				});
			
				var bsrOneTimeOptOut = record.getValue({
					fieldId:'custevent_one_time_ rtan_opt_out'
				});
				if(topLevelBuilder != null && topLevelBuilder != '')
				{
					
					var topLevelBuilderRecord = record.getValue({
						Type:record.Type.CUSTOMER,
						Id:topLevelBuilder
					});
				
					copyOnRrn = topLevelBuilderRecord.getValue({
						fieldId:'custentity_copy_on_ren'
					});
					if (builderSuppliedLead == 'T')
					{
					copyOnBuilderLeads = topLevelBuilderRecord.getValue({
						fieldId:'custentity_copy_on_builder_leads'
					});
					}
				}

				var cc = new Array();
				var n = 0;
				
				if(copyOnREN != null && copyOnREN != '')
				{
					if(copyOnREN[0].length == 1)
					{
						
						var copyUser = record.load({
							Type:record.Type.PARTNER,
							Id:copyOnREN
						});
						
						var copyUserEmail = copyUser.getValue({
							fieldId:'email'
						})
						cc[n] = copyUserEmail;
						n++;
					}

					else
					{
						for(var i=0; copyOnREN.length > i; i++)
						{
							
							var copyUser = record.load({
								Type:record.Type.PARTNER,
								Id:copyOnREN[i]
							});
							
							var copyUserEmail = copyUser.getValue({
								fieldId:'email'
							});
							cc[n] = copyUserEmail;
							n++;
						}
					}
				}

				if(copyOnRENDivision != null && copyOnRENDivision != '')
				{
					if(copyOnRENDivision[0].length == 1)
					{
						
						var copyUser = record.load({
							Type:record.Type.PARTNER,
							Id:copyOnRENDivision
						});
					
						var copyUserEmail = copyUser.getValue({
							fieldId:'email'
						});
						cc[n] = copyUserEmail;
						n++;
					}

					else
					{
						for(var i=0; copyOnRENDivision.length > i; i++)
						{
							
							var copyUser = record.load({
								Type:record.Type.PARTNER,
								Id:copyOnRENDivision[i]
							})
					
							var copyUserEmail = copyUser.getValue({
								fieldId:'email'
							});
							cc[n] = copyUserEmail;
							n++;
						}
					}
				}

				if(divManagerEmail != '' && divManagerEmail != null && dmOptOut == 'F')
				{
					cc[n] = divManagerEmail;
					n++;
				}
			
				if (salesManagerEmail)
				{
					if(salesManagerEmail != '' && salesManagerEmail != null && smOptOut == 'F')
					{
						cc[n] = salesManagerEmail;
						n++;
					}
				}
				/*
				if(adminAsstEmail != '' && adminAsstEmail != null && adminOptOut == 'F')
				{
					cc[n] = adminAsstEmail;
					n++;
				}*/
				
				if(division != null && division != '')
				{
					
					var divisionRecord = record.load({
						Type:record.Type.CUSTOMER,
						Id:division
					});
			
			copyOnBuilderLeadsDivision = divisionRecord.getValue({
				fieldId:'custentity_copy_on_builder_leads'
			});	
				}
				
				var ccRTAN = new Array();
				

				
				if (builderSuppliedLead == 'T')
				{
					ccRTAN[0] = 'ahencheck@hmsmarketingservices.com'
					var r = 1;
					if(copyOnBuilderLeads != null && copyOnBuilderLeads != '')
					{
						if(copyOnBuilderLeads[0].length == 1)
						{
							
							var copyUser = record.load({
								Type:record.Type.PARTNER,
								Id:copyOnBuilderLeads
							});
							
							var copyUserEmail = copyUser.getValue({
								fieldId:'email'
							});
							ccRTAN[r] = copyUserEmail;
							r++;
						}

						else
						{
							for(var i=0; copyOnBuilderLeads.length > i; i++)
							{
							
								var copyUser = record.load({
									Type:record.Type.PARTNER,
									Id:copyOnBuilderLeads[i]
								})
								
								
								var copyUserEmail = copyUser.getValue({
									fieldId:'email'
								});
								ccRTAN[r] = copyUserEmail;
								r++;
							}
						}
					}
					if(copyOnBuilderLeadsDivision != null && copyOnBuilderLeadsDivision != '')
					{
						if(copyOnBuilderLeadsDivision[0].length == 1)
						{
						
							var copyUser = record.load({
								Type:record.Type.PARTNER,
						        Id:copyOnBuilderLeadsDivision	
							});
							
							var copyUserEmail = copyUser.getValue({
								fieldId:'email'
							});
							ccRTAN[r] = copyUserEmail;
							r++;
						}

						else
						{
							for(var i=0; copyOnBuilderLeadsDivision.length > i; i++)
							{
								
								var copyUser = record.load({
									Type:record.Type.PARTNER,
									Id  :copyOnBuilderLeadsDivision
								});
								
								var copyUserEmail = copyUser.getValue({
									fieldId:'email'
								})
								ccRTAN[r] = copyUserEmail;
								r++;
							}
						}
					}
				}
				else
				{
					r = 0;
				}
				
				if (builderSuppliedLead == 'F')
				{
					if(copyOnREN != null && copyOnREN != '')
					{
						if(copyOnREN[0].length == 1)
						{
							
							var copyUser = record.load({
								Type:record.Type.PARTNER,
								Id:copyOnREN
							});
							
							var copyUserEmail = copyUser.getValue({
								fieldId:'email'
							});
							
							ccRTAN[r] = copyUserEmail;
							r++;
						}

						else
						{
							for(var i=0; copyOnREN.length > i; i++)
							{
								
								var copyUser = record.load({
									Type:record.Type.PARTNER,
									Id:copyOnREN[i]
								});
								
								var copyUserEmail = copyUser.getValue({
									fieldId:'email'
								});
								ccRTAN[r] = copyUserEmail;
								r++;
							}
						}
					}

					if(copyOnRENDivision != null && copyOnRENDivision != '')
					{
						if(copyOnRENDivision[0].length == 1)
						{
							
							var copyUser = record.load({
								Type:record.Type.PARTNER,
								Id:copyOnRENDivision
							}) ;
							
							var copyUserEmail = copyUser.getValue({
								fieldId:'email'
							})
							ccRTAN[r] = copyUserEmail;
							r++;
						}

						else
						{
							for(var i=0; copyOnRENDivision.length > i; i++)
							{
								
								var copyUser = record.load({
									Type:record.Type.PARTNER,
									Id:copyOnRENDivision[i]
								});
							
								var copyUserEmail = copyUser.getValue({
									fieldId:'email'
								})
								ccRTAN[r] = copyUserEmail;
								r++;
							}
						}
					}
				}
				
				if(builderSuppliedLead == 'T')
				{
					if(divManagerEmail != '' && divManagerEmail != null && optOutBuilderLeads == 'F')
					{
						ccRTAN[r] = divManagerEmail;
						r++;
					}
				}
				else
				{
					if(divManagerEmail != '' && divManagerEmail != null && dmOptOutRTAN == 'F')
					{
						ccRTAN[r] = divManagerEmail;
						r++;
					}
				}
				if(builderSuppliedLead == 'T')
				{
					if(salesManagerEmail != '' && salesManagerEmail != null && smOptOutBuilderLeads == 'F')
					{
						ccRTAN[r] = salesManagerEmail;
						r++;
					}
				}
				else
				{
					if(salesManagerEmail != '' && salesManagerEmail != null && smOptOutRTAN == 'F')
					{
						ccRTAN[r] = salesManagerEmail;
						r++;
					}
				}

				/*if(adminAsstEmail != '' && adminAsstEmail != null && adminOptOutRTAN == 'F')
				{
					ccRTAN[r] = adminAsstEmail;
					r++;
				}*/

				
				var records = new Object();
				//records['record'] = propertyId;
				//records['recordtype'] = '18';
				records['activity'] = id;

				
				var stage = record.getValue({
					fieldId:'stage'
				});
				var currenttime = currentdatetime();
				if(renSent == 'F')
				{
					if(bsrNotifySent == 'F' && notificationMethod == '1' && enableEmailNotification == 'T' && bsrOptOutRTAN =='F' && bsrOneTimeOptOut =='F' && stage =='OPEN')
					{
						
						//var body = nlapiMergeRecord(bsrTemplate, 'supportcase', id);
						var emailBody1 = '';
						if(bsrID == 4126)
						{

							
							var output = url.resolveScript({
							    scriptId:181,
							    deploymentId:1,
							    returnExternalUrl: true
							});
							url += '&apptid='+id;
							
							emailBody1 += '<br/><br/>';
							emailBody1 += '<b>Please click over ';
							emailBody1 += '<a target = "_blank" href = "'+url+'">';
							emailBody1 += 'I Will Follow Up';
							emailBody1 += '</a>';
							emailBody1 +=' link to close this case ..</b><br/><br/>';
						}	
						
					
						 var emailMerger1 = render.mergeEmail({            
								templateId: bsrTemplate,         
								entity: null,
								recipient: null,
								supportCaseId: id, 
								transactionId: null,
								customRecord: null
								});
						 
						 var mergeResult1 = emailMerger1.merge();
						 emailBody1 += mergeResult1.getBody();
						 
						 email.send({
								author:'3847',
								recipients:renemail,
								replyTo:null,
								cc:null,
								bcc:null,
								subject:subject,
								body:emailBody,
								attachments:null,
								relatedRecords:records
							});
						 
					
					    if(bsrID == 4126)
					
						email.send({
		                 author:'3847',
		                 recipients:bsrEmail,
		                 replyTo:null,
		                 cc:null,
		                 bcc:bcc,
		                 subject:subject,
		                 attachments:null,
                         relatedRecords:record		                	 
						});
					    else
					 
		                email.send({
		                	author:'3847',
		                	recipients:bsrEmail,
		                	replyTo:null,
		                	cc:null,
		                	bcc:null,
		                	subject:subject,
		                	body:emailBody1,
		                	attachments:null,
		                	relatedRecords:records
		                });
		               
		                record.submitField({
		                	type:record.Type.SUPPORT_CASE,
		                    id:id,
		                    fields:'custevent_bsr_notify_sent',
		                    values:null,
		                    enableSourcing:true
		                });
					
						record.submitField({
							type:record.Type.SUPPORT_CASE,
							id:id,
							fields:'custevent_hms_last_ren_sent_date_time',
							values:currenttime
								
						});
						if(ccRTAN[0])
						{
							//var noLinksBody = nlapiMergeRecord(smTemplate, 'supportcase', id);
						var emailMerger2 = render.mergeEmail({
								templateId:smTemplate,
								entity:null,
								recipient:null,
								supportCaseId:id,
								transactionId:null,
								customRecord:null
							});
						
						var mergeResult2 = emailMerger2.merge();
						var emailBody2 = mergeResult2.getBody();
						
							email.send({
			                	author:'3847',
			                	recipients:bsrEmail,
			                	replyTo:null,
			                	cc:null,
			                	bcc:null,
			                	subject:subject,
			                	body:emailBody1,
			                	attachments:null,
			                	relatedRecords:records
			                });
												
							email.send({
								author:'3847',
								recipients:ccRTAN[0],
								replyTo:null,
								cc:ccRTAN,
								subject:subject,
								body:emailBody2,
								attachments:null,
								relatedRecords:records
							});
							return true;
						}
								
					}
					
					else if(renEnabled == 'T')
					{
						//*TEST ON SINGLE APPOINTMENT RECORD*if(renSent == 'F' && (statusID == '5' || statusID == '6') && (category == '1' || category == '2') && id == '695')
						if(bsrOptOutRTAN == 'T' && (statusID == '5' || statusID == '6' || statusID == '11'))
						{
							//var body = nlapiMergeRecord(1, 'supportcase', id);
							
						var emailMerger2 = render.mergeEmail({
								templateId:68,
								entity:null,
								recipients:null,
								supportCaseId:id,
								transactionId:null,
								customRecord:null
							});
							
							var mergeResult2 = emailMerger2.merge();
							var emailBody2 = mergeResult2.getBody;
							
							if(bsrEmail != '' && bsrEmail != null)
							
							email.send({
								author:'3847',
								recipients:bsrEmail,
								replyTo:null,
								cc:cc,
								bcc:null,
								subject:subject,
								body:emailBody2,
								attachments:null,
								relatedRecord:records
							});
							else				
							
                            email.send({
                            	author:'3847',
                            	recipients:cc[0],
                            	replyTo:null,
                            	cc:cc,
                            	bcc:null,
                            	subject:subject,
                            	body:emailBody2,
                            	attachments:null,
                            	relatedRecord:records
                           
                            });
							
							record.submit({
								type:record.Type.SUPPORT_CASE,
								id:id,
								fields:'custevent_ren_sent',
								values:null,
								enableSourcing:true
							});
						
							record.submit({
								type:record.Type.SUPPORT_CASE,
								id:id,
								fields:'custevent_hms_last_ren_sent_date_time',
								values:currenttime
							});
							log.debug({
								title:"rapidEmailNotification() end"
							});
						}
					}
				}
		//	}	
		
		}}
		catch(e)
		{
			
			log.error({
				title:'Message',
				details:e.message
			});
		}
	}

	function currentdatetime()
	{
		var cdate = new Date();
		
		var time = format.format({
			value:cdate,
			type:format.Type.DATETIMETZ
			
		});
		//time = nlapiStringToDate(time,'datetimetz');
		return time;
	}

	function setPropertyForREN()
	{
		try
		{
			log.debug({
				title:"setPropertyForREN() start"
			});
	
		 var builder = record.getValue('company');
			if(builder!='3643'&&builder!='3642'){
		
		var propertId = record.getValue({
		   fieldId:'custevent_property'	
		})
		if(propertyId != null && propertyId != '')
		{
			var propert = record.load({
				type:'customrecord_property_record',
				fieldId:propertyId
			});
			
			var houseNumber = property.getValue({
				fieldId:'custrecord_house_number'
			});
			
		
			var street = property.getText({
				fieldId:'custrecord31'
			});
			
			var builderDivision = property.getValue({
				fieldId:'custrecord12'
			});
						
			var builderDivisionRecord = record.load({
				type:record.Type.CUSTOMER,
				fieldId:builderDivision
			});
		
			var enableREN = builderDivisionRecord.getValue({
				fieldId:'custentity_enable_ren'
			});
		
			record.setValue({
				fieldId:'custevent_ren_enabled',
				value:enableREN
			});
			
			record.setValue({
				fieldId:'custevent_property_for_ren',
				value:houseNumber + " " + street
			});
			log.debug({
				title:"setPropertyForREN() end"
			});
		}}

		return true;
		}
		catch(e)
		{
			return true;
		}

	}
	

    return {
    	afterSubmit: rapidEmailNotification
    
    };
    
});
