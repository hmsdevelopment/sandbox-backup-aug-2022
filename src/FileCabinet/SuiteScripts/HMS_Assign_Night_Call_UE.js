function assignNightCall(type)
{
	if(type == 'create' || type == 'copy')
	{
		try
		{
			var user = nlapiGetUser();
			if(user == 3862)
			{
				//nlapiSetFieldValue('assigned','');
			
			
				var emprole = searchEmployeeRole(user);
				nlapiLogExecution('DEBUG', 'emprole '+ emprole,' user '+user);
				if(emprole == 32)
				{
					var lastsupportroleid = lastSupportCase();
					if(lastsupportroleid)
					{
						var assignedid = nlapiLookupField('employee', lastsupportroleid, 'custentity_job_title');
						nlapiLogExecution('DEBUG', 'assignedid', assignedid+' lastsupportroleid '+lastsupportroleid);
						
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
			}
			else
			{
				nlapiSetFieldValue('assigned',user);
			}
		}
		catch(e)
		{
			nlapiLogExecution('ERROR', 'Main function error ', e);
		}
	}
}

function assignNightCallCS(type)
{
	if(type == 'create' || type == 'copy')
	{
		try
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
			}
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
}

function searchEmployeeRole(employeeid)
{
	try
	{
		var filters = [];
		filters.push(new nlobjSearchFilter('internalid', null, 'anyof', employeeid)); 
		var columns = [];
		columns.push(new nlobjSearchColumn('custentity_job_title'));
		var empresult = nlapiSearchRecord('employee', null, filters,columns); //getting list
		var roleid = '';
		if(empresult)
		{
			roleid = empresult[0].getValue('custentity_job_title');
			
		}
		return roleid;
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'searchEmployeeRole error function ', e);
		return '';
	}
}

function lastSupportCase()
{
	try
	{
		var filters = [];
		var columns = [];
		columns.push(new nlobjSearchColumn('internalid'));
		columns.push(new nlobjSearchColumn('assigned'));
		columns[0].setSort(true);
		var empresult = nlapiSearchRecord('supportcase', null, null,columns); //getting list
		var assignedid = '';
		if(empresult)
		{
			var assignedid = empresult[0].getValue('assigned');
		}
		return assignedid;
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'lastSupportCase error ', e);
		return '';
	}
}