/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/log','N/record','N/email','N/https','N/search'],

function(runtime,log,recordAll,email,https,search) {
	
	  
    /*var acctype = runtime.getCurrentScript();//.getSetting('SCRIPT','custscript_sub_account_type') || '');
    var CaseId = acctype.getParameter({name: 'custscript_sub_account_type'});
    log.debug({
    	title:'acctype ',
    	details:acctype 
    });
    log.debug({
    	title:'CaseId ',
    	details:CaseId 
    });
	
   var username1 = runtime.getCurrentScript()//.getSetting('SCRIPT','custscript_sub_account_1'));
    log.debug({
    	title:'username1 ',
    	details:username1 
    });
    //var password1 = runtime.getCurrentScript()//.getSetting('SCRIPT','custscript_sub_password_1'));
    
   /* var username2 = (runtime.getCurrentScript().getSetting('SCRIPT','custscript_sub_account_2'));
    var password2 = (runtime.getCurrentScript().getSetting('SCRIPT','custscript_sub_password_2'));
  
    var username3 = (runtime.getCurrentScript().getSetting('SCRIPT','custscript_sub_account_3'));
    var password3 = (runtime.getCurrentScript().getSetting('SCRIPT','custscript_sub_password_3'))*/

	var onedaybefore = '';
	var ondemoday = '';
	var username = '';
	var password = '';
	var noofreply = 0;
	function SendSMS(scriptContext)
	{ var type = scriptContext.type;
    log.debug(type);
    var record = scriptContext.newRecord
    var form = scriptContext.form
    log.debug({
  	  title:'record',
  	  details:record
    })
     var id = record.id;
  
  log.debug({
	  title:'id',
	  details:id
   });
 
      var customForm = record.getValue({
  	 fieldId:'customform' 
    });
    
    log.debug({
  	title:'customForm',
  	details:customForm
    });
		
		log.debug({
			title:'SendSMS function start'
		});
		 if(	 scriptContext.type=='edit' && id==81157  && customForm==85)
		 {
			  log.debug({
			    	title:' enter in main function '
			    });
		try
		{  
			var id = recordAll.id

			log.debug({
				title:('id ',' record id '),
				details:id
			})
			 
			 var type = scriptContext.type;
			log.debug('70'+type)
  
			if(scriptContext.type == 'edit')//if(scriptContext.type == 'create' || scriptContext.type == 'copy')////
			{	
				getFreeLogin();
				//nlapiLogExecution('DEBUG',' 75 noofreply ',' noofreply '+noofreply);
				log.debug({
					title:(' 77 noofreply ',' noofreply '),
					details:noofreply
				});
				if(noofreply == 3)
				{
					email.send({
						author:4018,
						recipient:'jmcdonald@hmsmarketingservices.com',
						replyTo:null,
						cc:null,
						bcc:null,
						subject:'Reply from Sales Rep is needed',
					    body:'Hi Jeff!<br>reply from sales rep is needed.<br>only 3 more account is open.<br> Thanks ', 
					    attachment:null,
					    relatedRecords:null
					});
				}
			
				log.debug("username && password ",username+'=='+password);
				{
					
					var id = recordAll.id;
					log.debug({
						title:'id ',
							details:id 
					});
					var rectype = recordAll.Type;
					log.debug({
						title:'rectype ',
							details:rectype 
					});
					
				
					var testsubaccount = record.getValue({
						fieldId:'custevent_test_sub_account_sms'
					});
					log.debug({
						title:('testsubaccount ',' testsubaccount'),
						details:testsubaccount
					});
				
					var casecategory = record.getValue({
						fieldId:'category'
					});
					log.debug({
						title:'casecategory ',
							details:casecategory 
					});
					
					//if(testsubaccount == 'T')
					{
					
						var bsrID = record.getValue({
							fieldId:'custevent_builder_sales_rep_subd'
						});
						log.debug({
							title:'bsrID ',
							details:bsrID 
						});
						var bsrRecord = recordAll.load({
							type:recordAll.Type.PARTNER,
							id:bsrID
						});
						log.debug({
							title:'bsrRecord ',
							details:bsrRecord  
						});
					
						var phoneno =record.getValue({
							fieldId:'custevent2'
						});
						log.debug({
							title:'phoneno',
							details:phoneno
						});
						//phoneno = '(513) 227-6718';
					
						var bsrEmail = bsrRecord.getValue({
							fieldId:'email'
						});
						log.debug({
							title:'bsrEmail ',
							details:bsrEmail 
						});
						var enableTextMessaging = bsrRecord.getValue({
							fieldId:'custentity_enable_text_messaging'
						});
						
						var enable2waymessaging = bsrRecord.getValue({
							fieldId:'custentity_enable_two_way_sms'
						});
					
						log.debug({
							title:'enable2waysmessaging',
							details:enable2waymessaging
						});
						
						log.debug({
							title:'enableTextMessaging',
							details:enableTextMessaging
						});
					
					//	if (/*(enableTextMessaging == 'true') || */(enable2waymessaging == 'true'))
						if(enable2waymessaging==true)
						{log.debug('183')
							if(phoneno)
							{log.debug('185')
								phoneno = replaceUnwantedChar(phoneno);
								//nlapiLogExecution('DEBUG','real phoneno  ',' phoneno '+phoneno);
								//phoneno = '(513) 227-6718';	//jeff's mobile number
								//phoneno = replaceUnwantedChar(phoneno);
								
								log.debug({
									title:'phoneno',
									details:phoneno
								})	;			
								log.debug("username && password ",username+'=='+password);
								var reqObj = {
										username:username,
										password:password,
										cmd:"account"
								};
								var header = {
										"Content-Type":"application/x-www-form-urlencoded"
								};
								var response = https.request({
										method: https.Method.POST,
										url:'https://www.textmagic.com/app/api?username='+username+'&password='+password+'&cmd=account',
										body:(reqObj),
									headers:header
										});
									log.debug({
										title:'response ',
										details:response 
									});
								
								//nlapiLogExecution('DEBUG','response  ',' response '+response);
								if(response)
								{
									var body =  response.body;
									log.debug({
										title:'body ',
										details:body 
									});
									//nlapiLogExecution('DEBUG','response  ',' body '+body);
									//var balance = body.balance;
									var bodyjson = JSON.parse(body);
									log.debug({
										title:'bodyjson ',
										details:bodyjson 
									});
									var balance = getFloatValue(bodyjson.balance);
									log.debug({
										title:'balance ',
										details:balance 
									});
									//nlapiLogExecution('DEBUG','response  ',' bodyjson '+bodyjson);
									//nlapiLogExecution('DEBUG','balance  ',' balance '+balance);
									if(balance > 1)
									{
										
										log.debug({
											title:('inside greater than 0  ','  balance'),
											details:balance
										});
										var post = new Array();
										post['username'] = username;
										post['password'] = password;
										post['cmd'] = 'send';
										if((enableTextMessaging == true) && (enable2waymessaging != true))
										{
										post['text'] = 'From HMS: We\'ve sent an inquiry to ' + bsrEmail + '. If you\'d like phone confirmation call us at 855-467-2255';
										}
										else if(enable2waymessaging == true)
										{
											if(casecategory == 1)
											{
												var houseno = '';
												var streetname = '';
												var afirstname = '';
												var alastname = '';
												var abrokerage = '';
												
												var searchType = record.getValue({
													fieldId:'custevent_subdivision_search'
												});
												log.debug({
													title:'searchType ',
													details:searchType 
												});
												var subdivision = record.Text({
													fieldId:'custevent_subdivision'
												});
												log.debug({
													title:'subdivision ',
													details:subdivision 
												});
												if (subdivision)
												{
													subdivision = subdivision.substr(0, 7);
												}
												
												var propid = record.getValue({
													fieldId:'custevent_property'
												});
												log.debug({
													title:'propid ',
													details:propid 
												});
												var agentname =record.getValue({
													fieldId:'custevent_caller_name'
												});
												log.debug({
													title:'agentname ',
													details:agentname 
												});
												if(propid)
												{
												
													var propertyrecord = recordAll.load({
														type:'customrecord_property_record',
														id:propid
													});
													log.debug({
														title:'propertyrecord ',
														details:propertyrecord 
													});
													houseno = propertyrecord.getValue({
														fieldId:'custrecord_house_number'
													});
													log.debug({
														title:'houseno ',
														details:houseno 
													});
												    streetname = propertyrecord.getText({
												    	fieldId:'custrecord31'
												    });
												    log.debug({
														title:'streetname ',
														details:streetname 
													});
												}
												
												if(agentname)
												{
													
													var agentrecord = recordAll.load({
														type :'customrecord_agent',
														id:agentname
													});
													log.debug({
														title:'agentrecord ',
														details:agentrecord 
													});
													afirstname = agentrecord.getValue({
														fieldId:'custrecord_agent_first_name'
													});
													log.debug({
														title:'afirstname ',
														details:afirstname 
													});
													alastname = agentrecord.getValue({
														fieldId:'custrecord_agent_last_name'
													});
													log.debug({
														title:'alastname ',
														details:alastname 
													});
													abrokerage = agentrecord.getText({
														fieldId:'custrecord_brokerage'
															});
													log.debug({
														title:'abrokerage ',
														details:abrokerage 
													});
													acell = agentrecord.getValue({
														fieldId:'custrecord_agent_mobile_number'
													});log.debug({
														title:'acell ',
														details:acell 
													});
													if(abrokerage)
													{
														abrokerage = abrokerage.substr(0,7);
													}
													
												}
												if (searchType == 1) //Property inquiry
												{
													var customtext = 'You have an inquiry for ' +houseno + ' '+streetname+'. ' + 'See email for details. Agent: '+ afirstname+' '+alastname+' '+abrokerage+' '+acell+'. Reply Y to accept';
												}
												else if(searchType == 2) //Subdivision inquiry
												{
													var customtext = 'You have a web lead for ' +subdivision+'. ' + 'See email for details. Lead: '+ afirstname+' '+alastname+' '+acell+'. Reply Y to accept';
												}
												else if(searchType == 3)
												{
													if(acell)
													{
														var customtext = 'You have a general web lead for your division. See email for details. Lead: '+ afirstname+' '+alastname+' '+acell+'. Reply Y to accept';
													}
													else
													{
														var customtext = 'You have a general web lead for your division. See email for details. Lead: '+ afirstname+' '+alastname+'. Reply Y to accept';
													}
												}
												post['text'] = customtext;
												
												log.debug({
													title:('in if category 1 ',' customtext'),
													details:customtext
												});
											}
											else
											{
												var houseno = '';
												var streetname = '';
												var afirstname = '';
												var alastname = '';
												var abrokerage = '';
												
												var propid = record.getValue({
													fieldId:'custevent_property'
												});
											
												var agentname = record.getValue({
													fieldId:'custevent_caller_name'
												});
											
												var datescheduled = record.getValue({
													fieldId:'custevent_showing_date_scheduled'
												});
												
												var timescheduled = record.getValue({
													fieldId:'custevent_showing_time_scheduled'
												});
												if(propid)
												{
													
													var propertyrecord = recordAll.load({
													type:'customrecord_property_record',
													id:propid
													});
													
													houseno = propertyrecord.getValue({
														fieldId:'custrecord_house_number'
													});
												
												    streetname = propertyrecord.getText({
												    	fieldId:'custrecord31'
												    });
												}
												
												if(agentname)
												{
												
													var agentrecord = recordAll.load({
														type:'customrecord_agent',
														id:agentname
													});
												
													afirstname = agentrecord.getValue({
														fieldId:'custrecord_agent_first_name'
													});
										
													alastname = agentrecord.getValue({
														fieldId:'custrecord_agent_last_name'
													});
													
													abrokerage = agentrecord.getText({
														fieldId:'custrecord_brokerage'
													});
													
													acell = agentrecord.getValue({
														fieldId:'custrecord_agent_mobile_number'
													});
													if(abrokerage)
													{
														abrokerage = abrokerage.substr(0,7);
													}
													
												}
												var customtext = 'You have an inquiry for ' +houseno + ' '+streetname+'. ' + datescheduled+' '+timescheduled+'. '+ afirstname+' '+alastname+' '+abrokerage+' '+acell+'. Reply Y to accept';
												
												
												var receiveTextStatus = 'T'
												
												if (receiveTextStatus == 'F')
												{
													streetname = streetname.substr(0,7);
													var customtext = 'You have an inquiry for ' +houseno + ' '+streetname+'. We are temporarily unable to confirm showings by text. Please check your email to confirm this inquiry';
												}
												post['text'] = customtext;

										
												log.debug({
													title:('in else ','customtext: '),
													details:customtext
												});
											}
										}
										post['phone'] = '1'+phoneno;
										//post['phone'] = '917411148033';
										
										post['unicode'] = '0';
										post['max_length'] = '2';
										if(phoneno)
										{
											
											log.debug({
												title:'post request',
												details:JSON.stringify(post)
											});
											/*var response = http.request({
												method: http.Method.POST,
												url:checkaccount
												});
											
											var emailresponse = http.request({
												method:http.Method.POST,
												url:'https://www.textmagic.com/app/api',
												body:post
											});*/
											var emailresponse = https.request({
												method: https.Method.POST,
												url:'https://www.textmagic.com/app/api?username='+username+'&password='+password+'&cmd=account',
												body:(reqObj),
											headers:header
												});

											log.debug({
												title:'emailresponse',
												details:emailresponse
											});
											//updatePreference(acctype);
											if(emailresponse)
											{
												var emailresponsebody = emailresponse.body;
												
												log.debug({
													title:('emailresponsebody ',' emailresponsebody: '),
													details:emailresponsebody
												});
												var ebody = JSON.parse(emailresponsebody);
												var hasmessageid = ebody.message_id;
												//nlapiLogExecution('DEBUG','hasmessageid  ',' hasmessageid '+hasmessageid);
												var messageidresponse = '';
												if(hasmessageid && hasmessageid != 'undefined')
												{
													//var ebody = JSON.parse(emailresponsebody);
													for (key in hasmessageid) {
														if (hasmessageid.hasOwnProperty(key)) 
														{
															//nlapiLogExecution('DEBUG',' key '+key + " value " + hasmessageid[key]);
															messageidresponse = key;
														}
													}
													//nlapiLogExecution('DEBUG','after hasmessageid  ',' hasmessageid '+hasmessageid);
													if(enable2waymessaging == true)												
													{
														var fieldids = [];
														var fieldvalues = [];
														//	fieldids.push('custrecord_first_sms_sent');
														//	fieldvalues.push('T');
														fieldids.push('custevent_hms_sms_message_id');
														fieldvalues.push(username);
														
														record.submit({
															type:rectype,
															id:id,
															fieldId:fieldids,
															fieldValues:fieldvalues
														});
														//updatePreference(acctype);
														if(enable2waymessaging == true)
														{
															updateLogin(username, id);
														}
														//
													}
													else
													{
													}
												}
												else
												{
													//custrecord_sms_error
												
													log.audit({
														title:'not able to process',
														details:id
													});
												}
											}
										}
										
									}
									else
									{
										
									}
								}
								else
								{
									
									log.debug({
										title:('No Response ','  No Response'),
									});
								}
								log.debug({
									title:'sndSMS try  function end'
								})
							}
						}
						
					}
				}
			}
		}
		catch(e)
		{ 
			log.debug({
				title:'send SMS catch function start'
			});
			var err = '';
			var errmsg = '';
			if ( e instanceof nlobjError )
			{
				err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
			}
			else
			{
				err = 'Unexpected error: ' + e.toString();
			}
				errmsg += '\n' + err;
		
			log.error({
				title:' 999 Error ',
				details:errmsg
			});
		}	
		log.debug({
			title:'sndSMS function end'
		});
	}
		 }
	

	function updateLogin(usernamei, supportid)
	{
		 log.debug({
			 title:'updateLogin function start'
		 })
			
		var searchresults = search.create({
			type:'customrecord_hms_magic_text_logins',
			columns:['internalid','custrecord_hms_magic_text_username','custrecord_hms_magic_text_password'
			        ],
				

			        filters:[
			                search.createFilter({
			                	name:'isinactive',
			                	operator:'is',
			                	values:'F'
			                }),
			                search.createFilter({
			                	name:'custrecord_hms_magic_text_username',
			                	operator:'is',
			                	values:usernamei
			                })
			                ]
	      	});
		columns[0].setSort(false);

		var assignedvalue = '';
		
		if(searchresults)
		{
			var searchlength = searchresults.length;
			
			//for(var i=0;i < searchlength;i++)
			{
			
				var searchid = searchresults[0].searchId;
			
				var searchtype = searchresults[0].type();
				//username = searchresults[0].getValue('custrecord_hms_magic_text_username');
				//password = searchresults[0].getValue('custrecord_hms_magic_text_password');
				var loginrecord = recordAll.load({
					type:searchtype,
					id:searchid
				});
				
				loginrecord.setValue({
					fieldId:'custrecord_hms_is_blocked',
					value:'T'
				});
			
				loginrecord.setValue({
	             fieldId:'custrecord_hms_support_ref',
	             value:supportid
				});
				
				//nlapiLogExecution( 'DEBUG',   ' sid ', ' sid '+sid);
				var sid = loginrecord.save({
					enableSourcing:true,
				    ignoreMandatoryFields:true
				})
				
			}
		}

		 log.debug({
			 title:'updateLogin function end'
		 })
	}



	function getFreeLogin()
	{
		
	try{
		log.debug({
			title:'get free login function start' 
		 });

		var searchresults = search.create({
			   type: "customrecord_hms_magic_text_logins",
			   filters:
			   [
			      ["isinactive","is","F"], 
			      "AND", 
			      ["custrecord_hms_is_blocked","is","F"]
			   ],
			   columns:
			   [
			      search.createColumn({name: "internalid", label: "Internal ID"}),
			      search.createColumn({name: "custrecord_hms_magic_text_username", label: "User Name"}),
			      search.createColumn({name: "custrecord_hms_magic_text_password", label: "Password"})
			   ]
			});
			var searchResultCount = searchresults.runPaged().count;
			log.debug("customrecord_hms_magic_text_loginsSearchObj result count",searchResultCount);
		
			
			log.debug("searchresults 1 "+searchresults)
			
			
			var srchRun = searchresults.run();
			var results = srchRun.getRange({
				start:0,
				end:10
			});
			if(srchRun){
			log.debug("srch1 "+srchRun.length)
		}else
			{
			log.debug("srch2 "+srchRun.length)
			}
			
			searchresults.run().each(function(result){
				
				   // .run().each has a limit of 4,000 results
				
				username = result.getValue({
					name:'custrecord_hms_magic_text_username'
				})
				log.debug("username 690",username);
				
				password = result.getValue({
					name:'custrecord_hms_magic_text_password'
				})
				log.debug("password 695",password);
				  
				});
			
			
			log.debug({
			title:'searchresults  629',
			debug:JSON.stringify(searchresults)
		});
		//columns[0].setsort(false);
		var assignedvalue = '';
		
		
		if(searchResultCount!= null && searchResultCount.length)
		{
			log.debug('688')
			var searchlength = searchResultCount.length;
			log.debug('searchlength'+searchlength)
			noofreply = searchlength;
			//for(var i=0;i < searchlength;i++)
			{
			
				username = searchResultCount[0].getValue({
					name:'custrecord_hms_magic_text_username'
				})
				log.debug({
					title:'username ',
					debug:username 
				});
				
				password = searchResultCount[0].getValue({
					name:'custrecord_hms_magic_text_password'
				})
				log.debug({
					title:'password ',
					debug:password 
				});
				//return noofreply;
			}
		
		}

		log.debug({
			title:'665 get free login function end' 
		 });
	}catch(e){
		log.debug("getFreeLogin err",e)
	}
	}

/*	function updatePreference(acctype)
	{
		 log.debug({
			title:'update preference function start' 
		 });
			var confiq = config.load({
			type:config.Type.COMPANY_PREFERENCES
		});
		
		confiq.setValue({
		fieldId:' custscript_sub_account_type',
		values:acctype
		});
		// save changes to the configuration page
		
		confiq.save();
		
		 log.debug({
				title:'update preference function end' 
			 });
	}*/

	function replaceUnwantedChar(phoneno)
	{ log.debug('enter in replaceUnwantedChar')
		//phoneno = phoneno.replace(//g,'');
		phoneno = ReplaceAll(''+phoneno, ' ', '');
		
		phoneno = phoneno.replace(/\(/g,'');
		phoneno = phoneno.replace(/\)/g,'');
		phoneno = ReplaceAll(''+phoneno, '+', '');
		phoneno = ReplaceAll(''+phoneno, '-', '');
//		phoneno = phoneno.replace(/\+/g,'');
		phoneno = ReplaceAll(''+phoneno, ',', '');
		//phoneno = phoneno.replace(/,/g,'');
		//nlapiLogExecution('DEBUG','With out space ',' phoneno '+phoneno);
		phoneno = phoneno.substring((phoneno.length-10),phoneno.length);
		log.debug('exit from replaceUnwantedChar')
		//nlapiLogExecution('DEBUG','phone substr  ',' phone substr '+phoneno);
		return phoneno;
	}

	/*function emailId(recordid)
	{	 
		try
		{  
			log.debug({
			title:'emailId  try function  start for customer'
		    });
			
			var record = recordAll.load({
				type:recordAll.Type.CUSTOMER,
				id:recordid
			})
		
			var phone = record.getValue({
				fieldId:'custentity_mobile_phone_number'
			})
			log.debug({
			title:'emailId  try function  end 4 customer'
		    });
			return phone;
		}
		catch(e)
		{
			log.debug({
				title:'emailId  catch function  start for customer'
			    });
			var err = '';
			var errmsg = '';
			if ( e instanceof nlobjError )
			{
				err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
			}
			else
			{
				err = 'Unexpected error: ' + e.toString();
			}
				errmsg += '\n' + err;
			
			log.error({
				title:' 999 Error not customer record',
				details: errmsg	
			});

			log.debug({
				title:'emailId  catch function  end for customer'
			    });
			try
			{

				log.debug({
					title:'emailId  try function  start for contact'
				    });
				var record = recordAll.load({
					type:recordAll.Type.contact
				});
				
				var phone = record.getValue({
					fieldId:'custentity_mobile_phone_number'
				})
				log.debug({
					title:'emailId  try function  end for contact'
				    });
				return phone;
			}
			catch(e)
			{
				log.debug({
					title:'emailId  catch function  start for contact'
				    });
				var err = '';
				var errmsg = '';
				if ( e instanceof nlobjError )
				{
					err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
				}
				else
				{
					err = 'Unexpected error: ' + e.toString();
				}
					errmsg += '\n' + err;
			
				log.error({
					title:' error in catch also 999 Error',
					details: errmsg
				});
				log.debug({
					title:'emailId  catch function  end for contact'
				    });
				return null;
			}
		}
	}*/


	function ReplaceAll(Source, stringToFind, stringToReplace) {
	    var temp = Source;
	    var index = temp.indexOf(stringToFind);

	    while (index != -1) {
	        temp = temp.replace(stringToFind, stringToReplace);
	        index = temp.indexOf(stringToFind);
	    }

	    return temp;
	}

//	String.prototype.ReplaceAll = function (stringToFind, stringToReplace) {
//	    var temp = this;
//	    var index = temp.indexOf(stringToFind);
//
//	    while (index != -1) {
//	        temp = temp.replace(stringToFind, stringToReplace);
//	        index = temp.indexOf(stringToFind);
//	    }
//
//	    return temp;
//
//	};

	/*function trim(str)
	{
		return str.replace(/^\s+|\s+$/g,"");
	}*/


	function getFloatValue(id)
	{
		var ret;
		ret = parseFloat(id);
		if(isNaN(ret))
		{
			ret = 0;
		}
		return ret;

	}// getnumber
   
    

    return {
    	afterSubmit:SendSMS
    
       
        
       
    };
    
});
