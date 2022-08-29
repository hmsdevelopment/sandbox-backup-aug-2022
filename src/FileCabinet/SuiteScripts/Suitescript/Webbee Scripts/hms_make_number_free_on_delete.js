/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/search',"N/ui/dialog"],

function(recordAll,search,dialog) {
   
 
    function beforeSubmit(scriptContext) {
    	
    	log.debug("Script Executed");
    	
    	try{
    		
    		
    		var type = scriptContext.type;
    		log.debug("recMode",type);
    		
    		var record = scriptContext.newRecord;
    	    var rectype = record.type;
    	    log.debug("rectype",rectype);
    		
    		if(rectype == 'supportcase')
    		{
    			if(type == 'edit')
    			{
    				var currentid = record.id;
    				var messageid = record.getValue({fieldId:'custevent_hms_sms_message_id'});
    				
    				log.debug("CurrentID + messageId",currentid +'--'+messageid);
    				
    				var bsrID = record.getValue({fieldId:'custevent_builder_sales_rep_subd'});
    				
    	    		log.debug("bsrID",bsrID);
    				var bsrRecord = recordAll.load({
    					type:recordAll.Type.PARTNER,
    					id:bsrID
    				});
    				log.debug("bsrRecord",bsrRecord);
    				var enable2waymessaging = bsrRecord.getValue({
    					fieldId:"custentity_enable_two_way_sms"
    				})
    				log.debug("enable2waymessaging",enable2waymessaging);
    				if((enable2waymessaging == 'T') && (messageid))
				{
    					var needremoved = true
    					//var needremoved = searchCase(messageid, currentid);
    					//log.debug("unblock number",needremoved);
    					if(needremoved == true)
    					{
    						log.debug("unblock messageid",messageid);
    						//updateLogin(messageid);
    					}
    					
				}	
    				
    			}
    			
    			if(type != 'edit')
    			{
    				if(type != 'create'){
    					
    					var currentid = record.id;
    					log.debug("currentid",currentid);
    					var oldrecord = scriptContext.oldRecord;
    					log.debug("oldrecord",oldrecord);
    					var oldstatus = '';
    					if(oldrecord)
    					{
    						oldstatus = oldrecord.getValue({
    							fieldId:"status"
    						})
    						
    						log.debug('oldstatus',oldstatus)
    					}
    					
    					var newstatus = record.getValue({
    						fieldId: 'status'
    					})	
    					log.debug('newstatus',newstatus)
    					var messageid = record.getValue({
    						fieldId: 'custevent_hms_sms_message_id'
    					})	
    					log.debug('messageid',messageid)
//    					if((oldstatus) && (newstatus == 5) && (oldstatus != 5))
    		//			{
    						var bsrID = record.getValue({fieldId:'custevent_builder_sales_rep_subd'});
    						log.debug('bsrID',bsrID)
    						
    						var bsrRecord = recordAll.load({
    							type:recordAll.Type.PARTNER,
    	    					id:bsrID
    						});
    						
    						var enable2waymessaging = bsrRecord.getValue({
								fieldId:"custentity_enable_two_way_sms"
							});
    						log.debug('enable2waymessaging',enable2waymessaging)
    						
    						if((enable2waymessaging == 'T') && (messageid))
    						{
    							//var needremoved = searchCase(messageid, currentid);
    							//log.debug(' unblock number ', needremoved);
    							if(needremoved == true)
    							{
    							//	updateLogin(messageid);
    							}
    						}
    			//		}
    					
    				}
    			}
    			
    		}
    		else if(rectype == 'phonecall')
    		{
    			var supportcaseid = record.getValue({fieldId:'supportcase'});
    			if(supportcaseid)
    			{
    				var newstatus = record.getField('custevent_call_status');
    				log.debug("newstatus",newstatus)
    					if(newstatus == 5 || newstatus == '5')
    					{
    						var supportrecord = record.load({
    							type:record.Type.SUPPORTCASE,
    	    					id:supportcaseid
    						})
    						var messageid = supportrecord.getField({
    							fieldId : "custevent_hms_sms_message_id"
    						})
    						log.debug("messageid",messageid);
    						var bsrID = supportrecord.getField({
    							fieldId : "custevent_builder_sales_rep_subd"
    						})
    						var bsrRecord =record.load({
    							type:record.Type.PARTNER,
    	    					id:bsrID
    						})
    						var enable2waymessaging = bsrRecord.getField({
    							fieldId : "custevent_builder_sales_rep_subd"
    						})
    						if((enable2waymessaging == 'T') && (messageid))
    						{
    							//var needremoved = searchCase(messageid, supportcaseid);
    							//nlapiLogExecution( 'DEBUG',' unblock number ', needremoved);
    							if(needremoved == true)
    							{
    							//	updateLogin(messageid);
    							}
    						}
    						
    					}
    			}
    		}

    		
    		
    	}catch(err){
    		
    		log.debug("Error ",err)
    	}
    	
  
    }

     return {
        
        beforeSubmit: beforeSubmit
       
    };
    
});


function updateLogin(usernamei){
	
	var searchresults=search.create({
		   type:"customrecord_hms_magic_text_logins",
		   filters:[
		             search.createFilter({
		        	 name:'isinactive',
		        	 operator:'is',
		        	 value:false
		             }),
		             search.createFilter({
			        	 name:'custrecord_hms_magic_text_username',
			        	 operator:'is',
			        	 value:usernamei
			             })
		         ]
	
	          });
	
	var assignedvalue = '';
	if(searchresults){
		
		var searchid = searchresults[0].searchId();
		var searchtype = searchresults[0].recordType();
		
		var loginrecord = record.load({
			type:searchtype,
			id:searchid
		});
		
		loginrecord.setValue({
			fieldId:'custrecord_hms_is_blocked',
			value:false
	});
		loginrecord.setValue({
			fieldId:'custrecord_hms_support_ref',
			value:''
	});
		
		var sid = loginrecord.save();
		
		log.debug("sid",sid);
	}
	
	
	
}


function searchCase(messageid, currentid){
	
	var idmatched = false;
	try
    {
		var finalresults=search.create({
			   type:search.Type.SUPPORT_CASE,
			   filters:[
			             search.createFilter({
			        	 name:'isinactive',
			        	 operator:'is',
			        	 value:false
			             }),
			             search.createFilter({
				        	 name:'custevent_hms_sms_message_id',
				        	 operator:'is',
				        	 value:messageid
				             })
			         ]
		
		          });
		if(finalresults)
		{
		
			var recordid = finalresults[0].searchId;
			log.debug("recordid",recordid);
			if(currentid == recordid)
			{
				idmatched = true;
			}
		
		}else
		{
			idmatched = false;
		}
		
		
    }catch(e){
    	  
    	log.debug("Error In execution ",e)
    	
    }
	
    return idmatched;	
}




