function beforeLoadTab(type, form)
{
var currentContext = nlapiGetContext();   
var currentUserID = currentContext.getUser();
var partnerID = nlapiGetRecordId();
 
if(type == 'edit' | type == 'view')
	{     
	var newUserTab = form.addTab('custpage_newuser_tab', 'Create User');
	
	//On Sample Tab, create a field of type inlinehtml.
	var createNewReqLink = form.addField('custpage_new_req_link','inlinehtml', null, null,
	'custpage_newuser_tab');
	
	//Define the parameters of the Suitelet that will be executed.
	 var linkURL = nlapiResolveURL('SUITELET', 'customscript_new_user_setup_request','customdeploy1', null)
	 + '&internal=T&currentpartner=' + partnerID;
 
	//Create a link to launch the Suitelet.
	createNewReqLink.setDefaultValue('<B>Click <A HREF="' + linkURL + '">here</A> to give this user access to builder actions.</B>');
	}
}