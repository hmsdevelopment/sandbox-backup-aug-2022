/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Bryan Badilla
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "N/record"], function (require, exports, log, error, http, record) {
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
        var personnel = pContext.request.parameters.personnel;
        var builder = pContext.request.parameters.builder;
        try {
            if (personnel && builder) {
                var personnelRecord = record.load({ type: 'partner', id: personnel });
                personnelRecord.setValue('custentity1', builder);
                personnelRecord.save({ ignoreMandatoryFields: true });
                pContext.response.write('success');
            }
            else {
                log.error('error', 'Not posible to change');
                pContext.response.write('unexpected error');
            }
        }
        catch (e) {
            log.error('error', e);
            pContext.response.write('unexpected error');
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
