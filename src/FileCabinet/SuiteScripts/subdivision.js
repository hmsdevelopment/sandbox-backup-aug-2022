function fieldChange(fieldType, fieldName)
{
	if (fieldName == 'custrecord_builder_division')
	{
		var builderID = nlapiGetFieldValue('custrecord_builder_division');
		if(builderID)
		{
			var builder = nlapiLoadRecord('customer', builderID);
			var builderMLSRegions = builder.getFieldValues('custentity_mls_service_regions');
			
		/*
		THE NEXT IF/ELSE STATEMENT IS TO FIX A NETSUITE BUG WITH MULTI-SELECT FIELDS.
			IF THERE IS ONLY 1 VALUE IN THE MULTI-SELECT FIELD IT RETRIEVES FROM THE BUILDER RECORD,
			IT CHOKES IF I TRY TO USE 'NLAPISETFIELDVALUES', SO I HAVE TO USE 'NLAPISETFIELDVALUE'
		*/
			var index = builderMLSRegions.indexOf(',');
			if(index == '-1')
			{
				nlapiSetFieldValue('custrecord40', builderMLSRegions,false,true);
			}
			
			else
			{
				nlapiSetFieldValues('custrecord40', builderMLSRegions,false,true);
			}
			
			var builderName = builder.getFieldValue('companyname');
			var setBuilder = builderName;
			
			var parent = builder.getFieldValue('parent');
			for(var i=0; parent != null && parent != ''; i++)
			{
				var parentRecord = nlapiLoadRecord('customer', parent);
				var parentName = parentRecord.getFieldValue('companyname');
				setBuilder = parentName + ' : ' + setBuilder;
				
				parent = parentRecord.getFieldValue('parent');
			}
			nlapiSetFieldValue('name', trim(nlapiGetFieldValue('custrecord_subdivision_id')) + ' | ' + trim(setBuilder),false,true);
			
			//propertyUpdate(fieldName);// add this into after submit
		}
	}
	
	if (fieldName == 'custrecord_subdivision_id') //done
	{
		var builderID = nlapiGetFieldValue('custrecord_builder_division');
		if(builderID != '' && builderID != null)
		{
			var builder = nlapiLoadRecord('customer', builderID);

			var builderName = builder.getFieldValue('companyname');
			var setBuilder = builderName;

			var parent = builder.getFieldValue('parent');
			for(var i=0; parent != null && parent != ''; i++)
			{
				var parentRecord = nlapiLoadRecord('customer', parent);
				var parentName = parentRecord.getFieldValue('companyname');
				setBuilder = parentName + ' : ' + setBuilder;

				parent = parentRecord.getFieldValue('parent');
			}
			nlapiSetFieldValue('name', trim(nlapiGetFieldValue('custrecord_subdivision_id')) + ' | ' +
			trim(setBuilder),false,true)

			nlapiSetFieldValue('custrecord_preferred_subdivision_name', nlapiGetFieldValue('custrecord_subdivision_id'),false,true)
		}
	}
	
	if(fieldName == 'custrecord_bsr_team')//done
	{
		var bsrTeam = nlapiGetFieldValue('custrecord_bsr_team');
		if(bsrTeam != null && bsrTeam != '')
		{
			var bsrTeamRecord = nlapiLoadRecord('partner', bsrTeam);
			var teamMembers = bsrTeamRecord.getFieldValues('custentity_team_members');
			var teamType = bsrTeamRecord.getFieldValues('custentity_team_type');
			nlapiSetFieldValue('custrecord_sub_bsr_team_type', teamType,false,true);
			if(teamMembers != null)
			{
				nlapiSetFieldValues('custrecord48', teamMembers,false,true);
			}
			
			//**************************************************************************************************************************
			//ADDED BY JEFF 1/4/17 TO POPULATE THESE FIELDS CORRECTLY. ALSO REMOVED THE SOURCING ON THE CUSTOM FIELDS
			var builderID = nlapiGetFieldValue('custrecord_builder_division');
			var builderRecord = nlapiLoadRecord('customer', builderID);
			var divisionManager = builderRecord.getFieldValue('custentity_builder_division_manager');
			var salesManager = builderRecord.getFieldValue('custentity_hms_sales_manager');
			nlapiSetFieldValue('custrecord_division_manager', divisionManager);
			//nlapiSetFieldValue('custrecord27', salesManager);
			//**************************************************************************************************************************
		}
	}

}




function propertyUpdate(recType, recID,fieldChangeArr)
{
	//The following updates the property record when the subdivision is updated
	
	//var subdivisionId = nlapiGetFieldValue('id');
	var subdivisionId = nlapiGetRecordId(); //nlapiGetOldRecord().getFieldValue('id');
	if(subdivisionId)
	{
		
		var record = {
				"recType":recType,
				"recId":recID
		}
		
	
		nlapiScheduleScript("customscript_propertyrecord_subdivision", "customdeploy1", {"custscript_subdivisionId":subdivisionId ,"custscript_record":JSON.stringify(record) , "custscript_fieldname":JSON.stringify(fieldChangeArr) })
		
	}	
}

function init()
{
	nlapiDisableField('name', 'T');
}


