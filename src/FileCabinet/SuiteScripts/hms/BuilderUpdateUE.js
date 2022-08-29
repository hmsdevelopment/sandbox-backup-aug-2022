/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 Nov 2017     Admin
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
function viewButtonOnBuilder(type, form, request){
	if(type=='view'){
		var rec_id=nlapiGetRecordId();
		var rec_type=nlapiGetRecordType();
		nlapiLogExecution('DEBUG', 'rec_type', rec_type);
		if(rec_type=='customer'){
			form.addButton('custpage_update', 'Update Builder Personnel', updateBuilder());
		}else if(rec_type=='customrecord_subdivision'){
			form.addButton('custpage_update', 'Update Builder Personnel', updateBuilderSubdiv(nlapiGetFieldValue('custrecord_builder_division'),rec_id));
		}
		
	}
 
}

function updateBuilder(){
	var data='';
	var url=nlapiResolveURL('SUITELET','customscript_update_builder_subdivision','1', false);
	 data += 'var recordid = document.forms[\'main_form\'].elements[\'id\'].value;';
	 data += 'var url = \'' + url+'&builder_id=\'+recordid;';
	 data += 'window.open(url, \'_blank\');';
	 return data;
 
}
function updateBuilderSubdiv(builderid,subdiv_id){
	  var data='';
	  var url=nlapiResolveURL('SUITELET', 'customscript_update_builder_subdivision','1', false);

	 data += 'var url = \'' + url+'&builder_id='+builderid+'&subdiv='+subdiv_id+'\';';
	 data += 'window.open(url, \'_blank\');';
	 return data;
 
}

