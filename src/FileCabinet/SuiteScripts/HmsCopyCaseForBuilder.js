/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/log','N/url','N/https','N/ui/serverWidget'],

function(recordAll,log,url,https,serverWidget) {
	function CopySupportCase(scriptContext)
	{
		var type =scriptContext.type;
		log.debug({
			title:'type',
			details:type
			});
		var record = scriptContext.newRecord
		log.debug({
			title:'condition record',
			details:record
		});
		var id =record.id;
		log.debug({
			title:'id',
			details:id
		});
		var form = scriptContext.form;
		var customForm =record.getValue({
			fieldId:'customform'
		});
		log.debug({
			title:'customForm',
			details:customForm
		});
		if(scriptContext.type == 'edit' && id==81157 && customForm==85)
			{
		try
		{
		log.debug('enter in try ()')

    	//if(scriptContext.type == 'create')
    		if(scriptContext.type == 'edit')
		   {log.debug('scriptContext.type')
			var id = record.id;
			log.debug({
				title:'id',
				details:id
			});
			var record =recordAll.load({
				type:recordAll.Type.SUPPORT_CASE,
			    id:id
			});
			log.debug({
				title:'record',
				details:record
			});
			var builderids = record.getValue({
				fieldId:'custevent_hms_copy_to_builder'
			});
			log.debug({
				title:'builderids',
				details:builderids
			});
			var buildersubdivision = record.getValue({
				fieldId:'company'
			});//////remove log 
			log.debug({
				title:'buildersubdivision',
				details:buildersubdivision
			});
			log.audit({
				title:'builderids',
				details:'builderids'+builderids
			});
			if(builderids)
			{
			log.debug('builderids')
			record.setValue({
				fieldId:'custevent_hms_copy_to_ren1',
				id:builderids
			});
			}
			log.debug('builder save')
			record.save({
				enableSourcing:false,
				ignoreMandatoryFields:false
			});
			builderids=['3642','3643']
			log.debug({
				title:'builderids',
				details:builderids
			});
			var copyids = '';
			for(var i in builderids)
			{log.debug('for loop copyids')
				var value = builderids[i];
				if(copyids == '')
				{  log.debug('copyids IF')
					copyids = value;
				}
				else
				{  log.debug('copyids ELSE')
					copyids = copyids + ',' +value;
				}
			
			}
			
			for(var i in builderids)
	        {log.debug('for loop value')
				var value = builderids[i];
			  log.debug({
				 title:'value',
				 details:value
			  });
				log.audit({
					title:'value',
					details:'value '+value+' i '+i
				});
				if(value && (value != 'null'))
				{log.debug('value condition if')
					if(buildersubdivision != value)
					{
			          log.debug('if buildersubdivision')
					var urlout = url.resolveScript({
						scriptId:'customscript_hms_copy_support',
						deploymentId:'customdeploy_hms_copy_support',
						returnExternalUrl:true
					});
			
					urlout =urlout+'&id='+id+'&value='+value+'&copyids='+copyids;
					
//					urlout = urlout.replace(/https/,'http');
			log.debug({
				title:'urlout',
				details:urlout
			})
				var reqObj = {
				             id:id,
				          value:value	,
				          copyids:copyids
								};
					var httpValue = https.request({
						method: https.Method.POST,
					    url:urlout,
					    body:(reqObj)
					});
		/*	var response = http.request({
				method: http.Method.POST,
				url:'http://www.textmagic.com/app/api?username='+username+'&password='+password+'&cmd=account',
				body:(reqObj),
			headers:header
				});*/
			log.debug({
				title:'http',
				details:httpValue
			});
			log.debug('end of try condition')
					/*
					var copyrecord = nlapiCopyRecord('supportcase',id);
					copyrecord.setFieldValue('company',value);
					var id1 = nlapiSubmitRecord(copyrecord,true,true);
					nlapiLogExecution('AUDIT','id1',id1); 
					*/
					}
				}
			}
			
		}
		}
		catch(e)
		{
			
			log.error({
				title:' Exception emessage',
				details:e.message
			});
		}
	}
	}

	/*
	function copyinquiry(request,response)
	{
		var id = request.getParameter('id');
		var value = request.getParameter('value');
		nlapiLogExecution('AUDIT','id'+id+' value '+value); 
		var precord = nlapiLoadRecord('supportcase',id);
		var prevrecids = '';//precord.getFieldValues('custevent_hms_copy_to_ren1');
		var aids = [];
		for(var i1 in prevrecids)
		{
			var iidi = prevrecids[i1];
			aids.push(iidi);
		}
		nlapiLogExecution('AUDIT','prevrecids'+prevrecids,'aids '+aids);
		if(value && (value != 'null'))
		{
			var copyrecord = nlapiCopyRecord('supportcase',id);
			copyrecord.setFieldValue('company',value);
			var idvalues = copyrecord.getFieldValues('custevent_hms_copy_to_builder');
			var idvalues1 = '';
			var primarybsr = getPrimaryBSR(value);
			nlapiLogExecution('AUDIT','primarybsr'+primarybsr+' idvalues '+idvalues+' idvalues1 '+idvalues1); 
			copyrecord.setFieldValue('custevent_builder_sales_rep_subd',primarybsr);
			copyrecord.setFieldValue('custevent_hms_copy_to_builder','');
			//copyrecord.setFieldValues('custevent_hms_copy_to_ren1',aids);
			copyrecord.setFieldValue('custevent_ren_sent','F');
			copyrecord.setFieldValue('custevent_bsr_notify_sent','F');
			var id1 = nlapiSubmitRecord(copyrecord,true,true);
			nlapiLogExecution('AUDIT','id1',id1);      
		}
	}

	function getPrimaryBSR(value)
	{
		var prmbsr = '';
		try
		{
			var filters = [];
			filters.push(new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
			filters.push(new nlobjSearchFilter( 'internalid', null, 'anyof', value, null));
			var columns = [];												
			columns.push(new nlobjSearchColumn('custentity_hms_sales_manager'));
			var searchresults = nlapiSearchRecord('customer', null,filters, columns);
			if(searchresults)
			{
				prmbsr = searchresults[0].getValue('custentity_hms_sales_manager');
			}
			
		}
		catch(e)
		{
			errmsg = '';
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
			nlapiLogExecution( 'ERROR',  ' 999 Error', errmsg);
		}
		return prmbsr;
	}
	*/
//<---------------function not in use--------------->
	/*function optinpartner(request,response)
	{
		var id = request.getParameter('id');
		
		log.audit({
			title:'id',
			details:id
		});
		try
		{
		
			if(id)
			{
		
				var record =record.load({
					type:record.Type.PARTNER,
					id:id
				});
		
				record.setValue({
					fieldId:'custentity_opt_out_builder_leads',
					value:'F'
				});
		
				var aid = record.save({
					enableSourcing:false,
					ignoreMandatoryFields:false
				});
		
				log.audit({
					title:'aid',
					details:aid
				});
			}
		
		}
		catch(e)
		{
			
			log.error({
				title:'Exception emessage',
				details:e.message
			});
		}
		
		log.audit('pass till after catch');
		var html = '<html>'
		html += '<head><title>Success...</title></head>';
		html += '<body><form align="center"><div align="center"><span>Thank you, you will now receive notifications for web leads.</span><br>';
		html += '<input type="button" value="OK"  onclick="window.close();" />';
		html += '</div></form></body>';
		html += '</html>';
		response.write(html);
		

	}

	function successForm(request,response)
	{
		
		log.audit('pass till inside success form');
		
		var form =serverWidget.createForm({
			title:'Success'
		});
		
		var success = form.addField({
			id:'success',
			type:serverWidget.Type.TEXT,
			label:'Record Update .',
			displayType:serverWidget.FieldDisplayType.INLINE	
		});
		
			var success = form.addButton({
				id:' custpage_ok ',
				label:'OK',
				functionName:'window.close();'
			});
				
		response.writePage(form);
		
		log.audit('pass after form')
		
	}


	function failure(request,response)
	{
		
		log.audit('pass till inside sucess form')
		
		var form =serverWidget.createForm({
			title:'Failure'
		});
		
		var success =form.addField({
			id:'success',
			type:serverwidget.Type.TEXT,
			label:'unable to find required value 2.0',
			displayType:serevrWidget.FieldDisplayType.INLINE
		});
		
					form.addButton({
				id:'custpage_ok_2.0',
				label:'OK',
				functionName:'window.close();'
			});
		
		response.writePage(form);
		
		log.audit('pass after form');
		
	}

	function optInReverse(request,response)
	{
		var id = request.getParameter('recid');
		
		log.audit({
			title:' id ',
			details:id
		});
		if(request.getMethod()=='GET')
		{
			try
			{
			
				if(id)
				{

					var record = record.load({
						type:record.Type.PARTNER,
						id:id
					});

					var optoutrtan = record.getValue({
						fieldId:'custentity_opt_out_rtan'
					});
					if(optoutrtan == 'T')
					{
						optoutrtan = 'F';
					}
					else
					{
						optoutrtan = 'T';
					}
					var enabletext = record.getValue({
						fieldId:'custenitity_enable_two_way_sms'
					});
					
					var fname = record.getValue({
						fieldId:'firstname'
					});
					
					var lname = record.getValue({
						fieldId:'lastname'
					});
					
					log.audit({
						title:' optoutrtan ',
						details:optoutrtan
					});
					log.audit({
						title:' enabletext',
						details:enabletext
					});
					
					var form1 = serverWidget.createForm({
						title:'Communicaton Preferences for '+ fname + ' ' + lname
					});
					//var optin = form1.addField('custpage_optin','checkbox','Enable Email Notifications',null,null);
					//optin.setDefaultValue(optoutrtan);
				       var enabletext1 = form1.addField({
                    	id:'custpage_enabletext',
                    	type:serverWidget.FieldType.CHECKBOX,
                    	label:'Enable Two Way Texting'
                    });			
					enabletext1.setDefaultValue(enabletext);
					
					var fnamefield = form1.addField({
						id:'custpage_fname',
						type:serverWidget.FieldType.TEXT,
						label:'First Name'
					});
					fnamefield.setDefaultValue(fname);
					
				
					var lnamefield = form1.addField({
						id:'custpage_lname',
						type:serverWidget.FieldType.TEXT,
						label:'Last Name'
					});
					lnamefield.setDefaultValue(lname);
					
				
					var email = record.getValue({
						fieldId:'email'
					});
				
					var emailfield = form1.addField({
						id:'custpage_email',
						type:serverWidget.FieldType.EMAIL,
						label:'Email'
					});
					emailfield.setDefaultValue(email);
					
				
					var mobilephone = record.getValue({
						fieldId:'mobilephone'
					});
				
					var mobilephonefield = form1.addField({
						id:'custpage_mobilephone',
						type:serverWidget.FieldType.PHONE,
						label:'Phone'
					});
					mobilephonefield.setDefaultValue(mobilephone);
					
				   var altpphone = record.getValue({
						fieldId:'custentity_alternative_phone'
					});
					
					var altphonefield = form1.addField({
						id:'custpage_altphone',
						type:serverWidget.FieldType.PHONE,
						label:'Alternative Phone Number'
					});
					altphonefield.setDefaultValue(altphone);
					
					
					
					var enabletext2 = form1.addField({
						id:'custpage_recordid',
						type:serverWidget.Type.TEXT,
						label:'Recordid',
						displayType:serverWidget.FieldDisplayType.HIDDEN
						
					});
					enabletext2.setDefaultValue(id);
					
					form1.addSubmitButton({
						label:'Submit'
					});
					response.writePage( form1 ); 
					return;
				}
				else
				{
					failure(request,response);
				}
			
			}
			catch(e)
			{
				
				log.error({
					title:'Exception emessage',
					details:e.message
				});
			}
			
			log.audit('pass till after catch');
				
			
		}
		else
		{
			/*var optin = request.getParameter('custpage_optin') || '';	
			if(optin == 'T')
			{
				optin = 'F';
			}
			else
			{
				optin = 'T';
			}*/
			/*/////2.0var enabletext = request.getParameter('custpage_enabletext') || 'F';	
			
			var recordid = request.getParameter('custpage_recordid') || '';	
			
			var firstname = request.getParameter('custpage_fname') || '';	
			var lastname = request.getParameter('custpage_lname') || '';	
			var emailid = request.getParameter('custpage_email') || '';	
			var mobilephone = request.getParameter('custpage_mobilephone') || '';	
			var altphoneno = request.getParameter('custpage_altphone') || '';	
			
			
			log.audit({
				title:'recordid',
				details:recordid
			});
			if(recordid)
			{
			
				var record = record.load({
					type:record.Type.PARTNER,
					id:recordid
				});
				//record.setFieldValue('custentity_opt_out_rtan',optin);
			
				record.setValue({
					fieldId:'custentity_enable_two_way_sms',
					value:enabletext
				});
				
			
				record.setValue({
					fieldId:'firstname',
					value:firstname
				});
			
				record.setValue({
					fieldId:'lastname',
					value:lastname
				});
			
				record.setValue({
					fieldId:'email',
					value:emailid
				});
			
				record.setValue({
					fieldId:'mobilephone',
					value:mobilephone
				});
			
				record.setValue({
					fieldId:'custentity_alternative_mobile_phone',
					value:altphoneno
				});
				
			
				var iidi = record.save({
					enableSourcing:false,
					ignoreMandatoryFields:false
				});
			
				log.audit({
					title:' iidi ',
					details:iidi
				});
				var html = '<html>'
				html += '<head><title>Success...</title></head>';
				html += '<body><form align="center"><div align="center"><span>Thank you, your preferences have been updated.</span><br>';
				html += '<input type="button" value="OK"  onclick="window.close();" />';
				html += '</div></form></body>';
				html += '</html>';
				response.write(html);
				return;
			}
			else
			{
			}
			
			
			
			
		}

	}*/






   

    return {
    	afterSubmit:CopySupportCase
    };
    
});
