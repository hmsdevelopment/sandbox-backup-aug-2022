/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla Amador
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/runtime", "N/task", "N/search", "N/record", "N/file"], function (require, exports, log, runtime, task, search, record, file) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function execute(pContext) {
        try {
            var index = runtime.getCurrentScript().getParameter({ name: "custscript_mw_index_arr" });
            var indexSearch1 = runtime.getCurrentScript().getParameter({ name: "custscript_mw_index_s1" });
            var indexSearch2 = runtime.getCurrentScript().getParameter({ name: "custscript_mw_index_s2" });
            var messagesData = runtime.getCurrentScript().getParameter({ name: "custscript_mw_messages" });
            var status_1 = runtime.getCurrentScript().getParameter({ name: "custscript_mw_status" });
            log.debug("Params", index + " " + indexSearch1 + " " + indexSearch2 + " " + messagesData + " " + status_1);
            var fileIdInProgress = getFileofQueue("2");
            log.debug("fileIdInProgress", fileIdInProgress);
            if (fileIdInProgress.id) {
                var reportFileId = search.lookupFields({ type: "customrecord_mw_import_property_queue", id: String(fileIdInProgress.id), columns: "custrecord_mw_csv_file_report" }).custrecord_mw_csv_file_report[0].value;
                log.debug("Report File Id", reportFileId);
                var reportFile = file.load({ id: reportFileId });
                var linesReport = getLines(reportFile.getContents());
                var messages = messagesData ? JSON.parse(String(messagesData)) : new Array(linesReport.length - 1);
                ;
                if (status_1 == "Search") {
                    messages = new Array(linesReport.length - 1);
                    var resultsImport = search.create({
                        type: "customrecord_mw_import_property_result",
                        filters: [
                            ["custrecord_mw_import_result_queue", "anyof", fileIdInProgress.id]
                        ],
                        columns: [
                            "custrecord_mw_message_report",
                            search.createColumn({
                                name: "custrecord_mw_import_result_index",
                                sort: search.Sort.ASC
                            })
                        ]
                    }).runPaged({ pageSize: 1000 });
                    for (var i = indexSearch1 ? Number(indexSearch1) : 0; i < resultsImport.pageRanges.length; i++) {
                        var page = resultsImport.fetch({ index: resultsImport.pageRanges[i].index });
                        for (var j = indexSearch2 ? Number(indexSearch2) : 0; j < page.data.length; j++) {
                            try {
                                if (runtime.getCurrentScript().getRemainingUsage() < 1000) {
                                    log.audit("Not Execution Units", "Scheduled for another iteration in processing report");
                                    task.create({
                                        taskType: task.TaskType.SCHEDULED_SCRIPT,
                                        scriptId: runtime.getCurrentScript().id,
                                        deploymentId: runtime.getCurrentScript().deploymentId,
                                        params: {
                                            custscript_mw_index_s1: i,
                                            custscript_mw_index_s2: j,
                                            custscript_mw_messages: JSON.stringify(messages),
                                            custscript_mw_status: "Search"
                                        }
                                    }).submit();
                                    return;
                                }
                                else {
                                    var indexCsv = Number(page.data[j].getValue("custrecord_mw_import_result_index"));
                                    messages[indexCsv] = page.data[j].getValue("custrecord_mw_message_report");
                                }
                            }
                            catch (e) {
                                log.error("Error", e);
                            }
                        }
                    }
                }
                status_1 = "Report";
                if (status_1 == "Report") {
                    var contentNewFile = void 0;
                    if (!index)
                        contentNewFile = linesReport[0];
                    for (var i = index ? Number(index) : 1; i < messages.length; i++) {
                        if (runtime.getCurrentScript().getRemainingUsage() < 1000) {
                            log.audit("Not Execution Units", "Scheduled for another iteration in processing report");
                            file.create({ name: reportFile.name, fileType: file.Type.CSV, folder: 148043, contents: contentNewFile + linesReport.slice(i) }).save();
                            task.create({
                                taskType: task.TaskType.SCHEDULED_SCRIPT,
                                scriptId: runtime.getCurrentScript().id,
                                deploymentId: runtime.getCurrentScript().deploymentId,
                                params: {
                                    custscript_mw_index: i,
                                    custscript_mw_messages: JSON.stringify(messages),
                                    custscript_mw_status: "Report"
                                }
                            }).submit();
                            return;
                        }
                        else {
                            var lineData = linesReport[i].toString();
                            log.debug("Index", i);
                            log.debug("line", lineData);
                            log.debug("Message", messages[i]);
                            if (lineData.indexOf("Match - Property ID") == -1 && lineData.indexOf("New Record - Property ID") == -1 && lineData.indexOf("Error") == -1 && lineData.indexOf("NOT MATCH") == -1) {
                                if (lineData.indexOf("Not Import") != -1) {
                                    if (messages[i]) {
                                        lineData = lineData.replace("Not Import", "");
                                        contentNewFile += "" + messages[i] + lineData + "\n";
                                    }
                                    else {
                                        contentNewFile += "" + linesReport[i];
                                    }
                                }
                                else {
                                    if (messages[i]) {
                                        contentNewFile += "" + messages[i] + linesReport[i];
                                    }
                                    else {
                                        contentNewFile += "Not Import" + linesReport[i];
                                    }
                                }
                            }
                            else {
                                contentNewFile += "" + linesReport[i];
                            }
                        }
                    }
                    var newFile = file.create({ name: reportFile.name, fileType: file.Type.CSV, folder: 148043, contents: contentNewFile }).save();
                    log.debug("New File", newFile);
                    task.create({
                        taskType: task.TaskType.SCHEDULED_SCRIPT,
                        scriptId: runtime.getCurrentScript().id,
                        deploymentId: runtime.getCurrentScript().deploymentId,
                        params: {
                            custscript_mw_status: "Search"
                        }
                    }).submit();
                    record.submitFields({ type: "customrecord_mw_import_property_queue", id: fileIdInProgress.id, values: { custrecord_mw_status_report: "4" } });
                    return;
                }
            }
            else {
                var queuePending = getFileofQueue("1");
                log.debug("queuePending", queuePending);
                if (queuePending.fileId) {
                    record.submitFields({ type: "customrecord_mw_import_property_queue", id: queuePending.id, values: { custrecord_mw_status_report: "2" } });
                    task.create({
                        taskType: task.TaskType.SCHEDULED_SCRIPT,
                        scriptId: runtime.getCurrentScript().id,
                        deploymentId: runtime.getCurrentScript().deploymentId,
                        params: {
                            custscript_mw_status: "Search"
                        }
                    }).submit();
                }
                return;
            }
        }
        catch (e) {
            log.error("Error", e);
        }
    }
    exports.execute = execute;
    // Functions Get Lines
    function getLines(pFileContent) {
        var lines = [];
        try {
            if (pFileContent) {
                pFileContent = pFileContent.replace(/\s\",/g, "\",");
                lines = pFileContent.split((/\r\n|\n/)).map(function (z) { return z.replace(/\r\n|\n|\r/g, ''); }).map(function (z) { return z = z + '\n'; });
            }
        }
        catch (error) {
            log.error('getLines', error.message);
        }
        return lines;
    }
    function getFileofQueue(pStatus) {
        var response = { fileId: "", id: "" };
        try {
            search.create({
                type: "customrecord_mw_import_property_queue",
                filters: [
                    ["custrecord_mw_status_report", "anyof", pStatus]
                ],
                columns: [
                    "custrecord_mw_csv_file_report",
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC
                    })
                ]
            }).run().each(function (result) {
                response.fileId = String(result.getValue("custrecord_mw_csv_file_report"));
                response.id = String(result.id);
                return false;
            });
        }
        catch (error) {
            log.error('getImportQueuesPending', error.message);
        }
        log.debug('getFileofQueue', response);
        return response;
    }
});
