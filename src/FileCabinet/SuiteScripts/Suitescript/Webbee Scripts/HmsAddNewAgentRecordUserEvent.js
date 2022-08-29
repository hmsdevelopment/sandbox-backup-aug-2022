/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/search','N/log','N/email','N/ui/serverWidget'],

function(recordAll,search,log,email,serverWidget) {
   
	/*Summary
	 * File-Name : Add_New_Agent_Record_UserEvent.js
	 * Script Type : User Event
	 * Client : HMS Consulting
	 * Author : Pranjal Goyal
	 * Date : 12th August 2016 
	 */
	var body  = '';
	var author = 4276;
	var subject = 'test ,';
	var recipient = 'shikha@webbee.biz';

	function addAgentFormBeforeLoad(scriptContext, form, request)
	{
		var type =scriptContext.type;
		var record =scriptContext.newRecord;
		var id =record.id;
	
		var form = scriptContext.form;
        var customForm = record.getValue({
        	fieldId:'customform'
        })	;	

		if(scriptContext.type == 'edit'&& id==81157 )
			{
		try
		{
			   if(scriptContext.type == 'create' || scriptContext.type == 'edit')
			{  
               //custom17 62
	          form.addField({
	            	id:'custpage_sel_agent_321',
	            	type:serverWidget.FieldType.SELECT,
	            	label:'Select Agent',
	            	 })//.isDisabled(true);
	         log.debug('1 add Field')

                form.addField({
                	id:'custpage_email_of_agent_4',
                	type:serverWidget.FieldType.EMAIL,
                	label:'Agent Email',
                	displayType:serverWidget.FieldDisplayType.HIDDEN
                })	;

	         log.debug('2 add Field')
	            form.addField({
	            	id:'custpage_agentid_of_agent_312',
	            	type:serverWidget.FieldType.TEXT,
	            	label:'Agent Id',
	            	displayType:serverWidget.FieldDisplayType.HIDDEN
	               });

	         log.debug('3 add Field')
	            form.addField({
	            	id:'custpage_cellno_of_agent_4',
	            	type:serverWidget.FieldType.PHONE,
	            	label: 'Agent Mobile',
	            	displayType:serverWidget.FieldDisplayType.HIDDEN
	            });
			}	    
		}
		catch(ex)
		{
			 body = 'Exception : '+ex+', Message : '+ex.message;
  	 email.send({
	      		author:author,
	      		recipients:recipient,
	      		subject:subject,
	      		body:body
	      	 });
	      	 
	      	 
	      	log.debug('79')
		   }  
			}
	}

	function afterSubmit(scriptContext)
	{
		
		var type = scriptContext.type;
		var record = scriptContext.newRecord;
		var id=record.id
    log.debug("id",id)
//		var form = scriptContext.form;
		// var recordValue =recordAll.load({
		// 	type:recordAll.Type.SUPPORT_CASE,
		// 	id:id
		// });
    // 
		// var customForm = recordValue.getValue({
		// 	fieldId:'customform'
		// });
		//var formType = scriptContext.type;

	//	if(scriptContext.type=='edit' && id==81157 && customForm==85)		{
		try
		{  log.debug("bsrID","before")
			var bsrId = record.getValue({
				fieldId:'custevent_crm_bsr_team'
			});
      log.debug("bsrID",bsrId)

		    var recordType = record.type;
      log.debug("recordType",recordType)
			var id = record.id

			if(defValue(bsrId) != '')
		    {
				var bsrCal = search.lookupFields({
					type:search.Type.PARTNER,
					id:bsrId,
					columns:'custentity_team_calendar'
				});
          log.debug("bsrCal",bsrCal)
          
				if(defValue(bsrCal) != '')
                  
				recordAll.submitFields({
					      type:recordType,
					      id:id,
					      values:bsrCal,
					      fieldId:'custevent_crm_team_calendar',
					      enableSourcing:true
				         });
				log.debug('176')
		    }		
		}
		catch(ex)
		{
			 body = 'Exception : '+ex+', Message : '+ex.message;
       email.send({
	      		author:author,
	      		recipients:recipient,
	      		subject:subject,
	      		body:body
	      	 });
	      	 log.debug('191')
           log.debug('ex',ex)
		}  
//	}
	}

	function defValue(value)
	{	log.debug('def Value () start')
		try
		{ log.debug('def Value try () start')
		    if(value == null || value == undefined || value == '')
		    value = '';	    
		    return value;
		    log.debug('230')
		}
		catch(ex)
		{
			 body = 'Exception : '+ex+', Message : '+ex.message;
		      	 email.send({
	      		author:author,
	      		recipients:recipient,
	      		subject:subject,
	      		body:body
	      	 });
		}
	}

    return {
        beforeLoad: addAgentFormBeforeLoad,
        afterSubmit: afterSubmit
    };
    
});
