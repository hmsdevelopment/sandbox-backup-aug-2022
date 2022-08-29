/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/runtime", "N/search", "N/task", "N/email", "N/record", "N/render", "N/file", "../Library/SendEmailsAppointment", "../Crypto/Crypto.js"], function (require, exports, log, runtime, search, task, email, record, render, file, library, CryptoJS) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function execute(pContext) {
        try {
            var pStep = runtime.getCurrentScript().getParameter({ name: "custscript_mw_step_value" });
            var index1 = Number(runtime.getCurrentScript().getParameter({ name: "custscript_mw_index1" }));
            var index2 = Number(runtime.getCurrentScript().getParameter({ name: "custscript_mw_index2" }));
            var jsonData = JSON.parse(String(runtime.getCurrentScript().getParameter({ name: "custscript_mw_json_data" })));
            if (pStep == 'First') {
                builtJsonInfo(index1, index2, jsonData);
            }
            else if (pStep == 'Second') {
                sendEmailsLinkedCases(index1, index2, jsonData);
            }
            else if (pStep == 'Third') {
                sendEmailsNonLinkedCases(index1, index2, jsonData);
            }
        }
        catch (pError) {
            handleError(pError);
        }
    }
    exports.execute = execute;
    function builtJsonInfo(pIndex1, pIndex2, pJsonData) {
        var appoiments = search.load({ id: String(900) }).runPaged({ pageSize: 1000 });
        var jsonData = pJsonData ? pJsonData : { linkedcases: {}, nonlinkedcases: [] };
        for (var i = pIndex1 ? pIndex1 : 0; i < appoiments.pageRanges.length; i++) {
            var page = appoiments.fetch({ index: appoiments.pageRanges[i].index });
            var _loop_1 = function (j) {
                if (runtime.getCurrentScript().getRemainingUsage() < 1000) {
                    log.debug("Excution", "Re-Scheduled");
                    task.create({
                        taskType: task.TaskType.SCHEDULED_SCRIPT,
                        scriptId: runtime.getCurrentScript().id,
                        deploymentId: runtime.getCurrentScript().deploymentId,
                        params: {
                            "custscript_mw_step_value": "First",
                            "custscript_mw_index1_value": i,
                            "custscript_mw_index2_value": j,
                            "custscript_mw_json_data": JSON.stringify(jsonData)
                        }
                    }).submit();
                    return { value: void 0 };
                }
                else {
                    var emailsNonBsr_1 = [];
                    var internalId = page.data[j].getValue('internalid');
                    var propertyId = page.data[j].getValue('custevent_property');
                    var agentName = page.data[j].getValue('custevent_agent_for_ren');
                    var division = page.data[j].getValue('company');
                    var subdivision = page.data[j].getValue('custevent_subdivision_for_ren');
                    var bsrId = page.data[j].getValue('custevent_builder_sales_rep_subd');
                    var salesManager = page.data[j].getValue('custevent7');
                    var callerType = page.data[j].getValue('custevent_caller_type');
                    var linkedCases = page.data[j].getValue('custevent_linked_cases');
                    var copyRen = page.data[j].getValue({ name: 'custentity_copy_on_ren', join: 'company' });
                    var copyAppt = page.data[j].getValue({ name: 'custentity_copy_appt_insp_req', join: 'company' });
                    var lot = page.data[j].getValue('custevent_lot_number');
                    var salesRepCategory = page.data[j].getValue({ name: 'category', join: 'CUSTEVENT_BUILDER_SALES_REP_SUBD' });
                    var showingDateTime = page.data[j].getValue('custevent_showing_date_time');
                    var lastEmailTime = page.data[j].getValue('custevent_hms_last_ren_sent_date_time');
                    var notificationMethod = page.data[j].getValue({ name: 'custentity_appt_notification_method', join: 'company' });
                    var enabledNotification = page.data[j].getValue({ name: 'custentity8', join: 'company' });
                    var status_1 = page.data[j].getValue('status');
                    // log.debug("Result", page.data[j]);
                    if (copyRen) {
                        String(copyRen).split(',').map(function (element) {
                            emailsNonBsr_1.push(element);
                        });
                    }
                    if (callerType == '10' || callerType == '3') {
                        if (copyAppt) {
                            String(copyAppt).split(',').map(function (element) {
                                emailsNonBsr_1.push(element);
                            });
                        }
                    }
                    if (linkedCases) {
                        if (jsonData.linkedcases[String(linkedCases)]) {
                            if (jsonData.linkedcases[String(linkedCases)][String(bsrId)]) {
                                jsonData.linkedcases[String(linkedCases)][String(bsrId)].push({
                                    id: internalId,
                                    propertyId: propertyId,
                                    agentName: agentName,
                                    division: division,
                                    subdivision: subdivision,
                                    salesManager: salesManager,
                                    callerType: callerType,
                                    bsrId: bsrId,
                                    lot: lot,
                                    linkedcase: linkedCases,
                                    emailsNonBsr: emailsNonBsr_1,
                                    salesRepCategory: salesRepCategory,
                                    showingDateTime: showingDateTime,
                                    lastEmailTime: lastEmailTime,
                                    notificationMethod: notificationMethod,
                                    enabledNotification: enabledNotification,
                                    status: status_1
                                });
                            }
                            else {
                                jsonData.linkedcases[String(linkedCases)][String(bsrId)] = [{
                                        id: internalId,
                                        propertyId: propertyId,
                                        agentName: agentName,
                                        division: division,
                                        subdivision: subdivision,
                                        salesManager: salesManager,
                                        callerType: callerType,
                                        bsrId: bsrId,
                                        lot: lot,
                                        linkedcase: linkedCases,
                                        emailsNonBsr: emailsNonBsr_1,
                                        salesRepCategory: salesRepCategory,
                                        showingDateTime: showingDateTime,
                                        lastEmailTime: lastEmailTime,
                                        notificationMethod: notificationMethod,
                                        enabledNotification: enabledNotification,
                                        status: status_1
                                    }];
                            }
                        }
                        else {
                            jsonData.linkedcases[String(linkedCases)] = {};
                            jsonData.linkedcases[String(linkedCases)][String(bsrId)] = [{
                                    id: internalId,
                                    propertyId: propertyId,
                                    agentName: agentName,
                                    division: division,
                                    subdivision: subdivision,
                                    salesManager: salesManager,
                                    callerType: callerType,
                                    bsrId: bsrId,
                                    lot: lot,
                                    linkedcase: linkedCases,
                                    emailsNonBsr: emailsNonBsr_1,
                                    salesRepCategory: salesRepCategory,
                                    showingDateTime: showingDateTime,
                                    lastEmailTime: lastEmailTime,
                                    notificationMethod: notificationMethod,
                                    enabledNotification: enabledNotification,
                                    status: status_1
                                }];
                        }
                    }
                    else {
                        jsonData.nonlinkedcases.push({
                            id: internalId,
                            propertyId: propertyId,
                            agentName: agentName,
                            division: division,
                            subdivision: subdivision,
                            salesManager: salesManager,
                            callerType: callerType,
                            bsrId: bsrId,
                            lot: lot,
                            emailsNonBsr: emailsNonBsr_1,
                            salesRepCategory: salesRepCategory,
                            showingDateTime: showingDateTime,
                            lastEmailTime: lastEmailTime,
                            notificationMethod: notificationMethod,
                            enabledNotification: enabledNotification,
                            status: status_1
                        });
                    }
                    log.debug('Json Data', jsonData);
                }
            };
            for (var j = pIndex2 ? pIndex2 : 0; j < page.data.length; j++) {
                var state_1 = _loop_1(j);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        log.debug("Json Data", jsonData);
        sendEmailsLinkedCases(0, 0, jsonData);
    }
    function sendEmailsLinkedCases(pIndex1, pIndex2, pJsonData) {
        var keys = Object.keys(pJsonData.linkedcases);
        var date = calcTime(-5);
        log.debug('Date', date);
        log.debug("Keys", keys);
        for (var i = pIndex1 ? pIndex1 : 0; i < keys.length; i++) {
            var keysBsr = Object.keys(pJsonData.linkedcases[keys[i]]);
            log.debug("Keys Bsr", keysBsr);
            if (runtime.getCurrentScript().getRemainingUsage() < 1000) {
                log.debug("Excution", "Re-Scheduled");
                task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    params: {
                        "custscript_mw_step_value": "Second",
                        "custscript_mw_index1_value": i,
                        "custscript_mw_index2_value": 0,
                        "custscript_mw_json_data": JSON.stringify(pJsonData)
                    }
                }).submit();
                return;
            }
            else {
                log.debug('Test', pJsonData.linkedcases[keys[i]][keysBsr[0]]);
                for (var j = pIndex2 ? pIndex2 : 0; j < keysBsr.length; j++) {
                    var arrEmails = [];
                    var emailBodyTable = '';
                    var imageurl = void 0;
                    for (var z = 0; z < pJsonData.linkedcases[keys[i]][keysBsr[j]].length; z++) {
                        arrEmails = arrEmails.concat(pJsonData.linkedcases[keys[i]][keysBsr[j]][z].emailsNonBsr);
                        var secretCode = SetPropertyForREN(pJsonData.linkedcases[keys[i]][keysBsr[j]][z].id);
                        var emailMergerTable = render.mergeEmail({ templateId: 98, supportCaseId: Number(pJsonData.linkedcases[keys[i]][keysBsr[j]][z].id) });
                        var eBody = emailMergerTable.body;
                        eBody = eBody.replace('encryptId', secretCode ? secretCode : '');
                        eBody = eBody.replace(/{/g, '<');
                        eBody = eBody.replace(/}/g, '>');
                        emailBodyTable += eBody;
                    }
                    var callCenter = 3847;
                    var fileData = file.load({ id: '39813' }).getContents();
                    var emailMerger = render.mergeEmail({ templateId: 97, supportCaseId: Number(pJsonData.linkedcases[keys[i]][keysBsr[0]][0].id) });
                    var emailBody = emailMerger.body;
                    var emailSubject = '';
                    fileData = fileData.replace('{propertyrequested}', emailBodyTable);
                    emailBody = emailBody.replace('propertyrequested', fileData);
                    var hoursSinceLastEmail = 1;
                    var minutesSinceLastEmail = 60; // To Test
                    var todayDay = date.getDay();
                    var todayHour = date.getHours();
                    var hoursUntilShowing = void 0;
                    if (pJsonData.linkedcases[keys[i]][keysBsr[0]][0].lastEmailTime) {
                        var convertLastEmailToDateObject = new Date(pJsonData.linkedcases[keys[i]][keysBsr[0]][0].lastEmailTime);
                        log.debug('convertLastEmailToDateObject', convertLastEmailToDateObject);
                        hoursSinceLastEmail = ((date.getTime() - convertLastEmailToDateObject.getTime()) / 3600000);
                        log.debug('hour', hoursSinceLastEmail);
                        minutesSinceLastEmail = hoursSinceLastEmail * 60;
                        log.debug('minutesSinceLastEmail', minutesSinceLastEmail);
                    }
                    if (pJsonData.linkedcases[keys[i]][keysBsr[0]][0].showingDateTime) {
                        var convertToDateObject = new Date(pJsonData.linkedcases[keys[i]][keysBsr[0]][0].showingDateTime);
                        log.debug('convertToDateObject', convertToDateObject);
                        hoursUntilShowing = ((convertToDateObject.getTime() - date.getTime()) / 3600000);
                        log.debug('hoursUntilShowing', hoursUntilShowing);
                    }
                    try {
                        var imageid = search.lookupFields({ type: 'customer', id: String(pJsonData.linkedcases[keys[i]][keysBsr[0]][0].division), columns: 'image' }).image[0];
                        log.debug("Image", imageid);
                        if (!imageid) {
                            var builderParent = search.lookupFields({ type: 'customer', id: String(pJsonData.linkedcases[keys[i]][keysBsr[0]][0].division), columns: 'parent' }).parent[0];
                            builderParent ? builderParent.value : '';
                            if (builderParent) {
                                imageid = search.lookupFields({ type: 'customer', id: Number(builderParent), columns: 'image' }).image[0].value;
                                log.debug("Image", imageid);
                                log.debug("Builder Parent", builderParent);
                                var imageFile = file.load(imageid);
                                imageurl = imageFile.url;
                            }
                        }
                        else {
                            var imageFile = file.load(imageid.value);
                            imageurl = imageFile.url;
                        }
                    }
                    catch (ier) {
                        log.error('Err image', ier);
                    }
                    if (imageurl == '') {
                        imageurl = 'https://system.na3.netsuite.com/core/media/media.nl?id=39790&amp;c=1309901&amp;h=48dbf824375dd894c511';
                    }
                    else {
                        imageurl = 'https://system.na3.netsuite.com' + imageurl;
                    }
                    emailBody = emailBody.replace('logoimage', imageurl);
                    var sendReminderEmail = false;
                    log.debug('Today', todayDay + '  ' + todayHour);
                    if ((pJsonData.linkedcases[keys[i]][keysBsr[0]][0].salesRepCategory == 'Administrative Assistant' || pJsonData.linkedcases[keys[i]][keysBsr[0]][0].salesRepCategory == 'Administrative')) {
                        //if its not sunday (6) or sunday (0) 
                        if ((todayDay != 6 && todayDay != 0)) {
                            // if its between 7am and 6pm
                            if (todayHour >= 7 && todayHour <= 18) {
                                sendReminderEmail = true;
                            }
                        }
                    }
                    else {
                        if (todayHour >= 8 && todayHour <= 20) {
                            sendReminderEmail = true;
                        }
                    }
                    log.debug('sendReminderEmail', sendReminderEmail);
                    log.debug('minutesSinceLastEmail', minutesSinceLastEmail);
                    log.debug('hoursUntilShowing', hoursUntilShowing);
                    log.debug('Id Case', pJsonData.linkedcases[keys[i]][keysBsr[0]][0].id);
                    // if (sendReminderEmail && minutesSinceLastEmail > 30 && ((hoursUntilShowing != '' && hoursUntilShowing > 1) || !hoursUntilShowing)) {
                    if (true) {
                        var subject = "(New Script) Reminder: New Inquiry From " + pJsonData.linkedcases[keys[i]][keysBsr[0]][0].agentName + " For " + pJsonData.linkedcases[keys[i]][keysBsr[0]][0].subdivision + ' ' + pJsonData.linkedcases[keys[i]][keysBsr[0]][0].lot;
                        if (pJsonData.linkedcases[keys[i]][keysBsr[0]][0].notificationMethod == '1' && pJsonData.linkedcases[keys[i]][keysBsr[0]][0].enabledNotification == true) {
                            var statusID = pJsonData.linkedcases[keys[i]][keysBsr[0]][0].status;
                            if (statusID == '1' || statusID == '10' || statusID == '2' || statusID == '3') {
                                var body_1 = emailBody;
                                var bsrRecipients = sendBsrTeam(keysBsr[j]);
                                for (var j_1 = 0; j_1 < bsrRecipients.length; j_1++) {
                                    var bodyAux = body_1.replace('bsrid', String(bsrRecipients[j_1]));
                                    var name_1 = search.lookupFields({ type: 'partner', id: String(bsrRecipients[j_1]), columns: 'firstname' }).firstname;
                                    bodyAux = bodyAux.replace('bsr_name', name_1);
                                    email.send({
                                        author: callCenter,
                                        recipients: bsrRecipients[j_1],
                                        subject: subject,
                                        body: bodyAux,
                                        relatedRecords: { activityId: pJsonData.linkedcases[keys[i]][keysBsr[0]][0].id }
                                    });
                                }
                                var currentDate = library.getCurrentTime();
                                var emailSent = record.submitFields({
                                    id: pJsonData.linkedcases[keys[i]][keysBsr[0]][0].id,
                                    type: 'supportcase',
                                    values: { custevent_hms_last_ren_sent_date_time: currentDate }
                                });
                                arrEmails.push(pJsonData.linkedcases[keys[i]][keysBsr[0]][0].salesManager);
                                arrEmails = uniq(arrEmails);
                                log.debug("emailsNonBsr", arrEmails);
                                if (arrEmails.length > 0) {
                                    emailMerger = render.mergeEmail({ templateId: 99, supportCaseId: Number(pJsonData.linkedcases[keys[i]][keysBsr[0]][0].id) });
                                    var emailbody_nl = emailMerger.body;
                                    emailbody_nl = emailbody_nl.replace('propertyrequested', fileData);
                                    emailbody_nl = emailbody_nl.replace('logoimage', imageurl);
                                    for (var x = 0; x < arrEmails.length; x++) {
                                        email.send({
                                            author: callCenter,
                                            recipients: arrEmails[x],
                                            subject: subject,
                                            body: emailbody_nl,
                                            relatedRecords: { activityId: pJsonData.linkedcases[keys[i]][keysBsr[0]][0].id }
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else if (sendReminderEmail && hoursUntilShowing < 1) {
                        var mlsInfoEmail = 'mlsinfo@hmsmarketingservices.com';
                        var subject = 'Check Netsuite Dashboard';
                        var appointmentLink = 'https://1309901.app.netsuite.com/app/crm/support/supportcase.nl?id=' + pJsonData.linkedcases[keys[i]][keysBsr[0]][0].id;
                        var body = '<p>There is a showing scheduled in less than an hour from now that is still open in Netsuite.</p><a href=' + appointmentLink + '>Click here to see the Appointment</a>';
                        email.send({
                            author: callCenter,
                            recipients: [mlsInfoEmail],
                            subject: subject,
                            body: body,
                            relatedRecords: { activityId: pJsonData.linkedcases[keys[i]][keysBsr[0]][0].id }
                        });
                    }
                }
            }
        }
        sendEmailsNonLinkedCases(0, 0, pJsonData);
    }
    function sendEmailsNonLinkedCases(pIndex1, pIndex2, pJsonData) {
        var date = calcTime(-5);
        log.debug("pJsonData.nonlinkedcases", pJsonData.nonlinkedcases);
        for (var i = pIndex1 ? pIndex1 : 0; i < pJsonData.nonlinkedcases.length; i++) {
            var arrEmails = [];
            var emailBodyTable = '';
            var imageurl = void 0;
            if (runtime.getCurrentScript().getRemainingUsage() < 1000) {
                log.debug("Excution", "Re-Scheduled");
                task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    params: {
                        "custscript_mw_step_value": "Third",
                        "custscript_mw_index1_value": i,
                        "custscript_mw_index2_value": 0,
                        "custscript_mw_json_data": JSON.stringify(pJsonData)
                    }
                }).submit();
                return;
            }
            else {
                arrEmails = arrEmails.concat(pJsonData.nonlinkedcases[i].emailsNonBsr);
                var secretCode = SetPropertyForREN(pJsonData.nonlinkedcases[i].id);
                var emailMergerTable = render.mergeEmail({ templateId: 98, supportCaseId: Number(pJsonData.nonlinkedcases[i].id) });
                var eBody = emailMergerTable.body;
                eBody = eBody.replace('encryptId', secretCode ? secretCode : '');
                eBody = eBody.replace(/{/g, '<');
                eBody = eBody.replace(/}/g, '>');
                emailBodyTable += eBody;
                var callCenter = 3847;
                var fileData = file.load({ id: '39813' }).getContents();
                var emailMerger = render.mergeEmail({ templateId: 97, supportCaseId: Number(pJsonData.nonlinkedcases[i].id) });
                var emailBody = emailMerger.body;
                var emailSubject = '';
                fileData = fileData.replace('{propertyrequested}', emailBodyTable);
                emailBody = emailBody.replace('propertyrequested', fileData);
                var hoursSinceLastEmail = 1;
                var minutesSinceLastEmail = 60; // Test
                var todayDay = date.getDay();
                var todayHour = date.getHours();
                if (pJsonData.nonlinkedcases[i].lastEmailTime) {
                    var convertLastEmailToDateObject = new Date(pJsonData.nonlinkedcases[i].lastEmailTime);
                    hoursSinceLastEmail = ((date.getTime() - convertLastEmailToDateObject.getTime()) / 3600000);
                    log.debug('hour', hoursSinceLastEmail);
                    minutesSinceLastEmail = hoursSinceLastEmail * 60;
                    log.debug('minutesSinceLastEmail', minutesSinceLastEmail);
                }
                var hoursUntilShowing = void 0;
                if (pJsonData.nonlinkedcases[i].showingDateTime) {
                    var convertToDateObject = new Date(pJsonData.nonlinkedcases[i].showingDateTime);
                    hoursUntilShowing = ((convertToDateObject.getTime() - date.getTime()) / 3600000);
                    log.debug('hoursUntilShowing', hoursUntilShowing);
                }
                try {
                    var imageid = search.lookupFields({ type: 'customer', id: String(pJsonData.nonlinkedcases[i].division), columns: 'image' }).image[0];
                    log.debug("Image", imageid);
                    if (!imageid) {
                        var builderParent = search.lookupFields({ type: 'customer', id: String(pJsonData.nonlinkedcases[i].division), columns: 'parent' }).parent[0];
                        builderParent ? builderParent.value : '';
                        if (builderParent) {
                            imageid = search.lookupFields({ type: 'customer', id: Number(builderParent), columns: 'image' }).image[0].value;
                            log.debug("Image", imageid);
                            log.debug("Builder Parent", builderParent);
                            var imageFile = file.load(imageid);
                            imageurl = imageFile.url;
                        }
                    }
                    else {
                        var imageFile = file.load(imageid.value);
                        imageurl = imageFile.url;
                    }
                }
                catch (ier) {
                    log.error('Err image', ier);
                }
                if (imageurl == '') {
                    imageurl = 'https://system.na3.netsuite.com/core/media/media.nl?id=39790&amp;c=1309901&amp;h=48dbf824375dd894c511';
                }
                else {
                    imageurl = 'https://system.na3.netsuite.com' + imageurl;
                }
                emailBody = emailBody.replace('logoimage', imageurl);
                var sendReminderEmail = false;
                if ((pJsonData.nonlinkedcases[i].salesRepCategory == 'Administrative Assistant' || pJsonData.nonlinkedcases[i].salesRepCategory == 'Administrative')) {
                    //if its not sunday (6) or sunday (0) 
                    if ((todayDay != 6 && todayDay != 0)) {
                        // if its between 7am and 6pm
                        if (todayHour >= 7 && todayHour <= 18) {
                            sendReminderEmail = true;
                        }
                    }
                }
                else {
                    if (todayHour >= 8 && todayHour <= 20) {
                        sendReminderEmail = true;
                    }
                }
                if (sendReminderEmail && minutesSinceLastEmail > 30 && ((hoursUntilShowing != '' && hoursUntilShowing > 1) || !hoursUntilShowing)) {
                    // if (true){
                    var subject = "(New Script) Reminder: New Inquiry From " + pJsonData.nonlinkedcases[i].agentName + " For " + pJsonData.nonlinkedcases[i].subdivision + ' ' + pJsonData.nonlinkedcases[i].lot;
                    if (pJsonData.nonlinkedcases[i].notificationMethod == '1' && pJsonData.nonlinkedcases[i].enabledNotification == true) {
                        var statusID = pJsonData.nonlinkedcases[i].status;
                        if (statusID == '1' || statusID == '10' || statusID == '2' || statusID == '3') {
                            var body_2 = emailBody;
                            body_2 = body_2.replace('bsrid', String(pJsonData.nonlinkedcases[i].bsrId));
                            var bsrRecipients = sendBsrTeam(pJsonData.nonlinkedcases[i].bsrId);
                            for (var j = 0; j < bsrRecipients.length; j++) {
                                var bodyAux = body_2.replace('bsrid', String(bsrRecipients[j]));
                                var name_2 = search.lookupFields({ type: 'partner', id: String(bsrRecipients[j]), columns: 'firstname' }).firstname;
                                bodyAux = bodyAux.replace('bsr_name', name_2);
                                email.send({
                                    author: callCenter,
                                    recipients: bsrRecipients[j],
                                    subject: subject,
                                    body: bodyAux,
                                    relatedRecords: { activityId: pJsonData.nonlinkedcases[i].id }
                                });
                            }
                            var currentDate = library.getCurrentTime();
                            var emailSent = record.submitFields({
                                id: pJsonData.nonlinkedcases[i].id,
                                type: 'supportcase',
                                values: { custevent_hms_last_ren_sent_date_time: currentDate }
                            });
                            arrEmails.push(pJsonData.nonlinkedcases[i].salesManager);
                            arrEmails = uniq(arrEmails);
                            log.debug("emailsNonBsr", arrEmails);
                            if (arrEmails.length > 0) {
                                emailMerger = render.mergeEmail({ templateId: 99, supportCaseId: Number(pJsonData.nonlinkedcases[i].id) });
                                var emailbody_nl = emailMerger.body;
                                emailbody_nl = emailbody_nl.replace('propertyrequested', fileData);
                                emailbody_nl = emailbody_nl.replace('logoimage', imageurl);
                                for (var x = 0; x < arrEmails.length; x++) {
                                    email.send({
                                        author: callCenter,
                                        recipients: arrEmails[x],
                                        subject: subject,
                                        body: emailbody_nl,
                                        relatedRecords: { activityId: pJsonData.nonlinkedcases[i].id }
                                    });
                                }
                            }
                        }
                    }
                }
                else if (sendReminderEmail && hoursUntilShowing < 1) {
                    var mlsInfoEmail = 'mlsinfo@hmsmarketingservices.com';
                    var subject = 'Check Netsuite Dashboard';
                    var appointmentLink = 'https://1309901.app.netsuite.com/app/crm/support/supportcase.nl?id=' + pJsonData.nonlinkedcases[i].id;
                    var body = '<p>There is a showing scheduled in less than an hour from now that is still open in Netsuite.</p><a href=' + appointmentLink + '>Click here to see the Appointment</a>';
                    email.send({
                        author: callCenter,
                        recipients: [mlsInfoEmail],
                        subject: subject,
                        body: body,
                        relatedRecords: { activityId: pJsonData.nonlinkedcases[i].id }
                    });
                }
            }
        }
    }
    function SetPropertyForREN(caseId) {
        try {
            log.debug('Case Id', caseId);
            var secretKey = search.lookupFields({ type: 'customrecord_auth_pass_phrase', id: '1', columns: 'custrecord_secret_key' }).custrecord_secret_key;
            var propertyId = search.lookupFields({ type: 'supportcase', id: caseId, columns: 'custevent_property' }).custevent_property[0].value;
            log.debug("Property Id", propertyId);
            log.debug("secret Key", secretKey);
            if (propertyId) {
                var encrypted = CryptoJS.AES.encrypt(propertyId, secretKey);
                var decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString();
                var dataProperty = search.lookupFields({ type: 'customrecord_property_record', id: propertyId, columns: ['custrecord_house_number', 'custrecord12.custentity_enable_ren', 'custrecord31'] });
                log.debug("Values", dataProperty['custrecord12.custentity_enable_ren']);
                log.debug("Values", dataProperty.custrecord_house_number);
                log.debug("Values", dataProperty.custrecord31[0].text);
                record.submitFields({ type: 'supportcase', id: caseId, values: {
                        custevent_ren_enabled: dataProperty['custrecord12.custentity_enable_ren'],
                        custevent_property_for_ren: dataProperty.custrecord_house_number + ' ' + dataProperty.custrecord31[0].text
                    } });
                record.submitFields({ type: 'customrecord_property_record', id: propertyId, values: { custrecord_secret_code: decrypted } });
                return decrypted;
            }
            return null;
        }
        catch (ex) {
            log.error("Error Set Property", ex);
        }
    }
    function uniq(a) {
        return a.sort().filter(function (item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
    }
    function calcTime(offset) {
        var clientDate = new Date();
        var utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
        var date = new Date(utc + (3600000 * offset));
        return date;
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
    function sendBsrTeam(pBsr) {
        var bsrEmails = [];
        var bsrInfo = search.lookupFields({ type: 'partner', id: pBsr, columns: ['category', 'custentity_team_members', 'email', 'custentity_team_type'] });
        log.debug('bsrEmails', bsrInfo);
        var teamType = bsrInfo.custentity_team_type.length > 0 ? bsrInfo.custentity_team_type[0].value : '';
        if (teamType == "6") {
            bsrEmails = bsrInfo.custentity_team_members.value.split(',');
        }
        else {
            bsrEmails.push(pBsr);
        }
        return bsrEmails;
    }
});
