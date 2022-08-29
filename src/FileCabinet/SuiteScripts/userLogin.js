	var html = '<!DOCTYPE html>';
	html += '<html>';
	html += '<head>';
	html += '<title>User Login</title>';
	html += '<style>';
	html += '#customers';
	html += '{';
	html += '	font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;';
	html += '	width:30%;';
	html += '	border-collapse:collapse;';
	html += '}';
	html += '#customers td, #customers th ';
	html += '{';
	html += '	font-size:1em;';
	html += '	text-align:center;';
	html += '	border:1px solid #F2F7E5;';
	html += '	padding:3px 7px 2px 7px;';
	html += '}';
	html += '#customers th ';
	html += '{';
	html += '	font-size:1.1em;';
	html += '	text-align:center;';
	html += '	padding-top:5px;';
	html += '	padding-bottom:4px;';
	html += '	background-color:#CCCCCC;';
	html += '	color:#ffffff;';
	html += '}';
	html += '#customers tr.alt td ';
	html += '{';
	//html += '	color:#F2F2F2;';
	html += '	background-color:#F2F2F2;';
	html += '}';
	html += '#form';
	html += '{';
	html += '	text-align:center;';
	html += '}';
	html += '</style>';
	html += '</head>';
	html += '<body>';



function userLogin(request, response)
{
	if(request.getMethod() == 'GET')
	{
		nlapiLogExecution('DEBUG','Redirect to new login page');
	response.sendRedirect('EXTERNAL', 'https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=404&deploy=1');
		html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=71&deploy=1&compid=1309901&h=74a2f7b3ca4cca2fbf10" method="post">';
		html += '<table align = "center" id="customers">';
		html += '<tr>';
		html += '<th colspan="2" ><span align="center">Login</span></th>';
		html += '</tr>';
		html += '<tr>';
		html += '<td>Email: </td>';
		html += '<td><input type="email" id="useremail" name="useremail"></td>';
		html += '</tr>';
		html += '<tr class="alt">';
		html += '<td>Password: </td>';
		html += '<td><input type="password" id="userpassword" name="userpassword"></td>';
		html += '</tr>';
		html += '<tr>';
		html += '<td colspan="2">Passwords are case sensitive. </td>';
		
		html += '</tr>';
		html += '</table>';
		html += '<input type="submit" value="Submit">';
		html += '</form>';
		html += '</body>';
		html += '</html>';
		response.write(html);
	}

	else
	{
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth();
		month++;
		var year = date.getFullYear();
		var dateFormatted = month + "/" + day + "/" + year;
		
		
		var inputEmail = request.getParameter('useremail');
		var inputPassword = request.getParameter('userpassword');
		nlapiLogExecution('DEBUG','inputEmail:','inputEmail :'+inputEmail+' inputPassword '+inputPassword);
        nlapiLogExecution('DEBUG','length',inputPassword.length);
		var encryptedPassword = nlapiEncrypt(inputPassword);

		var filters = new Array();
		filters[0] = new nlobjSearchFilter('email', null, 'is', inputEmail);

		var results = nlapiSearchRecord('partner', null, filters);
		if(results != null)
		{
			for(var i=0; results != null && results.length > i; i++)
			{
				var partnerID = results[i].getId();
				var partner = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
				var partnerPassword = partner.getFieldValue('custentity_password_hidden');
				var builderID = partner.getFieldValue('custentity1');
				if(partnerPassword == encryptedPassword)
				{
					partner.setFieldValue('custentity_last_successful_login', dateFormatted);
					nlapiSubmitRecord(partner, false, true);
					response.sendRedirect('EXTERNAL', 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=72&deploy=1&compid=1309901&h=95f2259d7dfe3875be53&builderid=' + builderID + '&partnerid=' + partnerID);
				}

				else
				{
				
					html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=71&deploy=1&compid=1309901&h=74a2f7b3ca4cca2fbf10" method="post">';
					html += '<table align = "center" id="customers">';
					html += '<tr>';
					html += '<th colspan="2" ><span align="center">Login Failed.</span></th>';
					html += '</tr>';
					html += '<tr>';
					html += '<td>Email: </td>';
					html += '<td><input type="email" id="useremail" name="useremail"></td>';
					html += '</tr>';
					html += '<tr class="alt">';
					html += '<td>Password: </td>';
					html += '<td><input type="password" id="userpassword" name="userpassword"></td>';
					html += '</tr>';
					html += '<tr>';
					html += '<td colspan="2">Password is incorrect.  Passwords are case sensitive. </td>';
					
					html += '</tr>';
					html += '<tr>';
					html += '<td colspan="2"><a href="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=73&deploy=1&compid=1309901&h=91d899f2c5d2071e35b0&userid=' + partnerID+'">Forget your password?</a> </td>';
					
					html += '</tr>';
					html += '</table>';
					html += '<input type="submit" value="Login">';
					html += '</form>';
					html += '</body>';
					html += '</html>';
					response.write(html);
					
				}
			}
		}

		else
		{
			html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=71&deploy=1&compid=1309901&h=74a2f7b3ca4cca2fbf10" method="post">';
			html += '<table align = "center" id="customers">';
			html += '<tr>';
			html += '<th colspan="2" ><span align="center">User does not exist.</span></th>';
			html += '</tr>';
			html += '<tr>';
			html += '<td>Email: </td>';
			html += '<td><input type="email" id="useremail" name="useremail"></td>';
			html += '</tr>';
			html += '<tr class="alt">';
			html += '<td>Password: </td>';
			html += '<td><input type="password" id="userpassword" name="userpassword"></td>';
			html += '</tr>';
			html += '<tr>';
			html += '<td colspan="2">User does not exist. </td>';
			
			html += '</tr>';
			html += '</table>';
			html += '<input type="submit" value="Login">';
			html += '</form>';
			html += '</body>';
			html += '</html>';
			response.write(html);
			
		}
	}
}