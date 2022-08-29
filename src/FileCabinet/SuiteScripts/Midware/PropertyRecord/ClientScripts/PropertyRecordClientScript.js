/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Fernanda Carmona
 * @contact contact@midware.net
 */
define(["require", "exports", "N/search", "N/currentRecord", "N/log", "N/record", "N/email"], function (require, exports, search, currentRecord, log, record, email) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function pageInit(pContext) { }
    exports.pageInit = pageInit;
    var oldSaleStatusId = currentRecord.get().getValue("custrecord_property_status");
    function fieldChanged(pContext) {
        try {
            var today = new Date();
            var month = today.getMonth();
            month = month + 1;
            var day = today.getDate();
            var year = today.getFullYear();
            var dateFormatted = month + "/" + day + "/" + year;
            if (pContext.fieldId == "custrecord31" ||
                pContext.fieldId == "custrecord_house_number" ||
                pContext.fieldId == "custrecordcustrecordsubdname" ||
                pContext.fieldId == "custrecord_property_status") {
                //Change property name
                // street + house_number + (sale_status) + subdivision_name.name
                console.log("Hi");
                var street = pContext.currentRecord.getText({ fieldId: "custrecord31" });
                var houseNumber = pContext.currentRecord.getValue({ fieldId: "custrecord_house_number" });
                var saleStatus = pContext.currentRecord.getText({ fieldId: "custrecord_property_status" });
                var subdivision = pContext.currentRecord.getValue({ fieldId: "custrecordcustrecordsubdname" });
                var subdivisionName = search.lookupFields({
                    type: "customrecord_subdivision",
                    id: String(subdivision),
                    columns: ["custrecord_subdivision_id"]
                }).custrecord_subdivision_id;
                var propertyName = street + " " + houseNumber + " (" + saleStatus + ") " + " " + subdivisionName;
                log.debug("New Property Name ", propertyName);
                pContext.currentRecord.setValue({ fieldId: "name", value: propertyName });
            }
            //custrecord13 = Builder Sales Rep
            if (pContext.fieldId == "custrecord13") {
                var bsr = pContext.currentRecord.getValue({ fieldId: "custrecord13" });
                if (bsr != null && bsr != "") {
                    var teamMembers = search.lookupFields({
                        type: "partner",
                        id: 3412,
                        columns: ["custentity_team_members"]
                    })["custentity_team_members"];
                    if (teamMembers.hasOwnProperty("value")) {
                        currentRecord
                            .get()
                            .setValue({ fieldId: "custrecord_property_bsr_team_members", value: Number(teamMembers) });
                    }
                    else {
                        currentRecord.get().setValue({ fieldId: "custrecord_property_bsr_team_members", value: "" });
                    }
                }
            }
            //custrecord31 = Street
            if (pContext.fieldId == "custrecord31") {
                var street = pContext.currentRecord.getText({ fieldId: "custrecord31" });
                pContext.currentRecord.setValue({ fieldId: "custrecord_street", value: street });
            }
            if (pContext.fieldId == "custrecord_current_construction") {
                pContext.currentRecord.setValue({ fieldId: "custrecord_property_date_const_update", value: today });
            }
            //Added by Jeff to duplucate the functionality in the above code, but for Sales Status
            if (pContext.fieldId == "custrecord_property_status") {
                var saleStatusId = pContext.currentRecord.getValue({ fieldId: "custrecord_property_status" });
                log.debug("Status", "OldStatus: " + oldSaleStatusId + "New Status: " + saleStatusId);
                if (saleStatusId == "11" || saleStatusId == "12") {
                    alert("Selecting this status will initiate the process of sending an automated sales and closing notification request to this builder.");
                }
                pContext.currentRecord.setValue({ fieldId: "custrecord_property_date_sales_st_update", value: today });
                if (oldSaleStatusId == "11" && saleStatusId != "3" && saleStatusId != "9") {
                    alert("When changing from Available (Pending Contigency) be sure to check the property in FischerNet. See Al with any questions.");
                }
            }
            // When original list price changes, fill current if empty with original list price
            if (pContext.fieldId == "custrecord_original_listing_price") {
                if (pContext.currentRecord.getValue({ fieldId: "custrecord_current_list_price" }) == "" ||
                    pContext.currentRecord.getValue({ fieldId: "custrecord_current_list_price" }) == null) {
                    var listPrice = pContext.currentRecord.getValue({ fieldId: "custrecord_original_listing_price" });
                    pContext.currentRecord.setValue({ fieldId: "custrecord_current_list_price", value: Number(listPrice) });
                }
            }
            //Dupicate value of construction status at listing into current construction status
            if (pContext.fieldId == "custrecord_construction_status_listing") {
                var status_1 = pContext.currentRecord.getValue({ fieldId: "custrecord_construction_status_listing" });
                pContext.currentRecord.setValue({ fieldId: "custrecord_current_construction", value: Number(status_1) });
            }
            //BSR Team or Individual Sales Rep changed, fetch the team member
            if (pContext.fieldId == "custrecord_property_bsr_team") {
                var bsrTeam = pContext.currentRecord.getValue({ fieldId: "custrecord_property_bsr_team" });
                if (bsrTeam != null && bsrTeam != "") {
                    var bsrTeamRecord = record.load({ type: "partner", id: Number(bsrTeam) });
                    var teamMembers = bsrTeamRecord.getValue({ fieldId: "custentity_team_members" });
                    if (teamMembers != null) {
                        try {
                            pContext.currentRecord.setValue({
                                fieldId: "custrecord_property_bsr_team_members",
                                value: teamMembers
                            });
                        }
                        catch (e) {
                            log.error("Error field changed: custrecord_property_bsr_team ", e);
                        }
                    }
                }
            }
            // If Builder division changed, set top level parent
            if (pContext.fieldId == "custrecord12") {
                console.log("Top level builder");
                var builder = pContext.currentRecord.getValue({ fieldId: "custrecord12" });
                topLevelParent(builder, pContext);
                console.log("Top level builder");
            }
        }
        catch (error) {
            log.error("Error in fieldChanged", error.message);
            log.debug("Error in fieldChanged", JSON.stringify(error));
            var subject_1 = "Error in property " + pContext.currentRecord.id + " fieldChanged";
            var body_1 = "Stack :\n\n" + JSON.stringify(error, null, 2);
            new Promise(function (resolve, reject) {
                try {
                    email.send({
                        author: 3847,
                        body: body_1,
                        subject: subject_1,
                        recipients: ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"]
                    });
                    resolve("error email sent");
                }
                catch (error) {
                    reject(error);
                }
            }).then(function (x) {
                console.log(x);
            }, function (x) {
                console.error(x);
            });
        }
    }
    exports.fieldChanged = fieldChanged;
    function setMandatory(pContext) { }
    function saveRecord(pContext) {
        /*TODO
        if custrecord_entered_mls = T
            if custrecord_current_list_price < 0 give error
            if. custrecord_listing_date_mls_region1 = '' give error
            if custrecord_mls_number_region1 = '' error
    
        */
        //Checks for Sale Status = Available
        var saleStatus = pContext.currentRecord.getValue({ fieldId: "custrecord_property_status" });
        if (saleStatus == "1") {
            var contractApprovalDate = pContext.currentRecord.getValue({
                fieldId: "custrecord_contract_approval_date"
            });
            var constructionStatusatContract = pContext.currentRecord.getValue({
                fieldId: "custrecord_construction_status_contract"
            });
            var contractReceivedFromBuilder = pContext.currentRecord.getValue({
                fieldId: "custrecord_contract_received_date"
            });
            var estimatedClosingDate = pContext.currentRecord.getValue({
                fieldId: "custrecord_estimated_closing_date"
            });
            var estimatedClosingPrice = pContext.currentRecord.getValue({
                fieldId: "custrecord_estimated_closing_price"
            });
            var sellingBSR = pContext.currentRecord.getValue({ fieldId: "custrecord_selling_bsr" });
            var cooperatingRealEstateAgentIDMLS1 = pContext.currentRecord.getValue({
                fieldId: "custrecord_real_estate_agent_id_region_1"
            });
            var cooperatingRealEstateAgentIDMLS2 = pContext.currentRecord.getValue({
                fieldId: "custrecord_real_estate_agent_id_region_2"
            });
            var cooperatingRealEstateAgentName = pContext.currentRecord.getValue({
                fieldId: "custrecord_real_estate_agent_name"
            });
            var cooperatingRealEstateBrokerIDMLS1 = pContext.currentRecord.getValue({
                fieldId: "custrecord_real_estate_broker_id_mls1"
            });
            var cooperatingRealEstateBrokerIDMLS2 = pContext.currentRecord.getValue({
                fieldId: "custrecord_broker_office_id_mlsregion2"
            });
            var cooperatingRealEstateBrokerName = pContext.currentRecord.getValue({
                fieldId: "custrecord_real_estate_broker_name"
            });
            var pendingNotificationDateMLSRegion1 = pContext.currentRecord.getValue({
                fieldId: "custrecord_pending_date_mls_region1"
            });
            var pendingNotificationDateMLSRegion2 = pContext.currentRecord.getValue({
                fieldId: "custrecord_pending_date_mls_region2"
            });
            var buyersLastName = pContext.currentRecord.getValue({ fieldId: "custrecord_buyers_last_name" });
            var financingCompany = pContext.currentRecord.getValue({ fieldId: "custrecord_financing_company" });
            var purchaseContract = pContext.currentRecord.getValue({ fieldId: "custrecord_purchase_contract" });
            var saleNotes = pContext.currentRecord.getValue({ fieldId: "custrecord_sale_notes" });
            var salesNotificationAgentName = pContext.currentRecord.getValue({ fieldId: "custrecord_agent_name_sn" });
            var salesNotificationBrokerageName = pContext.currentRecord.getValue({
                fieldId: "custrecord_brokerage_name_sn"
            });
            var saleSubmittedBy = pContext.currentRecord.getValue({ fieldId: "custrecord_mw_sale_submitted_by" });
            if (contractApprovalDate != "" ||
                constructionStatusatContract != "" ||
                contractApprovalDate != "" ||
                contractReceivedFromBuilder != "" ||
                estimatedClosingDate != "" ||
                estimatedClosingPrice != "" ||
                sellingBSR != "" ||
                cooperatingRealEstateAgentIDMLS1 != "" ||
                cooperatingRealEstateAgentIDMLS2 != "" ||
                cooperatingRealEstateAgentName != "" ||
                cooperatingRealEstateBrokerIDMLS1 != "" ||
                cooperatingRealEstateBrokerIDMLS2 != "" ||
                cooperatingRealEstateBrokerName != "" ||
                pendingNotificationDateMLSRegion1 != "" ||
                pendingNotificationDateMLSRegion2 != "" ||
                buyersLastName != "" ||
                financingCompany != "" ||
                purchaseContract != "" ||
                saleNotes != "" ||
                salesNotificationAgentName != "" ||
                salesNotificationBrokerageName != "" ||
                saleSubmittedBy != "") {
                alert("Please make sure all of the Sale Details fields are empty before saving.");
                return;
            }
        }
    }
    /* let builderDivisionIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord12' }).isMandatory
        let cityIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_city' }).isMandatory
        let countyIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord10' }).isMandatory
        let currentListPriceIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_current_list_price' }).isMandatory
        let expirationDateIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_expiration_date' }).isMandatory
        let floorplanIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_floorplan' }).isMandatory
        let houseNumberIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_house_number' }).isMandatory
        let listDateIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_list_date' }).isMandatory
        let listingTypeIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_listing_type' }).isMandatory
        let lotNumberIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_lot_number' }).isMandatory
        let mLSNumberRegion1IsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_mls_number_region1' }).isMandatory
        let mLSRegion1IsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord15' }).isMandatory
        let originalListPriceIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_original_listing_price' }).isMandatory
        let schoolDistrictIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord11' }).isMandatory
        let subdivisionNameIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecordcustrecordsubdname' }).isMandatory
        let zipCodeIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_zip_code' }).isMandatory
        let bSRTeamorIndividualSalesRepIsMandatory= pContext.currentRecord.getField({ fieldId: 'custrecord_property_bsr_team' }).isMandatory

        if (pContext.currentRecord.getValue({ fieldId: "custrecord_entered_mls" }) == true) {
            pContext.currentRecord.getField({ fieldId: "custrecord12" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_city" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord10" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_current_list_price" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_expiration_date" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_floorplan" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_house_number" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_list_date" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_listing_type" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_lot_number" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_mls_number_region1" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord15" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_original_listing_price" }).isMandatory =
                true;
            pContext.currentRecord.getField({ fieldId: "custrecord11" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecordcustrecordsubdname" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_zip_code" }).isMandatory = true;
            pContext.currentRecord.getField({ fieldId: "custrecord_property_bsr_team" }).isMandatory = true;
        }
}

//Checks if Sale status = Pending
if (saleStatus == "2") {
    alert("Please use the Sale Status Change widget to set this property to Pending");
    return;
}

if (saleStatus == "3") {
    alert("Please use the Sale Status Change widget to set this property to Closed");
    return;
}*/
    /**
     * Search the top level builder subdivision.
     * @param builder builder division field of property record
     * @param pContext
     */
    function topLevelParent(builder, pContext) {
        log.debug("Top Level Parent", "Start builder: " + builder);
        if (builder != null && builder != "") {
            var builderRecord = record.load({ type: "customer", id: Number(builder) });
            var parent = builderRecord.getValue({ fieldId: "parent" });
            log.debug("Parent", parent);
            if (parent == null || parent == "" || parent == '""') {
                pContext.currentRecord.setValue({ fieldId: "custrecord_top_level_builder", value: builder });
            }
            else {
                var nextLevelParent = parent;
                while (nextLevelParent != null &&
                    nextLevelParent != "" &&
                    nextLevelParent != undefined &&
                    nextLevelParent != '""') {
                    var parentRecord = record.load({ type: "customer", id: Number(nextLevelParent) });
                    var parent = nextLevelParent;
                    var nextLevelParent = parentRecord.getValue({ fieldId: "parent" });
                }
                pContext.currentRecord.setValue({ fieldId: "custrecord_top_level_builder", value: parent });
            }
        }
    }
});
