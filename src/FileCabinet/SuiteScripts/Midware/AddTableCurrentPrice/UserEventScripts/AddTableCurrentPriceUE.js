/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/ui/serverWidget", "N/search", "N/record", "N/runtime"], function (require, exports, log, ui, search, record, runtime) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        try {
            // let customTab = pContext.form.addSubtab({
            //     id: "custpage_new_sub_tab",
            //     label: "Current Price List",
            //     tab: "custom10lnk"
            // });
            // pContext.form.insertSubtab({})
            if (runtime.executionContext == runtime.ContextType.USER_INTERFACE) {
                var test = pContext.form.getTab({ id: "custom11" });
                log.debug("Test", test);
                var customSublist_1 = pContext.form.addSublist({
                    id: "custpage_sublist_price",
                    label: "Sublist Price",
                    type: ui.SublistType.LIST,
                    tab: "custom10",
                });
                customSublist_1.addField({
                    id: "custpage_date",
                    type: ui.FieldType.DATETIMETZ,
                    label: "Date Submitted"
                });
                customSublist_1.addField({
                    id: "custpage_price",
                    type: ui.FieldType.TEXT,
                    label: "Price"
                });
                customSublist_1.addField({
                    id: "custpage_current_price_checkbox",
                    type: ui.FieldType.RADIO,
                    label: "Is current price?"
                });
                customSublist_1.addField({
                    id: "custpage_current_id_record",
                    type: ui.FieldType.TEXT,
                    label: "Id Record"
                }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                var line_1 = 0;
                var customrecord_mw_current_price_builder_pSearchObj = search.create({
                    type: "customrecord_mw_current_price_builder_p",
                    filters: [
                        ["custrecord_mw_property_related", "anyof", pContext.newRecord.id]
                    ],
                    columns: [
                        "custrecord_mw_price",
                        search.createColumn({
                            name: "custrecord_mw_date_current_price",
                            sort: search.Sort.DESC
                        }),
                        "custrecord_mw_is_current_price",
                        "internalid"
                    ]
                });
                var searchResultCount = customrecord_mw_current_price_builder_pSearchObj.runPaged().count;
                customrecord_mw_current_price_builder_pSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    // log.debug("Price", result.getValue("custrecord_mw_price"));
                    // log.debug("Date", result.getValue("custrecord_mw_date_current_price"))
                    // log.debug("Is current Price", result.getValue("custrecord_mw_is_current_price"))
                    customSublist_1.setSublistValue({
                        id: "custpage_date",
                        line: line_1,
                        value: String(result.getValue("custrecord_mw_date_current_price"))
                    });
                    customSublist_1.setSublistValue({
                        id: "custpage_price",
                        line: line_1,
                        value: String(result.getValue("custrecord_mw_price"))
                    });
                    customSublist_1.setSublistValue({
                        id: "custpage_current_price_checkbox",
                        line: line_1,
                        value: result.getValue("custrecord_mw_is_current_price") ? "T" : "F"
                    });
                    customSublist_1.setSublistValue({
                        id: "custpage_current_id_record",
                        line: line_1,
                        value: String(result.getValue("internalid"))
                    });
                    line_1 += 1;
                    return true;
                });
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeLoad = beforeLoad;
    function beforeSubmit(pContext) {
        try {
            if (runtime.executionContext == runtime.ContextType.USER_INTERFACE) {
                var lines = pContext.newRecord.getLineCount({
                    sublistId: "custpage_sublist_price"
                });
                log.debug("Line Count", lines);
                for (var i = 0; i < lines; i++) {
                    var radioValue = pContext.newRecord.getSublistValue({
                        sublistId: "custpage_sublist_price",
                        fieldId: "custpage_current_price_checkbox",
                        line: i
                    });
                    if (radioValue == "T") {
                        var recordId = pContext.newRecord.getSublistValue({
                            sublistId: "custpage_sublist_price",
                            fieldId: "custpage_current_id_record",
                            line: i
                        });
                        var currentPriceSelected = pContext.newRecord.getSublistValue({
                            sublistId: "custpage_sublist_price",
                            fieldId: "custpage_price",
                            line: i
                        });
                        pContext.newRecord.setValue({
                            fieldId: "custrecord_current_list_price",
                            value: String(currentPriceSelected)
                        });
                        record.submitFields({
                            type: "customrecord_mw_current_price_builder_p",
                            id: String(recordId),
                            values: { custrecord_mw_is_current_price: true }
                        });
                        log.debug("Test", i);
                    }
                }
                var customrecord_mw_current_price_builder_pSearchObj = search.create({
                    type: "customrecord_mw_current_price_builder_p",
                    filters: [
                        ["custrecord_mw_property_related", "anyof", pContext.newRecord.id],
                        "AND",
                        ["internalid", "noneof", recordId]
                    ],
                    columns: [
                        "custrecord_mw_price",
                        search.createColumn({
                            name: "custrecord_mw_date_current_price",
                            sort: search.Sort.DESC
                        }),
                        "custrecord_mw_is_current_price",
                        "internalid"
                    ]
                });
                var searchResultCount = customrecord_mw_current_price_builder_pSearchObj.runPaged().count;
                log.debug("customrecord_mw_current_price_builder_pSearchObj result count", searchResultCount);
                customrecord_mw_current_price_builder_pSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    record.submitFields({
                        type: "customrecord_mw_current_price_builder_p",
                        id: String(result.getValue("internalid")),
                        values: { custrecord_mw_is_current_price: false }
                    });
                    return true;
                });
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeSubmit = beforeSubmit;
    function afterSubmit(pContext) {
        try {
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.afterSubmit = afterSubmit;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
