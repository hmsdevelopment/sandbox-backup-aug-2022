/**
* @NApiVersion 2.x
* @NScriptType MassUpdateScript
* @NModuleScope Public
* @author Midware
* @developer Esteban G. Damazio
* @contact contact@midware.net
*/
define(["require", "exports", "N/log"], function (require, exports, log) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function each(pContext) {
        try {
            log.debug('', '');
        }
        catch (error) {
            log.error('ERROR', JSON.stringify(error));
        }
    }
    exports.each = each;
});
