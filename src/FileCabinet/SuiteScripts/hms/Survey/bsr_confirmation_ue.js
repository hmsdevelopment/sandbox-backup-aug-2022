/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Dec 2017     
 *
 */



function Send_mail_at_no(type){
	try{
		

	var response=nlapiGetFieldValue('custrecord_showing_confirmation');
	var case_id=nlapiGetFieldValue('custrecord_bsr_confirmation_case')
	if(response&&response!=3){
		var sender =nlapiLookupField('supportcase', case_id, 'custevent_send_as_email_user');
		var agentEmail = nlapiLookupField('supportcase', case_id, 'custevent_caller_email');
		nlapiLogExecution('DEBUG', 'agentEmail', agentEmail);
		if(sender == '' || sender == null)
		{
			sender = '3847';
		}
		var propertyId = nlapiLookupField('supportcase', case_id, 'custevent_property');
		var property = nlapiLoadRecord('customrecord_property_record', propertyId);
		var houseNumber = property.getFieldValue('custrecord_house_number');
		var street = property.getFieldText('custrecord31');
		var subdivision = property.getFieldValue('custrecordcustrecordsubdname');
        var subdivisonname = nlapiLookupField('customrecord_subdivision', subdivision, 'custrecord_subdivision_id');
        var showingDate = nlapiLookupField('supportcase', case_id,'custevent_showing_date_scheduled');
    	var showingTime = nlapiLookupField('supportcase', case_id,'custevent_showing_time_scheduled');
		var lot = property.getFieldValue('custrecord_lot_number');
		nlapiLogExecution('DEBUG', 'lot', lot);
        if(lot&&lot!=null&&lot!='null'){
          lot=", Lot: " + lot;
        }else{
          lot="";
        }
        var builder=nlapiLookupField('supportcase', case_id,'company');
        
      //modified 26-03-2018
      //var recipients=get_recipients(builder);
        
        var primaryBsrRcdId = nlapiLookupField('supportcase',case_id, 'custevent_builder_sales_rep_subd');
        var bsrName='';
        var bsrPhone='';
        if(primaryBsrRcdId != null && primaryBsrRcdId !='')
        {
        	var nameFields = nlapiLookupField('partner',primaryBsrRcdId, ['firstname','lastname','mobilephone','custentity_alternative_mobile_phone']);
        	var bsrFirstname = nameFields.firstname;
        	var bsrLastname = nameFields.lastname;
        	bsrName = bsrFirstname+' '+bsrLastname;
        	var bsrPhoneNum = nameFields.mobilephone;
        	var bsrAltPhone = nameFields.custentity_alternative_mobile_phone;
        	bsrPhone = bsrPhoneNum;
        	if(bsrPhone =='' && bsrPhone ==null)
        	{
        		bsrPhone = bsrAltPhone;
        	}
        }
		//-----------------
      var recipients=[];
			recipients.push(agentEmail);
		
		
        var records = new Object();
		records['activity'] = case_id;
		var emailBody1='';
		var subject="Appointment Canceled for " + houseNumber + " " + street + ", " + showingDate + ", " + showingTime + ", Subdivision: " + subdivisonname  + lot;
		emailBody1+='<a href="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=251&deploy=1&compid=1309901&h=12676ff94e4c0c45a31c&query='+(case_id)+'"'
			+'target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;'
			+'q=https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=251&deploy=1&compid=1309901&h=12676ff94e4c0c45a31c&query='+(case_id)+'">clicking here</a>';
		emailBody1= 'We understand your showing at ' + houseNumber + ' ' + street + ', scheduled for ' + showingDate + ' ' + showingTime + ' did not go through. Would you mind ' + emailBody1 + ' to let us know why?<br><br>Regards,<br>HMS Real Estate Feedback Team on behalf of<br>'+bsrName+'<br>'+bsrPhone;
		nlapiSendEmail(sender, recipients, subject,emailBody1,null,'jmcdonald@hmsmarketingservices.com',records);
            nlapiLogExecution('DEBUG', 'mail sent');

	}
	}catch(e){
		nlapiLogExecution('DEBUG', 'err', e);
	}
}
function get_recipients(builder){
	var email=[];
	var builder_personnel=nlapiLookupField('customer', builder, 'custentity_survey_recipients');
	var arr=[];
	arr=builder_personnel.split(',');
	for(var i=0;i<arr.length;i++){
		var b_mail=nlapiLookupField('partner', arr[i], 'email');
		email.push(b_mail);
	}
  return email;
}