/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @author HMS Marketing Services
 * @developer Jeff McDonald
 * @contact jmcdonald@hmsmarketingservices.com
 */
define(["require", "exports", "N/log", "N/record", "N/runtime"], function (require, exports, log, record, runtime) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.beforeSubmit = void 0;
    function beforeSubmit(pContext) {
        //const scriptObj = runtime.getCurrentScript().getParameter({ name: "custscript_batch_uuid" });
        //scriptObj.getParameter({ name: "custscript_batch_uuid" });
        var batchUuid = runtime
            .getCurrentScript()
            .getParameter({ name: "custscript_batch_uuid" }) || create_UUID();
        if (pContext.type !== pContext.UserEventType.CREATE) {
            reportChanges(pContext, batchUuid);
        }
        function reportChanges(pContext, batchUuid) {
            var oldRecordFields = pContext.oldRecord.getFields();
            var allChanges = [];
            var individualChange = {};
            var timeStamp = new Date();
            var scriptContext = runtime.executionContext;
            //log.debug("scriptContext #1", typeof scriptContext + ' / ' + scriptContext);
            var recordType = pContext.oldRecord.type;
            var recordId = pContext.newRecord.id;
            var enableLogging = false;
            for (var i = 0; i < oldRecordFields.length; i++) {
                var field = pContext.oldRecord.getField({ fieldId: oldRecordFields[i] });
                if (field) {
                    var fieldId = field.id;
                    var fieldType = field.type;
                    var oldValue = pContext.oldRecord.getValue({
                        fieldId: fieldId,
                    });
                    var newValue = pContext.newRecord.getValue({
                        fieldId: fieldId,
                    });
                    if (fieldType !== "text") {
                        oldValue = oldValue.toString();
                        newValue = newValue.toString();
                    }
                    oldValue = oldValue.substring(0, 290);
                    newValue = newValue.substring(0, 290);
                    if ((oldValue || newValue) && newValue !== oldValue) {
                        //(oldValue !== newValue) {
                        individualChange = {
                            custrecord_audit_record_number: recordId,
                            custrecord_audit_timestamp: timeStamp,
                            custrecord_audit_record_type: recordType,
                            custrecord_audit_field_id: fieldId,
                            custrecord_audit_field_type: fieldType,
                            custrecord_audit_old_value: oldValue,
                            custrecord_audit_new_value: newValue,
                            custrecord_audit_script_context: scriptContext,
                            custrecord_audit_batch_uuid: batchUuid,
                        };
                        allChanges.push(individualChange);
                        var newAuditRecord = record.create({
                            type: "customrecord_audit_log",
                            isDynamic: true,
                        });
                        //log.debug("scriptContext #3", typeof scriptContext + " / " + scriptContext);
                        //log.audit("individualChange[]", individualChange);
                        for (var key in individualChange) {
                            if (individualChange.hasOwnProperty(key)) {
                                newAuditRecord.setValue({
                                    fieldId: key,
                                    value: individualChange[key],
                                });
                                /* log.audit("key", key);
                                          log.audit("type var key", typeof key);
                                          log.audit("individualChange[key]", individualChange[key]);
                                          log.audit("type var individualChange[key]", typeof individualChange[key]); */
                            }
                        }
                        var saved = newAuditRecord.save({
                            ignoreMandatoryFields: false,
                            enableSourcing: true,
                        });
                        if (!saved) {
                            log.error("Saved", saved);
                        }
                    }
                }
            }
            return {
                beforeSubmit: beforeSubmit,
                reportChanges: reportChanges,
            };
        }
    }
    exports.beforeSubmit = beforeSubmit;
    function create_UUID() {
        var dt = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
    }
});
