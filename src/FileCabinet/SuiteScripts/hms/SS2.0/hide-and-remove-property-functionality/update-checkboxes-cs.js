/**
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType ClientScript
 */
define(["require", "exports", "N/log"], function (require, exports, log) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fieldChanged = void 0;
    function fieldChanged(context) {
        const deletePropertyRecordField = context.currentRecord.getField({
            fieldId: "custrecord_delete_property_record",
        });
        const hidePropertyRecordField = context.currentRecord.getField({
            fieldId: "isinactive",
        });
        const currentRecord = context.currentRecord;
        const currentFieldId = context.fieldId;
        log.debug("currentField: ", currentFieldId);
        const deletePropertyRecordFieldValue = currentRecord.getValue({
            fieldId: deletePropertyRecordField.id
        });
        log.debug("deletePropertyRecordFieldValue: ", deletePropertyRecordFieldValue);
        if (currentFieldId === deletePropertyRecordField.id) {
            currentRecord.setValue({
                fieldId: hidePropertyRecordField.id,
                value: deletePropertyRecordFieldValue
            });
            //alert(`deletePropertyRecordField.id: ${deletePropertyRecordField.id}
            //value: ${deletePropertyRecordFieldValue}`);
        }
    }
    exports.fieldChanged = fieldChanged;
});
/* export function lineinit(context: EntryPoints.Client.lineInitContext): void {}

export function pageInit(context: EntryPoints.Client.pageInitContext): void {}

export function postSourcing(context: EntryPoints.Client.postSourcingContext): void {}

export function saveRecord(context: EntryPoints.Client.saveRecordContext): void {}

export function sublistChanged(context: EntryPoints.Client.sublistChangedContext): void {}

export function validateDelete(context: EntryPoints.Client.validateDeleteContext): void {}

export function validateField(context: EntryPoints.Client.validateFieldContext): void {}

export function validateInsert(context: EntryPoints.Client.validateInsertContext): void {}

export function validateLine(context: EntryPoints.Client.validateLineContext): void {}

export function localizationContextEnter(context: any): void {}

export function localizationContextExit(context: any): void {}
 */ 
