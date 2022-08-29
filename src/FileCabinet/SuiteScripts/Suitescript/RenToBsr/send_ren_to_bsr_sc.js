/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Jul 2017     
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */

/*
 * Type: Schedule 
 * Script : Send REN to BSR (webbee)
 * ScriptUrl : https://1309901.app.netsuite.com/app/common/scripting/script.nl?id=223
 * Dependency : Crypto.js
 */


var body = '';
var author = 4276;
var subject = 'Error | HMS Marketing , REN SC';
var bcc = ['govind@webbe.biz', 'aj@webbeeglobal.com'];


var tmpBODY = 76;
var tmpFOOTER = 77;
var bsrTemplate = 82;
var SecretKey = nlapiLookupField('customrecord_auth_pass_phrase', 1, 'custrecord_secret_key');
var propertyRecType = 'customrecord_property_record';
var d1 = new Date();

function stdTimezoneOffset() {
    var jan = new Date(d1.getFullYear(), 0, 1);
    var jul = new Date(d1.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < stdTimezoneOffset();
}
nlapiLogExecution('DEBUG', 'this.stdTimezoneOffset()', stdTimezoneOffset());
nlapiLogExecution('DEBUG', 'this.getTimezoneOffset()', d1.getTimezoneOffset());

var today2 = new Date();
if (today2.dst()) {
    offset = -4.0

} else {
    offset = -5.0
}


clientDate = new Date();
utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);

var date = new Date(utc + (3600000 * offset));
//var date = new Date();edited on 9-Apr

function sendRenToBSR() {
    try {
        var hour = date.getHours();
        if (hour > 20) // changed by AJ on 16 apr 2018 from 18 -> 21 // Changed by Damazio Midware on Jul 24 2020 from 21 to 20
        {
            return;
        } else {
            var BsrIds = [];
            var results = nlapiSearchRecord('supportcase', '350'); //Refer to line 357 for search structure.

            for (var i = 0; results != null && results.length > i; i++) {

                var bsr = results[i].getValue('custevent_builder_sales_rep_subd'); //primary brs
                if (BsrIds.indexOf(bsr) == -1) {
                    BsrIds.push(bsr);
                }
            }
            nlapiLogExecution('Debug', 'BSR ids:', BsrIds);
            var linkCaseObj = {};
            var NLCaseIds = [];

            //put BSR id below for the test Appointment/Inquiry record .

            //BsrIds = [''];

            if (BsrIds != null && BsrIds.length > 0) {
                var columns = new nlobjSearchColumn('custevent_linked_cases');
                nlapiLogExecution('DEBUG', 'BRSIDs ' + JSON.stringify(BsrIds));
                for (var j = 0; j < BsrIds.length; j++) {
                    var currentBSR = BsrIds[j];
                    var filters = [];
                    filters.push(new nlobjSearchFilter('stage', null, 'is', 'OPEN'));
                    //filters.push(new nlobjSearchFilter('internalid', 'company', 'anyof', ['3642','3643']));
                    //filters.push(new nlobjSearchFilter('internalid', null, 'anyof', ['3642','3643'])); //remove dis
                    filters.push(new nlobjSearchFilter('createddate', null, "onorafter", "11/1/2015 12:00 am"));
                    filters.push(new nlobjSearchFilter('custevent_builder_sales_rep_subd', null, 'is', currentBSR));

                    var cSearch = nlapiSearchRecord('supportcase', null, filters, columns);

                    if (cSearch != null && cSearch.length > 0) {

                        for (var i = 0; i < cSearch.length; i++) {
                            var caseId = cSearch[i].getId();
                            var linkedCase = cSearch[i].getValue(columns);
                            if (linkedCase) {
                                if (!linkCaseObj[linkedCase]) {
                                    linkCaseObj[linkedCase] = {};
                                }
                                if (!linkCaseObj[linkedCase][currentBSR]) {
                                    linkCaseObj[linkedCase][currentBSR] = []
                                }
                                linkCaseObj[linkedCase][currentBSR].push(caseId);
                            } else {
                                if (NLCaseIds.indexOf(caseId) == -1) {
                                    NLCaseIds.push(caseId);
                                }
                            }

                        }

                    }
                }
            }
            var LogBody = 'NLCaseIds : ' + NLCaseIds + ', linkCaseObj : ' + JSON.stringify(linkCaseObj);
            nlapiLogExecution('DEBUG', ' Body : ', LogBody);
            for (var i = 0; i < NLCaseIds.length; i++) {
                nlapiLogExecution('DEBUG', ' Processing : ', [NLCaseIds[i]]);
                processRen([NLCaseIds[i]]);
            }

            for (var linkedCase in linkCaseObj) {
                for (var bsr in linkCaseObj[linkedCase]) {
                    var linkedCasesWithSameBsr = linkCaseObj[linkedCase][bsr];
                    nlapiLogExecution('DEBUG', ' Processing : ', JSON.stringify(linkedCasesWithSameBsr));
                    processRen(linkedCasesWithSameBsr);
                }
            }
            throw "STOP 2";

        }
    } catch (e) {
        nlapiLogExecution('DEBUG', ' err : ', JSON.stringify(e));
    }
}


