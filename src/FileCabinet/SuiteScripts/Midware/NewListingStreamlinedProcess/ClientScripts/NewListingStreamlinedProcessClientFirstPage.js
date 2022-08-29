/**
* @NApiVersion 2.0
* @NScriptType ClientScript
* @NModuleScope SameAccount
* @author Midware
* @developer Francisco Alvarado Ferllini
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/url", "N/https", "N/ui/message", "N/format", "../Constants/Constants"], function (require, exports, log, url, https, message, format, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function pageInit(pContext) {
        try {
            window.onbeforeunload = null;
            document.addEventListener('keypress', function (pEvent) {
                if (pEvent.which == 13) { //enter key
                    setTimeout(function () {
                        console.log("now");
                        document.getElementById(constants.PAGES.FIRST_PAGE.FORM_BUTTOMS.NEXT.ID).click();
                    }, 1000);
                }
            });
            var saleContractFile_1 = document.getElementsByName(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALE_CONTRACT_FILE.ID)[0];
            saleContractFile_1.addEventListener('change', function () {
                var files = this.files;
                var values = document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SELECTED_VALUES.ID);
                if (values.value) {
                    var valuesObjet_1 = JSON.parse(values.value);
                    if (files.length) {
                        var size = files[0].size;
                        if (size > 0) {
                            if (size < 10240000) {
                                getBase64Result(files[0]).then(function (result) {
                                    valuesObjet_1[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALE_CONTRACT_FILE.FIELD] = result;
                                    values.value = JSON.stringify(valuesObjet_1);
                                });
                            }
                            else {
                                alert("The file " + files[0].name + " Size is Over 10 MB.");
                                saleContractFile_1.value = null;
                            }
                        }
                        else {
                            alert("The file " + files[0].name + " Has no Content.");
                            saleContractFile_1.value = null;
                        }
                    }
                    else {
                        delete valuesObjet_1[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALE_CONTRACT_FILE.FIELD];
                        values.value = JSON.stringify(valuesObjet_1);
                    }
                }
            });
            var actualSelectedValues = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SELECTED_VALUES.ID }).toString();
            if (!actualSelectedValues)
                pContext.currentRecord.setValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SELECTED_VALUES.ID, value: JSON.stringify({}) });
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.pageInit = pageInit;
    function fieldChanged(pContext) {
        try {
            console.log("Enters fieldChanged");
            var fieldId = pContext.fieldId;
            // console.log(`Field : ${fieldId}`);
            var PropertyId = jQuery("#custpage_mw_property").val();
            var newFieldValue = pContext.currentRecord.getValue({ fieldId: fieldId });
            // console.log(`newFieldValue : ${newFieldValue}`);
            if (fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.DATE_RECEIVED.ID ||
                fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.CONSTRUCTION_START_DATE.ID ||
                fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.DATE_CONTRACT_EXECUTED.ID ||
                fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.EARLIEST_POSSIEBLE_CLOSING_DATE.ID ||
                fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.CONTRACT_RECEIVED_DATE.ID) {
                newFieldValue = newFieldValue ? format.format({ value: new Date(newFieldValue.toString()), type: format.Type.DATE }) : "";
            }
            var actualSelectedValues = JSON.parse(pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SELECTED_VALUES.ID }).toString());
            if (!actualSelectedValues)
                actualSelectedValues = {};
            // console.log(`actualSelectedValues : ${JSON.stringify(actualSelectedValues)}`);
            //Update Subdivisión
            if (fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.BUILDER_DIVISION.ID) {
                UpdateSubdivisionsOptions(pContext, newFieldValue);
                UpdateStreetOptions(pContext, null, null);
                delete actualSelectedValues[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.FIELD];
                delete actualSelectedValues[constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET.FIELD];
            }
            //Update Street
            else if (fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.ID) {
                var newStreet = pContext.currentRecord.getValue(constants.PAGES.FIRST_PAGE.FORM_FIELDS.NEW_STREET.ID);
                // console.log(`newStreet: ${newStreet}`);
                var setNewStreet = UpdateStreetOptions(pContext, newFieldValue, newStreet);
                if (newStreet && setNewStreet) {
                    // console.log("new Street Set");
                    actualSelectedValues[constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET.FIELD] = newStreet;
                    pContext.currentRecord.setValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.NEW_STREET.ID, value: "" });
                }
                else {
                    // console.log("new Street Set");
                    delete actualSelectedValues[constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET.FIELD];
                    pContext.currentRecord.setValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.NEW_STREET.ID, value: "" });
                }
            }
            //Udate selected Values
            if (fieldId != constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION_OPTIONS.ID && fieldId != constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET_OPTIONS.ID) {
                var fields = constants.PAGES.FIRST_PAGE.FORM_FIELDS;
                var filedKeys = Object.keys(fields);
                // console.log(`filedKeys : ${filedKeys}`);
                for (var x = 0; x < filedKeys.length; x++) {
                    var fieldString = JSON.stringify(fields[filedKeys[x]]);
                    if (fieldString.indexOf(fieldId) + 1) {
                        if (fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.ORIGINAL_LIST_PRICE.ID) {
                            if (newFieldValue != "") {
                                actualSelectedValues[fields[filedKeys[x]].FIELD] = newFieldValue;
                                actualSelectedValues[constants.RECORDS.PROPERTY_RECORD.CURRENT_LIST_PRICE] = newFieldValue;
                                var estimatedClosePrice = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.ESTIMATED_CLOSING_PRICE.ID });
                                if (!estimatedClosePrice) {
                                    actualSelectedValues[constants.PAGES.FIRST_PAGE.FORM_FIELDS.ESTIMATED_CLOSING_PRICE.FIELD] = newFieldValue;
                                    pContext.currentRecord.setValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.ESTIMATED_CLOSING_PRICE.ID, value: newFieldValue });
                                }
                            }
                            else {
                                delete actualSelectedValues[fields[filedKeys[x]].FIELD];
                                delete actualSelectedValues[constants.RECORDS.PROPERTY_RECORD.CURRENT_LIST_PRICE];
                            }
                        }
                        else {
                            if (newFieldValue != "" && fields[filedKeys[x]].FIELD)
                                actualSelectedValues[fields[filedKeys[x]].FIELD] = newFieldValue;
                            else
                                delete actualSelectedValues[fields[filedKeys[x]].FIELD];
                        }
                        break;
                    }
                }
            }
            //Update Propierty
            if (fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.BUILDER_DIVISION.ID ||
                fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.ID ||
                fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.HOUSE_NUMBER.ID ||
                fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET.ID) {
                var street = pContext.currentRecord.getText({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET.ID });
                var houseNumber = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.HOUSE_NUMBER.ID });
                var division = pContext.currentRecord.getText({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.BUILDER_DIVISION.ID });
                var subdivision = pContext.currentRecord.getText({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.ID });
                var property = (street ? street : "") + " " + (houseNumber ? houseNumber : "") + " status " + (subdivision ? subdivision : "") + " | " + (division ? division : "");
                // console.log(`property new Value : ${property}`);
                actualSelectedValues[constants.RECORDS.PROPERTY_RECORD.PROPERTY] = property;
            }
            pContext.currentRecord.setValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SELECTED_VALUES.ID, value: JSON.stringify(actualSelectedValues), ignoreFieldChange: true });
            console.log("newSelectedValues : " + JSON.stringify(actualSelectedValues));
            //check field extras
            if (fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.LOT.ID || fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.ID) {
                var subdivisionId = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.ID });
                var lotNumber = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.LOT.ID });
                if (subdivisionId && lotNumber)
                    checkDuplicates(subdivisionId, lotNumber);
            }
            else if (fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.LISTING_TYPE.ID) {
                if (newFieldValue == constants.DEFAULTS.PROPERTY_RECORD.LISTING.CONTRACT_TO_BUILD) {
                    changeDisplayTypeSalesFormFields(pContext, false);
                    var brokerInvoded = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKER_INVOLVED.ID });
                    if (Number(brokerInvoded)) {
                        changeDisplayWhenBroker(pContext, false);
                    }
                }
                else {
                    changeDisplayTypeSalesFormFields(pContext, true);
                    changeDisplayWhenBroker(pContext, true);
                }
            }
            else if (fieldId == constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKER_INVOLVED.ID) {
                if (Number(newFieldValue)) {
                    changeDisplayWhenBroker(pContext, false);
                }
                else {
                    changeDisplayWhenBroker(pContext, true);
                }
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.fieldChanged = fieldChanged;
    function checkDuplicates(pSubdivisionId, pLot) {
        var scriptRaw = document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SCRIPT.ID);
        var script = JSON.parse(scriptRaw.value);
        var checkURL = url.resolveScript({ scriptId: script.script, deploymentId: script.deployment, params: {
                method: constants.METHODS.CHECK_DUPLICATES,
                sid: pSubdivisionId,
                lot: pLot
            } });
        https.get.promise({ url: checkURL }).then(function (pResult) {
            var getAnswer = JSON.parse(pResult.body);
            if (!getAnswer.status) {
                var propertyId = getAnswer.pid;
                if (propertyId) {
                    console.log("propertyId:" + propertyId);
                    document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.LOT.ID).style["background-color"] = '#FF7070';
                    alert("This Subdivision and Lot Alredy Exist.");
                }
                else {
                    console.log("No Duplicates.");
                    document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.LOT.ID).removeAttribute("style");
                }
            }
            else
                console.log(getAnswer.message);
        }).catch(function (pError) {
            console.log(pError);
        });
    }
    function firstPageNextButton(pRecordId, pScriptId, pDeploymentId) {
        console.log("Enters firstPageNextButton");
        try {
            var valuesField = document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SELECTED_VALUES.ID);
            var values = valuesField ? valuesField.value : JSON.stringify({});
            var valuesObjet = JSON.parse(values);
            var wrongNumber = document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.LOT.ID).style[0];
            if (wrongNumber && wrongNumber == "background-color") {
                alert("This Subdivision and Lot Alredy Exist.");
            }
            else if (valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.DATE_RECEIVED.FIELD) &&
                valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.FIELD) &&
                valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.BUILDER_DIVISION.FIELD) &&
                valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET.FIELD)) {
                // let listingType = valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.LISTING_TYPE.FIELD];
                // console.log(listingType);
                // if (listingType == constants.DEFAULTS.PROPERTY_RECORD.LISTING.CONTRACT_TO_BUILD){
                //      if (valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.STAGE_OF_CONSTRUCTION.FIELD) &&
                //      valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.DATE_CONTRACT_EXECUTED.FIELD) &&
                //      valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.EARLIEST_POSSIEBLE_CLOSING_DATE.FIELD) &&
                //      valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.BUYER_NAME.FIELD)){
                //         let brokerInvolved:any = document.getElementsByName('inpt_custpage_mw_p1_broker_involved');
                //         if (brokerInvolved && brokerInvolved[0] && brokerInvolved[0].value && brokerInvolved[0].value == 'Yes'){
                //             if (valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.AGENT_NAME.FIELD) &&
                //             valuesObjet.hasOwnProperty(constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKERAGE_NAME.FIELD)){ 
                //                 ProcessNextButton(pScriptId,pDeploymentId,pRecordId,values);
                //             }
                //             else alert("Please Fill All the Requiered Fields.");
                //         }
                //         else ProcessNextButton(pScriptId,pDeploymentId,pRecordId,values);
                //      }
                //      else alert("Please Fill All the Requiered Fields.");
                // }
                // else ProcessNextButton(pScriptId,pDeploymentId,pRecordId,values);
                ProcessNextButton(pScriptId, pDeploymentId, pRecordId, values);
            }
            else {
                alert("Please Fill All the Requiered Fields.");
            }
        }
        catch (pError) {
            message.create({ title: "FAILURE", message: "Process Finished with Errors : " + pError.message, type: message.Type.ERROR }).show({ duration: 3000 });
            console.log("Process finished with errores: " + pError.message);
        }
    }
    exports.firstPageNextButton = firstPageNextButton;
    function ProcessNextButton(pScriptId, pDeploymentId, pRecordId, values) {
        var processingMessage = message.create({ title: "Procesing ...", message: "Record Information is Being Saved.", type: message.Type.INFORMATION });
        processingMessage.show();
        var ProcessRecordURl = url.resolveScript({ scriptId: pScriptId, deploymentId: pDeploymentId, params: {
                method: constants.METHODS.PROCESS_PROPERTY,
                pid: pRecordId
            } });
        // console.log(`ProcessRecordURl ${ProcessRecordURl}`);
        https.post.promise({ url: ProcessRecordURl, body: values, headers: { "Content-Type": "application/json" } }).then(function (pResult) {
            processingMessage.hide();
            // console.log(`pResult ${pResult.body}`);
            var bodyJson = JSON.parse(pResult.body);
            if (!bodyJson.status) {
                var newRecordID = bodyJson.recordId;
                var folderId = bodyJson.folderId;
                if (newRecordID) {
                    // console.log("go to page 2");
                    var secondPageurl = url.resolveScript({ scriptId: pScriptId, deploymentId: pDeploymentId, params: {
                            method: constants.METHODS.SECOND_PAGE,
                            pid: newRecordID,
                            fid: folderId
                        } });
                    location.href = secondPageurl;
                }
                else {
                    message.create({ title: "FAILURE", message: "Process Finished with Errors : record Id : " + newRecordID + ", Errors : " + bodyJson.message, type: message.Type.ERROR }).show({ duration: 6000 });
                    console.log("Error : record Id : " + newRecordID + ", Errors : " + bodyJson.message);
                }
            }
            else {
                message.create({ title: "FAILURE", message: "Process Finished with Errors : " + bodyJson.message, type: message.Type.ERROR }).show({ duration: 6000 });
            }
            console.log("Request finished.");
        }).catch(function (pError) {
            processingMessage.hide();
            message.create({ title: "FAILURE", message: "Process Finished with Errors : " + JSON.stringify(pError), type: message.Type.ERROR }).show({ duration: 6000 });
            console.log("Request finished with errores: " + JSON.stringify(pError));
        });
    }
    function UpdateSubdivisionsOptions(pContext, pNewFieldValue) {
        var subdivisionField = pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.ID });
        var options = subdivisionField.getSelectOptions({ filter: " ", operator: "startswith" });
        for (var i = 0; i < options.length; i++) {
            subdivisionField.removeSelectOption({ value: options[i].value });
        }
        if (pNewFieldValue) {
            var divisions = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION_OPTIONS.ID });
            var subdivisionsRaw = JSON.parse(divisions.toString())[pNewFieldValue.toString()];
            var subdivisions = subdivisionsRaw && subdivisionsRaw.subdivisions ? subdivisionsRaw.subdivisions : [];
            // console.log(`subdivisions : ${JSON.stringify(subdivisions)}`);
            for (var x = 0; x < subdivisions.length; x++) {
                subdivisionField.insertSelectOption({ value: subdivisions[x].id, text: subdivisions[x].name });
            }
        }
    }
    function UpdateStreetOptions(pContext, pNewFieldValue, pNewSteet) {
        var streetField = pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET.ID });
        var options = streetField.getSelectOptions({ filter: " ", operator: "startswith" });
        for (var i = 0; i < options.length; i++) {
            streetField.removeSelectOption({ value: options[i].value });
        }
        var setNewValue = false;
        if (pNewFieldValue) {
            var subdivisions = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET_OPTIONS.ID });
            var streetsRaw = JSON.parse(subdivisions.toString())[pNewFieldValue.toString()];
            var streets = streetsRaw && streetsRaw.streets ? streetsRaw.streets : [];
            // console.log(`streets : ${JSON.stringify(streets)}`);
            for (var x = 0; x < streets.length; x++) {
                streetField.insertSelectOption({ value: streets[x].id, text: streets[x].name, isSelected: streets[x].id == pNewSteet });
                if (streets[x].id == pNewSteet)
                    setNewValue = true;
            }
        }
        return setNewValue;
    }
    function addNewStreet(pElementId) {
        try {
            var newStreetURL_1 = url.resolveRecord({ recordType: constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET.SOURCE, recordId: null,
                params: {
                    label: constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET.LABEL,
                    target: "main:" + constants.PAGES.FIRST_PAGE.FORM_FIELDS.NEW_STREET.ID,
                    source: constants.METHODS.NEW_LISTING
                }
            });
            if (document.getElementById(pElementId)) {
                document.getElementById(pElementId).addEventListener("click", function () {
                    var SelectedValuesString = document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SELECTED_VALUES.ID);
                    var SelectedValues = SelectedValuesString && SelectedValuesString.value ? JSON.parse(SelectedValuesString.value) : {};
                    var subdivision = SelectedValues[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.FIELD];
                    var newStreetFullURL = subdivision ? newStreetURL_1 + "&subdivision=" + subdivision : newStreetURL_1;
                    var addStreetWindow = window.open(newStreetFullURL, pElementId, "width=1000,height=400");
                    waitWindowsToCloseToUpdate(addStreetWindow, 200);
                });
            }
        }
        catch (pError) {
            handleError(pError);
        }
    }
    exports.addNewStreet = addNewStreet;
    function waitWindowsToCloseToUpdate(win, time) {
        if (win.closed) {
            // console.log("ya se cerró")
            try {
                var scriptRaw = document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SCRIPT.ID);
                //console.log(scriptRaw);
                var script = JSON.parse(scriptRaw.value);
                if (script.deployment && script.script) {
                    var updateStreetsURL = url.resolveScript({ scriptId: script.script, deploymentId: script.deployment, params: {
                            method: constants.METHODS.GET_STEETS,
                        } });
                    https.get.promise({ url: updateStreetsURL }).then(function (pResult) {
                        var StreetOptions = document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.STREET_OPTIONS.ID);
                        if (StreetOptions && pResult.body) {
                            // console.log(pResult.body);
                            StreetOptions.value = pResult.body;
                            var subdivisión = document.getElementsByName(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SUBDIVISION.ID);
                            // console.log(subdivisión);
                            if (subdivisión && subdivisión[0])
                                subdivisión[0].onchange();
                        }
                        else
                            console.log("Can not set the Street Options Field");
                    })
                        .catch(function (pError) {
                        console.log("Can not Upgrade the Streets");
                        handleError(pError);
                    });
                }
            }
            catch (pError) {
                handleError(pError);
            }
            return;
        }
        else
            setTimeout(function () { waitWindowsToCloseToUpdate(win, time); }, time);
    }
    function changeDisplayTypeSalesFormFields(pContext, pNewState) {
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALE_CONTRACT_FILE.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.CONTRACT_RECEIVED_DATE.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.STAGE_OF_CONSTRUCTION.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.DATE_CONTRACT_EXECUTED.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.EARLIEST_POSSIEBLE_CLOSING_DATE.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.ESTIMATED_CLOSING_PRICE.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKER_INVOLVED.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.BUYER_NAME.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALES_NOTE.ID }).isDisabled = pNewState;
        var values = document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SELECTED_VALUES.ID);
        if (values.value) {
            var valuesObjet = JSON.parse(values.value);
            if (!pNewState) {
                var saleContractFile = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALE_CONTRACT_FILE.ID });
                var contractReceivedDate = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.CONTRACT_RECEIVED_DATE.ID });
                var stageOfConstruction = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.STAGE_OF_CONSTRUCTION.ID });
                var dateContractedExecuted = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.DATE_CONTRACT_EXECUTED.ID });
                var earliestPossibleClosingDate = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.EARLIEST_POSSIEBLE_CLOSING_DATE.ID });
                var estimatedClosePrice = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.ESTIMATED_CLOSING_PRICE.ID });
                var buyerName = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.BUYER_NAME.ID });
                var salesNotes = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALES_NOTE.ID });
                if (saleContractFile)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALE_CONTRACT_FILE.FIELD] = saleContractFile;
                if (contractReceivedDate)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALE_CONTRACT_FILE.FIELD] = contractReceivedDate;
                if (stageOfConstruction)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.STAGE_OF_CONSTRUCTION.FIELD] = stageOfConstruction;
                if (dateContractedExecuted)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.DATE_CONTRACT_EXECUTED.FIELD] = dateContractedExecuted;
                if (earliestPossibleClosingDate)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.EARLIEST_POSSIEBLE_CLOSING_DATE.FIELD] = earliestPossibleClosingDate;
                if (estimatedClosePrice)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.ESTIMATED_CLOSING_PRICE.FIELD] = estimatedClosePrice;
                if (buyerName)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.BUYER_NAME.FIELD] = buyerName;
                if (salesNotes)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALES_NOTE.FIELD] = salesNotes;
            }
            else {
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALE_CONTRACT_FILE.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALE_CONTRACT_FILE.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.STAGE_OF_CONSTRUCTION.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.DATE_CONTRACT_EXECUTED.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.EARLIEST_POSSIEBLE_CLOSING_DATE.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.ESTIMATED_CLOSING_PRICE.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.BUYER_NAME.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.SALES_NOTE.FIELD];
            }
            values.value = JSON.stringify(valuesObjet);
            console.log(values.value);
        }
    }
    function changeDisplayWhenBroker(pContext, pNewState) {
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.AGENT_NAME.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.AGENT_ID.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKERAGE_NAME.ID }).isDisabled = pNewState;
        pContext.currentRecord.getField({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKERAGE_ID.ID }).isDisabled = pNewState;
        var values = document.getElementById(constants.PAGES.FIRST_PAGE.FORM_FIELDS.SELECTED_VALUES.ID);
        if (values.value) {
            var valuesObjet = JSON.parse(values.value);
            if (!pNewState) {
                var agentName = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.AGENT_ID.ID });
                var AgentId = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.AGENT_NAME.ID });
                var BrokerageName = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKERAGE_NAME.ID });
                var brokerageId = pContext.currentRecord.getValue({ fieldId: constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKERAGE_ID.ID });
                if (agentName)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.AGENT_NAME.FIELD] = agentName;
                if (AgentId)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.AGENT_ID.FIELD] = AgentId;
                if (BrokerageName)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKERAGE_NAME.FIELD] = BrokerageName;
                if (brokerageId)
                    valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKERAGE_ID.FIELD] = brokerageId;
            }
            else {
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.AGENT_NAME.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.AGENT_ID.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKERAGE_NAME.FIELD];
                delete valuesObjet[constants.PAGES.FIRST_PAGE.FORM_FIELDS.BROKERAGE_ID.FIELD];
            }
            values.value = JSON.stringify(valuesObjet);
            console.log(values.value);
        }
    }
    function getBase64Result(pFile) {
        var reader = new FileReader();
        return new Promise(function (resolve, reject) {
            reader.onload = function () {
                var base64 = this.result;
                if (base64) {
                    console.log("good to go");
                    resolve({ name: pFile.name, base64: base64 });
                }
                else
                    reject();
            };
            reader.readAsDataURL(pFile);
        });
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
        console.log(pError.message);
    }
});
