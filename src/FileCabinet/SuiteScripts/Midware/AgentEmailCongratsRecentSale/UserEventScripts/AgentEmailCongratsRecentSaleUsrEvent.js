/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Arturo Padilla
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log"], function (require, exports, log) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        try {
            log.debug("Script init", pContext.newRecord.id);
            var houseNumber = String(pContext.newRecord.getValue({ fieldId: "custrecord_house_number" }));
            var street = String(pContext.newRecord.getText({ fieldId: "custrecord31" }));
            log.debug("Street", street);
            log.debug("House Number", houseNumber);
            pContext.form.clientScriptModulePath = '../ClientScripts/SendCongratsEmailClientScr.js';
            pContext.form.addButton({ label: "Send Congratulations Email", id: "custpagecongratsemailbutton", functionName: "sendCongratsEmail(" + pContext.newRecord.id + ")" });
        }
        catch (e) {
            log.error("Execution Error", "Detail " + e);
        }
    }
    exports.beforeLoad = beforeLoad;
});
