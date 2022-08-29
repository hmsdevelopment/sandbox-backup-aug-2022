/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(["N/record","N/ui/serverWidget", "N/url"],

function(record, serverWidget, url) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
	
	
	//*****************************************
	//Re-add the salutation field when form is reworked and the list is a cleaner drop down.
	
	
    function onRequest(context) {
    	if (context.request.method === 'GET') {
    		var builderId = context.request.parameters.builderid;
    		//var builderId = 4988;
    		var recBuilder = record.load({
    			type:record.Type.PARTNER,
    			id:builderId
    		});
    		
    		var firstName = recBuilder.getText("firstname");
    		var lastName = recBuilder.getText("lastname");
    		//var salutation  = recBuilder.getValue("custentity_salutation");
    		var email = recBuilder.getText("email");
    		var phone = recBuilder.getValue("mobilephone");
    		var title = recBuilder.getValue("custentity_job_title");
    		
            var form = serverWidget.createForm({
                title: 'Confirm Details'
            });
            
            var fldFirstName = form.addField({
                id: 'custpage_firstname',
                type: serverWidget.FieldType.TEXT,
                label: 'First Name'
            });
            fldFirstName.layoutType = serverWidget.FieldLayoutType.NORMAL;
            fldFirstName.updateBreakType({breakType : serverWidget.FieldBreakType.STARTCOL});
            
            var fldLastName = form.addField({
                id: 'custpage_lastname',
                type: serverWidget.FieldType.TEXT,
                label: 'Last Name'
            });
            
//            var fldSalutation = form.addField({
//                id: 'custpage_salutation',
//                type: serverWidget.FieldType.SELECT,
//                label: 'Salutation',
//                source: 'customlist_salutation'
//            });
            
            var fldEmail = form.addField({
                id: 'custpage_email',
                type: serverWidget.FieldType.EMAIL,
                label: 'Email'
            });
            
            var fldPhone = form.addField({
                id: 'custpage_phone',
                type: serverWidget.FieldType.PHONE,
                label: 'Phone'
            });
            
            var fldTitle = form.addField({
                id: 'custpage_title',
                type: serverWidget.FieldType.SELECT,
                label: 'Title',
                source: 'customlist_job_titles'
            });
            
            var fldBuilderId = form.addField({
                id: 'custpage_builderid',
                type: serverWidget.FieldType.TEXT,
                label: 'BuilderId'
            });
            
            fldBuilderId.updateDisplayType({
                displayType : serverWidget.FieldDisplayType.HIDDEN
            });
            
            fldBuilderId.defaultValue = builderId;
            fldFirstName.defaultValue = firstName;
            fldLastName.defaultValue = lastName;
           // fldSalutation.defaultValue = salutation;
            fldEmail.defaultValue = email;
            fldPhone.defaultValue = phone;
            fldTitle.defaultValue = title;
            
            fldFirstName.isMandatory = true;
            fldLastName.isMandatory = true;
            //fldSalutation.isMandatory = true;
            fldEmail.isMandatory = true;
            fldPhone.isMandatory = true;
            fldTitle.isMandatory = true;
            
            form.addSubmitButton({
                label: 'Save'
            });

            context.response.writePage(form);
            
        } 
    	
    	
    	if (context.request.method === 'POST') {
    		var builderId = context.request.parameters.custpage_builderid;
    		var firstName =  context.request.parameters.custpage_firstname;
    		var lastName =  context.request.parameters.custpage_lastname;
    		//var salutation  =  context.request.parameters.custpage_salutation;
    		var email =  context.request.parameters.custpage_email;
    		var phone =  context.request.parameters.custpage_phone;
    		var title =  context.request.parameters.custpage_title;
    		 
    		var recBuilder = record.load({
    			type:record.Type.PARTNER,
    			id:builderId
    		});
    		
    		recBuilder.setValue({fieldId:"firstname",value:firstName});
    		recBuilder.setValue({fieldId:"lastname",value:lastName});
    		//recBuilder.setValue({fieldId:"custentity_salutation",value:salutation});
    		recBuilder.setValue({fieldId:"email",value:email});
    		recBuilder.setValue({fieldId:"mobilephone",value:phone});
    		recBuilder.setValue({fieldId:"custentity_job_title",value:title});
    		
    		recBuilder.save();
    		
    		var urlBuilder = url.resolveRecord({
    		    recordType: record.Type.PARTNER,
    		    recordId: builderId
    		});
    		
            context.response.write("Details Saved! You may close this window." );
            
        } 
    }

    return {
        onRequest: onRequest
    };
    
});
