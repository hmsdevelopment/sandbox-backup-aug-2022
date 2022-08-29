/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/ui/serverWidget"], function (require, exports, log, serverWidget) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        try {
            if (pContext.type === pContext.UserEventType.COPY || pContext.type === pContext.UserEventType.EDIT) {
                if (pContext.newRecord.getValue({ fieldId: 'custevent_linked_cases' }) && !pContext.newRecord.getValue({ fieldId: 'custevent_property' })) {
                    pContext.form.clientScriptModulePath = "../ClientScripts/RemoveCancelButton.js";
                    pContext.form.addButton({ id: "custpage_cancel", label: "Cancel", functionName: "cancelFunction(" + pContext.newRecord.id + ", " + pContext.newRecord.getValue({ fieldId: 'custevent_linked_cases' }) + ");" });
                    pContext.form.addField({ id: "custpage_mw_show_status_banner", label: "null", type: serverWidget.FieldType.INLINEHTML })
                        .defaultValue = /*html*/ "<img class=\"inject_html_image\" src=\"\" onerror=\"" + removeButton() + "\"/>";
                }
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeLoad = beforeLoad;
    function removeButton() {
        return "jQuery('#_cancel').hide(); jQuery('#tr__cancel').hide();";
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
