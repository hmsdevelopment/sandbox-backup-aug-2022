/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/search", "N/record", "../Global/suffixes"], function (require, exports, log, search, record, suffixes) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function execute(pContext) {
        try {
            var sufix = suffixes.SUFFIXES;
            for (var x in sufix) {
                log.debug('Sufix', sufix[x]);
                var customlist_street_type_suffixSearchObj = search.create({
                    type: "customlist_street_type_suffix",
                    filters: [
                        ["name", "is", sufix[x]]
                    ],
                    columns: [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC
                        }),
                        "scriptid"
                    ]
                });
                var searchResultCount = customlist_street_type_suffixSearchObj.runPaged().count;
                if (searchResultCount == 0) {
                    var newSuffix = record.create({ type: 'customlist_street_type_suffix' });
                    newSuffix.setValue({ fieldId: 'name', value: sufix[x] });
                    var id = newSuffix.save();
                    log.debug('NewSuffix', id);
                }
            }
        }
        catch (pError) {
            handleError(pError);
        }
    }
    exports.execute = execute;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
