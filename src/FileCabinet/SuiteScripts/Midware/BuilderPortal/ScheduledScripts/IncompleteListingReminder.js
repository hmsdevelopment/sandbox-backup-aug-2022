/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Francisco Alvarado Ferllini
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/email", "N/render", "N/search", "N/record", "../Global/Constants"], function (require, exports, log, email, render, search, record, Constants_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPropertiesToSendReminders = exports.execute = void 0;
    var templateId = 130;
    var callCenterId = 3847;
    function execute(pContext) {
        log.debug("Execute", "Begin");
        try {
            var properties = getPropertiesToSendReminders(); //Check date at property records
            log.debug("propertyData", properties);
            for (var i = 0; i < properties.length; i++) {
                var email_1 = properties[i].email;
                var property = properties[i].propertyId;
                var personelId = properties[i].personel;
                if (sendEmail(templateId, email_1, personelId, property)) {
                    record.submitFields({
                        type: "customrecord_property_record",
                        id: properties[i].propertyId,
                        values: {
                            custrecord_mw_email_sent: true,
                            custrecord_mw_scheduled_date: "",
                        },
                    });
                }
            }
        }
        catch (pError) {
            handleError(pError);
        }
        log.debug("Execute", "end");
    }
    exports.execute = execute;
    function getPropertiesToSendReminders() {
        var properties = [];
        search.create({
            type: "customrecord_property_record",
            filters: [
                ["custrecord_ready_to_be_entered", "is", "F"],
                "AND",
                ["custrecord_property_status", "anyof", "17", "6", "@NONE@"],
                "AND",
                ["isinactive", "is", "F"],
                "AND",
                ["formulatext: {custrecord_created}", "isnotempty", ""],
                "AND",
                [Constants_1.PROPERTY_RECORD_FIELDS.SALE_CLOSING_SCHEDULED_NOTIFICATION, search.Operator.ON, "today"],
                "AND",
                [Constants_1.PROPERTY_RECORD_FIELDS.SALE_CLOSING_EMAIL_SENT, search.Operator.IS, "F"],
                "AND",
                [Constants_1.PROPERTY_RECORD_FIELDS.SCHEDULED_NOTIFICATION_TYPE, search.Operator.ANYOF, "3"],
                //     "AND",
                //    ["custrecord12", "anyof","3642","3643"],
            ],
            columns: [
                "internalid",
                "custrecord_created",
                search.createColumn({ name: "created", function: 'ageInDays' }),
                //    search.createColumn({name: "email", join: "CUSTRECORD_CREATED"}),
                search.createColumn({
                    name: "formulatext",
                    formula: "NVL2( {custrecord_in_charge},  {custrecord_in_charge.email}, {custrecord_created.email})",
                    label: "Formula (Text)"
                }),
                search.createColumn({ name: "custrecord_created" }),
                search.createColumn({ name: "custrecord_in_charge" })
            ]
        }).run().each(function (pRow) {
            // let ageInDaysRaw = pRow.getValue({name: "created", function : 'ageInDays'});
            // let ageInDays = ageInDaysRaw || Number(ageInDaysRaw)? Number(ageInDaysRaw):0;
            // if (ageInDays >= 7 ){
            var propertyId = pRow.getValue({ name: "internalid" });
            var email = pRow.getValue({
                name: "formulatext",
                formula: "NVL2( {custrecord_in_charge},  {custrecord_in_charge.email}, {custrecord_created.email})",
                label: "Formula (Text)"
            });
            var personel = pRow.getValue({ name: 'custrecord_created' });
            var personelInCharge = pRow.getValue({ name: 'custrecord_in_charge' });
            properties.push({ propertyId: propertyId, email: email, personel: personelInCharge ? personelInCharge : personel });
            // }
            return true;
        });
        return properties;
    }
    exports.getPropertiesToSendReminders = getPropertiesToSendReminders;
    function sendEmail(pEmailTemplateId, pPersonnelEmail, pPersonnelId, pIdProperty) {
        try {
            log.debug("pPersonnelEmail", pPersonnelEmail);
            if (pPersonnelEmail != null && pPersonnelEmail != "") {
                log.debug("pEmailTemplateId", pEmailTemplateId);
                var emailMerger = render.mergeEmail({
                    templateId: pEmailTemplateId,
                    customRecord: {
                        type: "customrecord_property_record",
                        id: Number(pIdProperty),
                    }
                });
                var newBody = replaceEmailURLs(emailMerger.body, pPersonnelId, pIdProperty);
                email.send({
                    author: callCenterId,
                    recipients: [pPersonnelEmail],
                    subject: emailMerger.subject,
                    body: newBody,
                    relatedRecords: { customRecord: { recordType: 'customrecord_property_record', id: pIdProperty } },
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
    function replaceEmailURLs(pBody, pPersonnelId, pPropertyId) {
        var emailBody = pBody;
        //replace the url to the corresponding form
        var propertyData = search.lookupFields({
            type: Constants_1.PROPERTY_RECORD_FIELDS.TYPE,
            id: pPropertyId,
            columns: [Constants_1.PROPERTY_RECORD_FIELDS.SUBDIVISION_NAME, Constants_1.PROPERTY_RECORD_FIELDS.BUILDER_DIVISION],
        });
        var builderId = propertyData[Constants_1.PROPERTY_RECORD_FIELDS.BUILDER_DIVISION][0].value;
        var subdivisionId = propertyData[Constants_1.PROPERTY_RECORD_FIELDS.SUBDIVISION_NAME][0].value;
        var formUrl = Constants_1.FORMS["3"](pPersonnelId, builderId, pPropertyId);
        emailBody = emailBody.replace("%formURL%", formUrl);
        return emailBody;
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
