/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Apr 2018     ratul
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function exportSurvey(type) {
	
	var columnsMain = [new nlobjSearchColumn("custrecord67")];
	var builderSurveySearch = nlapiSearchRecord("customrecord429",null,
			[
				   ["custrecord67","noneof","@NONE@"]
				], columnsMain);
	
	if(builderSurveySearch && builderSurveySearch != null) {
		var report = '';
		for(var k = 0;k<builderSurveySearch.length;k++) {
			var survey_id = builderSurveySearch[k].getId();
			var builderName = builderSurveySearch[k].getText(columnsMain[0]);
			var columns=[];
			columns.push(new nlobjSearchColumn('custrecord_survey_ans'));
			columns.push(new nlobjSearchColumn('custrecord_survey_case'));
			columns.push(new nlobjSearchColumn('casenumber','custrecord_survey_case'));
			var search_surveys=nlapiSearchRecord('customrecord430', null, ['custrecord_survey_ques','is',survey_id], columns)
		if(search_surveys!=null){
			report+='Bulider ::: '+ builderName + '\n\n';
			//report+='Questions\n';
			var questions=nlapiLookupField('customrecord429', survey_id, 'custrecord68');
			nlapiLogExecution('DEBUG', 'questions', questions);
			questions=JSON.parse(questions);
			var ques=questions.Questions;
//			for(var i=0;i<ques.length;i++){
//				report+='Q'+(i+1)+':'+ques[i].questiontext+'\n';
//			}
			report+='\nCase Number,Case InternalId';
			for(var j=0;j<ques.length;j++){
				report+=',Q'+(j+1) + ques[j].questiontext;
			}
			report+='\n';
			for(var t=0;t<search_surveys.length;t++){
			try{
				var caseNumber = search_surveys[t].getValue(columns[2]);
				var caseid=search_surveys[t].getValue('custrecord_survey_case');
				var answers_str=search_surveys[t].getValue('custrecord_survey_ans');
				nlapiLogExecution('DEBUG',search_surveys[t].getId() , answers_str)
				var answers=JSON.parse(answers_str);
				report += caseNumber + ',' + caseid+',';
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
			
			report+='\n\n\n';
			
			
		}
		}
		 
		var file=nlapiCreateFile('SurveyResults.csv', 'CSV', report);
		file.setFolder('19477');
		var fileId = nlapiSubmitFile(file);
		nlapiLogExecution("Debug",'fileId',fileId);
	}
    
	
	
	
}
