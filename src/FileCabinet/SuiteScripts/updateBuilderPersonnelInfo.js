var body  = '';
var author = -5;
var subject = 'HMS Marketing Services ,';
//var recipient = 'pranjal@webbee.biz';
var status= [1,2,4,7,10];

function updateBuilderPersonnelInfo()
{
	try
	{
		var builder = nlapiGetFieldValue('custentity1');
		var title = nlapiGetFieldValue('custentity_job_title');
		var id = nlapiGetFieldValue('id');
		var email = nlapiGetFieldValue('email');
		var phone = nlapiGetFieldValue('phone');
		var mobile = nlapiGetFieldValue('mobilephone');
		var teamCal =  nlapiGetFieldValue('custentity_team_calendar');
		
		//Updates Admin Asst field on the builder record and subdivisions	
		/*
		 Commented out by Jeff 8/28/2018 - with multiple Admins per builder this was causing issues
         
		if(title == '26')
		{
			var builderRecord = nlapiLoadRecord('customer', builder);		
			builderRecord.setFieldValue('custentity_administrative_contact', id);
			builderRecord.setFieldValue('custentity_administrative_contact_phone', phone);
			builderRecord.setFieldValue('custentity_administrative_contact_email', email);
			builderRecord.setFieldValue('custentityadmin_mobile_phone', mobile);
			nlapiSubmitRecord(builderRecord);

			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builder);

			var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
			for(var i=0; results != null && results.length > i; i++)
			{
				var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
				subdivisionRecord.setFieldValue('custrecord_administrative_contact', id);
				subdivisionRecord.setFieldValue('custrecord_administrative_contact_phone', phone);
				subdivisionRecord.setFieldValue('custrecord_administrative_contact_email', email);
				nlapiSubmitRecord(subdivisionRecord, false, true);
			}
		}*/
		
		//Division Manager on builder record and subdivisions
		if(title == '3')
		{
			var builderRecord = nlapiLoadRecord('customer', builder);
			builderRecord.setFieldValue('custentity_builder_division_manager', id);
			nlapiSubmitRecord(builderRecord);
			
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builder);

			var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
			for(var i=0; results != null && results.length > i; i++)
			{
				var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
				subdivisionRecord.setFieldValue('custrecord_division_manager', id);
				subdivisionRecord.setFieldValue('custrecord_division_mgr_email', email);
				nlapiSubmitRecord(subdivisionRecord);
			}	
		}
		
		//Sales Manager on subdivisions
      /*
		 Commented out by Jeff 8/28/2018 - with multiple SMs per builder this MAY have been causing issues
         
		if(title == '5')
		{
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builder);

			var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
			for(var i=0; results != null && results.length > i; i++)
			{
				var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
				subdivisionRecord.setFieldValue('custrecord27', id);
				subdivisionRecord.setFieldValue('custrecord_sales_mgr_email', email);
				nlapiSubmitRecord(subdivisionRecord);
			}	
		}*/
		
		/*if(defValue(teamCal) != '')
		{
			var fromIndex = 0;
			var toIndex = 500;
			var totalApps = 0;
			var appIds = []; 
			
			var filters = [];
			filters[0] = new nlobjSearchFilter('custevent_crm_bsr_team', null, 'is', id);
			filters[1] = new nlobjSearchFilter('custevent_crm_team_calendar', null, 'noneof', teamCal);
		//	filters[2] = new nlobjSearchFilter('status', null, 'anyof',status);
			
			var columns = [];
			columns[0] = new nlobjSearchColumn('internalid');
			
			var search = nlapiCreateSearch('supportcase', filters,columns);
			var resultSet = search.runSearch();				
			var results = resultSet.getResults(fromIndex	,toIndex);
			while(results != null &&  results.length >0)
			{			
			    for(var i=0 ; i<results.length ; i++)
			    {
			    	var appId = results[i].getValue(columns[0]);
			    	appIds.push(appId);
			    	nlapiSubmitField('supportcase', appId,'custevent_crm_team_calendar',teamCal, true);
			    }	
				
			    fromIndex = toIndex;
				toIndex += 500;
				results = resultSet.getResults(fromIndex,toIndex);	
			}	
			totalApps += results.length;
			body = 'Total Apps : '+totalApps;
			body += 'bsrId : '+id+', CalImg : '+teamCal;
			nlapiLogExecution('DEBUG',body,appIds);
		}	*/
	}
	catch(ex)
	{
		 body = 'Exception : '+ex+', Message : '+ex.message;
		 body += 'updateBuilderPersonnelInfo ';
      	 nlapiLogExecution('DEBUG',body);
      	 nlapiSendEmail(author, recipient, subject, body);
	}
}

function defValue(value)
{	
	try
	{ 
	    if(value == null || value == undefined || value == '')
	    value = '';	    
	    return value;
	}
	catch(ex)
	{
		 body = 'Exception : '+ex+', Message : '+ex.message;
      	 nlapiLogExecution('DEBUG',body);
      	 nlapiSendEmail(author, recipient, subject, body);
	}
}