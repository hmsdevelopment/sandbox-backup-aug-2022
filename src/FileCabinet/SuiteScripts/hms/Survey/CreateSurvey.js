/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Nov 2017     Admin
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function surveyPage(request, response){
	try{
	var survey_file=nlapiLoadFile('36449')
	var htmlText='';
	var formTitle='Create Survey';
	nlapiLogExecution('DEBUG', 'method', request.getMethod());
        var callback = request.getParameter('callback');
if(request.getMethod()=='GET' && !callback){
	var builder=request.getParameter('builderid');
  
  
	nlapiLogExecution('DEBUG', 'builder_get', builder);
	builder=builder/103;
	if(builder){
		var search_builder=nlapiSearchRecord('entity', null, ['internalid','is',builder]);
		nlapiLogExecution('DEBUG', 'search_builder', search_builder);
		if(search_builder!=null){
		var builder_html='<input type="hidden" class="builder" value="'+builder+'">'
		var columns=[];
		columns.push(new nlobjSearchColumn('internalid').setSort(true));
		columns.push(new nlobjSearchColumn('custrecord68'));
		columns.push(new nlobjSearchColumn('custrecord_survey_published'));
		columns.push(new nlobjSearchColumn('custrecord_default_survey'));
	var search=nlapiSearchRecord('customrecord429', null, ['custrecord67','anyof',builder], columns);
	var questions={};
	if(search!=null){
		
		var questions1=search[0].getValue('custrecord68');
		var is_publish=search[0].getValue('custrecord_survey_published');
		var is_default=search[0].getValue('custrecord_default_survey');
		nlapiLogExecution('DEBUG', 'is_publish', is_publish);
		nlapiLogExecution('DEBUG', 'is_default', is_default);
		
      
//		nlapiLogExecution('DEBUG', 'questions', questions1);
		
		questions=JSON.parse(questions1);
		 questions=questions.Questions;
   }else{
	   try{
	   var questions1=nlapiLookupField('customrecord429', '57', 'custrecord68');
		questions=JSON.parse(questions1);
		 questions=questions.Questions;
       // if(is_publish=='F'&&is_default=='F'){
       //if((is_publish)&&(is_default)){
       formTitle='Customize Your Real Estate Agent Survey Here';
     //}
   }catch(ef){
	   questions={};
	   nlapiLogExecution('DEBUG', 'ef', ef);
   }
 
	}
		var count=0;
		
		for ( var key in questions ) {
			count++;
          
			htmlText += '<div class="qstn-blck-wrap block clearfix" id="qstn-blck-wrap'+ count +'">';
			htmlText +=   '<input type="hidden" class="idd" value="'+ count +'">'
			htmlText +=					'<div class="ques-num">Question '+ count +'</div>';
			htmlText +=			'<div class="form-wrap" data-tab="' + questions[key].answerType + '">';
			htmlText +=				'<div class="question-block">';
			htmlText +=					'<input type="text" name="" class="question" id="question" placeholder="your question" value="' + questions[key].questiontext + '">';
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
			htmlText +=								'<input type="checkbox" name="check'+questions[key].id+'">';
			htmlText +=								'<input type="text" name="" value="' + questions[key].options[i] +'">';
			htmlText +=	                            '<a href="javascript:void(0);" class="remove-entry">Remove</a>';
			htmlText +=							'</li>';
			}
			
			htmlText +=						'</ul>';
			htmlText +=						'<a href="javascript:void(0)" class="more-options">more options</a>';
			htmlText +=					'</div>';


			htmlText +=					'<div class="option-type-ans';
if(questions[key].answerType == 'option-type-ans'){
htmlText += ' visible';
}
			htmlText +=	'">';
			htmlText +=						'<ul class="option-list">';
			for(i=0 ;i<questions[key].options.length;i++) {
			htmlText +=							'<li class="option-li">';
			htmlText +=								'<input type="radio" name="radio'+questions[key].id+'" value="Yes">'; 
			htmlText +=								'<input type="text" name="" value="' + questions[key].options[i] +'">';
			htmlText +=	                            '<a href="javascript:void(0);" class="remove-entry">Remove</a>';
			htmlText +=							'</li>';
			}

			htmlText +=						'</ul>';
			htmlText +=						'<a href="javascript:void(0)" class="more-options">more options</a>';
			htmlText +=					'</div>';


			htmlText +=				'</div>';
			htmlText +=			'</div>';
			htmlText +=			'<div class="ans-type">';
			htmlText +=				'<h3>Select Answer Type</h3>';


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
			htmlText +=			'<a href="javascript:void(0)" class="remove-block"><i class="fa fa-trash" aria-hidden="true"></i></a>';
			htmlText +=		'</div>';

		}
	
	var data=survey_file.getValue();
data=data.replace('previousQuestions', htmlText);
data=data.replace('HeaderTitle', formTitle);
data=data.replace('builder',builder_html);
	response.write(data);
	}else{
		response.write("Invalid Builder");
	}
}else{
	response.write("Builder Id Missing");
}}else{ //post call
	var message=request.getParameter('message');
	var publish=request.getParameter('publish');
	var builder=request.getParameter('builder');
	nlapiLogExecution('DEBUG', 'publish', publish);
	
	var columns=[];
	columns.push(new nlobjSearchColumn('internalid').setSort(true));
	columns.push(new nlobjSearchColumn('custrecord68'));
	columns.push(new nlobjSearchColumn('custrecord_survey_published'));
	columns.push(new nlobjSearchColumn('custrecord_default_survey'));
var search=nlapiSearchRecord('customrecord429', null, ['custrecord67','anyof',builder], columns);
if(search!=null){
		var id=search[0].getId();
		var is_publish=search[0].getValue('custrecord_survey_published');
		var is_default=search[0].getValue('custrecord_default_survey');
		nlapiLogExecution('DEBUG', 'is_publish_post', is_publish);
		nlapiLogExecution('DEBUG', 'is_default_post', is_default);
		if(is_publish=='T'&&is_default=='T'){
			nlapiLogExecution('DEBUG', 'in If 1');
			if(publish=='F'){
				is_publish='F';
				is_default='F'
			}else{
				unckeckDefault(builder);
			}
			var new_id=createNewSurvey(builder,message,is_publish,is_default)
		}else if(is_publish=='F'&&is_default=='F'){
			nlapiLogExecution('DEBUG', 'in If 2');
			if(publish=='T'){
				unckeckDefault(builder);
			nlapiSubmitField('customrecord429', id, 'custrecord_survey_published', 'T');
			nlapiSubmitField('customrecord429', id, 'custrecord_default_survey', 'T');
			}
			nlapiSubmitField('customrecord429', id, 'custrecord68', message);
		}else {
			   if(publish=='F'){
					var is_publish='F';
					var is_default='F';
				}else{
					var is_publish='T';
					var is_default='T';
				}
			
				var new_id=createNewSurvey(builder,message,is_publish,is_default);
			}
   }else{
	   if(publish=='F'){
			var is_publish='F';
			var is_default='F';
		}else{
			var is_publish='T';
			var is_default='T';
		}
	
		var new_id=createNewSurvey(builder,message,is_publish,is_default);
		}
var url=nlapiResolveURL('SUITELET', 'customscript_survey_ui','1');
builder=builder*103;
url+="&h=f04f0c913ec113f0585b&builderid="+builder;
response.write("callback({ret:'"+url+"'})");

}
	
	
}catch(e){
	response.write(e);
}

}
function createNewSurvey(builder,message,is_publish,is_default){
	var rec=nlapiCreateRecord('customrecord429');
	rec.setFieldValue('custrecord68', message);
	rec.setFieldValue('custrecord67', builder);
	rec.setFieldValue('custrecord_survey_published', is_publish);
	rec.setFieldValue('custrecord_default_survey', is_default);
	var id=nlapiSubmitRecord(rec);
	return id;
}
function unckeckDefault(builder){
	var search=nlapiSearchRecord('customrecord429', null,[ ['custrecord67','anyof',builder],"AND",['custrecord_default_survey','is','T']]);
	if(search!=null){
		for(var i=0;i<search.length;i++){
			nlapiSubmitField('customrecord429', search[i].getId(), 'custrecord_default_survey', 'F')
		}
	}

}