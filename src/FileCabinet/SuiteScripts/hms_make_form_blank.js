function makeFormFieldsBlank(type,name,i)
{
	if(name=='custpage_salesstatus')
	{
		var status = nlapiGetFieldValue('custpage_salesstatus');
		//alert(status);
		if(status && (status == 1 || status == 2))
		{
			nlapiSetFieldValue('custpage_contract_approval_date','');
			
			nlapiSetFieldValue('custpage_contract_receive_from_builder','');
			
			nlapiSetFieldValue('custpage_estimated_closing_date','');
			
			nlapiSetFieldValue('custpage_construction_status_at_contract','');
			
			nlapiSetFieldValue('custpage_buyer_name','');
			
			nlapiSetFieldValue('custpage_cooperating_real_estate_agent_name','');
			
			nlapiSetFieldValue('custpage_cooperating_real_estate_agent_id1','');
			
			nlapiSetFieldValue('custpage_cooperating_real_estate_broker_name','');
			
			nlapiSetFieldValue('custpage_cooperating_real_estate_broker_id1','');
			
			nlapiSetFieldValue('custpage_pending_notification1','');
			
			nlapiSetFieldValue('custpage_cooperating_real_estate_agent_id2','');
			
			nlapiSetFieldValue('custpage_cooperating_real_estate_broker_id2','');
			
			nlapiSetFieldValue('custpage_pending_notification2','');
			
			nlapiSetFieldValue('custpage_purchase_contract','');
			
			nlapiSetFieldValue('custpage_sales_notes','');
			
			nlapiSetFieldValue('custpage_sales_notification_agent_name','');
			
			nlapiSetFieldValue('custpage_sales_notification_broker_name','');
			
		}
		
	}
	
	if(name=='custpage_cooperating_real_estate_agent_name')
	{
		var agentName = nlapiGetFieldValue('custpage_cooperating_real_estate_agent_name');
		if(agentName)
		{
			var agentid = nlapiLookupField('customrecord_agent',agentName,'custrecord_agent_id');
			nlapiSetFieldValue('custpage_cooperating_real_estate_agent_id1',agentid);
		}
	}
	if(name=='custpage_cooperating_real_estate_broker_name')
	{
		var brokername = nlapiGetFieldValue('custpage_cooperating_real_estate_broker_name');
		if(brokername)
		{
			var brokerid = nlapiLookupField('customrecordbrokerage',brokername,'custrecord7');
			nlapiSetFieldValue('custpage_cooperating_real_estate_broker_id1',brokerid);
		}
	}
}