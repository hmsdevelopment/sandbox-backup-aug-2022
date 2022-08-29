function uploadFiles(request, response)
{
	try
	{
		if (request.getMethod() == 'GET')
		{
			var url = nlapiResolveURL('SUITELET','customscript_hms_upload_multiple_files','customdeploy_hms_upload_multiple_files',true);
			var propertyID = request.getParameter('propertyid');
			nlapiLogExecution( 'DEBUG',  ' propertyID '+propertyID, 'Method '+request.getMethod());
			nlapiLogExecution( 'DEBUG',  ' url ', 'url \n '+url);
			if(propertyID)
			{
				var html = '';
				html += '<!DOCTYPE html>';
				html += '<html>';
				html += '<body >';
				html += '<form action = "'+url+'" enctype = "multipart/form-data" method = "POST" >';
				  html += '<div><p style="color:red"> Submitting this page will upload the file in netsuite.</p> </div>';
				  html += '<div>Please Select a file: <input type="file" id="file1" name="file1"></div>';
				  html += '<div>Please Select a file: <input type="file" id="file2" name="file2"></div>';
				  html += '<div>Please Select a file: <input type="file" id="file3" name="file3"></div>';
				  html += '<div>Please Select a file: <input type="file" id="file4" name="file4"></div>';
				  html += '<div>Please Select a file: <input type="file" id="file5" name="file5"></div>';
				  html += '<input type="hidden" id="propertyid" name="propertyid" value="'+propertyID+'">';
				  
				  html += '<input type="submit" value="Submit" >';
				html += '</form>';
				html += '</body>';
				html += '</html>';
				response.write(html);
			}
			else
			{
				propertyForm();
			}
		}
		else
		{
			var propertyID = request.getParameter('propertyid');
			var file1 = request.getFile('file1');
			var file2 = request.getFile('file2');
			var file3 = request.getFile('file3');
			var file4 = request.getFile('file4');
			var file5 = request.getFile('file5');
			if(file1)
			{
				file1.setFolder(3187);
				var fid1 = nlapiSubmitFile(file1);
				nlapiLogExecution( 'DEBUG',  ' fid1 '+fid1, ' fid1 '+fid1);
				nlapiAttachRecord("file", fid1, "customrecord_property_record", propertyID);
			}
			if(file2)
			{
				file2.setFolder(3187);
				var fid2 = nlapiSubmitFile(file2);
				nlapiLogExecution( 'DEBUG',  ' fid2 '+fid2, ' fid2 '+fid2);
				nlapiAttachRecord("file", fid2, "customrecord_property_record", propertyID);
			}
			if(file3)
			{
				file3.setFolder(3187);
				var fid3 = nlapiSubmitFile(file3);
				nlapiLogExecution( 'DEBUG',  ' fid3 '+fid3, ' fid3 '+fid3);
				nlapiAttachRecord("file", fid3, "customrecord_property_record", propertyID);
			}
			if(file4)
			{
				file4.setFolder(3187);
				var fid4 = nlapiSubmitFile(file4);
				nlapiLogExecution( 'DEBUG',  ' fid4 '+fid4, ' fid4 '+fid4);
				nlapiAttachRecord("file", fid4, "customrecord_property_record", propertyID);
			}
			if(file5)
			{
				file5.setFolder(3187);
				var fid5 = nlapiSubmitFile(file5);
				nlapiLogExecution( 'DEBUG',  ' fid5 '+fid5, ' fid5 '+fid5);
				nlapiAttachRecord("file", fid5, "customrecord_property_record", propertyID);
			}
			nlapiLogExecution( 'DEBUG',  ' propertyID '+propertyID, ' file1 '+file1+' file2 '+file2+' file3 '+file3+' file4 '+file4+' file5 '+file5);
			successForm();
		}
		
	}
	catch(e)
	{
		var err = '';
		var errmsg = '';
		
		if ( e instanceof nlobjError )
		{
			err = 'System error: ' + e.getCode() + '\n' + e.getDetails();
		}
		else
		{
			err = 'Unexpected error: ' + e.toString();
		}
		errmsg += '\n' + err;
		nlapiLogExecution( 'ERROR',  ' 999 Error', errmsg);
		errorForm(errmsg);
	}
	
}

function successForm()
{
	var form = nlapiCreateForm("Success");
	var success=form.addField('success', 'text', 'Files successfully Uploaded.',null);
	success.setDisplayType('inline');
	form.addButton('cystpage_ok','OK','window.close();');
	
	response.writePage(form);
}

function errorForm(msg)
{
	var form = nlapiCreateForm("Error On Record..");
	var success=form.addField('success', 'text', 'Details: \n'+msg,null);
	success.setDisplayType('inline');
	form.addButton('cystpage_ok','OK','window.close();');
	
	response.writePage(form);
}

function propertyForm()
{
	var form = nlapiCreateForm("Success");
	var success=form.addField('success', 'text', 'Property not found.',null);
	success.setDisplayType('inline');
	form.addButton('cystpage_ok','OK','window.close();');
	
	response.writePage(form);
}