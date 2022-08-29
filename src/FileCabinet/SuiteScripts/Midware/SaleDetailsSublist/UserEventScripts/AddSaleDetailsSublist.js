/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/ui/serverWidget", "N/search", "N/runtime", "../Constants/constants", "N/file"], function (require, exports, log, ui, search, runtime, constants, file) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        try {
            if (runtime.executionContext == runtime.ContextType.USER_INTERFACE) {
                var customSublist_1 = pContext.form.addSublist({
                    id: "custpage_sublist_sales_details",
                    label: "Sublist Sales Details",
                    type: ui.SublistType.LIST,
                    tab: "custom11",
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.CREATED,
                    type: ui.FieldType.TEXT,
                    label: "Data changed on"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.CONTRACT_APPROVAL_DATE,
                    type: ui.FieldType.DATE,
                    label: "Contract Approval Date"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.CONTRACT_RECEIVED_FROM_BUILDER,
                    type: ui.FieldType.DATE,
                    label: "Contract Receive From Builder"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.ESTIMATED_CLOSING_DATE,
                    type: ui.FieldType.DATE,
                    label: "Estimated Closing Date",
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.CONSTRUCTION_STATUS_CONTRACT,
                    type: ui.FieldType.SELECT,
                    label: "Construction Status At Contract",
                    source: constants.SOURCES.CONSTRUCTION_STATUS
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.ESTIMATED_CLOSING_PRICE,
                    type: ui.FieldType.CURRENCY,
                    label: "Estimated Closing Price"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.SELLING_BSR,
                    type: ui.FieldType.SELECT,
                    label: "Selling BSR",
                    source: constants.SOURCES.SELLING_BSR
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.BUYER_NAME,
                    type: ui.FieldType.TEXT,
                    label: "Buyer Name"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_AGENT_NAME,
                    type: ui.FieldType.SELECT,
                    label: "Cooperating Real Estate Agent Name",
                    source: constants.SOURCES.COOPERATING_REAL_ESTATE_AGENT_NAME
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_1,
                    type: ui.FieldType.TEXT,
                    label: "Cooperating Real Estate Agent ID MLS 1"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_BROKER_NAME,
                    type: ui.FieldType.SELECT,
                    label: "Cooperating Real Estate Broker Name",
                    source: constants.SOURCES.COOPERATING_REAL_ESTATE_BROKER_NAME
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_1,
                    type: ui.FieldType.TEXT,
                    label: "Cooperating Real Estate Broker ID MLS 1"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_1,
                    type: ui.FieldType.DATE,
                    label: "Pending Notification Date MLS 1"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_2,
                    type: ui.FieldType.TEXT,
                    label: "Cooperating Real Estate Agent ID MLS 2"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_2,
                    type: ui.FieldType.TEXT,
                    label: "Cooperating Real Estate Agent Broker ID MLS 2"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_2,
                    type: ui.FieldType.DATE,
                    label: "Pending Notification Date MLS 2"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.FINANCING_COMPANY,
                    type: ui.FieldType.TEXT,
                    label: "Finnancing Company"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.PURCHASE_CONTRACT,
                    type: ui.FieldType.TEXT,
                    label: "Purchase Contract",
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.SALE_NOTES,
                    type: ui.FieldType.TEXT,
                    label: "Sale Notes"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.SALES_NOTIFICATION_AGENT_NAME,
                    type: ui.FieldType.TEXT,
                    label: "Sales Notification Agent Name"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.SALES_NOTIFICATION_BROKERAGE_NAME,
                    type: ui.FieldType.TEXT,
                    label: "Sales Notification Brokerage Name"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.SALE_SUBMITTED_BY,
                    type: ui.FieldType.SELECT,
                    label: "Sale Submitted by",
                    source: constants.SOURCES.SELLING_BSR
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.SELLING_AGENT_COMMENTS,
                    type: ui.FieldType.TEXT,
                    label: "Selling Agent Comments"
                });
                customSublist_1.addField({
                    id: constants.SUBLIST_FIELDS.SELLING_TEAM_NAME,
                    type: ui.FieldType.TEXT,
                    label: "Selling Team Name"
                });
                var line_1 = 0;
                var saleDetailsRecords = search.create({
                    type: constants.SALE_DETAILS_RECORD.ID,
                    filters: [
                        [constants.SALE_DETAILS_RECORD.FIELDS.PROPERTY_RELATED, "anyof", pContext.newRecord.id]
                    ],
                    columns: [
                        search.createColumn({
                            name: "created",
                            sort: search.Sort.DESC
                        }),
                        constants.SALE_DETAILS_RECORD.FIELDS.PROPERTY_RELATED,
                        constants.SALE_DETAILS_RECORD.FIELDS.CONTRACT_APPROVAL_DATE,
                        constants.SALE_DETAILS_RECORD.FIELDS.CONTRACT_RECEIVED_FROM_BUILDER,
                        constants.SALE_DETAILS_RECORD.FIELDS.ESTIMATED_CLOSING_DATE,
                        constants.SALE_DETAILS_RECORD.FIELDS.CONSTRUCTION_STATUS_CONTRACT,
                        constants.SALE_DETAILS_RECORD.FIELDS.ESTIMATED_CLOSING_PRICE,
                        constants.SALE_DETAILS_RECORD.FIELDS.SELLING_BSR,
                        constants.SALE_DETAILS_RECORD.FIELDS.BUYER_NAME,
                        constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_AGENT_NAME,
                        constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_1,
                        constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_BROKER_NAME,
                        constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_1,
                        constants.SALE_DETAILS_RECORD.FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_1,
                        constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_2,
                        constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_2,
                        constants.SALE_DETAILS_RECORD.FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_2,
                        constants.SALE_DETAILS_RECORD.FIELDS.FINANCING_COMPANY,
                        constants.SALE_DETAILS_RECORD.FIELDS.PURCHASE_CONTRACT,
                        constants.SALE_DETAILS_RECORD.FIELDS.SALE_NOTES,
                        constants.SALE_DETAILS_RECORD.FIELDS.SALES_NOTIFICATION_AGENT_NAME,
                        constants.SALE_DETAILS_RECORD.FIELDS.SALES_NOTIFICATION_BROKERAGE_NAME,
                        constants.SALE_DETAILS_RECORD.FIELDS.SALE_SUBMITTED_BY,
                        constants.SALE_DETAILS_RECORD.FIELDS.SELLING_AGENT_COMMENTS,
                        constants.SALE_DETAILS_RECORD.FIELDS.SELLING_TEAM_NAME
                    ]
                });
                var searchResultCount = saleDetailsRecords.runPaged().count;
                saleDetailsRecords.run().each(function (result) {
                    var dateCreated = result.getValue("created");
                    var contractApprovalDate = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.CONTRACT_APPROVAL_DATE);
                    var contractReceivedBuilder = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.CONTRACT_RECEIVED_FROM_BUILDER);
                    var estClosingDate = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.ESTIMATED_CLOSING_DATE);
                    var constrcutionStatus = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.CONSTRUCTION_STATUS_CONTRACT);
                    var estimatedClosingPrice = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.ESTIMATED_CLOSING_PRICE);
                    var sellingBSR = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.SELLING_BSR);
                    var buyerName = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.BUYER_NAME);
                    var coopAgentName = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_AGENT_NAME);
                    var coopAgentID1 = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_1);
                    var coopBrokerName = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_BROKER_NAME);
                    var coopBroker1 = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_1);
                    var pendingNot1 = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_1);
                    var coopAgentID2 = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_2);
                    var coopBroker2 = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_2);
                    var pendingNot2 = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_2);
                    var fancingCompany = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.FINANCING_COMPANY);
                    var purchaseContract = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.PURCHASE_CONTRACT);
                    var salesNotes = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.SALE_NOTES);
                    var salesNotification = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.SALES_NOTIFICATION_AGENT_NAME);
                    var salesNotBrokerage = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.SALES_NOTIFICATION_BROKERAGE_NAME);
                    var saleSubmitted = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.SALE_SUBMITTED_BY);
                    var sellingComents = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.SELLING_AGENT_COMMENTS);
                    var sellingTeamName = result.getValue(constants.SALE_DETAILS_RECORD.FIELDS.SELLING_TEAM_NAME);
                    dateCreated ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.CREATED,
                        line: line_1,
                        value: String(dateCreated)
                    }) : "";
                    contractApprovalDate ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.CONTRACT_APPROVAL_DATE,
                        line: line_1,
                        value: String(contractApprovalDate)
                    }) : "";
                    contractReceivedBuilder ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.CONTRACT_RECEIVED_FROM_BUILDER,
                        line: line_1,
                        value: String(contractReceivedBuilder)
                    }) : "";
                    estClosingDate ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.ESTIMATED_CLOSING_DATE,
                        line: line_1,
                        value: String(estClosingDate)
                    }) : "";
                    constrcutionStatus ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.CONSTRUCTION_STATUS_CONTRACT,
                        line: line_1,
                        value: String(constrcutionStatus)
                    }) : "";
                    estimatedClosingPrice ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.ESTIMATED_CLOSING_PRICE,
                        line: line_1,
                        value: String(estimatedClosingPrice)
                    }) : "";
                    sellingBSR ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.SELLING_BSR,
                        line: line_1,
                        value: String(sellingBSR)
                    }) : "";
                    buyerName ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.BUYER_NAME,
                        line: line_1,
                        value: String(buyerName)
                    }) : "";
                    coopAgentName ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_AGENT_NAME,
                        line: line_1,
                        value: String(coopAgentName)
                    }) : "";
                    coopAgentID1 ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_1,
                        line: line_1,
                        value: String(coopAgentID1)
                    }) : "";
                    coopBrokerName ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_BROKER_NAME,
                        line: line_1,
                        value: String(coopBrokerName)
                    }) : "";
                    coopBroker1 ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_1,
                        line: line_1,
                        value: String(coopBroker1)
                    }) : "";
                    pendingNot1 ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_1,
                        line: line_1,
                        value: String(pendingNot1)
                    }) : "";
                    coopAgentID2 ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_2,
                        line: line_1,
                        value: String(coopAgentID2)
                    }) : "";
                    coopBroker2 ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_2,
                        line: line_1,
                        value: String(coopBroker2)
                    }) : "";
                    pendingNot2 ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_2,
                        line: line_1,
                        value: String(pendingNot2)
                    }) : "";
                    fancingCompany ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.FINANCING_COMPANY,
                        line: line_1,
                        value: String(fancingCompany)
                    }) : "";
                    var purchaseURL;
                    var purchaseName;
                    purchaseContract ? purchaseURL = file.load({ id: String(purchaseContract) }).url : "";
                    purchaseContract ? purchaseName = file.load({ id: String(purchaseContract) }).name : "";
                    purchaseContract ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.PURCHASE_CONTRACT,
                        line: line_1,
                        value: "<a href=\"" + purchaseURL + "\" target=\"_blank\">" + purchaseName + "</a>"
                    }) : "";
                    salesNotes ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.SALE_NOTES,
                        line: line_1,
                        value: String(salesNotes)
                    }) : "";
                    salesNotification ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.SALES_NOTIFICATION_AGENT_NAME,
                        line: line_1,
                        value: String(salesNotification)
                    }) : "";
                    salesNotBrokerage ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.SALES_NOTIFICATION_BROKERAGE_NAME,
                        line: line_1,
                        value: String(salesNotBrokerage)
                    }) : "";
                    saleSubmitted ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.SALE_SUBMITTED_BY,
                        line: line_1,
                        value: String(saleSubmitted)
                    }) : "";
                    sellingComents ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.SELLING_AGENT_COMMENTS,
                        line: line_1,
                        value: String(sellingComents)
                    }) : "";
                    sellingTeamName ? customSublist_1.setSublistValue({
                        id: constants.SUBLIST_FIELDS.SELLING_TEAM_NAME,
                        line: line_1,
                        value: String(sellingTeamName)
                    }) : "";
                    log.debug("Results", result);
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
