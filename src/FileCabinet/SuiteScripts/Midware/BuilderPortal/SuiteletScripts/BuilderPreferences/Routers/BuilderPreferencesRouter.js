/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Esteban G. Damazio
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/redirect", "N/error", "N/https", "../Controllers/BuilderPreferencesController", "../../../Libraries/Midware/BuilderPortalLibrary", "../../../Libraries/Midware/BuilderPortalFrondEnd", "../../../Global/Constants"], function (require, exports, log, redirect, error, https, BuilderPreferencesController, BuilderPortalLibrary, BuilderPortalFrondEnd, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(pContext) {
        try {
            var eventMap = {}; //event router pattern design
            eventMap[https.Method.GET] = handleGet;
            eventMap[https.Method.POST] = handlePost;
            eventMap[pContext.request.method] ?
                eventMap[pContext.request.method](pContext) :
                httpRequestError();
        }
        catch (error) {
            pContext.response.write("Unexpected error. Detail: ".concat(error.message));
            handleError(error);
        }
    }
    exports.onRequest = onRequest;
    function handleGet(pContext) {
        log.debug("Router", "GET request");
        var validationResult = BuilderPreferencesController.validateGETRequest(pContext.request);
        log.debug("GET", validationResult);
        if (validationResult.hasOwnProperty("status")) {
            log.debug("Valdation Result", JSON.stringify(validationResult));
            handleValidationResult(pContext.request, pContext.response, validationResult);
        }
        else {
            pContext.response.write(BuilderPreferencesController.getView(pContext.request, validationResult));
        }
    }
    function handleValidationResult(pRequest, pResponse, validationResult) {
        var status = validationResult.status;
        log.debug("handleValidationResult", "validationResult : ".concat(JSON.stringify(validationResult), "\n validationResult.hasOwnProperty(\"redirectUrl\") : ").concat(validationResult.hasOwnProperty("redirectUrl")));
        if (validationResult.hasOwnProperty("redirectURL")) {
            redirect.toSuitelet({
                scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID,
                deploymentId: "1",
                isExternal: true,
                parameters: { "redirect": validationResult.redirectURL }
            });
        }
        else if (validationResult.hasOwnProperty("title") && validationResult.hasOwnProperty("msg")) {
            var cookieData = BuilderPortalLibrary.extractBuilderPortalCookie(pRequest.headers.cookie);
            pResponse.write(BuilderPortalFrondEnd.makeBuilderPortalErrorPage(cookieData.partnerid, "HMS Builder Portal", "HMS Builder Portal", validationResult.title, validationResult.msg));
        }
        else {
            pResponse.write("Request not handled");
        }
    }
    function handlePost(pContext) {
        log.debug("Router", "POST request");
        log.debug("Router parameters", pContext.request.parameters);
        log.debug("Router body", pContext.request.body);
        log.debug("Router files", pContext.request.files);
        log.debug("Router headers", pContext.request.headers);
        var cookieData = BuilderPortalLibrary.extractBuilderPortalCookie(pContext.request.headers.cookie);
        var validationResult = BuilderPreferencesController.validatePOSTRequest(cookieData, pContext.request);
        if (validationResult.hasOwnProperty("status")) {
        }
        else {
            var values = BuilderPreferencesController.normalizeValues(validationResult);
            // pContext.response.write(`initial values :\n ${JSON.stringify(validationResult["values"], null, 2)}`);
            // pContext.response.write(`\n\nnormalized values :\n ${JSON.stringify(values, null, 2)}`);
            var saveResult = BuilderPreferencesController.saveValues('customer', cookieData.builderid, values, pContext.request.files);
            if (saveResult && typeof (saveResult) == "number") {
                redirect.toSuitelet({ deploymentId: "1", scriptId: pContext.request.parameters.script, parameters: {}, isExternal: true });
            }
            else {
                var messageBody = saveResult["msg"] + "<p style=\"text-align : center;\"><a href=\"javascript:history.back()\">Go Back</a></p>";
                pContext.response.write(BuilderPortalFrondEnd.makeBuilderPortalErrorPage(cookieData.partnerid, "HMS Builder Portal", "HMS Builder Portal", "Error saving values", messageBody, true));
            }
        }
        return;
    }
    function httpRequestError() {
        throw error.create({
            name: "MW_UNSUPPORTED_REQUEST_TYPE",
            message: "Suitelet only supports GET and POST",
            notifyOff: true
        });
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
