/*
Author :  Pranjal Goyal
Client : HMS Marketing Services ..
Date: 5th October 2016
Script : Suitelet
*/

var author = '3847';
var subject = 'HMS ,Follow UP';
var body = '';
var recipient = 'pranjal@webbee.biz';
var OStatus= [1,2,4,7,10];
var CStatus = 5;
var action = nlapiResolveURL('SUITELET',181,1,true);
var html = '';
var ConfirmMsg = '';

html += '<!DOCTYPE html>';
html += '<html>';
html += '<head>';
html += '<title>Appointment Confirmation</title>';
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
html += '	padding: 4px 4px 4px 2px;';
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
html += '	background-color:#778899;';
html += '}';
html += '#form';
html += '{';
html += '	text-align:center;';
html += '}';
html += '</style>';
html += '</head>';
html += '<body>';
			
function BSRApptConfirmation(request, response)
{
	nlapiLogExecution('DEBUG','INIT');

	try
	{  
		var appIds = request.getParameter('apptid').split(',');	
		var bsr_id=request.getParameter('bs_id');
		var otherCases = request.getParameter('otherCases');	
		nlapiLogExecution('DEBUG',appIds);
		nlapiLogExecution('DEBUG',bsr_id);
		if(appIds != null && appIds.length > 0)
		{  
			if(otherCases != 'T')
		    SetGetPage(request,response,appIds,bsr_id);
			else
			MoreCasesPage(request,response,appIds)	
		}
		else
		SetErrorPage(request,response);
	}
	catch(ex)
	{
		SetErrorPage(request,response);
		body =  'Exception : '+ex.name;
		body += '\n Function : BSRApptConfirmationWebbee';
		body += '\n Message : '+ex.message;
		nlapiSendEmail(author,recipient,subject,body);	
		nlapiLogExecution('DEBUG','Error 1:' + body);
	}
}


function SetGetPage(request,response,appIds,bsr_id)
{
	try
	{
	      for(var i=0; i<appIds.length; i++)	
	      {
	    	  if(defaultVal(appIds[i]) != '')
	    	  CloseCase(appIds[i],bsr_id);	
	      }	  
		      	
	      if(defaultVal(appIds[0]) != '')
	      {
	    	  var primaryBSR = nlapiLookupField('supportcase', appIds[0], 'custevent_builder_sales_rep_subd');	
			  var filters = [];
			  filters.push(new nlobjSearchFilter('status', null,'anyof', OStatus));
			  filters.push(new nlobjSearchFilter('custevent_builder_sales_rep_subd', null,'is', primaryBSR));	  
			  var Search = nlapiSearchRecord('supportcase', null, filters);			 		 
			  if(Search != null && Search.length >0)
			 {
			    ConfirmMsg = 'Thank you for confirming the appointment details.';	
		        ConfirmMsg  +=  '<br/>We also show the following inquiries awaiting your follow up.';
			 	var CaseIds = [];
			    for(var i=0; i<Search.length ; i++)
			    CaseIds.push(Search[i].getId());	       	             
	            var url = action;
		        url += '&apptid='+CaseIds.toString();	
		        url += '&otherCases=T';
	            
				html += '<table align = "center" id="customers">';
				html += '<tr>';
				html += '<td style= "color:green;"><b>'+ConfirmMsg+'</b></td>';
				html += '</tr>';
				html += '</table>';
				html += '<script>';
				html += 'window.setTimeout(function(){window.location.href = "'+url+'";},2000)';
				html += '</script>';
				html += '</body>';
				html += '</html>';
				response.write(html);	 			
			}	
	        else
		    ThanksPage(request,response);		
	      }	  
	}
	catch(ex)
	{
		SetErrorPage(request,response);
		body =  'Exception : '+ex.name;
		body += '\n Function : SetGetPage';
		body += '\n Message : '+ex.message;
		nlapiSendEmail(author,recipient,subject,body);	
		nlapiLogExecution('DEBUG','Error 2:' + body);
	}
}

function CloseCase(apptID,bsr_id)
{
	try	
	{     		
		var case_rec=nlapiLoadRecord('supportcase', apptID);
		var status=case_rec.getFieldValue('status');
		if(status!=5){
			var dateTime =   nlapiDateToString(new Date(), 'datetimetz')
			var fields = ['status','custevent_bsr_appt_confirmation','custevent_case_closed_by'];
			var values = [CStatus,dateTime,bsr_id];	  
			var apptID = nlapiSubmitField('supportcase',  apptID, fields, values,true);
			nlapiLogExecution('DEBUG', 'Appointment Status Closed with id : ', apptID);	
			var link = nlapiResolveURL('SUITELET',1788,1,true);
			nlapiLogExecution('DEBUG', 'link: ', link);	

			var response = nlapiRequestURL(link+'&apptID='+apptID+'&bsrid='+bsr_id+'&closeAppt='+true)
			nlapiLogExecution('DEBUG', 'response: ', response);	
		} else {
			var link = nlapiResolveURL('SUITELET',1788,1,true);
			var response = nlapiRequestURL(link+'&apptID='+apptID+'&bsrid='+bsr_id+'&closeAppt='+true+'&closed='+true)
			nlapiLogExecution('DEBUG', 'response: ', response);	
		}
	}
	catch(ex)
	{
		body =  'Exception : '+ex.name;
		body += '\n Function : CloseCase';
		body += '\n Message : '+ex.message;
		nlapiSendEmail(author,recipient,subject,body);	
		nlapiLogExecution('DEBUG','Error 3:' + body);
	}
}

//Function defaultVal..	  

