/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Gerardo Zeledón
* @contact contact@midware.net
*/
define(["require", "exports", "../Constants/Constants", "N/ui/serverWidget", "N/log"], function (require, exports, constants, serverWidget, log) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        try {
            pContext.form.clientScriptModulePath = "../ClientScripts/SendSalesClosingNotReqCS.js";
            pContext.form.addButton({
                id: constants.BUTTONS.SEND_SALES_NOTIF.ID,
                label: constants.BUTTONS.SEND_SALES_NOTIF.LABEL,
                functionName: "sendSalesNotification"
            });
            var newField = pContext.form.addField({ id: "custpage_mw_sales_message_data", label: "Message Data", type: serverWidget.FieldType.RICHTEXT });
            newField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
            newField.defaultValue = JSON.stringify({});
            pContext.form.addButton({
                id: constants.BUTTONS.SEND_CLOSE_NOTIF.ID,
                label: constants.BUTTONS.SEND_CLOSE_NOTIF.LABEL,
                functionName: "sendClosingNotification()"
            });
            var newField2 = pContext.form.addField({ id: "custpage_mw_closing_message_data", label: "Message Data", type: serverWidget.FieldType.RICHTEXT });
            newField2.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
            newField2.defaultValue = JSON.stringify({});
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
