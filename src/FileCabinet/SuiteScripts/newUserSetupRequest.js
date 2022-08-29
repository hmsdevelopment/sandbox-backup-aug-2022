function newUserSetupRequest(request, response)
{
	if(request.getMethod() == 'GET')
	{
		var form = nlapiCreateForm('Create User');
		var accessCheck;
		var userCheck;
		//var debug1 = form.addField('debug1', 'text', 'debug1');
		var group = form.addFieldGroup('fieldgroup', 'Create User');
		var partnerID = request.getParameter('partnerid');
		var internalRequest = request.getParameter('internal');
		var currentPartner = request.getParameter('currentpartner');
		if((partnerID != null && partnerID != '') || internalRequest == 'T')
		{
			if(partnerID != null && partnerID != '')
			{
				var partnerRecord = nlapiLoadRecord('partner', partnerID);
				accessCheck = partnerRecord.getFieldValue('custentity_create_user');
				var builderDivision = partnerRecord.getFieldValue('custentity1');
			}

			if(internalRequest != 'T')
			{
				var userList = form.addField('userlist', 'select', 'Select User', null, 'fieldgroup');
				var n = 0;
				
				var filters = new Array();
				filters[n] = new nlobjSearchFilter('custentity1', null, 'is', builderDivision);
				n++;
				filters[n] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				var results = nlapiSearchRecord('partner', null, filters);
				if(results == null)
				{
					userList.addSelectOption('-1', 'No Users Found for this Builder Division');
				}

				else
				{
					for(var i=0; results != null && results.length > i; i++)
					{
						var partnerRecordList = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
						var partnerPassword = partnerRecordList.getFieldValue('custentity_password');
						if(partnerPassword == null || partnerPassword == '')
						{
							var partnerName = partnerRecordList.getFieldValue('entityid');
							userList.addSelectOption(results[i].getId(), partnerName);
							userCheck = 'T';
						}
					}
				}
			}
			
			else
			{
				var userList = form.addField('userlist', 'select', 'Select User', 'partner', 'fieldgroup').setDefaultValue(currentPartner);
				accessCheck = 'T';
				userCheck = 'T';
			}
			
			if(userCheck != 'T')
			{
				userList.addSelectOption('-1', 'All users in this builder division have been set up.');
			}

		}

		if(accessCheck == 'T')
		{
			var selectRoles = form.addField('selectroles', 'label', 'Below choose the permissions this user will have', null, 'fieldgroup');
			var createUser = form.addField('createuser', 'checkbox', 'Create Users', null, 'fieldgroup');
			var submitClosing = form.addField('submitclosing', 'checkbox', 'Submit a Closing', null, 'fieldgroup');
			var submitSale = form.addField('submitsale', 'checkbox', 'Submit a Sale', null, 'fieldgroup');
			var createListing = form.addField('createlisting', 'checkbox', 'Create a Listing', null, 'fieldgroup');
			group.setSingleColumn(true);
			form.addSubmitButton('Submit');
			response.writePage(form);
		}

		else
		{
			var noAccess = form.addField('noaccess', 'label', 'You do not have access to create users', null, 'fieldgroup');
			response.writePage(form);
		}
	}

	else
	{
		var submitForm = nlapiCreateForm('Create User');
		var user = request.getParameter('userlist');
		var createUser = request.getParameter('createuser');
		var submitClosing = request.getParameter('submitclosing');
		var submitSale = request.getParameter('submitsale');
		var createListing = request.getParameter('createlisting');
		var randomString = Math.random().toString(36).substr(2,16);

		var record = nlapiLoadRecord('partner', user);
		var email = record.getFieldValue('email');
		record.setFieldValue('custentity_email_pw_chg_confirmation', randomString);
		record.setFieldValue('custentity_create_user', createUser);
		record.setFieldValue('custentity_submit_sale', submitSale);
		record.setFieldValue('custentity_submit_closing', submitClosing);
		record.setFieldValue('custentity_create_listing', createListing);
		nlapiSubmitRecord(record);

		var records = new Object();
		records['partner'] = user;

		var subject = "Get Started with the HMS Real Estate Builder Portal Here!";

		var emailMerger = nlapiCreateEmailMerger('17');
		emailMerger.setEntity('partner', user);
		var mergeResult = emailMerger.merge();
		var emailBody = mergeResult.getBody();
		//var body = nlapiMergeRecord('17', 'partner', user); //The original, unconverted template is 17
		
		//nlapiSendEmail('3847', email, subject, body.getValue(), null, null, records);
		nlapiSendEmail('3847', email, subject, emailBody, null, null, records);

		var submitForm = nlapiCreateForm('User has been set up with the requested access.');
		var label = submitForm.addField('confirmation', 'label', 'An email has been sent to ' + email + ' with instructions on how to set a password and log in.');
		response.writePage(submitForm);
	}
}





















