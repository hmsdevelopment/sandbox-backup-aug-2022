function afterSubmit(type)
{
	try
	{
	var today = new Date();
	var day = today.getDate();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var todayFormatted = month + "/" + day + "/" + year;

	var newConstructionStatus = nlapiGetFieldValue('custevent_switch_construction_status');
	if(newConstructionStatus != null && newConstructionStatus != '')
	{
		var property = nlapiGetFieldValue('custevent_property');

		var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
		var previousConstructionStatus = propertyRecord.getFieldValue('custrecord_current_construction');
		propertyRecord.setFieldValue('custrecord_current_construction', newConstructionStatus);
		propertyRecord.setFieldValue('custrecord_property_date_const_update', todayFormatted);
		nlapiSubmitRecord(propertyRecord);

		var propertyChangeRecord = nlapiCreateRecord('customrecord_property_changes');
		propertyChangeRecord.setFieldValue('custrecord_change_construction_status', previousConstructionStatus);
		propertyChangeRecord.setFieldValue('custrecord_new_construction_status', newConstructionStatus);
		propertyChangeRecord.setFieldValue('custrecord_changes_committed', 'T');
		propertyChangeRecord.setFieldValue('custrecord_date_modified', todayFormatted);
		propertyChangeRecord.setFieldValue('custrecord_property', property);
		nlapiSubmitRecord(propertyChangeRecord);
	}

	//Code added by Jeff to replicate the code above, only for Sales Status instead of Construction Status
	var newSalesStatus = nlapiGetFieldValue('custevent_switch_sales_status');
	if(newSalesStatus != null && newSalesStatus != '')
	{
		var property = nlapiGetFieldValue('custevent_property');

		var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
		var previousSalesStatus = propertyRecord.getFieldValue('custrecord_property_status');
		propertyRecord.setFieldValue('custrecord_property_status', newSalesStatus);
		propertyRecord.setFieldValue('custrecord_property_date_sales_st_update', todayFormatted);
		nlapiSubmitRecord(propertyRecord);

		var propertyChangeRecord = nlapiCreateRecord('customrecord_property_changes');
		propertyChangeRecord.setFieldValue('custrecord_new_property_status', previousSalesStatus);
		propertyChangeRecord.setFieldValue('custrecord_update_property_status', newSalesStatus);
		propertyChangeRecord.setFieldValue('custrecord_changes_committed', 'T');
		propertyChangeRecord.setFieldValue('custrecord_date_modified', todayFormatted);
		propertyChangeRecord.setFieldValue('custrecord_property', property);
		nlapiSubmitRecord(propertyChangeRecord);
	}
	
	var callerType = nlapiGetFieldValue('custevent_caller_type');
	var salutation = nlapiGetFieldValue('custevent_agent_salutation');
	var fName = nlapiGetFieldValue('custevent_agentfname');
	var lName = nlapiGetFieldValue('custevent_agentlname');
	var agentID = nlapiGetFieldValue('custevent_agent_id_no');
	var brokerage = nlapiGetFieldValue('custevent_brokerage_or_company');
	var brokerageText = nlapiGetFieldText('custevent_brokerage_or_company');
	var phone = nlapiGetFieldValue('custevent_caller_phone_number');
	var mobile = nlapiGetFieldValue('custevent_agent_mobile_number');
	var other = nlapiGetFieldValue('custevent_agent_other_number');
	var callback = nlapiGetFieldValue('custevent_agent_callback');
	var email = nlapiGetFieldValue('custevent_caller_email');
	var agent = nlapiGetFieldValue('custevent_caller_name');
	if(agent != '' && agent != null)
	{
		var agentRecord = nlapiLoadRecord('customrecord_agent', agent);
		var first = agentRecord.getFieldValue('custrecord_agent_first_name');
		var last = agentRecord.getFieldValue('custrecord_agent_last_name');
		var name = last + ", " + first + ' | ' + brokerageText;
		agentRecord.setFieldValue('custrecord_brokerage', brokerage);
		agentRecord.setFieldValue('name', name);
		agentRecord.setFieldValue('custrecord_agent_type', callerType);
		agentRecord.setFieldValue('custrecord_salutation', salutation);
		if(fName)
		{
			agentRecord.setFieldValue('custrecord_agent_first_name', fName);
		}
		if(lName)
		{
			agentRecord.setFieldValue('custrecord_agent_last_name', lName);
		}
		if(agentID)
		{
			agentRecord.setFieldValue('custrecord_agent_id', agentID);
		}
		agentRecord.setFieldValue('custrecord_agent_office_number', phone);
		agentRecord.setFieldValue('custrecord_agent_mobile_number', mobile);
		agentRecord.setFieldValue('custrecord_agent_other_number', other);
		agentRecord.setFieldValue('custrecord_agent_preferred_number', callback);
		agentRecord.setFieldValue('custrecord_agent_email', email);
		nlapiSubmitRecord(agentRecord);
	}

	if(type != 'delete')
	{
		var builderDivision = nlapiGetFieldValue('company');
		var builderRecord = nlapiLoadRecord('customer', builderDivision);
		var enableSurvey = builderRecord.getFieldValue('custentity_enable_surveys');
		var currentAppointmentID = nlapiGetFieldValue('id');
		var currentAppointment = nlapiLoadRecord('supportcase', currentAppointmentID);
		currentAppointment.setFieldValue('custevent_enable_surveys', enableSurvey);
		nlapiSubmitRecord(currentAppointment);
	}

	}
	catch(e)
	{
	}
}

function beforeSubmit()
{
	try
	{
	var bsr = nlapiGetFieldText('custevent_builder_sales_rep_subd');
	nlapiSetFieldValue('custevent_bsr_for_phone_call', bsr);
	
	var bsr = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
	var bsrRecord = nlapiLoadRecord('partner', bsr);
	var first = bsrRecord.getFieldValue('firstname');
	var last = bsrRecord.getFieldValue('lastname');
	var name = first + " " + last;
	nlapiSetFieldValue('custevent_bsr_for_ren', name);
	
	var isShowingAssist = nlapiGetFieldValue('custevent_showing_assist');
	  
    if (isShowingAssist == 'T')
	{
			
		  var showingAssistConfirmationText = nlapiGetFieldValue('custevent_sa_confirmation_text');
		  var shortPropertyName = nlapiGetFieldValue('custevent_property_for_ren');
		  var shortBSRName = nlapiGetFieldValue('custevent_bsr_for_ren');
		  builder = nlapiGetFieldValue('company');
		  builderText = nlapiGetFieldText('company');
		  if(builder)
		  {
			  var builderRecord = nlapiLoadRecord('customer', builder);
			  var builderParent = builderRecord.getFieldText('parent');
		  }
		  
		  if(builderParent)
		  {
			  builderText = builderParent;
		  }
		  
		  var bsrmobilePhone = nlapiGetFieldValue('custevent2');
		  property = nlapiGetFieldValue('custevent_property');
		
		  if (property == '4242')
		  {
			var fieldText = "Thank you for your interest in this property. It's on electronic lockbox so let yourself in and be sure to leave a card and turn out the lights when you leave. For future reference, " +
		    shortBSRName + "'s cell number is " + bsrmobilePhone +"." }
		  else
		  {
			var fieldText = "Thank you for your interest in this property. " + shortBSRName + " with " + builderText + " will contact you directly to finalize the details of your requested showing. For future reference, " +
		    shortBSRName + "'s cell number is " + bsrmobilePhone +"." 
		  }		
		  nlapiSetFieldValue('custevent_sa_confirmation_text', fieldText);
	}
	
	}
	catch(e)
	{
	}
}