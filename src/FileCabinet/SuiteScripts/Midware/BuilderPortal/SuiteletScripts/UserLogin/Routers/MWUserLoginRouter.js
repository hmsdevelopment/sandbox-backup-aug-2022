/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Roy Cordero
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/record", "N/redirect", "N/encode", "../Controllers/MWUserLoginController", "../../../Global/Constants"], function (require, exports, log, record, redirect, encode, MWUserLoginController, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function extractRedirectUrl(pRefererUrl) {
        var redirectParamArray = pRefererUrl.split("&").filter(function (x) {
            return x.indexOf("redirect") != -1;
        });
        return redirectParamArray.length ? decodeURIComponent(redirectParamArray[0].substring(redirectParamArray[0].indexOf("=") + 1, redirectParamArray[0].length)) : "";
    }
    function onRequest(pContext) {
        log.debug("Router", "Start Router");
        //Execute GET
        if (pContext.request.method === 'GET') {
            log.debug("Router", "GET request");
            if (constants.DISPLAY_ERROR_PAGE) {
                var errorPage = MWUserLoginController.displayErrorPage();
                pContext.response.write(errorPage);
            }
            else {
                // Get HTML view of form
                var form = MWUserLoginController.getForm();
                pContext.response.write(form);
            }
        }
        //Execute POST
        else if (pContext.request.method === 'POST') {
            log.debug("Router", "POST request");
            // Get parameters
            var params = pContext.request.parameters;
            log.debug('Router', 'Params: ' + JSON.stringify(params));
            log.debug('Router', 'Params: ' + JSON.stringify(pContext.request));
            var redirectUrl = extractRedirectUrl(pContext.request.headers.referer);
            log.debug('Router', "redirectUrl : ".concat(redirectUrl));
            if (params['login-method'] === "user-password") {
                // Login with user and password
                var loginResponse = MWUserLoginController.loginUserPassword(params);
                if (loginResponse.indexOf("<html>") === -1) {
                    loginResponse = JSON.parse(loginResponse);
                    MWUserLoginController.createPersonnelInfoRecord(loginResponse['partnerid'], params);
                    var tokenParams = { builderid: loginResponse['builderid'], partnerid: loginResponse['partnerid'], lastlogin: loginResponse['lastlogin'] };
                    var token = encryptParams(tokenParams);
                    var redirectParams = redirectUrl ? { token: token, redirect: redirectUrl } : { token: token };
                    redirect.toSuitelet({ scriptId: "407", deploymentId: "1", isExternal: true, parameters: redirectParams });
                }
                else {
                    pContext.response.write(loginResponse);
                }
            }
            else if (params['login-method'] === "sms") {
                // Login with SMS code
                var loginResponse = MWUserLoginController.loginSMS(params);
                log.debug("Router", "Login Response: " + loginResponse);
                log.debug("Router", "pParams[\"sms-call-type\"]: ".concat(params["sms-call-type"]));
                if (loginResponse.indexOf("<html>") === -1) {
                    log.debug("Router", "Login correct. Returning to Builder Actions script!");
                    loginResponse = JSON.parse(loginResponse);
                    MWUserLoginController.createPersonnelInfoRecord(loginResponse['partnerid'], params);
                    var tokenParams = { builderid: loginResponse['builderid'], partnerid: loginResponse['partnerid'], lastlogin: loginResponse['lastlogin'] };
                    var token = encryptParams(tokenParams);
                    var redirectParams = redirectUrl ? { token: token, redirect: redirectUrl } : { token: token };
                    redirect.toSuitelet({ scriptId: "407", deploymentId: "1", isExternal: true, parameters: redirectParams });
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
            outputEncoding: encode.Encoding.BASE_64
        });
        record.submitFields({
            id: pParams.partnerid,
            type: 'partner',
            values: {
                custentity_mw_temp_access_token: randomToken
            }
        });
        pParams["randomToken"] = randomToken;
        var inputString = JSON.stringify(pParams);
        log.debug('Router', 'inputString: ' + inputString);
        var token = encode.convert({
            string: inputString,
            inputEncoding: encode.Encoding.UTF_8,
            outputEncoding: encode.Encoding.BASE_64
        });
        log.debug('Router', 'token: ' + token);
        return token;
    }
});
