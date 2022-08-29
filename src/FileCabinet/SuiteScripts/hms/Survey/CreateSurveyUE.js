/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Nov 2017     Admin
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function DispalyButton(type, form, request){
	nlapiLogExecution('DEBUG', 'start');
	if(type=='view'){
		var rec_type=nlapiGetRecordType();
		if(rec_type=='customer'){
			nlapiLogExecution('DEBUG', 'button');
			var buiderid=nlapiGetRecordId();
			buiderid=buiderid*103;
			form.addButton('custpage_createsurvey', 'Create Survey', goto_link(buiderid));	
		}else if(rec_type=='supportcase'){
			nlapiLogExecution('DEBUG', 'button');
			var case_id=nlapiGetRecordId();
//			buiderid=buiderid*103;
			form.addButton('custpage_createsurvey', 'Submit Survey', goto_link1(case_id));	
		}else if(rec_type=='customrecord429'){
			nlapiLogExecution('DEBUG', 'button');
			var surveyid=nlapiGetRecordId();
//			buiderid=buiderid*103;
			form.addButton('custpage_createsurvey', 'Export Survey Result', goto_link2(surveyid));	
		}

	}
 
}
function goto_link(buiderid){
	var url=nlapiResolveURL('SUITELET','customscript_survey_ui','1', false);
	var data='var url = \'' + url+'&builderid='+buiderid+'\';';
	 data += 'window.open(url, \'_blank\');';
	return data;
}
function goto_link1(case_id){
	var url=nlapiResolveURL('SUITELET','customscript245','1', false);
	var data='var url = \'' + url+'&query='+case_id+'\';';
	 data += 'window.open(url, \'_blank\');';
	return data;
}
function goto_link2(surveyid){
	var url=nlapiResolveURL('SUITELET','customscript_get_survey_report','1', false);
	var data='var url = \'' + url+'&survey_id='+surveyid+'\';';
	 data += 'window.open(url, \'_self\');';
	return data;
}