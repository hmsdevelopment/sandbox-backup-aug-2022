/*
Author :  Pranjal Goyal
Client : HMS Marketing Services ..
Date: 5th October 2016
Script : Client
*/

var action = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=181&deploy=1&compid=1309901&h=a4824849a435709172ea';

function ConfirmAppointments()
{
   try
   {
	   var totalAppts = nlapiGetLineItemCount('appointments');
	   var appIds = [];
	   for(var i=1 ; i<=totalAppts ; i++)
	   {
		    var appid = nlapiGetLineItemValue('appointments', 'appid', i);
		    appIds.push(appid);		     	
	    }
	     if(appIds != null && appIds.length >0)
	     {
	    	 var url = action+'&apptid='+appIds.toString();
    	     window.location=url;
	     }	 
   }
  catch(ex)
  {
	  alert('Exception : '+ex+'\n Name : '+ex.name+'\n Message : '+ex.message);
  }
}


