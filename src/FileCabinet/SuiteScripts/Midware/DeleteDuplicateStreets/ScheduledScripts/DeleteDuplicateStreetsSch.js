/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/runtime", "N/task", "N/search", "N/record"], function (require, exports, log, runtime, task, search, record) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function execute(pContext) {
        try {
            var streets_1 = {};
            var testSearch = search.create({
                type: "customrecord_street_name",
                filters: [
                    ["isinactive", "is", "false"]
                ],
                columns: [
                    search.createColumn({ name: "name", sort: search.Sort.ASC }),
                    "internalid"
                ]
            });
            var searchResultCount = testSearch.runPaged().count;
            // log.debug("customrecord_property_recordSearchObj result count",searchResultCount);
            testSearch.run().each(function (result) {
                streets_1[String(result.getValue("name")).replace(/\s+/g, "").toLocaleLowerCase()] ? streets_1[String(result.getValue("name")).replace(/\s+/g, "").toLocaleLowerCase()] += result.getValue("internalid") + "," : streets_1[String(result.getValue("name")).replace(/\s+/g, "").toLocaleLowerCase()] = result.getValue("internalid") + ",";
                return true;
            });
            // log.debug("Streets", streets)
            var keys = Object.keys(streets_1);
            var index = runtime.getCurrentScript().getParameter({ name: "custscript1" });
            var deleteStreet = runtime.getCurrentScript().getParameter({ name: "custscript_mw_delete_param" });
            // log.audit("Keys", keys)
            log.audit("Param", index);
            log.audit("Param Delete", deleteStreet);
            index = index ? index : 0;
            if (deleteStreet) {
                deleteDuplicates(index, keys, streets_1);
            }
            else {
                searchTest(index, streets_1, keys);
            }
        }
        catch (pError) {
            handleError(pError);
        }
    }
    exports.execute = execute;
    function searchTest(index, streets, keys) {
        var flag = true;
        var _loop_1 = function (i) {
            if (ReSchedule(i, false)) {
                flag = false;
                return "break";
            }
            var arrSplit = streets[keys[i]].slice(0, -1).split(",").map(function (element) {
                return Number(element);
            });
            // log.debug("ArrSplit", arrSplit)
            testProperty = search.create({
                type: "customrecord_property_record",
                filters: [
                    ["custrecord31", "anyof", arrSplit]
                ],
                columns: [
                    "internalid"
                ]
            });
            testPropertyCount = testProperty.runPaged().count;
            // log.audit("Properties",testPropertyCount);
            testProperty.run().each(function (result) {
                if (ReSchedule(i, false)) {
                    flag = false;
                    return false;
                }
                try {
                    if (arrSplit.length > 1) {
                        record.submitFields({
                            type: "customrecord_property_record",
                            id: String(result.getValue("internalid")),
                            values: { custrecord31: arrSplit[0] }
                        });
                        log.debug("Key Set", result.getValue("internalid"));
                    }
                }
                catch ( // Nothing
                _a) { // Nothing
                    log.error("Key not Set", result.getValue("internalid"));
                }
                ;
                return true;
            });
            if (!flag)
                return "break";
        };
        var testProperty, testPropertyCount;
        for (var i = index; i < keys.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
        if (flag)
            deleteDuplicates(0, keys, streets);
    }
    exports.searchTest = searchTest;
    function deleteDuplicates(index, keys, streets) {
        log.audit("Enter Delete", "Enter Delete");
        for (var i = index; i < keys.length; i++) {
            if (ReSchedule(i, true))
                break;
            var arrSplit = streets[keys[i]].slice(0, -1).split(",").map(function (element) {
                return Number(element);
            });
            arrSplit.shift();
            arrSplit.map(function (element) {
                try {
                    record.delete({ type: "customrecord_street_name", id: element });
                    log.debug("Delete", element);
                }
                catch (_a) {
                    log.error("Key not Delete", element);
                    // Nothing
                }
            });
        }
    }
    function ReSchedule(index, deleteStr) {
        // log.audit("ReSchedule", "Enters ReSchedule method");
        var getRemainingUsage = runtime.getCurrentScript().getRemainingUsage();
        // log.audit("getRemainingUsage", getRemainingUsage)
        if (getRemainingUsage < 2000) {
            log.audit("Re index", index);
            log.audit("Re deleteStr", deleteStr);
            try {
                task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    params: { custscript1: index, custscript_mw_delete_param: deleteStr }
                }).submit();
                return true;
            }
            catch (pError) {
                log.error("Error", pError);
                handleError(pError);
            }
        }
        else {
            return false;
        }
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
