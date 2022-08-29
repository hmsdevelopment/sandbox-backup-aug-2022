/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/log','N/record','N/http'],

function(runtime,log,record,http) {
	   // this code is for testing purpose only.....start point//     
    function sendSmsCase(scriptContext)
    {
    	/*var rcd = record.load({
    		type:record.Type.PARTNER,
    		id:4125
    	});
    	log.debug({
    		title:'record load',
    		details:rcd
    	});*/
	  var type = scriptContext.type;
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
    // this code is for testing purpose only.....end point//     
    if(	 scriptContext.type=='edit' && id==81157  && customForm==85)
	 {
    log.debug({
    	title:' enter in main function '
    });
    var username = runtime.getCurrentScript()//.getSetting('SCRIPT','custscript_user_name'));
	//var password = (runtime.getCurrentScript().getSetting('SCRIPT','custscript_password'));
	var onedaybefore = '';
	var ondemoday = '';
     log.debug({title:'49'})
	 // var type = scriptContext.type;
     // log.debug(type);
     // var record = scriptContext.newRecord
     /// var form = scriptContext.form
       //   log.debug({
        //	  title:'record',
        //	  details:record
         // })
     var callingFunction = SendSMS(scriptContext);
     log.debug({
    	title:'callingFunction',
    	details:JSON.stringify(callingFunction)
     });
     /*var emailFunction = emailId();
     log.debug({
    	title:'email function' 
     });*/
	 }
   }
    // var id = record.id;
   // this code is for testing purpose only.....start point//     
    
	 function SendSMS(scriptContext)
		{
		  log.debug({
			 title:'SendSMS function start' 
		  });
			//sendSmsCase();
		  var type = scriptContext.type;
		  log.debug({
			  title:'type',
			  details:type
		  })
    var recordl= scriptContext.newRecord
/*log.debug({
	title:'recordnew',
	details:record
})*/
			try
			{
				  log.debug({
					 title:'try SendSMS function start' 
				     });
				
				if(scriptContext.type == 'edit')
				{
					log.debug({
						title:'enter in editfunction'
					});
					{
						var id = recordl.id;
						log.debug({title:'id',details:id});
						var type = recordl.type;
						log.debug({title:'type',details:type});
						var bsrID = recordl.getValue({
							fieldId:'custevent_builder_sales_rep_subd'
						});
					log.debug({
						title:'bsrID',
						details:bsrID
					});
						var bsrRecord = record.load({
							type:record.Type.PARTNER,
							id:4125
						});
						 log.debug({
							title:'bsrRecord',
							details:bsrRecord
						 });
						var phoneno = recordl.getValue({
							fieldId:'custevent2'
						});
						 log.debug({
							title:'phoneno',
							details:phoneno
						 });
						var bsrEmail = bsrRecord.getValue({
							fieldId:'email'
						});
						 
						log.debug({
							title:'bsrEmail',
							details:bsrEmail
						});
						var enableTextMessaging = bsrRecord.getValue({
							fieldId:'custentity_enable_text_messaging'
						});
						log.debug({
							title:'enableTextMessaging',
							details:enableTextMessaging
						});
						if (enableTextMessaging == true)
						{
							log.debug({
								title:'enter in enableTextMessaging if condition'
							});
							if(phoneno)
							{
								log.debug({title:'152'})
								
								phoneno = replaceUnwantedChar(phoneno);
								
								log.debug({
									 title:('real phoneno  ','  phoneno '),
									 details:phoneno
								});
								//phoneno = '(513) 227-6718';	//jeff's mobile number
								//phoneno = replaceUnwantedChar(phoneno);
								//nlapiLogExecution('DEBUG','jeff\'s phoneno  ',' phoneno '+phoneno);
								//username = 'hmsmarketingservices';
								//password = 'beiqGlAYLG';
					 var checkaccount = 'https://www.textmagic.com/app/api?username='+username+'&password='+password+'&cmd=account';
								var response = http.request({
								method: http.Method.POST,
								url:checkaccount
								});
								
								log.debug({
									title:(' response   ','   response '),
									details:JSON.stringify(response)
								});
								if(response)
								{
									var body = response.getBody();
								
									log.debug({
										title:('response  ',' body '),
										details:body
									});
									//var balance = body.balance;
									var bodyjson = JSON.parse(body);
									var balance = getFloatValue(bodyjson.balance);
								
									log.debug({
										title:(' response  ',' bodyjson '),
										details:bodyjson
									});
									
									log.debug({
										title:('balance ',' balance '),
										details:balance
									});
									if(balance > 1)
									{
										
										log.debug({
											title:(' inside greater than 0  ','  balance '),
											details:balance
										});
										var post = new Array();
										post['username'] = username;
										post['password'] = password;
										post['cmd'] = 'send';
										post['text'] = 'From HMS: We\'ve sent an inquiry to ' + bsrEmail + '. If you\'d like phone confirmation call us at 855-467-2255';
										post['phone'] = '1'+phoneno;
										
										post['unicode'] = '0';
										post['max_length'] = '2';
										if(phoneno)
										{
											
											var emailresponse = http.request({
											    method: http.Method.POST,
											  //  url: 'https://www.textmagic.com/app/api',
											    body:post
											});
											if(emailresponse)
											{
												var emailresponsebody = emailresponse.getBody();
											
												log.debug({
													title:('emailresponsebody  ','   emailresponsebody'),
													details:emailresponsebody
												});
												var ebody = JSON.parse(emailresponsebody);
												var hasmessageid = ebody.message_id;
												
												log.debug({
													title:('hasmessageid  ',' hasmessageid'),
													details:hasmessageid
												});
												if(hasmessageid && hasmessageid != 'undefined')
												{
													//var ebody = JSON.parse(emailresponsebody);
													for (key in hasmessageid) {
														if (hasmessageid.hasOwnProperty(key)) 
														{
																log.debug({
																title:'key '+key,
																details:' value '+hasmessageid[key]
																	
															});
														}
													}  
													{
														var fieldids = [];
														var fieldvalues = [];
														fieldids.push('custrecord_first_sms_sent');
														fieldvalues.push('T');
														fieldids.push('custevent_hms_sms_message_id');
														fieldvalues.push(hasmessageid);
													
														record.submit({
															type:type,
															id:id,
															fields:fieldids,
															values:fieldvalues
														});
													}
												}
												else
												{
													//custrecord_sms_error
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
										title:('No Response  ','  No Response')
									});
								}
								
							}
						}
					}
				}
				log.debug({
					 title:'try SendSMS function end' 
				  });

			}
			catch(e)
			{
				log.debug({
				 title:'catch SendSMS function start' 
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
					title:'999 Error',
					details:errmsg
				});
				log.debug({
					 title:'catch SendSMS function end' 
				  });

			}
		log.debug({
			title:'Send SMS function end'
		});
		}
		
	function replaceUnwantedChar(phoneno)
	{
		log.debug({
			title:'replace unwanted char function start'
		})
		//phoneno = phoneno.replace(//g,'');
		phoneno = ReplaceAll(''+phoneno, ' ', '');
		
		phoneno = phoneno.replace(/\(/g,'');
		phoneno = phoneno.replace(/\)/g,'');
		phoneno = ReplaceAll(''+phoneno, '+', '');
		phoneno = ReplaceAll(''+phoneno, '-', '');
//		phoneno = phoneno.replace(/\+/g,'');
		phoneno = ReplaceAll(''+phoneno, ',', '');
		//phoneno = phoneno.replace(/,/g,'');
		
		log.debug({
			title:('With out space ',' phoneno'),
			details:phoneno
		});
		phoneno = phoneno.substring((phoneno.length-10),phoneno.length);
		
		log.debug({
			title:('phone substr ',' phone substr'),
			details:phoneno
		});
		log.debug({
			title:'replace unwanted char function end'
		});
		return phoneno;
	
	}
////function not required
/*function emailId()
	{	 
		log.debug({
			title:'emailId function start for customer'
		});
		var recordid=3642;
		log.debug({
			title:'test builder id',
			details:recordid
		})
		try
		{
			 
			log.debug({
				title:'try emailId function start for customer'
			});
			
			var custrecord =record.load({
				type:record.Type.CUSTOMER,
			    id:recordid
			});
			
			var phone =custrecord.getValue({
				fieldId:' custentity_mobile_phone_number'
			});
			log.debug({
				title:'try emailId function end for customer'
			});
			return phone;
		}
		catch(e)
		{ 
			log.debug({
			title:'catch emailId function start for customer'
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
		
			log.debug({
				title:' 999 Error not customer record ',
				details:errmsg
			});
			try
			{
				log.debug({
				title:'try emailId function start for contact'
			});
				
				var record = record.load({
					type:record.Type.CONTACT,
					id:recordid
				});
			
				var phone = record.getValue({
					fieldId:'custentity_mobile_phone_number'
				});
				log.debug({
					title:'try emailId function end for contact'
				});
				return phone;
			}
			catch(e)
			{
				log.debug({
					title:'catch emailId function start for contact'
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
					details:errmsg
				});
				log.debug({
					title:'catch emailId function end for contact'
				});

				return null;
			}
		}
	}*/


	function ReplaceAll(Source, stringToFind, stringToReplace) {
		log.debug({
			title:'ReplaceAll function start'
		});
	    var temp = Source;
	    var index = temp.indexOf(stringToFind);

	    while (index != -1) {
	        temp = temp.replace(stringToFind, stringToReplace);
	        index = temp.indexOf(stringToFind);
	    }
      
		log.debug({
			title:'ReplaceAll function end'
		});
	    return temp;
	}
	
	String.prototype.ReplaceAll = function (stringToFind, stringToReplace) {
		log.debug({
			title:'string to find and string to replace function start'
		});
	    var temp = this;
	    var index = temp.indexOf(stringToFind);

	    while (index != -1) {
	        temp = temp.replace(stringToFind, stringToReplace);
	        index = temp.indexOf(stringToFind);
	    }
      log.debug({
    	 title:'string to find and string to replace function end'
    		 
      });
    	   
       
	    return temp;

	};

/*	function trim(str)
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

	}// getnumber */
  
		 
    
    
    
	
    return {
    	afterSubmit:sendSmsCase
    
    
    };
    
});
