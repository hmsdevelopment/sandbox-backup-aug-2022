/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Roy Cordero / Reinaldo Stephens Chaves
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/https", "N/record", "N/runtime"], function (require, exports, log, https, record, runtime) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.afterSubmit = void 0;
    /**
     * Creates or removes Twilio Users.
     * @param pContext
     */
    function afterSubmit(pContext) {
        try {
            log.debug("Running", "Running after submit");
            log.debug("Context", pContext.type);
            if ((pContext.type === pContext.UserEventType.CREATE || pContext.type === pContext.UserEventType.EDIT) &&
                runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                var pNewBuilderPersonnelRecord = pContext.newRecord;
                var isInactive = pNewBuilderPersonnelRecord.getValue("isinactive");
                // Access Checkbox
                var createUserPerm = pNewBuilderPersonnelRecord.getValue("custentity_create_user");
                var submitClosingPerm = pNewBuilderPersonnelRecord.getValue("custentity_submit_closing");
                var submitSalePerm = pNewBuilderPersonnelRecord.getValue("custentity_submit_sale");
                var createListingPerm = pNewBuilderPersonnelRecord.getValue("custentity_create_listing");
                var twilioID = pNewBuilderPersonnelRecord.getValue("custentity_mw_twilio_id");
                log.debug("Current fields", "isInactive: " + isInactive);
                log.debug("Current fields", "createUserPerm: " + createUserPerm);
                log.debug("Current fields", "submitClosingPerm: " + submitClosingPerm);
                log.debug("Current fields", "submitSalePerm: " + submitSalePerm);
                log.debug("Current fields", "createListingPerm: " + createListingPerm);
                log.debug("Current fields", "twilioID: " + twilioID);
                if (!isInactive && (createUserPerm || submitClosingPerm || submitSalePerm || createListingPerm) && twilioID === "") {
                    log.debug("Create", "Create Twilio user");
                    // Get mobile phone or phone field from Builder record
                    var mobilePhone = pContext.newRecord.getValue("mobilephone");
                    if (!mobilePhone) {
                        mobilePhone = pContext.newRecord.getValue("phone");
                    }
                    log.debug("Phone", "phone: " + mobilePhone);
                    // Set countryCode and number from phone number
                    var number = "";
                    var countryCode = "";
                    if (mobilePhone) {
                        mobilePhone = mobilePhone.toString();
                        // Split number if has ()
                        if (mobilePhone.indexOf("(") !== -1) {
                            var phoneSplited = mobilePhone.split(")");
                            log.debug("Phone", "phoneSplited: " + JSON.stringify(phoneSplited));
                            number = phoneSplited[1].trim();
                            countryCode = phoneSplited[0].replace("(", "");
                        }
                        else {
                            number = mobilePhone;
                            countryCode = "1"; // USA
                        }
                        log.debug("Phone", "number: " + number + " countryCode: " + countryCode);
                        if (number !== "" && countryCode !== "") {
                            // Set body to send Twilio API
                            var bodyToSend = {
                                "user[email]": pContext.newRecord.getValue("email"),
                                "user[cellphone]": number,
                                "user[country_code]": countryCode,
                            };
                            log.debug("Body", "bodyToSend: " + JSON.stringify(bodyToSend));
                            // Send request to Twilio API
                            var response = https.post({
                                url: "https://api.authy.com/protected/json/users/new",
                                headers: { "X-Authy-API-Key": "kE0R8AC1BAZVjqTRGQpkVoNpyw37pjq9" },
                                body: bodyToSend,
                            });
                            var body = JSON.parse(response.body);
                            if (response.code !== 200 || (body && !body.success)) {
                                // Error
                                log.error("Error Creating User", "response.body: " + JSON.stringify(body));
                            }
                            else {
                                // Success
                                // Get response from Twilio and set id in Netsuite record`
                                log.debug("Response", "response.body.user: " + JSON.stringify(body.user));
                                var twilioID_1 = body.user.id;
                                log.debug("Twilio user", "twilioID: " + twilioID_1);
                                setBuilderPersonnelTwilioIdentifier(twilioID_1, pNewBuilderPersonnelRecord.id);
                            }
                        }
                    }
                    else {
                        log.error("Error", "Not mobile phone found!");
                    }
                }
                else {
                    var isInactiveOld = pContext.oldRecord.getValue("isinactive");
                    if (isInactiveOld !== true && isInactive === true && twilioID != "") {
                        //Builder personnel was desactivated
                        var result = removeTwilioUserRequest(twilioID);
                        if (!result.error) {
                            setBuilderPersonnelTwilioIdentifier("", pContext.oldRecord.id);
                        }
                        log.debug("Delete Response - User desactivated case", JSON.stringify(result.body));
                    }
                    else if (createUserPerm !== true &&
                        submitClosingPerm !== true &&
                        submitSalePerm !== true &&
                        createListingPerm !== true &&
                        twilioID != "") {
                        //The access was denied to the builder personnel
                        var result = removeTwilioUserRequest(twilioID);
                        if (!result.error) {
                            setBuilderPersonnelTwilioIdentifier("", pContext.oldRecord.id);
                        }
                        log.debug("Delete Response - Access case", JSON.stringify(result.body));
                    }
                }
            }
            else if (pContext.type === pContext.UserEventType.DELETE) {
                var twilioID = pContext.oldRecord.getValue("custentity_mw_twilio_id");
                log.debug("TwilioID", twilioID);
                if (twilioID != "") {
                    // Send request to Twilio API
                    var result = removeTwilioUserRequest(twilioID);
                    log.debug("Delete Response", JSON.stringify(result.body));
                }
            }
        }
        catch (e) {
            log.error("Error", "Error: " + e);
        }
    }
    exports.afterSubmit = afterSubmit;
    function removeTwilioUserRequest(pTwilioID) {
        var result = { error: 0, body: null };
        var response = https.post({
            url: "https://api.authy.com/protected/json/users/".concat(pTwilioID, "/remove"),
            headers: { "X-Authy-API-Key": "kE0R8AC1BAZVjqTRGQpkVoNpyw37pjq9" },
            body: {},
        });
        var body = JSON.parse(response.body);
        result.body = body;
        if (response.code !== 200 || (body && !body.success)) {
            // Error
            log.error("Error Removing User", "response.body: " + JSON.stringify(body));
            result.error = 1;
        }
        return result;
    }
    function setBuilderPersonnelTwilioIdentifier(pTwilioID, pBuilderPersonnelId) {
        record.submitFields({
            type: "partner",
            id: pBuilderPersonnelId,
            values: {
                custentity_mw_twilio_id: pTwilioID,
            },
        });
        log.debug("Buider Personal Updated: ".concat(pBuilderPersonnelId), "Twilio Id: ".concat(pTwilioID));
    }
});
