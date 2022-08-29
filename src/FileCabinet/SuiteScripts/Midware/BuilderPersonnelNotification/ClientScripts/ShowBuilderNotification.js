/**
 * @NAPIVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer Sergio Tijerino
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/ui/message"], function (require, exports, log, message) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Save Record Method */
    function saveRecord(pContext) {
        return true;
    }
    exports.saveRecord = saveRecord;
    function showMessage() {
        log.debug("ShowMessage", "Message about to be shown");
        try {
            var myMsg = message.create({
                title: "WARNING",
                message: 'A "Builder To Be Notified" should be set. Please fill the field',
                type: message.Type.WARNING
            });
            myMsg.show();
            log.debug("ShowMessage", "Message shown successfully");
        }
        catch (e) {
            log.debug("ShowMessage - ERROR", "ERROR: " + e);
        }
    }
    exports.showMessage = showMessage;
});
