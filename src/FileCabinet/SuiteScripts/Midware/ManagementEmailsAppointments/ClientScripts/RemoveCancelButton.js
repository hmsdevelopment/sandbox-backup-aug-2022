/**
* @NApiVersion 2.0
* @NScriptType ClientScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/url", "N/https", "../Constants/Constants"], function (require, exports, log, url, https, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function pageInit(pContext) {
        try {
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.pageInit = pageInit;
    function cancelFunction(pId, pLinkedCase) {
        console.log(pId);
        console.log(pLinkedCase);
        var sUrl = url.resolveScript({
            scriptId: '1786',
            deploymentId: '1',
            params: {
                id: pId,
                linkedCase: pLinkedCase
            }
        });
        https.get({
            url: sUrl,
        });
        window.location.href = constants.URL_LIST_APPOINTMENTS;
    }
    exports.cancelFunction = cancelFunction;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
