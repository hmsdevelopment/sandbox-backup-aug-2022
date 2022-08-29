/**
 * @NApiVersion 2.x
 * @NScriptType MassUpdateScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Fernanda Carmona / Reinaldo Stephens Chaves
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/https", "N/record"], function (require, exports, log, https, record) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.each = void 0;
    function each(pContext) {
        var recordID = pContext.id;
        var recordType = pContext.type;
        log.debug("Running", "Running Mass Update");
        log.audit("Record Internal Id: ".concat(recordID), "Record Type: ".concat(recordType));
        try {
            var currentRecord = record.load({ id: recordID, type: recordType });
            var isInactive = currentRecord.getValue("isinactive");
            // Access Checkbox
            var createUserPerm = currentRecord.getValue("custentity_create_user");
            var submitClosingPerm = currentRecord.getValue("custentity_submit_closing");
            var submitSalePerm = currentRecord.getValue("custentity_submit_sale");
            var createListingPerm = currentRecord.getValue("custentity_create_listing");
            var twilioID = currentRecord.getValue("custentity_mw_twilio_id");
            log.debug("Current fields", "isInactive: " + isInactive);
            log.debug("Current fields", "createUserPerm: " + createUserPerm);
            log.debug("Current fields", "submitClosingPerm: " + submitClosingPerm);
            log.debug("Current fields", "submitSalePerm: " + submitSalePerm);
            log.debug("Current fields", "createListingPerm: " + createListingPerm);
            log.debug("Current fields", "twilioID: " + twilioID);
            if (isInactive !== true && (createUserPerm || submitClosingPerm || submitSalePerm || createListingPerm) && twilioID === "") {
                log.debug("Create", "Create Twilio user");
                // Get mobilePhone or phone field from Builder record
                var mobilePhone = currentRecord.getValue("mobilephone");
                if (!mobilePhone) {
                    mobilePhone = currentRecord.getValue("phone");
                }
                log.debug("Phone", "phone: " + mobilePhone);
                // Set countryCode and number from phone number
                var number = "";
                var countryCode = "";
                if (mobilePhone) {
                    // Split number if has ()
                    mobilePhone = mobilePhone.toString();
                    if (mobilePhone.indexOf("(") !== -1) {
                        var phoneSplited = mobilePhone.toString().split(")");
                        log.debug("Phone", "phoneSplited: " + JSON.stringify(phoneSplited));
                        number = phoneSplited[1].trim();
                        countryCode = phoneSplited[0].replace("(", "");
                    }
                    else {
                        number = mobilePhone;
                        countryCode = "1";
                    }
                    log.debug("Phone", "number: " + number + " countryCode: " + countryCode);
                    if (number !== "" && countryCode !== "") {
                        // Set body to send Twilio API
                        var bodyToSend = {
                            "user[email]": currentRecord.getValue("email"),
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
                            log.debug("Response", "response.body: " + JSON.stringify(body));
                            var twilioID_1 = body.user.id;
                            log.debug("Twilio user", "twilioID: " + twilioID_1);
                            currentRecord.setValue({ fieldId: "custentity_mw_twilio_id", value: twilioID_1 });
                            log.debug("Created twilio id ", currentRecord.getValue({ fieldId: "custentity_mw_twilio_id" }));
                            currentRecord.save();
                        }
                    }
                }
                else {
                    log.error("Error", "Not mobile phone found!");
                }
            }
        }
        catch (e) {
            log.error("Error", "Error: " + JSON.stringify(e));
        }
        log.debug("Mass Update running", "Running update on " + recordType + " with id " + recordID);
    }
    exports.each = each;
});
