/*
 * File              : Property_List_Amendment_Webee_CS.js
 * Script           : Client
 * Purpose       : Validation before Merging PDF Template ..
 * Client           : HMS Marketing Services..
 * Author         : Pranjal Goyal (Webbee-eSolutions-Pvt-Ltd.)
 *  Date            : 22nd June 2016
 */

var details = '';
var oldListPrice = null; 
var oldExpDate = null;
function clientPageInit(type)
{
	try
	{
          oldListPrice = checkIfNull(nlapiGetFieldValue('custrecord_current_list_price'));	
          oldExpDate = checkIfNull(nlapiGetFieldValue('custrecord_expiration_date'));		
	}
	catch(ex)
	{
		details = 'Exception : '+ex+', Message : '+ex.message+' Name : '+ex.name;
		alert(details);
	}
}

function clientPropertyFieldChanged(type, name, linenum)
{
	try
	{
		if(name == 'custrecord_listing_agreement')
		{
			var isChanged = nlapiGetFieldValue(name);
			alert('Property Changed .. : '+isChanged);
		}	
		return true;
	}
	catch(ex)
	{
		details = 'Exception : '+ex+', Message : '+ex.message+' Name : '+ex.name;
		alert(details);
	}
}

function clientSavePropertyRecord()
{
	try
	{	
		    var newListPrice = checkIfNull(nlapiGetFieldValue('custrecord_current_list_price'));	
		    var newExpDate = checkIfNull(nlapiGetFieldValue('custrecord_expiration_date'));	
            var mlsRegionId = checkIfNull(nlapiGetFieldValue('custrecord15')); //Cincinnati OH 1
             var topLevelBuilder = checkIfNull(nlapiGetFieldValue('custrecord_top_level_builder')); // Fischer Homes 509
                 
            if(topLevelBuilder  == 509 && mlsRegionId  != '') 
           {
	                 var isChanged = false;
	                 if(oldListPrice  != '' && newListPrice  != '' && oldExpDate  != '' && newExpDate != '')
	                 {
	                          if(oldListPrice != newListPrice && oldExpDate == newExpDate)
	                          {
	                              details = 'Property Record , Current Price  : '+oldListPrice+' Changed with : '+newListPrice;                     
	                              //       alert(details);
	                              isChanged = true;
	                          }	
	                          else if(oldListPrice == newListPrice && oldExpDate != newExpDate)
	                          {
                                  details = 'Property Record , Expiry Date : '+oldExpDate +' Changed  with : '+newExpDate;                     
                                 //       alert(details);
                               	isChanged = true;
	                          }	
	                          else if(oldListPrice != newListPrice && oldExpDate != newExpDate)
	                          {
	                        	  details = 'Property Record , Current Price  : '+oldListPrice+' Changed  with : '+newListPrice;      
	                        	  details += ' And \n Expiry Date : '+oldExpDate +' Changed  with :'+newExpDate;                  
	                        	  //       alert(details);
	                        	  isChanged = true;
	                          }	
                }
				if( isChanged == true)
				{
						var res = confirm('Create New Listing Amendment ? ');
						if( res == true)
						{
							nlapiSetFieldValue('custpage_is_changed', 'T');                                                                  
                              if(mlsRegionId  == 1)
                              {
                                  var res2 = confirm('Email Listing Amendment to MLS?'); 
                                  if( res2 == true)
                                  nlapiSetFieldValue('custpage_email_to_mlsinfo', 'T');
                                  else
                                  nlapiSetFieldValue('custpage_email_to_mlsinfo', 'F');
                              }
						}
                        else
                         nlapiSetFieldValue('custpage_is_changed', 'F');
        		} 
          }           
		  return true;
	}
	catch(ex)
	{
		details = 'Exception : '+ex+', Message : '+ex.message+' Name : '+ex.name;
		alert(details);
	}
}


function checkIfNull(value)
{	
	try
	{ 
	    if(value == null || value == undefined || value == '')
	    value = '';	    
	    return value;
	}
	catch(ex)
	{
	    details = 'Exception : '+ex+', Message : '+ex.message+' Name : '+ex.name;
	    alert(details);
	}
}

