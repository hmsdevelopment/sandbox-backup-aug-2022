/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/error", "N/https", "N/url"], function (require, exports, log, error, https, url) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var clientUrl;
    var oldValueBefore;
    function beforeLoad(pContext) {
        try {
            if (pContext.type === pContext.UserEventType.EDIT) {
                var saveDate = url.resolveScript({
                    scriptId: "customscript_mw_inquiry_status_validatio",
                    deploymentId: "customdeploy_mw_inquiry_status_val_d",
                    params: {
                        method: "saveField",
                        id: pContext.newRecord.id
                    }
                });
                https.get({
                    url: saveDate,
                });
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeLoad = beforeLoad;
    function beforeSubmit(pContext) {
        try {
            // log.debug("Value Before", oldValueBefore);
            if (pContext.type === pContext.UserEventType.EDIT) {
                var testOld = pContext.oldRecord.getValue("status");
                var test = pContext.newRecord.getValue("status");
                log.debug("Test Old Before Submit", testOld);
                log.debug("Test Before Submit", test);
                if (testOld != test) {
                    throw error.create({ name: "Error", message: "Test Message" });
                }
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeSubmit = beforeSubmit;
    function afterSubmit(pContext) {
        try {
            // let testOld = pContext.oldRecord.getValue("status")
            // let test = pContext.newRecord.getValue("status");
            // log.debug("Test Old After Submit", testOld)
            // log.debug("Test After Submit", test)
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.afterSubmit = afterSubmit;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
