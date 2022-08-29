/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/search'],

function(recordAll,log,search) {

	/*
	 * Functionality:
	 * Note: It should run only if the Appointment/Inquiry record is the latest record for the 'TEXT MESSAGE ID'.

   * On Delete of  Appointment/Inquiry (Suppport Case) ,
        a)If TEXT MESSAGE ID is filled and  Primary Builder's (Builder Personnel) ENABLE TWO WAY TEXTING is checked
          Then, update the Custom Record 'Magic Text Logins' which has the TEXT MESSAGE ID.

   * On Edit of Appointment/Inquiry (Suppport Case) ,
        a) Check for the old CALL STATUS , if it wasn't 'Builder Rep Notified -- Call Closed' and current status is 'Builder Rep Notified -- Call Closed' then go for step b.
        b) If TEXT MESSAGE ID is filled and  Primary Builder's (Builder Personnel) ENABLE TWO WAY TEXTING is checked
          Then, update the Custom Record 'Magic Text Logins' which has the TEXT MESSAGE ID.
	 */
	function makeNumberFree(scriptContext) {

		var TEST_MODE = true;
		var type = scriptContext.type;
		log.debug({
			title:'Mode type',
			details:type
		});

		var record = scriptContext.newRecord;
		var currentid = record.id;
		log.debug({
			title:'Record id',
			details:currentid
		});

		var customForm = record.getValue({
			fieldId:'customform'
		});
		log.debug({
			title:'customForm',
			details:customForm
		});

		if(type == 'edit' && customForm == '85'  &&  currentid == '81157') {
			try {
				var rectype = record.type;
				log.debug({
					title:'rectype',
					details:rectype
				});

				var messageid = record.getValue({
					fieldId:'custevent_hms_sms_message_id'
				});
				log.debug({
					title:' messageid ',
					details:messageid
				});

				//Get the Value of Primary BSR (Partner record)
				var bsrID = record.getValue({
					fieldId:'custevent_builder_sales_rep_subd'
				});
				log.debug({
					title:'bsrID',
					details:bsrID
				});

				var fieldLookupResult = search.lookupFields({
					type: recordAll.Type.PARTNER,
					id: bsrID,
					columns: 'custentity_enable_two_way_sms'
				})
				log.debug({
					title:'fieldLookupResult',
					details: JSON.stringify(fieldLookupResult)
				});
				var enable2waymessaging = fieldLookupResult['custentity_enable_two_way_sms'];
				log.debug({
					title:'enable2waymessaging',
					details:enable2waymessaging
				});

				if(rectype == 'supportcase') {

						if(scriptContext.type == 'delete') {

								if(enable2waymessaging == 'T' && messageid) {

									var needRemoved = searchCase(messageid, currentid);
									log.debug({
										title:'Unblock number',
										details:needRemoved
									});
									if(needRemoved == true)
									{
										updateLogin(messageid);
									}
								}
						}

						if(scriptContext.type != 'create' && scriptContext.type != 'delete') {

									var oldrecord = scriptContext.oldRecord;
									log.debug({
										title:'oldrecord',
										details:oldrecord
									});
									var oldstatus = '';
									if(oldrecord)	{
										oldstatus = oldrecord.getValue({
											fieldId:'status'
										});
										log.debug({
											title:'oldstatus',
											details:oldstatus
										});
									}else {
										return;//TODO: May need to Remove this line.
									}

									var newstatus = record .getValue({
										fieldId:'status'
									});
									log.debug({
										title:'newstatus',
										details:newstatus
									});

									if(oldstatus && newstatus == 5 && oldstatus != 5)	{ // Check if status is 'Builder Rep Notified -- Call Closed'

										if(enable2waymessaging == true && messageid)	{  //TODO: Check whether 'checkbox' value returns 'T'  or true
											var needRemoved = searchCase(messageid, currentid);
											log.debug({
												title:' unblock number ',
												details:needRemoved
											});
											if(needRemoved == true) {
												updateLogin(messageid);
											}
										}
									}
								}
								/*
								* TODO: This block of code is not Being Tested.
								if(type == 'create')
								{
									var currentid = nlapiGetRecordId();
									var newstatus = nlapiGetFieldValue('status');
									var messageid = nlapiGetFieldValue('custevent_hms_sms_message_id');
									if((newstatus == 5))
									{
										var bsrID = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
										var bsrRecord = nlapiLoadRecord('partner', bsrID);
										var enable2waymessaging = bsrRecord.getFieldValue('custentity_enable_two_way_sms');
										if((enable2waymessaging == 'T') && (messageid))
										{
											var needremoved = searchCase(messageid, currentid);
											nlapiLogExecution( 'DEBUG',' unblock number ', needremoved);
											if(needremoved == true)
											{
												updateLogin(messageid);
											}
										}
									}
								}
								*/


				}
				/* TODO: This Block of code is not Being Tested
				else if(rectype == 'phonecall') {
					log.debug('219')

					var supportcaseid = record.getValue({
						fieldId:'supportcase'
					});
					log.debug({
						title:'supportcaseid',
						details:supportcaseid
					});
					if(supportcaseid)
					{
						log.debug('230')
						var newstatus = record.getValue({
							fieldId:'custevent_call_status'
						});

						log.debug({
							title:'newstatus',
							details:newstatus
						});
						if(newstatus == 5 || newstatus == '5')
						{
							log.debug('241')

							var supportrecord = recordAll.load({
								type:recordAll.Type.SUPPORT_CASE,
								id:supportcaseid
							});

							log.debug({
								title:'supportrecord',
								details:supportrecord
							});
							var messageid = supportrecord.getValue({
								fieldId:'custevent_hms_sms_message_id'
							});

							log.debug({
								title:'messageid',
							    details:messageid
							});

							var bsrID = supportrecord.getValue({
								fieldId:'custevent_builder_sales_rep_subd'
							});


							var enable2waymessaging = bsrRecord.getValue({
								fieldId:'custentity_enable_two_way_sms'
							});

							log.debug({
								title:'enable2waymessaging',
								details:enable2waymessaging
							});
							if((enable2waymessaging == 'T') && (messageid))
							{  log.debug('286')
								var needremoved = searchCase(messageid, supportcaseid);

								log.debug({
									title:' unblock number ',
									details:needremoved
								});
								if(needremoved == true)
								{log.debug('294')
									updateLogin(messageid);
								}
							}

						}
					}
				} */
		} catch(e){
			    var errmsg = ''
	        var err = '';
	        if ( e instanceof nlobjError ) {
	            err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
	        } else {
	            err = 'Unexpected error: ' + e.toString();
	        }
	        errmsg += '\n' + err;
	        log.error({
	        	title:'ERROR',
	        	details:' 999 Error '+errmsg
	        });
		 }
	}
	}


	function updateLogin(usernamei) {

		var searchresults = search.create({
			type:'customrecord_hms_magic_text_logins',
			filters:[
               search.createFilter({
	              name:'custrecord_hms_magic_text_username',
	              operator:'is',
	              values:usernamei
               }),
			         search.createFilter({
			        	name:'isinactive',
			        	operator:'is',
			        	values:'F'
			         })
				 ],

		columns:[
		         search.createColumn({
		        	 name:'internalid',
		        	 sort:search.sort(false)
		         }),
		         search.createColumn({
		        	name:'custrecord_hms_magic_text_username'
		         }),
		         search.createColumn({
		        	name:'custrecord_hms_magic_text_password'
		         })
		         ]

		});

		log.debug({
			title:'searchresults ',
			details:JSON.stringify(searchresults)
		});

		log.debug({
			title:'searchlength',
			details:searchresults.length
		});

		if(searchresults && searchresults.length)	{


				var recordId = searchresults[0].searchId;
				var recordType = searchresults[0].recordType;
				log.debug({
					title:'RecordType',
					details:recordType
				});

				log.debug('Magic Text Login Record Can Be Updated!!!')

				// var loginrecord = recordAll.load({
				// 	type:recordType,
				// 	id:recordId
				// });
				//
				// log.debug({
				// 	title:'loginrecord',
				// 	details:JSON.stringify(loginrecord)
				// });
				//
				// loginrecord.setValue({
				// 	fieldId: 'custrecord_hms_is_blocked',
				// 	value: 'F'
				// });
        // loginrecord.setValue({
        // 	fieldId: 'custrecord_hms_support_ref',
        // 	value: ''
        // });
				// var sid = loginrecord.save({
				// 	enableSourcing: null,
				// 	ignoreMandatoryFields: true
				// });
				//
				// log.debug({
				// 	title:'Record Submitted',
				// 	details:'Magic Text Login Record  ' + sid
				// });
		}

	}


function searchCase(messageid, currentid){

		var idmatched = false;
		try {
			finalresults = search.create({
				type:search.Type.SUPPORT_CASE,
				filters:[
				         search.createFilter({
					      name:'isinactive',
					      operator:'is',
					      values:'F'
				        }),
				        search.createFilter({
				        	name:'custevent_hms_sms_message_id',
				        	operator:'is',
				        	values:messageid
				        })
              ]
			});
			log.debug({
				title:'finalresult',
				details:JSON.stringify(finalresults)
			});

			if(finalresults && finalresults.length) {

				var recordid = finalresults[0].searchId;
				log.debug({
					title:'recordid',
					details:recordid
				});
				if(currentid == recordid)	{
					idmatched = true;
				}

			} else {
				idmatched = false;
			}

	    } catch(e){
	        var errmsg = ''
	        var err = '';
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
	        	title:'ERROR',
	        	details:'999 Error '+errmsg
	        });
	        return '';
	    }
		  return idmatched;
	}


    return {
            beforeSubmit: makeNumberFree
            };

});