function afterSubmitRecord(type)
{
	try
	{
		if(type == 'edit'|| type == 'xedit')
		{
			var fieldChangeArr = [];
			
			var oldrecord = nlapiGetOldRecord();
			var recType = nlapiGetRecordType();
			var recID = nlapiGetRecordId();
			var record = nlapiLoadRecord(recType, recID);
			//var modeladd = record.getFieldValue('custrecord_model_address');
			//var omodeladd = oldrecord.getFieldValue('custrecord_model_address');
			//if(omodeladd != modeladd)
			//{
				//propertyUpdate(record, 'custrecord_model_address');
			//}
			var mzip = record.getFieldValue('custrecord_mailing_address_zip');
			var omzip = oldrecord.getFieldValue('custrecord_mailing_address_zip');
			if(omzip != mzip)
			{
				fieldChangeArr.push("custrecord_mailing_address_zip")
			}
			
			var acity = record.getFieldValue('custrecord_mailing_address_city');
			var oacity = oldrecord.getFieldValue('custrecord_mailing_address_city');			
			if(acity != oacity)
			{
				fieldChangeArr.push( 'custrecord_mailing_address_city');
			}
			var astate = record.getFieldValue('custrecord_mailing_address_state');
			var oastate = oldrecord.getFieldValue('custrecord_mailing_address_state');			
			if(oastate != astate)
			{
				fieldChangeArr.push( 'custrecord_mailing_address_state');
			}
			var county = record.getFieldValue('custrecord_county');
			var ocounty = oldrecord.getFieldValue('custrecord_county');	
			if(ocounty != county)
			{
				fieldChangeArr.push( 'custrecord_county');
			}
			var mls1 = record.getFieldValue('custrecord_mls_region_1');
			var omls1 = oldrecord.getFieldValue('custrecord_mls_region_1');
			if(omls1 != mls1)
			{
				fieldChangeArr.push( 'custrecord_mls_region_1');
			}
			var mls2 = record.getFieldValue('custrecord_mls_region_2');
			var omls2 = oldrecord.getFieldValue('custrecord_mls_region_2');
			if(omls2 != mls2)
			{
				fieldChangeArr.push( 'custrecord_mls_region_2');
			}
			var acont = record.getFieldValue('custrecord_administrative_contact');
			var oacont = oldrecord.getFieldValue('custrecord_administrative_contact');
			if(oacont != acont)
			{
				fieldChangeArr.push( 'custrecord_administrative_contact');
			}
			var acemail = record.getFieldValue('custrecord_administrative_contact_email');
			var oacemail = oldrecord.getFieldValue('custrecord_administrative_contact_email');
			if(oacemail != acemail)
			{
				fieldChangeArr.push( 'custrecord_administrative_contact_email');
			}
			var acphone = record.getFieldValue('custrecord_administrative_contact_phone');
			var oacphone = oldrecord.getFieldValue('custrecord_administrative_contact_phone');
			if(oacphone != acphone)
			{
				fieldChangeArr.push( 'custrecord_administrative_contact_phone');
			}
			var dmanager = record.getFieldValue('custrecord_division_manager');
			var odmanager = oldrecord.getFieldValue('custrecord_division_manager');
			if(odmanager != dmanager)
			{
				fieldChangeArr.push( 'custrecord_division_manager');
			}
			var dmanager = record.getFieldValue('custrecord_division_mgr_email');
			var odmanager = oldrecord.getFieldValue('custrecord_division_mgr_email');
			if(dmanager != odmanager)
			{
				fieldChangeArr.push( 'custrecord_division_mgr_email');
			}
			var crec27 = record.getFieldValue('custrecord27');
			var ocrec27 = oldrecord.getFieldValue('custrecord27');
			if(ocrec27 != crec27)
			{
				fieldChangeArr.push( 'custrecord27');
			}
			var smnremail = record.getFieldValue('custrecord_sales_mgr_email');
			var osmnremail = oldrecord.getFieldValue('custrecord_sales_mgr_email');
			if(osmnremail != smnremail)
			{
				fieldChangeArr.push( 'custrecord_sales_mgr_email');
			}
			var dshowinst = record.getFieldValue('custrecord_division_showing_instructions');
			var odshowinst = oldrecord.getFieldValue('custrecord_division_showing_instructions');
			if(odshowinst != dshowinst)
			{
				fieldChangeArr.push( 'custrecord_division_showing_instructions');
			}
			var sdivinst = record.getFieldValue('custrecord_subdivision_instructions');
			var osdivinst = oldrecord.getFieldValue('custrecord_subdivision_instructions');
			if(osdivinst != sdivinst)
			{
				fieldChangeArr.push( 'custrecord_subdivision_instructions');
			}	
			var bsrteam = record.getFieldValue('custrecord_bsr_team');
			var obsrteam = oldrecord.getFieldValue('custrecord_bsr_team');
			if(obsrteam != bsrteam)
			{
				fieldChangeArr.push( 'custrecord_bsr_team');
			}
			var bsrtype = record.getFieldValue('custrecord_sub_bsr_team_type');
			var obsrtype = oldrecord.getFieldValue('custrecord_sub_bsr_team_type');
			if(obsrtype != bsrtype)
			{
				fieldChangeArr.push( 'custrecord_sub_bsr_team_type');
			}
			var cust48 = record.getFieldValue('custrecord48');
			var ocust48 = oldrecord.getFieldValue('custrecord48');
			if(ocust48 != cust48)		
			{
				fieldChangeArr.push( 'custrecord48');
			}
			
			var bdiv = record.getFieldValue('custrecord_builder_division');
			var obdiv = oldrecord.getFieldValue('custrecord_builder_division');
			if(obdiv != bdiv)		
			{
				fieldChangeArr.push( 'custrecord_builder_division');
			}
			
			nlapiLogExecution("DEBUG", "fieldChangeArr", fieldChangeArr)
			
		if(fieldChangeArr.length > 0){
			
			propertyUpdate(recType, recID,fieldChangeArr)
			
			}
			
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
		nlapiLogExecution( 'ERROR',  ' 999 Error', errmsg);
	}
}
