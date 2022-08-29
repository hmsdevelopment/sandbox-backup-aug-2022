/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Andres Molina
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "../Controllers/ClosingNotificationCancelledController"], function (require, exports, log, controller) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function onRequest(pContext) {
        try {
            if (pContext.request.method === 'GET') {
                pContext.response.writePage(controller.getMainView(pContext.request.parameters));
            }
            else if (pContext.request.method === 'POST') {
                //This portion of the script is executed when the page is submitted via the "Submit" button
                var date = new Date();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var year = date.getFullYear();
                var dateFormatted = month + '/' + day + '/' + year;
            }
            {
                pContext.response.writeLine({ output: JSON.stringify({ "error": 0, message: "Unknown method" }) });
            }
        }
        catch (error) {
            pContext.response.write("Unexpected error. Detail: " + error.message);
            handleError(error);
        }
    }
    exports.onRequest = onRequest;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
