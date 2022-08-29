/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Jose Pablo
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/http", "N/error", "N/ui/serverWidget", "./ReactLib/LogicReactLib"], function (require, exports, log, http, error, ui, reactUtil) {
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
        // Create a new form
        var form = ui.createForm({
            title: "React Demo App"
        });
        // Create a new field html
        var indexHTML = form.addField({
            id: "custpage_mw_index_html_sim",
            label: "Index HTML Simulator",
            type: ui.FieldType.INLINEHTML
        });
        // Render component
        var PARENT_COMPONENT_ID = "reactMainComponent";
        var body = "\n        " + reactUtil.getReactIncludes() + "\n        <div id=\"" + PARENT_COMPONENT_ID + "\" />\n        " + reactUtil.getComponentScript("MainPage", PARENT_COMPONENT_ID, "MainPage.js") + "\n    ";
        indexHTML.defaultValue = body;
        log.audit("inlinehtml", body);
        // write the respose
        pContext.response.writePage({ pageObject: form });
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
