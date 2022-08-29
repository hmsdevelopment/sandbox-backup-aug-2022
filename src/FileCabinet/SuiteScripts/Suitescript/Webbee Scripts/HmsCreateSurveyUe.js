/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * todo..... Remove all testing conditions , !view to view
 */
define(['N/record','N/log','N/ui/serverWidget','N/url'],

function(record,log,serverWidget,url1) {
	function DisplayButton(scriptContext, form, request){
		log.debug("scriptContext.type "+scriptContext.type)
		if(scriptContext.type != 'view'){
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
		log.debug({
			title:'start testing condition ()'
		});
		try
		{
			 log.debug({
				title:'try function start' 
			 });
			if(scriptContext.type=='edit')
				//if(scriptContext.type=='view')
				{
					log.debug({
						title:'main function start condition ()'
					});
					
					
					    var rec_type = record.type
					    log.debug({
					    	title:'recordType',
					    	details:rec_type 
					    });
					    log.debug('56')
					if(rec_type=='customer'){
						
						log.debug({
							title:'button'
						});
						
						var buiderid=record.id;
						buiderid=buiderid*103;
							
						form.addButton({
							id:'custpage_createsurvey',
							label:'Create Survey',
							functionName:goto_link(buiderid)
						});
					}else if(rec_type=='supportcase'){
						log.debug('72')
						log.debug({
							title:'button'
						});
						
						var case_id=record.id;
//						buiderid=buiderid*103;
					log.debug({
						title:'case_id',
						details:case_id
					});
						form.addButton({
							id:'custpage_createsurvey',
							label:'Submit Survey',
							functionName:goto_link1(case_id)
						});
					}else if(rec_type=='customrecord429'){
						
						log.debug({
							title:'button'
						});
						
						var surveyid=record.id;
//						buiderid=buiderid*103;
					log.debug({
						title:'surveyid',
						details:surveyid
					});
						form.addButton({
							id:'custpage_createsurvey',
							label:'Export Survey Result',
							functionName:goto_link2(surveyid)
						});
					}

				}
		}
		catch(e)
	     {
			log.debug('error',e);
	     }
		
	     }
		}
	}
	function goto_link(buiderid){
	
		var url = url1.resolveScript({
		    scriptId: 'customscript_createsurvey2',
		    deploymentId: 'customdeploy_customscript_survey2',
		    returnExternalUrl: true
		});
	
		var data='var url = \'' + url+'&builderid='+buiderid+'\';';
		 data += 'window.open(url, \'_blank\');';
		return data;
	}
	function goto_link1(case_id){
		
		var url = url1.resolveScript({
		    scriptId: 'customscript_submitsurvey2',
		    deploymentId: 'customdeploy_submitsurvey23',
		    returnExternalUrl: true
		});

		var data='var url = \'' + url+'&query='+case_id+'\';';
		 data += 'window.open(url, \'_blank\');';
		return data;
	}
	function goto_link2(surveyid){
		
		var url = url1.resolveScript({
		    scriptId: 'customscript_surveyreport1',
		    deploymentId: 'customdeploy_getsurveyreport2',
		    returnExternalUrl: true
		});
		var data='var url = \'' + url+'&survey_id='+surveyid+'\';';
		 data += 'window.open(url, \'_self\');';
		return data;
	}
    
    return {
        beforeLoad: DisplayButton
       
    };
    
});
