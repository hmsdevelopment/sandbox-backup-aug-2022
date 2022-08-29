/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 Aug 2018     prashant
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */




function UploadFilesIntoBox(type) {

	var cols = [];
	cols.push(new nlobjSearchColumn("folder","file",null));
	cols.push(new nlobjSearchColumn("name","file",null));
	cols.push(new nlobjSearchColumn("url","file",null));
	cols.push(new nlobjSearchColumn('name'));
	cols.push(new nlobjSearchColumn("internalid","file",null));
	
	var searchResults = nlapiCreateSearch('customrecord_property_record',[["file.filetype","noneof","@NONE@"],"AND",["lastmodified","within","1/1/2015 12:00 am","8/6/2018 11:59 pm"]],cols);
	nlapiLogExecution("DEBUG","searchResults : ",searchResults);
	
	var searchResultSet = searchResults.runSearch();
	var i= 0 ;
	var startIndx = 0;
	var endIndx = 500;
	var results = searchResultSet.getResults(startIndx,endIndx);
	

	nlapiLogExecution("DEBUG","Record ",JSON.stringify(results));
	var result = {};
 
	while(i<results.length && results.length > 0) {
		
		nlapiLogExecution("DEBUG","i : ",i);
		
		var currentRecordId = results[i].getId();

		var fileName = results[i].getValue(cols[1]);
		var halfUrl = results[i].getValue(cols[2]);
		var recordName = results[i].getValue(cols[3]);
		var fileId = results[i].getValue(cols[4]);
		
		var fileUrl  = 'https://1309901.app.netsuite.com/'+ halfUrl;
		
		
		if(!result[currentRecordId]) {
 
			result[currentRecordId] = {};
            result[currentRecordId]['files'] = {};
       }
		
		result[currentRecordId]['record_name'] = recordName;

     	result[currentRecordId]['files'][fileId] =  {"file_name" :fileName , "file_Url":fileUrl };
     	

		i++;
		
        if(i == 10) {
        	break;
        }
        
		if(i == results.length) {
			startIndx = endIndx;
			endIndx = endIndx + 500;
			results = searchResultSet.getResults(startIndx,endIndx);
			i = 0;
		}

	}
	
	nlapiLogExecution("DEBUG","RESULT : ",JSON.stringify(result));

}//for testing
	/*
	//token generation
	var currentDate = new Date();
	var currentTimeStamp = currentDate.getTime();
	
	nlapiLogExecution("DEBUG","currentDate || currentTimeStamp : ",currentDate +","+ currentTimeStamp);
	
	var accessToken = nlapiLookupField('customrecord_refresh_access_token_rec',1,'custrecord_access_token');
	var accessTokenTimeStamp = nlapiLookupField('customrecord_refresh_access_token_rec',1,'custrecord_acces_token_timestamp');
	nlapiLogExecution("DEBUG","accessToken || accessTokenTimeStamp : ",accessToken +","+ accessTokenTimeStamp);
	
	var TimeStampDifference = currentTimeStamp -  accessTokenTimeStamp ; 
	nlapiLogExecution("DEBUG","TimeStampDifference : ",TimeStampDifference);
	
	if(TimeStampDifference > 50*60*1000) {
		
		var newAccessToken ;
		var newRefreshToken ;
		
		var refreshToken = nlapiLookupField('customrecord_refresh_access_token_rec',1,'custrecord_refresh_token');
		nlapiLogExecution("DEBUG","refreshToken : ",refreshToken);
		
		var tokenBody = {
				
				'grant_type' : 'refresh_token',
				'refresh_token' : refreshToken,
				'client_id' : 'ty9ex4miree027ca2la16y7iofsuaimk',
				'client_secret':'0sFzjWO3SjsDSJamo0qnjKTxcvq9fSXR'
				//var accestoken = 'bbW5tpkm8GxxegPNt7acYtLXFUbkNWSt';
			
				
		};

		var tokenHeader = {
				
				'Content-Type' : 'application/x-www-form-urlencoded'
		};
		
		
		var tokenGeneratingUrl = 'https://api.box.com/oauth2/token';
		var generateUrlResponse = nlapiRequestURL(tokenGeneratingUrl,tokenBody,tokenHeader,"POST");
		
		nlapiLogExecution("DEBUG","generateUrlBody : ",generateUrlResponse.getBody());
		
		var generateUrlBody = generateUrlResponse.getBody();
		
		var body = JSON.parse(generateUrlBody);
		
		if(body){
			newAccessToken = body.access_token ;
			nlapiLogExecution("DEBUG","newAccessToken : ",newAccessToken);
			newRefreshToken = body.refresh_token;
			nlapiLogExecution("DEBUG","newRefreshToken : ",newRefreshToken);
		}
		

		nlapiSubmitField('customrecord_refresh_access_token_rec',1,'custrecord_access_token',newAccessToken) ;
		nlapiSubmitField('customrecord_refresh_access_token_rec',1,'custrecord_acces_token_timestamp',currentTimeStamp) ;
		nlapiSubmitField('customrecord_refresh_access_token_rec',1,'custrecord_refresh_token',newRefreshToken) ;
		
		accessToken = newAccessToken ;
	}
	 var createHeader = {
			  
			  'Authorization': 'Bearer '+ accessToken
				
	  };

	 
	//file updation or creation
		var netsuiteFolderId = "51952042311";
	
		  for(var key in result) {
			  
			  var folderFound = 0;
			  var folderId ; 
			  
			  var propRecordName = result[key]['record_name'] ;
			  nlapiLogExecution("DEBUG","propRecordName : ",propRecordName); 
			  
			  //Start : Checking for already existing folder
			  
			  var mainFolderItemsUrl = 'https://api.box.com/2.0/folders/51952042311/items';
			 
			  var mainfolderItemsResponse = nlapiRequestURL(mainFolderItemsUrl,null,createHeader,"GET");
			  nlapiLogExecution("DEBUG","mainfolderItemsResponse body", mainfolderItemsResponse.getBody()); 
			  
			  var mainfolderItemsResponseBody = mainfolderItemsResponse.getBody();
				
			  var folderItemsBody = JSON.parse(mainfolderItemsResponseBody);

			  nlapiLogExecution('DEBUG','168',folderItemsBody['entries'])
			  var entriesArr =  folderItemsBody['entries'];
			  if(entriesArr.length != null){
				
				  for(var entries = 0;entries < entriesArr.length ;entries++ ) {
					  nlapiLogExecution('DEBUG','entries Loop', entries);
					  folderName = folderItemsBody['entries'][entries].name ;
					  nlapiLogExecution("DEBUG","folderName : ",folderName); 
					  
					  if(folderName == propRecordName) {
						  
						 folderId =  folderItemsBody['entries'][entries].id;
						 nlapiLogExecution("DEBUG","folderId ",folderId);
						 folderFound = 1;
						 nlapiLogExecution("DEBUG","folderFound ");
						 break;
					  }
				  }

					
			  }
			  
		      //End : Checking for already existing folder
			  
			  if(folderFound == 0) {
				  
				//Start : Creating New folder if not found
				  
				  var createFolderBody = {
						  
						  'name':propRecordName,
						  'parent':{
							  'id': netsuiteFolderId 
						  }
				  };
				  
				  var createFolderurl= 'https://api.box.com/2.0/folders';
				  var createFolderResponse = nlapiRequestURL(createFolderurl,JSON.stringify(createFolderBody),createHeader,"POST");
				  nlapiLogExecution("DEBUG","createFolderResponse body", createFolderResponse.getBody()); 
				  
				  var createFolderResponseBody = createFolderResponse.getBody();
					
				  var parsedBody = JSON.parse(createFolderResponseBody);
					
				  if(parsedBody){
					
					  folderId = parsedBody.id ;
					  nlapiLogExecution("DEBUG","folderId : ",folderId);
					  
						
				  }
				  
			  }
			  
			  //End : Creating New folder if not found
		    
			  
		  
			  for(var file in result[key]['files']) {
				  
				  
				  //Start : Getting Files and deleting if have to re-upload
				  
				  
				  var getFolderItemsUrl = 'https://api.box.com/2.0/folders/'+ folderId + '/items';
					 
				  var folderItemsResponse = nlapiRequestURL(getFolderItemsUrl,JSON.stringify(createFolderBody),createHeader,"GET");
				  nlapiLogExecution("DEBUG","folderItemsResponse body", folderItemsResponse.getBody()); 
				  
				  var folderItemsResponseBody = folderItemsResponse.getBody();
					
				  var recordfolderItemsBody = JSON.parse(folderItemsResponseBody);
				  
				  var fileEntriesArr =  recordfolderItemsBody['entries'];
				  
				  if(fileEntriesArr.length != null){
						
					  for(var recordEntries = 0;recordEntries < fileEntriesArr.length ;recordEntries++ ) {
						  
						  var fileName = recordfolderItemsBody['entries'][recordEntries].name ;
						  
						  var fileId = recordfolderItemsBody['entries'][recordEntries].id ;

						  nlapiLogExecution("DEBUG","fileName || fileId : ",fileName +","+ fileId); 
						  
						  if(fileName == file) {
							  
							  var deleteFileUrl = 'https://api.box.com/2.0/files/'+ fileId;
							  var deleteFileResponse = nlapiRequestURL(deleteFileUrl,null,createHeader,"DELETE");
							  nlapiLogExecution("DEBUG","file deleted");
							  
						  }
					  }

						
				  }
				  
				  //End : Getting Files and deleting if have to re-upload
				  
				  //Start : Uploading Files in Folder
				  
				  var createFileBody = {
						  "attributes" : {
							  'name':'Test_File.txt',//result[key]['files'][file],
							  'parent':{
								  'id': folderId 
							  }
						  }
				  };
				  
				  var fileObj = nlapiLoadFile('48681');
				  var fileSh1 = fileObj.getValue();//sha1.hex();
				  
				  
//				  var hash = CryptoJS.SHA1(fileSh1);
//				  createFileBody.file = fileSh1;//fileSh1;
//				  
//				  createHeader['Content-MD5'] = hash;//'58d3f35ebda104f0cc7ff419cc946832154581fc'//fileSh1;
				  createHeader['Content-Type'] = 'application/x-www-form-urlencoded'; 
				  
				  var filePath = '/SuiteScripts/HMS Box File Uploader/Test_Data.pdf';
				  createFileBody.file = fileSh1;//filePath;
				  nlapiLogExecution("DEBUG","file header :",JSON.stringify(createHeader));
				  nlapiLogExecution("DEBUG","file content :",JSON.stringify(createFileBody));
				  
				  
				  
				  var createFileUrl = 'https://upload.box.com/api/2.0/files/content';
				  var createFileResponse = nlapiRequestURL(createFileUrl,JSON.stringify(createFileBody),createHeader,"POST");
				  nlapiLogExecution("DEBUG","createFileResponse body || createFileResponse Code", createFileResponse.getBody()+"||"+ createFileResponse.getCode()); 
				  
				  //End : Uploading Files in Folder
				  
			  }
			  
			  
		
		  }
	 
	
	
}



/*
var header = {
		"Authorization":"Bearer 2oqKtzZLdDaz1bWYQKiksImTcvHbLOhk",
		
}

var fileObj = nlapiLoadFile('48681');
var postData  = {
		"attributes":{"name":"tigersNew.txt", "parent":{"id":"0"}},
			"file":fileObj
}

var postData = 'attributes={"name":"tigersNew.txt","parent":{"id":"0"}}&file='+fileObj
var createFileUrl = 'https://upload.box.com/api/2.0/files/content';
var res = nlapiRequestURL(createFileUrl, postData, header);
nlapiLogExecution('DEBUG','res ',res.getBody());
*/






