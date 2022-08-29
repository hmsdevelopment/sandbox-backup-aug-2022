/**
* @NApiVersion 2.0
* @NScriptType Restlet
* @NModuleScope SameAccount
* @author Midware
* @developer Francisco Alvarado Ferllini
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/error", "N/search"], function (require, exports, log, error, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function get(requestParams) {
        try {
            return getReportData();
        }
        catch (error) {
            handleError(error);
            return error.message;
        }
    }
    exports.get = get;
    function post(requestBody) {
        try {
        }
        catch (error) {
            handleError(error);
            return error.message;
        }
    }
    exports.post = post;
    function doValidation(args, argNames, methodName) {
        for (var i = 0; i < argNames.length; i++) {
            if (!args[argNames[i]])
                throw error.create({
                    name: 'MW_MISSING_REQ_ARG',
                    message: 'Missing a required argument: [' + argNames[i] + '] for method: ' + methodName
                });
        }
    }
    function getReportData() {
        var response = {};
        try {
            var supportcaseSearchObj = search.load({ id: "353" });
            supportcaseSearchObj.run().each(function (pRow) {
                var date = pRow.getValue({ name: "startdate", summary: search.Summary.GROUP }).toString();
                var dateArray = date.split('-');
                var month = dateArray[1].length == 2 ? dateArray[1] : dateArray[0];
                var year = dateArray[0].length == 4 ? dateArray[0] : dateArray[1];
                var division = pRow.getText({ name: "custentity1", join: "CUSTEVENT_BUILDER_SALES_REP_SUBD", summary: search.Summary.GROUP, sort: search.Sort.ASC }).toString();
                var divisionArray = division.split(":");
                var divisionName = divisionArray.length == 2 ? divisionArray[1] : divisionArray[0];
                var count = pRow.getValue({ name: "internalid", summary: search.Summary.COUNT });
                if (divisionName)
                    response[divisionName] = { year: year, month: month, count: count };
                return true;
            });
        }
        catch (pError) { }
        return JSON.stringify(response);
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
