function createEventForCase(type)
{
	try
	{
		//if(type == 'create')
		{
			var user = nlapiGetUser();
			var id = nlapiGetRecordId();
			var recordtype = nlapiGetRecordType();
			var record = nlapiLoadRecord(recordtype,id);
			var title = record.getFieldValue('title');
			var stage = record.getFieldValue('stage');
			var eventrelid = record.getFieldValue('custevent_related_event');
			var isclosed = false;
			if((stage == 'Closed'))
			{
				isclosed = true;
			}
			 nlapiLogExecution('DEBUG', 'isclosed', 'isclosed = ' + isclosed+' eventrelid '+eventrelid);
			if((isclosed == false) && (type == 'create'))
			{
				var startdate = record.getFieldValue('custevent_showing_date_scheduled');
				var starttime = record.getFieldValue('custevent_showing_time_scheduled');
				var company = record.getFieldValue('company');
				 nlapiLogExecution('DEBUG', 'Values', 'title = ' + title+' startdate '+startdate+' starttime '+starttime);
				 /*
				 var linecount = record.getLineItemCount('event');
				 nlapiLogExecution('DEBUG', 'linecount', 'linecount = ' + linecount);
				record.selectNewLineItem('event');
				
				record.setCurrentLineItemValue('event','title',title); 
				
				record.setCurrentLineItemValue('event', 'startdate', startdate);
				
				record.setCurrentLineItemValue('event','starttime', starttime);
				record.setCurrentLineItemValue('event','endtime', '11:59 pm');
				record.commitLineItem('event'); 
				id = nlapiSubmitRecord(record,false,true);
				nlapiLogExecution('DEBUG', 'id', 'id = ' + id);
				*/
				var rec = nlapiCreateRecord('calendarevent');
				rec.setFieldValue('title',title); 
				
				rec.setFieldValue('startdate', startdate);
				
				rec.setFieldValue('starttime', starttime);
				rec.setFieldValue('endtime', '11:59 pm');
				rec.setFieldValue('status', 'CONFIRMED');
				rec.setFieldValue('accesslevel', 'PUBLIC');
				rec.setFieldValue('organizer', user);
				rec.setFieldValue('company', company);
				rec.setFieldValue('remindertype', 'POPUP');
				rec.setFieldValue('reminderminutes', '0');
				rec.setFieldValue('supportcase', id);
				var eventid = nlapiSubmitRecord(rec,false,true);
				 nlapiLogExecution('DEBUG', 'eventid', 'eventid = ' + eventid);
				 record.setFieldValue('custevent_related_event',eventid);
				 nlapiSubmitRecord(record,false,true);
			}
			else
			{
				if(eventrelid)
				{
					try
					{
						
						var eventid = nlapiDeleteRecord('calendarevent',eventrelid);
						nlapiLogExecution('DEBUG', 'eventid', 'eventid = ' + eventid);
					}
					catch(e)
					{
						nlapiLogExecution('ERROR', 'Error while delete Reason ' , e.message);
					}
				}
				/*
				var vFilters1 = [ new nlobjSearchFilter('supportcase', null, 'anyof', id)];
				
				var vSearchResults2 = nlapiSearchRecord('calendarevent', null, vFilters1, null);
				
				for(var i=0;i < vSearchResults2.length;i++)
				{
					try
					{
						var eventidi = vSearchResults2[i].getId();
						var eventtype = vSearchResults2[i].getRecordType();
						vareventid = nlapiDeleteRecord(eventtype,eventidi);
						nlapiLogExecution('DEBUG', 'eventid', 'eventid = ' + eventid);
					}
					catch(e)
					{
						nlapiLogExecution('ERROR', 'Error while delete Reason ' , e.message);
					}
				}
			*/				
			}
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Error Reason ' , e.message);
	}
}