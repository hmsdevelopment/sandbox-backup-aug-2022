function SystemNotes(request,response)
{
	try
	{
		if(request.getMethod() == 'GET')
		{
			CreateForm(request,response)
		}
		else
		{
			var date = new Date();
			var today = nlapiDateToString(date);
			var mlsregion = request.getParameterValues('custpage_location');
			/*
			var mlsregion = [];
			nlapiLogExecution('DEBUG','mlsregionarr',' mlsregionarr : '+mlsregionarr);
			for(var i=0;mlsregion && (i < mlsregion.length);i++)
			{
				mlsregion.push(mlsregion[i]);
			}
			*/
			nlapiLogExecution('DEBUG','mlsregion',' mlsregion : '+mlsregion);
			var rowfinal = [];
			var list = nlapiCreateList('MLS Changes Report...');
			list.setStyle('grid');
			
			var alreadyadded = [];
			list.addColumn('id', 'text', 'Id', 'center');
			list.addColumn('mlsreg1', 'text', 'MLS Region ', 'center');
			//list.addColumn('mlsreg2', 'text', 'MLS Region 2', 'center');
			list.addColumn('name', 'text', 'Name', 'center');			
			list.addColumn('priorstatus', 'text', 'Prior Const. Status', 'center');
			list.addColumn('currentstatus', 'text', 'Current Construction Status', 'center');
			list.addColumn('priorprice', 'text', 'Prior List Price', 'center');
			list.addColumn('currentprice', 'text', 'Current List Price', 'center');
			list.addColumn('lastmodified', 'text', 'Last Modified', 'center');
			//---------------------- for status field -------------------------------
			var filters = [];
			filters.push(new nlobjSearchFilter('isinactive',null,'is','F'));
			filters.push(new nlobjSearchFilter('custrecord15',null,'anyof',mlsregion));
			//filters.push(new nlobjSearchFilter('custrecord_report_run_date',null,'noton',today));
			var searchresults = nlapiSearchRecord('customrecord_property_record', 'customsearch260', filters, null);
			if(searchresults)
			{
				nlapiLogExecution('DEBUG','searchresults',' searchresults : '+searchresults.length);
				for(var i=0; i < searchresults.length;i++)
				{
					var columnsa = searchresults[i].getAllColumns();
					var sid = searchresults[i].getId();
					
					var mlsreg1 = searchresults[i].getText(columnsa[0]);
					var mlsreg1val = searchresults[i].getValue(columnsa[0]);
					var name1 = searchresults[i].getValue(columnsa[1]);
					var priorconststatus = searchresults[i].getValue(columnsa[2]);
					var currentconststatus = searchresults[i].getText(columnsa[3]);
					var priorlistprice = searchresults[i].getValue(columnsa[4]);
					var currentlistprice = searchresults[i].getValue(columnsa[5]);
					var lastmodified1 = searchresults[i].getValue(columnsa[6]);
					var mlsreg2 = searchresults[i].getText(columnsa[7]);
					var comb = sid+'_'+mlsreg1val;
					alreadyadded.push(comb);
					
					var rows = [];
					rows['id'] = '<a href= "#" onclick="window.open(\'https://1309901.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=18&id='+sid+'\')">View</a>';
					rows['mlsreg1'] = mlsreg1;
					rows['name'] = name1;
					rows['priorstatus'] = priorconststatus;
					rows['currentstatus'] = currentconststatus;
					rows['priorprice'] = priorlistprice;
					rows['currentprice'] = currentlistprice;
					rows['lastmodified'] = lastmodified1;
												
					rowfinal.push(rows);
					//nlapiSubmitField('customrecord_property_record',sid,'custrecord_report_run_date',today);
					//_report_run_date
					
					
				}
			}
			else
			{
				nlapiLogExecution('DEBUG',' noresult found ',' noresult found  ');
			}
			
			var filters2 = [];
			filters2.push(new nlobjSearchFilter('isinactive',null,'is','F'));
			filters2.push(new nlobjSearchFilter('custrecord16',null,'anyof',mlsregion));
			//filters2.push(new nlobjSearchFilter('custrecord_report_run_date',null,'noton',today));
			//if(alreadyadded && (alreadyadded.length > 0))
			//filters2.push(new nlobjSearchFilter('internalid',null,'noneof',alreadyadded));
			var searchresults2 = nlapiSearchRecord('customrecord_property_record', 'customsearch260', filters2, null);
			if(searchresults2)
			{
				nlapiLogExecution('DEBUG','searchresults2',' searchresults2 : '+searchresults2.length);
				for(var i=0; i < searchresults2.length;i++)
				{
					var columnsa = searchresults2[i].getAllColumns();
					var sid = searchresults2[i].getId();
					var mlsreg1 = searchresults2[i].getText(columnsa[0]);
					var name1 = searchresults2[i].getValue(columnsa[1]);
					var priorconststatus = searchresults2[i].getValue(columnsa[2]);
					var currentconststatus = searchresults2[i].getText(columnsa[3]);
					var priorlistprice = searchresults2[i].getValue(columnsa[4]);
					var currentlistprice = searchresults2[i].getValue(columnsa[5]);
					var lastmodified1 = searchresults2[i].getValue(columnsa[6]);
					var mlsreg2 = searchresults2[i].getText(columnsa[7]);
					var mlsreg2val = searchresults2[i].getValue(columnsa[7]);
					var comb = sid+'_'+mlsreg2val;
					if(alreadyadded.indexOf(comb) == -1)
					{
						alreadyadded.push(comb);
						
						var rows = [];
						rows['id'] = '<a href= "#" onclick="window.open(\'https://1309901.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=18&id='+sid+'\')">View</a>';
						rows['name'] = name1;
						rows['mlsreg1'] = mlsreg2;
						rows['priorstatus'] = priorconststatus;
						rows['currentstatus'] = currentconststatus;
						rows['priorprice'] = priorlistprice;
						rows['currentprice'] = currentlistprice;
						rows['lastmodified'] = lastmodified1;
													
						rowfinal.push(rows);
						//nlapiSubmitField('customrecord_property_record',sid,'custrecord_report_run_date',today);
					}
				}
			}
			else
			{
				nlapiLogExecution('DEBUG',' noresult found for result 2 ',' noresult found  ');
			}
			//----------------------- end of status field --------------------------
			var filters = [];
			filters.push(new nlobjSearchFilter('isinactive',null,'is','F'));
			filters.push(new nlobjSearchFilter('custrecord15',null,'anyof',mlsregion));
			//filters.push(new nlobjSearchFilter('custrecord_report_run_date',null,'noton',today));
			//if(alreadyadded && (alreadyadded.length > 0))
			//filters.push(new nlobjSearchFilter('internalid',null,'noneof',alreadyadded));
			
			var searchresults = nlapiSearchRecord('customrecord_property_record', 'customsearch261', filters, null);
			if(searchresults)
			{
				nlapiLogExecution('DEBUG','searchresults',' searchresults : '+searchresults.length);
				for(var i=0; i < searchresults.length;i++)
				{
					var columnsa = searchresults[i].getAllColumns();
					var sid = searchresults[i].getId();
					var mlsreg1 = searchresults[i].getText(columnsa[0]);
					var mlsreg1val = searchresults[i].getValue(columnsa[0]);
					var name1 = searchresults[i].getValue(columnsa[1]);
					var priorconststatus = searchresults[i].getValue(columnsa[2]);
					var currentconststatus = searchresults[i].getText(columnsa[3]);
					var priorlistprice = searchresults[i].getValue(columnsa[4]);
					var currentlistprice = searchresults[i].getValue(columnsa[5]);
					var lastmodified1 = searchresults[i].getValue(columnsa[6]);
					var mlsreg2 = searchresults[i].getText(columnsa[7]);
					var comb = sid+'_'+mlsreg1val;
					if(alreadyadded.indexOf(comb) == -1)
					{
						var rows = [];
						rows['id'] = '<a href= "#" onclick="window.open(\'https://1309901.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=18&id='+sid+'\')">View</a>';
						rows['mlsreg1'] = mlsreg1;
						rows['name'] = name1;
						rows['priorstatus'] = priorconststatus;
						rows['currentstatus'] = currentconststatus;
						rows['priorprice'] = priorlistprice;
						rows['currentprice'] = currentlistprice;
						rows['lastmodified'] = lastmodified1;
													
						rowfinal.push(rows);
						//nlapiSubmitField('customrecord_property_record',sid,'custrecord_report_run_date',today);
						alreadyadded.push(comb);
					}
				}
			}
			else
			{
				nlapiLogExecution('DEBUG',' noresult found ',' noresult found  ');
			}
			
			var filters2 = [];
			filters2.push(new nlobjSearchFilter('isinactive',null,'is','F'));
			filters2.push(new nlobjSearchFilter('custrecord16',null,'anyof',mlsregion));
			//filters2.push(new nlobjSearchFilter('custrecord_report_run_date',null,'noton',today));
			//if(alreadyadded && (alreadyadded.length > 0))
			//filters2.push(new nlobjSearchFilter('internalid',null,'noneof',alreadyadded));
			
			
			var searchresults2 = nlapiSearchRecord('customrecord_property_record', 'customsearch261', filters2, null);
			if(searchresults2)
			{
				nlapiLogExecution('DEBUG','searchresults2',' searchresults2 : '+searchresults2.length);
				for(var i=0; i < searchresults2.length;i++)
				{
					var columnsa = searchresults2[i].getAllColumns();
					var sid = searchresults2[i].getId();
					var mlsreg1 = searchresults2[i].getText(columnsa[0]);
					var name1 = searchresults2[i].getValue(columnsa[1]);
					var priorconststatus = searchresults2[i].getValue(columnsa[2]);
					var currentconststatus = searchresults2[i].getText(columnsa[3]);
					var priorlistprice = searchresults2[i].getValue(columnsa[4]);
					var currentlistprice = searchresults2[i].getValue(columnsa[5]);
					var lastmodified1 = searchresults2[i].getValue(columnsa[6]);
					var mlsreg2 = searchresults2[i].getText(columnsa[7]);
					var mlsreg2val = searchresults2[i].getValue(columnsa[7]);
					var comb = sid+'_'+mlsreg2val;
					if(alreadyadded.indexOf(comb) == -1)
					{
						var rows = [];
						rows['id'] = '<a href= "#" onclick="window.open(\'https://1309901.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=18id='+sid+'\')">View</a>';
						rows['name'] = name1;
						rows['mlsreg1'] = mlsreg2;
						rows['priorstatus'] = priorconststatus;
						rows['currentstatus'] = currentconststatus;
						rows['priorprice'] = priorlistprice;
						rows['currentprice'] = currentlistprice;
						rows['lastmodified'] = lastmodified1;
													
						rowfinal.push(rows);
						//nlapiSubmitField('customrecord_property_record',sid,'custrecord_report_run_date',today);
						alreadyadded.push(comb);
					}
				}
			}
			else
			{
				nlapiLogExecution('DEBUG',' noresult found for result 2 ',' noresult found  ');
			}
			//-------------------------------------- End pricelist field----------------------
			list.addRows(rowfinal);
			response.writePage( list );
		}
	}
	catch(e)
	{
		var err = '';
		var errmsg = '';
		if ( e instanceof nlobjError )
		{
			err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
		}
		else
		{
			err = 'Unexpected error: ' + e.toString();
		}
			errmsg += '\n' + err;
		nlapiLogExecution( 'ERROR',   ' 999 Error', errmsg);
	}
}

function CreateForm(request,response)
{
		var form = nlapiCreateForm('MLS Changes Search...');
		form.setScript('customscript_onsave');
		form.addField('custpage_location', 'multiselect', 'MLS Region','location').setMandatory(true);
		
		form.addSubmitButton('Search');
		form.addResetButton();
		response.writePage(form);
}

function onSave()
{	
	var y = confirm("Running this Report will not show the data again today! Click on cancel to stop executing.");
	if(y==true)
	{
		return true;
	}
	else
	{
		return false;
	}
	return true;
}

