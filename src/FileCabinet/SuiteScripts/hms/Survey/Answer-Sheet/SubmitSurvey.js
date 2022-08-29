/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Nov 2017     Admin
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function sendSurvey(request, response){
	try{
	if(request.getMethod()=='GET'){
		var survey_html=''
			var message='Please  Answer the Following Questions';
//		var builder_id=request.getParameter('builderid');
		var caseid=request.getParameter('query');
		if(caseid){
		var builder_id=nlapiLookupField('supportcase', caseid, 'company');
		nlapiLogExecution('DEBUG', 'builderid', builder_id);
		var answer_file=nlapiLoadFile('36451');
		var data=answer_file.getValue();
//		var builder_id='3642';
		
			var columns=[];
		columns.push(new nlobjSearchColumn('internalid').setSort(true));
		columns.push(new nlobjSearchColumn('custrecord68'));
		columns.push(new nlobjSearchColumn('custrecord_survey_published'));
		columns.push(new nlobjSearchColumn('custrecord_default_survey'));
		var filter=[];
		filter.push( new nlobjSearchFilter('custrecord_default_survey',null,'is','T'));
		filter.push( new nlobjSearchFilter('custrecord67',null,'anyof',builder_id));
	var search=nlapiSearchRecord('customrecord429', null, filter, columns);
	if(search!=null){
		 survey_html+='<input type="hidden" class="survey" value="'+search[0].getId()+'">'
		 survey_html+='<input type="hidden" class="s_case" value="'+caseid+'">'
		nlapiLogExecution('DEBUG', 'search', search[0].getId());
		 var survey_id=search[0].getId();
		var questions1=search[0].getValue('custrecord68');
		var is_publish=search[0].getValue('custrecord_survey_published');
		var is_default=search[0].getValue('custrecord_default_survey');
		nlapiLogExecution('DEBUG', 'is_publish', is_publish);
		nlapiLogExecution('DEBUG', 'is_default', is_default);
		var search_survey=nlapiSearchRecord('customrecord430', null, [['custrecord_survey_ques','anyof',survey_id],"AND",['custrecord_survey_case','anyof',caseid]])
		if(search_survey!=null)
		{
			message='You have already submitted this Survey!!'
		}
		nlapiLogExecution('DEBUG', 'questions', questions1);
		questions=JSON.parse(questions1);
		var questions=questions.Questions;
		var htmlText = '';

		for ( var key in questions ) {
			htmlText += '<div class="qstn-blck-wrap block clearfix">';
			htmlText +=					'<div class="ques-num">Question ' + questions[key].id + '</div>';
			htmlText +=			'<div class="form-wrap" data-tab="' + questions[key].answerType + '">';
			htmlText +=				'<div class="question-block">';

			htmlText +=					'<h4 class="question">' + questions[key].questiontext + '</h4>';
			htmlText +=				'</div>';
			htmlText +=				'<div class="answer-block">';


			htmlText +=					'<div class="para-type-ans';
			if(questions[key].answerType == 'para-type-ans'){
				htmlText += ' visible';
			}

			htmlText +=							'">';
			htmlText +=						'<textarea></textarea>';
			htmlText +=					'</div>';


			htmlText +=					'<div class="multiple-type-ans';
			if(questions[key].answerType == 'multiple-type-ans'){
				htmlText += ' visible';
			}
			htmlText +=	 '">';
			htmlText +=						'<ul class="multiple-list">';
			for(i=0 ;i<questions[key].options.length;i++) {
				htmlText +=							'<li class="option-li">';
				htmlText +=								'<input type="checkbox" name="check'+questions[key].id+'" id="check'+ i + questions[key].id +'" value="' + questions[key].options[i] +'">';
				htmlText +=								'<label for="check'+ i + questions[key].id +'">' + questions[key].options[i] +'</label>';
				htmlText +=							'</li>';
			}
			
			htmlText +=						'</ul>';
			htmlText +=					'</div>';


			htmlText +=					'<div class="option-type-ans';
			if(questions[key].answerType == 'option-type-ans'){
				htmlText += ' visible';
			}
			htmlText +=	'">';
			htmlText +=						'<ul class="option-list">';
			for(i=0 ;i<questions[key].options.length;i++) {
				htmlText +=							'<li class="option-li">';
				htmlText +=								'<input type="radio" name="radio'+questions[key].id+'" id="radio'+ i + questions[key].id +'" value="' + questions[key].options[i] +'">'; 
				htmlText +=								'<label for="radio'+ i + questions[key].id +'">' + questions[key].options[i] +'</label>';
				htmlText +=							'</li>';
			}
			htmlText +=						'</ul>';
			htmlText +=					'</div>';


			htmlText +=				'</div>';
			htmlText +=			'</div>';
			htmlText +=			'<div class="ans-type" style="display:none;">';
			htmlText +=				'<h3>Answer Type</h3>';


			htmlText +=				'<span class="para-type';
			if(questions[key].answerType == 'para-type-ans'){
				htmlText += ' active';
			}
			htmlText += '" data-tab="para-type-ans"><i class="fa fa-align-left"></i> Paragraph</span>';


			htmlText +=				'<span class="multi-type';
			if(questions[key].answerType == 'multiple-type-ans'){
				htmlText += ' active';
			}
			htmlText +=	'" data-tab="multiple-type-ans"><i class="fa fa-sort-amount-asc" aria-hidden="true"></i> Multiple Chioce</span>';

			htmlText +=				'<span class="option-type';
			if(questions[key].answerType == 'option-type-ans'){
				htmlText += ' active';
			}
			htmlText +='" data-tab="option-type-ans"><i class="fa fa-check" aria-hidden="true"></i> Single Choice</span>';

			htmlText +=			'</div>';
			htmlText +=		'</div>';

		}
		data=data.replace('htmlText', htmlText);
		data=data.replace('Surveyid', survey_html)
		data=data.replace('msg', message);
		response.write(data);
	}else{
		response.write("No Survey Found");
	}}else{
		response.write("Provide case id");
	}}else{
		var caseid=request.getParameter('case');
		var property=nlapiLookupField('supportcase', caseid, 'custevent_property');
		var survey_id=request.getParameter('survey');
		var answers=request.getParameter('message');
		var search_survey=nlapiSearchRecord('customrecord430', null, [['custrecord_survey_ques','anyof',survey_id],"AND",['custrecord_survey_case','anyof',caseid]], columns)
		if(search_survey==null)
		{
			var rec=nlapiCreateRecord('customrecord430');
			rec.setFieldValue('custrecord_survey_case', caseid);
			rec.setFieldValue('custrecord_survey_ques', survey_id);
			rec.setFieldValue('custrecord_survey_ans', answers);
			rec.setFieldValue('custrecord_survey_property', property);
			nlapiSubmitRecord(rec, null, true);
		}
//		else{
//			nlapiSubmitField('customrecord430', search_survey[0].getId(), 'custrecord_survey_ans',answers );
//		}
		
		var url='https://1309901.app.netsuite.com/core/media/media.nl?id=38061&c=1309901&h=976b9565434f64b7c735';
		response.write(url);
	}
	}catch(e){
		response.write(e);
	}
}
