var username = (nlapiGetContext().getSetting('SCRIPT', 'custscript_user_name'));
var password = (nlapiGetContext().getSetting('SCRIPT', 'custscript_password'));
var onedaybefore = '';
var ondemoday = '';

	

function SendSMS(type)
{
	try
	{
		
		
		if(type == 'create')
		{
			
			
			{
				var id = nlapiGetRecordId();
				var type = nlapiGetRecordType();
				var bsrID = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
				var bsrRecord = nlapiLoadRecord('partner', bsrID);
				var phoneno = nlapiGetFieldValue('custevent2');
				var bsrEmail = bsrRecord.getFieldValue('email');
				var enableTextMessaging = bsrRecord.getFieldValue('custentity_enable_text_messaging');
				
				if (enableTextMessaging == 'T')
				{
					if(phoneno)
					{
						phoneno = replaceUnwantedChar(phoneno);
						nlapiLogExecution('DEBUG','real phoneno  ',' phoneno '+phoneno);
						//phoneno = '(513) 227-6718';	//jeff's mobile number
						//phoneno = replaceUnwantedChar(phoneno);
						//nlapiLogExecution('DEBUG','jeff\'s phoneno  ',' phoneno '+phoneno);
						//username = 'hmsmarketingservices';
						//password = 'beiqGlAYLG';
						var checkaccount = 'https://www.textmagic.com/app/api?username='+username+'&password='+password+'&cmd=account';
						var response = nlapiRequestURL(checkaccount);
						nlapiLogExecution('DEBUG','response  ',' response '+response);
						if(response)
						{
							var body = response.getBody();
							nlapiLogExecution('DEBUG','response  ',' body '+body);
							//var balance = body.balance;
							var bodyjson = JSON.parse(body);
							var balance = getFloatValue(bodyjson.balance);
							nlapiLogExecution('DEBUG','response  ',' bodyjson '+bodyjson);
							nlapiLogExecution('DEBUG','balance  ',' balance '+balance);
							if(balance > 1)
							{
								nlapiLogExecution('DEBUG','inside greater than 0  ',' balance '+balance);
								var post = new Array();
								post['username'] = username;
								post['password'] = password;
								post['cmd'] = 'send';
								post['text'] = 'From HMS: We\'ve sent an inquiry to ' + bsrEmail + '. If you\'d like phone confirmation call us at 855-467-2255';
								post['phone'] = '1'+phoneno;
								
								post['unicode'] = '0';
								post['max_length'] = '2';
								if(phoneno)
								{
									var emailresponse = nlapiRequestURL('https://www.textmagic.com/app/api',post);
									if(emailresponse)
									{
										var emailresponsebody = emailresponse.getBody();
										nlapiLogExecution('DEBUG','emailresponsebody ','emailresponsebody: '+emailresponsebody);
										var ebody = JSON.parse(emailresponsebody);
										var hasmessageid = ebody.message_id;
										nlapiLogExecution('DEBUG','hasmessageid  ',' hasmessageid '+hasmessageid);
										if(hasmessageid && hasmessageid != 'undefined')
										{
											//var ebody = JSON.parse(emailresponsebody);
											for (key in hasmessageid) {
												if (hasmessageid.hasOwnProperty(key)) 
												{
													nlapiLogExecution('DEBUG',' key '+key + " value " + hasmessageid[key]);
												}
											}  
											{
												var fieldids = [];
												var fieldvalues = [];
												fieldids.push('custrecord_first_sms_sent');
												fieldvalues.push('T');
												fieldids.push('custevent_hms_sms_message_id');
												fieldvalues.push(hasmessageid);
												nlapiSubmitField(type,id,fieldids,fieldvalues);
											}
										}
										else
										{
											//custrecord_sms_error
										}
									}
								}
								
							}
							else
							{
								
							}
						}
						else
						{
							nlapiLogExecution('DEBUG','No Response  ',' No Response ');
						}
						
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
		nlapiLogExecution( 'ERROR',   ' 999 Error', errmsg);
	}	
}

function replaceUnwantedChar(phoneno)
{
	//phoneno = phoneno.replace(//g,'');
	phoneno = ReplaceAll(''+phoneno, ' ', '');
	
	phoneno = phoneno.replace(/\(/g,'');
	phoneno = phoneno.replace(/\)/g,'');
	phoneno = ReplaceAll(''+phoneno, '+', '');
	phoneno = ReplaceAll(''+phoneno, '-', '');
//	phoneno = phoneno.replace(/\+/g,'');
	phoneno = ReplaceAll(''+phoneno, ',', '');
	//phoneno = phoneno.replace(/,/g,'');
	nlapiLogExecution('DEBUG','With out space ',' phoneno '+phoneno);
	phoneno = phoneno.substring((phoneno.length-10),phoneno.length);
	nlapiLogExecution('DEBUG','phone substr  ',' phone substr '+phoneno);
	return phoneno;
}

function emailId(recordid)
{	 
	try
	{
		var record = nlapiLoadRecord('customer',recordid);
		var phone = record.getFieldValue('custentity_mobile_phone_number');
		return phone;
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
		nlapiLogExecution( 'ERROR',   ' 999 Error not customer record', errmsg);
		try
		{
			var record = nlapiLoadRecord('contact',recordid);
			var phone = record.getFieldValue('custentity_mobile_phone_number');
			return phone;
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
			nlapiLogExecution( 'ERROR',   ' error in catch also 999 Error', errmsg);
			return null;
		}
	}
}


function ReplaceAll(Source, stringToFind, stringToReplace) {
    var temp = Source;
    var index = temp.indexOf(stringToFind);

    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }

    return temp;
}

String.prototype.ReplaceAll = function (stringToFind, stringToReplace) {
    var temp = this;
    var index = temp.indexOf(stringToFind);

    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }

    return temp;

};

function trim(str)
{
	return str.replace(/^\s+|\s+$/g,"");
}


function getFloatValue(id)
{
	var ret;
	ret = parseFloat(id);
	if(isNaN(ret))
	{
		ret = 0;
	}
	return ret;

}// getnumber