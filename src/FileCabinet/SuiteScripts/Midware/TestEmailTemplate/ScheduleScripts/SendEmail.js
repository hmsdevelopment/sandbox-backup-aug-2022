/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer Sergio Tijerino
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/email", "N/render", "N/search"], function (require, exports, log, email, render, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var EMAIL_TEMPLATE = 109;
    var NO_REPLY = 4834;
    var PROPERTY_ID = 10163;
    function execute(pContext) {
        try {
            log.debug("Script Init", "Request received");
            if (PROPERTY_ID) {
                var emailRender = render.mergeEmail({ customRecord: { type: 'customrecord_property_record', id: Number(PROPERTY_ID) }, templateId: EMAIL_TEMPLATE });
                var emailSubject = emailRender.subject;
                var emailBody = emailRender.body;
                var agentObject = search.lookupFields({ type: "customrecord_property_record", id: PROPERTY_ID.toString(), columns: ["custrecord_real_estate_agent_name"] }).custrecord_real_estate_agent_name;
                if (agentObject.length > 0) {
                    var agentId = search.lookupFields({ type: "customrecord_property_record", id: PROPERTY_ID.toString(), columns: ["custrecord_real_estate_agent_name"] }).custrecord_real_estate_agent_name[0].value;
                    var agentEmail = search.lookupFields({ type: "customrecord_agent", id: agentId, columns: ["custrecord_agent_email"] }).custrecord_agent_email;
                    if (agentEmail) {
                        log.debug("Agent email", agentEmail);
                        email.send({ author: NO_REPLY, subject: emailSubject, body: emailBody, recipients: ["sergio.tijerino@midware.net"] });
                        log.debug("EMAIL SENT!", emailBody);
                    }
                    else {
                        log.error("Error on request", "The agent has not an email set");
                    }
                }
                else {
                    log.error("Error on request", "Doesn't exist any agent defined in the property record");
                }
            }
            else {
                log.error("Error on request", "No property id was provided");
            }
        }
        catch (e) {
            log.error("Execution error", "Detail: " + e);
        }
    }
    exports.execute = execute;
});
