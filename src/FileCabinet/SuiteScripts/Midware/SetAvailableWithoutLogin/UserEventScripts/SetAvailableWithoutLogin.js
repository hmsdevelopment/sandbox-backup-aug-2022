/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Francisco Alvarado
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/runtime", "N/file"], function (require, exports, log, runtime, file) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function afterSubmit(pContext) {
        try {
            if (runtime.executionContext == runtime.ContextType.USER_INTERFACE ||
                runtime.executionContext == runtime.ContextType.SUITELET ||
                runtime.executionContext == runtime.ContextType.SCHEDULED ||
                runtime.executionContext == runtime.ContextType.USEREVENT ||
                runtime.executionContext == runtime.ContextType.CSV_IMPORT) {
                log.debug('afterSubmit', "ContextType : " + runtime.executionContext);
                if (pContext.type == pContext.UserEventType.EDIT ||
                    pContext.type == pContext.UserEventType.CREATE ||
                    pContext.type == pContext.UserEventType.COPY ||
                    pContext.type == pContext.UserEventType.XEDIT) {
                    log.debug('afterSubmit', "Record : " + pContext.newRecord.id);
                    log.debug('afterSubmit', "pContext.type : " + pContext.type);
                    var newMarkethomeInformationSeet = pContext.newRecord.getValue({ fieldId: 'custrecord49' });
                    log.debug('afterSubmit', "newMarkethomeInformationSeet : " + newMarkethomeInformationSeet);
                    if (newMarkethomeInformationSeet) {
                        var fileRecord = file.load({ id: newMarkethomeInformationSeet.toString() });
                        log.debug('afterSubmit', "fileRecord.isOnline : " + fileRecord.isOnline);
                        if (!fileRecord.isOnline) {
                            fileRecord.isOnline = true;
                            fileRecord.save();
                            log.debug('afterSubmit', "fileRecord.save() : " + fileRecord.save());
                        }
                    }
                }
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
