function sendCSV(type)
{
	try
	{
		var recid = nlapiGetRecordId();
		var rectype = nlapiGetRecordType();
		var newrecord = nlapiLoadRecord(rectype, recid)
		var oldrecord = nlapiGetOldRecord();
		var divisionID = newrecord.getFieldValue('company');
		var buildersuppId = newrecord.getFieldValue('custevent_builder_supplied_id');
		if(type == 'create')
		{
			var buillead = newrecord.getFieldValue('custevent_builder_lead');
			if(buillead == 'T')
			{
				var partnerid = newrecord.getFieldValue('custevent_builder_sales_rep_subd');
				if(partnerid)
				{
					var emailid = nlapiLookupField('partner',partnerid,'email');
					nlapiLogExecution('DEBUG', 'emailid ', 'emailid '+emailid);
					//if(emailid)
					{
						sendEmailWithCSV(recid, emailid, divisionID, buildersuppId)
					}
				}
			}
		}
		else if(type != 'delete')
		{
			var buillead = newrecord.getFieldValue('custevent_builder_lead');
			if(buillead == 'T')
			{
				var partnerid = newrecord.getFieldValue('custevent_builder_sales_rep_subd');
				var oldpartnerid = oldrecord.getFieldValue('custevent_builder_sales_rep_subd');
				if((partnerid) && (oldpartnerid) && (partnerid != oldpartnerid))
				{
					var emailid = nlapiLookupField('partner',partnerid,'email');
					nlapiLogExecution('DEBUG', 'emailid ', 'emailid '+emailid);
					//if(emailid)
					{
						sendEmailWithCSV(recid, emailid, divisionID, buildersuppId)
					}
				}
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
	    nlapiLogExecution( 'ERROR',  '  Error', errmsg);
	}
}

function sendEmailWithCSV(internalid, email, divisionID, buildersuppId)
{
	var sendToEmail = 'F';
	var csvEnabled = 'F';
	if(divisionID)
	{
		sendToEmail = nlapiLookupField('customer',divisionID,'custentity_builder_email_for_csv_files');
		csvEnabled = nlapiLookupField('customer',divisionID,'custentity_send_csv_to_builder_with_case');
	}
	alert(csvEnabled + ' ' + sendToEmail);
	var csvcontent = 'Builder Supplied ID, Email Address \n';
	csvcontent = csvcontent + buildersuppId+ ','+email;
	var subject = 'CSVExport'+internalid;
	//var subject = 'CSVExport '+buildersuppId;
	var newAttachment = nlapiCreateFile(subject+'.csv', 'CSV', csvcontent);
	nlapiLogExecution('DEBUG', 'csvcontent ', 'csvcontent '+csvcontent);
	var records = [];
	records['activity'] = internalid;
	if((sendToEmail) && (csvEnabled == 'T'))
	{
		var newEmail = nlapiSendEmail(3, sendToEmail, subject, 'Please see the attached file', null, null, records, newAttachment); 
	}
	nlapiLogExecution('DEBUG', 'csvcontent ', 'csvcontent '+csvcontent);
	
}