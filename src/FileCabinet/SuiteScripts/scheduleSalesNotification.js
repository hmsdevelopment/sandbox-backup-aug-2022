function sendSalesNotification()
{
	var status = nlapiGetFieldValue('custrecord_property_status');
	var salesNotificationSent = nlapiGetFieldValue('custrecord_sales_notification_sent');
	if(status == '8' && (salesNotificationSent == '' || salesNotificationSent == null))
	{
		nlapiScheduleScript('customscript_send_sales_notificaiton', 'customdeploy_send_sales_notificaiton');
	}
}