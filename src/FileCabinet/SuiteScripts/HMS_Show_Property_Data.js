function showProperty(request, response)
{
    var propertyid = request.getParameter('pid');
    if (request.getMethod() == 'GET')
    {
        if(propertyid)
        {
          nlapiLogExecution("DEBUG","propertyid",propertyid)
            var propertyRecord = nlapiLoadRecord('customrecord_property_record', propertyid);
            var pthouseno = propertyRecord.getFieldValue('custrecord_house_number');
            var ptstreet = propertyRecord.getFieldText('custrecord31');
            //var ptsubdivision = propertyRecord.getFieldValue('custrecordcustrecordsubdname');
            var subdiv = propertyRecord.getFieldValue('custrecordcustrecordsubdname');
            var ptsubdivision = '';
            if(subdiv)
            {
                ptsubdivision = nlapiLookupField('customrecord_subdivision',subdiv,'custrecord_subdivision_id');
            }
            var ptlotno = propertyRecord.getFieldValue('custrecord_lot_number');
            
            var form = nlapiCreateForm('Property Details');
            var fieldhouse = form.addField('custpage_houseno','inlinehtml');
            fieldhouse.setDefaultValue('House No.: '+pthouseno);
            var fieldstreet = form.addField('custpage_street','inlinehtml');
            fieldstreet.setDefaultValue('Street : '+ptstreet);
            var fieldsubdivision = form.addField('custpage_subdivision','inlinehtml');
            fieldsubdivision.setDefaultValue('Subdivision: '+ptsubdivision);
            var fieldlotno = form.addField('custpage_lotno','inlinehtml');
            fieldlotno.setDefaultValue('Lot No. : '+ptlotno);
            var propid = form.addField('custpage_propertyid','text','property id');
            propid.setDefaultValue(propertyid);
            propid.setDisplayType('hidden');
            form.addField('custpage_building_permit', 'file', 'Upload Building Permit Here');
            form.addSubmitButton();
            response.writePage(form);
        }
        else
        {
            var form = nlapiCreateForm('Parameter Missing');
            var fieldlotno = form.addField('custpage_message','inlinehtml');
            fieldlotno.setDefaultValue('Property is missing');
            response.writePage(form);
        }
    
    }
    else
    {
        var buildingPermit = request.getFile('custpage_building_permit');
        var propertyRecordID =request.getParameter('custpage_propertyid');  //request.getFile('custpage_propertyid');
        if(buildingPermit)
        {
            buildingPermit.setFolder(14903);
            var buildingPermitfile = nlapiSubmitFile(buildingPermit);
            nlapiAttachRecord("file", buildingPermitfile, "customrecord_property_record", propertyRecordID);
          
          var html = '<html><body><h1>Thank you for the permit submission.</h1></body></html>';
response.write(html); 
        }
        var pformurl = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=218&deploy=1&compid=1309901&h=a10cae482e7d12f43423&pid='+propertyRecordID;
    }
}