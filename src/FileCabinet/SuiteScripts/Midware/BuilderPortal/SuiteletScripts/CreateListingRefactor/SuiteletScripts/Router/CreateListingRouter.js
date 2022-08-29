/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Bryan Badilla
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "N/redirect", "../Controllers/CreateListingController", "../../../../Libraries/Midware/BuilderPortalLibrary", "../../../../Global/Constants"], function (require, exports, log, error, http, redirect, controller, builderPortalLibrary, globalConstants) {
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
        var cookieData = builderPortalLibrary.ValidateCookies(pContext.request.headers.cookie);
        log.debug("Params", pContext.request.parameters);
        if (cookieData != null) {
            if (pContext.request.parameters.action == "incomplete" || pContext.request.parameters.action == "completed") {
                pContext.response.write(controller.getThanksView(cookieData, pContext.request.parameters));
            }
            else {
                if (pContext.request.parameters.propertyid) {
                    pContext.response.write(controller.getMainViewEdit(cookieData, pContext.request.parameters));
                }
                else {
                    pContext.response.write(controller.getMainView(cookieData, pContext.request.parameters));
                }
            }
        }
        else
            redirect.toSuitelet({ scriptId: globalConstants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: "1", isExternal: true });
    }
    function handlePost(pContext) {
        var cookieData = builderPortalLibrary.ValidateCookies(pContext.request.headers.cookie);
        if (cookieData != null) {
            log.debug("Body", pContext.request.body);
            var bodyData = JSON.parse(pContext.request.body);
            var builderPersonnel = bodyData.data.builderPersonnelPermit;
            var propertyId = controller.savePropertyData(bodyData, cookieData);
            pContext.response.write(JSON.stringify({ status: 'success', data: {}, propertyId: propertyId, builderPersonnelSqft: builderPersonnel }));
        }
        else
            redirect.toSuitelet({ scriptId: globalConstants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: "1", isExternal: true });
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
