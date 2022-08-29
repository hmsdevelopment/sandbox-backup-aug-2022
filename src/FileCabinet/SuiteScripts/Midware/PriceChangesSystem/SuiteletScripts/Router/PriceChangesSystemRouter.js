/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Francisco Alvarado Ferllini
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "../Controllers/PriceChangesSystemController", "../Constants/Constants"], function (require, exports, log, error, http, controller, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
            pContext.response.write("Unexpected error. Detail: " + error.message);
            handleError(error);
        }
    }
    exports.onRequest = onRequest;
    function handleGet(pContext) {
        if (pContext.request.parameters.method === constants.METHODS.GET_AMD_STATUS) {
            pContext.response.write(JSON.stringify(controller.getPropertyStatus(pContext.request.parameters)));
        }
        else
            pContext.response.writePage(controller.getPriceChangesSystem(pContext.request.parameters));
    }
    function handlePost(pContext) {
        if (pContext.request.parameters.method === constants.METHODS.UPLOAD_FILES) {
            log.debug("method", constants.METHODS.UPLOAD_FILES);
            pContext.response.write(JSON.stringify(controller.uploadFiles(pContext.request.body)));
        }
        else if (pContext.request.parameters.method === constants.METHODS.REMOVE_FILES) {
            log.debug("method", constants.METHODS.REMOVE_FILES);
            pContext.response.write(JSON.stringify(controller.removeFiles(pContext.request.body)));
        }
        else if (pContext.request.parameters.method === constants.METHODS.CHANGE_PRICE) {
            log.debug("method", constants.METHODS.CHANGE_PRICE);
            pContext.response.write(JSON.stringify(controller.changePrice(pContext.request.body)));
        }
        else if (pContext.request.parameters.method === constants.METHODS.TRIGGER_AMD) {
            controller.checkAMD(pContext.request.body);
            pContext.response.write(JSON.stringify({ status: "AMD DONE" }));
        }
        else
            pContext.response.write(JSON.stringify({ status: 1, message: "UNKNOWN METHOD" }));
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
