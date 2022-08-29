/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Fernanda Carmona Ulate
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "../Controllers/PropertyImportController"], function (require, exports, log, error, http, controller) {
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
            handleError(error);
        }
    }
    exports.onRequest = onRequest;
    function handleGet(pContext) {
        if (pContext.request.parameters.method == "getoptions") {
            pContext.response.writeLine({ output: controller.getOptions(pContext.request.parameters.division) });
        }
        else {
            log.debug("handleGet", 'Enters Get');
            pContext.response.writePage(controller.getMainView());
        }
    }
    function handlePost(pContext) {
        var params = pContext.request.parameters;
        log.debug("Params", params);
        log.debug("Not include", params.mw_not_include);
        if (pContext.request.parameters.method == "sendsubdivision") {
            log.debug("Send Subdivision", "Send Subdivision");
            pContext.response.writeLine({ output: JSON.stringify(controller.sendSubdivision(pContext.request.parameters)) });
        }
        else if (pContext.request.parameters.custpage_mw_process_sublist) {
            log.audit("Enter Post", "Post");
            controller.getProcessSublists(params.custpage_mw_process_file_id, params.custpage_mw_process_report_file_id, pContext.request);
            pContext.response.writeLine({ output: "Procesing " + params.custpage_mw_process_file_id });
        }
        else {
            log.debug("Enter Else Post", "Else Post");
            log.debug("Params", params);
            log.debug("Params", params.custpage_mw_statuses_select);
            //  controller.getProcessfile(pContext.request.files, params.custpage_mw_division, params.inpt_custpage_mw_division)
            pContext.response.writePage(controller.getProcessfile(pContext.request.files, params.custpage_mw_division, params.inpt_custpage_mw_division, params.custpage_mw_checkbox, params.custpage_mw_statuses_select));
        }
        ;
    }
    function httpRequestError() {
        throw error.create({
            name: "MW_UNSUPPORTED_REQUEST_TYPE",
            message: "Suitelet only supports GET and POST",
            notifyOff: true,
        });
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
