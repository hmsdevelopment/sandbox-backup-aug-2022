
var html = '<!DOCTYPE html>';
	html = html + '<html>';
	html = html + '<head>';
	var scripthtml = '<style>'+nlapiGetContext().getSetting('SCRIPT', 'custscript_css_file');
	
	scripthtml += '</style></head>';
	scripthtml += '<body>';

function agentFormSelection(request, response)
{
	if(request.getMethod() == 'GET')
	{
		html = html + '<title>Agent Selection</title>'+scripthtml;
		html += '<form id="form" align="center" name="input" action="https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=78&deploy=1" method="POST">';
		html += '<table align = "center" id="customers">';
		
		html += '<tr>';
		html += '<td colspan="2">';
		html += '<span>Agent Type</span><select id="selection" name="selection">';
		html += '<option value="1">Real Estate Agent</option>';
		html += '<option value="2">Appraiser/Inspector</option>';
		html += '<option value="3">Individual</option>';
		html += '<option value="4">Website</option>';
		html += '<option value="5">Web Lead</option>';
		html += '</select></td></tr>';
		html += '<tr class="alt"><td colspan="2"><input type="submit" value="Save"></td></tr>';
		html += '</form>';
		html += '</body>';
		html += '</html>';
		response.write(html);
		/*
		var form = nlapiCreateForm('Agent Selection');
		var selection = form.addField('selection', 'select', 'Agent Type');
		selection.addSelectOption('1', 'Real Estate Agent');
		selection.addSelectOption('2', 'Appraiser/Inspector');
		selection.addSelectOption('3', 'Individual');
		selection.addSelectOption('4', 'Website');
		selection.addSelectOption('5', 'Web Lead');
		form.addSubmitButton();
		response.writePage(form);
		*/
	}

	else
	{
		var newAgent = nlapiCreateRecord('customrecord_agent');
		newAgent.setFieldValue('name', 'New Agent');
		var params = new Array();

		var agentForm = request.getParameter('selection');
		if(agentForm == '5')
		{
			newAgent.setFieldValue('custrecord_agent_type', '8');
			params['cf'] = '45';
		}

		else if(agentForm == '3')
		{
			newAgent.setFieldValue('custrecord_agent_type', '4');
			params['cf'] = '44';
		}

		else
		{
			newAgent.setFieldValue('custrecord_agent_type', '2');
			params['cf'] = '31';
		}
		var id = nlapiSubmitRecord(newAgent);
		nlapiSetRedirectURL('RECORD', 'customrecord_agent', id, true, params);
	}
}