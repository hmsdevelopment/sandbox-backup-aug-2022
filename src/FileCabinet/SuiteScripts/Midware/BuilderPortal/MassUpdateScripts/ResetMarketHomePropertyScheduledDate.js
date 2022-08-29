/**
 * @NApiVersion 2.x
 * @NScriptType MassUpdateScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Reinaldo Stephens Chaves
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/record", "../Global/Constants"], function (require, exports, log, record, Constants_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.each = void 0;
    function each(pContext) {
        var recordID = pContext.id;
        var recordType = pContext.type;
        log.debug("Running", "Running Mass Update");
        log.audit("Record Internal Id: ".concat(recordID), "Record Type: ".concat(recordType));
        try {
            var currentRecord = record.load({ id: recordID, type: recordType });
            currentRecord.setValue({ fieldId: Constants_1.PROPERTY_RECORD_FIELDS.SALE_CLOSING_SCHEDULED_NOTIFICATION, value: "" });
            currentRecord.setValue({ fieldId: Constants_1.PROPERTY_RECORD_FIELDS.SALE_CLOSING_EMAIL_SENT, value: false });
            log.audit("Updating Property Record", recordID);
            currentRecord.save();
        }
        catch (e) {
            log.error("Error", "Error: " + JSON.stringify(e));
        }
    }
    exports.each = each;
});
