/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Bryan Badilla
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "N/search"], function (require, exports, log, error, http, search) {
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
        log.debug("Get", "Get");
        var method = pContext.request.parameters.method;
        var id = pContext.request.parameters.id;
        var dateInit = pContext.request.parameters.date;
        var callStatus = pContext.request.parameters.callStatus;
        log.debug("Method", method);
        if (method == "saveField") {
            var callStatus_1 = search.lookupFields({
                id: id,
                type: "supportcase",
                columns: ["status"]
            });
            log.debug("Call Status", callStatus_1["status"][0].value);
            var date = new Date();
            pContext.response.writeLine({ output: String(date) + "__" + callStatus_1["status"][0].value });
        }
        if (method == "compare") {
            var dates = search.lookupFields({
                id: id,
                type: "supportcase",
                columns: ["lastmodifieddate", "status"]
            });
            var initDate = new Date(dateInit);
            var lastModificateDate = new Date(dates["lastmodifieddate"]);
            var finalDate = new Date();
            initDate.setHours(initDate.getHours() + 3);
            initDate.setSeconds(0);
            initDate.setMilliseconds(0);
            finalDate.setHours(finalDate.getHours() + 3);
            log.debug("Init Date", initDate);
            log.debug("Last Date", lastModificateDate);
            log.debug("Final Date", finalDate);
            log.debug("Init Date", initDate.getTime());
            log.debug("Last Date", lastModificateDate.getTime());
            log.debug("Final Date", finalDate.getTime());
            if (lastModificateDate.getTime() >= initDate.getTime() && lastModificateDate.getTime() < finalDate.getTime()) {
                if (String(dates["status"][0].value) != callStatus) {
                    pContext.response.writeLine({ output: String(dates["status"][0].value) + "__" + String(dates["status"][0].text) });
                }
            }
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
