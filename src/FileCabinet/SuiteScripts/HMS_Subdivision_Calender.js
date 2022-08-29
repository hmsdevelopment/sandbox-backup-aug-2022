function subDivisionCalender(request, response)
{
	if(request.getMethod() == "GET")
	{
		var date = new Date();
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var fday = firstDay.getDate();
		var lday = lastDay.getDate();
		var currentmonth = firstDay.getMonth() + 1;
		var currentyear = firstDay.getFullYear();
		var html = '<TABLE BORDER=3 CELLSPACING=0 CELLPADDING=0>';
		var filters = [];
		filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));                   
		var columns = [ new nlobjSearchColumn('entityid')];
		var employeeresult = nlapiSearchRecord('employee', null, filters, columns);
		var employeelist = '';
		employeelist += '<option value=""></option>';
		for(var e=0; (employeeresult) && (e < employeeresult.length); e++)
		{
			var empid = employeeresult[e].getId();
			var empname = employeeresult[e].getValue('entityid');
			nlapiLogExecution('DEBUG', 'empid '+empid, 'empname ' + empname);
			employeelist += '<option value="'+empid+'">'+empname+'</option>';
			
		}
	
		var filterssub = [];
		filterssub.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));                   
		var columnssub = [ new nlobjSearchColumn('name')];
		var subdivisionresult = nlapiSearchRecord('customrecord_subdivision', null, filterssub, columnssub);
		var subdivisionlist = '';
		subdivisionlist += '<option value=""></option>';
		html += '<tr>';
		html += '<td ALIGN=center></td>';
		
		var i=1;
		while(i <= lday)
		{
			var adate = currentmonth+'/'+ i + '/' + currentyear;
			html += '<td ALIGN=center>'+adate+'</td>';
			i++
		}
		html += '</tr>';
		for(var s=0; (subdivisionresult) && (s < 20); s++)
		{
			var subdivisionid = subdivisionresult[s].getId();
			var subdivisionname = subdivisionresult[s].getValue('name');
			nlapiLogExecution('DEBUG', 'subdivisionid '+subdivisionid, 'subdivisionname ' + subdivisionname);
			subdivisionlist += '<option value="'+subdivisionid+'">'+subdivisionname+'</option>';
			html += '<tr>';

			html += '<td ALIGN=center>'+subdivisionname+'</td>';			
			var j=1;
			while(j <= lday)
			{
				nlapiLogExecution('DEBUG', 'j '+j, 'lday ' + lday);
				html += '<td ALIGN=center><select>'+employeelist+'</select></td>';
				j++;
			}
			html += '</tr>';
		}
		
		html += '</table>';
		response.write(html);
	}
}




