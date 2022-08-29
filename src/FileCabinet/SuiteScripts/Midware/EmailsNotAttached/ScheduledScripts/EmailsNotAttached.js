/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer Roy Cordero
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/runtime", "N/task", "N/search", "N/record", "N/file"], function (require, exports, log, runtime, task, search, record, file) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function execute(pContext) {
        try {
            if (runtime.getCurrentScript().getRemainingUsage() < 1000) {
                // Re Schedule if not remaining execution units
                log.debug("Not Execution Units", "Scheduled for another iteration");
                task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId
                }).submit();
                return;
            }
            else {
                var array_1 = [];
                var array2_1 = [];
                var savedSeach = search.load({ id: "customsearch_mw_emails_not_attached" });
                savedSeach.run().each(function (result) {
                    var message = record.load({ type: record.Type.MESSAGE, id: result.id });
                    if (!message.getValue('record')) {
                        var body = message.getValue('message');
                        var propertyLink = String(body).match(/&id=[0-9]*/g);
                        var propertyID = String(propertyLink[0]).replace(/&id=/g, "");
                        var propertyRecord = record.load({ type: "customrecord_property_record", id: propertyID });
                        var houseNumber = propertyRecord.getValue("custrecord_house_number");
                        var streetName = propertyRecord.getText("custrecord31");
                        var lotNumber = propertyRecord.getValue("custrecord_lot_number");
                        var subdivision = propertyRecord.getText("custrecordcustrecordsubdname");
                        var division = propertyRecord.getText("custrecord12");
                        var newObject = {
                            "message_id": result.id,
                            "date_time": result.getValue("messagedate"),
                            "property_id": propertyID,
                            "house_number": houseNumber,
                            "street_name": streetName,
                            "lot_number": lotNumber,
                            "subdivision": subdivision,
                            "division": division
                        };
                        if (array_1.length === 40) {
                            array2_1.push(newObject);
                        }
                        else {
                            array_1.push(newObject);
                        }
                    }
                    return true;
                });
                log.debug("array.length", array_1.length);
                log.debug("JSON.stringify(array)", JSON.stringify(array_1));
                log.debug("array2.length", array2_1.length);
                log.debug("JSON.stringify(array2)", JSON.stringify(array2_1));
                var testFile = file.load(130104);
                testFile.appendLine({ value: JSON.stringify(array_1) });
                testFile.appendLine({ value: JSON.stringify(array2_1) });
                testFile.save();
            }
        }
        catch (e) {
            log.debug("Error", "Error: " + e.message);
        }
    }
    exports.execute = execute;
});
