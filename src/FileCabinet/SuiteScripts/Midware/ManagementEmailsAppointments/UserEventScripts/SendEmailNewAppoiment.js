/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/file", "N/render", "N/search", "N/record", "N/email", "../Crypto/Crypto.js", "../Library/SendEmailsAppointment"], function (require, exports, log, file, render, search, record, email, CryptoJS, library) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var test = false;
    function beforeLoad(pContext) {
        try {
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeLoad = beforeLoad;
    function beforeSubmit(pContext) {
        try {
            if (pContext.newRecord.getValue('custevent_create_copy')) {
                pContext.newRecord.setValue({ fieldId: 'custevent_mw_not_send_email', value: true });
            }
            else {
                pContext.newRecord.setValue({ fieldId: 'custevent_mw_not_send_email', value: false });
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeSubmit = beforeSubmit;
    function afterSubmit(pContext) {
        try {
            if (!pContext.newRecord.getValue('custevent_hms_last_ren_sent_date_time') && !pContext.newRecord.getValue('custevent_mw_not_send_email') && pContext.newRecord.getValue('custevent_property')) {
                var managementEmais_1 = {};
                var propertyId = pContext.newRecord.getValue('custevent_property');
                var agentName = pContext.newRecord.getValue('custevent_agent_for_ren');
                var division = pContext.newRecord.getValue('company');
                var subdivision = pContext.newRecord.getValue('custevent_subdivision_for_ren');
                var bsrID = pContext.newRecord.getValue('custevent_builder_sales_rep_subd');
                var salesManager = pContext.newRecord.getValue('custevent7');
                var callerType = pContext.newRecord.getValue('custevent_caller_type');
                var imageurl = void 0;
                managementEmais_1[String(bsrID)] = [{
                        id: String(pContext.newRecord.id),
                        propertyId: propertyId,
                        agentName: agentName,
                        division: division,
                        subdivision: subdivision,
                        salesManager: salesManager,
                        callerType: callerType,
                        emailsNonBsr: []
                    }];
                var callCenter = 3847;
                var casesArray = [];
                var linkedCases = pContext.newRecord.getValue('custevent_linked_cases');
                if (linkedCases) {
                    var casesInfo = search.create({
                        type: "supportcase",
                        filters: [
                            ["isinactive", "is", "F"],
                            "AND",
                            ["custevent_linked_cases", "anyof", linkedCases],
                            "AND",
                            ["internalid", "noneof", pContext.newRecord.id]
                        ],
                        columns: [
                            "internalid",
                            "custevent_property",
                            "custevent_agent_for_ren",
                            "company",
                            "custevent_subdivision_for_ren",
                            "custevent_builder_sales_rep_subd",
                            "custevent7",
                            "custevent_caller_type"
                        ]
                    });
                    casesInfo.run().each(function (result) {
                        // .run().each has a limit of 4,000 results
                        log.debug("Result", result);
                        if (managementEmais_1[String(result.getValue('custevent_builder_sales_rep_subd'))]) {
                            managementEmais_1[String(result.getValue('custevent_builder_sales_rep_subd'))].push({
                                id: result.id,
                                propertyId: result.getValue('custevent_property'),
                                agentName: result.getValue('custevent_agent_for_ren'),
                                division: result.getValue('company'),
                                subdivision: result.getValue('custevent_subdivision_for_ren'),
                                salesManager: result.getValue('custevent7'),
                                callerType: result.getValue('custevent_caller_type'),
                                emailsNonBsr: []
                            });
                        }
                        else {
                            managementEmais_1[String(result.getValue('custevent_builder_sales_rep_subd'))] = [{
                                    id: result.id,
                                    propertyId: result.getValue('custevent_property'),
                                    agentName: result.getValue('custevent_agent_for_ren'),
                                    division: result.getValue('company'),
                                    subdivision: result.getValue('custevent_subdivision_for_ren'),
                                    salesManager: result.getValue('custevent7'),
                                    callerType: result.getValue('custevent_caller_type'),
                                    emailsNonBsr: []
                                }];
                        }
                        return true;
                    });
                }
                log.debug("Array", managementEmais_1);
                var _loop_1 = function () {
                    var emailsNonBsr = [];
                    var emailBodyTable = '';
                    log.debug("Element", key);
                    log.debug('Len', managementEmais_1[key].length);
                    for (var i = 0; i < managementEmais_1[key].length; i++) {
                        fileData = file.load({ id: '39813' }).getContents();
                        emailMerger = render.mergeEmail({ templateId: 97, supportCaseId: Number(managementEmais_1[key][i].id) });
                        emailBody = emailMerger.body;
                        emailSubject = '';
                        idEmailNonBSR = Number(managementEmais_1[key][i].id);
                        var secretCode = SetPropertyForREN(managementEmais_1[key][i].id);
                        var emailMergerTable = render.mergeEmail({ templateId: 98, supportCaseId: Number(managementEmais_1[key][i].id) });
                        var eBody = emailMergerTable.body;
                        eBody = eBody.replace('encryptId', secretCode ? secretCode : '');
                        eBody = eBody.replace(/{/g, '<');
                        eBody = eBody.replace(/}/g, '>');
                        emailBodyTable += eBody;
                        // Non BSR Emails
                        managementEmais_1[key][i].salesManager ? emailsNonBsr.push(managementEmais_1[key][i].salesManager) : '';
                        var copyRen = search.lookupFields({ type: 'customer', id: String(managementEmais_1[key][i].division), columns: "custentity_copy_on_ren" }).custentity_copy_on_ren;
                        copyRen = copyRen[0] ? copyRen[0].value : copyRen.value;
                        if (copyRen) {
                            copyRen.split(',').map(function (element) {
                                emailsNonBsr.push(element);
                            });
                        }
                        if (managementEmais_1[key][i].callerType == '10' || managementEmais_1[key][i].callerType == '3') {
                            var copyAppt = search.lookupFields({ type: 'customer', id: String(managementEmais_1[key][i].division), columns: "custentity_copy_appt_insp_req" }).custentity_copy_appt_insp_req;
                            copyAppt = copyAppt[0] ? copyAppt[0].value : copyAppt.value;
                            if (copyAppt) {
                                copyAppt.split(',').map(function (element) {
                                    emailsNonBsr.push(element);
                                });
                            }
                        }
                        log.debug("Test", i + "   " + emailsNonBsr);
                    }
                    fileData = fileData.replace('{propertyrequested}', emailBodyTable);
                    emailBody = emailBody.replace('propertyrequested', fileData);
                    log.debug("Email", emailBodyTable);
                    log.debug("fileData", fileData);
                    if (propertyId) {
                        emailSubject = "(New Script) - New Inquiry From " + agentName + " For " + subdivision;
                        lot = search.lookupFields({ type: 'customrecord_property_record', id: String(propertyId), columns: 'custrecord_lot_number' }).custrecord_lot_number;
                        log.debug("LOT", lot);
                        if (lot)
                            emailSubject += " Lot " + lot;
                    }
                    try {
                        imageid = search.lookupFields({ type: 'customer', id: String(division), columns: 'image' }).image[0];
                        log.debug("Image", imageid);
                        if (!imageid) {
                            var builderParent = search.lookupFields({ type: 'customer', id: String(division), columns: 'parent' }).parent[0];
                            builderParent ? builderParent.value : '';
                            if (builderParent) {
                                imageid = search.lookupFields({ type: 'customer', id: String(builderParent), columns: 'image' }).image[0].value;
                                log.debug("Image", imageid);
                                log.debug("Builder Parent", builderParent);
                                imageFile = file.load(imageid);
                                imageurl = imageFile.url;
                            }
                        }
                        else {
                            imageFile = file.load(imageid.value);
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
                    var body = emailBody;
                    var bsrRecipients = sendBsrTeam(key);
                    log.debug('key', key);
                    log.debug('Recip', bsrRecipients);
                    log.debug('Body', body);
                    for (var i = 0; i < bsrRecipients.length; i++) {
                        var bodyAux = body.replace('bsrid', String(bsrRecipients[i]));
                        var name_1 = search.lookupFields({ type: 'partner', id: String(bsrRecipients[i]), columns: 'firstname' }).firstname;
                        bodyAux = bodyAux.replace('bsr_name', name_1);
                        email.send({
                            author: callCenter,
                            recipients: bsrRecipients[i],
                            subject: emailSubject,
                            body: bodyAux,
                            relatedRecords: { activityId: pContext.newRecord.id }
                        });
                    }
                    emailsNonBsr = uniq(emailsNonBsr);
                    log.debug("emailsNonBsr", emailsNonBsr);
                    emailMerger = render.mergeEmail({ templateId: 99, supportCaseId: idEmailNonBSR });
                    emailbody_nl = emailMerger.body;
                    emailbody_nl = emailbody_nl.replace('propertyrequested', fileData);
                    emailbody_nl = emailbody_nl.replace('logoimage', imageurl);
                    email.send({
                        author: callCenter,
                        recipients: emailsNonBsr,
                        subject: emailSubject,
                        body: emailbody_nl,
                        relatedRecords: { activityId: pContext.newRecord.id }
                    });
                    var currentDate = library.getCurrentTime();
                    var emailSent = record.submitFields({
                        id: pContext.newRecord.id,
                        type: 'supportcase',
                        values: { custevent_ren_sent: true, custevent_hms_last_ren_sent_date_time: currentDate }
                    });
                };
                var fileData, emailMerger, emailBody, emailSubject, idEmailNonBSR, lot, imageid, imageFile, imageFile, emailbody_nl;
                for (var key in managementEmais_1) {
                    _loop_1();
                }
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.afterSubmit = afterSubmit;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
    function SetPropertyForREN(caseId) {
        try {
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
            // body = 'SetPropertyForREN : ' + ex;
            // body += ex.name + ' : ' + ex.message;
            // nlapiSendEmail(author, bcc, subject, body);
            // nlapiLogExecution('DEBUG', ' Body : ', body);
            // return null;
        }
    }
    function uniq(a) {
        return a.sort().filter(function (item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
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
