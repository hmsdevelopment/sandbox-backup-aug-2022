/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Dec 2017     Govind
 *
 */


function getReason(request, response){
	try{
		

	if(request.getMethod()=='GET'){
		var case_id=request.getParameter('query');
		var form=nlapiCreateForm('Showing Information');
		form.addField('custpage_cancellationreason', 'textarea', 'Why did your showing not go as planned?').setMandatory(true);
		var caseid=form.addField('custpage_case', 'text', 'case').setDisplayType('hidden');
		caseid.setDefaultValue(case_id);
		form.addSubmitButton('Submit')
		response.writePage(form);
	}else{
		
		var caseid=request.getParameter('custpage_case');
		var reason=request.getParameter('custpage_cancellationreason');
		try{
			var case_fields=['custevent_builder_sales_rep_subd','custevent_property','company','custevent_showing_date_scheduled','custevent_showing_time_scheduled'];
			var case_values=nlapiLookupField('supportcase', caseid,case_fields);
			nlapiLogExecution('DEBUG', 'case_values', JSON.stringify(case_values));
			var primary_bsr=case_values.custevent_builder_sales_rep_subd;
			var propertyId = case_values.custevent_property;
			var builder=case_values.company;
			var primary_bsr_mail=nlapiLookupField('partner', primary_bsr, 'email');			
			var send_survey_to_bsr=nlapiLookupField('customer', builder, 'custentity_sendsurvey_to_bsr');
			var recipients=get_recipients(builder);
			if(recipients.length==0){
				recipients.push('hms@webbeeglobal.com');
			}else{
				if(send_survey_to_bsr=='T')
				recipients.push(primary_bsr_mail);
			}
			var records = new Object();
			records['activity'] = caseid;
			var property_fields=['custrecord_house_number','custrecordcustrecordsubdname','custrecord_lot_number'];
			var property_values=nlapiLookupField('customrecord_property_record', propertyId, property_fields);
			var houseNumber=property_values.custrecord_house_number;
			var street=nlapiLookupField('customrecord_property_record', propertyId, 'custrecord31',true);
			var subdivision = property_values.custrecordcustrecordsubdname;
			var showingDate=case_values.custevent_showing_date_scheduled;
			var showingTime=case_values.custevent_showing_time_scheduled;
			var subdivisonname= nlapiLookupField('customrecord_subdivision', subdivision, 'custrecord_subdivision_id');
		    var lot=case_values.custrecord_lot_number;
			   if(lot&&lot!=null&&lot!='null'){
			          lot=", Lot: " + lot;
			        }else{
			          lot="";
			        }
			var subject="Agent Response Regarding Cancellation for " + houseNumber + " " + street + ", " + showingDate + ", " + showingTime + ", Subdivision: " + subdivisonname  + lot;
	        var body='The agent gave this response for the cancellation<br><b>'+reason;
	        //Send Email
		//	nlapiSendEmail('3847', recipients, subject,body,null,null,records);
		}catch(er){
			nlapiLogExecution('DEBUG', 'er', er)
		}
		
		
		nlapiSubmitField('supportcase', caseid, 'custevent_agent_reason_for_cancellation', reason);
		response.write("Thank You");
	}
	}catch(e){
		response.write(e);
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