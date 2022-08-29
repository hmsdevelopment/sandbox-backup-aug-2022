/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/format','N/search'],

function(record,log,format,search) {
   
	function updateNotes(scriptContext)
	{
		
		var type = scriptContext.type;
	    log.debug(type);
	    var record = scriptContext.newRecord
	    var form = scriptContext.form
	    log.debug({
	    	title:'form',
	    	details:form
	    });
	    log.debug({
	  	  title:'record',
	  	  details:record
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
		title:'customForm',
		details:customForm
	    });
		if(scriptContext.type=='edit' && id==81157  && customForm==85)
			{
		try
		{
		if(scriptContext.type != 'delete')
			{
				var d1 = new Date();
				
				//nlapiLogExecution( 'DEBUG', 'd1',  d1);
				var time = (d1.getTime() + 3*3600*1000);
			
				var d = new Date(time);
				//nlapiLogExecution( 'DEBUG', 'd',  d);
				log.debug({
					title:'d',
						details:d
				});
				var today = format.format({
					value:d,
					type:format.Type.DATETIME
				});
				//nlapiLogExecution( 'DEBUG', 'today',  today);
				log.debug({
					title:'today',
					details:today
				});
				var newrecord = scriptContext.newRecord;
				log.debug({
					title:'newrecord',
					details:newrecord
				});
				var newnote = newrecord.getValue({
					fieldId:'custevent_new_note'
				});
				log.debug({
					title:'newnote',
					details:newnote
				});
				var temptext = '';
			
			if(scriptContext.type == 'edit')
				{
					
					var oldrec = scriptContext.oldRecord;
					log.debug({
						title:'oldrec',
						details:oldrec
					});
					var oldambcheck = oldrec.getValue({
						fieldId:'custevent_hms_abhi_sub_div_assign'
					});
					log.debug({
						title:'oldambcheck',
						details:oldambcheck
					});
					var newambcheck = newrecord.getValue({
						fieldId:'custevent_hms_abhi_sub_div_assign'
					});
			
					log.debug({
						title:'newambcheck ',
						details:newambcheck
						
					});
					if(newambcheck == 'T' && (oldambcheck == 'F'))
					{
						temptext = today+' Temporary Text ';
						log.debug({
							title:'temptext ',
							details:temptext 
						});
					}
				}
				if(newnote)
				{
				
					var oldnotes = newrecord.getValue({
						fieldId:'custevent_bsr_assignment_note'
					});
					log.debug({
						title:'oldnotes',
						details:oldnotes
					});
					if(oldnotes==null||oldnotes=='null'){
						
						oldnotes='';
					}
					newnote = today+' - '+newnote;
					log.debug({
						title:'newnote',
						details:newnote
					});
					if(temptext)
					{
						oldnotes = temptext+' '+newnote + '\n' +oldnotes;
						
					}
					else
					{
						oldnotes = newnote + '\n' + oldnotes;
						
					}	
					
					log.debug({
						title:'oldnotes ',
						details:oldnotes
					});
				
					newrecord.setValue({
						fieldId:'custevent_bsr_assignment_note',
						value:oldnotes
					});
					
					newrecord.setValue({
						fieldId:'custevent_new_note',
						value:''
					});
		
				}
				else
				{
					
					var oldnotes = newrecord.getValue({
						fieldId:'custevent_bsr_assignment_note'
					});
					log.debug({
						title:'oldnotes',
						details:oldnotes
					});
					if(oldnotes==null||oldnotes=='null'){
					
						oldnotes='';
					}
					if(temptext)
					{
						if(oldnotes)
						{
							oldnotes = temptext+'\n' +oldnotes;
							
						}
						else
						{
							oldnotes = temptext;
						
						}
						
						
						log.debug({
							title:'oldnotes no new note',
							details:oldnotes
						});
						
						newrecord.setValue({
							fieldId:'custevent_bsr_assignment_note',
							value:oldnotes
						});
						
						newrecord.setValue({
							fieldId:'custevent_new_note',
							value:''
						});
						
					}
					
				}
				
				
			}
		}
		catch(e)
		{
			var err = '';
			if ( e instanceof nlobjError )
			{
				err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
			}
			else
			{
				err = 'Unexpected error: ' + e.toString();
			}			
			
			log.error({
				title:'ERROR while setting notes',
				details:err
			});
		}
	}
	}

	/*function getMessage(type)
	{
		try
		{
			
			var recid = record.id;
			
			var rectype = record.type;
			
			var recordtype = record.getValue({
				fieldId:'recordtype'
			});
		
			var subject = record.getValue({
				fieldId:'subject'
			});
		
			var record = record.getValue({
				fieldId:'record'
			});
			
			var transaction = record.getValue({
				fieldId:'transaction'
			});
		
			var activity = record.getValue({
				fieldId:'activity'
			});
		
			var entity = record.getValue({
				fieldId:'entity'
			})

			var entitytype = record.getValue({
				fieldId:'entitytype'
			});
			
			var author = record.getValue({
				fieldId:'author'
			});
		
			log.debug({
				title:'recordtype',
				details:recordtype
			});
			
			log.debug({
				title:'record',
				details:record
			});
			
			log.debug({
				title:'transaction',
				details:transaction
			});
			
			log.debug({
				title:'activity',
				details:activity
			});
			
			log.debug({
				title:'entity',
				details:entity
			});
			
			log.debug({
				title:'entitytype',
				details:entitytype
			});
			if(activity)
			{
				
				var searchid =search.create({
					type:search.Type.SUPPORT_CASE,
					id:'customsearch335',
					filters:[{
						name:'internalid',
						operator:'anyof',
						value:activity
					}]
				});
				
				log.debug({
					title:'searchid',
					details:searchid
				});
				if(searchid)
				{
					
					var record =record.load({
						type:record.Type.SUPPORT_CASE,
						id:activity
					});
					
					var newstatus = record.getValue({
						fieldId:'status'
					});
					
					log.debug({
						title:'newstatus',
						details:newstatus
					});
					if(newstatus == 4 || newstatus == '4')
					{
						
						var assigned = record.getValue({
							fieldId:'assigned'
						});
						var sendto = '';
						if(assigned)
						{
						
							sendto = search.lookupFields({
								type:search.Type.EMPLOYEE,
								id:assigned,
								columns:'email'
							});
						}
						else
						{
							sendto = 'mlsinfo@hmsmarketingservices.com';
						}
						var records = {};
						   records['activity'] = activity;
							
						   
						   //nlapiSendEmail( 4018, sendto, 'Case reopened',  'case reopened' , 'mlsinfo@hmsmarketingservices.com', null, records );
						   
						   var wfid = workflow.trigger({
							    recordType: 'supportcase',
							    recordId: activity,
							    workflowId: 'customworkflow29',
							    actionId: workflowaction176,
							    
							});
						   
						  
						   var wfid= workflow.initiate({
							    recordType: 'supportcase',
							    recordId: activity,
							    workflowId: 'customworkflow29'
							});
						  
						   log.debug({
							 title:'wfid',
							 details:wfid
						  });
					}
				}
			}
		}
		catch(e)
		{
			var err = '';
			if ( e instanceof nlobjError )
			{
				err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
			}
			else
			{
				err = 'Unexpected error: ' + e.toString();
			}			
			
			log.error({
				title:'Error while setting notes',
				details:err
			});
		}
	}*/


    return {
       
        beforeSubmit: updateNotes
        
    };
    
});
