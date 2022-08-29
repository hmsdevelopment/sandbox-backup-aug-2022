/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Bryan Badilla
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "N/record", "N/search", "../../Constants/constants"], function (require, exports, log, error, http, record, search, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function onRequest(pContext) {
        try {
            var eventMap = {}; //event router pattern design
            eventMap[http.Method.GET] = handleGet;
            eventMap[http.Method.POST] = handlePost;
            eventMap[pContext.request.method] ?
                eventMap[pContext.request.method](pContext) :
                httpRequestError();
        }
        catch (error) {
            pContext.response.write("Unexpected error. Detail: " + error.message);
            handleError(error);
        }
    }
    exports.onRequest = onRequest;
    function handleGet(pContext) {
        var params = pContext.request.parameters;
        log.debug("Params", params);
        if (params.propertyId) {
            var saleDetailsRecords = search.create({
                type: constants.SALE_DETAILS_PROPERTY_FIELDS.ID,
                filters: [
                    ["internalid", "anyof", params.propertyId]
                ],
                columns: [
                    constants.SALE_DETAILS_PROPERTY_FIELDS.CONTRACT_APPROVAL_DATE,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.CONTRACT_RECEIVED_FROM_BUILDER,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.ESTIMATED_CLOSING_DATE,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.CONSTRUCTION_STATUS_CONTRACT,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.ESTIMATED_CLOSING_PRICE,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.SELLING_BSR,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.BUYER_NAME,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_AGENT_NAME,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_1,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_BROKER_NAME,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_1,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_1,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_2,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_2,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_2,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.FINANCING_COMPANY,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.PURCHASE_CONTRACT,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.SALE_NOTES,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.SALES_NOTIFICATION_AGENT_NAME,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.SALES_NOTIFICATION_BROKERAGE_NAME,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.SALE_SUBMITTED_BY,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.SELLING_AGENT_COMMENTS,
                    constants.SALE_DETAILS_PROPERTY_FIELDS.SELLING_TEAM_NAME
                ]
            });
            var searchResultCount = saleDetailsRecords.runPaged().count;
            saleDetailsRecords.run().each(function (result) {
                var contractApprovalDate = result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.CONTRACT_APPROVAL_DATE);
                var contactReceivedDate = result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.CONTRACT_RECEIVED_FROM_BUILDER);
                var estimatedClosingDate = result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.ESTIMATED_CLOSING_DATE);
                var notification1 = result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_1);
                var notification2 = result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_2);
                log.debug("Result", result);
                var saleDetailRecord = record.create({
                    type: constants.SALE_DETAILS_RECORD.ID
                });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.PROPERTY_RELATED, value: params.propertyId });
                contractApprovalDate ? saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.CONTRACT_APPROVAL_DATE, value: new Date(contractApprovalDate) }) : "";
                contactReceivedDate ? saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.CONTRACT_RECEIVED_FROM_BUILDER, value: new Date(contactReceivedDate) }) : "";
                estimatedClosingDate ? saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.ESTIMATED_CLOSING_DATE, value: new Date(estimatedClosingDate) }) : "";
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.CONSTRUCTION_STATUS_CONTRACT, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.CONSTRUCTION_STATUS_CONTRACT) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.ESTIMATED_CLOSING_PRICE, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.ESTIMATED_CLOSING_PRICE) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.SELLING_BSR, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.SELLING_BSR) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.BUYER_NAME, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.BUYER_NAME) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_AGENT_NAME, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_AGENT_NAME) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_1, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_1) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_BROKER_NAME, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_BROKER_NAME) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_1, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_1) });
                notification1 ? saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_1, value: new Date(notification1) }) : "";
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_2, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_AGENT_ID_MLS_2) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_2, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.COOPERATING_REAL_ESTATE_BROKER_ID_MLS_2) });
                notification2 ? saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.PENDING_NOTIFICATION_DATE_MLS_REGION_2, value: new Date(notification2) }) : "";
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.FINANCING_COMPANY, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.FINANCING_COMPANY) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.PURCHASE_CONTRACT, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.PURCHASE_CONTRACT) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.SALE_NOTES, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.SALE_NOTES) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.SALES_NOTIFICATION_AGENT_NAME, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.SALES_NOTIFICATION_AGENT_NAME) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.SALES_NOTIFICATION_BROKERAGE_NAME, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.SALES_NOTIFICATION_BROKERAGE_NAME) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.SALE_SUBMITTED_BY, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.SALE_SUBMITTED_BY) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.SELLING_AGENT_COMMENTS, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.SELLING_AGENT_COMMENTS) });
                saleDetailRecord.setValue({ fieldId: constants.SALE_DETAILS_RECORD.FIELDS.SELLING_TEAM_NAME, value: result.getValue(constants.SALE_DETAILS_PROPERTY_FIELDS.SELLING_TEAM_NAME) });
                saleDetailRecord.setValue({ fieldId: "name", value: String(new Date()) });
                saleDetailRecord.save();
                return false;
            });
        }
    }
    function handlePost(pContext) {
    }
    function httpRequestError() {
        throw error.create({
            name: "MW_UNSUPPORTED_REQUEST_TYPE",
            message: "Suitelet only supports GET and POST",
            notifyOff: true
        });
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
