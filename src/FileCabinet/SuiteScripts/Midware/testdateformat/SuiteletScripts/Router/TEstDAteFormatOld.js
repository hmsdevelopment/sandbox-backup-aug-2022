function lookupPhoneBackendSuitelet(request, response)
{
	if(request.getMethod() == 'GET') {
        response.write("Current date is " + currentdate())
	}
}

function currentdate() {
    var cdate = new Date();

    nlapiLogExecution('DEBUG', 'Date prev add', nlapiDateToString(cdate, "datetime"));
    cdate.setHours(cdate.getHours() + 3);
    nlapiLogExecution('DEBUG', 'Date after add 45 hours', nlapiDateToString(cdate, "datetime"));


    var dateStr = nlapiDateToString(cdate, "datetime")
    return dateStr;
}