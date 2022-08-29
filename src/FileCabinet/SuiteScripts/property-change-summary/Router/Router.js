/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author HMS Marketing Services
 * @developer
 * @contact
 */
define(["require", "exports", "N/log", "N/error", "N/http", "../Router/searchSystemNotes"], function (require, exports, log, error, http, sysNotes) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(pContext) {
        //	try {
        var eventMap = {}; //event router pattern design
        eventMap[http.Method.GET] = handleGet;
        eventMap[http.Method.POST] = handlePost;
        eventMap[pContext.request.method] ? eventMap[pContext.request.method](pContext) : httpRequestError();
        /* 	} catch (error) {
            pContext.response.write(`Unexpected error. Detail: ${error.message}`);
            handleError(error);
        } */
        function httpRequestError() {
            throw error.create({
                name: "HMS_UNSUPPORTED_REQUEST_TYPE",
                message: "Suitelet only supports GET and POST",
                notifyOff: true,
            });
        }
        function handleError(error) {
            throw {
                name: "UNSUPPORTED_REQUEST_TYPE",
                datails: "This Suilet only supports GET and POST request",
            };
        }
    }
    exports.onRequest = onRequest;
    function handleGet(pContext) {
        log.debug("Get", "Get");
        //const queryResults = sysNotes.createForm() //sysNotes.propertySearch()
        //log.debug("html", html);
        //log.debug("queryResults", queryResults);
        var res = pContext.response.writePage({
            pageObject: sysNotes.myForm(),
        });
        log.debug("res", res);
        //let res = pContext.response.write(sysNotes.myForm());
        /* const rec = record.load({
            id: "22478",
            type: "customrecord_property_record",
        });
    
        let g = getFields(rec);
    
        log.debug("getfields", g); */
    }
    function handlePost(pContext) {
        log.debug("Post", pContext.request.parameters);
    }
});
