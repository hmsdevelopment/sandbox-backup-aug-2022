/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Oct 2018     puneetkumar
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function userEventAfterSubmit(type){
	
	if(type== "modify" || type=="edit"){
	
	var recordID = nlapiGetRecordId();
	
	nlapiLogExecution("DEBUG", "Record ID ", recordID)
	
	var oldRecordObj = nlapiGetOldRecord()
	var newRecordObj = nlapiGetNewRecord()
	
	if(oldRecordObj !=null && newRecordObj != null){
	
	var oldSalesStatus = oldRecordObj.getFieldValue("custrecord_property_status")
	var  newSalesStatus = newRecordObj.getFieldValue("custrecord_property_status");
	
	nlapiLogExecution("DEBUG", "OLd salesStatus ", oldSalesStatus);
      nlapiLogExecution("DEBUG", " newSalesStatus ", newSalesStatus);
	
if (oldSalesStatus != newSalesStatus){
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
	    dd='0'+dd;
	} 
	if(mm<10){
	    mm='0'+mm;
	} 
	var today = mm+'/'+dd+'/'+yyyy;
	
	
 nlapiSubmitField("customrecord_property_record", recordID, "custrecord_property_date_sales_st_update", today)
	
	//nlapiSetFieldValue("custrecord_property_date_sales_st_update", today)

	
	
	}
	}
	
	} 
}
