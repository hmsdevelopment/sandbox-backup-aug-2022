/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(["N/search", "N/record", "N/http", "N/ui/serverWidget", "N/url", "N/file"],

function(search, record, http, ui, url, file) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	var surveyid = context.request.parameters.surveyid;
    	var exportCsv = (context.request.parameters.csv=="T") ? true : false;
    	
    	if(surveyid){
   			handleSurveyResults(context,surveyid, exportCsv);
    	}else{
    		handleBuilderList(context);
    	}
    	
    }
    
    function handleSurveyResults(context, surveyid, exportCsv){
    	
    	if(exportCsv){
    		var csvFile = createResultsCsv(context, surveyid);
    		
    		if(csvFile){
    			context.response.writeFile(csvFile);
    		}else{
    			context.response.write("No Data to Export");
    		}
    	}else{
    		var surveyList = createResultsForm(context, surveyid);
    		generateResultsList(context, surveyid, surveyList);
    		context.response.writePage(surveyList);
    	}
    }
    
    function createResultsForm(context, surveyid){
    	var surveyList = ui.createList({title: "Survey Results"});
    	
    	surveyList.addPageLink({
            type: ui.FormPageLinkType.BREADCRUMB,
            title: "Return to Builder Surveys",
            url: "/app/site/hosting/scriptlet.nl?script=461&deploy=1"
        });
    	
    	surveyList.addPageLink({
            type: ui.FormPageLinkType.CROSSLINK,
            title: "Generate CSV",
            url: "/app/site/hosting/scriptlet.nl?script=461&deploy=1&surveyid="+surveyid+"&csv=T"
        });
    	
    	surveyList.addColumn({
            id: "custrecord_survey_case",
            type: ui.FieldType.URL,
            label: "Case"
        }).setURL({
            url: url.resolveRecord({
                recordType: search.Type.SUPPORT_CASE
            })
        }).addParamToURL({
            param: "id",
            value: "custrecord_survey_case",
            dynamic: true
        });

    	surveyList.addColumn({
            id: "custrecord_survey_property",
            type: ui.FieldType.URL,
            label: "Property"
        }).setURL({
            url: url.resolveRecord({
                recordType: "customrecord_property_record"
            })
        }).addParamToURL({
            param: "id",
            value: "custrecord_survey_property",
            dynamic: true
        });
    	
    	surveyList.addColumn({
          id: "housenumber",
          type: ui.FieldType.TEXT,
          label: "House Number"
        });
    	
    	surveyList.addColumn({
            id: "street",
            type: ui.FieldType.TEXT,
            label: "Street"
        });
    	
    	surveyList.addColumn({
            id: "subdivision",
            type: ui.FieldType.URL,
            label: "Subdivision"
        }).setURL({
            url: url.resolveRecord({
                recordType: "customrecord_subdivision"
            })
        }).addParamToURL({
            param: "id",
            value: "subdivisionid",
            dynamic: true
        });
    	
    	surveyList.addColumn({
            id: "lotnumber",
            type: ui.FieldType.TEXT,
            label: "Lot Number"
        });
    	    	
    	var builderQuestions = getBuilderQuestions(surveyid);
    	var questionIndex = 1;
    	
    	for(i in builderQuestions.Questions){
    		var question = builderQuestions.Questions[i];
    		
    		surveyList.addColumn({
                id: "question_"+questionIndex,
                type: ui.FieldType.TEXT,
                label: question.questiontext
            });
    		
    		questionIndex++;
    	}
    	
    	return surveyList;
    	
    }
    
    function getBuilderQuestions(surveyid){
    	var builderSurvey = record.load({
    		type:'customrecord429',
    		id:surveyid
    	});
    	
    	var builderQuestions = JSON.parse(builderSurvey.getValue("custrecord68"));
    	
    	return builderQuestions;
    }

    function createResultsSearch(surveyid){
    	var searchObj = search.create({
 		   type: "customrecord430",
 		   filters:
 		   [
 		      ["custrecord_survey_ques","anyof",surveyid]
 		   ],
 		   columns:
 		   [
 		      search.createColumn({name: "custrecord_survey_case", label: "Case"}),
 		      search.createColumn({name: "custrecord_survey_property", label: "Property"}),
 		      search.createColumn({name: "custrecord_survey_ans", label: "Survey Answer"})
 		      
 		   ]
 		});
 	
 		var searchResultCount = searchObj.runPaged().count;
 		log.debug("Survey Results Found",searchResultCount);
 		
 		return searchObj;
    	
    }
    
    function getPropertyDetails(propertyId){
    	return search.lookupFields({
    	    type: "customrecord_property_record",
    	    id: propertyId,
    	    columns: ['custrecord_house_number', 
    	              'custrecord31', 
    	              'custrecordcustrecordsubdname.custrecord_subdivision_id', 
    	              'custrecordcustrecordsubdname.internalid',
    	              'custrecord_lot_number']
    	})
    }
    
    function generateResultsList(context, surveyid, surveyList){
    	log.audit("Generate Results List", "Start");
    	createResultsSearch(surveyid).run().each(function(result){
    		var objRow = {};
    		var propertyId = result.getValue("custrecord_survey_property");
    		var objPropertyDetails = getPropertyDetails(propertyId);
			
			objRow["custrecord_survey_case"] = result.getValue("custrecord_survey_case");
			objRow["custrecord_survey_property"] = propertyId;
			objRow["housenumber"] = objPropertyDetails["custrecord_house_number"];
			objRow["street"] = objPropertyDetails["custrecord31"];
			objRow["subdivision"] = objPropertyDetails["custrecordcustrecordsubdname.custrecord_subdivision_id"];
			objRow["subdivisionid"] = objPropertyDetails["custrecordcustrecordsubdname.internalid"];
			objRow["lotnumber"] = objPropertyDetails["custrecord_lot_number"];
			
			var rawAnswer = result.getValue("custrecord_survey_ans");
			
			try{
				var objAnswers = JSON.parse(rawAnswer);
				var answerIndex = 1;
				
				for(i in objAnswers){
		    		var answer = objAnswers[i];
		    		var answerText = getAnswerText(answer);
		    		
		    		objRow["question_"+answerIndex] = answerText;
		    		
		    		answerIndex++;
		    	}

				surveyList.addRow({row : objRow});
				
			}catch(e){
				log.error(e.name, e.message);
				log.debug("Survery Info", "ID: " + result.id+ "  PropertyId: "+ propertyId + "  survey id:"+surveyid);
				log.debug("Unable to Parse Answer", rawAnswer);
			}
			return true;
    	});
    	log.audit("Generate Results List", "Finish");
    }
    
    function createResultsCsv(context, surveyid){
    	log.audit("Generate CSV File", "Start");
    	var strHeaderRow = "CASE,PROPERTY,HOUSE NUMBER,STREET,SUBDIVISION,LOT NUMBER";
    	var builderQuestions = getBuilderQuestions(surveyid);
    	var questionIndex = 1;
    	
    	for(i in builderQuestions.Questions){
    		var question = builderQuestions.Questions[i];
    		
   			strHeaderRow += ',"'+question.questiontext+'"';
    		
    		questionIndex++;
    	}
    	
    	strHeaderRow+="\r\n";
    	var csvData = strHeaderRow;
    	
    	createResultsSearch(surveyid).run().each(function(result){
    		var csvRow = "";
    		var propertyId = result.getValue("custrecord_survey_property");
    		var objPropertyDetails = getPropertyDetails(propertyId);
			
    		log.debug('Property Details', objPropertyDetails);
    		csvRow += result.getValue("custrecord_survey_case");
    		csvRow += ","+propertyId;
    		csvRow += ","+objPropertyDetails["custrecord_house_number"];
    		csvRow += ","+objPropertyDetails.custrecord31[0].text;
    		csvRow += ","+objPropertyDetails["custrecordcustrecordsubdname.custrecord_subdivision_id"];
    		//csvRow += ","+objPropertyDetails["custrecordcustrecordsubdname.internalid"];
    		csvRow += ","+objPropertyDetails["custrecord_lot_number"];
    		log
			
			var rawAnswer = result.getValue("custrecord_survey_ans");
			
			try{
				var objAnswers = JSON.parse(rawAnswer);
				var answerIndex = 1;
				
				for(i in objAnswers){
		    		var answer = objAnswers[i];
		    		var answerText = ',"'+getAnswerText(answer)+'"';
		    		
		    		csvRow += answerText;
		    		
		    		answerIndex++;
		    	}
				
				csvRow+="\r\n";
				csvData+=csvRow
			}catch(e){
				log.error(e.name, e.message);
				log.debug("Unable to Parse Answer", rawAnswer);
			}
			return true;
    	});
    	
    	var fileObj = file.create({
    		name: 'survey_results.csv',
    	    fileType: file.Type.PLAINTEXT,
    	    contents: csvData
    	});
    	
    	log.audit("Generate CSV File", "Done");
    	return fileObj;
    	
    	
    }
    
    function getAnswerText(answer){
    	var answerText;
    	
    	switch(answer.answerType){
			case "option-type-ans":
			case "multiple-type-ans":
				var answerOptions = answer.answer;
			
				for(var j=0; j < answerOptions.length; j++){
					var arrKeys = Object.keys(answerOptions[j]);
				
					if(arrKeys[0]=='true'){
						answerText = answerOptions[j][arrKeys[0]];
					}
				}
				break;
			case "para-type-ans":
				answerText = answer.answer.toString();
				break;
		
			default:
				answerText = '<font color="red">Answer Type: ' + answer.answerType + '</font>';
		}
    	
    	return answerText;
    }
    	
    function handleBuilderList(context){
    	try{
    		var builderList = ui.createList({title: "Builder Surveys"});
        	
        	builderList.addColumn({
                id: "custrecord67",
                type: ui.FieldType.TEXT,
                label: "Builder"
            });
        	
        	builderList.addColumn({
                id: "custrecord_survey_published",
                type: ui.FieldType.TEXT,
                label: "Published"
            });
        	
        	builderList.addColumn({
                id: "custrecord_default_survey",
                type: ui.FieldType.TEXT,
                label: "Default"
            });

        	
        	builderList.addColumn({
                id: "custrecord68",
                type: ui.FieldType.TEXT,
                label: "Questions"
            });
        	
        	builderList.addColumn({
                id: "viewurl",
                type: ui.FieldType.TEXT,
                label: "View Results"
            });
        	

        	
        	var searchBuilderSurveys = search.create({
        		   type: "customrecord429",
        		   filters:
        		   [
        		      ["custrecord_survey_published","is","T"]
        		   ],
        		   columns:
        		   [
        		      search.createColumn({
        		         name: "custrecord67",
        		         sort: search.Sort.ASC,
        		         label: "Builder"
        		      }),
        		      search.createColumn({name: "custrecord68", label: "Questions"}),
        		      search.createColumn({name: "custrecord_survey_published", label: "Published"}),
        		      search.createColumn({name: "custrecord_default_survey", label: "Default"})
        		   ]
        		});
        		var searchResultCount = searchBuilderSurveys.runPaged().count;
        		log.debug("searchBuilderSurveys result count",searchResultCount);
        		searchBuilderSurveys.run().each(function(result){
        		   // .run().each has a limit of 4,000 results
        			//log.debug("result", result);
        			//builderList.addRow(result);
        			
        			builderList.addRow({
        			    row : { 
        			    	custrecord67 : result.getText("custrecord67"),
        			    	custrecord68 : getFormattedQuestions(result.getValue("custrecord68")),
        			    	custrecord_survey_published : result.getValue("custrecord_survey_published").toString(),
        			    	custrecord_default_survey : result.getValue("custrecord_default_survey").toString(),
        			    	viewurl : '<a href="/app/site/hosting/scriptlet.nl?script=461&deploy=1&surveyid=' + result.id + '">View Results</a>'
        			    	}
        			});
        		   return true;
        		});
        	
        		context.response.writePage(builderList);
    	}catch(e){
    		log.error("error", e);
    	}
    }
    
    function getFormattedQuestions(q){
    	var objQuestions = JSON.parse(q);

    	var formattedQuestions = "";
    	
    	
    	for(i in objQuestions.Questions){
    		var question = objQuestions.Questions[i];
    		
    		formattedQuestions += question.questiontext + "<br />";
    	}
    	
		return formattedQuestions;

    }
    
    
    
    
    
    

    return {
        onRequest: onRequest
    };
    
});