function processRen(CaseIds) {
    nlapiLogExecution('DEBUG', 'processRen param caseIds' + JSON.stringify(CaseIds));

    CheckGovernance();

    var file = nlapiLoadFile('39813');
    var data = file.getValue();
    var emailSubject = '';
    var emailMerger = nlapiCreateEmailMerger(97);
    emailMerger.setSupportCase(CaseIds[0]);
    var mergeResult = emailMerger.merge();
    var emailBody = mergeResult.getBody();

    nlapiLogExecution('DEBUG', '206');

    var emailBody_table = '';
    var mainBuilderDivision = nlapiLookupField('supportcase', Number(CaseIds[0]), 'company');

    for (var i = 0; i < CaseIds.length; i++) {
        //confirm that the linked cases have the same builder division
        var builderDivision = nlapiLookupField('supportcase', Number(CaseIds[i]), 'company');
        nlapiLogExecution('DEBUG', 'actual caseid:' + CaseIds[i]);
        nlapiLogExecution('DEBUG', 'mainbuilderdivision ' + mainBuilderDivision);
        nlapiLogExecution('DEBUG', 'actual buider division caseid:' + builderDivision);
        if (builderDivision === mainBuilderDivision) {
            nlapiLogExecution('DEBUG', 'Same builder division');

            var SecretCode = SetPropertyForREN(CaseIds[i]);
            var emailMerger_table = nlapiCreateEmailMerger(98);
            emailMerger_table.setSupportCase(CaseIds[i]);
            var mergeResult_table = emailMerger_table.merge();
            var eBody = mergeResult_table.getBody()
            eBody = eBody.replace('encryptId', defVal(SecretCode));
            eBody = eBody.replace(/{/g, '<');
            eBody = eBody.replace(/}/g, '>');
            emailBody_table += eBody;

            CheckGovernance();
            nlapiLogExecution('DEBUG', 'Email body ' + emailBody_table)

        }

    }
    nlapiLogExecution('DEBUG', emailBody_table);

    data = data.replace('{propertyrequested}', emailBody_table);
    emailBody = emailBody.replace('propertyrequested', data);
    nlapiLogExecution('DEBUG', '140');

    var record = nlapiLoadRecord('supportcase', CaseIds[0]);
    var id = record.getFieldValue('id');
    var builderSuppliedLead = record.getFieldValue('custevent_builder_lead');
    var category = record.getFieldValue('category');
    var salesRep = record.getFieldValue('custevent_builder_sales_rep_subd');
    var salesRepCategory = nlapiLookupField('partner', salesRep, 'category');
    var showingDateTime = record.getFieldValue('custevent_showing_date_time');
    var lastEmailTime = record.getFieldValue('custevent_hms_last_ren_sent_date_time');
    var hoursSinceLastEmail = 1;
    var minutesSinceLastEmail = 1;
    var todayDay = date.getDay();
    var todayHour = date.getHours();

    if (lastEmailTime) {
        var convertLastEmailToDateObject = new Date(lastEmailTime);
        hoursSinceLastEmail = ((date.getTime() - convertLastEmailToDateObject.getTime()) / 3600000);
        minutesSinceLastEmail = hoursSinceLastEmail * 60;
    }

    var hoursUntilShowing = '';
    if (showingDateTime) {
        var convertToDateObject = new Date(showingDateTime);
        hoursUntilShowing = ((convertToDateObject.getTime() - date.getTime()) / 3600000);
    }

    var emailNotificationAttempts = record.getFieldValue('custevent_email_notification_attempts');



    nlapiLogExecution('Debug', 'todayDay', todayDay);
    nlapiLogExecution('Debug', 'todayHour', todayHour);
    nlapiLogExecution('Debug', 'emailNotificationAttempts before email', emailNotificationAttempts);
    nlapiLogExecution('Debug', 'minutesSinceLastEmail', minutesSinceLastEmail);
    nlapiLogExecution('Debug', 'hoursUntilShowing', hoursUntilShowing);
    nlapiLogExecution('Debug', 'salesRepCategory', salesRepCategory);


    var records = new Object();
    records['activity'] = id;

    var division = record.getFieldValue('company');
    var imageurl = '';

    try {
        var imageid = nlapiLookupField('customer', division, 'image');
        if (!imageid) {
            var builder_parent = nlapiLookupField('customer', division, 'parent');
            imageid = nlapiLookupField('customer', builder_parent, 'image');
            nlapiLogExecution('debug', 'builder_parent', builder_parent);
            image_file = nlapiLoadFile(imageid);
            imageurl = image_file.getURL();
        } else {
            var image_file = nlapiLoadFile(imageid);
            imageurl = image_file.getURL();
        }
    } catch (ier) {
        nlapiLogExecution('debug', 'err image', ier);
    }

    if (imageurl == '') {
        imageurl = 'https://1309901.app.netsuite.com/core/media/media.nl?id=39790&amp;c=1309901&amp;h=48dbf824375dd894c511';
    } else {
        imageurl = 'https://1309901.app.netsuite.com' + imageurl;
    }

    nlapiLogExecution('debug', 'url', imageurl);
    emailBody = emailBody.replace('logoimage', imageurl);

    if (emailNotificationAttempts > 2) {
        //This is where an email will get sent out to the 'assigned to' and mlsinfo@hmsmarketingservices.com
        var emailMerger = nlapiCreateEmailMerger(48); //48 is converted type of 22
        emailMerger.setSupportCase(id);
        var mergeResult = emailMerger.merge();
        //var emailBody = mergeResult.getBody();

        var assignedTo = record.getFieldValue('assigned');
        /*if(assignedTo)
        {
        	var employeeRecord = nlapiLoadRecord('employee', assignedTo);
        	var employeeEmail = employeeRecord.getFieldValue('email');
        	nlapiSendEmail('3847', employeeEmail, 'Lead follow up required', emailBody, 'mlsinfo@hmsmarketingservices.com', null, records);
        	return;
        }
        else
        {
        	nlapiSendEmail('3847', 'mlsinfo@hmsmarketingservices.com', 'Lead follow up required', emailBody, null, null, records);
        	return;
        }*/
    }
    var sendReminderEmail = false;

    if ((salesRepCategory == 'Administrative Assistant' || salesRepCategory == 'Administrative')) {
        //if its not sunday (6) or sunday (0) 
        if ((todayDay != 6 || todayDay != 0)) {
            // if its between 7am and 6pm
            if (todayHour >= 7 || todayHour <= 18) {
                sendReminderEmail = true;
            }
        }
    } else {
        if (todayHour >= 8 || todayHour <= 20) {
            sendReminderEmail = true;
        }
    }
    nlapiLogExecution('Debug', 'sendReminderEmail', sendReminderEmail);


    // if (sendReminderEmail && minutesSinceLastEmail > 30 && ((hoursUntilShowing != '' && hoursUntilShowing > 1) || hoursUntilShowing == '')) {
    if (sendReminderEmail && minutesSinceLastEmail > 30 ) {
        nlapiLogExecution('DEBUG', 'Variables', 'Entered the main if statement on record ' + id);
        var statusID = record.getFieldValue('status');
        var propertyId = record.getFieldValue('custevent_property');
        var renSent = record.getFieldValue('custevent_ren_sent');
        var renEnabled = record.getFieldValue('custevent_ren_enabled');
        var topLevelBuilder = record.getFieldValue('custevent_builder');
        var subdivision = record.getFieldValue('custevent_subdivision_for_ren');
        var copyOnREN = null;
        var division = record.getFieldValue('company');

        var copyOnRENDivision = '';
        var notificationMethod = '';
        var enableEmailNotification = '';

        if (division) {
            copyOnRENDivision = nlapiLookupField('customer', division, 'custentity_copy_on_ren');
            notificationMethod = nlapiLookupField('customer', division, 'custentity_appt_notification_method');
            enableEmailNotification = nlapiLookupField('customer', division, 'custentity8');
        }

        var showingAssist = record.getFieldValue('custevent_showing_assist');
        var agent = record.getFieldValue('custevent_caller_name');
        var bsrID = record.getFieldValue('custevent_builder_sales_rep_subd');
        var bsrOptOut = record.getFieldValue('custevent_bsr_opt_out');

        if (propertyId) {
            var lot = nlapiLookupField('customrecord_property_record', propertyId, 'custrecord_lot_number');
        }

        var agentFullName = '';
        if (agent) {
            var agentFirstName = nlapiLookupField('customrecord_agent', agent, 'custrecord_agent_first_name');
            var agentLastName = nlapiLookupField('customrecord_agent', agent, 'custrecord_agent_last_name');
            agentFullName = agentFirstName + ' ' + agentLastName;
        } else {
            agentFullName = record.getFieldValue('custevent_agent_for_ren'); //AGENT NAME FOR REN..
        }

        var subject = "Reminder: New Inquiry From " + agentFullName + " For " + subdivision;
        if (defVal(lot) != '') {
            subject += " Lot " + lot;
        }

        var bsrEmail = '';
        if (bsrID) {
            bsrEmail = nlapiLookupField('partner', bsrID, 'email');
        }

        var cc = [];
        var salesManager = record.getFieldValue('custevent7');
        var salesManagerEmail = '';

        if (salesManager) {
            salesManagerEmail = nlapiLookupField('partner', salesManager, 'email');
            //cc[0] = salesManagerEmail;
        }

        if (notificationMethod == '1' && enableEmailNotification == 'T') {

            /*if(showingAssist == 'T')
            {
                var body = nlapiMergeRecord(20, 'supportcase', id);
                nlapiSendEmail('3847', bsrEmail, subject, body.getValue(), null, null, records);
            }
            
            else
            {*/
            //var body = nlapiMergeRecord(22, 'supportcase', id);

            nlapiLogExecution('DEBUG', 'Variables', 'Getting ready to send the email on record ' + id);

            var body = emailBody;
            body = body.replace('bsrid', bsrID);
            nlapiLogExecution('Debug', 'bsrEmail', bsrEmail);

            if (bsrEmail) {
                //template 97
                nlapiLogExecution('DEBUG', 'send bsr email', 'Sending sales manager email');
                nlapiSendEmail('3847', bsrEmail, subject, body, [], null, records);
                emailNotificationAttempts++;
                nlapiSubmitField('supportcase', CaseIds[0], 'custevent_email_notification_attempts', emailNotificationAttempts);
                nlapiLogExecution('Debug', 'emailNotificationAttempts after email', emailNotificationAttempts);
            } else {
                nlapiLogExecution('Debug', 'BSRemail empty ', CaseIds[0]);
            }

            if (salesManagerEmail) {
                //template 99
                sendSalesManagerReminderEmail(CaseIds[0], data, imageurl, '3847', subject, records, salesManagerEmail);
            }

        }

        if (sendReminderEmail && hoursUntilShowing != '' && hoursUntilShowing < 1) {
            SendShowingDateEmail(id,records);
        }

    } else if (sendReminderEmail && hoursUntilShowing != '' && hoursUntilShowing < 1) {
        SendShowingDateEmail(id,records);
    } else {
        nlapiLogExecution('Debug', 'Not applicable for REN:', CaseIds);
    }
}


