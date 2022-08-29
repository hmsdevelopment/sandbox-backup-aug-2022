function searchKeyWord(request, response)
{
	var keyword = request.getParameter('keyword') || '';
	var searchtype = request.getParameter('searchtype') || '';
	if(searchtype == 'script')
	{
		if(keyword)
		{
			var results = nlapiSearchRecord(null,'customsearch_abhi_search_script');//scriptfile
			var finallist = '';
			var getresultafter = request.getParameter('after') || 0;
			var ab='';
			for(var i=getresultafter; i < results.length; i++)
			{
				if(nlapiGetContext().getRemainingUsage() > 50)
				{
					try
					{
						var scriptfile = results[i].getValue('scriptfile');
						var scriptid = results[i].getId();
						var scriptname = results[i].getValue('name');
						var scriptfiletext = results[i].getText('scriptfile');
						nlapiLogExecution('DEBUG',' i '+i+ 'scriptfile '+scriptfile,' scriptname '+scriptname);
						var file = nlapiLoadFile(scriptfile).getValue();
						var haskeyword = file.indexOf(keyword);
						if(haskeyword >= 0)
						{
							nlapiLogExecution('AUDIT',' hurray ','got it');
							finallist += '<br>file name : '+scriptfiletext+' - script name : '+scriptname;
						}
						ab = i;
					}
					catch(e)
					{
						nlapiLogExecution('Error', 'error details',e);
						
					}
					
				}
				
				
			}
			
			var resurl = nlapiResolveURL('SUITELET','customscript_search_based_on_keyword','customdeploy_search_based_on_keyword');
			var url = resurl+'&searchtype='+searchtype+'&keyword='+keyword+'&after='+ab;
			finallist += '<button type="button" onclick="window.open(\''+url+'\',\'_self\')">Click For Next</button>';
			response.write(finallist);
		}
		else
		{
			response.write('Please provide keyword Ex. &keyword=nlapiLoadRecord&searchtype=script/workflow');
		}
	
	}
	else if (searchtype == 'workflow')
	{
		
		if(keyword)
		{
			
			response.write('this functionality coming soon.');
		}
		else
		{
			response.write('Please provide keyword Ex. &keyword=nlapiLoadRecord&searchtype=script/workflow');
		}
	}
	else
	{
		response.write('Please provide keyword Ex. &keyword=nlapiLoadRecord&searchtype=script/workflow');
	}
}