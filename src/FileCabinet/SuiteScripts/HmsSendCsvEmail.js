/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/search','N/email','N/file','N/runtime'],

function(recordAll,log,search,emailModule,file,runtime) {

	var AUTHOR = '3';
	function sendCSV(scriptContext) {

      var TEST_MODE = false;
			var TEST_RECORD = runtime.getCurrentScript().getParameter({name: 'custscript_test_record_support_case'});
			var TEST_AUTHOR = runtime.getCurrentScript().getParameter({name: 'custscript_test_record_author'});
  		var type = scriptContext.type;
  		var record = scriptContext.newRecord


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
  			details:id + " | " + customForm
  		});

      // if(id == "81157"  && customForm == "85") {
      if(type != 'xedit' && type != 'delete' && id == TEST_RECORD) {
        TEST_MODE = true;
				type = 'create';
				AUTHOR = TEST_AUTHOR || '3'
      }

			if(TEST_MODE) {

	      try {
					var rectype = record.type;
					var newrecord = recordAll.load({
						type:rectype,
						id:id
					});
					var recid = id;
					var oldrecord = scriptContext.oldRecord;

					var divisionID = newrecord.getValue({
						fieldId: 'company'
					});
					log.debug({
						title: 'divisionID or Company',
						details: divisionID
					});
					var buildersuppId = newrecord.getValue({
						fieldId:'custevent_builder_supplied_id'
					});
					log.debug({
						title:'buildersuppId',
						details:buildersuppId
					});
					var builderLead = newrecord.getValue({
						fieldId:'custevent_builder_lead'
					});
					if(type == 'create') {
						log.debug("In Create Mode!!")
					  if(builderLead == true){
							var partnerid = newrecord.getValue({
								fieldId:'custevent_builder_sales_rep_subd'
							});
							if(partnerid) {
								var emailLookup = search.lookupFields({
									type: search.Type.PARTNER,
								  id: partnerid,
								  columns: 'email'
								});
                var emailid = emailLookup['email']
								log.debug({
									title:'PartnerID | emailid ',
									details:partnerid + "|" + emailid
								});
								if(emailid) {
									sendEmailWithCSV(recid, emailid, divisionID, buildersuppId);
								}
							}
						}
					} else if(scriptContext.type != 'delete') {
						  log.debug("In Edit Mode!!")// TODO:
						  if(builderLead == true) {
								var partnerid = newrecord.getValue({
									fieldId:'custevent_builder_sales_rep_subd'
								});
								log.debug({
									title:'partnerId',
									details:partnerid
								});
								var oldpartnerid = oldrecord.getValue({
									fieldId:'custevent_builder_sales_rep_subd'
								});
								log.debug({
									title:'oldpartnerid',
									details:oldpartnerid
								});
								if((partnerid) && (oldpartnerid) && (partnerid != oldpartnerid))
								{
									var emailLookup = search.lookupFields({
										type: search.Type.PARTNER,
										id: partnerid,
										columns: 'email'
									});
                  var emailid = emailLookup['email']
									log.debug({
										title:'PartnerID | emailid ',
										details:partnerid + "|" + emailid
									});
									if(emailid) {
										sendEmailWithCSV(recid, emailid, divisionID, buildersuppId)
									}
								}
							}
			   }
		} catch(e) {
			var err = '';
			var errmsg = '';
		    if ( e instanceof nlobjError ) {
				 err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
		    }
		    else {
			    err = 'Unexpected error: ' + e.toString();
		    }
	      errmsg += '\n' + err;
		    log.error({
		    	title:'Error',
		    	details:JSON.stringify(errmsg)
		    });
		 }
	  }
	}

	function sendEmailWithCSV(internalid, email, divisionID, buildersuppId) {

		var sendToEmail = false;
		var csvEnabled = false;
		if(divisionID) {
			var lookResults = search.lookupFields({
				type: search.Type.CUSTOMER,
				id: divisionID,
				columns: ['custentity_builder_email_for_csv_files','custentity_send_csv_to_builder_with_case']
			});
			sendToEmail = lookResults['custentity_builder_email_for_csv_files'] || false
			csvEnabled = lookResults['custentity_send_csv_to_builder_with_case'] || false
			log.debug({
				title:'sendToEmail | csvEnabled',
				details:sendToEmail + " | " + csvEnabled
			});
		}

		if(sendToEmail && csvEnabled) {
			var csvcontent = 'Builder Supplied ID, Email Address \n';
			csvcontent += buildersuppId + ',' + email + "\n";
			log.debug({
				title:'csvcontent',
				details:csvcontent
			});

			var subject = 'CSVExport'+internalid;
			log.debug({
				title:'subject',
				details:subject
			});
			var newAttachment = file.create({
				name: subject+'.csv',
				fileType: 'CSV',
				content: csvcontent
			});

			var records = [];
			records['activityId'] = internalid;

			var newEmail = emailModule.send({
				author: AUTHOR,
				recipients: sendToEmail,
				subject: subject,
				body:'Please see the attached file',
				attachments: [newAttachment],
				relatedRecords: records
			});
			log.debug({
				title:'Email senT ',
				details:""
			});
		}
	}

    return {
          afterSubmit: sendCSV
    };

});
