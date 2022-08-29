/**
 * @NApiVersion 2.x
 * @NScriptType MassUpdateScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Esteban G. Damazio
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/record"], function (require, exports, log, record) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function each(pContext) {
        var recordID = pContext.id;
        var recordType = pContext.type;
        try {
            log.debug('Mass Update running', "Property id : " + recordID);
            record.load({ type: recordType, id: recordID }).save();
        }
        catch (e) {
            log.error('Error', 'Error: ' + e);
        }
    }
    exports.each = each;
});
