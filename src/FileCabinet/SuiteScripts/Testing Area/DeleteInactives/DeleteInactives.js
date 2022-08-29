/**
 * @NAPIVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Jeff McDonald
 * @Developer HMS Marketing Services
 * @contact jmcdonald@hmsmarketingservices.com
 */
define(["require", "exports", "N/record", "N/search"], function (require, exports, record, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function onRequest(pContext) {
        var recordSearched = "customrecord_audit_log";
        var columns = ["internalid"];
        var filters = ["internalid", "is", "any"];
        var mySearch = search.create({
            type: recordSearched,
            columns: columns,
            filters: filters
        });
        var myPagedData = mySearch.runPaged();
        myPagedData.pageRanges.forEach(function (pageRange) {
            var myPage = myPagedData.fetch({ index: pageRange.index });
            myPage.data.forEach(function (result) {
                var internalId = result.getValue({
                    name: "internalid"
                });
                var delRec = record.delete({
                    type: recordSearched,
                    id: internalId.toString()
                });
                return true;
            });
        });
        pContext.response.write({
            output: "Records have been deleted."
        });
        return {
            onRequest: onRequest
        };
        /*    function del(results) {
    
                for (let index = 0; index < results.length; index++) {
                    const element = results[index];
                    
                }
                let delRec = record.delete({
                    type: "customrecord_property_record_schema",
                    id: results["internalid"]
                });
            };
    
           for each (record in results){
            
            let delRec = record.delete({
                type: record.Type.customrecord_property_record_schema,
                id: results.id
            });
        } */
    }
    exports.onRequest = onRequest;
});
