/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file','N/search','N/http'],

function(file,search,http) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function GetSurveyReport(context) {
    	if(context.request.method =='GET'){
    			var report='';
    			var survey_id=context.request.parameters.survey_id;
    			
    			try{
    			var search_surveys=search.create({
    				type:'customrecord430', 
    				 filters:[
				                 search.createFilter({
				                	name:'custrecord_survey_ques',
				                	operator:'is',
				                	values:survey_id
				                 }),
				                 ],
    				columns:[
    				         search.createColumn({
    				        	 name:'custrecord_survey_ans'
    				         }),
    				         search.createColumn({
    				        	 name:'custrecord_survey_case'
    				         }),
    				        ]
    				       
    			});
    			 var search_surveyCount = search_surveys.runPaged().count;
    			 var search_survey = search_surveys.run();
    			 var search_surveyResult = search_survey.getRange({start:0,end:1})
    			     				        log.debug({
    			                 	 title:'search_surveyResult',
    			                 	 details:search_surveyResult
    			                  })
    			}
    			catch(e){
    				log.debug('error',e)
    			}
    		if(search_surveyResult!=null){
    			report+='Questions\n';
    			var questions= search.lookupFields({
    			    type:'customrecord429',
    			    id: survey_id,
    			    columns: 'custrecord68'
    			});
    			log.debug({
    				title:'1. questions @@',
    				details:questions
    			});
    			
    			questions=questions["custrecord68"]
    			log.debug({
    				title:'2. questions @@',
    				details:questions
    			});

    			questions=JSON.parse(questions)
    		
    			 var ques =questions["Questions"];
    			 log.debug("ques ",ques )
    			
                 var quesLen = ques.length
                 log.debug({title:'quesLen ',details:quesLen })
             
             for(var i=0;i<quesLen;i++){
    				report+='Q'+(i+1)+':'+ques[i]['questiontext']+'\n';
    				}
    			report+='\nCase';
    			
    			for(var j=0;j<quesLen;j++){
    					report+=',Q'+(j+1);
    				}
    			report+='\n';
    			
    		
    			for(var t=0;t<search_surveyResult.length;t++){
    			try{
    				var caseid=search_surveyResult[t].getValue({
    					name:'custrecord_survey_case'});
    				
    				var answers_str=search_surveyResult[t].getValue({
    					name:'custrecord_survey_ans'});
    				    				
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
    					log.debug('exit from try function 1')
    			}
    			catch(e){
    				log.debug('exit from try function 2')
    				log.debug('error',e)
    			}}
    			
    			
    			var fileCreate=file.create({
    				name:'Survey.csv',
    				fileType:file.Type.CSV,
    				contents:report
    			});
    			    			  
    			context.response.writeFile({
    			    file: fileCreate,
    			    isInline: true
    			});
    			
   		}else{
    			
    			context.response.write("No result found")
    		}
    		}

    	
    }

    return {
        onRequest: GetSurveyReport
    };
    
});
