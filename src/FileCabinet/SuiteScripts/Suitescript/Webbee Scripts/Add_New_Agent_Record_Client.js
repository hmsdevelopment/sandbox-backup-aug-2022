/*Summary
 * File-Name : Add_New_Agent_Record_Client.js
 * Script Type : Client 
 * Client : HMS Marketing Services
 * Author : Pranjal Goyal
 * Date : 5th November 2016 
 */

var details = '';
var emilBK = '';
var mobileBK = '';
var agentIdBK = ''; 
function addAgentOnPageInit(type)
{
	try
	{        
	nlapiGetField('custevent_add_new_agent').setDisplayType('normal');   
	nlapiGetField('custpage_sel_agent').setDisplayType('normal');
	if(document.getElementById('custpage_sel_agent_fs_lbl')&& document.getElementById('custevent_select_agent') && document.getElementsByName('inpt_custpage_sel_agent'))
	{
		var html = document.getElementsByName('inpt_custpage_sel_agent')[0].outerHTML;
        var selHtml = getSelectHtml(html);
		document.getElementsByName('inpt_custpage_sel_agent')[0].outerHTML="";
		document.getElementById('custpage_sel_agent_fs_lbl').outerHTML="";
		//document.getElementById('inpt_custpage_sel_agent3_arrow').outerHTML="";
		document.getElementById('custevent_select_agent').outerHTML = selHtml ;
	}
	}
	catch(ex)
	{
		details = 'Exception : '+ex+', Message : '+ex.message;
      	 alert(details);
	}
}


function getSelectHtml(html)
{
	   try
	   {
	        var div ='<div class="uir-field-wrapper" data-field-type="select">';
	        div += '<span class="uir-field">';
		    div += ' <span id="custpage_sel_agent_fs" data-fieldtype="select" class="nldropdown effectStatic" style="white-space:nowrap;" data-helperbutton-count="0"><div class="uir-select-input-container">'+html+'<span class="ddarrowSpan">';
	        div += '<img id="inpt_custpage_sel_agent3_arrow" src="/uirefresh/img/field/dropdown.png" class="i_dropdownarrow" alt="More Options" height="20" width="20"></span></div>';
	        div += '<div class="ns-dropdown" data-name="custpage_sel_agent" data-initialized="T" data-options="[]" data-default-option="0" data-settings="{&quot;flags&quot;:-2147481600,&quot;width&quot;:280,&quot;minWidth&quot;:280,&quot;mandatory&quot;:false}" style="display: none; "></div></div>';
	        return div;
	  }
     catch(ex)
	 {
		details = 'Exception : '+ex+', Message : '+ex.message;
        alert(details);
	 }
}


