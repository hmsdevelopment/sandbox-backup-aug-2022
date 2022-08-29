/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Walter Bonilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/search", "N/runtime", "../Global/Functions"], function (require, exports, log, search, runtime, globalfunctions) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function afterSubmit(pContext) {
        try {
            if (pContext.UserEventType.EDIT == pContext.type) {
                searchAppointments(pContext.newRecord.id);
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.afterSubmit = afterSubmit;
    function searchAppointments(pRecId) {
        var supportcaseSearchObj = search.create({
            type: "supportcase",
            filters: [
                ["custevent_builder_sales_rep_subd", "anyof", pRecId],
                "AND",
                ["custevent_builder_sales_rep_subd.custentity_transfer_date", "onorbefore", "today"],
                "AND",
                ["custevent_builder_sales_rep_subd.custentity_transfer_end_date", "after", "today"]
            ],
            columns: [
                "internalid",
                "custevent_builder_sales_rep_subd",
                search.createColumn({ name: "custentity_transfer_date", join: "CUSTEVENT_BUILDER_SALES_REP_SUBD" }),
                search.createColumn({ name: "custentity_transfer_end_date", join: "CUSTEVENT_BUILDER_SALES_REP_SUBD" }),
                search.createColumn({ name: "custentity_transfer_from", join: "CUSTEVENT_BUILDER_SALES_REP_SUBD" }),
                "custevent_mw_original_bsr"
            ]
        });
        supportcaseSearchObj.run().each(function (result) {
            var getRemainingUsage = runtime.getCurrentScript().getRemainingUsage();
            log.debug("Remaining usage:", getRemainingUsage);
            if (getRemainingUsage < 20) {
                return false;
            }
            var data = globalfunctions.parseData1(result);
            globalfunctions.changeBSR(data);
            return true;
        });
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
