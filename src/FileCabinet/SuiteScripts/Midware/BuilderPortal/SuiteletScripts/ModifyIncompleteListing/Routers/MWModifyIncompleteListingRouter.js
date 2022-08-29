/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Sergio Tijerino
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/redirect", "../Controllers/MWModifyIncompleteListingController", "../../../Libraries/Midware/BuilderPortalLibrary", "../../../Global/Constants"], function (require, exports, log, redirect, MWCreateEditListingController, builderPortalLibrary, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(pContext) {
        log.audit("Router", "Start Router");
        //Execute GET
        if (pContext.request.method === 'GET') {
            log.audit("Router", "GET request");
            var cookieData = builderPortalLibrary.ValidateCookies(pContext.request.headers.cookie);
            var data = pContext.request.parameters;
            log.debug("Router params", data);
            if (cookieData != null) {
                // Get HTML view
                pContext.response.write(MWCreateEditListingController.getView(cookieData, data));
            }
            else
                redirect.toSuitelet({ scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: "1", isExternal: true });
            // Get HTML view
        }
        else if (pContext.request.method === 'POST') {
            if (pContext.request.parameters.method == "date") {
                pContext.response.writeLine({ output: MWCreateEditListingController.updateReminderDate(pContext.request.parameters) });
            }
            else if (pContext.request.parameters.method == "person") {
                pContext.response.writeLine({ output: MWCreateEditListingController.updateNotifyPersonel(pContext.request.parameters) });
            }
            else {
                var response = { status: true, message: 'UNKNOWN METHOD' };
                pContext.response.writeLine({ output: JSON.stringify(response) });
            }
        }
    }
    exports.onRequest = onRequest;
});
