/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Dec 2017     Govind
 *
 */

/**
 Mail would be sent to management with the results of a survey after one was filled out.
 */
function SendSurveyNotification(type){
	try{

		var caseid=nlapiGetFieldValue('custrecord_survey_case');		
		var casenumber=nlapiLookupField('supportcase', caseid, 'casenumber');
		var agent_name=nlapiLookupField('supportcase', caseid, 'custevent_caller_name', true);
		var brokerage=nlapiLookupField('supportcase', caseid, 'custevent_brokerage_or_company', true);
		var answers=nlapiGetFieldValue('custrecord_survey_ans');
		var survey_rec=nlapiGetFieldValue('custrecord_survey_ques');
		var builder=nlapiLookupField('customrecord429', survey_rec, 'custrecord67');
		var buildername=nlapiLookupField('customrecord429', survey_rec, 'custrecord67',true);
		var recipients=get_recipients(builder);
		var send_survey_to_bsr=nlapiLookupField('customer', builder, 'custentity_sendsurvey_to_bsr');
		var primary_bsr=nlapiLookupField('supportcase', caseid,'custevent_builder_sales_rep_subd')
		var primary_bsr_mail=nlapiLookupField('partner', primary_bsr, 'email');
		var typeBsr=nlapiLookupField('partner', primary_bsr, 'custentity_team_type');
		var members = typeBsr == '6' ? String(nlapiLookupField('partner', primary_bsr, 'custentity_team_members')).split("\u0005") : ''

		var report='';
		report+='Questions\n';
		var questions=nlapiLookupField('customrecord429', survey_rec, 'custrecord68');
		nlapiLogExecution('DEBUG', 'questions', questions);
		questions=JSON.parse(questions);
		var ques=questions.Questions;
		var body='';
		body+='<b>Agent:</b> '+agent_name+'<br><b>Brokerage:</b> '+brokerage+'<br><br>';
		
//		for(var i=0;i<ques.length;i++){
//			report+='Q'+(i+1)+':'+ques[i].questiontext+'\n';
//		}
//		report+='\nCase';
//		for(var j=0;j<ques.length;j++){
//			report+=',Q'+(j+1);
//		}
//		report+='\n';
//		
			answers=JSON.parse(answers);
//			report+=casenumber+',';
			for(var m=0;m<answers.length;m++){
				var ques=answers[m].questiontext;
				var answ='';
				var answertype=answers[m].answerType;
				var flag=0;
				if(answertype=='para-type-ans'){
					ans=answers[m].answer;
					answ=ans[0]||'';
					
				}else{
					ans=answers[m].answer;
					for(var a=0;a<ans.length;a++){
						var keys = Object.keys( ans[a]);
						
						if(keys[0]=='true'){
							if(flag==0){
								answ+=ans[a][keys[0]];
							}else{
								answ+=','+ans[a][keys[0]];
							}
								
							flag++;
						}
					}
				}
				body+='<br>'+(m+1)+'. '+ques+'<br>'+'<font color="red">Agent Answer: '+answ+'</font><br>';
				
//				report+='"'+answ+'"'+',';
			}
			body+='<br>Regards,<br>HMS Marketing Services<br>Home of the Kaleidoscope Data Platform';
//			report+='\n'
//		
//	
//	
//		var file=nlapiCreateFile('Survey_'+casenumber+'.csv', 'CSV', report);
			if(recipients.length==0){
				recipients.push('aj@webbeeglobal.com');
			}else{
				if(send_survey_to_bsr=='T') {
					if (typeBsr == '6') {
						for (var j = 0; j < members.length; j++) {
							var emailAux=nlapiLookupField('partner', members[j], 'email');
							recipients.push(emailAux);
						}
						
					} else {
						recipients.push(primary_bsr_mail);
					}
				}
			}
			var propertyId = nlapiLookupField('supportcase', caseid, 'custevent_property');
			var property = nlapiLoadRecord('customrecord_property_record', propertyId);
			var houseNumber = property.getFieldValue('custrecord_house_number');
			var street = property.getFieldText('custrecord31');
			var subdivision = property.getFieldValue('custrecordcustrecordsubdname');
		var subdivisonname = nlapiLookupField('customrecord_subdivision', subdivision, 'custrecord_subdivision_id');
		var buildername=property.getFieldText('custrecord_top_level_builder'); 
		if(buildername=='null'||buildername==null){
			buildername=property.getFieldText('custrecord12');
		}
       
       
			var lot = property.getFieldValue('custrecord_lot_number');
            if(lot&&lot!=null){
              lot=", Lot: " + lot;
            }else{
              lot="";
            }
      	var showingDate = nlapiLookupField('supportcase', caseid,'custevent_showing_date_scheduled');
		var showingTime = nlapiLookupField('supportcase', caseid,'custevent_showing_time_scheduled');
      
		var subject="Agent Feedback Received for " + houseNumber + " " + street + ", " + showingDate + ", " + showingTime + ", Builder: "+ buildername +", Subdivision: " + subdivisonname + lot;
//		nlapiSendEmail('4276', recipients, 'case Id | '+casenumber,'Please see attached file',null,'govind@webbee.biz',null,file);
		var records = new Object();
		records['activity'] = caseid;
		nlapiSendEmail('3847', recipients, subject,body,null,'govind@webbee.biz',records);
     	nlapiSubmitField('supportcase', caseid, 'custevent_agent_survey_received', 'T');

				nlapiLogExecution('DEBUG', 'mailsent');
	}catch(e){
		nlapiLogExecution('DEBUG', 'e', e);
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