function defaultVal(value)
{	
	try
	{ 
	    if(value == null || value == undefined)
	    value = '';	    
	    return value;
	}
	catch(ex)
	{
		body =  'Exception : '+ex.name;
		body += '\n Function : defaultVal';
		body += '\n Message : '+ex.message;
		nlapiSendEmail(author,recipient,subject,body);
		nlapiLogExecution('DEBUG','Error 4:' + body);
	}
}

function MoreCasesPage(request,response,appIds)
{
	try
	{
		var form = nlapiCreateForm('Confirm Appointments');
		form.addButton('confirm', 'Confirm', 'ConfirmAppointments()');		
		var sublist = form.addSubList("appointments", 'list', 'Appointment/Inquiry List');
		sublist.addField('appid','text', 'AppId').setDisplayType('hidden');
		sublist.addField('property','text', 'Property');
		sublist.addField('agent','text','Agent');
		sublist.addField('mobileno','phone', 'Mobile No');
		sublist.addField('agentemail','email','Email');
		sublist.addField('broker','text', 'Broker');
		sublist.addField('lot','text','Lot');
		sublist.addField('subdiv', 'text', 'Subdivision');
		sublist.addField('startdate', 'text', 'Start Date');
		sublist.addField('schdate', 'text', 'Schdule Date');
		sublist.addField('startendtime', 'text', 'Start End Time');
		sublist.addField('notes', 'textarea', 'Notes');
						    	 
		 for(var i=0; i<appIds.length; i++)
		 {	
			  var caseRec = nlapiLoadRecord('supportcase', appIds[i]);		  
			  var agent = defaultVal(caseRec.getFieldValue('custevent_agent_for_ren'));	  
			  var mobileNo = defaultVal(caseRec.getFieldValue('custevent_agent_mobile_number'));	 
			  var email = defaultVal(caseRec.getFieldValue('custevent_caller_email'));	 
			  var brokerId = caseRec.getFieldValue('custevent_brokerage_or_company');	 
			  var broker = defaultVal(nlapiLookupField('customrecordbrokerage', brokerId,'custrecord_branch_name'));
			  var property =defaultVal(caseRec.getFieldValue('custevent_property_for_ren'));	 
			  var suvdiv = defaultVal(caseRec.getFieldValue('custevent_subdivision_for_ren'));	 
			  var lot = defaultVal(caseRec.getFieldValue('custevent_lot_number'));	   
			  var startdate = defaultVal(caseRec.getFieldValue('startdate'));	 
			  var schdate = defaultVal(caseRec.getFieldValue('custevent_showing_date_scheduled'));	 
			  var schtime =  defaultVal(caseRec.getFieldValue('custevent_showing_time_scheduled'));	 
			  var endtime = defaultVal(caseRec.getFieldValue('custevent_showing_end_time'));	
			  var notes = defaultVal(caseRec.getFieldValue('custevent_special_messages'));		   

			sublist.setLineItemValue('appid',i+1 ,appIds[i]);
			sublist.setLineItemValue('property',i+1 ,property);
			sublist.setLineItemValue('agent',i+1 ,agent);
			sublist.setLineItemValue('mobileno',i+1 ,mobileNo);
			sublist.setLineItemValue('agentemail',i+1 ,email);
			sublist.setLineItemValue('broker',i+1 ,broker);
			sublist.setLineItemValue('lot',i+1 , lot);
			sublist.setLineItemValue('subdiv',i+1 ,suvdiv);
			sublist.setLineItemValue('startdate',i+1 ,startdate);
			sublist.setLineItemValue('schdate',i+1 , schdate);
			sublist.setLineItemValue('startendtime',i+1 ,schtime+' - '+endtime);
			sublist.setLineItemValue('notes',i+1 , notes);
	    }		 
	    form.setScript('customscript_bsr_confirmation_webbee_cs');
		response.writePage(form);
	}
	catch(ex)
	{
		SetErrorPage(request,response);
		body =  'Exception : '+ex.name;
		body += '\n Function : MoreCasesPage';
		body += '\n Message : '+ex.message;
		nlapiSendEmail(author,recipient,subject,body);
		nlapiLogExecution('DEBUG','Error 5:' + body);
	}
}


function ThanksPage(request,response)
{
	try
	{	
		ConfirmMsg = 'Thank you for confirming the appointment details.';	
		html += '<table align = "center" id="customers">';
		html += '<tr>';
		html += '<td style= "color:green;"><b>'+ConfirmMsg+'</b></td>';
		html += '</tr>';
		html += '</table>';
		html += '</body>';
		html += '</html>';
		response.write(html);	 
	}		
	catch(ex)
	{
	    SetErrorPage(request,response);
		body =  'Exception : '+ex.name;
		body += '\n Function : ThanksPage';
		body += '\n Message : '+ex.message;
		nlapiSendEmail(author,recipient,subject,body);
		nlapiLogExecution('DEBUG','Error 6:' + body);
	}
}


function SetErrorPage(request,response)
{
	try
	{
	    ConfirmMsg  = 'No Appointment Found to close.' ;	
		html += '<table align = "center" id="customers">';
		html += '<tr>';
		html += '<td style= "color:red;"><b>'+ConfirmMsg+'</b></td>';
		html += '</tr>';
		html += '</table>';
		html += '</body>';
		html += '</html>';
		response.write(html);	 
	}		
	catch(ex)
	{
		body =  'Exception : '+ex.name;
		body += '\n Function : SetErrorPage';
		body += '\n Message : '+ex.message;
		nlapiSendEmail(author,recipient,subject,body);
		nlapiLogExecution('DEBUG','Error 7:' + body);
	}
}