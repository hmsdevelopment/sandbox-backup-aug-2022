function builderActions(request, response)
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	month++;
	var year = date.getFullYear();
	var dateFormatted = month + "/" + day + "/" + year;
	var partner;
	var lastSuccessfulLogin;

	var currentUser = request.getParameter('partnerid');
	var builderID = request.getParameter('builderid');
	if(currentUser != null && currentUser != '')
	{
		partner = nlapiLoadRecord('partner', currentUser);
		lastSuccessfulLogin = partner.getFieldValue('custentity_last_successful_login');
		var accessSubmitClosing = partner.getFieldValue('custentity_submit_closing');
		var accessSubmitSale = partner.getFieldValue('custentity_submit_sale');
		var accessCreateUser = partner.getFieldValue('custentity_create_user');
		var accessCreateListing = partner.getFieldValue('custentity_create_listing');
	}

	if(lastSuccessfulLogin != dateFormatted || partner == null || partner == '')
	{
		var form = nlapiCreateForm('Builder Actions');
		var group = form.addFieldGroup('fieldgroup', 'Session has ended.');
		var note = form.addField('formnote', 'label', 'Session has ended.  Please login again.', null, 'fieldgroup');
		var loginLink = form.addField('loginlink', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Login').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=71&deploy=1&compid=1309901&h=74a2f7b3ca4cca2fbf10');
		group.setSingleColumn(true);
		response.writePage(form);
	}

	else
	{
		var form = nlapiCreateForm('Builder Actions');
		var group = form.addFieldGroup('fieldgroup', 'Select an Action');
		var noAccess = 'T';

		if(accessCreateListing == 'T')
		{
			/*if(builderID==3642 || builderID==3643 || builderID==3693 || builderID==3697 || builderID==3990 || builderID==4192 || builderID==3699 || builderID==4908)
			{*/
				var newLinkText = 'Create or Edit a New Listing'
				var oldLinkText = 'Create or Edit a New Listing (Older, Original Version)'
				
				var createListingBeta = form.addField('createlistingbeta', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText(newLinkText).setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=264&deploy=1&compid=1309901&h=6454c9d5627dc2c42fb8&partnerid=' + currentUser + '&builderid=' + builderID);
				//noAccess = 'F';
		
			//	var createListing = form.addField('createlisting', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText(oldLinkText).setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=113&deploy=1&compid=1309901&h=f8be8fd8dbfe9433b360&partnerid=' + currentUser + '&builderid=' + builderID);
			//	noAccess = 'F';

			/*}
			else
			{
				var createListing = form.addField('createlisting', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Create or Edit a New Listing').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=113&deploy=1&compid=1309901&h=f8be8fd8dbfe9433b360&partnerid=' + currentUser + '&builderid=' + builderID);
				noAccess = 'F';
			}*/

		}
        if(accessSubmitSale == 'T')
		{
			var submitSales = form.addField('submitsales', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Submit a Sale').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=68&deploy=1&compid=1309901&h=2656021766731702ecd9&builderid=' + builderID + '&partnerid=' + currentUser);
			noAccess = 'F';
		}

		if(accessSubmitClosing == 'T')
		{
			var submitClosing = form.addField('submitclosing', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Submit a Closing').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=69&deploy=1&compid=1309901&h=476a7ef32cbb69b07c8a&builderid=' + builderID + '&partnerid=' + currentUser);
			noAccess = 'F';
		}

		if(accessCreateUser == 'T')
		{
			var createUser = form.addField('createuser', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Create a User').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=76&deploy=1&compid=1309901&h=b39e430690540defd5d9&partnerid=' + currentUser);
			noAccess = 'F';
		}

		
		
		if(noAccess == 'T')
		{
			var noAccessField = form.addField('noaccess', 'label', 'You do not have access to perform any actions.', null, 'fieldgroup');
		}
		
		var resetPassword = form.addField('resetpassword', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Reset Password').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=74&deploy=1&compid=1309901&h=6d914292cb4882ba977e&passedpartnerid=' + currentUser + '&loggedin=T');
		group.setSingleColumn(true);
		response.writePage(form);
	}
}