/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer Fernanda Carmona
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/email", "N/render"], function (require, exports, log, email, render) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var EMAIL_TEMPLATE = 109;
    var NO_REPLY = 4834;
    var PROPERTY_ID = 10163;
    function execute(pContext) {
        try {
            //Sales email
            //71 original template
            log.debug("Script Init", "Send Emails");
            var emailRender = render.mergeEmail({ customRecord: { type: 'customrecord_property_record', id: Number(PROPERTY_ID) }, templateId: 71 });
            var emailSubject = emailRender.subject;
            var emailBody = emailRender.body;
            email.send({
                author: 4834,
                recipients: ["fernanda.carmona@midware.net"],
                subject: emailSubject,
                body: emailBody
            });
            //70 original email template closing
            var emailRenderclosing = render.mergeEmail({ customRecord: { type: 'customrecord_property_record', id: Number(PROPERTY_ID) }, templateId: 70 });
            var emailSubjectclosing = emailRenderclosing.subject;
            var emailBodyclosing = emailRenderclosing.body;
            email.send({
                author: 4834,
                recipients: ["fernanda.carmona@midware.net"],
                subject: emailSubjectclosing,
                body: emailBodyclosing
            });
            //closing email
        }
        catch (e) {
            log.error("Execution error", "Detail: " + e);
        }
    }
    exports.execute = execute;
});
