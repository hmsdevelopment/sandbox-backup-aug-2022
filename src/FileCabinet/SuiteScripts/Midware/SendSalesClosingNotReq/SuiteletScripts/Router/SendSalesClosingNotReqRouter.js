/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Gerardo Zeledón
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "../Controllers/SendSalesClosingNotReqController", "../../Constants/Constants"], function (require, exports, log, error, http, controller, constants) {
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
        if (pContext.request.parameters.method == constants.SUITELET.METHODS.sendClosingEmail) {
            log.debug("method", constants.SUITELET.METHODS.sendClosingEmail);
            var contactEmail = pContext.request.parameters.contactEmail;
            var recordId = pContext.request.parameters.recordId;
            pContext.response.writeLine({ output: JSON.stringify(controller.sendClosingEmail(contactEmail, recordId)) });
        }
        else if (pContext.request.parameters.method == constants.SUITELET.METHODS.sendSalesEmail) {
            log.debug("method", constants.SUITELET.METHODS.sendSalesEmail);
            var contactEmail = pContext.request.parameters.contactEmail;
            var recordId = pContext.request.parameters.recordId;
            pContext.response.writeLine({ output: JSON.stringify(controller.sendSalesEmail(contactEmail, recordId)) });
        }
        else if (pContext.request.parameters.method == constants.SUITELET.METHODS.getClosingOptions) {
            var recordId = pContext.request.parameters.recordId;
            log.debug("method", constants.SUITELET.METHODS.getClosingOptions);
            pContext.response.writeLine({ output: controller.getClosingOptions(recordId) });
        }
        else if (pContext.request.parameters.method == constants.SUITELET.METHODS.getSalesOptions) {
            var recordId = pContext.request.parameters.recordId;
            log.debug("method", constants.SUITELET.METHODS.getSalesOptions);
            pContext.response.writeLine({ output: controller.getSalesOptions(recordId) });
        }
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
