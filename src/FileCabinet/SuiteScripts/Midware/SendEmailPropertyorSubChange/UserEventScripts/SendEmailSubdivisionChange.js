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
                        columns: ["entityid"]
                    });
                    log.audit("Builder", builderPersonnel);
                    var textBody = "User <b>" + builderPersonnel.entityid + "</b> has edited subdivision record.</br></br> \n\n";
                    var emailBody = "\n \n \n\n                <table>";
                    var subNameNew = pContext.newRecord.getValue(constants.SUBDIVISION_FIELDS.SUBDIVISION_NAME);
                    var subNameOld = pContext.oldRecord.getValue(constants.SUBDIVISION_FIELDS.SUBDIVISION_NAME);
                    if (subNameNew != subNameOld)
                        emailBody += "<tr>SUBDIVISION NAME</tr> <tr><td>old value: " + subNameOld + "  </td> <td>new value: " + subNameNew + "</td></tr></br>";
                    var abbreviationNew = pContext.newRecord.getValue(constants.SUBDIVISION_FIELDS.ABBREVIATION);
                    var abbreviationOld = pContext.oldRecord.getValue(constants.SUBDIVISION_FIELDS.ABBREVIATION);
                    if (abbreviationNew != abbreviationOld)
                        emailBody += "<tr>ABBREVIATION</tr> <tr><td>old value: " + abbreviationOld + "</td> <td> new value: " + abbreviationNew + " </td></tr>";
                    var countyNew = pContext.newRecord.getText(constants.SUBDIVISION_FIELDS.COUNTY);
                    var countyOld = pContext.oldRecord.getText(constants.SUBDIVISION_FIELDS.COUNTY);
                    if (countyNew != countyOld)
                        emailBody += "<tr>COUNTY</tr> <tr><td>old value: " + countyOld + "  </td> <td>new value: " + countyNew + " </td></tr></br>";
                    var schoolNew = pContext.newRecord.getText(constants.SUBDIVISION_FIELDS.SCHOOL_DISTRICT);
                    var schoolOld = pContext.oldRecord.getText(constants.SUBDIVISION_FIELDS.SCHOOL_DISTRICT);
                    if (schoolNew != schoolOld)
                        emailBody += "<tr>SCHOOL DISTRICT</tr> <tr><td> old value: " + schoolOld + " </td> <td>new value: " + schoolNew + " </td></tr>";
                    var Mls1New = pContext.newRecord.getText(constants.SUBDIVISION_FIELDS.PRIMARY_MLS);
                    var Mls1Old = pContext.oldRecord.getText(constants.SUBDIVISION_FIELDS.PRIMARY_MLS);
                    if (Mls1New != Mls1Old)
                        emailBody += "<tr>MLS REGION 1</tr> <tr><td> old value: " + Mls1Old + "</td> <td>new value: " + Mls1New + " </td></tr>";
                    var Mls2New = pContext.newRecord.getText(constants.SUBDIVISION_FIELDS.SECONDARY_MLS);
                    var Mls2Old = pContext.oldRecord.getText(constants.SUBDIVISION_FIELDS.SECONDARY_MLS);
                    if (Mls2New != Mls2Old)
                        emailBody += "<tr>MLS REGION 2</tr> <tr><td> old value: " + Mls2Old + "</td> <td>new value: " + Mls2New + " </td></tr>";
                    var cityNew = pContext.newRecord.getValue(constants.SUBDIVISION_FIELDS.CITY);
                    var cityOld = pContext.oldRecord.getValue(constants.SUBDIVISION_FIELDS.CITY);
                    if (cityNew != cityOld)
                        emailBody += "<tr>CITY</tr> <tr><td> old value: " + cityOld + "  </td> <td>new value: " + cityNew + " </td></tr></br>";
                    var originalPriceNew = pContext.newRecord.getValue(constants.PROPERTY_FIELDS.ORIGINAL_LIST_PRICE);
                    var originalPriceOld = pContext.oldRecord.getValue(constants.PROPERTY_FIELDS.ORIGINAL_LIST_PRICE);
                    if (originalPriceNew != originalPriceOld)
                        emailBody += "<tr>ORIGINAL LIST PRICE</tr> <tr><td> old value: " + originalPriceOld + "  </td> <td>new value: " + originalPriceNew + " </td></tr></br>";
                    var stateNew = pContext.newRecord.getText(constants.SUBDIVISION_FIELDS.STATE);
                    var stateOld = pContext.oldRecord.getText(constants.SUBDIVISION_FIELDS.STATE);
                    if (stateNew != stateOld)
                        emailBody += "<tr>STATE</tr> <tr><td> old value: " + stateOld + "</td> <td>new value: " + stateNew + "  </td></tr></br>";
                    var zipNew = pContext.newRecord.getValue(constants.SUBDIVISION_FIELDS.ZIP_CODE);
                    var zipOld = pContext.oldRecord.getValue(constants.SUBDIVISION_FIELDS.ZIP_CODE);
                    if (zipNew != zipOld)
                        emailBody += "<tr>ZIP CODE</tr> <tr><td> old value: " + zipOld + "</td> <td>new value: " + zipNew + "  </td></tr></br>";
                    var salesNew = pContext.newRecord.getText(constants.SUBDIVISION_FIELDS.SALES_REP);
                    var salesOld = pContext.oldRecord.getText(constants.SUBDIVISION_FIELDS.SALES_REP);
                    if (salesNew != salesOld)
                        emailBody += "<tr>BSR TEAM OR INDIVIDUAL SALES REP</tr> <tr><td> old value: " + salesOld + "    </td> <td>new value: " + salesNew + "  </td></tr></br>";
                    var salesManNew = pContext.newRecord.getText(constants.SUBDIVISION_FIELDS.SALES_MANAGER);
                    var salesManOld = pContext.oldRecord.getText(constants.SUBDIVISION_FIELDS.SALES_MANAGER);
                    if (salesManNew != salesManOld)
                        emailBody += "<tr>SALES MANAGER</tr> <tr><td> old value: " + salesManOld + "  </td> <td>new value: " + salesManNew + "  </td></tr></br>";
                    var adminNew = pContext.newRecord.getText(constants.SUBDIVISION_FIELDS.ADMINISTRATIVE_CONTACT);
                    var adminOld = pContext.oldRecord.getText(constants.SUBDIVISION_FIELDS.ADMINISTRATIVE_CONTACT);
                    if (adminNew != adminOld)
                        emailBody += "<tr>ADMINISTRATIVE CONTACT</tr> <tr><td> old value: " + adminOld + "  </td> <td>new value: " + adminNew + "  </td></tr></br>";
                    var hoaManaNew = pContext.newRecord.getValue(constants.SUBDIVISION_FIELDS.HOA_MANAGEMENT_COMPANY);
                    var hoaManaOld = pContext.oldRecord.getValue(constants.SUBDIVISION_FIELDS.HOA_MANAGEMENT_COMPANY);
                    if (hoaManaNew != hoaManaOld)
                        emailBody += "<tr>HOA MANAGEMENT COMPANY</tr> <tr><td> old value: " + hoaManaOld + "  </td> <td>new value: " + hoaManaNew + "  </td></tr></br>";
                    var hoaManaPhoneNew = pContext.newRecord.getValue(constants.SUBDIVISION_FIELDS.HOA_MANAGEMENT_PHONE);
                    var hoaManaPhoneOld = pContext.oldRecord.getValue(constants.SUBDIVISION_FIELDS.HOA_MANAGEMENT_PHONE);
                    if (hoaManaPhoneNew != hoaManaPhoneOld)
                        emailBody += "<tr>HOA MANAGEMENT PHONE</tr> <tr><td> old value: " + hoaManaPhoneOld + "  </td> <td>new value: " + hoaManaPhoneNew + "  </td></tr></br>";
                    var hoaTermNew = pContext.newRecord.getText(constants.SUBDIVISION_FIELDS.HOA_TERM);
                    var hoaTermOld = pContext.oldRecord.getText(constants.SUBDIVISION_FIELDS.HOA_TERM);
                    if (hoaTermNew != hoaTermOld)
                        emailBody += "<tr>HOA TERM</tr> <tr><td> old value: " + hoaTermOld + "  </td> <td>new value: " + hoaTermNew + "  </td></tr></br>";
                    var hoaFeeNew = pContext.newRecord.getValue(constants.SUBDIVISION_FIELDS.HOA_FEE);
                    var hoaFeeOld = pContext.oldRecord.getValue(constants.SUBDIVISION_FIELDS.HOA_FEE);
                    if (hoaFeeNew != hoaFeeOld)
                        emailBody += "<tr>HOA FEE</tr> <tr><td> old value: " + hoaFeeOld + "  </td> <td>new value: " + hoaFeeNew + "  </td></tr></br>";
                    emailBody += "</table>";
                    pContext.newRecord.setValue({ fieldId: constants.PROPERTY_FIELDS.CHECKBOX, value: false });
                    pContext.newRecord.setValue({ fieldId: "custrecord_mw_last_builder_personnel_ed", value: "" });
                    email.send({
                        author: 4954,
                        subject: "Changes made in the buider portal - " + pContext.newRecord.getValue("name"),
                        body: textBody + emailBody,
                        // recipients: [agentEmail],
                        recipients: ["bryan.badilla@midware.net"],
                        cc: ["bryan.badilla@midware.net"],
                        relatedRecords: {
                            customRecord: { id: Number(pContext.newRecord.id),
                                recordType: "customrecord_property_record" }
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
