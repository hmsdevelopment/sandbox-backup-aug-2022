/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Francisco Alvarado
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/record"], function (require, exports, log, record) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function afterSubmit(pContext) {
        try {
            log.debug("afterSubmit", "Enters afterSubmit :" + pContext.newRecord.id);
            var thisRecordId = pContext.newRecord.id;
            var appointmentRecord = record.load({ type: record.Type.SUPPORT_CASE, id: thisRecordId.toString() });
            var showingDate = appointmentRecord.getValue({ fieldId: "custevent_showing_date_scheduled" });
            var ShowingTime = appointmentRecord.getValue({ fieldId: "custevent_showing_time_scheduled" });
            if (showingDate && ShowingTime) {
                var hours = ShowingTime.getHours() % 12;
                var ampm = ShowingTime.getHours() >= 12 ? 'pm' : 'am';
                var newShowingDateTime = showingDate.getMonth() + 1 + "/" + showingDate.getDate() + "/" + showingDate.getFullYear() + " " + hours + ":" + ShowingTime.getMinutes() + ":" + ShowingTime.getSeconds() + " " + ampm;
                record.submitFields({ type: record.Type.SUPPORT_CASE.toString(), id: thisRecordId.toString(), values: { custevent_showing_date_time: newShowingDateTime } });
            }
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