function addAgentOnFieldChange(type, name, linenum)
{
	try
	{
		    var addNewAgent = nlapiGetFieldValue('custevent_add_new_agent');
            var agentName =  defValue(nlapiGetFieldValue('custevent_caller_name')); 
		    var formid = nlapiGetFieldValue('customform');
		    var assignedTo = nlapiGetFieldValue('assigned');         
			var email = defValue(nlapiGetFieldValue('custevent_caller_email'));      	                     	
			var agentId = defValue(nlapiGetFieldValue('custevent_agent_id_no'));  
			var mobileNo= defValue(nlapiGetFieldValue('custevent_agent_mobile_number'));  
                    
          if(name == 'custevent_add_new_agent')
          { 	   
			  if(addNewAgent == 'F')
			  {
				 nlapiGetField('custevent_caller_name').setDisplayType('normal');   
			  }
			  else
			  {
				  emilBK =  defValue(nlapiGetFieldValue('custevent_caller_email')); 
				  mobileBK = defValue(nlapiGetFieldValue('custevent_agent_mobile_number')); 
				  agentIdBK =  defValue(nlapiGetFieldValue('custevent_agent_id_no'));  
				  nlapiSetFieldValue('custevent_caller_name', null,false);
				  nlapiGetField('custevent_caller_name').setDisplayType('disabled');		
			  }	    
         }
		 
        if(name == 'custevent_caller_email')         // Search By Email
  	    {            	
			//if((formid == 54 ) || (formid != 54 && (assignedTo == 3||  assignedTo == 4276)))
			//{ 
			   var  email2 = nlapiGetFieldValue('custpage_email_of_agent');  
			   if(mobileNo == '' && agentId == '' && email != '' && email2 != email && agentName  == '')
			   {
				  var filter = new nlobjSearchFilter('custrecord_agent_email', null, 'is', email);
				  searchAgentByFieldChangeValue(filter,'custpage_email_of_agent',email);  
			   }   
			 else if(addNewAgent  == 'T' && agentName  == '' && email == '' )
			 {  
				nlapiSetFieldValue(name, emilBK,false);
			 }
		   //} 
       }

         if(name == 'custevent_agent_id_no')              // Search By AgentId
  	     {
			//if((formid == 54 ) || (formid != 54 && (assignedTo == 3||  assignedTo == 4276)))
			 //{      
			 var agentId2 = defValue(nlapiGetFieldValue('custpage_agentid_of_agent'));     
			 if(email == '' && mobileNo == '' && agentId  != '' && agentId  != agentId2 && agentName  == '')
			 {                       
				var filter = new nlobjSearchFilter('custrecord_agent_id', null, 'is',agentId);
				searchAgentByFieldChangeValue(filter,'custpage_agentid_of_agent',agentId );  
			 }   
			 else if(addNewAgent  == 'T' && agentName  == '' && agentId == '' )
			 {					 
				 nlapiSetFieldValue(name, agentIdBK,false);
			 }
  	     //} 
       }

		if(name == 'custevent_agent_mobile_number')                  // Search By MobileNo
  	    {
			// if((formid == 54 ) || (formid != 54 && (assignedTo == 3||  assignedTo == 4276)))
			// {
				var mobileNo2 = defValue(nlapiGetFieldValue('custpage_cellno_of_agent'));   
				if(email == '' && agentId  == '' && mobileNo != '' && mobileNo != mobileNo2 && agentName  == '' )
				 {
				   var filter = new nlobjSearchFilter('custrecord_agent_mobile_number', null, 'is',mobileNo);
				   searchAgentByFieldChangeValue(filter,'custpage_cellno_of_agent',mobileNo);  
				}   
				else if(addNewAgent  == 'T' && agentName  == '' && mobileNo == '' )
			    {            
				  nlapiSetFieldValue(name, mobileBK,false);
			    }
			//} 
       }

       if(name == 'custpage_sel_agent') 
   	   {
	   // if((formid == 54 ) || (formid != 54 && (assignedTo == 3||  assignedTo == 4276)))
		// {
        	 var id = nlapiGetFieldValue('custpage_sel_agent');
        	 nlapiSetFieldValue('custevent_caller_name', id);
		 //}
   	   }
	}
	catch(ex)
	{
		details = 'Exception : '+ex+', Message : '+ex.message;
        	alert(details);
	}
}

