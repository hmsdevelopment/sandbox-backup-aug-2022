/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer Fernanda Carmona
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/search", "N/record", "N/render", "N/email"], function (require, exports, log, search, record, render, email) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function execute(pContext) {
        log.debug("Running Scheduled Script", "Process Email Notification");
        var date = new Date();
        var hour = date.getHours();
        log.debug("Hour value = ", hour);
        if (hour >= 18) {
            return;
        }
        else {
            var savedSearch = search.load({ id: '244' });
            var results = [];
            savedSearch.run().each(function (result) {
                results.push(result);
                return true;
            });
            for (var i = 0; results != null && results.length > i; i++) {
                var supportCaseRecord = record.load({ type: 'supportcase', id: results[i].id });
                var id = results[i].id;
                log.debug("Variables case id = ", id);
                var builderSuppliedLead = supportCaseRecord.getValue({ fieldId: 'custevent_builder_lead' });
                var category = supportCaseRecord.getValue({ fieldId: 'category' });
                var showingDateTime = supportCaseRecord.getValue({ fieldId: 'custevent_showing_date_time' });
                var lastEmailTime = supportCaseRecord.getValue({ fieldId: 'custevent_hms_last_ren_sent_date_time' });
                var hoursSinceLastEmail = 1;
                var minutesSinceLastEmail = 1;
                if (lastEmailTime) {
                    var convertLastEmailToDateObject = new Date(String(lastEmailTime));
                    hoursSinceLastEmail = ((date.getTime() - convertLastEmailToDateObject.getTime()) / 3600000);
                    minutesSinceLastEmail = hoursSinceLastEmail * 60;
                }
                var convertToDateObject = new Date(String(showingDateTime));
                var hoursUntilShowing = ((convertToDateObject.getTime() - date.getTime()) / 3600000);
                var emailNotificationAttempts = supportCaseRecord.getValue({ fieldId: 'custevent_email_notification_attempts' }) || 0;
                var records = new Object();
                records['activity'] = id;
                if (Number(minutesSinceLastEmail) > 30 && id == 83122) {
                    if (((hoursUntilShowing < 24 && hoursUntilShowing > 2) || builderSuppliedLead == 'T' || category == '1') || (hoursUntilShowing > 24 && emailNotificationAttempts < 3)) {
                        log.debug("Variables - Entered the main if statement on record", id);
                        var statusID = supportCaseRecord.getValue({ fieldId: 'status' });
                        var propertyId = supportCaseRecord.getValue({ fieldId: 'custevent_property' });
                        var subdivision = supportCaseRecord.getValue({ fieldId: 'custevent_subdivision_for_ren' });
                        var division = supportCaseRecord.getValue({ fieldId: 'company' });
                        var builderDivision = record.load({ type: 'customer', id: Number(division) });
                        var notificationMethod = builderDivision.getValue({ fieldId: 'custentity_appt_notification_method' });
                        var enableEmailNotification = builderDivision.getValue({ fieldId: 'custentity8' });
                        var agent = supportCaseRecord.getValue({ fieldId: 'custevent_caller_name' });
                        var bsrID = supportCaseRecord.getValue({ fieldId: 'custevent_builder_sales_rep_subd' });
                        var bsrRecord = record.load({ type: 'partner', id: Number(bsrID) });
                        if (propertyId) {
                            var property = record.load({ type: 'customrecord_property_record', id: Number(propertyId) });
                            var lot = property.getValue({ fieldId: 'custrecord_lot_number' });
                        }
                        var agentRecord = record.load({ type: 'customrecord_agent', id: Number(agent) });
                        var agentFirstName = agentRecord.getValue({ fieldId: 'custrecord_agent_first_name' });
                        var agentLastName = agentRecord.getValue({ fieldId: 'custrecord_agent_last_name' });
                        var agentFullName = agentFirstName + ' ' + agentLastName;
                        var subject = "Reminder: New Inquiry From " + agentFullName + " For " + subdivision + " Lot " + lot;
                        var bsrEmail = bsrRecord.getValue({ fieldId: 'email' });
                        var cc = new Array();
                        var salesManager = supportCaseRecord.getValue({ fieldId: 'custevent7' });
                        if (salesManager) {
                            var salesManagerRecord = record.load({ type: 'partner', id: Number(salesManager) });
                            var salesManagerEmail = salesManagerRecord.getValue({ fieldId: 'email' });
                            cc[0] = salesManagerEmail;
                        }
                        log.debug("Testing", 'notificationMethod: ' + notificationMethod);
                        log.debug("Testing", 'enableEmailNotification: ' + enableEmailNotification);
                        if (notificationMethod == '1' && enableEmailNotification) {
                            log.debug("Testing", 'statusID: ' + statusID);
                            if (statusID == '1' || statusID == '10' || statusID == '2' || statusID == '3') {
                                log.debug("Variables - Getting ready to send the email on record", id);
                                var mergeResult1 = render.mergeEmail({
                                    templateId: 48,
                                    supportCaseId: Number(id),
                                });
                                var emailBody1 = mergeResult1.body;
                                log.debug('Testing', "bsrEmail: " + bsrEmail);
                                log.debug('Testing', "cc: " + JSON.stringify(cc));
                                email.send({
                                    author: 3847,
                                    recipients: ["roy.cordero@midware.net"],
                                    cc: [],
                                    subject: subject,
                                    body: emailBody1,
                                    relatedRecords: records
                                });
                                emailNotificationAttempts = Number(emailNotificationAttempts) + 1;
                                supportCaseRecord.setValue({ fieldId: 'custevent_email_notification_attempts', value: emailNotificationAttempts });
                                supportCaseRecord.save();
                            }
                        }
                    }
                }
                else {
                    log.debug("The email was not sended - Minutes since last Email: ", minutesSinceLastEmail);
                    return;
                }
            }
        }
    }
    exports.execute = execute;
});
