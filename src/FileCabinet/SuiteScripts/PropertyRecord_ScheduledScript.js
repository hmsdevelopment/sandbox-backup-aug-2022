/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Mar 2019     Vikash Singh
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type) {
  
  nlapiLogExecution("DEBUG","Script Status","Start");
	
		var context = nlapiGetContext();
	var subdivisionId = context.getSetting("SCRIPT", "custscript_subdivisionid");
	
	var record = context.getSetting("SCRIPT", "custscript_record");
	record = JSON.parse(record)
		
	var fieldNameArr = context.getSetting("SCRIPT", "custscript_fieldname");
	fieldNameArr = JSON.parse(fieldNameArr)
	
	nlapiLogExecution("DEBUG","subdivisionId",subdivisionId);
	nlapiLogExecution("DEBUG","fieldName",fieldNameArr);
	
	record = nlapiLoadRecord(record.recType,record.recId);
	
	
	var filters = [];
	filters[0] = new nlobjSearchFilter('custrecordcustrecordsubdname', null, 'is', subdivisionId);
	var results = nlapiSearchRecord('customrecord_property_record', null, filters);
	{ 
       nlapiLogExecution("DEBUG","results length",results.length);
		for(var i=0; results != null && results.length > i; i++)
		{ 
			checkGovernance();
			var propertyId = results[i].getId();
           nlapiLogExecution("DEBUG","propertyId",propertyId);
			var property = nlapiLoadRecord('customrecord_property_record', propertyId);
			
			
			for(var j = 0 ; j< fieldNameArr.length ; j++ ){
				
				var fieldName = fieldNameArr[j];
				
				
			if(fieldName == 'custrecord_builder_division')
			{
				var division = record.getFieldValue('custrecord_builder_division');
				var currentDivision = property.getFieldValue('custrecord12');
				if (currentDivision != division)
				{
					property.setFieldValue('custrecord12', division); //custrecord12 being the Division field in the Property record
				}
			}
			if(fieldName == 'custrecord_bsr_team')
			{
				var bsrTeam = record.getFieldValue('custrecord_bsr_team');
				var currentBSRTeam = property.getFieldValue('custrecord_property_bsr_team');
				if(currentBSRTeam != bsrTeam)
				{
					property.setFieldValue('custrecord_property_bsr_team', bsrTeam);
				}
			}
			/*if(fieldName == 'custrecord_model_address')
			{
				var state = record.getFieldValue('custrecord_model_address');
				property.setFieldValue('custrecord_state', state);
			}*/
			if(fieldName == 'custrecord_mailing_address_zip')
			{
				var zip = record.getFieldValue('custrecord_mailing_address_zip');
				property.setFieldValue('custrecord_zip_code', zip);
			}
			if(fieldName == 'custrecord_mailing_address_city')
			{
				var city = record.getFieldValue('custrecord_mailing_address_city');
				property.setFieldValue('custrecord_city', city);
			}
			if(fieldName == 'custrecord_mailing_address_state')
			{
				var state = record.getFieldValue('custrecord_mailing_address_state');
				property.setFieldValue('custrecord_state', state);
			}
			if(fieldName == 'custrecord_county')
			{
				var county = record.getFieldValue('custrecord_county');
				property.setFieldValue('custrecord10', county);
			}
			
			if(fieldName == 'custrecord_mls_region_1')
			{
				var mlsRegion = record.getFieldValue('custrecord_mls_region_1');
				property.setFieldValue('custrecord15', mlsRegion);
			}
			if(fieldName == 'custrecord_mls_region_2')
			{
				var mlsRegion2 = record.getFieldValue('custrecord_mls_region_2');
				property.setFieldValue('custrecord16', mlsRegion2);
			}
			if(fieldName == 'custrecord_administrative_contact')
			{
				var admin = record.getFieldValue('custrecord_administrative_contact');
				property.setFieldValue('custrecord17', admin);
			}
			if(fieldName == 'custrecord_administrative_contact_email')
			{
				var adminEmail = record.getFieldValue('custrecord_administrative_contact_email');
				property.setFieldValue('custrecord18', adminEmail);
			}
			if(fieldName == 'custrecord_administrative_contact_phone')
			{
				var adminPhone = record.getFieldValue('custrecord_administrative_contact_phone');
				property.setFieldValue('custrecord19', adminPhone);
			}
			if(fieldName == 'custrecord_division_manager')
			{
				var divisionManager = record.getFieldValue('custrecord_division_manager');
				property.setFieldValue('custrecord29', divisionManager);
			}
			if(fieldName == 'custrecord_division_mgr_email')
			{
				var divisionManagerEmail = record.getFieldValue('custrecord_division_mgr_email');
				property.setFieldValue('custrecordprop_division_mgr_email', divisionManagerEmail);
			}
			if(fieldName == 'custrecord27')
			{
				var salesManager = record.getFieldValue('custrecord27');
				property.setFieldValue('custrecord28', salesManager);
			}
			if(fieldName == 'custrecord_sales_mgr_email')
			{
				var salesManagerEmail = record.getFieldValue('custrecord_sales_mgr_email');
				property.setFieldValue('custrecord_prop_sales_mgr_email', salesManagerEmail);
			}
			if(fieldName == 'custrecord_division_showing_instructions')
			{
				var divShowingInstructions = record.getFieldValue('custrecord_division_showing_instructions');
				property.setFieldValue('custrecord41', divShowingInstructions);
			}
			if(fieldName == 'custrecord_subdivision_instructions')
			{
				var subShowingInstructions = record.getFieldValue('custrecord_subdivision_instructions');
				property.setFieldValue('custrecord39', subShowingInstructions);
			}
			if(fieldName == 'custrecord_sub_bsr_team_type')
			{
				var teamType = record.getFieldValue('custrecord_sub_bsr_team_type');
				property.setFieldValue('custrecord_property_bsr_team_type', teamType);
			}
			if(fieldName == 'custrecord48')
			{
				var members = record.getFieldValues('custrecord48');
				property.setFieldValues('custrecord_property_bsr_team_members', members);
				//---------- start of 48
				var bsr = nlapiGetFieldValue('custrecord_bsr_team');
				if(bsr)
				{
					var bsrRecord = nlapiLoadRecord('partner', bsr);
					bsrRecord.setFieldValues('custentity_team_members', members);
					var bsrid = nlapiSubmitRecord(bsrRecord, true, true);
					nlapiLogExecution('DEBUG', 'Partner record gets updated bsrid ', 'bsrid : '+bsrid);
				}
				
				//--------------- end of 48
			}
			
			
			
			}
			
			
			var proid = nlapiSubmitRecord(property, true, true);
			nlapiLogExecution('DEBUG', 'proid ', 'proid : '+proid);
		}
		
		
	}	

}

function checkGovernance(){
	
	try{
		var context = nlapiGetContext();
		
		if(context.getRemainingUsage() < 100){
			
			nlapiLogExecution('Debug','Remaining usage : ', context.getRemainingUsage());
			
			var script = nlapiYieldScript();
			if(script.status == "FAILURE"){
				nlapiLogExecution('Debug','script STOPPED because of : ', script.reason + '/SIZE : '+script.size);
			}
			
			if(script.status == "RESUME"){
				nlapiLogExecution('Debug','script resuming because of : ', script.reason + '/SIZE : '+script.size);
			}
		}
	}
	catch(err){
		nlapiLogExecution('Debug','checkGovernance failure', err);
	}
	
}