function addAgentSaveRecord(type)
{
	try
	 {	
			 var agent = nlapiGetFieldValue('custevent_caller_name');
			 var addNewAgent =  nlapiGetFieldValue('custevent_add_new_agent');  
		     if((agent  == null || agent == '') && addNewAgent == 'T' )
		     {
			        var agenttype =  nlapiGetFieldValue('custevent_caller_type');
			        var brokerId =  nlapiGetFieldValue('custevent_brokerage_or_company');
			        var brokername = nlapiGetFieldText('custevent_brokerage_or_company');
			     
			        var fname =  nlapiGetFieldValue('custevent_agentfname');
			        var lname =  nlapiGetFieldValue('custevent_agentlname');
			        var salutation = nlapiGetFieldValue('custevent_agent_salutation');
			        var email = nlapiGetFieldValue('custevent_caller_email');
			        var preferredNo = nlapiGetFieldValue('custevent_agent_callback');
			        var officeno = nlapiGetFieldValue('custevent_caller_phone_number');
			        var mobileno = nlapiGetFieldValue('custevent_agent_mobile_number');
			        var otherno = nlapiGetFieldValue('custevent_agent_other_number');
			        var agentcomments = nlapiGetFieldValue('custevent_agent_coments');
			        var agentid = nlapiGetFieldValue('custevent_agent_id_no');
	 
		          if(fname && lname && brokername && brokerId  && agenttype)
		          {
					   var brokerRecord = nlapiLoadRecord('customrecordbrokerage', brokerId);
					   var mlsRegion = brokerRecord.getFieldValue('custrecord6');
	
					   if(brokername.charAt(1) == '|' || brokername.charAt(1) == '|')
					   var name = lname + ', ' + fname +brokername;
					   else
					   var name = trim(lname) + ', ' + trim(fname) +' | ' + trim(brokername);
	
					   var record = nlapiCreateRecord('customrecord_agent');
					   record.setFieldValue('custrecord_agent_type', agenttype); //caller type 
					   record.setFieldValue('custrecord_salutation', salutation); //salutation
					   record.setFieldValue('custrecord_agent_first_name', fname);
					   record.setFieldValue('custrecord_agent_last_name', lname);
					   record.setFieldValue('custrecord56', fname+' '+lname);
					   record.setFieldValue('custrecord_agent_id', agentid);
					   record.setFieldValue('custrecord_brokerage',brokerId);
					   record.setFieldValue('custrecord_agent_mls_region', mlsRegion);
					   record.setFieldValue('custrecord_agent_office_number', officeno);
					   record.setFieldValue('custrecord_agent_mobile_number', mobileno);
					   record.setFieldValue('custrecord_agent_other_number', otherno);
					   record.setFieldValue('custrecord_agent_preferred_number', preferredNo);
					   record.setFieldValue('custrecord_agent_email', email);
					   record.setFieldValue('name', name);
					   record.setFieldValue('custrecord_agent_comments', agentcomments);

					  var id = nlapiSubmitRecord(record,true);
					  nlapiGetField('custevent_add_new_agent').setDisplayType('disabled');
					  nlapiSetFieldValue('custevent_caller_name', id,false);
					  nlapiSetFieldValue('custevent_agent_for_ren', fname+' '+lname,false);
					  return true;
       		 }
        	else
        	{
				details = 'Please Fill the Required Fields';
				alert(details);
				return false;
        	}    
		}	
        return true;
	 }
	catch(ex)
	{
		 details = 'Exception : '+ex+', Message : '+ex.message;
      	 alert(details);
	}     
}

function defValue(value)
{	
	try
	{ 
	    if(value == null || value == undefined || value == '' || value == 'undefined')
	    value = '';	    
	    return value;
	}
	catch(ex)
	{
	   details = 'Exception : '+ex+', Message : '+ex.message;
       alert(details);
       return '';
	}
}

function searchAgentByFieldChangeValue(filter,searchField,searchValue)
{
	try
	{
		 var columns = new Array();               
		 columns[0] = new nlobjSearchColumn('internalid');
		 columns[1] = new nlobjSearchColumn('name');
		 
		 var searchAgent = nlapiSearchRecord('customrecord_agent', null, filter, columns);
		 if(searchAgent != null )
		 {
			 var len =  searchAgent.length ;	    		 
			 nlapiRemoveSelectOption('custpage_sel_agent');
			 nlapiSetFieldValue(searchField,searchValue);	

			 if(len >0)
			 {   	    	
			   nlapiGetField('custpage_sel_agent').setDisplayType('normal');		  
			   for(var i=0 ;i<len;i++)
			   {
				   var value = searchAgent[i].getValue( columns[0]); // id
				   var text = searchAgent[i].getValue( columns[1]); // name	   	           	    	
				   nlapiInsertSelectOption('custpage_sel_agent', value, text);
			   }   
				var id = nlapiGetFieldValue('custpage_sel_agent');
				nlapiSetFieldValue('custevent_caller_name', id);		
				if(defValue(id) != '')
				{
					var agentType = nlapiLookupField('customrecord_agent', id,'custrecord_agent_type');
					nlapiSetFieldValue('custevent_caller_type', agentType);		
				}	
			  }
				  return true;
        } 
	}
	catch(ex)
	{
		 details = 'Exception : '+ex+', Message : '+ex.message;
	     alert(details);
	}
}