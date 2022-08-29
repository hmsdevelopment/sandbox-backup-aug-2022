function fieldChange(type, name)
{
	if(name == 'custentity_enable_ren')
	{
		var enableREN = nlapiGetFieldValue('custentity_enable_ren');
		if(enableREN == 'T')
		{
			nlapiSetFieldValue('custentity8', 'F');
		}
	}
	
	if(name == 'custentity8')
	{
		var enableEmailNotifications = nlapiGetFieldValue('custentity8');
		if(enableEmailNotifications == 'T')
		{
			nlapiSetFieldValue('custentity_enable_ren', 'F');
		}
	}
}