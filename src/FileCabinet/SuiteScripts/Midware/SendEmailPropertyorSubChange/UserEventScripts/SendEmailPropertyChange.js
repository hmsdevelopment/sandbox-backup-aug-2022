/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/search", "N/email", "../Constants/constants"], function (require, exports, log, search, email, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        try {
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeLoad = beforeLoad;
    function beforeSubmit(pContext) {
        try {
            if (pContext.type === pContext.UserEventType.EDIT || pContext.type === pContext.UserEventType.XEDIT) {
                if (pContext.newRecord.getValue(constants.PROPERTY_FIELDS.CHECKBOX)) {
                    var builderPersonnel = search.lookupFields({
                        type: "partner",
                        id: String(pContext.newRecord.getValue("custrecord_mw_last_builder_personnel_ed")),
                        columns: ["entityid", "firstname", "lastname"]
                    });
                    log.audit("Builder", builderPersonnel);
                    var textBody = "User " + builderPersonnel.firstname + " " + builderPersonnel.lastname + " has edited a property record.</br></br> \n\n";
                    var emailBody = "\n \n \n\n                <table>";
                    var mlsStatusNew = pContext.newRecord.getText(constants.PROPERTY_FIELDS.MLS_STATUS);
                    var mlsStatusOld = pContext.oldRecord.getText(constants.PROPERTY_FIELDS.MLS_STATUS);
                    log.debug("New MLS Value", mlsStatusNew);
                    log.debug("Old MLS Value", mlsStatusOld);
                    if (mlsStatusNew != mlsStatusOld)
                        emailBody += "<tr>MLS SALE STATUS</tr> <tr><td>Old Value: " + mlsStatusOld + "  </td> <td>New Value: " + mlsStatusNew + "</td></tr></br>";
                    var lastMlsSaleNew = pContext.newRecord.getValue(constants.PROPERTY_FIELDS.LAST_MLS_SALE_STATUS);
                    var lastMlsSaleOld = pContext.oldRecord.getValue(constants.PROPERTY_FIELDS.LAST_MLS_SALE_STATUS);
                    log.debug("New MLS Last Value", lastMlsSaleNew);
                    log.debug("Old MLS Last Value", lastMlsSaleOld);
                    // if (lastMlsSaleNew != lastMlsSaleOld) emailBody += `<tr>DATE OF LAST SALES STATUS UPDATE</tr> <tr><td>old value: ${lastMlsSaleOld}</td> <td> new value: ${lastMlsSaleNew} </td></tr>`
                    var listingTypeNew = pContext.newRecord.getText(constants.PROPERTY_FIELDS.LISTING_TYPE);
                    var listingTypeOld = pContext.oldRecord.getText(constants.PROPERTY_FIELDS.LISTING_TYPE);
                    log.debug("New MSL Listing Value", listingTypeNew);
                    log.debug("Old MLS Listing Value", listingTypeOld);
                    if (listingTypeNew != listingTypeOld)
                        emailBody += "<tr>LISTING TYPE</tr> <tr><td>Old Value: " + listingTypeOld + "  </td> <td>New Value: " + listingTypeNew + " </td></tr></br>";
                    var currentMlsNew = pContext.newRecord.getText(constants.PROPERTY_FIELDS.CURRENT_MLS_CONSTRUCTION_STATUS);
                    var currentMlsOld = pContext.oldRecord.getText(constants.PROPERTY_FIELDS.CURRENT_MLS_CONSTRUCTION_STATUS);
                    log.debug("New Current MLS Value", currentMlsNew);
                    log.debug("Old Current MLS Value", currentMlsOld);
                    if (currentMlsNew != currentMlsOld)
                        emailBody += "<tr>CURRENT CONSTRUCTION STATUS</tr> <tr><td> Old Value: " + currentMlsOld + " </td> <td>New Value: " + currentMlsNew + " </td></tr>";
                    var lastMlsNew = pContext.newRecord.getValue(constants.PROPERTY_FIELDS.LAST_MLS_CONSTRUCTION_STATUS);
                    var lastMlsOld = pContext.oldRecord.getValue(constants.PROPERTY_FIELDS.LAST_MLS_CONSTRUCTION_STATUS);
                    log.debug("New Last MLS Value", lastMlsNew);
                    log.debug("Old Last MLS Value", lastMlsOld);
                    if (lastMlsNew != lastMlsOld)
                        emailBody += "<tr>DATE OF LAST CONSTRUCTION UPDATE</tr> <tr><td> Old Value: " + lastMlsOld + "</td> <td>New Value: " + lastMlsNew + " </td></tr>";
                    /*  let listDateNew = pContext.newRecord.getValue(constants.PROPERTY_FIELDS.LIST_DATE);
                     let listDateOld = pContext.oldRecord.getValue(constants.PROPERTY_FIELDS.LIST_DATE);
                     log.debug("New listDateNew Value", listDateNew)
                     log.debug("Old listDateOld Value", listDateOld)
     
                     if (listDateNew != listDateOld) emailBody += `<tr>LIST DATE</tr> <tr><td> Old Value: ${listDateOld}</td> <td>New Value: ${listDateNew} </td></tr>` */
                    var currentListPriceNew = pContext.newRecord.getValue(constants.PROPERTY_FIELDS.CURRENT_LIST_PRICE);
                    var currentListPriceOld = pContext.oldRecord.getValue(constants.PROPERTY_FIELDS.CURRENT_LIST_PRICE);
                    log.debug("New currentListPriceNew Value", currentListPriceNew);
                    log.debug("Old currentListPriceOld Value", currentListPriceOld);
                    if (currentListPriceNew != currentListPriceOld)
                        emailBody += "<tr>CURRENT LIST PRICE</tr> <tr><td> Old Value: " + currentListPriceOld + "  </td> <td>New Value: " + currentListPriceNew + " </td></tr></br>";
                    /* let originalPriceNew = pContext.newRecord.getValue(constants.PROPERTY_FIELDS.ORIGINAL_LIST_PRICE);
                    let originalPriceOld = pContext.oldRecord.getValue(constants.PROPERTY_FIELDS.ORIGINAL_LIST_PRICE);
                    log.debug("New originalPriceNew Value", originalPriceNew)
                    log.debug("Old originalPriceOld Value", originalPriceOld)
    
                    if (originalPriceNew != originalPriceOld) emailBody += `<tr>ORIGINAL LIST PRICE</tr> <tr><td> old value: ${originalPriceOld}  </td> <td>new value: ${originalPriceNew} </td></tr></br>` */
                    var floorplanNew = pContext.newRecord.getText(constants.PROPERTY_FIELDS.FLOORPLAN);
                    var floorplanOld = pContext.oldRecord.getText(constants.PROPERTY_FIELDS.FLOORPLAN);
                    log.debug("New floorplanNew Value", floorplanNew);
                    log.debug("Old floorplanOld Value", floorplanOld);
                    if (floorplanNew != floorplanOld)
                        emailBody += "<tr>FLOORPLAN</tr> <tr><td> Old Value: " + floorplanOld + "</td> <td>New Value: " + floorplanNew + "  </td></tr></br>";
                    var elevationNew = pContext.newRecord.getValue(constants.PROPERTY_FIELDS.ELEVATION);
                    var elevationOld = pContext.oldRecord.getValue(constants.PROPERTY_FIELDS.ELEVATION);
                    log.debug("New elevationNew Value", elevationNew);
                    log.debug("Old elevationOld Value", elevationOld);
                    if (elevationNew != elevationOld)
                        emailBody += "<tr>ELEVATION</tr> <tr><td> Old Value: " + elevationOld + "</td> <td>New Value: " + elevationNew + "  </td></tr></br>";
                    var currentPriceNew = pContext.newRecord.getValue("custrecord_current_list_price_aux");
                    var currentPriceOld = pContext.oldRecord.getValue("custrecord_current_list_price");
                    log.debug("New currentPriceNew Value", currentPriceNew);
                    log.debug("Old currentPriceOld Value", currentPriceOld);
                    if (currentPriceNew != currentPriceOld)
                        emailBody += "<tr>CURRENT LIST PRICE</tr> <tr><td> Old Value: " + currentPriceOld + "</td> <td>New Value: " + currentPriceNew + "  </td></tr></br>";
                    var constructionNew = pContext.newRecord.getText("custrecord_current_construction");
                    var constructionOld = pContext.oldRecord.getText("custrecord_current_construction");
                    log.debug("New constructionNew Value", constructionNew);
                    log.debug("Old constructionOld Value", constructionOld);
                    if (constructionNew != constructionOld)
                        emailBody += "<tr>CURRENT CONSTRUCTION STATUS</tr> <tr><td> old value: " + constructionOld + "</td> <td>new value: " + constructionNew + "  </td></tr></br>";
                    emailBody += "</table>";
                    pContext.newRecord.setValue({ fieldId: constants.PROPERTY_FIELDS.CHECKBOX, value: false });
                    pContext.newRecord.setValue({ fieldId: "custrecord_mw_last_builder_personnel_ed", value: "" });
                    email.send({
                        author: 3847,
                        subject: "Changes made in the buider portal - " + pContext.newRecord.getValue("custrecord_simple_name"),
                        body: textBody + emailBody,
                        // recipients: [agentEmail],
                        recipients: ["bryan.badilla@midware.net"],
                        cc: ["bryan.badilla@midware.net"],
                        relatedRecords: {
                            customRecord: { id: Number(pContext.newRecord.id), recordType: "customrecord_property_record" }
                        }
                    });
                }
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
