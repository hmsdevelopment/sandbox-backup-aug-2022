/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Roy Cordero
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/record", "N/redirect", "N/encode", "../Controllers/MWUserLoginController"], function (require, exports, log, record, redirect, encode, MWUserLoginController) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function onRequest(pContext) {
        log.debug("Router", "Start Router");
        //Execute GET
        if (pContext.request.method === "GET") {
            log.debug("Router", "GET request");
            // Get HTML view of form
            var form = MWUserLoginController.getForm();
            pContext.response.addHeader({ name: "Pragma", value: "no-cache" });
            pContext.response.addHeader({ name: "Cache-Control", value: "no-cache" });
            pContext.response.addHeader({ name: "Expires", value: "-1" });
            pContext.response.write(form);
        }
        //Execute POST
        else if (pContext.request.method === "POST") {
            log.debug("Router", "POST request");
            // Get parameters
            var params = pContext.request.parameters;
            log.debug("Router", "Params: " + JSON.stringify(params));
            if (params["login-method"] === "user-password") {
                // Login with user and password
                var loginResponse = MWUserLoginController.loginUserPassword(params);
                if (loginResponse.indexOf("<html>") === -1) {
                    loginResponse = JSON.parse(loginResponse);
                    var params_1 = { builderid: loginResponse["builderid"], partnerid: loginResponse["partnerid"] };
                    var token = encryptParams(params_1);
                    redirect.toSuitelet({
                        scriptId: "407",
                        deploymentId: "1",
                        isExternal: true,
                        parameters: { token: token },
                    });
                }
                else {
                    pContext.response.write(loginResponse);
                }
            }
            else if (params["login-method"] === "sms") {
                // Login with SMS code
                var loginResponse = MWUserLoginController.loginSMS(params);
                log.debug("Router", "Login Response: " + loginResponse);
                if (loginResponse.indexOf("<html>") === -1) {
                    log.debug("Router", "Login correct. Returning to Builder Actions script!");
                    loginResponse = JSON.parse(loginResponse);
                    var params_2 = { builderid: loginResponse["builderid"], partnerid: loginResponse["partnerid"] };
                    var token = encryptParams(params_2);
                    redirect.toSuitelet({
                        scriptId: "407",
                        deploymentId: "1",
                        isExternal: true,
                        parameters: { token: token },
                    });
                }
                else {
                    log.debug("Router", "Returning view!");
                    pContext.response.write(loginResponse);
                }
            }
        }
    }
    exports.onRequest = onRequest;
    function encryptParams(pParams) {
        // Create random token to send in partner
        var randomToken = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++) {
            randomToken += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        randomToken = encode.convert({
            string: randomToken,
            inputEncoding: encode.Encoding.UTF_8,
            outputEncoding: encode.Encoding.BASE_64,
        });
        record.submitFields({
            id: pParams.partnerid,
            type: "partner",
            values: {
                custentity_mw_temp_access_token: randomToken,
            },
        });
        pParams["randomToken"] = randomToken;
        var inputString = JSON.stringify(pParams);
        log.debug("Router", "inputString: " + inputString);
        var token = encode.convert({
            string: inputString,
            inputEncoding: encode.Encoding.UTF_8,
            outputEncoding: encode.Encoding.BASE_64,
        });
        log.debug("Router", "token: " + token);
        return token;
    }
});
