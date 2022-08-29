/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/redirect'],

function(recordAll,log,redirect) {

	function createCopy(scriptContext) {

		if(scriptContext.type != 'xedit'){
		try {
			  var TEST_MODE = false;
		    var record = scriptContext.newRecord
		    var form = scriptContext.form
		    log.debug({
		  	  title:'Context Form :',
		  	  details:form
		    });
		    var id = record.id;

			  log.debug({
				  title:'id',
				  details:id
			   });

	      var customForm = record.getValue({
		  	 fieldId:'customform'
		    });

		    log.debug({
			  	title:'id | customForm',
			  	details: id + "|" + customForm
		    });
				if(id == 81157  && customForm == 85) {
					TEST_MODE = true;
				}


		  if(scriptContext.type=='edit' && TEST_MODE){

					var makeCopy = record.getValue({
						fieldId:'custevent_create_copy'
					});
					log.debug({
						title:'makeCopy',
						details:makeCopy
					});
					if(makeCopy == 'T' || makeCopy == true) {

						var currentID = id;
						var agent = record.getValue({
							fieldId:'custevent_caller_name'
						});

						var inquiryType = record.getValue({
							fieldId:'category'
						});
						log.debug({
							title:'agent | inquiryType',
							details:agent + "|"+ inquiryType
						});

						var builderSuppliedLead =record.getValue({
							fieldId:'custevent_builder_lead'
						});

						var linkedCase = record.getValue({
							fieldId:'custevent_linked_cases'
						});
						log.debug({
							title:'linkedCase | builderSuppliedLead',
							details:linkedCase + "|" + builderSuppliedLead
						});
						if(makeCopy == true) {
							if(linkedCase == null || linkedCase == '') {
								var link = record.create({
									type:'customrecord_linked_cases'
								});
								link.setValue({
									fieldId:'custrecord_linked_case_agent',
									value:agent
								});

								var linkID = link.save({
										enableSourcing: true,
					          ignoreMandatoryFields: true
								});

								log.debug("linkID:" + linkID)

								var currentRecord = recordAll.load({
									type:recordAll.Type.SUPPORT_CASE,
									id:currentID
								});
								currentRecord.setValue({
									fieldId:'custevent_linked_cases',
									id:linkID
								});
								currentRecord.setValue({
									fieldId:'custevent_create_copy',
									value:false
								});
								currentRecord.save({
										enableSourcing: true,
					          ignoreMandatoryFields: true
								});
							} else {
								var currentRecord =recordAll.load({
									type:recordAll.Type.SUPPORT_CASE,
									id:currentID
								});

								currentRecord.setValue({
									fieldId:'custevent_create_copy',
									value:false
								});
								currentRecord.save({
									enableSourcing: true,
				          ignoreMandatoryFields: true
								});
							}


							var newRecord = recordAll.copy({
								type:recordAll.Type.SUPPORT_CASE,
								id:currentID
							});

							log.debug("newRecord:" + JSON.stringify(newRecord))
							newRecord.setValue({
								fieldId:'custevent_property',
								value:''
							});
							newRecord.setValue({
								fieldId:'custevent_showing_assist_link',
								value:''
							});
							newRecord.setValue({
								fieldId:'custevent_hms_copy_to_builder',
								value:''
							});
							newRecord.setValue({
								fieldId:'custevent_bsr_notify_sent',
								value:false
							});
							newRecord.setValue({
								fieldId:'category',
								value:inquiryType
							});
							newRecord.setValue({
								fieldId:'custevent_hms_last_ren_sent_date_time',
								value:''
							});
							newRecord.setValue({
								fieldId:'custevent_add_new_agent',
								value:false
							});
							if (builderSuppliedLead == 'T' || builderSuppliedLead == true) {
								newRecord.setValue({
									fieldId:'custevent_builder_sales_rep_subd',
									value:''
								});
							}
							var newRecordID = newRecord.save({
								enableSourcing: true,
							  ignoreMandatoryFields: true
							});

							log.debug({
								title:'newRecordID',
									details:newRecordID
							});

							redirect.toRecord({
							    type : recordAll.Type.SUPPORT_CASE,
							    id : newRecordID,
							    isEditMode:true
							});
						}
					}
				}
		} catch(e){
			log.debug({
				title:'Error',
				details:JSON.stringify(e)
			});
	   }
	//need to create another custom record to create the link between the cases that share a builder...can be a process that runs after all linked cases are created to go through the linked cases and match up builders
	 }
	}
    return {

        afterSubmit: createCopy
    };

});
