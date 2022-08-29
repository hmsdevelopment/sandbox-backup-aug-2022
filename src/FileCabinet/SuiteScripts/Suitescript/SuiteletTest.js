/**
 * @author Jeff McDonald
 */
function demoSimpleForm(request, response)
{
if ( request.getMethod() == 'GET' )
{
var form = nlapiCreateForm('Simple Form');
var field = form.addField('textfield','text', 'Text');
field.setLayoutType('normal','startcol')
form.addField('datefield','date', 'Date');
form.addField('currencyfield','currency', 'Currency');
form.addField('textareafield','textarea', 'Textarea');
var select = form.addField('selectfield','select','Custom');
select.addSelectOption('','');
select.addSelectOption('a','Albert');
select.addSelectOption('b','Baron');
select.addSelectOption('c','Chris');
select.addSelectOption('d','Drake');
select.addSelectOption('e','Edgar');
var machine = form.addSubList('machine','editor','Editor', 'tab1');
machine.addField('machine1','date', 'Date');
machine.addField('machine2','text', 'Text');
machine.addField('machine3','currency', 'Currency');
machine.addField('machine4','textarea', 'Large Text');
machine.addField('machine5','float', 'Float');
form.addSubmitButton('Submit');
response.writePage( form );
}
else
dumpResponse(request,response);
}