function SendShowingDateEmail(pId,pRecords){
    nlapiLogExecution('Debug', 'Send Check Netsuite Dashboard email to mlsinfo for record: ', pId);
    var mlsInfoEmail = 'mlsinfo@hmsmarketingservices.com';
    // var mlsInfoEmail = 'fernanda.carmona@midware.net';
    var subject = 'Check Netsuite Dashboard';
    var appointmentLink = 'https://1309901.app.netsuite.com/app/crm/support/supportcase.nl?id=' + pId;
    var body = '<p>There is a showing scheduled in less than an hour from now that is still open in Netsuite.</p><a href=' + appointmentLink + '>Click here to see the Appointment</a>';
    nlapiSendEmail('3847', mlsInfoEmail, subject, body, null, null, pRecords);
}


function SetPropertyForREN(caseId) {
    try {
        var PropertyId = nlapiLookupField('supportcase', caseId, 'custevent_property');
        if (defVal(PropertyId) != '') {
            var encrypted = CryptoJS.AES.encrypt(PropertyId, SecretKey);
            var decrypted = CryptoJS.AES.decrypt(encrypted, SecretKey).toString();
            var houseNumber = nlapiLookupField(propertyRecType, PropertyId, 'custrecord_house_number'); //house number
            var enableREN = nlapiLookupField(propertyRecType, PropertyId, 'custrecord12.custentity_enable_ren'); //builder division /enable ren
            var street = nlapiLookupField(propertyRecType, PropertyId, 'custrecord31', true); //street text
            var fields = ['custevent_ren_enabled', 'custevent_property_for_ren']; // REN_ENABLED, PROPERTY FOR REN
            //nlapiSubmitField('supportcase',caseId, fields, [enableREN,houseNumber+' '+street], true);//set
            //nlapiSubmitField(propertyRecType, PropertyId, 'custrecord_secret_code', decrypted, true);
            return decrypted;
        }
        return null;
    } catch (ex) {
        body = 'SetPropertyForREN : ' + ex;
        body += ex.name + ' : ' + ex.message;
        nlapiSendEmail(author, bcc, subject, body);
        nlapiLogExecution('DEBUG', ' Body : ', body);
        return null;
    }
}



