/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Bryan Badilla Amador
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "../Controllers/SystemUpdateController"], function (require, exports, log, error, http, controller) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(pContext) {
        try {
            var eventMap = {}; //event router pattern design
            eventMap[http.Method.GET] = handleGet;
            eventMap[http.Method.POST] = handlePost;
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
        log.debug("Get", pContext.request.headers.cookie);
        //  let cookieData = builderPortalLibrary.ValidateCookies(pContext.request.headers.cookie);
        //  if (cookieData!=null){
        pContext.response.write(controller.getDataSystemUpdate(pContext.request.parameters, pContext.request.method, ""));
        //  }
        //  else redirect.toSuitelet({scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: "1", isExternal: true});
    }
    function handlePost(pContext) {
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
