function searchAndCheck(type,name)
{
	try
	{
		if(name == 'custevent_caller_name')
		{
			var agent = nlapiGetFieldValue('custevent_caller_name');
			if(agent)
			{
			var cbsrID = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
			var agentRecord = nlapiLoadRecord('customrecord_agent', agent);
			var agentName = agentRecord.getFieldValue('custrecord_agent_first_name') + ' ' + agentRecord.getFieldValue('custrecord_agent_last_name');
			var propertyid = nlapiGetFieldValue('custevent_property');
			var agenttext = nlapiGetFieldText('custevent_caller_name');
	  
			if((agent) && (propertyid) )
			{
				
				var filters = [];
				filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
				filters.push(new nlobjSearchFilter('custevent_caller_name', null, 'anyof', agent));
				filters.push(new nlobjSearchFilter('custevent_property', null, 'anyof', propertyid));
				var id = nlapiGetRecordId();
				if(id)
				{
					filters.push(new nlobjSearchFilter('internalid', null, 'noneof', id));
				}
				
				var columns = [];
				columns.push(new nlobjSearchColumn('internalid'));
				columns.push(new nlobjSearchColumn('createddate'));
				columns.push(new nlobjSearchColumn('custevent_builder_sales_rep_subd'));
				columns[0].setSort(true);
				
				var results = nlapiSearchRecord('supportcase',null, filters, columns);
				if(results)
				{
					//alert(' agent '+agent+' agenttext '+agenttext);
					var datecreated = results[0].getValue('createddate');
					var bsrID = results[0].getValue('custevent_builder_sales_rep_subd');
					var bsrRecord = nlapiLoadRecord('partner', bsrID);
					var bsrFullName = bsrRecord.getFieldValue('firstname') + ' ' + bsrRecord.getFieldValue('lastname');
					if(datecreated)
					{		
						var alerttext = agentName + ' inquired about this property on ' + datecreated + '. ' + bsrFullName + ' was the builder contact.' ;
						if(cbsrID != bsrID)
						{
							var alerttext1 = agentName + ' inquired about this property on ' + datecreated + '. ' + bsrFullName + ' was the builder contact.Click ok to replace the current BSR with '+bsrFullName+'' ;
							
							
							var r = confirm(alerttext1);
							if (r == true) {
								nlapiSetFieldValue('custevent_builder_sales_rep_subd',bsrID);
							} else {
								//
							}
						}
						else
						{
							var alerttext1 = agentName + ' inquired about this property on ' + datecreated + '. ' + bsrFullName + ' was the builder contact.';
							alert(alerttext1);
						}
						var bsrNote = nlapiGetField('custevent_bsr_assignment_note');
						if(bsrNote)
						{
							nlapiSetFieldValue('custevent_bsr_assignment_note', alerttext);
						}
						else
						{
							newBsrNote = bsrNote + "\n" + "\n" + alerttext + "\n" + bsrFullName + " was the builder contact.";
							nlapiSetFieldValue('custevent_bsr_assignment_note', newBsrNote);
						}
						//alert(alerttext);
					}
					
				}
				
			}
			}
		}
	
		if(name == 'custevent_property')
		{
			var agent = nlapiGetFieldValue('custevent_caller_name');
			var propertyid = nlapiGetFieldValue('custevent_property');
			var agenttext = nlapiGetFieldText('custevent_caller_name');
			if((agent) && (propertyid))
			{
				var filters = [];
				filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
				filters.push(new nlobjSearchFilter('custevent_caller_name', null, 'anyof', agent));
				filters.push(new nlobjSearchFilter('custevent_property', null, 'anyof', propertyid));
				var id = nlapiGetRecordId();
				if(id)
				{
					filters.push(new nlobjSearchFilter('internalid', null, 'noneof', id));
				}
				
				var columns = [];
				columns.push(new nlobjSearchColumn('internalid'));
				columns.push(new nlobjSearchColumn('createddate'));
				columns[0].setSort(true);
				
				var results = nlapiSearchRecord('supportcase',null, filters, columns);
				if(results)
				{
					var datecreated = results[0].getValue('createddate');
					if(datecreated)
					{
						var alerttext = agenttext+' showed this property on '+datecreated;
						alert(alerttext);
					}
					else
					{
						alert('no date created');
					}
				}
				/*
				else
				{
					alert('no previous property found');
				}
				*/
			}
		}
	
	
	}
	
	
	catch(e)
	{
		alert(e.message);
	}
}
