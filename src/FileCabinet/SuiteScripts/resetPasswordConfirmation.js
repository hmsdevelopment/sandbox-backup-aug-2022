function resetPasswordConfirmation(request, response)
{
	if(request.getMethod() == 'GET')
	{
		var confirmation = request.getParameter('confirmation');
		var alreadyLoggedIn = request.getParameter('loggedin');
		var match = request.getParameter('nomatch');
		var partnerID = request.getParameter('passedpartnerid');
		var form = nlapiCreateForm('Reset Password');
		var group = form.addFieldGroup('fieldgroup', 'Reset Password');
		if(match == 'T')
		{
			var errorMsg = form.addField('errormsg', 'label', 'Passwords entered did not match.  Please input matching passwords.', null, 'fieldgroup');
		}
		var password = form.addField('newpassword', 'password', 'Enter New Password', null, 'fieldgroup');
		var confirmPassword = form.addField('newpasswordconfirmation', 'password', 'Confirm New Password', null, 'fieldgroup');
		var passwordRequirement = form.addField('passwordreq', 'label', 'Password must be at least 6 characters long.', null, 'fieldgroup');
		var caseSensitive = form.addField('casesensitive', 'label', 'Password are case sensitive.', null, 'fieldgroup');
		var confirmationField = form.addField('confirmationvalue', 'text');
		var idField = form.addField('partnerid', 'text');
		var loggedIn = form.addField('loggedin', 'text');
		loggedIn.setDisplayType('hidden');
		idField.setDisplayType('hidden');
		confirmationField.setDisplayType('hidden');
		form.setFieldValues({confirmationvalue:confirmation,partnerid:partnerID,loggedin:alreadyLoggedIn});
		group.setSingleColumn(true);
		form.addSubmitButton('Reset Password');
		response.writePage(form);
	}

	else
	{
		var newPassword = request.getParameter('newpassword');
		var newPasswordConfirmation = request.getParameter('newpasswordconfirmation');
		var confirmationValue = request.getParameter('confirmationvalue');
		var partnerID = request.getParameter('partnerid');
		var alreadyLoggedIn = request.getParameter('loggedin');

		if(newPassword != newPasswordConfirmation)
		{
			response.sendRedirect('EXTERNAL', 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=74&deploy=1&compid=1309901&h=6d914292cb4882ba977e&confirmation=' + confirmationValue + '&passedpartnerid=' + partnerID + '&nomatch=T');
		}

		else if(newPassword == null || newPassword.length < 6)
		{
			response.sendRedirect('EXTERNAL', 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=74&deploy=1&compid=1309901&h=6d914292cb4882ba977e&confirmation=' + confirmationValue + '&passedpartnerid=' + partnerID);
		}

		else
		{
			var partnerRecord = nlapiLoadRecord('partner', partnerID);
			var confirmationValueOnPartner = partnerRecord.getFieldValue('custentity_email_pw_chg_confirmation');
			if(confirmationValueOnPartner == confirmationValue || alreadyLoggedIn == 'T')
			{
				partnerRecord.setFieldValue('custentity_password', newPassword);
				newPassword = nlapiEncrypt(newPassword);
				partnerRecord.setFieldValue('custentity_password_hidden', newPassword);
				partnerRecord.setFieldValue('custentity_email_pw_chg_confirmation', '');
				nlapiSubmitRecord(partnerRecord);

				var form = nlapiCreateForm('Reset Password');
				var group = form.addFieldGroup('fieldgroup', 'Reset Password');
				var msg = form.addField('msg', 'label', 'Your password has been successfully reset.');
				var url = form.addField('login', 'url', '', null, 'fieldgroup').setDisplayType('inline').setLinkText('Login').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=71&deploy=1&compid=1309901&h=74a2f7b3ca4cca2fbf10');
				group.setSingleColumn(true);
				response.writePage(form);
			}

			else
			{
				var form = nlapiCreateForm('Reset Password');
				var group = form.addFieldGroup('fieldgroup', 'Reset Password');
				var errorMsg = form.addField('errormsg', 'label', 'This password reset request has already been used.', null, 'fieldgroup');
				var errorMsg2 = form.addField('errormsg2', 'label', 'Please click below to have a new password reset request sent to your email.', null, 'fieldgroup');
				var resetPasswordURL = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=73&deploy=1&compid=1309901&h=91d899f2c5d2071e35b0&userid=' + partnerID;
				var resetPassword = form.addField('resetpasswordfield', 'url', 'Send another password reset request', null, 'fieldgroup').setDisplayType('inline').setLinkText('Reset Password').setDefaultValue(resetPasswordURL);
				group.setSingleColumn(true);
				response.writePage(form);
			}
		}
	}
}