function defVal(value) {
    try {
        if (value == null || value == undefined || value == 'undefined')
            value = '';
        return value;
    } catch (ex) {
        body = 'defVal : ' + ex;
        body += ex.name + ' : ' + ex.message;
        nlapiSendEmail(author, bcc, subject, body);
        nlapiLogExecution('DEBUG', ' Body : ', body);
        return '';
    }
}

//Function CheckGovernance

function CheckGovernance() {
    try {
        var currentContext = nlapiGetContext();
        if (currentContext.getRemainingUsage() < 100) {
            body = 'Remaining Usage :', currentContext.getRemainingUsage();
            nlapiLogExecution('DEBUG', body);
            var state = nlapiYieldScript();
            if (state.status == 'FAILURE') {
                body = 'Failed to yield script, exiting:' + ', Reason = ' + state.reason + ' / Size = ' + state.size;
                nlapiLogExecution('DEBUG', body);
            } else if (state.status == 'RESUME') {
                body = 'Resuming script because of : ' + state.reason + '/ Size = ' + state.size;
                nlapiLogExecution('DEBUG', body);
            }
        }
    } catch (ex) {
        body = 'Exception : ' + ex.name;
        body += '\n Function : CheckGovernance';
        body += '\n Message : ' + ex.message;
        nlapiLogExecution('DEBUG', body);
        nlapiSendEmail(author, bcc, subject, body);
    }
}


//Search Used id:350
//var supportcaseSearch = nlapiSearchRecord("supportcase",null,
//		[
//		   ["stage","anyof","OPEN"], 
//		   "AND", 
//		   ["custevent_builder_sales_rep_subd.custentity_opt_out_rtan","is","F"], 
//		   "AND", 
//		   ["createddate","onorafter","11/1/2015 12:00 am"]
//		], 
//		[
//		   new nlobjSearchColumn("custevent_builder_sales_rep_subd",null,null)
//		]
//		);


function sendSalesManagerReminderEmail(pCaseId, data, imageurl, callCenter, emailSubject, records, salesManagerEmail) {

    nlapiLogExecution('DEBUG', 'sendSalesManagerReminderEmail', 'Sending sales manager email');

    var emailMerger = nlapiCreateEmailMerger(99); //smTemplate
    emailMerger.setSupportCase(pCaseId);
    var mergeResult = emailMerger.merge();
    var emailbody_nl = mergeResult.getBody();
    emailbody_nl = emailbody_nl.replace('propertyrequested', data);
    emailbody_nl = emailbody_nl.replace('logoimage', imageurl);
    nlapiSendEmail(callCenter, salesManagerEmail, emailSubject, emailbody_nl, [], null, records, null, true);

}