/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Esteban G. Damazzzio
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/error", "N/http", "N/search", "N/record", "N/render", "N/email", "./Constants", "N/runtime"], function (require, exports, log, error, http, search, record, render, email, constants, runtime) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    var SALE = "1";
    var CLOSING = "2";
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
            pContext.response.write("Unexpected error. Detail: ".concat(error.message));
            handleError(error);
        }
    }
    exports.onRequest = onRequest;
    function handleGet(pContext) {
        var status = {};
        var subdivision = pContext.request.parameters["subd"];
        var lotNumber = pContext.request.parameters["lot"];
        var propertyid = pContext.request.parameters["propertyid"];
        log.debug("handleGet subdivision", subdivision);
        log.debug("handleGet lotNumber", lotNumber);
        log.debug("handleGet propertyid", propertyid);
        var duplicatePropertiesCheckResult = checkDuplicateProperties(subdivision, lotNumber, propertyid);
        pContext.response.write(JSON.stringify(duplicatePropertiesCheckResult));
    }
    function checkDuplicateProperties(pSubdivisionId, pLotNumber, pPropertyid) {
        var _a;
        if (!pSubdivisionId) {
            return { status: -1, msg: "No subdivision present." };
        }
        if (!pLotNumber) {
            return { status: -1, msg: "No lot number present." };
        }
        // pLotNumber = pLotNumber.replace(/[^0-9a-z]/gi, ' ');
        var properties = [];
        log.debug("checkDuplicateProperties", "Searching for properties with Subdivision : '".concat(pSubdivisionId, "' and Lot Number : '").concat(pLotNumber, "' ..."));
        var newLot = pLotNumber.replace(/^0+/g, '').replace(/[^A-Za-z0-9 ]/g, '').replace(/\s/g, '');
        log.debug("checkDuplicateProperties allLots", newLot);
        var propertySearchResult = search.create({
            type: constants.PROPERTY_RECORD.RECORD_TYPE,
            filters: [
                [constants.PROPERTY_RECORD.SUBDIVISION, search.Operator.ANYOF, pSubdivisionId],
                "AND",
                ["internalid", search.Operator.NONEOF, pPropertyid ? pPropertyid : 0],
                "AND",
                ["formulatext: REGEXP_REPLACE({custrecord_lot_number}, '\\s|^0+|[^A-Za-z0-9 ]', '') ", "is", newLot]
            ],
            columns: [
                search.createColumn({ name: constants.PROPERTY_RECORD.SUBDIVISION }),
                search.createColumn({ name: constants.PROPERTY_RECORD.LOT_NUMBER }),
                search.createColumn({ name: constants.PROPERTY_RECORD.HOUSE_NUMBER }),
                search.createColumn({ name: constants.PROPERTY_RECORD.STREET_NAME }),
                search.createColumn({ name: constants.PROPERTY_RECORD.CURRENT_LIST_PRICE }),
                search.createColumn({ name: constants.PROPERTY_RECORD.CREATED_DATE }),
                search.createColumn({ name: constants.PROPERTY_RECORD.HMS_CALLBACK_NUMBER }),
                search.createColumn({ name: "internalid" }),
            ]
        })
            .run()
            .getRange({ start: 0, end: 1 });
        if (propertySearchResult.length > 0) {
            var propertyResult = propertySearchResult[0];
            var subdivisionName = propertyResult.getText(constants.PROPERTY_RECORD.SUBDIVISION);
            subdivisionName = subdivisionName.indexOf('|') == -1 ? subdivisionName : subdivisionName.substring(0, subdivisionName.indexOf('|')).trim();
            properties.push((_a = {},
                _a[constants.PROPERTY_RECORD.SUBDIVISION] = subdivisionName,
                _a[constants.PROPERTY_RECORD.LOT_NUMBER] = propertyResult.getValue(constants.PROPERTY_RECORD.LOT_NUMBER),
                _a[constants.PROPERTY_RECORD.HOUSE_NUMBER] = propertyResult.getValue(constants.PROPERTY_RECORD.HOUSE_NUMBER),
                _a[constants.PROPERTY_RECORD.STREET_NAME] = propertyResult.getText(constants.PROPERTY_RECORD.STREET_NAME),
                _a[constants.PROPERTY_RECORD.CURRENT_LIST_PRICE] = propertyResult.getValue(constants.PROPERTY_RECORD.CURRENT_LIST_PRICE),
                _a[constants.PROPERTY_RECORD.CREATED_DATE] = propertyResult.getValue(constants.PROPERTY_RECORD.CREATED_DATE),
                _a[constants.PROPERTY_RECORD.HMS_CALLBACK_NUMBER] = propertyResult.getValue(constants.PROPERTY_RECORD.HMS_CALLBACK_NUMBER),
                _a["id"] = propertyResult.getValue("internalid"),
                _a));
        }
        log.debug("Resulting Properties", JSON.stringify(properties));
        return properties;
    }
    // function getAllLotConfigurations(pLot){
    //     let lots = [];
    //     let zeroLot = pLot.replace(/^0+/, '');
    //     let dashLot = pLot.replace(/-/, '');
    //     let newFormatLot = zeroLot.replace(/-/, '')
    //     lots.push(pLot);
    //     lots.push(zeroLot);
    //     lots.push(dashLot);
    //     lots.push(newFormatLot);
    //     return lots;
    // }
    function handlePost(pContext) {
        try {
            var bodyObj = JSON.parse(pContext.request.body);
            var method = bodyObj["method"];
            if (!method)
                throw { message: "No method present in the request" };
            var result = { err: false, msg: 'ok!' };
            switch (method) {
                case "setReminder":
                    result = setReminder(bodyObj);
                    break;
                case "sendRequestForInformation":
                    result = sendRequestForInformation(bodyObj);
                    break;
                default:
                    var msg = "Method '".concat(method, "' not recognized");
                    throw { message: msg };
            }
            log.debug('POST Response', JSON.stringify(result));
            pContext.response.write(JSON.stringify(result));
        }
        catch (error) {
            handleError(error);
            pContext.response.write(JSON.stringify({ err: true, msg: error.message }));
        }
    }
    function setReminder(pParams) {
        var _a;
        var reminderType = pParams["reminderType"];
        if (!reminderType)
            throw { message: "No reminder type present in the request" };
        var days = pParams["days"];
        if (!days)
            throw { message: "No days present in the request" };
        var propertyId = pParams["propertyId"];
        if (!propertyId)
            throw { message: "No property id present in the request" };
        var notifyPersonel = pParams["notify"];
        var daysNumber = Number(days);
        if (isNaN(days))
            throw { message: "".concat(days, " is not a number") };
        var reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + daysNumber);
        var submitParams = (_a = {},
            _a[constants.PROPERTY_RECORD.SCHEDULED_NOTIFICATION_TYPE] = reminderType,
            _a[constants.PROPERTY_RECORD.SCHEDULED_S_C_NOTIFICATION_DATE] = reminderDate,
            _a[constants.PROPERTY_RECORD.SCHEDULED_S_C_EMAIL_SENT] = false,
            _a);
        if (notifyPersonel)
            submitParams['custrecord_in_charge'] = notifyPersonel;
        record.submitFields({
            type: "customrecord_property_record", id: propertyId, values: submitParams
        });
        var result = { err: false, msg: "Reminder set for ".concat(reminderDate.toLocaleDateString()) };
        return result;
    }
    function sendRequestForInformation(pParams) {
        var _a, _b;
        //Validate and obtain data
        var reminderType = pParams["reminderType"];
        if (!reminderType)
            throw { message: "No reminder type present in the request" };
        var personnel = pParams["personnel"];
        if (!personnel)
            throw { message: "No personnel present in the request" };
        var propertyId = pParams["propertyId"];
        if (!propertyId)
            throw { message: "No property id present in the request" };
        var personnelData = search.lookupFields({ type: search.Type.PARTNER, id: personnel, columns: ["email", "entityid"] });
        if (!personnelData)
            throw { message: "Personnel id ".concat(personnel, " doesn't exist") };
        var personnelName = personnelData.entityid.indexOf(':') == -1 ? personnelData.entityid : personnelData.entityid.substring(personnelData.entityid.lastIndexOf(':') + 1, personnelData.entityid.length).trim();
        if (!personnelData.email)
            throw { message: "".concat(personnelName, " doesn't have an email set") };
        var reminderTypeText = reminderType == SALE ? "Sale" : "Closing";
        //Submit Data to property. Email template uses sale/closing personnel field to fetch data
        record.submitFields({
            type: "customrecord_property_record", id: propertyId, values: (_a = {},
                _a[constants.PROPERTY_RECORD.SCHEDULED_S_C_NOTIFICATION_DATE] = '',
                _a)
        });
        var emailMerger = render.mergeEmail({
            templateId: constants.INFORMATION_TEMPLATES[reminderType][runtime.envType],
            customRecord: {
                id: Number(propertyId),
                type: "customrecord_property_record",
            },
        });
        var emailBody = replaceEmailURLs(emailMerger.body, personnel, propertyId, reminderType);
        log.debug("Merged email", "emailBody : ".concat(emailBody));
        try {
            record.submitFields({
                type: "customrecord_property_record", id: propertyId, values: (_b = {},
                    _b[constants.PROPERTY_RECORD.SCHEDULED_S_C_EMAIL_SENT] = true,
                    _b[constants.PROPERTY_RECORD.SALE_CLOSING_PERSONNEL] = personnel,
                    _b[constants.PROPERTY_RECORD.SCHEDULED_NOTIFICATION_TYPE] = "1",
                    _b)
            });
            email.send({
                author: 3847,
                recipients: [personnelData.email],
                subject: emailMerger.subject,
                body: emailBody,
                relatedRecords: {
                    customRecord: {
                        recordType: "customrecord_property_record",
                        id: Number(propertyId),
                    },
                }
            });
            var result = { err: false, msg: "Request for ".concat(reminderTypeText, " Information sent to ").concat(personnelName) };
            return result;
        }
        catch (error) {
            throw { message: "Error sending ".concat(reminderTypeText, " request email: ").concat(error.message) };
        }
    }
    function replaceEmailURLs(pBody, pPersonnelId, pPropertyId, pReminderType) {
        var emailBody = pBody;
        //replace the url to the corresponding form
        var propertyData = search.lookupFields({ type: "customrecord_property_record", id: pPropertyId, columns: [
                "custrecordcustrecordsubdname",
                "custrecord12",
            ] });
        var builderId = propertyData["custrecord12"][0].value;
        var subdivisionId = propertyData["custrecordcustrecordsubdname"][0].value;
        var formUrl = constants.FORMS[pReminderType](pPersonnelId, builderId, subdivisionId, pPropertyId);
        emailBody = emailBody.replace("%formURL%", formUrl);
        if (pReminderType == CLOSING) {
            //replace the other closing urls
            //body = body.replace()
            //body = body.replace()
        }
        return emailBody;
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
