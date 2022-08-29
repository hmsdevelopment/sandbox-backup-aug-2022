/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
* @NModuleScope SameAccount
* @author Midware
* @developer Walter Bonilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/runtime", "N/search", "N/task", "../Global/Functions"], function (require, exports, log, runtime, search, task, globalfunctions) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var PARAMS = {
        PAGE_INDEX: "custscript_mw_bsrlh_page_index",
        REC_INDEX: "custscript_mw_bsrlh_rec_index",
        STAGE: "custscript_mw_bsrlh_stage"
    };
    function execute(pContext) {
        try {
            var actualPageIndex = runtime.getCurrentScript().getParameter({ name: PARAMS.PAGE_INDEX });
            var actualRecIndex = runtime.getCurrentScript().getParameter({ name: PARAMS.REC_INDEX });
            var stage = runtime.getCurrentScript().getParameter({ name: PARAMS.STAGE });
            if (!stage)
                stage = "1";
            if (!actualPageIndex)
                actualPageIndex = 0;
            if (!actualRecIndex)
                actualRecIndex = 0;
            if ("1" == stage) {
                // Stage 1
                log.debug("START STAGE 1", "START STAGE 1");
                processStage1(0, 0);
                // Proccess Stage 2
                rescheduleScript("2", 0, 0);
            }
            else if ("2" == stage) {
                // Stage 2
                log.debug("START STAGE 2", "START STAGE 2");
                processStage2(0, 0);
            }
        }
        catch (pError) {
            handleError(pError);
        }
    }
    exports.execute = execute;
    function processStage1(pPageIndex, pRecIndex) {
        var searchObj1 = getSearchObj1();
        var searchPages1 = searchObj1.runPaged({ pageSize: 1000 });
        for (var i = Number(pPageIndex); i < searchPages1.pageRanges.length; i++) {
            // Get the page
            var page = searchPages1.fetch({ index: searchPages1.pageRanges[i].index });
            // Iterate over the page
            for (var j = Number(pRecIndex); j < page.data.length; j++) {
                var getRemainingUsage1 = runtime.getCurrentScript().getRemainingUsage();
                log.debug("Remaining usage:", getRemainingUsage1);
                if (getRemainingUsage1 < 1000) {
                    // Need to be reschedule
                    rescheduleScript("1", i, j);
                    return;
                }
                else {
                    // Process the record
                    var data1 = globalfunctions.parseData1(page.data[j]);
                    globalfunctions.changeBSR(data1);
                }
            }
        }
    }
    function processStage2(pPageIndex, pRecIndex) {
        var searchObj = getSearchObj2();
        var searchPages = searchObj.runPaged({ pageSize: 1000 });
        for (var i = Number(pPageIndex); i < searchPages.pageRanges.length; i++) {
            // Get the page
            var page = searchPages.fetch({ index: searchPages.pageRanges[i].index });
            // Iterate over the page
            for (var j = Number(pRecIndex); j < page.data.length; j++) {
                var getRemainingUsage = runtime.getCurrentScript().getRemainingUsage();
                log.debug("Remaining usage:", getRemainingUsage);
                if (getRemainingUsage < 1000) {
                    // Need to be reschedule
                    rescheduleScript("2", i, j);
                    return;
                }
                else {
                    // Process the record
                    var data = globalfunctions.parseData2(page.data[j]);
                    globalfunctions.revertToOriginalBSR(data);
                }
            }
        }
    }
    function getSearchObj1() {
        var supportcaseSearchObj1 = search.create({
            type: "supportcase",
            filters: [
                ["custevent_builder_sales_rep_subd.custentity_transfer_end_date", "after", "today"],
                "AND",
                ["custevent_builder_sales_rep_subd.custentity_transfer_date", "onorbefore", "today"]
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
        var searchResultCount1 = supportcaseSearchObj1.runPaged().count;
        log.debug("supportcaseSearchObj 1 result count", searchResultCount1);
        return supportcaseSearchObj1;
    }
    function getSearchObj2() {
        var supportcaseSearchObj2 = search.create({
            type: "supportcase",
            filters: [
                ["custevent_mw_original_bsr", "noneof", "@NONE@"],
                "AND",
                ["custevent_mw_original_bsr.custentity_transfer_end_date", "onorbefore", "today"]
            ],
            columns: [
                "internalid",
                "custevent_builder_sales_rep_subd",
                "custevent_mw_original_bsr",
                search.createColumn({ name: "custentity_salutation", join: "CUSTEVENT_MW_ORIGINAL_BSR" }),
                search.createColumn({ name: "firstname", join: "CUSTEVENT_MW_ORIGINAL_BSR" }),
                search.createColumn({ name: "lastname", join: "CUSTEVENT_MW_ORIGINAL_BSR" }),
                search.createColumn({ name: "custentity1", join: "CUSTEVENT_MW_ORIGINAL_BSR" }),
                search.createColumn({ name: "mobilephone", join: "CUSTEVENT_MW_ORIGINAL_BSR" })
            ]
        });
        var searchResultCount2 = supportcaseSearchObj2.runPaged().count;
        log.debug("supportcaseSearchObj 2 result count", searchResultCount2);
        return supportcaseSearchObj2;
    }
    // Function to reschedule the script
    function rescheduleScript(pStage, pPageIndex, pRecIndex) {
        log.debug("Reschedule:", "script scheduled");
        // Set the params
        var params = {};
        params[PARAMS.PAGE_INDEX] = String(pPageIndex);
        params[PARAMS.REC_INDEX] = String(pRecIndex);
        params[PARAMS.STAGE] = String(pStage);
        // Create the Reschedule Task
        task.create({
            taskType: task.TaskType.SCHEDULED_SCRIPT,
            scriptId: runtime.getCurrentScript().id,
            deploymentId: runtime.getCurrentScript().deploymentId,
            params: params
        }).submit();
        return;
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
