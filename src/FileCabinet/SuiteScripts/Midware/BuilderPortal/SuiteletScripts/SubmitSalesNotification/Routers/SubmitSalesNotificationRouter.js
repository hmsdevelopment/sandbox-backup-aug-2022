/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Fernanda Carmona
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/redirect", "../Controllers/SubmitSalesNotificationController", "../../../Libraries/Midware/BuilderPortalLibrary", "../../../Global/Constants"], function (require, exports, log, redirect, SubmitSalesNotificationController, builderPortalLibrary, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(pContext) {
        try {
            log.debug("Router", "Start Router");
            var view = "";
            if (pContext.request.method === "GET") {
                log.debug("Router", "GET request");
                if (pContext.request.parameters.propertyid) {
                    log.debug("Router", "GET request");
                    log.debug("Headers", JSON.stringify(pContext.request.headers));
                    pContext.response.write(SubmitSalesNotificationController.getView(pContext.request.parameters, pContext.request.method, {}, null));
                }
                else {
                    var cookieData = builderPortalLibrary.ValidateCookies(pContext.request.headers.cookie);
                    if (cookieData != null) {
                        pContext.response.write(SubmitSalesNotificationController.getView(pContext.request.parameters, pContext.request.method, cookieData, null));
                    }
                    else
                        redirect.toSuitelet({ scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: "1", isExternal: true });
                }
            }
            if (pContext.request.method === "POST") {
                if (pContext.request.parameters.propertyid) {
                    log.debug("Router", "POST request");
                    log.debug("Headers", JSON.stringify(pContext.request.headers));
                    log.debug("Parameters", JSON.stringify(pContext.request.parameters));
                    log.debug("Router files", JSON.stringify(pContext.request.files));
                    pContext.response.write(SubmitSalesNotificationController.getView(pContext.request.parameters, pContext.request.method, {}, pContext.request.files));
                }
                else {
                    log.debug("Router", "POST request");
                    log.debug("Router files", JSON.stringify(pContext.request.files));
                    log.debug("Parameters", JSON.stringify(pContext.request.parameters));
                    var cookieData = builderPortalLibrary.ValidateCookies(pContext.request.headers.cookie);
                    if (cookieData != null) {
                        pContext.response.write(SubmitSalesNotificationController.getView(pContext.request.parameters, pContext.request.method, cookieData, pContext.request.files));
                    }
                    else
                        redirect.toSuitelet({ scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: "1", isExternal: true });
                }
            }
        }
        catch (e) {
            log.error("Error", e.message);
            log.debug("Error", JSON.stringify(e));
        }
    }
    exports.onRequest = onRequest;
});
