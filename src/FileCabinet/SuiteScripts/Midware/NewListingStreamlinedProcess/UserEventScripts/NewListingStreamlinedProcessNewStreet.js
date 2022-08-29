/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Francisco Alvarado
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/ui/serverWidget", "../Constants/Constants"], function (require, exports, log, serverWidget, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        log.debug("beforeLoad", "Enters beforeLoad Mehtod");
        try {
            var source = pContext.request.parameters.source;
            if (source == constants.METHODS.NEW_LISTING) {
                var inactiveField = pContext.form.getField({ id: "custrecord_externally_created" });
                var nameField = pContext.form.getField({ id: "name" });
                var ExternalyField = pContext.form.getField({ id: "isinactive" });
                if (inactiveField)
                    inactiveField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                if (nameField)
                    nameField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                if (ExternalyField)
                    ExternalyField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                var subdivision = pContext.request.parameters.subdivision;
                if (subdivision)
                    pContext.form.getField({ id: "custrecord_subdivision" }).defaultValue = subdivision;
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
