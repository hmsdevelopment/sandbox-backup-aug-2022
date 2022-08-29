function beforeLoad(type)
{
	if(type == 'create')
	{
		nlapiSetRedirectURL('SUITELET', 'customscript_agent_form_selection', 'customdeploy1');
	}
}