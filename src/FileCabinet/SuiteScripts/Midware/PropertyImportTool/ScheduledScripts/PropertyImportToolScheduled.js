/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
* @NModuleScope SameAccount
* @author Midware
* @developer Francisco Alvarado Ferllini
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/runtime", "N/task", "N/search", "N/record", "N/file", "../Global/constants", "../Global/suffixes"], function (require, exports, log, runtime, task, search, record, file, constants, suffixes) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function execute(pContext) {
        try {
            var reScheduled = false;
            var workingQueue = null;
            var processingQueues = getImportQueuesInProcess();
            var propertiesProcessed = [];
            // log.debug("QUEUES PROCESS", processingQueues);
            if (processingQueues.queueId) {
                workingQueue = processingQueues.queueId;
                var keys = Object.keys(processingQueues.properties);
                var actualIndex = processingQueues.index;
                var startIndex = Number(processingQueues.index);
                // log.audit("Keys", keys);
                log.audit("actual index", actualIndex);
                log.audit("Start INdex", startIndex);
                var streetNames = getStreetNames(processingQueues.divisionName);
                var statusLookup = getStatusLookup();
                // log.debug("STATUS LOOKUP 1", statusLookup)
                var data = { streetNames: streetNames, statusLookup: statusLookup };
                for (var x = startIndex + 1 ? startIndex : 0; x < keys.length; x++) {
                    log.audit("X", x);
                    var actualKey = keys[x];
                    log.audit("Actual Key", actualKey);
                    var propertyData = processingQueues.properties[actualKey];
                    // log.debug("Test", propertyData)
                    // log.debug("Test 2", processingQueues)
                    var resultProcess = processPropety(processingQueues, actualKey, propertyData, data);
                    log.debug("resultProcess", resultProcess);
                    try {
                        if (resultProcess.newProperty) {
                            propertiesProcessed.push(resultProcess.newProperty);
                        }
                        if (resultProcess.dataNewStreet) {
                            var dataStreet = resultProcess.dataNewStreet;
                            data.streetNames[dataStreet.subdivision][dataStreet.name] = String(dataStreet.id);
                        }
                    }
                    catch (_a) { }
                    if (ReSchedule(workingQueue, x))
                        break;
                    else if (x == keys.length - 1)
                        reScheduled = true;
                    log.debug("Go to ReScheduled", "Go to ReScheduled");
                }
            }
            else {
                var pendingQueues = getImportQueuesPending();
                log.debug("Pending Queues", pendingQueues);
                if (pendingQueues.queueId && pendingQueues.properties) {
                    var streetNames = getStreetNames(pendingQueues.divisionName);
                    var statusLookup = getStatusLookup();
                    // log.debug("STATUS LOOKUP 1", statusLookup)
                    var data = { streetNames: streetNames, statusLookup: statusLookup };
                    workingQueue = pendingQueues.queueId;
                    record.submitFields({ type: 'customrecord_mw_import_property_queue', id: pendingQueues.queueId, values: { 'custrecord_mw_import_status': '2' } });
                    var keys = Object.keys(pendingQueues.properties);
                    // log.debug("Pending Queues", pendingQueues)
                    for (var x = 0; x < keys.length; x++) {
                        var actualKey = keys[x];
                        var propertyData = pendingQueues.properties[actualKey];
                        var resultProcess = processPropety(pendingQueues, actualKey, propertyData, data);
                        log.debug("resultProcess", resultProcess);
                        try {
                            if (resultProcess.newProperty) {
                                propertiesProcessed.push(resultProcess.newProperty);
                            }
                            if (resultProcess.dataNewStreet) {
                                var dataStreet = resultProcess.dataNewStreet;
                                data.streetNames[dataStreet.subdivision][dataStreet.name] = String(dataStreet.id);
                            }
                        }
                        catch (_b) { }
                        if (ReSchedule(workingQueue, x))
                            break;
                        else if (x == keys.length - 1)
                            reScheduled = true;
                        log.debug("Go to ReScheduled2", "Go to ReScheduled 2");
                    }
                }
            }
            if (reScheduled) {
                log.debug("Complete", propertiesProcessed);
                var valuesPropertiesModified = [];
                for (var i = 0; i < propertiesProcessed.length; i++) {
                    if (propertiesProcessed[i] != "") {
                        valuesPropertiesModified.push(String(propertiesProcessed[i]));
                    }
                }
                record.submitFields({ type: 'customrecord_mw_import_property_queue', id: workingQueue, values: { 'custrecord_mw_import_status': '4' } });
                record.submitFields({ type: 'customrecord_mw_import_property_queue', id: workingQueue, values: { 'custrecord_mw_modified_property_records': valuesPropertiesModified } });
                var division = search.lookupFields({ type: 'customrecord_mw_import_property_queue', id: workingQueue, columns: ["custrecord_mw_division"] });
                record.submitFields({ type: 'customrecord_mw_import_property_queue', id: workingQueue, values: { 'custrecord_mw_status_report': "1" } });
                task.create({ taskType: task.TaskType.SCHEDULED_SCRIPT, scriptId: "1768", deploymentId: "1", params: { custscript_mw_working_queue: workingQueue } }).submit();
                try {
                    task.create({ taskType: task.TaskType.SCHEDULED_SCRIPT, scriptId: runtime.getCurrentScript().id, deploymentId: runtime.getCurrentScript().deploymentId }).submit();
                }
                catch (e) {
                    log.error("Error", e);
                }
                var propertiesNootInCSV = getPropertiesNotInCSV(valuesPropertiesModified, division.custrecord_mw_division[0].value);
                log.debug("propertiesNootInCSV", propertiesNootInCSV);
                record.submitFields({ type: 'customrecord_mw_import_property_queue', id: workingQueue, values: { 'custrecord_mw_property_not_include_csv': propertiesNootInCSV } });
            }
        }
        catch (pError) {
            handleError(pError);
        }
    }
    exports.execute = execute;
    function getPropertiesNotInCSV(pIdsPropertiesCSV, division) {
        var idsOfProperties = [];
        // log.debug("Ids Of Properties", pIdsPropertiesCSV);
        var customrecord_property_recordSearchObj = search.create({
            type: "customrecord_property_record",
            filters: [
                ["custrecord_property_status", "noneof", "3"],
                "AND",
                ["internalid", "noneof", pIdsPropertiesCSV],
                "AND",
                ["custrecord_top_level_builder", "anyof", division],
                "AND",
                ["isinactive", "is", "F"]
            ],
            columns: [
                "internalid"
            ]
        });
        var searchResultCount = customrecord_property_recordSearchObj.runPaged().count;
        // log.debug("customrecord_property_recordSearchObj result count",searchResultCount);
        customrecord_property_recordSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            idsOfProperties.push(result.getValue("internalid"));
            return true;
        });
        log.debug("Not in CSV", idsOfProperties);
        return idsOfProperties;
    }
    function getImportQueuesInProcess() {
        var response = { queueId: null, index: 0, properties: {}, divisionId: null, divisionName: null };
        try {
            search.create({
                type: "customrecord_mw_import_property_queue",
                filters: [
                    ["custrecord_mw_import_status", "anyof", "2"]
                ],
                columns: [
                    search.createColumn({ name: "created", sort: search.Sort.ASC }),
                    "custrecord_mw_import_properties",
                    "internalid",
                    "custrecord_mw_division"
                ]
            }).run().each(function (result) {
                response.queueId = result.getValue({ name: 'internalid' });
                var properties = result.getValue({ name: 'custrecord_mw_import_properties' });
                var jsonData = file.load({ id: String(properties) }).getContents();
                log.debug("JSON DATA", jsonData);
                response.properties = properties ? JSON.parse(jsonData.toString()) : null;
                var divisionId = result.getValue({ name: "custrecord_mw_division" });
                response.divisionId = divisionId ? divisionId : null;
                var divisionName = result.getText({ name: 'custrecord_mw_division' });
                response.divisionName = divisionName ? divisionName : null;
                var customrecord_mw_import_property_resultSearchObj = search.create({
                    type: "customrecord_mw_import_property_result",
                    filters: [
                        ["custrecord_mw_import_result_queue", "anyof", response.queueId]
                    ],
                    columns: [
                        "custrecord_mw_order_index"
                    ]
                });
                var searchResultCount = customrecord_mw_import_property_resultSearchObj.runPaged().count;
                //  log.audit("customrecord_mw_import_property_resultSearchObj result count",searchResultCount);
                customrecord_mw_import_property_resultSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    var index = result.getValue("custrecord_mw_order_index");
                    response.index = index ? Number(index.toString()) : 0;
                    log.audit("Search", index);
                    // log.audit("Index for", response.index)
                    return true;
                });
                return false;
            });
        }
        catch (error) {
            log.error('getImportQueuesPending', error.message);
        }
        // log.debug('getImportQueuesInProcess',response);
        return response;
    }
    function getImportQueuesPending() {
        var response = { queueId: null, properties: {}, fileName: null, divisionId: null, divisionName: null };
        try {
            search.create({
                type: "customrecord_mw_import_property_queue",
                filters: [
                    ["custrecord_mw_import_status", "anyof", "1"]
                ],
                columns: [
                    search.createColumn({ name: "created", sort: search.Sort.ASC }),
                    "custrecord_mw_import_properties",
                    "internalid",
                    "custrecord_mw_import_file",
                    "custrecord_mw_division"
                ]
            }).run().each(function (result) {
                response.queueId = result.getValue({ name: 'internalid' });
                var properties = result.getValue({ name: 'custrecord_mw_import_properties' });
                var jsonData = file.load({ id: String(properties) }).getContents();
                log.debug("JSON DATA", jsonData);
                response.properties = properties ? JSON.parse(jsonData.toString()) : null;
                var fileName = result.getText({ name: 'custrecord_mw_import_file' });
                response.fileName = fileName ? fileName : null;
                var divisionId = result.getValue({ name: 'custrecord_mw_division' });
                response.divisionId = divisionId ? divisionId : null;
                var divisionName = result.getText({ name: 'custrecord_mw_division' });
                response.divisionName = divisionName ? divisionName : null;
                return false;
            });
        }
        catch (error) {
            log.error('getImportQueuesPending', error.message);
        }
        // log.debug('getImportQueuesPending',response);
        return response;
    }
    function ReSchedule(pQueueId, pIndexActual) {
        log.audit("ReSchedule", "Enters ReSchedule method");
        var getRemainingUsage = runtime.getCurrentScript().getRemainingUsage();
        // log.audit("getRemainingUsage", getRemainingUsage)
        if (getRemainingUsage < 2000) {
            try {
                var customrecord_mw_import_property_resultSearchObj = search.create({
                    type: "customrecord_mw_import_property_result",
                    filters: [
                        ["custrecord_mw_import_result_queue", "anyof", pQueueId]
                    ],
                    columns: [
                        "internalid",
                        search.createColumn({
                            name: "created",
                            sort: search.Sort.DESC
                        }),
                        "custrecord_mw_import_result_index",
                        "custrecord_mw_order_index"
                    ]
                });
                var searchResultCount = customrecord_mw_import_property_resultSearchObj.runPaged().count;
                log.debug("customrecord_mw_import_property_resultSearchObj result count", searchResultCount);
                customrecord_mw_import_property_resultSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    record.submitFields({
                        type: "customrecord_mw_import_property_result",
                        id: Number(result.getValue("internalid")),
                        values: { "custrecord_mw_order_index": pIndexActual }
                    });
                    return false;
                });
                task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId
                }).submit();
                return true;
            }
            catch (pError) {
                handleError(pError);
            }
        }
        else {
            return false;
        }
    }
    function processPropety(pQueueData, pActaulKey, pPropertyData, pRecordData) {
        var pQueueId = pQueueData.queueId;
        // log.debug("Queue", pQueueData.divisionId)
        switch (pQueueData.divisionId) {
            case constants.DIVISION_OPTIONS["DR Horton"]:
                // call function
                return processDRHorton(pQueueData, pActaulKey, pPropertyData, pRecordData, pQueueId);
            case constants.DIVISION_OPTIONS["Fischer Homes"]:
                // call function
                return processFischerHomes(pQueueData, pActaulKey, pPropertyData, pRecordData, pQueueId);
        }
    }
    /**
     ********************************************************************************************************** DR Horton Process
    **/
    function processDRHorton(pQueueData, pActaulKey, pPropertyData, pRecordData, pQueueId) {
        try {
            // log.debug('processPropety pPropertyData',pPropertyData);
            // log.debug('processPropety pActaulKey',pActaulKey);
            // log.debug('processPropety pQueueId',pQueueId);
            var pStreetNames = pRecordData.streetNames;
            var statusLookup = pRecordData.statusLookup;
            var property = "";
            // log.debug("RECORD DATA", pRecordData);
            var lot = pPropertyData['Lot_Code'];
            var floorplan = pPropertyData['floorplanid'];
            var houseNumber = pPropertyData['housenumber'];
            var subDivision = String(pPropertyData['subdivisionid']);
            var division = pPropertyData['divisionid'];
            var streetName = pPropertyData['streetnameid'];
            var create = pPropertyData['create'];
            var buyersName = pPropertyData['Buyer_Name'];
            var totalPurchasePrice = pPropertyData['Total_Purchase_Price'];
            var scheduleInfo = "";
            if (statusLookup[pPropertyData['Schedule_Info']])
                scheduleInfo = statusLookup[pPropertyData['Schedule_Info']].id;
            var contractApprovedDate = pPropertyData['Contract_Approved_Date'];
            var constructionStartDate = pPropertyData['Construction_Start_Date'];
            var mortgageCompany = pPropertyData['MortgageCompany'];
            var indexOrder = pPropertyData['indexOrder'];
            var flagCreateNewProperty = pPropertyData['flagAddNewProperty'] == "T" ? true : false;
            var statusSelected = pPropertyData['StatusesSelected'];
            var nonAvailable = false;
            log.audit("statusSelected", statusSelected[0]);
            // Logic of status 
            if (contractApprovedDate && (statusSelected.length == 2 || statusSelected[0] == 2)) {
                log.debug("Status", "Add non available");
                nonAvailable = true;
            }
            else if (!contractApprovedDate && (statusSelected.length == 2 || statusSelected[0] == 1)) {
                log.debug("Status", "Add available");
            }
            else {
                log.debug("Status", "Status not match");
                return "";
            }
            var countyAndSchool = verifyOneCountyOrSchoolDistric(subDivision);
            var dataNewStreet = null;
            log.debug("SUBDIVISION", subDivision);
            log.debug("Scheduled", scheduleInfo);
            if (!streetName && create) {
                log.debug('processPropety', 'creating Street name');
                var newStreetName = create['newStreetName'];
                var newStreetDirection = create['newStreetDirection'];
                var newStreetType = create['newStreetType'];
                if (suffixes.SUFFIXES[newStreetType.toUpperCase()])
                    newStreetType = suffixes.SUFFIXES[newStreetType.toUpperCase()];
                if (newStreetName) {
                    var newStreetNameRecord = record.create({ type: 'customrecord_street_name', isDynamic: true });
                    if (newStreetDirection)
                        newStreetNameRecord.setValue({ fieldId: 'custrecord_prefix', value: newStreetDirection });
                    if (newStreetType)
                        newStreetNameRecord.setValue({ fieldId: 'custrecord_suffix', value: newStreetType });
                    var name_1 = (newStreetDirection ? newStreetNameRecord.getText({ fieldId: 'custrecord_prefix' }) : '') + " " + newStreetName + " " + (newStreetType ? newStreetNameRecord.getText({ fieldId: 'custrecord_suffix' }) : '');
                    log.debug("NAME", name_1);
                    var workingStreetNames = pStreetNames[subDivision] && pStreetNames[subDivision][name_1.trim()] ? pStreetNames[subDivision][name_1.trim()] : null;
                    log.debug("Working Strret Names", workingStreetNames);
                    if (workingStreetNames) {
                        // streetName = pStreetNames[subDivision][name.toString()];
                        streetName = workingStreetNames;
                        log.debug("STREET NAME WORKING", streetName);
                    }
                    else {
                        newStreetNameRecord.setValue({ fieldId: 'custrecord_street_name', value: newStreetName });
                        newStreetNameRecord.setValue({ fieldId: 'custrecord_subdivision', value: subDivision });
                        newStreetNameRecord.setValue({ fieldId: 'name', value: name_1.trim() });
                        streetName = newStreetNameRecord.save();
                        log.debug('processPropety', "new Street name : " + streetName);
                        pStreetNames[subDivision][name_1.toString()] = streetName;
                        dataNewStreet = { subdivision: subDivision, name: name_1.trim(), id: streetName };
                    }
                }
            }
            if (!floorplan && create) {
                log.debug('processPropety', 'creating floorplan');
                var newFloorplan = create['newFloorplan'];
                if (newFloorplan) {
                    var newFloorplanRecord = record.create({ type: 'customrecord_floorplan' });
                    newFloorplanRecord.setValue({ fieldId: 'name', value: newFloorplan });
                    floorplan = newFloorplanRecord.save();
                    log.debug('processPropety', "new floorplan : " + floorplan);
                }
            }
            var actualPropertyid = getPropertyRecord(subDivision, lot);
            if (actualPropertyid || flagCreateNewProperty) {
                var newProperty = actualPropertyid ? record.load({ id: actualPropertyid, type: 'customrecord_property_record', isDynamic: true }) : record.create({ type: 'customrecord_property_record', isDynamic: true });
                var saleStatus = newProperty.getValue({ fieldId: 'custrecord_property_status' });
                if (saleStatus != '3' || nonAvailable) { //    3 = Closed
                    if (lot)
                        newProperty.setValue({ fieldId: 'custrecord_lot_number', value: lot });
                    if (floorplan)
                        newProperty.setValue({ fieldId: 'custrecord_floorplan', value: floorplan });
                    if (houseNumber)
                        newProperty.setValue({ fieldId: 'custrecord_house_number', value: houseNumber });
                    log.debug("STREET NAME", streetName);
                    if (totalPurchasePrice)
                        newProperty.setValue({ fieldId: 'custrecord_last_csv_price', value: totalPurchasePrice.replace(/\,/g, "").substring(1) });
                    if (scheduleInfo)
                        newProperty.setValue({ fieldId: 'custrecord_current_construction', value: scheduleInfo });
                    if (mortgageCompany)
                        newProperty.setValue({ fieldId: 'custrecord_financing_company', value: mortgageCompany });
                    // if (subDivision) 
                    // {
                    //     newProperty.setValue({ fieldId: 'custrecord10', value: countyAndSchool.county });
                    //     newProperty.setValue({ fieldId: 'custrecord11', value: countyAndSchool.school });
                    // }
                    if (contractApprovedDate) { //  If Comp Listing
                        var newDate = new Date(contractApprovedDate);
                        newProperty.setValue({ fieldId: 'custrecord_contract_approval_date', value: newDate });
                        newProperty.setValue({ fieldId: 'custrecord_buyers_last_name', value: buyersName });
                        newProperty.setValue({ fieldId: 'custrecord_user_entered_sales_status', value: '2' }); // Pending
                        if (totalPurchasePrice)
                            newProperty.setValue({ fieldId: 'custrecord_estimated_closing_price', value: totalPurchasePrice.replace(/\,/g, "").substring(1) });
                        if (!actualPropertyid) { //  If Property does NOT already exist
                            newProperty.setValue({ fieldId: 'custrecord_listing_type', value: '3' }); // comp Listing
                            newProperty.setValue({ fieldId: 'custrecord_property_status', value: '17' }); // received
                            if (totalPurchasePrice)
                                newProperty.setValue({ fieldId: 'custrecord_original_listing_price', value: totalPurchasePrice.replace(/\,/g, "").substring(1) });
                            if (totalPurchasePrice)
                                newProperty.setValue({ fieldId: 'custrecord_current_list_price', value: totalPurchasePrice.replace(/\,/g, "").substring(1) });
                        }
                    }
                    else {
                        if (!actualPropertyid) { //  If Property does NOT already exist
                            newProperty.setValue({ fieldId: 'custrecord_listing_type', value: '1' }); // market home
                            newProperty.setValue({ fieldId: 'custrecord_property_status', value: '6' }); // Awaiting Entry Into MLS
                            newProperty.setValue({ fieldId: 'custrecord_user_entered_sales_status', value: '1' }); // Available
                            if (totalPurchasePrice)
                                newProperty.setValue({ fieldId: 'custrecord_original_listing_price', value: totalPurchasePrice.replace(/\,/g, "").substring(1) });
                            if (totalPurchasePrice)
                                newProperty.setValue({ fieldId: 'custrecord_current_list_price', value: totalPurchasePrice.replace(/\,/g, "").substring(1) });
                        }
                    }
                    if (constructionStartDate) {
                        var newDate = new Date(constructionStartDate);
                        newProperty.setValue({ fieldId: 'custrecord_mw_construction_start_date', value: newDate });
                    }
                    if (!actualPropertyid) { //If a new property record is created
                        var name_2 = newProperty.getText({ fieldId: 'custrecord31' }) + " " + houseNumber + " (" + newProperty.getText({ fieldId: 'custrecord_property_status' }) + ") " + newProperty.getText({ fieldId: 'custrecordcustrecordsubdname' });
                        if (streetName)
                            newProperty.setValue({ fieldId: 'name', value: name_2.trim() });
                        if (scheduleInfo)
                            newProperty.setValue({ fieldId: 'custrecord_construction_status_listing', value: scheduleInfo });
                        if (subDivision)
                            newProperty.setValue({ fieldId: 'custrecordcustrecordsubdname', value: subDivision });
                        if (division)
                            newProperty.setValue({ fieldId: 'custrecord12', value: division });
                        if (streetName)
                            newProperty.setValue({ fieldId: 'custrecord31', value: streetName });
                        if (houseNumber)
                            newProperty.setValue({ fieldId: 'custrecord_house_number', value: houseNumber });
                        if (subDivision) {
                            newProperty.setValue({ fieldId: 'custrecord10', value: countyAndSchool.county });
                            newProperty.setValue({ fieldId: 'custrecord11', value: countyAndSchool.school });
                        }
                    }
                    //newProperty.setValue({ fieldId: 'custrecord_ready_to_be_entered', value: false });
                    newProperty.setValue({ fieldId: 'custrecord_date_of_last_record_update', value: new Date() });
                    newProperty.setValue({ fieldId: 'custrecord_last_record_update_type', value: 'Custom CSV Import Tool' });
                    if (pQueueData.fileName)
                        newProperty.setValue({ fieldId: 'custrecord_last_record_update_source', value: pQueueData.fileName });
                    var newPropertyId = newProperty.save();
                    log.debug('newPropertyId', newPropertyId);
                    var NewProcessResult = record.create({ type: 'customrecord_mw_import_property_result' });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_status', value: '4' });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_queue', value: pQueueId });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_property', value: String(newPropertyId) });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_data', value: JSON.stringify(pPropertyData) });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_index', value: pActaulKey });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_order_index', value: indexOrder });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_message_report', value: actualPropertyid ? "Match - Property ID " + newPropertyId : "New Record - Property ID " + newPropertyId });
                    NewProcessResult.save();
                    log.debug('NewProcessResult', newProperty);
                    return { newProperty: newPropertyId, dataNewStreet: dataNewStreet };
                }
            }
            else {
                var NewProcessResult = record.create({ type: 'customrecord_mw_import_property_result' });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_status', value: '5' });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_queue', value: pQueueId });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_data', value: JSON.stringify(pPropertyData) });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_index', value: pActaulKey });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_order_index', value: indexOrder });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_message_report', value: 'NOT MATCH' });
                NewProcessResult.save();
                return "";
            }
        }
        catch (error) {
            log.error("Error creating Property", "Line: " + pActaulKey + ", Error: " + error.message);
            var NewProcessResultError = record.create({ type: 'customrecord_mw_import_property_result' });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_status', value: '3' });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_index', value: pActaulKey });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_queue', value: pQueueId });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_issues', value: error.message });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_data', value: JSON.stringify(pPropertyData) });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_message_report', value: " Error: " + error.message });
            NewProcessResultError.save();
            log.debug('NewProcessResult', NewProcessResultError);
            return "";
        }
    }
    /**
     ********************************************************************************************************** DR Horton Process
    **/
    function processFischerHomes(pQueueData, pActaulKey, pPropertyData, pRecordData, pQueueId) {
        try {
            log.audit("Enter Fischer Homes", "Enter Fischer Homes");
            // log.debug('processPropety pPropertyData',pPropertyData);
            // log.debug('processPropety pActaulKey',pActaulKey);
            // log.debug('processPropety pQueueId',pQueueId);
            var pStreetNames = pRecordData.streetNames;
            // log.debug("RECORD DATA", pRecordData);
            // log.debug("pStreetNames", pStreetNames)
            var jobNumber = pPropertyData['SlsOrdID'];
            // let customer = pPropertyData['Customer'];
            var houseNumber = pPropertyData['housenumber'];
            var subDivision = String(pPropertyData['subdivisionid']);
            var division = pPropertyData['divisionid'];
            var streetName = pPropertyData['streetnameid'];
            var create = pPropertyData['create'];
            // let agreementAmount = pPropertyData['Agreement_Amount'];
            var actualClosingPrice = pPropertyData['Actual_Closing_Price'];
            var plannedClosingDate = pPropertyData['Planned_Closing_Date'];
            var actualClosingDate = pPropertyData['Actual_Closing_Date'];
            var coop = pPropertyData['COOP'] == "Y" ? true : false;
            var agent = pPropertyData['Agent'];
            var brokerage = pPropertyData['Brokerage'];
            var currentSaleStatus = pPropertyData['Current_Sale_Status'];
            var financingType = pPropertyData['Financing_Type'];
            var lender = pPropertyData['Lender'];
            var lot = pPropertyData['lotNumber'];
            var flagCreateNewProperty = pPropertyData['flagAddNewProperty'] == "T" ? true : false;
            var propertyType = pPropertyData['Property_Type'];
            var indexOrder = pPropertyData['indexOrder'];
            var salesRepEmail = pPropertyData['Sales_Rep_Email'];
            var elevation = pPropertyData['Elevation'];
            var startDateProjected = pPropertyData['Start_Date_Projected'];
            var startDateActual = pPropertyData['Start_Date_Actual'];
            var jobEstimatedCompletion = pPropertyData['Job_Estimated_Completion'];
            var expectedSalesAmount = pPropertyData['Expected_Sales_Amount'];
            var mlsAmount = pPropertyData['MLS_Amount'];
            var floorplanId = pPropertyData['floorplanid'];
            var statusSelected = pPropertyData['StatusesSelected'];
            var salesRepId = void 0;
            var nonAvailable = false;
            log.audit("statusSelected", statusSelected[0]);
            // Logic of status 
            if (statusSelected.length == 2 || statusSelected[0] == 2) {
                log.debug("Status", "Add non available");
                nonAvailable = true;
            }
            else if (statusSelected.length == 2 || statusSelected[0] == 1) {
                log.debug("Status", "Add available");
            }
            else {
                log.debug("Status", "Status not match");
                return "";
            }
            // if (salesRepEmail) {
            //     salesRepId = getSalesRep(salesRepEmail)
            // }
            var dataNewStreet = null;
            var countyAndSchool = verifyOneCountyOrSchoolDistric(subDivision);
            // log.debug("SUBDIVISION", subDivision)
            if (!streetName && create) {
                // log.debug('processPropety','creating Street name');
                var newStreetName = create['newStreetName'];
                var newStreetDirection = create['newStreetDirection'];
                var newStreetType = create['newStreetType'];
                if (suffixes.SUFFIXES[newStreetType.toUpperCase()])
                    newStreetType = suffixes.SUFFIXES[newStreetType.toUpperCase()];
                if (newStreetName) {
                    var newStreetNameRecord = record.create({ type: 'customrecord_street_name', isDynamic: true });
                    if (newStreetDirection)
                        newStreetNameRecord.setValue({ fieldId: 'custrecord_prefix', value: newStreetDirection });
                    if (newStreetType)
                        newStreetNameRecord.setValue({ fieldId: 'custrecord_suffix', value: newStreetType });
                    var name_3 = (newStreetDirection ? newStreetNameRecord.getText({ fieldId: 'custrecord_prefix' }) : '') + " " + newStreetName + " " + (newStreetType ? newStreetNameRecord.getText({ fieldId: 'custrecord_suffix' }) : '');
                    var workingStreetNames = pStreetNames[subDivision] && pStreetNames[subDivision][name_3.trim()] ? pStreetNames[subDivision][name_3.trim()] : null;
                    // log.debug("Working Strret Names", workingStreetNames)
                    // log.debug("Subdivision", subDivision);
                    // log.debug("Name", name.trim());
                    // log.debug("pStreet", pStreetNames[subDivision] )
                    if (workingStreetNames) {
                        // streetName = pStreetNames[subDivision][name.toString()];
                        streetName = workingStreetNames;
                        // log.debug("STREET NAME WORKING", streetName);
                    }
                    else {
                        newStreetNameRecord.setValue({ fieldId: 'custrecord_street_name', value: newStreetName });
                        newStreetNameRecord.setValue({ fieldId: 'custrecord_subdivision', value: subDivision });
                        newStreetNameRecord.setValue({ fieldId: 'name', value: name_3.trim() });
                        streetName = newStreetNameRecord.save();
                        // log.debug('processPropety',`new Street name : ${streetName}`);
                        // pRecordData.streetNames[subDivision][name.toString()] = streetName;
                        dataNewStreet = { subdivision: subDivision, name: name_3.trim(), id: streetName };
                    }
                }
            }
            if (!floorplanId && create) {
                log.debug('processPropety', 'creating floorplan');
                var newFloorplan = create['newFloorplan'];
                if (newFloorplan) {
                    var newFloorplanRecord = record.create({ type: 'customrecord_floorplan' });
                    newFloorplanRecord.setValue({ fieldId: 'name', value: newFloorplan });
                    floorplanId = newFloorplanRecord.save();
                    log.debug('processPropety', "new floorplan : " + floorplanId);
                }
            }
            var actualPropertyid = getPropertyRecordFH(jobNumber);
            log.error("Actual property ID", actualPropertyid);
            if (actualPropertyid || flagCreateNewProperty) {
                // log.audit("Actual property ID", actualPropertyid)
                var newProperty = actualPropertyid ? record.load({ id: actualPropertyid, type: 'customrecord_property_record', isDynamic: true }) : record.create({ type: 'customrecord_property_record', isDynamic: true });
                var saleStatus = newProperty.getValue({ fieldId: 'custrecord_property_status' });
                if (saleStatus != '3' || nonAvailable) { //    3 = Closed
                    // if(customer) newProperty.setValue({fieldId: "custrecord_buyers_last_name", value: customer});
                    // if(agreementAmount) newProperty.setValue({fieldId: "custrecord_estimated_closing_price", value: agreementAmount.substring(1).replace(",", "")});
                    if (actualClosingPrice)
                        newProperty.setValue({ fieldId: "custrecord50", value: actualClosingPrice.substring(1).replace(",", "") });
                    if (!actualClosingPrice)
                        newProperty.setValue({ fieldId: "custrecord50", value: "" });
                    if (plannedClosingDate)
                        newProperty.setValue({ fieldId: "custrecord_estimated_closing_date", value: new Date(plannedClosingDate) });
                    if (actualClosingDate)
                        newProperty.setValue({ fieldId: "custrecord_actual_closing_date", value: new Date(actualClosingDate) });
                    if (!actualClosingDate)
                        newProperty.setValue({ fieldId: "custrecord_actual_closing_date", value: "" });
                    if (coop)
                        newProperty.setValue({ fieldId: "custrecord_agent_involved_in_sale", value: coop }); // Checkbox
                    if (agent)
                        newProperty.setValue({ fieldId: "custrecord_agent_name_sn", value: agent }); // text
                    if (brokerage)
                        newProperty.setValue({ fieldId: "custrecord_brokerage_name_sn", value: brokerage }); // text
                    if (currentSaleStatus)
                        newProperty.setValue({ fieldId: "custrecord_user_entered_sales_status", value: currentSaleStatus }); // id 
                    if (financingType)
                        newProperty.setValue({ fieldId: "custrecord_financing_type", value: financingType }); // id 
                    if (lender)
                        newProperty.setValue({ fieldId: "custrecord_financing_company", value: lender }); // text
                    if (propertyType)
                        newProperty.setValue({ fieldId: "custrecord_listing_type", value: propertyType }); // Listing Type
                    var listingType = newProperty.getValue({ fieldId: "custrecord_listing_type" });
                    if (houseNumber)
                        newProperty.setValue({ fieldId: 'custrecord_house_number', value: houseNumber });
                    if (!actualPropertyid) { //If a new property record is created
                        // log.debug("Enter If", "Enter If")
                        var name_4 = newProperty.getText({ fieldId: 'custrecord31' }) + " " + houseNumber + " (" + newProperty.getText({ fieldId: 'custrecord_property_status' }) + ") " + newProperty.getText({ fieldId: 'custrecordcustrecordsubdname' });
                        log.debug("NAME", name_4);
                        if (jobNumber)
                            newProperty.setValue({ fieldId: "custrecord_job_number", value: jobNumber, });
                        if (streetName)
                            newProperty.setValue({ fieldId: 'name', value: name_4.trim() });
                        if (subDivision)
                            newProperty.setValue({ fieldId: 'custrecordcustrecordsubdname', value: subDivision });
                        if (division)
                            newProperty.setValue({ fieldId: 'custrecord12', value: division });
                        if (streetName)
                            newProperty.setValue({ fieldId: 'custrecord31', value: Number(streetName) });
                        if (lot)
                            newProperty.setValue({ fieldId: "custrecord_lot_number", value: lot });
                        if (houseNumber)
                            newProperty.setValue({ fieldId: 'custrecord_house_number', value: houseNumber });
                        if (subDivision) {
                            newProperty.setValue({ fieldId: 'custrecord10', value: countyAndSchool.county });
                            newProperty.setValue({ fieldId: 'custrecord11', value: countyAndSchool.school });
                        }
                    }
                    if (salesRepId)
                        newProperty.setValue({ fieldId: "custrecord_selling_bsr", value: salesRepId }); // Sales Rep
                    if (elevation)
                        newProperty.setValue({ fieldId: "custrecord_elevation", value: elevation }); // Elavation
                    if (startDateProjected)
                        newProperty.setValue({ fieldId: "custrecord_mw_constr_start_date_project", value: new Date(startDateProjected) }); // Construction Start Date 
                    if (startDateActual)
                        newProperty.setValue({ fieldId: "custrecord_mw_construction_start_date", value: new Date(startDateActual) }); // Construction Start Date
                    if (jobEstimatedCompletion)
                        newProperty.setValue({ fieldId: "custrecord_estimated_completion_date", value: new Date(jobEstimatedCompletion) }); // Job Estimation Completion
                    log.debug("TEST", expectedSalesAmount);
                    if (expectedSalesAmount)
                        newProperty.setValue({ fieldId: "custrecord_estimated_closing_price", value: expectedSalesAmount.replace(/\,/g, "").substring(1) }); // Expected Sales Amount
                    if (floorplanId && floorplanId != "ignore")
                        newProperty.setValue({ fieldId: "custrecord_floorplan", value: floorplanId }); // Floorplan
                    newProperty.setValue({ fieldId: 'custrecord_date_of_last_record_update', value: new Date() });
                    newProperty.setValue({ fieldId: 'custrecord_last_record_update_type', value: 'Custom CSV Import Tool' });
                    if (pQueueData.fileName)
                        newProperty.setValue({ fieldId: 'custrecord_last_record_update_source', value: pQueueData.fileName });
                    var newPropertyId = newProperty.save({ ignoreMandatoryFields: true });
                    // Add Price List --------------------------------------------------------------------------------------------
                    var mlsAmountCompare = newProperty.getValue({ fieldId: "custrecord_current_list_price" });
                    if (mlsAmount && mlsAmount != "$0.00" && (String(mlsAmount) != String(mlsAmountCompare))) {
                        var priceList = record.create({
                            type: "customrecord_mw_current_price_builder_p",
                        });
                        priceList.setValue({ fieldId: "name", value: mlsAmount.substring(1).replace(",", "") });
                        priceList.setValue({ fieldId: "custrecord_mw_price", value: mlsAmount.substring(1).replace(",", "") });
                        priceList.setValue({ fieldId: "custrecord_mw_date_current_price", value: new Date() });
                        priceList.setValue({ fieldId: "custrecord_mw_property_related", value: newPropertyId });
                        priceList.save();
                    }
                    // ------------------------------------------------------------------------------------------------------------
                    // log.debug('newPropertyId', newPropertyId);
                    var builderDivision = search.lookupFields({
                        type: "customrecord_property_record",
                        id: String(newPropertyId),
                        columns: ["custrecord12.parent"]
                    });
                    // log.debug("Builder Division", builderDivision);
                    if (listingType || propertyType == "3") {
                        record.submitFields({
                            type: "customrecord_property_record",
                            id: newPropertyId,
                            values: { "custrecord_top_level_builder": builderDivision["custrecord12.parent"][0].value }
                        });
                    }
                    var NewProcessResult = record.create({ type: 'customrecord_mw_import_property_result' });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_status', value: '4' });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_queue', value: pQueueId });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_property', value: String(newPropertyId) });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_data', value: JSON.stringify(pPropertyData) });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_index', value: pActaulKey });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_order_index', value: indexOrder });
                    NewProcessResult.setValue({ fieldId: 'custrecord_mw_message_report', value: actualPropertyid ? "Match - Property ID " + newPropertyId : "New Record - Property ID " + newPropertyId });
                    NewProcessResult.save();
                    // log.debug('NewProcessResult', newProperty);
                    return { newProperty: newPropertyId, dataNewStreet: dataNewStreet };
                }
            }
            else {
                var NewProcessResult = record.create({ type: 'customrecord_mw_import_property_result' });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_status', value: '5' });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_queue', value: pQueueId });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_data', value: JSON.stringify(pPropertyData) });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_import_result_index', value: pActaulKey });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_order_index', value: indexOrder });
                NewProcessResult.setValue({ fieldId: 'custrecord_mw_message_report', value: 'NOT MATCH' });
                NewProcessResult.save();
                return "";
            }
        }
        catch (error) {
            log.error("Error creating Property", "Line: " + pActaulKey + ", Error: " + error.message);
            log.error("Error", error);
            var NewProcessResultError = record.create({ type: 'customrecord_mw_import_property_result' });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_status', value: '3' });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_index', value: pActaulKey });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_queue', value: pQueueId });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_issues', value: error.message });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_import_result_data', value: JSON.stringify(pPropertyData) });
            NewProcessResultError.setValue({ fieldId: 'custrecord_mw_message_report', value: "Error: " + error.message });
            NewProcessResultError.save();
            log.debug('NewProcessResult', NewProcessResultError);
            return "";
        }
    }
    function getPropertyRecord(pSubdivisionId, pLot) {
        var propertyid = null;
        if (pSubdivisionId && pLot) {
            try {
                var newLot = pLot.replace(/^0+/g, '').replace(/[^A-Za-z0-9 ]/g, '').replace(/\s/g, '');
                search.create({
                    type: "customrecord_property_record",
                    filters: [
                        ["custrecordcustrecordsubdname", search.Operator.ANYOF, pSubdivisionId],
                        "AND",
                        ["formulatext: REGEXP_REPLACE({custrecord_lot_number}, '\\s|^0+|[^A-Za-z0-9 ]', '') ", "is", newLot],
                        "AND",
                        ["isinactive", "is", "F"],
                    ],
                    columns: [search.createColumn({ name: "internalid" })]
                }).run().each(function (pRow) {
                    propertyid = pRow.getValue({ name: "internalid" });
                    return false;
                });
            }
            catch (pErorr) {
                log.error("getPropertyRecord", pErorr.message);
            }
        }
        if (propertyid)
            log.error("getPropertyRecord", "Property exists : " + propertyid);
        return propertyid;
    }
    exports.getPropertyRecord = getPropertyRecord;
    function getPropertyRecordFH(pJobNumber) {
        log.debug("Enter Search", "Search");
        var propertyid = null;
        if (pJobNumber) {
            try {
                search.create({
                    type: "customrecord_property_record",
                    filters: [
                        ["custrecord_job_number", "is", pJobNumber],
                        "AND",
                        ["isinactive", "is", "F"],
                    ],
                    columns: [search.createColumn({ name: "internalid" })]
                }).run().each(function (pRow) {
                    propertyid = pRow.getValue({ name: "internalid" });
                    log.audit("Property Id", propertyid);
                    return false;
                });
            }
            catch (pErorr) {
                log.error("getPropertyRecord", pErorr.message);
            }
        }
        if (propertyid)
            log.error("getPropertyRecord", "Property exists : " + propertyid);
        return propertyid;
    }
    exports.getPropertyRecordFH = getPropertyRecordFH;
    function getStatusLookup() {
        var statuslookup = {};
        var customrecord_drh_const_status_lookupSearchObj = search.create({
            type: "customrecord_drh_const_status_lookup",
            filters: [],
            columns: [
                "custrecord_drh_const_status",
                search.createColumn({
                    name: "custrecord_mls_const_status",
                    sort: search.Sort.ASC
                })
            ]
        });
        var searchResultCount = customrecord_drh_const_status_lookupSearchObj.runPaged().count;
        // log.debug("customrecord_drh_const_status_lookupSearchObj result count",searchResultCount);
        customrecord_drh_const_status_lookupSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            var id = result.getValue("custrecord_mls_const_status");
            var status = result.getText("custrecord_drh_const_status");
            statuslookup[String(status)] = { id: id, status: status };
            return true;
        });
        return statuslookup;
    }
    function getStreetNames(pDivisionName) {
        var streetNames = {};
        search.create({
            type: "customrecord_street_name",
            filters: [
                ["isinactive", "is", "F"],
                "AND",
                ["formulatext: {custrecord_subdivision}", "contains", String(pDivisionName)]
            ],
            columns: [
                "name",
                search.createColumn({ name: "custrecord_subdivision", sort: search.Sort.ASC }),
            ]
        }).run().each(function (result) {
            var subdivison = result.getValue({ name: "custrecord_subdivision", sort: search.Sort.ASC });
            var fullName = result.getValue('name');
            var id = result.id;
            if (!streetNames[subdivison.toString()])
                streetNames[subdivison.toString()] = {};
            streetNames[subdivison.toString()][fullName] = id;
            return true;
        });
        log.debug('pStreetTypesNames', streetNames);
        return streetNames;
    }
    function verifyOneCountyOrSchoolDistric(pSubdivisionID) {
        try {
            var resultData_1 = {};
            var customrecord_subdivisionSearchObj = search.create({
                type: "customrecord_subdivision",
                filters: [
                    ["internalid", "anyof", pSubdivisionID]
                ],
                columns: [
                    "custrecord_county",
                    "custrecord_school_district"
                ]
            });
            // let searchResultCount = customrecord_subdivisionSearchObj.runPaged().count;
            // log.debug("customrecord_subdivisionSearchObj result count",searchResultCount);
            customrecord_subdivisionSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                // log.debug("TEST 1", result.getValue("custrecord_county"));
                // log.debug("TEST 2", result.getValue("custrecord_school_district"));
                var arrayCounty = String(result.getValue("custrecord_county")).split(",");
                var arraySchool = String(result.getValue("custrecord_school_district")).split(",");
                if (arrayCounty.length == 1 && arraySchool.length == 1) {
                    resultData_1 = { county: result.getValue("custrecord_county"), school: result.getValue("custrecord_school_district") };
                }
                else if (arrayCounty.length != 1 && arraySchool.length == 1) {
                    resultData_1 = { county: "", school: result.getValue("custrecord_school_district") };
                }
                else if (arrayCounty.length == 1 && arraySchool.length != 1) {
                    resultData_1 = { county: result.getValue("custrecord_county"), school: "" };
                }
                else {
                    resultData_1 = { county: "", school: "" };
                }
                return true;
            });
            return resultData_1;
        }
        catch (e) {
            var resultData = { county: "", school: "" };
            return resultData;
        }
    }
    // Get Sales Rep Fischer Homes
    function getSalesRep(pEmail) {
        var salesRep;
        var partnerSearchObj = search.create({
            type: "partner",
            filters: [
                ["email", "is", pEmail]
            ],
            columns: [
                "internalid"
            ]
        });
        var searchResultCount = partnerSearchObj.runPaged().count;
        log.debug("partnerSearchObj result count", searchResultCount);
        partnerSearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            salesRep = result.getValue("internalid");
            return false;
        });
        return salesRep;
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
