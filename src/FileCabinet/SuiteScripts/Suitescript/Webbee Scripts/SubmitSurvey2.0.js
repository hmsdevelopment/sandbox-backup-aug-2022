/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/url','N/https','N/search','N/log','N/file','N/record'],

function(url,https,search,log,file) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function sendSurvey(context) {
    	//function sendSurvey(request, response){
    		try{
    		//if(request.getMethod()=='GET'){
    			log.debug("22");
    			if(context.request.method=='GET'){
    			var survey_html=''
    				var message='Please  Answer the Following Questions';
         log.debug("26")
    		
    			var caseid=context.request.parameters.query;
    		log.debug({title:'caseid',details:caseid})
    			if(caseid){
    			
    			var builder_id=search.lookupFields({
    				type:search.Type.SUPPORT_CASE,
    				id:caseid,
    				columns:'company'
    			})
    			
    			builder_id = builder_id.company[0].value
    			log.debug({
    				title:'builderid', 
    				details:builder_id
    			});
    			
    			var answer_file=file.load({id:'36451'})
                 log.debug({
                	 title:'answer_file',
                	 details:answer_file
                 })
    			var data=answer_file.getContents();
    			 log.debug({
                	 title:'data',
                	 details:data
                 })
 			//var builder_id='3642';
    			
    			
log.debug('57')
                 
                 var searchRcd = search.create({
   type: "customrecord429",
   filters:
   [
      ["custrecord_default_survey","is","T"], 
     'AND', 
      ["custrecord67","anyof",builder_id]
   ],
   columns:
   [
      search.createColumn({name: "internalid", label: "Internal ID"}),
      search.createColumn({name: "custrecord68", label: "Questions"}),
      search.createColumn({name: "custrecord_survey_published", label: "Published"}),
      search.createColumn({name: "custrecord_default_survey", label: "Default"})
   ]
});
    		log.debug('75')	 
    		   //   search.createColumn({name: "custrecord_default_survey", label: "Default"})
    			     			 log.debug('searchRcd ',searchRcd );
var searchResultCount = searchRcd.runPaged().count;
log.debug("searchRcd result count",searchResultCount);
var searchRcdRun = searchRcd.run();
var result = searchRcdRun.getRange({start:0,end:1})
log.debug('result ',result );
log.debug("Record Length----1",result.length )

    		if(result !=null  && result.length>0){
    			 var survey_id=result[0].getValue({name:"internalid"});
              log.debug("survey_id ",survey_id )
    			log.debug('91')
    			survey_html +='<input type="hidden" class="survey" value="'+survey_id+'">'
    			 log.debug('93')
    			 survey_html +='<input type="hidden" class="s_case" value="'+caseid+'">'
    
    			 
    			var questions1=result[0].getValue({name:'custrecord68'});
    			 
    			 log.debug({title:'questions1',details:questions1})
    			 
    			var is_publish=result[0].getValue({name:'custrecord_survey_published'});
    			 
    			var is_default=result[0].getValue({name:'custrecord_default_survey'});
    			
    			log.debug({title: 'is_publish',details: is_publish});
    			
    			
    			log.debug({title: 'is_default',details: is_default});
    	
    			var search_survey=search.create({
    				type:'customrecord430',
    				filters:[
 ['custrecord_survey_ques','anyof',survey_id],"AND",['custrecord_survey_case','anyof',caseid]
 
    				         ],
    				        })
    				        var search_surveyCount = search_survey.runPaged().count;
log.debug("searchRcd result count",searchResultCount);

var search_survey = search_survey.run();
var search_surveyResult = search_survey.getRange({start:0,end:1})
    				        log.debug({
                	 title:'search_surveyResult',
                	 details:search_surveyResult
                 })
    			if(search_surveyResult!=null)
    			{log.debug('123')
    				message='You have already submitted this Survey!!'
    					log.debug('message'+message)
    			}
    			
    		
    			questions=JSON.parse(questions1);
    			log.debug('questions130')
    			var questions=questions.Questions;
    			log.debug('questions132')
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
    			log.debug('221')
    			context.response.write(data);
    			log.debug('223')
    		}else{
    			//response.write("No Survey Found");
    			log.debug('227')
    			context.response.write( 'No Survey Found')
    		}}else{
    			//response.write("Provide case id");
    			log.debug('231')
    			context.response.write('Provide case id')
    		}}
    		else{
    			log.debug('234')
    			var caseid=context.request.parameters.case_id;
    			
    			var property=search.lookupFields({
    			type:search.Type.SUPPORT_CASE,
    			id:caseid,
    			columns:'custevent_property'
    			})
    			
    		
    			var survey_id=context.request.parameters.survey;
    
    			var answers=context.request.parameters.message
    			
    			var search_survey=search.create({
    				type:'customrecord430',
    			     filters:[
    			              ['custrecord_survey_ques','anyof',survey_id],"AND",['custrecord_survey_case','anyof',caseid]
    			              ],
    			columns:[
    			         search.createColumn({
    			        	 name:'internalid',
    			        	 sort: search.Sort.ASC
    			         }),
    			         search.createColumn({
    			        	 name:'custrecord68'
    			         }),
    			         search.createColumn({
    			        	 name:'custrecord_survey_published'
    			         }),
    			         search.createColumn({
    			        	 name:'custrecord_default_survey'
    			         }),
    			         ],
    			});
    		    var search_surveyCount = search_survey.runPaged().count;
    		    log.debug("searchRcd result count",searchResultCount);

    		    var search_survey = search_survey.run();
    		    var search_surveyResult = search_survey.getRange({start:0,end:1})
    		        				        log.debug({
    		                    	 title:'search_surveyResult',
    		                    	 details:search_surveyResult})
    			if(search_surveyResult==null)
    			{
    				
    				var rec=record.create({
    					type:'customrecord430'
    				})
    				rec.setValue({fieldId:'custrecord_survey_case',value: caseid});
    				rec.setValue({fieldId:'custrecord_survey_ques',value: survey_id});
    				rec.setValue({fieldId:'custrecord_survey_ans', value:answers});
    				rec.setValue({fieldId:'custrecord_survey_property', value:property});
    				
    				rec.save({
    					   ignoreMandatoryFields: false
    				})
    			}
//    			else{
//    				nlapiSubmitField('customrecord430', search_survey[0].getId(), 'custrecord_survey_ans',answers );
//    			}
    			
    			var url='https://1309901.app.netsuite.com/core/media/media.nl?id=38061&c=1309901&h=976b9565434f64b7c735';
    			context.response.write(url);
    		}
    		}catch(e){
    			log.debug('error',e)
    			context.response.write(e);
    		}
    	//}
    }

    return {
        onRequest: sendSurvey
    };
    
});
