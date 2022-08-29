function newUserSetup(request, response)
{
	if(request.getMethod() == 'GET')
	{
		var confirmation = request.getParameter('confirmation');
		var match = request.getParameter('nomatch');
		var partnerID = request.getParameter('passedpartnerid');
		var form = nlapiCreateForm('Create User');
		var group = form.addFieldGroup('fieldgroup', 'Create User');
		if(match == 'T')
		{
			var errorMsg = form.addField('errormsg', 'label', 'Passwords entered did not match.  Please input matching passwords.', null, 'fieldgroup');
		}
		var password = form.addField('newpassword', 'password', 'Enter New Password', null, 'fieldgroup');
		var confirmPassword = form.addField('newpasswordconfirmation', 'password', 'Confirm New Password', null, 'fieldgroup');
		var passwordRequirement = form.addField('passwordreq', 'label', 'Password must be at least 6 characters long.', null, 'fieldgroup');
		var confirmationField = form.addField('confirmationvalue', 'text');
		var idField = form.addField('partnerid', 'text');
		idField.setDisplayType('hidden');
		confirmationField.setDisplayType('hidden');
		form.setFieldValues({confirmationvalue:confirmation,partnerid:partnerID});
		group.setSingleColumn(true);
		form.addSubmitButton('Create User');
		response.writePage(form);
	}

	else
	{
		var newPassword = request.getParameter('newpassword');
		var newPasswordConfirmation = request.getParameter('newpasswordconfirmation');
		var confirmationValue = request.getParameter('confirmationvalue');
		var partnerID = request.getParameter('partnerid');

		if(newPassword != newPasswordConfirmation)
		{
			response.sendRedirect('EXTERNAL', 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=75&deploy=1&compid=1309901&h=8466ec5212bc973b6b0f&confirmation=' + confirmationValue + '&passedpartnerid=' + partnerID + '&nomatch=T');
		}

		else if(newPassword == null || newPassword.length < 6)
		{
			response.sendRedirect('EXTERNAL', 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=75&deploy=1&compid=1309901&h=8466ec5212bc973b6b0f&confirmation=' + confirmationValue + '&passedpartnerid=' + partnerID);
		}

		else
		{
			var partnerRecord = nlapiLoadRecord('partner', partnerID);
			var confirmationValueOnPartner = partnerRecord.getFieldValue('custentity_email_pw_chg_confirmation');
			if(confirmationValueOnPartner == confirmationValue)
			{
				partnerRecord.setFieldValue('custentity_password', newPassword);
				newPassword = nlapiEncrypt(newPassword);
				partnerRecord.setFieldValue('custentity_password_hidden', newPassword);
				partnerRecord.setFieldValue('custentity_email_pw_chg_confirmation', '');
				nlapiSubmitRecord(partnerRecord);

				var form = nlapiCreateForm('Create User');
				var group = form.addFieldGroup('fieldgroup', 'Create User');
				var msg = form.addField('msg', 'label', 'Your user has been successfully created.');
				var url = form.addField('login', 'url', '', null, 'fieldgroup').setDisplayType('inline').setLinkText('Login').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=404&deploy=1&compid=1309901&h=9f11e286a669bcccd58b');
              //var url = form.addField('login', 'url', '', null, 'fieldgroup').setDisplayType('inline').setLinkText('Login').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=71&deploy=1&compid=1309901&h=74a2f7b3ca4cca2fbf10');
				group.setSingleColumn(true);
				response.writePage(form);
			}

			else
			{
				var form = nlapiCreateForm('Create User');
				var group = form.addFieldGroup('fieldgroup', 'Create User');
				var errorMsg = form.addField('errormsg', 'label', 'Your new user request is invalid.  Please contact your user administrator to have another user request sent.', null, 'fieldgroup');
				group.setSingleColumn(true);
				response.writePage(form);
			}
		}
	}
}