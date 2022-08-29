/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Francisco Alvarado Ferllini
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "../Controllers/NewListingStreamlinedProcessController", "../../Constants/Constants"], function (require, exports, log, error, http, controller, constants) {
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
        log.debug("handleGet", "Enters handleGet method");
        if (pContext.request.parameters.method === constants.METHODS.FIRST_PAGE) {
            log.debug("method", constants.METHODS.FIRST_PAGE);
            pContext.response.writePage(controller.getFirstPage(pContext.request.parameters));
        }
        else if (pContext.request.parameters.method === constants.METHODS.SECOND_PAGE) {
            log.debug("method", constants.METHODS.SECOND_PAGE);
            pContext.response.writePage(controller.getSecondPage(pContext.request.parameters));
        }
        // else if (pContext.request.parameters.method === "TEST"){
        //     // log.debug("method", constants.METHODS.SECOND_PAGE);
        //     pContext.response.writePage(controller.getTestPage(pContext.request.parameters));
        // }
        else if (pContext.request.parameters.method === constants.METHODS.GET_STEETS) {
            log.debug("method", constants.METHODS.GET_STEETS);
            pContext.response.writeLine({ output: JSON.stringify(controller.getStreets()) });
        }
        else if (pContext.request.parameters.method === constants.METHODS.CHECK_DUPLICATES) {
            log.debug("method", constants.METHODS.CHECK_DUPLICATES);
            pContext.response.writeLine({ output: JSON.stringify(controller.checkDuplicates(pContext.request.parameters)) });
        }
        else {
            pContext.response.write("UNKNOWN METHOD");
        }
    }
    function handlePost(pContext) {
        log.debug("handlePost", "Enters handlePost method");
        if (pContext.request.parameters.method === constants.METHODS.PROCESS_PROPERTY) {
            log.debug("method", constants.METHODS.PROCESS_PROPERTY);
            pContext.response.write(JSON.stringify(controller.processProperty(pContext.request.parameters, pContext.request.body)));
        }
        else if (pContext.request.parameters.method === constants.METHODS.UPLOAD_FILES) {
            log.debug("method", constants.METHODS.PROCESS_PROPERTY);
            pContext.response.write(JSON.stringify(controller.uploadFiles(pContext.request.parameters, pContext.request.body)));
        }
        else {
            pContext.response.write(JSON.stringify({ status: 1, message: "UNKNOWN METHOD" }));
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
