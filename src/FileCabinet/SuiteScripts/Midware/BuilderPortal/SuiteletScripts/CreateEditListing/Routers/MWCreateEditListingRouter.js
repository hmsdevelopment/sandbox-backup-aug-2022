/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Sergio Tijerino
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/redirect", "../Controllers/MWCreateEditListingController", "../../../Libraries/Midware/BuilderPortalLibrary", "../../../Global/Constants"], function (require, exports, log, redirect, MWCreateEditListingController, builderPortalLibrary, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(pContext) {
        log.debug("Router", "Start Router");
        //Execute GET
        if (pContext.request.method === 'GET') {
            log.debug("Router", "GET request");
            var cookieData = builderPortalLibrary.ValidateCookies(pContext.request.headers.cookie);
            if (cookieData != null) {
                // Get HTML view
                pContext.response.write(MWCreateEditListingController.getView(cookieData));
            }
            else
                redirect.toSuitelet({ scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: "1", isExternal: true });
        }
    }
    exports.onRequest = onRequest;
});
