/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Roy Cordero
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/encode", "N/redirect", "../Controllers/MWBuilderActionsController"], function (require, exports, log, encode, redirect, MWBuilderActionsController) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(pContext) {
        log.debug("Router", "Start Router");
        //Execute GET
        if (pContext.request.method === 'GET') {
            log.debug("Router", "GET request");
            // Get HTML view
            var view = MWBuilderActionsController.getView(pContext.request.parameters, pContext.request.headers.cookie);
            var viewReturnedLength = view.length > 0;
            log.debug('view length', viewReturnedLength);
            var cookieHeader = MWBuilderActionsController.generateSetCookieHeader(pContext.request, view.length == 0);
            log.debug("Cookie generated", JSON.stringify(cookieHeader));
            if (cookieHeader) {
                pContext.response.setHeader(cookieHeader);
            }
            if (view) {
                pContext.response.write(view);
            }
            else {
                redirect.toSuitelet({ scriptId: "404", deploymentId: "1", isExternal: true });
            }
        }
    }
    exports.onRequest = onRequest;
    function extractParams(pParameters) {
        if (pParameters.hasOwnProperty("token")) {
            var token = pParameters["token"];
            var decodedToken = encode.convert({
                string: token,
                inputEncoding: encode.Encoding.BASE_64,
                outputEncoding: encode.Encoding.UTF_8
            });
            return JSON.parse(decodedToken);
        }
    }
});
