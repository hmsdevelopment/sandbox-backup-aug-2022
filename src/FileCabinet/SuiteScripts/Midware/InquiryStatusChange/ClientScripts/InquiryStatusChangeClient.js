/**
* @NApiVersion 2.0
* @NScriptType ClientScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/https", "N/url"], function (require, exports, log, https, url) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var flag;
    var dateInit;
    function pageInit(pContext) {
        try {
            if (pContext.mode == "edit") {
                flag = true;
                var saveDate = url.resolveScript({
                    scriptId: "customscript_mw_inquiry_status_validatio",
                    deploymentId: "customdeploy_mw_inquiry_status_val_d",
                    params: {
                        method: "saveField",
                        id: pContext.currentRecord.id
                    }
                });
                dateInit = https.get({
                    url: saveDate,
                }).body.toString();
                ;
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.pageInit = pageInit;
    function saveRecord(pContext) {
        try {
            var dataInfo = dateInit.split("__");
            console.log(dataInfo);
            console.log(flag);
            if (flag) {
                var compareDate = url.resolveScript({
                    scriptId: "customscript_mw_inquiry_status_validatio",
                    deploymentId: "customdeploy_mw_inquiry_status_val_d",
                    params: {
                        method: "compare",
                        id: pContext.currentRecord.id,
                        date: dataInfo[0],
                        callStatus: dataInfo[1]
                    }
                });
                var status_1 = https.get({
                    url: compareDate,
                }).body.toString();
                console.log(status_1);
                if (!status_1) {
                    return true;
                }
                else {
                    var statusArr = status_1.split("__");
                    var answer = confirm("This inquiry has been set to " + statusArr[1]);
                    pContext.currentRecord.setValue({ fieldId: "status", value: Number(statusArr[0]) });
                    return true;
                }
            }
            else {
                return true;
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.saveRecord = saveRecord;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
