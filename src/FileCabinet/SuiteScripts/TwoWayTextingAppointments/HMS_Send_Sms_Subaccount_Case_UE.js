var acctype = (nlapiGetContext().getSetting('SCRIPT', 'custscript_sub_account_type')) || '';

var username1 = (nlapiGetContext().getSetting('SCRIPT', 'custscript_sub_account_1'));
var password1 = (nlapiGetContext().getSetting('SCRIPT', 'custscript_sub_password_1'));

var username2 = (nlapiGetContext().getSetting('SCRIPT', 'custscript_sub_account_2'));
var password2 = (nlapiGetContext().getSetting('SCRIPT', 'custscript_sub_password_2'));

var username3 = (nlapiGetContext().getSetting('SCRIPT', 'custscript_sub_account_3'));
var password3 = (nlapiGetContext().getSetting('SCRIPT', 'custscript_sub_password_3'));


var onedaybefore = '';
var ondemoday = '';
var username = '';
var password = '';
var noofreply = 0;
function SendSMS(type)
{
	try
	{
		var id = nlapiGetRecordId();
		nlapiLogExecution('DEBUG','id ',' record id '+id);


		var newLinkedCase = nlapiGetFieldValue('custevent_mw_new_linked_case');
		var textMessageId = nlapiGetFieldValue('custevent_hms_sms_message_id');
		var linkedCases = nlapiGetFieldValue('custevent_linked_cases');
		var userId = nlapiGetUser();

		if(type == 'create' || type == 'copy'|| (!textMessageId && linkedCases  && newLinkedCase == 'T') || userId == '4834')
		{	


			try {
				if(!textMessageId && linkedCases  && newLinkedCase == 'T'){
					nlapiSubmitField(nlapiGetRecordType(),nlapiGetRecordId(),["custevent_mw_new_linked_case"],["F"]);
				}
			} catch (error) {
				nlapiLogExecution('ERROR','newLinkedCase',error.toString());
			}


			getFreeLogin();
			//nlapiLogExecution('DEBUG','noofreply ',' noofreply '+noofreply);
			if(noofreply == 3)
			{
				nlapiSendEmail(4018, 'jmcdonald@hmsmarketingservices.com', 'Reply from Sales Rep is needed', 'Hi Jeff!<br>reply from sales rep is needed.<br>only 3 more account is open.<br> Thanks ', null, null, null, null);
			}
			nlapiLogExecution('DEBUG','username ',' username '+username+' password '+password);
			{
				var id = nlapiGetRecordId();
				var rectype = nlapiGetRecordType();
				var testsubaccount = nlapiGetFieldValue('custevent_test_sub_account_sms');
				var casecategory = nlapiGetFieldValue('category');
				nlapiLogExecution('DEBUG','testsubaccount ',' testsubaccount '+testsubaccount);
				//if(testsubaccount == 'T')
				{
					var bsrID = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
					var phoneno = nlapiGetFieldValue('custevent2');
					//phoneno = '(513) 227-6718';
					var bsrRecord = nlapiLoadRecord('partner', bsrID);
					var teamType = bsrRecord.getFieldValue('custentity_team_type');
					var members = '';

					if (teamType == '6') {
						members = bsrRecord.getFieldValue('custentity_team_members').split("\u0005")
						nlapiLogExecution('DEBUG','members ',' members '+members);
					}

					for (var i = 0; teamType == '6' ? i < members.length : i < 1 ; i++ ){

						var teamMemberRecord = teamType == '6' ?  nlapiLoadRecord('partner', members[i]) : ''; 
						var bsrEmail = teamType == '6' ? teamMemberRecord.getFieldValue('email'): bsrRecord.getFieldValue('email');
						var enableTextMessaging = teamType == '6' ? teamMemberRecord.getFieldValue('custentity_enable_text_messaging'): bsrRecord.getFieldValue('custentity_enable_text_messaging');
						var enable2waymessaging = teamType == '6' ? teamMemberRecord.getFieldValue('custentity_enable_two_way_sms'): bsrRecord.getFieldValue('custentity_enable_two_way_sms');
						var bsrFullPortalAccess = teamType == '6' ? teamMemberRecord.getFieldValue('custentity_temp_field_portal_tester'): bsrRecord.getFieldValue('custentity_temp_field_portal_tester');
						phoneno = teamType == '6' ?  teamMemberRecord.getFieldValue('mobilephone'): nlapiGetFieldValue('custevent2');

						nlapiLogExecution('AUDIT','enable2waymessaging '+enable2waymessaging+' for  internalid '+id,' enableTextMessaging '+enableTextMessaging+' phoneno '+phoneno);
						if ((enableTextMessaging == 'T') || (enable2waymessaging == 'T'))
						{
							
							var baseURL = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1460&deploy=1&compid=1309901&h=cb9a3b70238e09931f00&recordType=supportcase&id='

							var fullURL = baseURL + id + '&pid=' + bsrID;
							nlapiLogExecution('DEBUG', 'Bitly FullURL', fullURL);
							var body = '{"long_url":"' + fullURL + '", "domain":"showings.info"}';
							var url = 'https://api-ssl.bitly.com/v4/shorten';
							var headers = {
								'Accept': 'text/html, application/xhtml+xml, image/jxr, */*, application/json',
								'Authorization': 'Bearer 694f55ab070acbc484f1c4ce4f662873d5bb8e64',
								'Content-Type': 'application/json'
							};
							//headers = JSON.stringify(headers);
							//body = JSON.stringify(body);
						
							nlapiLogExecution('DEBUG', 'Bitly Headers', JSON.stringify(headers));
							nlapiLogExecution('DEBUG', 'Bitly URL', url);
							nlapiLogExecution('DEBUG', 'Bitly Body', JSON.stringify(body));
						
							response = nlapiRequestURL(url, body, headers, 'POST')
							
							var resBody = JSON.parse(response.getBody());
							var shortURL = resBody.link;
							var resCode = response.getCode();
							
							nlapiLogExecution('DEBUG', 'Bitly Response Body', JSON.stringify(resBody));
							nlapiLogExecution('DEBUG', 'Bitly Response Code', resCode);
							
							
							//nlapiSetFieldValue('custevent_special_messages', resBody.id);
							//nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), ["custevent_short_url"], [resBody.id]);
							if (resCode == '200' || resCode == '201')
							{
								nlapiSubmitField(rectype, id, "custevent_short_url", shortURL);
							}
							else
							{
								nlapiLogExecution('ERROR', 'Bitly Response Code', resCode);
								var body = 'URL Shortening Failed for case record.' + id + String.fromCharCode(13) + 'Response Body: ' + JSON.stringify(resBody) + String.fromCharCode(13) + 'Error code: ' + resCode;
								nlapiSendEmail('3847', 'jmcdonald@hmsmarketingservices.com', 'URL Shorten Failed', body);
							}

							nlapiLogExecution('DEBUG', 'Bitly Response ID', resBody.id);

							if(phoneno)
							{
								phoneno = replaceUnwantedChar(phoneno);
								nlapiLogExecution('DEBUG','real phoneno  ',' phoneno '+phoneno);
								// phoneno = '(513) 227-6718';	//jeff's mobile number
								// phoneno = '(506) 8638-6239';	//jeff's mobile number
								// phoneno = replaceUnwantedChar(phoneno);
								// nlapiLogExecution('DEBUG','real phoneno  ',' phoneno '+phoneno);

								
								var checkaccount = 'https://www.textmagic.com/app/api?username='+username+'&password='+password+'&cmd=account';
								var response = nlapiRequestURL(checkaccount);
								nlapiLogExecution('DEBUG','response  ',' response '+response);
								if(response)
								{
									var body = response.getBody();
									//nlapiLogExecution('DEBUG','response  ',' body '+body);
									//var balance = body.balance;
									var bodyjson = JSON.parse(body);
									var balance = getFloatValue(bodyjson.balance);
									//nlapiLogExecution('DEBUG','response  ',' bodyjson '+bodyjson);
									//nlapiLogExecution('DEBUG','balance  ',' balance '+balance);
									if(balance > 1)
									{
										nlapiLogExecution('DEBUG','inside greater than 0  ',' balance '+balance);
										var post = new Array();
										post['username'] = username;
										post['password'] = password;
										post['cmd'] = 'send';
										if((enableTextMessaging == 'T') && (enable2waymessaging != 'T'))
										{
										post['text'] = 'From HMS: We\'ve sent an inquiry to ' + bsrEmail + '. If you\'d like phone confirmation call us at 855-467-2255';
										}
										else if(enable2waymessaging == 'T')
										{
											if(casecategory == 1)
											{
												var houseno = '';
												var streetname = '';
												var afirstname = '';
												var alastname = '';
												var abrokerage = '';
												var searchType = nlapiGetFieldValue('custevent_subdivision_search');
												var subdivision = nlapiGetFieldText('custevent_subdivision');
												if (subdivision)
												{
													subdivision = subdivision.substr(0, 7);
												}
												var propid = nlapiGetFieldValue('custevent_property');
												var agentname = nlapiGetFieldValue('custevent_caller_name');
												if(propid)
												{
													var propertyrecord = nlapiLoadRecord('customrecord_property_record',propid);
													houseno = propertyrecord.getFieldValue('custrecord_house_number');
													streetname = propertyrecord.getFieldText('custrecord31');
												
												}
												
												if(agentname)
												{
													var agentrecord = nlapiLoadRecord('customrecord_agent',agentname);
													afirstname = agentrecord.getFieldValue('custrecord_agent_first_name');
													alastname = agentrecord.getFieldValue('custrecord_agent_last_name');
													abrokerage = agentrecord.getFieldText('custrecord_brokerage');
													acell = agentrecord.getFieldValue('custrecord_agent_mobile_number')
													if(abrokerage)
													{
														abrokerage = abrokerage.substr(0,7);
													}
													
												}
												if (searchType == 1) //Property inquiry
												{
													var customtext = 'You have an inquiry for ' +houseno + ' '+streetname+'. ' + 'See email for details. Agent: '+ afirstname+' '+alastname+' '+abrokerage+' '+acell+'. Reply Y to accept';
												}
												else if(searchType == 2) //Subdivision inquiry
												{
													var customtext = 'You have a web lead for ' +subdivision+'. ' + 'See email for details. Lead: '+ afirstname+' '+alastname+' '+acell+'. Reply Y to accept';
												}
												else if(searchType == 3)
												{
													if(acell)
													{
														var customtext = 'You have a general web lead for your division. See email for details. Lead: '+ afirstname+' '+alastname+' '+acell+'. Reply Y to accept';
													}
													else
													{
														var customtext = 'You have a general web lead for your division. See email for details. Lead: '+ afirstname+' '+alastname+'. Reply Y to accept';
													}
												}
												post['text'] = customtext;
												nlapiLogExecution('DEBUG','in if category 1  ','customtext: '+customtext);
											}
											else
											{
												var houseno = '';
												var streetname = '';
												var afirstname = '';
												var alastname = '';
												var abrokerage = '';
												var propid = nlapiGetFieldValue('custevent_property');
												var agentname = nlapiGetFieldValue('custevent_caller_name');
												var datescheduled = nlapiGetFieldValue('custevent_showing_date_scheduled');
												var timescheduled = nlapiGetFieldValue('custevent_showing_time_scheduled');
												if(propid)
												{
													var propertyrecord = nlapiLoadRecord('customrecord_property_record',propid);
													houseno = propertyrecord.getFieldValue('custrecord_house_number');
													streetname = propertyrecord.getFieldText('custrecord31');
												
												}
												
												if(agentname)
												{
													var agentrecord = nlapiLoadRecord('customrecord_agent',agentname);
													afirstname = agentrecord.getFieldValue('custrecord_agent_first_name');
													alastname = agentrecord.getFieldValue('custrecord_agent_last_name');
													abrokerage = agentrecord.getFieldText('custrecord_brokerage');
													acell = agentrecord.getFieldValue('custrecord_agent_mobile_number');
													officePhone = agentrecord.getFieldValue('custrecord_agent_office_number');
													if (acell)
													{
														phone = acell;
													}
													else
													{
														phone = officePhone;
													}

													if(abrokerage)
													{
														abrokerage = abrokerage.substr(0,7);
													}
													
												}
												var customtext = 'You have an inquiry for ' + houseno + ' ' + streetname + '. ' + datescheduled + ' ' + timescheduled + '. ' + afirstname + ' ' + alastname + ' ' + abrokerage + ' ' + phone + '. Reply Y to accept.';
												
												nlapiLogExecution('DEBUG', 'bsrFullPortalAccess', bsrFullPortalAccess);
												nlapiLogExecution('DEBUG', 'resCode', resCode);
											
												if (bsrFullPortalAccess == 'T' && (resCode == '200' || resCode == '201'))
												{
													customtext += String.fromCharCode(13) + 'New! Click here for more details, to update sale/const status, or reassign: ' + shortURL;
												}
												
												var receiveTextStatus = 'T'
												
												if (receiveTextStatus == 'F')
												{
													streetname = streetname.substr(0,7);
													var customtext = 'You have an inquiry for ' +houseno + ' '+streetname+'. We are temporarily unable to confirm showings by text. Please check your email to confirm this inquiry';
												}
												post['text'] = customtext;
												nlapiLogExecution('DEBUG','in else  ','customtext: '+customtext);
											}
										}
										post['phone'] = '1'+phoneno;
										//post['phone'] = '917411148033';
										
										post['unicode'] = '0';
										post['max_length'] = '2';
										if(phoneno)
										{
											nlapiLogExecution('DEBUG', 'post request', JSON.stringify(post));
											var emailresponse = nlapiRequestURL('https://www.textmagic.com/app/api',post);
											//updatePreference(acctype);
											if(emailresponse)
											{
												var emailresponsebody = emailresponse.getBody();
												nlapiLogExecution('DEBUG','emailresponsebody ','emailresponsebody: '+emailresponsebody);
												var ebody = JSON.parse(emailresponsebody);
												var hasmessageid = ebody.message_id;
												//nlapiLogExecution('DEBUG','hasmessageid  ',' hasmessageid '+hasmessageid);
												var messageidresponse = '';
												if(hasmessageid && hasmessageid != 'undefined')
												{
													//var ebody = JSON.parse(emailresponsebody);
													for (key in hasmessageid) {
														if (hasmessageid.hasOwnProperty(key)) 
														{
															//nlapiLogExecution('DEBUG',' key '+key + " value " + hasmessageid[key]);
															messageidresponse = key;
														}
													}
													//nlapiLogExecution('DEBUG','after hasmessageid  ',' hasmessageid '+hasmessageid);
													if(enable2waymessaging == 'T')												
													{
														var fieldids = [];
														var fieldvalues = [];
														//	fieldids.push('custrecord_first_sms_sent');
														//	fieldvalues.push('T');
														fieldids.push('custevent_hms_sms_message_id');
														fieldvalues.push(username);
														nlapiSubmitField(rectype,id,fieldids,fieldvalues);
														//updatePreference(acctype);
														if(enable2waymessaging == 'T')
														{
															updateLogin(username, id);
														}
														//
													}
													else
													{
													}
												}
												else
												{
													//custrecord_sms_error
													nlapiLogExecution('AUDIT','not able to process   '+id,'not able to process   '+id);
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


function updateLogin(usernamei, supportid)
{
	var filters = [];
	filters.push( new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
	filters.push( new nlobjSearchFilter( 'custrecord_hms_magic_text_username', null, 'is', usernamei, null));
	
	
	var columns = [];
	columns.push(new nlobjSearchColumn('internalid'));	
	columns.push(new nlobjSearchColumn('custrecord_hms_magic_text_username'));	
	columns.push(new nlobjSearchColumn('custrecord_hms_magic_text_password'));	
	columns[0].setSort(false);
	var searchresults = nlapiSearchRecord('customrecord_hms_magic_text_logins', null, filters, columns);
	var assignedvalue = '';
	
	if(searchresults)
	{
		var searchlength = searchresults.length;
		
		//for(var i=0;i < searchlength;i++)
		{
			var searchid = searchresults[0].getId();
			var searchtype = searchresults[0].getRecordType();
			//username = searchresults[0].getValue('custrecord_hms_magic_text_username');
			//password = searchresults[0].getValue('custrecord_hms_magic_text_password');
			var loginrecord = nlapiLoadRecord(searchtype, searchid);
			loginrecord.setFieldValue('custrecord_hms_is_blocked','T');
			loginrecord.setFieldValue('custrecord_hms_support_ref',supportid);
			var sid = nlapiSubmitRecord(loginrecord,true,true);
			//nlapiLogExecution( 'DEBUG',   ' sid ', ' sid '+sid);
			
			
		}
	}

}



function getFreeLogin()
{
	var filters = [];
	filters.push( new nlobjSearchFilter( 'isinactive', null, 'is', 'F', null));
	filters.push( new nlobjSearchFilter( 'custrecord_hms_is_blocked', null, 'is', 'F', null));
	
	
	var columns = [];
	columns.push(new nlobjSearchColumn('internalid'));	
	columns.push(new nlobjSearchColumn('custrecord_hms_magic_text_username'));	
	columns.push(new nlobjSearchColumn('custrecord_hms_magic_text_password'));	
	columns[0].setSort(false);
	var searchresults = nlapiSearchRecord('customrecord_hms_magic_text_logins', null, filters, columns);
	var assignedvalue = '';
	
	if(searchresults)
	{
		var searchlength = searchresults.length;
		noofreply = searchlength;
		//for(var i=0;i < searchlength;i++)
		{
			username = searchresults[0].getValue('custrecord_hms_magic_text_username');
			password = searchresults[0].getValue('custrecord_hms_magic_text_password');
			
			
		}
	}

}

function updatePreference(acctype)
{
	var confiq = nlapiLoadConfiguration('companypreferences');
	confiq.setFieldValue( 'custscript_sub_account_type', acctype );
	// save changes to the configuration page
	nlapiSubmitConfiguration( confiq );
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
	//nlapiLogExecution('DEBUG','With out space ',' phoneno '+phoneno);
	phoneno = phoneno.substring((phoneno.length-10),phoneno.length);
	//nlapiLogExecution('DEBUG','phone substr  ',' phone substr '+phoneno);
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