/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Dec 2017     Admin
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function GetSurveyReport(request, response){
	if(request.getMethod()=='GET'){
		var report='';
		var survey_id=request.getParameter('survey_id');
		var columns=[];
		columns.push(new nlobjSearchColumn('custrecord_survey_ans'));
		columns.push(new nlobjSearchColumn('custrecord_survey_case'));
		var search_surveys=nlapiSearchRecord('customrecord430', null, ['custrecord_survey_ques','is',survey_id], columns)
	if(search_surveys!=null){
		report+='Questions\n';
		var questions=nlapiLookupField('customrecord429', survey_id, 'custrecord68');
		nlapiLogExecution('DEBUG', 'questions', questions);
		questions=JSON.parse(questions);
		var ques=questions.Questions;
		for(var i=0;i<ques.length;i++){
			report+='Q'+(i+1)+':'+ques[i].questiontext+'\n';
		}
		report+='\nCase';
		for(var j=0;j<ques.length;j++){
			report+=',Q'+(j+1);
		}
		report+='\n';
		for(var t=0;t<search_surveys.length;t++){
		try{
			var caseid=search_surveys[t].getValue('custrecord_survey_case');
			var answers_str=search_surveys[t].getValue('custrecord_survey_ans');
			nlapiLogExecution('DEBUG',search_surveys[t].getId() , answers_str)
			var answers=JSON.parse(answers_str);
			report+=caseid+',';
			for(var m=0;m<answers.length;m++){
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
				report+='"'+answ+'"'+',';
			}
			report+='\n'
		}
		catch(e){
			
		}}
		var file=nlapiCreateFile('Survey.csv', 'CSV', report);
		  response.setContentType(file.getType(), 'Survey'+survey_id+'.csv', 'attachment');
		    response.write(file.getValue());
		
	}else{
		response.write("No result found");
	}
	}

}
