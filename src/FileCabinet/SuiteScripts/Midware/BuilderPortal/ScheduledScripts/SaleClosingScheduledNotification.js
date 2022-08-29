/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Luis Saborio, Esteban G. Damazio
 * @contact contact@midware.net
 */
define(["require", "exports", "N/url", "N/log", "N/email", "N/render", "N/search", "N/record", "../Global/Constants"], function (require, exports, url, log, email, render, search, record, Constants_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPropertiesToSendReminders = exports.execute = void 0;
    function execute(pContext) {
        log.debug("<Execute>", "Begin");
        try {
            var properties = getPropertiesToSendReminders(); //Check date at property records
            log.debug("propertyData", properties);
            for (var i = 0; i < properties.length; i++) {
                //Will send an email for each property record
                var emailTemplateID = null;
                var personnelEmail = null;
                var salesClosingPersonnelId = properties[i].saleClosingPersonnel;
                var createdPersonnelId = properties[i].createdPersonnelId;
                if (createdPersonnelId != null && createdPersonnelId != "") {
                    //When a "custrecord_created" is setted
                    if (!salesClosingPersonnelId) {
                        //Get the "custrecord_created" email
                        personnelEmail = search.lookupFields({
                            type: "partner",
                            id: createdPersonnelId,
                            columns: ["email"],
                        }).email;
                    }
                    else {
                        personnelEmail = Number(salesClosingPersonnelId);
                    }
                    if (properties[i].notifType == 1) {
                        //1 sale, 2 closing
                        emailTemplateID = 118; //Set the email template id
                    }
                    else if (properties[i].notifType == 2) {
                        emailTemplateID = 119; //Set the email template id
                    }
                    if (sendEmail(emailTemplateID, personnelEmail, properties[i].idProperty, createdPersonnelId, properties[i].notifType)) {
                        //Calls sendEmail function, and check if there was an error
                        //Set the checkbox with the id "custrecord_mw_email_sent" to true
                        record.submitFields({
                            type: Constants_1.PROPERTY_RECORD_FIELDS.TYPE,
                            id: properties[i].idProperty,
                            values: {
                                custrecord_mw_email_sent: true,
                                custrecord_mw_scheduled_date: "",
                            },
                        });
                    }
                }
                else {
                    //If there is no email setted
                    log.debug("No email setted", null);
                    var domain = url.resolveDomain({
                        hostType: url.HostType.APPLICATION,
                        accountId: "3847",
                    });
                    try {
                        email.send({
                            author: 3847,
                            recipients: ["esteban.gonzalez@midware.net", "jmcdonald@hmsmarketingservices.com"],
                            subject: "Notification cannot be sent. No personnel selected.",
                            body: domain + url.resolveRecord({ recordType: "customrecord_property_record", recordId: properties[i].idProperty }),
                            relatedRecords: { customRecord: { recordType: "customrecord_property_record", id: properties[i].idProperty } },
                        });
                        log.debug("Email sent", null);
                    }
                    catch (error) {
                        log.debug("Error", error);
                    }
                    continue;
                }
            }
        }
        catch (pError) {
            handleError(pError);
        }
    }
    exports.execute = execute;
    function getPropertiesToSendReminders() {
        //Search the property records
        var data = [];
        var status = ["2", "3"]; //pending, closed
        var customrecord_property_recordSearchObj = search
            .create({
            type: Constants_1.PROPERTY_RECORD_FIELDS.TYPE,
            filters: [
                [Constants_1.PROPERTY_RECORD_FIELDS.SALE_CLOSING_SCHEDULED_NOTIFICATION, search.Operator.ON, "today"],
                "AND",
                [Constants_1.PROPERTY_RECORD_FIELDS.SALE_CLOSING_EMAIL_SENT, search.Operator.IS, "F"],
                "AND",
                [Constants_1.PROPERTY_RECORD_FIELDS.USER_ENTERED_SALES_STATUS, search.Operator.ANYOF, status],
                "AND",
                [Constants_1.PROPERTY_RECORD_FIELDS.LISTING_TYPE, search.Operator.NONEOF, Constants_1.LISTING_TYPES.MARKET_HOME],
                "AND",
                [Constants_1.PROPERTY_RECORD_FIELDS.SCHEDULED_NOTIFICATION_TYPE, search.Operator.NONEOF, "3"],
            ],
            columns: [
                "internalid",
                Constants_1.PROPERTY_RECORD_FIELDS.SALE_CLOSING_PERSONNEL,
                Constants_1.PROPERTY_RECORD_FIELDS.CREATED_BY,
                Constants_1.PROPERTY_RECORD_FIELDS.SCHEDULED_NOTIFICATION_TYPE,
            ],
        })
            .run()
            .each(function (result) {
            // .run().each has a limit of 4,000 results
            var idProperty = result.getValue("internalid");
            var saleClosingPersonnel = result.getValue(Constants_1.PROPERTY_RECORD_FIELDS.SALE_CLOSING_PERSONNEL);
            var createdPersonnelId = result.getValue(Constants_1.PROPERTY_RECORD_FIELDS.CREATED_BY);
            var notifType = result.getValue(Constants_1.PROPERTY_RECORD_FIELDS.SCHEDULED_NOTIFICATION_TYPE);
            data.push({
                idProperty: idProperty,
                saleClosingPersonnel: saleClosingPersonnel,
                createdPersonnelId: createdPersonnelId,
                notifType: notifType,
            });
            return true;
        });
        return data;
    }
    exports.getPropertiesToSendReminders = getPropertiesToSendReminders;
    function sendEmail(pEmailTemplateId, pPersonnelEmail, pIdProperty, pCreatedPersonnelId, pNotificationType) {
        try {
            log.debug("pPersonnelEmail", pPersonnelEmail);
            if (pPersonnelEmail != null && pPersonnelEmail != "") {
                log.debug("pEmailTemplateId", pEmailTemplateId);
                var emailMerger = render.mergeEmail({
                    //Use the email templates
                    templateId: pEmailTemplateId,
                    customRecord: {
                        type: "customrecord_property_record",
                        id: Number(pIdProperty),
                    },
                    entity: null,
                    recipient: null,
                    supportCaseId: null,
                    transactionId: null,
                });
                var emailSubject = emailMerger.subject; //Get the email subject created by the template
                var emailBody = emailMerger.body; //Get the email body created by the template
                emailBody = replaceEmailURLs(emailBody, pCreatedPersonnelId, pIdProperty, pNotificationType);
                log.debug("emailBody", emailBody);
                var CallCenterHMSEmployeeRecordId = 3847;
                email.send({
                    author: CallCenterHMSEmployeeRecordId,
                    recipients: [pPersonnelEmail],
                    subject: emailSubject,
                    body: emailBody,
                    relatedRecords: { customRecord: { recordType: Constants_1.PROPERTY_RECORD_FIELDS.TYPE, id: pIdProperty } },
                });
                log.debug("Email sent", null);
                return true;
            }
            return false;
        }
        catch (error) {
            log.debug("Error", error);
            return false;
        }
    }
    function replaceEmailURLs(pBody, pPersonnelId, pPropertyId, pReminderType) {
        var emailBody = pBody;
        //replace the url to the corresponding form
        var propertyData = search.lookupFields({
            type: Constants_1.PROPERTY_RECORD_FIELDS.TYPE,
            id: pPropertyId,
            columns: [Constants_1.PROPERTY_RECORD_FIELDS.SUBDIVISION_NAME, Constants_1.PROPERTY_RECORD_FIELDS.BUILDER_DIVISION],
        });
        var builderId = propertyData[Constants_1.PROPERTY_RECORD_FIELDS.BUILDER_DIVISION][0].value;
        var subdivisionId = propertyData[Constants_1.PROPERTY_RECORD_FIELDS.SUBDIVISION_NAME][0].value;
        var formUrl = Constants_1.FORMS[pReminderType](pPersonnelId, builderId, subdivisionId, pPropertyId);
        emailBody = emailBody.replace("%formURL%", formUrl);
        return emailBody;
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
