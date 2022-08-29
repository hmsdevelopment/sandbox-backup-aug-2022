/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Andres Molina
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/search", "N/record"], function (require, exports, log, search, record) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeSubmit(pContext) {
        try {
            if (pContext.type == pContext.UserEventType.EDIT) {
                var recAppointmentNew = pContext.newRecord;
                var recAppointmentOld = pContext.oldRecord;
                var internalId = recAppointmentNew.getValue('id');
                var primaryBSR = recAppointmentNew.getValue('custevent_builder_sales_rep_subd');
                var linkedCases = recAppointmentNew.getValue('custevent_linked_cases');
                var status_1 = recAppointmentNew.getValue('status');
                var oldStatus = recAppointmentOld.getValue('status');
                log.debug('internalId', internalId);
                log.debug('primaryBSR', primaryBSR);
                log.debug('linkedCases', linkedCases);
                log.debug('status', status_1);
                log.debug('oldStatus', oldStatus);
                if (status_1 != oldStatus) {
                    var supportcaseSearchObj = search.create({
                        type: "supportcase",
                        filters: [
                            ["custevent_linked_cases", "anyof", linkedCases],
                            "AND",
                            ["custevent_builder_sales_rep_subd", "anyof", primaryBSR],
                            "AND",
                            ["internalid", "noneof", internalId]
                        ],
                        columns: [
                            search.createColumn({ name: "internalid", label: "Internal ID" })
                        ]
                    });
                    var searchResultCount = supportcaseSearchObj.runPaged().count;
                    log.debug("supportcaseSearchObj result count", searchResultCount);
                    supportcaseSearchObj.run().each(function (result) {
                        var relatedCaseId = result.getValue({ name: 'internalid' });
                        record.submitFields({
                            type: "supportcase",
                            id: relatedCaseId.toString(),
                            values: { 'status': status_1 }
                        });
                        return true;
                    });
                }
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeSubmit = beforeSubmit;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
