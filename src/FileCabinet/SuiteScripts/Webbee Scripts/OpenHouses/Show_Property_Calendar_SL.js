/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Nov 2016     Pranjal
 *
 */

var body = '';
var author = '-5';
var subject = 'HMS Candendar';
var bcc = 'jmcdonald@hmsmarketingservices.com';
var file = nlapiLoadFile(22906);
var html = file.getValue();


function ShowCalendar(request, response)
{
    try
    {
        var form = nlapiCreateForm('Open Houses Calendar');
        var field1=  form.addField('custpage_selprop','select', 'Property', 'customrecord_property_record');
        field1.setDisplaySize(30,50);
        form.addField('custpage_property', 'textarea', 'Selected').setDisplayType('inline');
        var myInlineHtml = form.addField('calhtml', 'inlinehtml');
        myInlineHtml.setDefaultValue(html);
        form.setScript(208);
    	response.writePage(form);
    }
    catch(ex)
    {
    	body = 'ShowCalendar : '+ex;
    	body += ex.name+' : '+ex.message;
    	nlapiSendEmail(author,bcc[0], subject, body);
    	nlapiLogExecution('DEBUG', ' Body : ',body);
    }
}

function OnFieldChange(type, name, linenum)
{
	try
	{
		if(name == 'custpage_selprop')
		{
			var property = nlapiGetFieldText(name);
			nlapiSetFieldValue('custpage_property', property);
		}	
	}
    catch(ex)
    {
    	body = 'ShowCalendar : '+ex;
    	body += ex.name+' : '+ex.message;
    	nlapiSendEmail(author,bcc[0], subject, body);
    	nlapiLogExecution('DEBUG', ' Body : ',body);
    }
}
