/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Fernanda Carmona
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/record", "N/search", "N/ui/serverWidget", "../../crypto.js", "N/email"], function (require, exports, log, record, search, serverWidget, CryptoJS, email) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AUTHORIZATION_FIELDS = {
        RECORD_TYPE: "customrecord_auth_pass_phrase",
        SECRET_KEY: "custrecord_secret_key",
        ID: "1",
    };
    var NAME_FIELDS = [
        "custrecord31",
        "custrecord_house_number",
        "custrecord_property_status",
        "custrecordcustrecordsubdname",
        "custrecord12",
    ];
    function beforeLoad(pContext) {
        try {
            if (pContext.type == pContext.UserEventType.CREATE) {
                var today = new Date();
                var month = today.getMonth();
                month = month + 1;
                var day = today.getDate();
                var year = today.getFullYear();
                var dateFormatted = month + "/" + day + "/" + year;
                pContext.newRecord.setValue({ fieldId: "custrecord_property_date_sales_st_update", value: dateFormatted });
                var builder = pContext.newRecord.getValue({ fieldId: "custrecord12" });
                topLevelParent(builder, pContext);
                pContext.form.getField({ id: "name" }).updateDisplayType({ displayType: serverWidget.FieldDisplayType.DISABLED });
                pContext.form
                    .getField({ id: "custrecord_top_level_builder" })
                    .updateDisplayType({ displayType: serverWidget.FieldDisplayType.DISABLED });
            }
            if (pContext.type == pContext.UserEventType.EDIT) {
                var today = new Date();
                var month = today.getMonth();
                month = month + 1;
                var day = today.getDate();
                var year = today.getFullYear();
                var dateFormatted = month + "/" + day + "/" + year;
                var propertyId = pContext.newRecord.getValue({ fieldId: "id" });
                var price = pContext.newRecord.getValue({ fieldId: "custrecord_current_list_price" });
                var constructionStatus = pContext.newRecord.getValue({ fieldId: "custrecord_construction_status_listing" });
                var propertyStatus = pContext.newRecord.getValue({ fieldId: "custrecord_property_status" });
                var enteredIntoMLS = pContext.newRecord.getValue({ fieldId: "custrecord_entered_mls" });
                var MLSNumber = pContext.newRecord.getValue({ fieldId: "custrecord_mls_number_region1" });
                var listDate = pContext.newRecord.getValue({ fieldId: "custrecord_list_date" });
                var listDateString = JSON.stringify(listDate);
                if (price != "" ||
                    constructionStatus != "" ||
                    propertyStatus != "" ||
                    enteredIntoMLS != false ||
                    MLSNumber != "" ||
                    listDate != "") {
                    var propertyChangeRecord = record.create({ type: "customrecord_property_changes" });
                    propertyChangeRecord.setValue({ fieldId: "custrecord_property", value: Number(propertyId) });
                    propertyChangeRecord.setValue({ fieldId: "custrecord_property_price_change", value: String(price) });
                    if (constructionStatus) {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_change_construction_status", value: Number(constructionStatus) });
                    }
                    propertyChangeRecord.setValue({ fieldId: "custrecord_date_modified", value: today });
                    propertyChangeRecord.setValue({ fieldId: "custrecord_new_property_status", value: Number(propertyStatus) });
                    propertyChangeRecord.setValue({ fieldId: "custrecord_entered_in_mls_changes", value: enteredIntoMLS });
                    propertyChangeRecord.setValue({ fieldId: "custrecord_previous_mls_number", value: Number(MLSNumber) });
                    if (listDateString != '""') {
                        //log.debug("Formating date",listDateString);
                        propertyChangeRecord.setValue({ fieldId: "custrecord_previous_list_date", value: formatDate(listDateString) });
                    }
                    //log.debug("Listtt date",listDate);
                    propertyChangeRecord.save();
                    return;
                }
            }
        }
        catch (error) {
            log.error("Error in beforeLoad", error.message);
            log.debug("Error in beforeLoad", JSON.stringify(error));
            if (!pContext.newRecord.getValue("isinactive")) {
                var subject = "Error in property " + pContext.newRecord.id + " user event beforeLoad : " + error.message;
                var body = "Stack :\n\n" + JSON.stringify(error, null, 2);
                email.send({ author: 3847, body: body, subject: subject, recipients: ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"] });
            }
        }
    }
    exports.beforeLoad = beforeLoad;
    /**
     * In delete context, delete all Property Changes Records related to the Property Record.
     * @param pContext
     */
    function beforeSubmit(pContext) {
        try {
            if (pContext.type == pContext.UserEventType.DELETE) {
                var id = pContext.oldRecord.getValue({ fieldId: "id" });
                log.debug("Delete function", "Property Record id: " + id);
                var searchObj = search.create({
                    type: "customrecord_property_changes",
                    id: "customrecord_property_changes_search",
                    columns: [search.createColumn({ name: "internalid", label: "Internal ID" })],
                    filters: [["isinactive", "is", "F"], "AND", ["custrecord_property.id", "equalto", id]],
                });
                var results_1 = [];
                searchObj.run().each(function (result) {
                    results_1.push(result);
                    return true;
                });
                log.debug("Search Results of Property Changes", results_1.length + " results found");
                for (var i = 0; i < results_1.length; i++) {
                    record.delete({ type: "customrecord_property_changes", id: results_1[i].id });
                    log.debug("Property Changes Record Deleted", "Id: " + results_1[i].id);
                }
            }
        }
        catch (error) {
            log.error("Error in beforeSubmit load", error.message);
            log.debug("Error in beforeSubmit", JSON.stringify(error));
            var subject = "Error in property " + pContext.newRecord.id + " user event beforeSubmit : " + error.message;
            var body = "Stack :\n\n" + JSON.stringify(error, null, 2);
            email.send({ author: 3847, body: body, subject: subject, recipients: ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"] });
        }
    }
    exports.beforeSubmit = beforeSubmit;
    function afterSubmit(pContext) {
        try {
            propertyChangeAudit(pContext);
            if (pContext.type != pContext.UserEventType.DELETE) {
                if (nameShouldBeUpdated(pContext)) {
                    updatePropertyName(pContext.newRecord.id);
                }
            }
            if (pContext.type == pContext.UserEventType.CREATE) {
                setExternalId(pContext.newRecord.id);
            }
            return true;
        }
        catch (error) {
            log.error("Error in afterSubmit", error.message);
            log.debug("Error in afterSubmit", JSON.stringify(error));
            var subject = "Error in property " + pContext.newRecord.id + " user event afterSubmit : " + error.message;
            var body = "Stack :\n\n" + JSON.stringify(error, null, 2);
            email.send({ author: 3847, body: body, subject: subject, recipients: ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"] });
        }
        //Update the las property changes record regerated
    }
    exports.afterSubmit = afterSubmit;
    function nameShouldBeUpdated(pContext) {
        if (pContext.type == pContext.UserEventType.CREATE) {
            log.debug("nameShouldBeUpdated", "context is create, returning true");
            return true;
        }
        else {
            for (var i in NAME_FIELDS) {
                var field = NAME_FIELDS[i];
                log.debug("nameShouldBeUpdated", "checking field : " + field + ", old : " + pContext.oldRecord.getValue(field) + ", new : " + pContext.newRecord.getValue(field));
                if (pContext.oldRecord.getValue(field) != pContext.newRecord.getValue(field)) {
                    return true;
                }
            }
            return false;
        }
    }
    function setExternalId(pPropertyID) {
        try {
            var secretKey = search.lookupFields({
                type: AUTHORIZATION_FIELDS.RECORD_TYPE,
                id: AUTHORIZATION_FIELDS.ID,
                columns: [AUTHORIZATION_FIELDS.SECRET_KEY],
            })[AUTHORIZATION_FIELDS.SECRET_KEY];
            var encrypted = CryptoJS.AES.encrypt(pPropertyID.toString(), secretKey.toString());
            var custrecord_secret_code = CryptoJS.AES.decrypt(encrypted, secretKey.toString()).toString();
            var values = { custrecord_secret_code: custrecord_secret_code };
            record.submitFields({ type: "customrecord_property_record", id: pPropertyID, values: values });
        }
        catch (error) {
            log.error("Error setting external id (custrecord_secret_code)", JSON.stringify(error));
        }
    }
    function updatePropertyName(pPropertyID) {
        log.debug("updatePropertyName", "Updating propert name. pPropertyID : " + pPropertyID);
        var propertyData = search.lookupFields({
            type: "customrecord_property_record",
            id: pPropertyID,
            columns: [
                "custrecord31",
                "custrecord_house_number",
                "custrecord_property_status",
                "custrecordcustrecordsubdname",
                "custrecord12",
            ],
        });
        var streetName = propertyData.custrecord31[0].text;
        var houseNumber = propertyData.custrecord_house_number;
        var saleStatus = propertyData.custrecord_property_status[0].text;
        var subdivision = propertyData.custrecordcustrecordsubdname[0].value;
        log.debug("subdivision", "subdivision : " + subdivision);
        var builderDivision = propertyData.custrecord12[0].text;
        log.debug("builderDivision", "builderDivision : " + builderDivision);
        var subdivisionName = search.lookupFields({
            type: "customrecord_subdivision",
            id: subdivision,
            columns: ["custrecord_subdivision_id"],
        }).custrecord_subdivision_id;
        var propertyName = streetName + " " + houseNumber + " (" + saleStatus + ") " + subdivisionName + " | " + builderDivision;
        var simpleName = houseNumber + " " + streetName;
        log.debug("Property Name ", propertyName);
        record.submitFields({
            type: "customrecord_property_record",
            id: pPropertyID,
            values: {
                name: propertyName,
                custrecord_simple_name: simpleName,
            },
        });
    }
    /**
     * Update the last Property Changes record
     * @param pContext
     */
    function propertyChangeAudit(pContext) {
        if (pContext.type == pContext.UserEventType.EDIT) {
            var today = new Date();
            var month = today.getMonth();
            month = month + 1;
            var day = today.getDate();
            var year = today.getFullYear();
            var dateFormatted = month + "/" + day + "/" + year;
            var propertyId = pContext.newRecord.getValue("id");
            var property = record.load({ type: "customrecord_property_record", id: propertyId });
            var price = property.getValue({ fieldId: "custrecord_current_list_price" });
            var constructionStatus = property.getValue({ fieldId: "custrecord_construction_status_listing" });
            log.debug("Construction status listing", JSON.stringify(constructionStatus));
            var estCompletionDate = property.getValue({ fieldId: "custrecord_estimated_completion_date" });
            var MLSExpirationDate = property.getValue({ fieldId: "custrecord_expiration_date" });
            var estUnderRoofDate = property.getValue({ fieldId: "custrecord_estimated_under_roof_date" });
            var propertyStatus = property.getValue({ fieldId: "custrecord_property_status" });
            if (propertyStatus == "") {
                propertyStatus = null;
            }
            var enteredIntoMLS = property.getValue({ fieldId: "custrecord_entered_mls" });
            if (enteredIntoMLS == "") {
                enteredIntoMLS = null;
            }
            var MLSNumber = property.getValue({ fieldId: "custrecord_mls_number_region1" });
            var listDate = property.getValue({ fieldId: "custrecord_list_date" });
            var searchObj = search.create({
                type: "customrecord_property_changes",
                id: "customrecord_property_changes_search",
                columns: [search.createColumn({ name: "internalid", label: "Internal ID" })],
                filters: [["isinactive", "is", "F"], "AND", ["custrecord_property.id", "equalto", propertyId]],
            });
            var results_2 = [];
            searchObj.run().each(function (result) {
                results_2.push(result);
                return true;
            });
            log.debug("Search Results", results_2.length + " reults of Property Changes");
            for (var i = 0; results_2 != null && results_2.length > i; i++) {
                var sortArray = new Array();
                sortArray[i] = results_2[i].id;
            }
            if (sortArray != null) {
                sortArray.sort(sortList);
                var propertyChangeRecord = record.load({ type: "customrecord_property_changes", id: sortArray[0] });
                var pcPrice = propertyChangeRecord.getValue({ fieldId: "custrecord_property_price_change" });
                var pcConstructionStatus = propertyChangeRecord.getValue({ fieldId: "custrecord_change_construction_status" });
                var pcEstCompletionDate = propertyChangeRecord.getValue({ fieldId: "custrecord_new_estimated_completion" });
                var pcMLSExpirationDate = propertyChangeRecord.getValue({ fieldId: "custrecord_new_expiration_date" });
                var pcEstUnderRoofDate = propertyChangeRecord.getValue({ fieldId: "custrecord_new_estimated_under_roof" });
                var pcPropertyStatus = propertyChangeRecord.getValue({ fieldId: "custrecord_new_property_status" });
                var pcDateModified = propertyChangeRecord.getValue({ fieldId: "custrecord_date_modified" });
                var pcEnteredIntoMLS = propertyChangeRecord.getValue({ fieldId: "custrecord_entered_in_mls_changes" });
                var pcMLSNumber = propertyChangeRecord.getValue({ fieldId: "custrecord_previous_mls_number" });
                var pcListDate = propertyChangeRecord.getValue({ fieldId: "custrecord_previous_list_date" });
                var estCompletionDateString = JSON.stringify(estCompletionDate);
                var MLSExpirationDateString = JSON.stringify(MLSExpirationDate);
                var estUnderRoofDateString = JSON.stringify(estUnderRoofDate);
                var listDateString = JSON.stringify(listDate);
                log.debug("price", price);
                var currentPRChange = Number(propertyChangeRecord.getValue({ fieldId: "id" }));
                if (price == pcPrice &&
                    constructionStatus == pcConstructionStatus &&
                    estCompletionDate == pcEstCompletionDate &&
                    MLSExpirationDate == pcMLSExpirationDate &&
                    estUnderRoofDate == pcEstUnderRoofDate &&
                    propertyStatus == pcPropertyStatus &&
                    dateFormatted == pcDateModified &&
                    enteredIntoMLS == pcEnteredIntoMLS &&
                    MLSNumber == pcMLSNumber &&
                    listDate == pcListDate) {
                    record.delete({ type: "customrecord_property_changes", id: Number(propertyChangeRecord.getValue({ fieldId: "id" })) });
                    log.debug("Property Changes Record Deleted", "ID: " + Number(propertyChangeRecord.getValue({ fieldId: "id" })));
                }
                else {
                    if (price == pcPrice) {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_property_price_change", value: "" });
                        log.debug("Set value '' to property record changes id :" + currentPRChange, "price");
                    }
                    else {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_new_price", value: Number(price) });
                    }
                    if (constructionStatus == pcConstructionStatus) {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_change_construction_status", value: "" });
                        log.debug("Set value '' to property record changes id :" + currentPRChange, "construction status");
                    }
                    else {
                        log.debug("construction status", constructionStatus);
                        propertyChangeRecord.setValue({ fieldId: "custrecord_new_construction_status", value: Number(constructionStatus) });
                    }
                    if (estCompletionDate == pcEstCompletionDate) {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_new_estimated_completion", value: "" });
                        log.debug("Set value '' to property record changes id :" + currentPRChange, "completion date");
                    }
                    else {
                        if (estCompletionDateString != '""' && estCompletionDateString != "null") {
                            //added to string as field is free form text, not date
                            propertyChangeRecord.setValue({
                                fieldId: "custrecord_pc_estimated_completion_date",
                                value: formatDate(estCompletionDateString).toString(),
                            });
                        }
                    }
                    if (MLSExpirationDate == pcMLSExpirationDate) {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_new_expiration_date", value: "" });
                        log.debug("Set value '' to property record changes id :" + currentPRChange, "expiration date");
                    }
                    else {
                        if (MLSExpirationDateString != '""' && MLSExpirationDateString != "null") {
                            propertyChangeRecord.setValue({
                                fieldId: "custrecord_mls_expiration_date",
                                value: formatDate(MLSExpirationDateString),
                            });
                        }
                    }
                    if (estUnderRoofDate == pcEstUnderRoofDate) {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_new_estimated_under_roof", value: "" });
                        log.debug("Set value '' to property record changes id :" + currentPRChange, "under roof date");
                    }
                    else {
                        if (estUnderRoofDateString != '""' && estUnderRoofDateString != "null") {
                            propertyChangeRecord.setValue({
                                fieldId: "custrecord_estimated_under_roof",
                                value: formatDate(estUnderRoofDateString),
                            });
                        }
                    }
                    if (propertyStatus == pcPropertyStatus) {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_new_property_status", value: "" });
                        log.debug("Set value '' to property record changes id :" + currentPRChange, "property status");
                    }
                    else {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_update_property_status", value: Number(propertyStatus) });
                    }
                    if (MLSNumber == pcMLSNumber) {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_previous_MLS_Number", value: "" });
                        log.debug("Set value '' to property record changes id :" + currentPRChange, "mlsnumber");
                    }
                    else {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_new_mls_number", value: Number(MLSNumber) });
                    }
                    if (listDate == pcListDate) {
                        propertyChangeRecord.setValue({ fieldId: "custrecord_previous_list_date", value: "" });
                        log.debug("Set value '' to property record changes id :" + currentPRChange, "list date");
                    }
                    else {
                        if (listDateString != '""' && listDateString != "null") {
                            propertyChangeRecord.setValue({ fieldId: "custrecord_new_list_date", value: formatDate(listDateString) });
                        }
                    }
                    propertyChangeRecord.setValue({ fieldId: "custrecord_changes_committed", value: true });
                    propertyChangeRecord.save();
                    log.debug("SAVE property record changes id :" + currentPRChange, "");
                    return;
                }
            }
        }
    }
    function sortList(a, b) {
        return b - a;
    }
    /**
     * Search the top level builder subdivision.
     * @param builder builder division field of property record
     * @param pContext
     */
    function topLevelParent(builder, pContext) {
        if (builder != null && builder != "") {
            var builderRecord = record.load({ type: "customer", id: Number(builder) });
            var parent = builderRecord.getValue({ fieldId: "parent" });
            if (parent == null || parent == "") {
                pContext.newRecord.setValue({ fieldId: "custrecord_top_level_builder", value: builder });
            }
            else {
                var nextLevelParent = parent;
                while (nextLevelParent != null && nextLevelParent != "" && nextLevelParent != undefined) {
                    var parentRecord = record.load({ type: "customer", id: Number(nextLevelParent) });
                    var parent = nextLevelParent;
                    var nextLevelParent = parentRecord.getValue({ fieldId: "parent" });
                }
                pContext.newRecord.setValue({ fieldId: "custrecord_top_level_builder", value: parent });
            }
        }
    }
    /**
     * Convert a string date to date format
     * @param date string format example "2019-11-14T08:00:00.000Z"
     */
    function formatDate(date) {
        var dateParts = date.split("-");
        var year = dateParts[0];
        var day = dateParts[2];
        var month = dateParts[1];
        year = year.replace('"', "");
        day = day.substring(0, 2);
        var fulldate = new Date();
        fulldate.setMonth(Number(month) - 1);
        fulldate.setDate(Number(day));
        fulldate.setFullYear(Number(year));
        return fulldate;
    }
});
