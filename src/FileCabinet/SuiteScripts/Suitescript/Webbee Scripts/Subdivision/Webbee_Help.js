/*
Name                -   Webbee_Help.js
Script Type       -   Library File
Purpose            -   Library Script file
Company          -   WebBee-ESolutions-PVT-LTD.
Created By        -   PRANJAL GOYAL
Client                -   HMS Marketing Services
Date                  -   11th May 2016
*/
 var author = '3847'; // Call Center
 var recipient = [];
 recipient.push('pranjal@webbee.biz');
 recipient.push('aj@webbeeglobal.com');
 var subject = 'HMS Marketing Services ....';
 var body = '';
 
 var cc = new Array();
 cc.push('mlsinfo@hmsmarketingservices.com'); // HMS Marketing...
 cc.push('jmcdonald@hmsmarketingservices.com'); // Mac Donald...
 cc.push('dkowalski@hmsmarketingservices.com'); // Deb ...
 
 var SubDiv_Instant =  83; // Subdivision Instant Email 
 var SubDiv_On_Calendar =  84; // Subdivision On Calendar
 var SubDiv_Not_On_Calendar =  85; // Subdivision Not On Calendar
 
//Function For Returning space if null/undefined

 function checkIfNull(value)
 {	
 	try
 	{ 
 	    if(value == null || value == undefined)
 	    value = '';	    
 	    return value;
 	}
 	catch(ex)
 	{
 	    body =  'EXCEPTION : '+ex.name+'\n Function : checkIfNull,  '+'\n Message : '+ex.message;
 		nlapiSendEmail(author,recipient[0],subject,body);	
 	}
 }