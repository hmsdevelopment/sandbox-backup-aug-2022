function resetPassword(request, response)
{

	
	var html = '<!DOCTYPE html>';
	html = html + '<html>';
	html = html + '<head>';
	var scripthtml = '';//nlapiGetContext().getSetting('SCRIPT', 'custscript_html');
	scripthtml += '<style>';
	scripthtml += '#customers';
	scripthtml += '{';
	scripthtml += '	font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;';
	scripthtml += '	width:30%;';
	scripthtml += '	border-collapse:collapse;';
	scripthtml += '}';
	scripthtml += '#customers td, #customers th ';
	scripthtml += '{';
	scripthtml += '	font-size:1em;';
	scripthtml += '	text-align:center;';
	scripthtml += '	border:1px solid #F2F7E5;';
	scripthtml += '	padding:3px 7px 2px 7px;';
	scripthtml += '}';
	scripthtml += '#customers th ';
	scripthtml += '{';
	scripthtml += '	font-size:1.1em;';
	scripthtml += '	text-align:center;';
	scripthtml += '	padding-top:5px;';
	scripthtml += '	padding-bottom:4px;';
	scripthtml += '	background-color:#CCCCCC;';
	scripthtml += '	color:#ffffff;';
	scripthtml += '}';
	scripthtml += '#customers tr.alt td ';
	scripthtml += '{';
	//scripthtml += '	color:#F2F2F2;';
	scripthtml += '	background-color:#F2F2F2;';
	scripthtml += '}';
	scripthtml += '#form';
	scripthtml += '{';
	scripthtml += '	text-align:center;';
	scripthtml += '}';
	scripthtml += '</style>';
	scripthtml += '</head>';
	scripthtml += '<body>';
	
	
	
	if(request.getMethod() == 'GET')
	{
		var partnerID = request.getParameter('userid');
		html = html + '<title>Reset Password</title>' + scripthtml;
		html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=73&deploy=1&compid=1309901&h=91d899f2c5d2071e35b0" method="post">';
		html += '<table align = "center" id="customers">';
		html += '<tr>';
		html += '<th colspan="2" ><span align="center">Please enter your email address</span></th>';
		html += '</tr>';
		html += '<tr>';
		html += '<td>Email </td>';
		html += '<td><input type="text" id="useremail" name="useremail"><input type="hidden" id="passeduserid" name="passeduserid" value="'+partnerID+'"></td>';
		html += '</tr>';
		
		
		html += '</table>';
		html += '<input type="submit" value="Reset Password">';
		html += '</form>';
		html += '</body>';
		html += '</html>';
		response.write(html);
		
		
	}

	else
	{
		var inputEmail = request.getParameter('useremail');
		var passedPartnerID = request.getParameter('passeduserid');
		var randomString = Math.random().toString(36).substr(2,16);
		var record = nlapiLoadRecord('partner', passedPartnerID);
		record.setFieldValue('custentity_email_pw_chg_confirmation', randomString);
		nlapiSubmitRecord(record);

		var records = new Object();
		records['partner'] = passedPartnerID;

		//var subject = "Reset Password Request";
		var emailMerger = nlapiCreateEmailMerger(16);
		emailMerger.setEntity('partner', passedPartnerID);
		var mergeResult = emailMerger.merge();

		var subject = mergeResult.getSubject();
		var body = mergeResult.getBody();
		//var body = nlapiMergeRecord(16, 'partner', passedPartnerID);
		nlapiSendEmail('3847', inputEmail, subject, body, null, null, records);
		
		html = html + '<title>Request has been submitted</title>' + scripthtml;
		html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=73&deploy=1&compid=1309901&h=91d899f2c5d2071e35b0" method="post">';
		html += '<table align = "center" id="customers">';
		
		html += '<tr>';
		html += '<td>An email has been sent to ' + inputEmail + ' with instructions on how to reset your password. </td>';
		
		html += '</tr>';
		
		
		html += '</table>';
		
		html += '</form>';
		html += '</body>';
		html += '</html>';
		response.write(html);
		
		/*
		var submitForm = nlapiCreateForm('Request has been submitted');
		var label = submitForm.addField('confirmation', 'label', 'An email has been sent to ' + inputEmail + ' with instructions on how to reset your password.');
		response.writePage(submitForm);
		*/
	}
}