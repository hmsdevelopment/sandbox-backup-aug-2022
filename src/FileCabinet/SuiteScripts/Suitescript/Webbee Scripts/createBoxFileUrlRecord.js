/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 Aug 2018     prashant
 *
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function createBoxFileUrlRecord(dataIn) {
	/*dataIn = { "data" :[
			
			{
			"file_name":"test.pdf",
			"file_url" : "https://1309901.app.netsuite.com/core/media/media.nl?id=44301&c=1309901&h=809c30bdc808d3f9fbb6&_xt=.pdf",
			"property_record_name" : " Aly  (Available) Bootleg Bay | Delete Me1 : South",
			"property_record_id":"Property_8853",
			"subdivision_name" : "Bootleg Bay | Delete Me1 : South",
			"folder_id" : "38",
			"file_id" : "44301",
			"last_modified" :"5/21/2018",
			"date_created" : "5/7/2018"
			},
			{
			"file_name":"test.pdf",
			"file_url" : "https://1309901.app.netsuite.com/core/media/media.nl?id=44301&c=1309901&h=809c30bdc808d3f9fbb6&_xt=.pdf",
			"property_record_name" : " Ave  (Available) Bootleg Bay | Delete Me1 : South",
			"property_record_id":"Property_8870",
			"subdivision_name" : "Bootleg Bay | Delete Me1 : South",
			"folder_id" : "38",
			"file_id" : "44301",
			"last_modified" : "5/21/2018",
			"date_created" : "5/7/2018"
			}
			
	] };  */
	
	nlapiLogExecution('DEBUG','dataIn',dataIn+"||"+JSON.stringify(dataIn));
	//dataIn = JSON.parse(dataIn);
	//nlapiLogExecution('DEBUG','After parsing dataIn',dataIn);

	var dataArray = dataIn;//.data; 
	//var deleteCondition = dataIn.deleteFiles ;
	
	
	
	var recordIdArray = [];
	
	for(var i=0;i<dataArray.length;i++) {
			
		try{
			var propertyRecordName = dataArray[i].property_record_name;
			
			var fileName = dataArray[i].file_name;
			var fileUrl = dataArray[i].file_url;
			var propertyRecordId = dataArray[i].property_record_id;
			var subDivisionName = dataArray[i].subdivision_name;
			var fileId = dataArray[i].file_id;
			var folderId = dataArray[i].folder_id;
			var lastModified = dataArray[i].last_modified;
			var dateCreated = dataArray[i].date_created;	
			var folderUrl = dataArray[i].folder_url;
			var deleteCondition = dataArray[i].deleteFiles;
			
			nlapiLogExecution('DEBUG','deleteCondition : ',deleteCondition);
			
			if(propertyRecordId.indexOf('_')>-1){

				propertyRecordId = propertyRecordId.split('_')[1];
				
				nlapiLogExecution("DEBUG","Underscore presesnt");
			}
					
			nlapiLogExecution("DEBUG","propertyRecordName || propertyRecordId :",propertyRecordName + "||" +propertyRecordId);
			nlapiLogExecution("DEBUG","fileName || fileUrl || folderUrl :",fileName + "||" +fileUrl+ " || "+folderUrl);
			
			if(propertyRecordId) {
				nlapiSubmitField('customrecord_property_record',propertyRecordId,'custrecord_external_file_link',folderUrl);	
			}
			
			var searchResults = nlapiSearchRecord("customrecord_external_file_record",null,
					[
					   ["custrecord_file_name","is",fileName], 
					   "AND", 
					   ["custrecord_property_record_name","anyof",propertyRecordId]
					], 
					[
					   new nlobjSearchColumn("custrecord_file_name"), 
					   new nlobjSearchColumn("custrecord_file_box_url")
					]
					);
			nlapiLogExecution("DEBUG","searchResults  :",JSON.stringify(searchResults));
			
			if(searchResults == null) {
				
				var record = nlapiCreateRecord('customrecord_external_file_record');
				
				record.setFieldValue('custrecord_file_name',fileName);
				record.setFieldValue('custrecord_file_box_url',fileUrl);
				record.setFieldValue('custrecord_property_record_name',propertyRecordId);
				record.setFieldText('custrecord_property_subdivison_name',subDivisionName);
				record.setFieldValue('custrecord_folder_id',folderId);
				record.setFieldValue('custrecord_file_id',fileId);
				record.setFieldValue('custrecord_last_modified',lastModified);
				record.setFieldValue('custrecord_date_created',dateCreated);
				
				var recordId = nlapiSubmitRecord(record);
				nlapiLogExecution("DEBUG","recordId",recordId);
				
				
				recordIdArray.push(recordId);
				
				if(deleteCondition == 'T') {
					try{
						var deleteFileId = nlapiDeleteFile(fileId);
						nlapiLogExecution("DEBUG","deleteFileId : ",deleteFileId);
					}
					catch(e){
						nlapiLogExecution("DEBUG","Error in deleting  : ",e +":"+fileId);
					}
				}
				
			
				
				
			}//end of if
			
			else {
				
				var prevRecordId = searchResults[0].getId();
				nlapiLogExecution("DEBUG","prevRecordId : ",prevRecordId);
				
				var prevRecord = nlapiLoadRecord('customrecord_external_file_record',prevRecordId);
				
				prevRecord.setFieldValue('custrecord_file_name',fileName);
				prevRecord.setFieldValue('custrecord_file_box_url',fileUrl);
				prevRecord.setFieldValue('custrecord_property_record_name',propertyRecordId);
				prevRecord.setFieldText('custrecord_property_subdivison_name',subDivisionName);
				prevRecord.setFieldValue('custrecord_folder_id',folderId);
				prevRecord.setFieldValue('custrecord_file_id',fileId);
				prevRecord.setFieldValue('custrecord_last_modified',lastModified);
				prevRecord.setFieldValue('custrecord_date_created',dateCreated);
				
				nlapiSubmitRecord(prevRecord);
				nlapiLogExecution("DEBUG","record updated",prevRecordId);
				
				
				recordIdArray.push(prevRecordId);
				
				if(deleteCondition == 'T') {
					try{
						var deleteFileId = nlapiDeleteFile(fileId);
						nlapiLogExecution("DEBUG","deleteFileId : ",deleteFileId);
					}
					catch(e){
						nlapiLogExecution("DEBUG","Error in deleting : ",e+":"+fileId);
					}
				}				
			} // end of else
			
			
		}//end of try
		catch(e){
			nlapiLogExecution("DEBUG","error",e);
			
		}
		
		}//end of for
	
    nlapiLogExecution('DEBUG','recordIdArray : ',recordIdArray);
	return recordIdArray.length;
		
	}
	
	
	