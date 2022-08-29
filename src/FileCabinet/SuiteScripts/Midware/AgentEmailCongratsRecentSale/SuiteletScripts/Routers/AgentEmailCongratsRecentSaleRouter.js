/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Arturo Padilla
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/email", "N/render", "N/search"], function (require, exports, log, email, render, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var EMAIL_TEMPLATE = 129;
    var NO_REPLY = -5;
    function onRequest(pContext) {
        var author = NO_REPLY;
        try {
            log.debug("Script Init", "Request received");
            var propertyId = pContext.request.parameters.propertyId;
            log.debug("ID Property", propertyId);
            if (propertyId) {
                var mslRegion1 = search.lookupFields({ type: 'customrecord_property_record', id: propertyId, columns: ['custrecord15'] }).custrecord15;
                log.debug("mslRegion1", mslRegion1[0].value);
                if (mslRegion1[0].value === "6") {
                    log.debug("ms1Region1 is Indianopolis IN", mslRegion1);
                    author = 4954;
                }
                var agentObject = search.lookupFields({ type: "customrecord_property_record", id: propertyId, columns: ["custrecord_real_estate_agent_name"] }).custrecord_real_estate_agent_name;
                if (agentObject.length > 0) {
                    var agentId = search.lookupFields({ type: "customrecord_property_record", id: propertyId, columns: ["custrecord_real_estate_agent_name"] }).custrecord_real_estate_agent_name[0].value;
                    var agentEmail = search.lookupFields({ type: "customrecord_agent", id: agentId, columns: ["custrecord_agent_email"] }).custrecord_agent_email;
                    log.debug("Agent email", agentEmail);
                    // if (agentEmail!=null && agentEmail!="") {                    
                    var emailRender = render.mergeEmail({ customRecord: { type: 'customrecord_property_record', id: Number(propertyId) }, templateId: EMAIL_TEMPLATE });
                    var emailSubject = emailRender.subject;
                    var emailBody = emailRender.body;
                    email.send({
                        author: author,
                        subject: emailSubject,
                        body: emailBody,
                        // recipients: [agentEmail],
                        recipients: ["bryan.badilla@midware.net"],
                        relatedRecords: {
                            customRecord: { id: Number(propertyId),
                                recordType: "customrecord_property_record" }
                        }
                    });
                    log.debug("EMAIL SENT!", emailBody);
                    pContext.response.write("Email Sent Succesfully!");
                    // } else {
                    //     log.error("Error on request", "The agent's email address is empty");
                    //     pContext.response.write("Error on request. The agent's email address is empty.");
                    // }
                }
                else {
                    log.error("Error on request", "Doesn't exist any agent defined in the property record");
                    pContext.response.write("Error on request. Agent field is empty");
                }
            }
            else {
                log.error("Error on request", "No property id was provided");
                pContext.response.write("Error on request. Property field is empty.");
            }
        }
        catch (e) {
            log.error("Execution error", "Detail: " + e);
            pContext.response.write("Error on request. " + e);
        }
    }
    exports.onRequest = onRequest;
});
