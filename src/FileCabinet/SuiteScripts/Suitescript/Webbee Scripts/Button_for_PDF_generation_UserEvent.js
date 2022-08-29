/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Jul 2018     Vikash Singh
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
function createButtonTrackShipment(type,form)
{
	if(type == 'view')
	{
		
		var recordId = nlapiGetRecordId();
		//var recordDetail= nlapiLoadRecord("customrecord_property_record",recordId)
		var mlsRegion  = nlapiLookupField("customrecord_property_record", recordId, "custrecord15")
		nlapiLogExecution("DEBUG", "mlsRegion", mlsRegion)
		nlapiLogExecution("DEBUG", "recordId", recordId)
		
//		if(mlsRegion =='6' )
//		{
		form.addButton('custpage_set_tracking', 'Generate Aggrement', 'generateTracking(\'' + recordId + '\');');
		form.setScript('customscript_pdfaggrement');
//		}
	}
}

var fxctr = 100;
function logMsg(text)
{
    fxctr++;
    nlapiLogExecution( 'DEBUG', fx + fxctr,  text);
}

function generateTracking(recordId)
{
	if(recordId)
	{
	
		var url = '';
	url = "https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=266&deploy=1&propertyID="+recordId;
		
		var strWindowFeatures = "location=yes,height=670,width=1100,scrollbars=yes,status=yes";
		var newWindow = window.open(url,'_blank',strWindowFeatures);
	}
}

function pageInit()
{
	 window.onbeforeunload = function(){ return null;};
}
