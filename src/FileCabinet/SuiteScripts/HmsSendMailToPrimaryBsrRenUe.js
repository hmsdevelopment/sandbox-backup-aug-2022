/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/search','N/format','N/email','N/task'],

function(record,log,search,format,email,task) {
	/*
	Name           -   Send_REN_TO_BSR_UE_WebBee.js
	Script Type    -   User Event
	Purpose        -   Send REN to Primary BSR
	Company        -   WebBee-ESolutions-PVT-LTD.
	Created By     -   PRANJAL GOYAL
	Client         -   HMS Marketing Services
	Date           -   16th November 2016 - Live
	Modified       -   8th May 2017
	*/
	var body = '';
	var author = 4276;
	var subject = 'test'//HMS Marketing , REN UE';
	var bcc = 'shikha@webbee.biz';
	/*var cc1 = 'aj@webbeeglobal.com';

	var tmpBODY = 76;
	var tmpFOOTER = 77; 
	var bsrTemplate = 82;
	var smTemplate = 74;
	//EST

	var d1 = new Date();

	function stdTimezoneOffset() {
	    var jan = new Date(d1.getFullYear(), 0, 1);
	    var jul = new Date(d1.getFullYear(), 6, 1);
	    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}

	Date.prototype.dst = function() {
	    return this.getTimezoneOffset() < stdTimezoneOffset();
	}
	
	log.debug({
		title:'this.stdTimezoneOffset()' ,
		details:stdTimezoneOffset()
	});

	log.debug({
		title:'this.getTimezoneOffset()'  ,
		details: d1.getTimezoneOffset()
	});
	var today2 = new Date();
	if (today2.dst()) { 
	offset = -4.0

	 }else{
	   offset = -5.0
	 }


	clientDate = new Date();
	utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);

	date = new Date(utc + (3600000*offset));


	//var date = new Date();
	var dd = date.getDate();
	var mm = date.getMonth()+1;
	var yy = date.getFullYear();
	var today = mm+'/'+dd+'/'+yy; 
	var callCenter = 3847;

	var CurrTime =format.format({
		value:date,
		type:format.Type.DATETIMETZ
	});*/
	var scriptId = 'customscripthmssndmail2primarybsrrensh2';
	var deployId = 'customdeployhmssndmail2primarybsrrensh2';
	//var propertyRecType = 'customrecord_property_record';
	
	/*var SecretKey =search.lookupFields({
		type:'customrecord_auth_pass_phrase',
		id:1,
		columns: 'custrecord_secret_key'
	});*/
	var CFields = ['custevent_ren_session','custevent_builder_sales_rep_subd','custevent_linked_cases','status'];

	function BeforeSubmit(scriptContext)
	{
		log.debug("scriptContext.type "+scriptContext.type)
		
		var type = scriptContext.type;
	    log.debug(type);
	    var record = scriptContext.newRecord
	    var form = scriptContext.form
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
	  if(	 scriptContext.type=='edit' && id==81157  && customForm==85)
	     {
		try
		{
			if(scriptContext.type == 'create' || scriptContext.type == 'edit')
			{   var builder=record.getValue({
				fieldId:'company'
					});
			log.debug({
				title:'builder',
				details:builder
			    });			
//			if(builder=='3643'||builder=='3642')
			{
				var createCopy = record.getValue({
					fieldId:'custevent_create_copy'
						});
				log.debug({
					title:'createCopy',
					details:createCopy
				    });	
				
				record.setValue({
					fieldId:'custevent_ren_session',
					value:createCopy
					});
				log.debug('141')
			}
			}	
		}
		catch(ex)
		{
			body = 'BeforeSubmit : '+ex;
			body += ex.name+' : '+ex.message;
		email.send({
			author:author,
			recipients:bcc,
			subject:subject,
			body:body
			});
		log.debug({title: 'Exception Body : ',
			details:body
			});	
		}
	     }
	}

	function SendRENToBSR(scriptContext)
	{
 log.debug("scriptContext.type "+scriptContext.type)
		
		var type = scriptContext.type;
	    log.debug(type);
	    var record = scriptContext.newRecord
	    var form = scriptContext.form
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
	  if(	 scriptContext.type=='edit' && id==81157  && customForm==85)
	     {
		try
		{	
		   
		    var CaseId = record.id
		    log.debug({
				  title:'CaseId',
				  details:CaseId
			   }); 
		    if(defVal(CaseId) != '')
		    {
		    	 var builder=record.getValue({
		    		 fieldId:'company'
		    			 });
		    	 log.debug({
					  title:'builder',
					  details:builder
				   }); 
		        var CaseInfo = search.lookupFields({
		        	type:search.Type.SUPPORT_CASE,
		        	id:CaseId,
		        	columns:CFields
		        	});
		        log.debug({
					  title:'CaseInfo',
					  details:CaseInfo
				   }); 
		        }
				var createApp = CaseInfo.custevent_ren_session;
				log.debug({
					title:'createApp ',
					details:createApp 
				});
		        var primaryBSR = CaseInfo.custevent_builder_sales_rep_subd;
		        log.debug({
					title:'primaryBSR ',
					details:primaryBSR 
				});
		        var LinkedCaseId = CaseInfo.custevent_linked_cases;
		        log.debug({
					title:'LinkedCaseId ',
					details:LinkedCaseId 
				});
		        var status = CaseInfo.status;
		        log.debug({
					title:'status ',
					details:status 
				});
		        var oldCase = scriptContext.oldRecord;
		        log.debug({
					title:'oldCase ',
					details:oldCase 
				});
			    if((scriptContext.type == 'edit' || scriptContext.type == 'xedit') && oldCase != null)
			    {
				    var oldStatus = oldCase.getValue({
				    	fieldId:'status'
				    		});
				    log.debug({
						  title:'oldStatus',
						  details:oldStatus
					   }); 
		        	 if((oldStatus != status) && defVal(LinkedCaseId) != '' && defVal(primaryBSR) != '' )
		        	 {
		        		
						 var Search =search.create({
							type:search.Type.SUPPORT_CASE,
							filters:[
							         search.createFilter({
								name:'custevent_builder_sales_rep_subd', 
								operator:'is',
								value:primaryBSR
							}),
							
							search.createFilter({
								name:'custevent_linked_cases', 
								operator:'is',
								value:LinkedCaseId
							}),
							]
						 });
						 log.debug({
							  title:'Search',
							  details:Search
						   }); 
						 if(Search != null && Search.length >0)
						 {    					 
						    for(var j=0; j<Search.length; j++)
						
						     record.submitFields({
						        type: record.Type.SUPPORT_CASE,
						        id: Search[j].getId(), 
						        values: status,
						       enableSourcing: true
						                
						    });


						 }
		        	 }	
		        	 else
		        	
		        	 record.submitFields({
					        type: record.Type.SUPPORT_CASE,
					        id: CaseId, 
					        values: status,
					       enableSourcing: true
					                
					    });
			    }	
			    
				if((scriptContext.type == 'create' || scriptContext.type == 'edit')&& createApp != 'T' ) 
				{	
//	              if(builder=='3643'||builder=='3642')
	              {
			        var params = {};
			        params['custscript_caseidsch'] = CaseId;
			        
			        log.debug({
			        	title:'params ',
			        	details:params 
			        });
				log.debug({
					title:'CaseId here',
					details:CaseId
				});
//				    var sch_status = task.create({
//				        taskType: task.TaskType.SCHEDULED_SCRIPT,
//				        scriptId: scriptId,
//				        deploymentId: deployId,
//				        params:{custscript_caseidsch: CaseId}
//				    });
//				    
				var sch_status = task.create({
					taskType: task.TaskType.SCHEDULED_SCRIPT,
					params: {'custscript_caseidsch': CaseId}
					});
				sch_status.scriptId = scriptId;
				
				try{
					sch_status.submit();
				}catch(e){
					log.debug("err "+e);
				}
				    
				    
				    log.debug({
			        	title:'params ',
			        	details:params 
			        });
				    log.debug({
				    	title:'Script Scheduled',
				    	details:sch_status
				    });
				}
				 } 
		    }		
		// try block ends here..
		catch(ex)
		{
			body = 'SendRENToBSR : '+ex;
			body += ex.name+' : '+ex.message;
			email.send({
				author:author,
				recipients:bcc,
				subject:subject,
				body:body
				});
			log.debug({title: ' Body : ',
				details:body
				});	
		}
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
				author:author,
				recipients:bcc,
				subject:subject,
				body:body
				});
			log.debug({title: ' Exception Body : ',
				details:body
				});	
			return '';
		}
	}


	
    

    return {
      
        beforeSubmit: BeforeSubmit,
        afterSubmit: SendRENToBSR
    };
    
});
