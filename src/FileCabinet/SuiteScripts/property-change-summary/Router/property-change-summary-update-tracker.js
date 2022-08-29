/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["require", "exports", "N/record", "N/runtime", "N/log"], function (require, exports, record, runtime, log) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    var SYSTEM_NOTES_TRACKER_ID = "customrecord_system_notes_tracker";
    function onRequest(pContext) {
        if (pContext.request.method === "GET") {
            var params = pContext.request.parameters;
            log.debug("params", params);
            var systemNotesId = void 0;
            if (params) {
                systemNotesId = params["systemNotesId"];
                if (!systemNotesId) {
                    log.error("systemNotesId Error:", systemNotesId);
                }
            }
            else {
                log.error("params Error:", params);
            }
            //const systemNotesId = params["systemNotesId"];
            var timestamp = new Date();
            var userId = runtime.getCurrentUser().id;
            var employee = runtime.getCurrentUser();
            var context = {
                scriptId: runtime.getCurrentScript().id,
                envType: runtime.envType.toString(),
                executionContext: runtime.executionContext.toString(),
            };
            log.debug("systemNotesId", systemNotesId);
            log.debug("timestamp", timestamp);
            log.debug("userId", userId);
            log.debug("Employee", employee);
            log.debug("context", JSON.stringify(context));
            var newTrackerRecord = record.create({
                type: SYSTEM_NOTES_TRACKER_ID,
            });
            log.debug("newTrackerRecord", newTrackerRecord);
            newTrackerRecord.setValue({
                fieldId: "custrecord_tracker_system_notes_id",
                value: systemNotesId,
            });
            newTrackerRecord.setValue({
                fieldId: "custrecord_tracker_timestamp",
                value: timestamp,
            });
            newTrackerRecord.setValue({
                fieldId: "custrecord_tracker_user_id",
                value: userId,
            });
            newTrackerRecord.setText({
                fieldId: "custrecord_tracker_context",
                text: JSON.stringify(context),
            });
            newTrackerRecord.setValue({
                fieldId: "custrecord_tracker_employee",
                value: userId,
            });
            var saved = newTrackerRecord.save();
            log.debug("saved", saved);
            return { onRequest: onRequest };
        }
    }
    exports.onRequest = onRequest;
});
