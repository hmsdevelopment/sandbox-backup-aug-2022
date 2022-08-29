function beforeSubmit(type)
{
	if(type != 'delete')
	{
		var date = new Date();
		var minutes = date.getMinutes() + 1;
		date.setMinutse(minutes);
		var time = date.toLocaleTimeString();
		nlapiSetFieldValue('endtime', time);
		return true;
	}
}

function afterSubmit()
{
	nlapiLogExecution('DEBUG', 'Test ', 'Test ');

	var name = '';
	var appointmentId = nlapiGetFieldValue('custevent_appointment_id');
	if(appointmentId != null && appointmentId != '')
	{
		var callStatus = nlapiGetFieldValue('custevent_call_status');
		var callStatusText = nlapiGetFieldText('custevent_call_status');
		var contact = nlapiGetFieldValue('custevent9');
		if(contact != null && contact != '')
		{
			var contactRecord = nlapiLoadRecord('partner', contact);
			var first = contactRecord.getFieldValue('firstname');
			var last = contactRecord.getFieldValue('lastname');
			name = first + " " + last;
		}
		var contactText = nlapiGetFieldText('custevent9');
		var individualCalled = nlapiGetFieldValue('custevent_phone_call_caller');
		var record = nlapiLoadRecord('supportcase', appointmentId);

		if(individualCalled == '2')
		{
			var bsr = record.getFieldValue('custevent_builder_sales_rep_subd');
			if(bsr == null || bsr == '' || bsr != contact)
			{
				record.setFieldValue('custevent_builder_sales_rep_subd', contact);
				record.setFieldValue('custevent_bsr_for_ren', name);
			}
		}

		if(callStatus != null && callStatus != '')
		{
			record.setFieldValue('status', callStatus);
			record.setFieldValue('custevent_status_for_phone_call', callStatusText);
		}
		nlapiSubmitRecord(record);

		rapidEmailNotification();
	}
}

function rapidEmailNotification()
{
	var appointmentId = nlapiGetFieldValue('custevent_appointment_id');
	var record = nlapiLoadRecord('supportcase', appointmentId);
	var statusID = record.getFieldValue('status');
	var id = appointmentId;
	var smOptOut = record.getFieldValue('custevent_sm_opt_out');
	var dmOptOut = record.getFieldValue('custevent_dm_opt_out');
	var adminOptOut = record.getFieldValue('custevent_admin_opt_out');
	var bsrOptOut = record.getFieldValue('custevent_bsr_opt_out');
	var propertyId = record.getFieldValue('custevent_property');
	var propertyText = record.getFieldText('custevent_property');
	var index = propertyText.indexOf("|");
	var builder = propertyText.substring(index);
	var category = record.getFieldValue('category');
	var renSent = record.getFieldValue('custevent_ren_sent');
	var renEnabled = record.getFieldValue('custevent_ren_enabled');
	var subdivision = record.getFieldValue('custevent_subdivision_for_ren');
	var bsrEmail;
	var topLevelBuilder = record.getFieldValue('custevent_builder');

	if(renEnabled == 'T')
	{

		//*TEST ON SINGLE APPOINTMENT RECORD*if(renSent == 'F' && (statusID == '5' || statusID == '6') && (category == '1' || category == '2') && id == '695')
		if(renSent == 'F' && (statusID == '5' || statusID == '6' || statusID == '11'))
		{
			var agent = record.getFieldValue('custevent_caller_name');
			var bsrID = record.getFieldValue('custevent_builder_sales_rep_subd');
			if(bsrID != null && bsrID != '')
			{
				var bsrRecord = nlapiLoadRecord('partner', bsrID);
				bsrEmail = bsrRecord.getFieldValue('email');
			}

			if(propertyId == null || propertyId == '')
			{
				return;
			}
			var property = nlapiLoadRecord('customrecord_property_record', propertyId);
			var houseNumber = property.getFieldValue('custrecord_house_number');
			var street = property.getFieldText('custrecord31');
			var lot = property.getFieldValue('custrecord_lot_number');
			var subject = "New Inquiry For " + houseNumber + " " + street + ", Subdivision: " + subdivision + ", Lot: " + lot;
			var salesManagerEmail = record.getFieldValue('custevent_sales_mgr_email');
			var divManagerEmail = record.getFieldValue('custeventdivision_mgr_email');
			//var adminAsstEmail = record.getFieldValue('custevent_administrative_contact_email');

			if(topLevelBuilder != null && topLevelBuilder != '')
			{
				var topLevelBuilderRecord = nlapiLoadRecord('customer', topLevelBuilder);
				var copyOnREN = topLevelBuilderRecord.getFieldValues('custentity_copy_on_ren');
			}
			var division = record.getFieldValue('company');
			var builderDivision = nlapiLoadRecord('customer', division);
			var copyOnRENDivision = builderDivision.getFieldValues('custentity_copy_on_ren');

			var cc = new Array();
			var n = 0;

			if(copyOnREN != null && copyOnREN != '')
			{
				if(copyOnREN.length == 1)
				{
					var copyUser = nlapiLoadRecord('partner', copyOnREN[0]);
					var copyUserEmail = copyUser.getFieldValue('email');
					cc[n] = copyUserEmail;
					n++;
				}

				else
				{
					for(var i=0; copyOnREN.length > i; i++)
					{
						var copyUser = nlapiLoadRecord('partner', copyOnREN[i]);
						var copyUserEmail = copyUser.getFieldValue('email');
						cc[n] = copyUserEmail;
						n++;
					}
				}
			}

			if(copyOnRENDivision != null && copyOnRENDivision != '')
			{
				if(copyOnRENDivision[0].length == 1)
				{
					var copyUser = nlapiLoadRecord('partner', copyOnRENDivision);
					var copyUserEmail = copyUser.getFieldValue('email');
					cc[n] = copyUserEmail;
					n++;
				}

				else
				{
					for(var i=0; copyOnRENDivision.length > i; i++)
					{
						var copyUser = nlapiLoadRecord('partner', copyOnRENDivision[i]);
						var copyUserEmail = copyUser.getFieldValue('email');
						cc[n] = copyUserEmail;
						n++;
					}
				}
			}

			if(bsrEmail != '' && bsrEmail != null && bsrOptOut == 'F')
			{
				cc[n] = bsrEmail;
				n++;
			}

			if(divManagerEmail != '' && divManagerEmail != null && dmOptOut == 'F')
			{
				cc[n] = divManagerEmail;
				n++;
			}

			if(salesManagerEmail != '' && salesManagerEmail != null && smOptOut == 'F')
			{
				cc[n] = salesManagerEmail;
				n++;
			}

			/* admins no longer get these by default as of 2/11/14 [Jeff]
			if(adminAsstEmail != '' && adminAsstEmail != null && adminOptOut == 'F')
			{
				cc[n] = adminAsstEmail;
				n++;
			}
			*/
			
			/*This looks duplicated from above, so I'm commenting it out for now [Jeff 2/11/14]
			if(bsrEmail != '' && bsrEmail != null && bsrOptOut == 'F')
			{
				cc[n] = bsrEmail;
				n++;
			}
			*/

			//var records = new Object();
			//records['record'] = propertyId;
			//records['recordtype'] = '18';
			//records['activity'] = id;

			//var body = nlapiMergeRecord(1, 'supportcase', id);
			//nlapiSendEmail('3847', cc[0], subject, body.getValue(), cc, null, records);

			//nlapiSubmitField('supportcase', id, 'custevent_ren_sent', 'T');
		}
	}
}