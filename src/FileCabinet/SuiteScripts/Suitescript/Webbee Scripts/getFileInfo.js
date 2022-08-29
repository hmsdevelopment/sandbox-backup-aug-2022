/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 Aug 2018     prashant
 *
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function getFileInfo(dataIn) {
	
	try {
		
		nlapiLogExecution("DEBUG","dataIn "+ typeof dataIn,JSON.stringify(dataIn)+"||"+dataIn);
		var cols = [];
		try{
			dataIn = JSON.parse(dataIn);
		}
		catch(ex){
			nlapiLogExecution("DEBUG","ex ",ex);
		}
		
	    var searchId = String(dataIn.savedSearchId);
	    nlapiLogExecution("DEBUG","searchId ",searchId);
	    
	    if(searchId && searchId.length > 0){
	    	
//	    	  	var builderSearchId = builderID.replace("BuilderId",'');
	    		searchId = searchId.toString();
	    	    nlapiLogExecution("DEBUG","searchId : ",searchId);
	    	    
//	    		cols.push(new nlobjSearchColumn("folder","file",null));
//	    		cols.push(new nlobjSearchColumn("name","file",null));
//	    		cols.push(new nlobjSearchColumn("url","file",null));
//	    		cols.push(new nlobjSearchColumn('name'));
//	    		cols.push(new nlobjSearchColumn("internalid","file",null));
//	    		cols.push(new nlobjSearchColumn("custrecord12"));
//	    		cols.push(new nlobjSearchColumn("custrecordcustrecordsubdname")); 
//	    		cols.push(new nlobjSearchColumn("modified","file",null)); 
//	    		cols.push(new nlobjSearchColumn("created","file",null));
	    		
	    		var loadedSearch = nlapiLoadSearch('customrecord_property_record',searchId);
//	    		loadedSearch.addFilter(new nlobjSearchFilter('custrecord12', null, 'anyof', builderSearchId));
	    		//var searchResults = nlapiCreateSearch('customrecord_property_record',[["file.filetype","noneof","@NONE@"],"AND",["custrecord12","anyof",builderSearchId]],cols); //,"AND",["internalid","anyof","8910"]
	    		//var searchResults = nlapiCreateSearch(loadResults.getSearchType(),loadResults.getFilters(),loadResults.getColumns());
	    		nlapiLogExecution("DEBUG","loadedSearch : ",loadedSearch);
	    		
	    		cols = loadedSearch.getColumns();
	    		
	    		var searchResultSet = loadedSearch.runSearch();
	    		var i= 0 ;
	    		var startIndx = 0;
	    		var endIndx = 500;
	    		var results = searchResultSet.getResults(startIndx,endIndx);
	    		

	    		nlapiLogExecution("DEBUG","Record "+"||"+results.length,JSON.stringify(results));
	    		
	    		var finalObj = {};
	    	 
	    		while(i<results.length && results.length > 0) {
	    			
	    			//nlapiLogExecution("DEBUG","i : ",i);
	    			
	    			var currentRecordId = results[i].getId();
	    	        
	    			var fileFolderName = results[i].getText(cols[0]);
	    			var fileFolderId = results[i].getValue(cols[0]);
	    			var fileName = results[i].getValue(cols[1]);
	    			var halfUrl = results[i].getValue(cols[2]);
	    			var recordName = results[i].getValue(cols[3]);
	    			var fileId = results[i].getValue(cols[4]);
	    			var builderId = results[i].getValue(cols[5]);
	    			var builderName = results[i].getText(cols[5]);
	    			var subDivision = results[i].getText(cols[6]);
	    			var fileLastModified = results[i].getValue(cols[7]).split(' ')[0];
	    			var fileCreated = results[i].getValue(cols[8]).split(' ')[0];
	    			
	    			var fileUrl  = 'https://1309901.app.netsuite.com'+ halfUrl;
	    			
	    			if(!finalObj[builderId]) {
	   	     		 
	    	     		finalObj[builderId] = {};
	    			}
	    			
	    			if(!finalObj[builderId]['Property_'+currentRecordId]) {
	         			finalObj[builderId]['Property_'+currentRecordId] = {};
	         			finalObj[builderId]['Property_'+currentRecordId]['files'] = {};
	         		}
	    			
	    			finalObj[builderId]['Property_'+currentRecordId]['record_name'] = recordName + " " +currentRecordId ;
	    			finalObj[builderId]['Property_'+currentRecordId]['builder_id'] = "BuilderId"+builderId;
	    			finalObj[builderId]['Property_'+currentRecordId]['builder_name'] = builderName;
	    			finalObj[builderId]['Property_'+currentRecordId]['subdivision_name'] = subDivision;
	    			finalObj[builderId]['Property_'+currentRecordId]['files'][fileId] =  {"file_name" :fileName , "file_Url":fileUrl , "folder_name" : fileFolderName ,"folder_id" : fileFolderId , "file_modified" : fileLastModified ,"file_created" : fileCreated };
	    	     	

	    			i++;
	    			
	    	       /* if(i == 10) {
	    	        	break;
	    	        }*/
	    	        
	    			if(i == results.length) {
	    				startIndx = endIndx;
	    				endIndx = endIndx + 500;
	    				results = searchResultSet.getResults(startIndx,endIndx);
	    				i = 0;
	    				nlapiLogExecution('DEBUG','i==results , '+"||"+results.length);
	    			}

	    		}
	    		
	    		//nlapiLogExecution("DEBUG","RESULT : ",JSON.stringify(result));
	    		nlapiLogExecution('DEBUG','finalObj',JSON.stringify(finalObj));
	    			  
	    		//var resultWithBuilder = {};
	    			  
	    		/*for(var key in result){
	    			    
	    			var curr = result[key].builder_id;
	    			    
	    			if(builderID == curr) {
	    			     
	    				resultWithBuilder[key] = result[key];
	    			   
	    			}
	    			    
	    			 
	    		}*/
	    		
	    		
	    		finalObj = JSON.stringify(finalObj);
	    		
	    		return finalObj;
	    	
	    }
	    else if(!searchId && searchId.length <= 0) {
	    	
	    	nlapiLogExecution("DEBUG","else if: ");
	    	nlapiLogExecution("DEBUG","No Search Id Found ");
	    	
//			var loadedSearch = nlapiLoadSearch('customrecord_property_record', '425');
//			//loadedSearch.addFilter(new nlobjSearchFilter('custrecord12', null, 'anyof', '3643'));
//			nlapiLogExecution("DEBUG","loadedSearch : ",loadedSearch);
//			
//			cols = loadedSearch.getColumns();
//			
//			var searchResultSet = loadedSearch.runSearch();
//			var i= 0 ;
//			var startIndx = 0;
//			var endIndx = 500;
//			var results = searchResultSet.getResults(startIndx,endIndx);
//			
//
//			nlapiLogExecution("DEBUG","Record "+"||"+results.length,JSON.stringify(results));
//			
			var finalObj = {};
//		 
//			while(i<results.length && results.length > 0) {
//				
//				//nlapiLogExecution("DEBUG","i : ",i);
//				
//				var currentRecordId = results[i].getId();
//		        
//				var fileFolderName = results[i].getText(cols[0]);
//				var fileFolderId = results[i].getValue(cols[0]);
//				var fileName = results[i].getValue(cols[1]);
//				var halfUrl = results[i].getValue(cols[2]);
//				var recordName = results[i].getValue(cols[3]);
//				var fileId = results[i].getValue(cols[4]);
//				var builderId = results[i].getValue(cols[5]);
//				var builderName = results[i].getText(cols[5]);
//				var subDivision = results[i].getText(cols[6]);
//				var fileLastModified = results[i].getValue(cols[7]).split(' ')[0];
//				var fileCreated = results[i].getValue(cols[8]).split(' ')[0];
//				
//				var fileUrl  = 'https://1309901.app.netsuite.com'+ halfUrl;
//				
//				if(!finalObj[builderId]) {
//		     		 
//		     		finalObj[builderId] = {};
//				}
//				
//				if(!finalObj[builderId]['Property_'+currentRecordId]) {
//	     			finalObj[builderId]['Property_'+currentRecordId] = {};
//	     			finalObj[builderId]['Property_'+currentRecordId]['files'] = {};
//	     		}
//				
//				finalObj[builderId]['Property_'+currentRecordId]['record_name'] = recordName + " " +currentRecordId ;
//				finalObj[builderId]['Property_'+currentRecordId]['builder_id'] = "BuilderId"+builderId;
//				finalObj[builderId]['Property_'+currentRecordId]['builder_name'] = builderName;
//				finalObj[builderId]['Property_'+currentRecordId]['subdivision_name'] = subDivision;
//				finalObj[builderId]['Property_'+currentRecordId]['files'][fileId] =  {"file_name" :fileName , "file_Url":fileUrl , "folder_name" : fileFolderName ,"folder_id" : fileFolderId , "file_modified" : fileLastModified ,"file_created" : fileCreated };
//		     	
//		     	
//
//				i++;
//				
//		       /* if(i == 10) {
//		        	break;
//		        }*/
//		        
//				if(i == results.length) {
//					startIndx = endIndx;
//					endIndx = endIndx + 500;
//					results = searchResultSet.getResults(startIndx,endIndx);
//					i = 0;
//					nlapiLogExecution('DEBUG','i==results , '+"||"+results.length);
//				}
//
//			}
//			
//			//nlapiLogExecution("DEBUG","RESULT : ",JSON.stringify(result));
//			nlapiLogExecution('DEBUG','finalObj : ',JSON.stringify(finalObj));
			
			finalObj = JSON.stringify(finalObj);
			return finalObj;
	    	
	    }
	    else {
	    	nlapiLogExecution('DEBUG','else: ');
	    	var finalObj = {};
	    	finalObj = JSON.stringify(finalObj);
	    	return finalObj;
	    }
	}
	catch(e){
		nlapiLogExecution('DEBUG','e : ',e);
		var finalObj = {};
    	finalObj = JSON.stringify(finalObj);
    	return finalObj;
	}
	
  
  
}