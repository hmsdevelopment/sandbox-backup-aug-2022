/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Walter Bonilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/ui/message"], function (require, exports, log, message) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        try {
            var needAlert = pContext.newRecord.getValue("custevent_mw_original_bsr");
            log.debug("needAlert", needAlert);
            if (needAlert && needAlert.toString() != "") {
                var newBSR = pContext.newRecord.getText("custevent_builder_sales_rep_subd");
                var oldBSR = pContext.newRecord.getText("custevent_mw_original_bsr");
                var myMsg = {
                    title: "BSR was changed (" + newBSR + ")",
                    message: "A new BSR (" + newBSR + ") has been selected because the original BSR (" + oldBSR + ") is on vacation.",
                    type: message.Type.INFORMATION,
                    duration: 100000
                };
                pContext.form.addPageInitMessage(myMsg);
                log.debug('MESSAGE', 'Banner Displayed');
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeLoad = beforeLoad;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
