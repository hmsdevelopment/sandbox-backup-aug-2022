/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/format'],

function(recordAll,log,format) {

	function afterSubmit(scriptContext) {

		if(scriptContext.type != 'xedit') {

		try	{

			var TEST_MODE = false;

			var today = new Date();
			var todayFormatted = format.format({
				value: today,
				type: format.Type.DATE
			})
			log.debug({
				title:'todayFormatted',
				details:todayFormatted
			})
			var type = scriptContext.type;
			var record = scriptContext.newRecord
	    var id = record.id;

	    var customForm = record.getValue({
	  	 fieldId:'customform'
	    });



			if(id == '81157'  && customForm == '85') {
				TEST_MODE = true;
			}

			log.debug({
	  	title:'id | customForm | TEST_MODE',
	  	details: id+ "|" + customForm + "|" + TEST_MODE
	    });

		  if(scriptContext.type == 'edit' && TEST_MODE) {

			var newConstructionStatus = record.getValue({
				fieldId:'custevent_switch_construction_status'
			});

			var property = record.getValue({
				fieldId:'custevent_property'
			});
			log.debug({
			 title:'property | newConstructionStatus',
			 details:property + " | " + newConstructionStatus
			});

			if(newConstructionStatus != null && newConstructionStatus != '') {

					var propertyRecord = recordAll.load({
						type:'customrecord_property_record',
						id: property //TODO : Replace here with 'property' var
					});

					var previousConstructionStatus = propertyRecord.getValue({
						fieldId:'custrecord_current_construction'
					});
					log.debug({
						title:'previousConstructionStatus',
						details:previousConstructionStatus
					});

					propertyRecord.setValue({
						fieldId:'custrecord_current_construction',
						value:newConstructionStatus
					});
					propertyRecord.setValue({
						fieldId:'custrecord_property_date_const_update',
						value:new Date(todayFormatted)
					});
					log.debug("Date Field Updated!!!")
					propertyRecord.save({
						enableSourcing: true,
					  ignoreMandatoryFields: true
					});

					var propertyChangeRecord = recordAll.create({
						type:'customrecord_property_changes'
					});


					propertyChangeRecord.setValue({
						fieldId:'custrecord_change_construction_status',
						value:previousConstructionStatus
					});
					propertyChangeRecord.setValue({
						fieldId:'custrecord_new_construction_status',
						value:newConstructionStatus
					});
					propertyChangeRecord.setValue({
						fieldId:'custrecord_changes_committed',
						value:true
					});
					/*	propertyChangeRecord.setValue({
							fieldId:'custrecord_date_modified',
							value:todayFormatted
						});*/
					propertyChangeRecord.setValue({
						fieldId:'custrecord_property',
						value:property
					});
					var newPropertyChangeRecId = propertyChangeRecord.save({
						enableSourcing: true,
					    ignoreMandatoryFields: true
					});
					log.debug({
						title:'Construction | newPropertyChangeRecId',
						details:newPropertyChangeRecId
					});
			}

		//Code added by Jeff to replicate the code above, only for Sales Status instead of Construction Status

			var newSalesStatus = record.getValue({
				fieldId:'custevent_switch_sales_status'
			});
			log.debug({
				title:'newSalesStatus',
				details:newSalesStatus
			})

			/*
			 *
			 */
			if(newSalesStatus != null && newSalesStatus != '') {

					var propertyRecord = recordAll.load({
						type:'customrecord_property_record',
						id:property
					});

					var previousSalesStatus = propertyRecord.getValue({
						fieldId:'custrecord_property_status'
					});

					log.debug({
						title:'previousSalesStatus',
						details:previousSalesStatus
					});
					propertyRecord.setValue({
						fieldId:'custrecord_property_status',
						value:newSalesStatus
					});
					propertyRecord.setValue({
						fieldId:'custrecord_property_date_sales_st_update',
						 value:new Date(todayFormatted)
					});
					log.debug("Sales St Updated: Date" + todayFormatted)
					propertyRecord.save({
						enableSourcing: true,
					  ignoreMandatoryFields: true
					});

			var propertyChangeRecord = recordAll.create({
				type:'customrecord_property_changes'
			});
			log.debug({
				title:'propertyChangeRecord',
				details:propertyChangeRecord
			});
			propertyChangeRecord.setValue({
				fieldId:'custrecord_new_property_status',
				value:previousSalesStatus
			});
			log.debug('202')
			propertyChangeRecord.setValue({
			fieldId:'custrecord_update_property_status',
			value:newSalesStatus
			});
			log.debug('207')

			propertyChangeRecord.setValue({
				fieldId:'custrecord_changes_committed',
				value:'T'
			});
			propertyChangeRecord.setValue({
				fieldId:'custrecord_date_modified',
				value:new Date(todayFormatted)
			});
			propertyChangeRecord.setValue({
				fieldId:' custrecord_property',
				value:property
			});
			var newPropertyChangeRecId = propertyChangeRecord.save({
				enableSourcing: true,
			    ignoreMandatoryFields: true
			});
			log.debug({
				title:'Sales | newPropertyChangeRecId',
				details:newPropertyChangeRecId
			});
		}


		/*
		 *
		 */


		 /*
 		  *
 		  */
		var callerType = record.getValue({
			fieldId:'custevent_caller_type'
		});
		var salutation = record.getValue({
			fieldId:'custevent_agent_salutation'
		});
		var fName = record.getValue({
			fieldId:'custevent_agentfname'
		});
		var lName = record.getValue({
			fieldId:'custevent_agentlname'
		});
		var agentID = record.getValue({
			fieldId:'custevent_agent_id_no'
		});
		var brokerage = record.getValue({
			fieldId:'custevent_brokerage_or_company'
		});
		var brokerageText = record.getText({
			fieldId:'custevent_brokerage_or_company'
		});
		var phone = record.getValue({
			fieldId:'custevent_caller_phone_number'
		});
		var mobile = record.getValue({
			fieldId:'custevent_agent_mobile_number'
		});
		var other = record.getValue({
			fieldId:'custevent_agent_other_number'
		});
		var callback = record.getValue({
			fieldId:'custevent_agent_callback'
		});
		var email = record.getValue({
			fieldId:'custevent_caller_email'
		});
		var agent = record.getValue({
			fieldId:'custevent_caller_name'
		});
		log.debug({
			title:'agent',
			details:agent
		});

		if(agent != '' && agent != null) {
			log.debug('Agent Record Editing...')
			var agentRecord = recordAll.load({
				type:'customrecord_agent',
				id:agent
			});
			var first = agentRecord.getValue({
				fieldId:'custrecord_agent_first_name'
			});
			var last = agentRecord.getValue({
				fieldId:'custrecord_agent_last_name'
			});
			var name = last + ", " + first + ' | ' + (brokerageText || "");
			log.debug({
				title:'name',
				details:name
			});
			agentRecord.setValue({
				fieldId:'custrecord_brokerage',
				value:brokerage
			});
			agentRecord.setValue({
				fieldId:'name',
				value: name
			});
			agentRecord.setValue({
				fieldId:'custrecord_agent_type',
				value:callerType
			});
			agentRecord.setValue({
				fieldId:'custrecord_salutation',
				value:salutation
			});

			if(fName){
				agentRecord.setValue({
					fieldId:'custrecord_agent_first_name',
					value:fName
				});
			}
			if(lName){
				agentRecord.setValue({
					fieldId:'custrecord_agent_last_name',
					value:lName
				});
			}
			if(agentID){
				agentRecord.setValue({
					fieldId:'custrecord_agent_id',
					value:agentID
				});
			}
			agentRecord.setValue({
				fieldId:'custrecord_agent_office_number',
				value:phone || null
			});
			agentRecord.setValue({
				fieldId:'custrecord_agent_mobile_number',
				value:mobile || null
			});

			agentRecord.setValue({
				fieldId:'custrecord_agent_other_number',
				value:other || null
			});
			agentRecord.setValue({
				fieldId:'custrecord_agent_preferred_number',
				value:callback || null
			});
			agentRecord.setValue({
				fieldId:'custrecord_agent_email',
				value:email || ""
			});
			var agentRecId = agentRecord.save({
				enableSourcing: true,
			  ignoreMandatoryFields: true
			});
			log.debug('Agent Record Edited:' + agentRecId)
		}


		if(scriptContext.type != 'delete') {
			log.debug("Builder Survey Submitting..")
			var builderDivision = record.getValue({
				fieldId:'company'
			});
			log.debug({
				title:'builderDivision',
				details:builderDivision
			})
			var builderRecord = recordAll.load({
				type:recordAll.Type.CUSTOMER,
				id:builderDivision
			});
			var enableSurvey = builderRecord.getValue({
				fieldId:'custentity_enable_surveys'
			});
			log.debug({
				title:'enableSurvey',
				details:enableSurvey
			});
			var currentAppointmentID = record.getValue({
				fieldId:'id'
			});
			var currentAppointment = recordAll.load({
				type: recordAll.Type.SUPPORT_CASE,
				id: currentAppointmentID
			});
			currentAppointment.setValue({
				fieldId:'custevent_enable_surveys',
				 value:enableSurvey
			});
			currentAppointment.save({
				enableSourcing: true,
			  ignoreMandatoryFields: true
			});
			log.debug("Builder Survey Submitted with Value:" + enableSurvey)
		}
	}
		}	catch(e) {
			log.debug('Error: ',JSON.stringify(e))
		}
	}
	}


	/*
	 * Populate SHOWING ASSIST CONFIRMATION TEXT field if DIRECT MLS INQUIRY (SHOWING ASSIST/CSS/CENTRALIZED SHOWING) is True.
   * Test Done.
	 */
	// function beforeSubmit(scriptContext){
	// 	try {
	// 		  var type = scriptContext.type;
	// 		  var record = scriptContext.newRecord
	// 		  var id = record.id;
	//       var customForm = record.getValue({
	//   	 		fieldId:'customform'
	// 	    });
	// 			log.debug({
	// 			  title:'id | type | customForm',
	// 			  details:id + " | " + type + " | " + customForm
	// 		   });
	//
	// 			if(scriptContext.type == 'edit' && id == "81157"  && customForm == "85") {
	// 					var bsrD = record.getText({
	// 						fieldId:'custevent_builder_sales_rep_subd'
	// 					});
	//
	// 					record.setValue({
	// 						fieldId:'custevent_bsr_for_phone_call',
	// 						value:bsrD
	// 					});
	// 					var bsr = record.getValue({
	// 						fieldId:'custevent_builder_sales_rep_subd'
	// 					});
	//
	// 					log.debug({
	// 					  title:'bsr | bsrD',
	// 					  details:bsr + " | " + bsrD
	// 				   });
	//
	// 					var bsrRecord = recordAll.load({
	// 						type:recordAll.Type.PARTNER,
	// 						id:bsr
	// 					});
	// 					var first = bsrRecord.getValue({
	// 						fieldId:'firstname'
	// 					});
	// 					var last = bsrRecord.getValue({
	// 						fieldId:'lastname'
	// 					});
	// 					var name = first + " " + last;
	// 					log.debug({
	// 						title:'name',
	// 						details:name
	// 					});
	//
	// 					record.setValue({
	// 						fieldId:'custevent_bsr_for_ren',
	// 						value:name
	// 					});
	// 				  var isShowingAssist =record.getValue({
	// 					  fieldId:'custevent_showing_assist'
	// 				  });
	// 					log.debug({
	// 						title:'isShowingAssist',
	// 						details:isShowingAssist
	// 					});
	// 		    if (isShowingAssist == 'T' || isShowingAssist == true) {
	// 	 				var showingAssistConfirmationText = record.getValue({
	// 					  fieldId:'custevent_sa_confirmation_text'
	// 				  });
	//
	// 				  var shortPropertyName = record.getValue({
	// 					  fieldId:'custevent_property_for_ren'
	// 				  });
	//
	// 				  var shortBSRName = record.getValue({
	// 					 fieldId:'custevent_bsr_for_ren'
	// 				  });
	//
	// 				  builder = record.getValue({
	// 					  fieldId:'company'
	// 				  });
	// 				  builderText = record.getText({
	// 					 fieldId:'company'
	// 				  });
	//
	// 				  if(builder) {
	// 					  var builderRecord = recordAll.load({
	// 						 type:recordAll.Type.CUSTOMER,
	// 						 id:builder
	// 					  });
	//
	// 					  var builderParent = builderRecord.getText({
	// 						 fieldId:'parent'
	// 					  });
	// 				  }
	//
	// 				  if(builderParent) {
	// 					  builderText = builderParent;
	// 				  }
	//
	// 				  var bsrmobilePhone = record.getValue({
	// 					 fieldId:'custevent2'
	// 				  });
	//
	// 				  property = record.getValue({
	// 					 fieldId:'custevent_property'
	// 				  });
	//
	// 				  if (property == '4242') {
	// 					  var fieldText = "Thank you for your interest in this property. It's on electronic lockbox so let yourself in and be sure to leave a card and turn out the lights when you leave. For future reference, " +
	// 				    shortBSRName + "'s cell number is " + bsrmobilePhone +"."
	// 					}else {
	// 					  var fieldText = "Thank you for your interest in this property. " + shortBSRName + " with " + builderText + " will contact you directly to finalize the details of your requested showing. For future reference, " +
	// 				    shortBSRName + "'s cell number is " + bsrmobilePhone +"."
	// 				  }
	//
	// 				  record.setValue({
	// 					  fieldId:'custevent_sa_confirmation_text',
	// 					  value:fieldText
	// 				  });
	// 			 }
	//     }
	// 	}catch(e) {
	// 		log.debug({
	// 			title:'Before Submit Error:',
	// 			details:JSON.stringify(e)
	// 		});
	// 	}
	// }


    return {

    //beforeSubmit: beforeSubmit,
    afterSubmit: afterSubmit
    };

});
