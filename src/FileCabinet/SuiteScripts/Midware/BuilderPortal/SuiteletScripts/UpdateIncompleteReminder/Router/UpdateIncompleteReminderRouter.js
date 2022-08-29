/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Francisco Alvarado Ferllini
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "N/redirect", "../../../Global/Constants", "../Controllers/UpdateIncompleteReminderController"], function (require, exports, log, error, http, redirect, constants, controller) {
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
        pContext.response.write({ output: controller.getUpdateIncompleteReminder(pContext.request.parameters) });
    }
    function handlePost(pContext) {
        log.debug("handlePost", "POST");
        log.debug("handlePost", JSON.stringify(pContext.request.parameters));
        var params = pContext.request.parameters;
        if (params.cancel_input == "cancel") {
            pContext.response.write({ output: controller.processCancelProperty(pContext.request.parameters) });
        }
        else if (params.cancel_input == "send") {
            pContext.response.write({ output: controller.processUpdateIncompleteReminder(pContext.request.parameters) });
        }
        else if (params.cancel_input == "enterIntoMls") {
            pContext.response.write({ output: controller.processReadyToEnterIntoMls(pContext.request.parameters) });
        }
        else if (params.cancel_input == "editProperty" && (params.id)) {
            //pContext.response.write({ output: controller.processEditProperty(pContext.request.parameters) });
            var initURL = constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.CREATE_EDIT_LISTING.URL({});
            var newURl = initURL.concat("cancel_input==editProperty&propertyid=", params.id);
            redirect.redirect({
                url: "http://google.com"
            });
        }
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
