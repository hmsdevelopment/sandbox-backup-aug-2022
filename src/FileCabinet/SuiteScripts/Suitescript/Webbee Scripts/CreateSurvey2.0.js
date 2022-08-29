/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file','N/search','N/log','N/record','N/url'],

function(file,search,log,recordAll,url) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function surveyPage(context) {
    	//function surveyPage(request, response){
    		try{
    		var survey_file=file.load({
    			id:'36449'
    		});
    		
    		var htmlText='';
    		var formTitle='Create New Survey';
    		
    		log.debug({
    			title:'method',
    			details:context.request.method
    		});
    		 var callback =context.request.parameters.callback
    	        log.debug({title:'callback ',details:callback })
    	        
       	if(context.request.method=='GET' && callback=='false'){
    	var builder=context.request.parameters.builderid
    			   		log.debug({
    	    			title:'builder_get',
    	    			details:builder
    	    		});
    		builder=builder/103;
    		if(builder){
    			
    		var search_builder=search.create({
    				type:search.Type.ENTITY,
    				filters:[
    				         search.createFilter({
    				        	 name:'internalid',
    				        	 operator:'is',
    				        	 values:builder
    				        	 
    				         })
    				         ]
    				});
    			var searchResultCount = search_builder.runPaged().count;
    			var searchBuilderRun = search_builder.run();
    			var searchBuilderResult = searchBuilderRun.getRange({start:0,end:1})
             
    			log.debug("Record Length----1",searchBuilderResult .length )
    			log.debug( {title:'searchBuilderResult ',
    				details: searchBuilderResult });
    			if(searchBuilderResult !=null){
    			var builder_html='<input type="hidden" class="builder" value="'+builder+'">'
    			
    		var searchRcd = search.create({
    			type:'customrecord429',
    			filters:[
    			         ["custrecord67","anyof",builder]
    			        
    			        ],
         		columns:
    			   [
    			      search.createColumn({name: "internalid", label: "Internal ID"}),
    			      search.createColumn({name: "custrecord68", label: "Questions"}),
    			      search.createColumn({name: "custrecord_survey_published", label: "Published"}),
    			      search.createColumn({name: "custrecord_default_survey", label: "Default"})
    			   ]
    		});
    			var searchResultCount = searchRcd.runPaged().count;
    			var searchRcdRun = searchRcd.run();
    			var searchRcdResult = searchRcdRun.getRange({start:0,end:1})

    			log.debug("Record Length----2",searchRcdResult.length )
    			log.debug( {title:'searchRcdResult ',
    				details: searchRcdResult });

    			
    		var questions={};
    		if(searchRcdResult !=null){
    			
    			var questions1=searchRcdResult[0].getValue({name:'custrecord68'});
    			var is_publish=searchRcdResult[0].getValue({name:'custrecord_survey_published'});
    			var is_default=searchRcdResult[0].getValue({name:'custrecord_default_survey'});
    			if(is_publish=='F'&&is_default=='F'){
    				log.debug({title:'is_publish',details:is_publish});
    				log.debug({title:'is_publish',details:is_default});
    				formTitle='Customize Your Real Estate Agent Survey Here';
    			}
    			
//    			nlapiLogExecution('DEBUG', 'questions', questions1);
    		log.debug({title: 'questions1',details: questions1});
    			questions=JSON.parse(questions1);
    			 questions=questions.Questions;
    	   }else{
    		   try{
    		   
    		   var questions1=search.lookupFields({
    			  type: 'customrecord429',
    			  id: '26',
    			  columns:'custrecord68'
    		   });
    			questions=JSON.parse(questions1);
    			 questions=questions.Questions;
    	   }catch(ef){
    		   questions={};
    		   log.debug({title: 'error',details: ef});
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
    		
    		var data=survey_file.getContents();
    	data=data.replace('previousQuestions', htmlText);
    	data=data.replace('HeaderTitle', formTitle);
    	data=data.replace('builder',builder_html);
    	context.response.write(data);
    		}else{
    			context.response.write("Invalid Builder");
    		}
    	}else{
    		context.response.write("Builder Id Missing");
    	
    	}}else{ //post call
    		
    		log.debug({title:'enter in postcall'})
    		var message=context.request.parameters.message;
    		var publish=context.request.parameters.publish;
    		var builder=context.request.parameters.builder;
    	   	
    	var searchRcrd =search.create({
    		type:'customrecord429',
    		filters:[
    		         ["custrecord67","is",builder]
    		         
    		         ],
    		         columns:
    	    			   [
    	    			      search.createColumn({name: "internalid", label: "Internal ID"}),
    	    			      search.createColumn({name: "custrecord68", label: "Questions"}),
    	    			      search.createColumn({name: "custrecord_survey_published", label: "Published"}),
    	    			      search.createColumn({name: "custrecord_default_survey", label: "Default"})
    	    			   ]
    	})
    	
   var srchResltCount1 = searchRcrd.runPaged().count;
    var searchRcrdRun = searchRcrd.run();
	var searchRcrdResult = searchRcrdRun .getRange({start:0,end:1})



	log.debug( {title:'searchRcrd',
		details: searchRcrdResult});
    	if(searchRcrdResult !=null){
    			var id=searchRcrdResult[0].id;
    			var is_publish=searchRcrdResult [0].getValue({name:'custrecord_survey_published'});
    			var is_default=searchRcrdResult [0].getValue({name:'custrecord_default_survey'});
    			log.debug({title: 'is_publish_post',details: is_publish});
    		log.debug({title: 'is_default_post',details: is_default});
    			if((is_publish == true)&&(is_default==true)){
    				
    				log.debug({
    					title:'in If 1'
    				})
    				if(publish=='F'){
    					is_publish='F';
    					is_default='F'
    				}else{
    					unckeckDefault(builder);
    				}
    				var new_id=createNewSurvey(builder,message,is_publish,is_default)
    			}else if(is_publish=='F'&&is_default=='F'){
    				
    				log.debug({title:'in If 2'})
    				if(publish=='T'){
    					unckeckDefault(builder);
    				
    				record.submitFields({
    					type:'customrecord429',
    					id:id,
    					values:{'custrecord_survey_published': 'T'},
    					enableSourcing:true
    				}),
    				
    				record.submitFields({
    					type:'customrecord429',
    					id:id,
    					values:{'custrecord_default_survey':'T'},
    					enableSourcing:true
    				})
    			}
    				record.submitFields({
    					type:'customrecord429',
    					id:id,
    					values:{'custrecord68':message}
    				
    				})
    			}else {
    				   if(publish=='F'){
    						var is_publish='F';
    						var is_default='F';
    					}else{
    						var is_publish='T';
    						var is_default='T';
    					}
    				
    					var new_id=createNewSurvey(builder,message,is_publish,is_default);
    					log.debug({title:'new_id 1',details:new_id})
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
    			log.debug({title:'new_id 2',details:new_id})
    			}

    	
    	
    	builder=builder*103;
    	url+="&h=f04f0c913ec113f0585b&builderid="+builder;
    	context.response.write("callback({ret:'"+url+"'})");

    	}
    		
    		
    	}catch(e){
    		
    		context.response.write('error'+e );
			   
    	}

    	}
    	function createNewSurvey(builder,message,is_publish,is_default){
    		log.debug('enter in createNewSurvey')
    		var rec=recordAll.create({
    			type:'customrecord429'
    		})
    		
    		if(is_publish=='T')
    			{
    			is_publish=true
    			}
    		else
    			{
    			is_publish=false
    			}
    		
    		
    		if(is_default=='T')
			{
    			is_default=true
			}
		else
			{
			is_default=false
			}
    		rec.setValue({fieldId:'custrecord68',value: message});
    		rec.setValue({fieldId:'custrecord67',value: builder});
    		rec.setValue({fieldId:'custrecord_survey_published',value: is_publish});
    		rec.setValue({fieldId:'custrecord_default_survey',value: is_default});

    		
    		var id= rec.save({
    		    enableSourcing: false,
    		    ignoreMandatoryFields: true
    		});
    		log.debug({title:'createNewSurvey',details:JSON.stringify(id)})
    		log.debug('end in createNewSurvey')
    		return id;
    	}
    	function unckeckDefault(builder){
    	log.debug('enter in unckeckDefault ()')
    		var searchRcd =search.create({
    			type:'customrecord429',
    			filters:[
            ['custrecord67','anyof',builder],"AND",['custrecord_default_survey','is','T']
    			        ],
    			        columns:[
    			                 search.createColumn({name:'internalid'})
    			                 ]
    	
    		});
    		var searchResultCount = searchRcd.runPaged().count;
			var searchRcdRun = searchRcd.run();
			var searchRcdResult = searchRcdRun.getRange({start:0,end:1})
        	log.debug("Record Length----2",searchRcdResult.length )
			log.debug( {title:'searchRcdResult ',
				details: searchRcdResult });
			var a = searchRcdResult[0].getValue({name:'internalid'})
			log.debug('a value',a)
    		if(searchRcdResult !=null){
    			for(var i=0;i<searchRcdResult.length;i++){
    				log.debug('i value:'+i,searchRcdResult[i].id)
    				log.debug('record:'+i,typeof recordAll + "| "+ JSON.stringify(recordAll))
    				recordAll.submitFields({
    					type:'customrecord429',
    					id:searchRcdResult[i].id,
    					values:{'custrecord_default_survey': 'F'}
    				
    				})
    			}
    		}
    		log.debug('end  of unckeckDefault ()')
    	//}
    }

    return {
        onRequest: surveyPage
    };
    
});
