/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/runtime','N/search'],

function(record,log,runtime,search) {
	function assignNightCall(scriptContext)
	{				var type = scriptContext.type;
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
		if(scriptContext.type == 'create' || scriptContext.type == 'copy')
	  
		{
			try
			{
				log.debug({
					title:'enter in try function'
				});
				
				var user = runtime.getCurrentUser();
                log.debug({
                	title:'user',
                	details:user
                });
                var userId =user.id
                log.debug({
                	title:'userId',
                	details:userId
                });
				if(userId == 3862)
				{
					//nlapiSetFieldValue('assigned','');				
				
					var emprole = searchEmployeeRole(user);
					
					log.debug({
						title:'emprole '+emprole,
						details:' user '+user
					});
					if(emprole == 32)
					{
						var lastsupportroleid = lastSupportCase();
						log.debug({
							title:'lastsupportroleid',
							details:lastsupportroleid
						});
						if(lastsupportroleid)
						{
							
							var assignedid = search.lookupFields({
							    type: search.Type.SALES_ORDER,
							    id: lastsupportroleid,
							    columns: 'custentity_job_title'
							});
						
							log.debug({
								title:'assignedid'+assignedid,
								details:'lastsupportroleid '+lastsupportroleid
							});
							//nlapiSetFieldValue('assigned','');
							if(assignedid == 32)
							{
						
								record.setValue({
									fieldId:'assigned',
									value:lastsupportroleid
								});
							}
							else
							{
								
								record.setValue({
									fieldId:'assigned',
									value:''
								});
							}
						}
						
						
					}
				}
				else
				{
			
					record.setValue({
						fieldId:'assigned',
						value:user
					});
				}
			}
			catch(e)
			{
				
				log.error({
					title:'Main function error',
					details:e
				});
			}
		}
     }
	}

	/*function assignNightCallCS(type)
	{
		if(type == 'create' || type == 'copy')
		{
			tryl
			{
				var user = nlapiGetUser();
			//	alert(user);
				if(user == 3862)
				{
					/*
					//nlapiSetFieldValue('assigned','');
				
				
					var emprole = searchEmployeeRole(user);
					//alert( 'emprole '+ emprole+' user '+user);
					if(emprole == 32)
					{
						var lastsupportroleid = lastSupportCase();
						if(lastsupportroleid)
						{
							var assignedid = nlapiLookupField('employee', lastsupportroleid, 'custentity_job_title');
						//	alert( 'assignedid '+ assignedid);
							
							//nlapiSetFieldValue('assigned','');
							if(assignedid == 32)
							{
								nlapiSetFieldValue('assigned',lastsupportroleid);
							}
							else
							{
								nlapiSetFieldValue('assigned','');
							}
						}
						
						
					}
					*/
			/*	}
				else
				{
					var aval = nlapiGetFieldValue('assigned');
					if(aval == 3862)
					{
						alert("Night Phones cannot be assigned appointments. Please select your name from the list");
						nlapiSetFieldValue('assigned','');
						
					}
				}
			}
			catch(e)
			{
				nlapiLogExecution('ERROR', 'Main function error ', e);
			}
		}
	}*/

	function searchEmployeeRole(employeeid)
	{
		try
		{
			log.debug('enter in searchEmployeeRole try ()')
		 //getting list
			var empresult =search.create({
				type:search.Type.EMPLOYEE,
				columns:[{name:'custentity_job_title'}],
				filters:[{
					name:'internalid',
					operator:'anyof',
					values:employeeid
				}]
			});
		log.debug({
			title:'empresult',
			details:empresult
		});
			var roleid = '';
			if(empresult)
			{
				roleid = empresult[0].getValue({//////////////need to be test 
					fieldId:'custentity_job_title'
				});
				log.debug({
					title:'roleid',
					details:roleid
				});
			}
			log.debug('enter in searchEmployeeRole try () end')
			return roleid;
		}
		catch(e)
		{
			log.error({
				title:'searchEmployeeRole error function',
				details:e
			});
			return '';
		}
	}

	function lastSupportCase()
	{
		try
		{ 
			log.debug('lastSupportCase try function start');
			 //getting list
			var empresult = search.create({
				type:search.Type.SUPPORT_CASE,
				columns:['internalid','assigned']
				//columns[0].setSort(true),
			});
			log.debug({
				title:'empresult',
				details:JSON.stringify(empresult) 
			});
			var assignedid = '';
			if(empresult)
			{
				var assignedid = empresult[0].getValue({
					fieldId:'assigned'
				});
				log.debug({
					title:'assigned',
					details:assignedid 
				});
			}
			log.debug('lastSupportCase try function end');
			return assignedid;
		}
		catch(e)
		{
			log.error({
				title:'lastSupportCase error ',
				details:e
			});
			return '';
		}
	}
   

    return {
        beforeLoad: assignNightCall
    };
    
});
