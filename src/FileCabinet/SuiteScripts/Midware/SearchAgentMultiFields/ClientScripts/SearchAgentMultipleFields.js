/**
 * @NAPIVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer Fernanda Carmona
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/search", "N/record", "../Global/Constants"], function (require, exports, log, search, record, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function pageInit(pContext) {
        document.getElementById("custpage_mw_search_btn").onclick = function () { displayPopup(pContext); };
        //@ts-ignore
        jQuery(document).ready(function () {
            //@ts-ignore
            jQuery("#search-agent").css({ "padding-bottom": "3px", "padding-top": "3px", "padding-right": "3px", "border": "1px solid transparent !important", "margin-left": "3px" });
        });
        //function for display the search Propertys popup
        document.getElementById(constants.SEARCH_BUTTONS.PROPERTY).onclick = function () { displayPropertysPopup(pContext); };
    }
    exports.pageInit = pageInit;
    function displayPropertysPopup(pContext) {
        setSearchEvents();
        var message = "Sale Status:<br></br> <select size=\"5\"style=\"width:100%;\" multiple id=\"" + constants.POPUP_FIELDS.PROPERTY.SALE_STATUS + "\" ></select><br></br>\n                 House Number: <input \"type=\"text\" id=\"" + constants.POPUP_FIELDS.PROPERTY.HOUSE_NUMBER_INPUT + "\" ></input> &nbsp;&nbsp;\n                 Street: <input \"type=\"text\" id=\"" + constants.POPUP_FIELDS.PROPERTY.STREET_INPUT + "\" ></input> <br></br>\n                 Lot Number: <input \"type=\"text\" id=\"" + constants.POPUP_FIELDS.PROPERTY.LOT_NUMBER_INPUT + "\" ></input><br></br>\n                 <button id=\"" + constants.POPUP_FIELDS.PROPERTY.SEARCH_BUTTON + "\">Search</button><br></br><br></br>\n                 Property:<br /><br /><select size=\"20\" multiple style=\"width:100%;\" id=\"" + constants.POPUP_FIELDS.PROPERTY.SELECT_PROPERTY + "\" >";
        log.debug("display", "proeprty popup");
        //@ts-ignore
        Ext.MessageBox.show({
            title: "Search Property",
            msg: message + "</select>",
            width: 580,
            //@ts-ignore
            buttons: Ext.Msg.OKCANCEL,
            fn: function (pButton) {
                if (pButton == "ok") {
                    log.debug("ok", "");
                    //@ts-ignore
                    var selectedOptions = jQuery("#" + constants.POPUP_FIELDS.PROPERTY.SELECT_PROPERTY + " :selected").length;
                    log.debug("1", "");
                    if (selectedOptions > 1) {
                        //@ts-ignore
                        Ext.Msg.alert('Select Property', 'Please select only one Property.');
                    }
                    log.debug("ok2", "");
                    //@ts-ignore
                    var optionSelected = Ext.get(constants.POPUP_FIELDS.PROPERTY.SELECT_PROPERTY).dom.options[Ext.get(constants.POPUP_FIELDS.PROPERTY.SELECT_PROPERTY).dom.options.selectedIndex].value;
                    log.debug("Selected Option", JSON.stringify(optionSelected));
                    if (optionSelected != -1) {
                        pContext.currentRecord.setValue({ fieldId: constants.NS_FIELDS_ID.PROPERTY, value: optionSelected });
                    }
                }
                else {
                    return true;
                }
            }
        });
    }
    function getSaleStatusList() {
        var listRecord = record.load({ type: "customlist", id: 31 });
        var listLength = listRecord.getLineCount({ sublistId: "customvalue" });
        var saleStatusList = [];
        for (var i = 0; i < listLength; i++) {
            var valueid = listRecord.getSublistValue({ sublistId: "customvalue", fieldId: "valueid", line: i });
            var name_1 = listRecord.getSublistValue({ sublistId: "customvalue", fieldId: "value", line: i });
            saleStatusList.push({ id: valueid, name: name_1 });
        }
        return saleStatusList;
    }
    function setSearchEvents() {
        //Set sale status options
        //@ts-ignore
        jQuery(document).ready(function () {
            var saleStatus = getSaleStatusList();
            var saleStatusOptions = "<option value=\"-1\"></option>";
            for (var i = 0; i < saleStatus.length; i++) {
                if (saleStatus[i].id == 2 || saleStatus[i].id == 1) {
                    saleStatusOptions += "<option  selected=\"selected\" value=\"" + saleStatus[i].id + "\">" + saleStatus[i].name + "</option>";
                }
                else {
                    saleStatusOptions += "<option value=\"" + saleStatus[i].id + "\">" + saleStatus[i].name + "</option>";
                }
            }
            //@ts-ignore 
            jQuery("#" + constants.POPUP_FIELDS.PROPERTY.SALE_STATUS).html(saleStatusOptions);
            //@ts-ignore
            jQuery("#" + constants.POPUP_FIELDS.PROPERTY.SEARCH_BUTTON).click(function () {
                //@ts-ignore
                var streetText = jQuery("#" + constants.POPUP_FIELDS.PROPERTY.STREET_INPUT).val();
                //@ts-ignore
                var HouseText = jQuery("#" + constants.POPUP_FIELDS.PROPERTY.HOUSE_NUMBER_INPUT).val();
                //@ts-ignore
                var LotText = jQuery("#" + constants.POPUP_FIELDS.PROPERTY.LOT_NUMBER_INPUT).val();
                //@ts-ignore
                var saleStatus = jQuery("#" + constants.POPUP_FIELDS.PROPERTY.SALE_STATUS).val();
                if (true) {
                    //@ts-ignore
                    jQuery("#" + constants.POPUP_FIELDS.PROPERTY.SELECT_PROPERTY).children().remove();
                    var NSData = getProperties(streetText, LotText, HouseText, saleStatus);
                    console.log(NSData);
                    if (NSData.length > 0) {
                        //@ts-ignore 
                        jQuery("#" + constants.POPUP_FIELDS.PROPERTY.SELECT_PROPERTY).children().remove();
                        //Fill select with property option 
                        for (var i = 0; i < NSData.length; i++) {
                            //@ts-ignore
                            jQuery("#" + constants.POPUP_FIELDS.PROPERTY.SELECT_PROPERTY).append("<option value=\"" + NSData[i].id + "\">" + NSData[i].name + "</option>");
                        }
                    }
                    else {
                        //@ts-ignore 
                        jQuery("#" + constants.POPUP_FIELDS.PROPERTY.SELECT_PROPERTY).children().remove();
                        //@ts-ignore 
                        jQuery("#" + constants.POPUP_FIELDS.PROPERTY.SELECT_PROPERTY).append("<option value=\"-1\">No results found</option>");
                    }
                }
                else {
                    //@ts-ignore
                    jQuery("#search_agent_text").attr("placeholder", "Enter at least 3 characters").val("");
                }
            });
            //     //Press enter to search
            var inputLot = document.getElementById(constants.POPUP_FIELDS.PROPERTY.LOT_NUMBER_INPUT);
            var inputHouse = document.getElementById(constants.POPUP_FIELDS.PROPERTY.HOUSE_NUMBER_INPUT);
            var inputStreet = document.getElementById(constants.POPUP_FIELDS.PROPERTY.STREET_INPUT);
            inputLot.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    // event.preventDefault();
                    document.getElementById(constants.POPUP_FIELDS.PROPERTY.SEARCH_BUTTON).click();
                }
            });
            inputHouse.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    // event.preventDefault();
                    document.getElementById(constants.POPUP_FIELDS.PROPERTY.SEARCH_BUTTON).click();
                }
            });
            inputStreet.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    // event.preventDefault();
                    document.getElementById(constants.POPUP_FIELDS.PROPERTY.SEARCH_BUTTON).click();
                }
            });
            //@ts-ignore
            jQuery(" option").mousedown(function (e) {
                e.preventDefault();
                //@ts-ignore
                jQuery(this).toggleClass('selected');
                //@ts-ignore
                jQuery(this).prop('selected', !jQuery(this).prop('selected'));
                return false;
            });
        });
    }
    function buildOption(id, agentId, name, brokerage, callerType, email, phone, officeNumber, otherNumber) {
        var html = "<div class=\"div-option\" id=\"" + id + "\" style=\"padding:6px 8px 6px; line-height: 1.2rem;font-family: 'Open Sans', Helvetica, sans-serif; font-size:13px; border: solid 1px lightgray; cursor: pointer;\">\n                    <span class=\"option-name\" style=\"font-weight: bold;\">" + name + "</span><br>";
        (agentId) ? html += "<span class=\"option-name\" style=\"font-weight: bold;\">Agent ID:&nbsp</span>" + agentId + "<br>" : "";
        html += "<span class=\"option-brokerage\"  style=\"font-weight: bold;\" >Brokerage:&nbsp;</span>" + brokerage + "<br>\n            <span class\"option-caller-type\" style=\"font-weight: bold;\">Caller Type:&nbsp;</span>" + callerType + "<br>\n            <span class=\"option-email\" style=\"font-weight: bold;\">Email:&nbsp;</span> " + email + "<br>";
        (phone) ? html += "<span class=\"option-phone\" style=\"font-size:12px; font-weight: bold;\">Mobile Phone:&nbsp;</span>" + phone + "<br>" : "";
        (officeNumber) ? html += "<span class=\"option-office-number\" style=\"font-size:12px; font-weight: bold;\">Office Phone:&nbsp; </span>" + officeNumber + "<br>" : "";
        (otherNumber) ? html += " <span class=\"option-other-number\" style=\"font-size:12px; font-weight: bold;\">Other Phone:&nbsp;</span> " + otherNumber + "<br>" : "";
        html += "</div>";
        return html;
    }
    function displayPopup(pContext) {
        log.debug("display popup", "");
        var mlsRegion1 = pContext.currentRecord.getValue({ fieldId: "custevent_mls_region1" });
        var mlsRsegion2 = pContext.currentRecord.getValue({ fieldId: "custevent_mls_region2" });
        var mls1 = getMLSRegionId(mlsRegion1);
        var mls2 = getMLSRegionId(mlsRsegion2);
        //@ts-ignore
        jQuery(document).ready(function () {
            //@ts-ignore
            jQuery("#search_button").click(function () {
                //@ts-ignore
                var text = jQuery("#search_agent_text").val();
                //Type more tha 3 characters
                if (text.length > 2) {
                    //@ts-ignore
                    jQuery('#select-div').children().remove();
                    var NSData = getAgents(text, mls1, mls2);
                    console.log(NSData);
                    if (NSData.length > 0) {
                        //Fill select with agents option 
                        for (var i = 0; i < NSData.length; i++) {
                            //@ts-ignore
                            jQuery('#select_agent').append("<option value=\"" + NSData[i].id + "\">" + NSData[i].name + "</option>");
                            //Fill Div
                            console.log("fill div");
                            var option = buildOption(NSData[i].internalId, NSData[i].agentId, NSData[i].name, NSData[i].brokerage, NSData[i].callerType, NSData[i].email, NSData[i].phone, NSData[i].officeNumber, NSData[i].otherNumber);
                            //@ts-ignore
                            jQuery('#select-div').append(option);
                        }
                    }
                    else {
                        //@ts-ignore 
                        jQuery('#select-div').children().remove();
                        //@ts-ignore 
                        jQuery('#select-div').append("<div id=\"-1\" style=\"padding:6px 8px 6px; line-height: 1.2rem;font-family: 'Open Sans', Helvetica, sans-serif; font-size:13px; border: solid 1px lightgray; cursor: pointer;\">No results found.</div>");
                    }
                    //click funtion select agent
                    //@ts-ignore
                    jQuery('.div-option').click(function () {
                        //@ts-ignore
                        var agentId = jQuery(this).attr("id");
                        console.log(agentId);
                        //@ts-ignore
                        jQuery("#selected-agent").val(agentId);
                        jQuery("#select-div").children().css("background-color", "white");
                        jQuery("#select-div").children().css("color", "#262626");
                        jQuery("#select-div").children("#" + agentId).css("background-color", "#3297FD");
                        jQuery("#select-div").children("#" + agentId).css("color", "white");
                        //@ts-ignore
                    });
                }
                else {
                    //@ts-ignore
                    jQuery("#search_agent_text").attr("placeholder", "Enter at least 3 characters").val("");
                }
            });
            //Press enter to search
            var input = document.getElementById("search_agent_text");
            input.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    // event.preventDefault();
                    document.getElementById("search_button").click();
                }
            });
        });
        var message = "Search by name, email, agent ID or phone:<br></br><input style=\"width:87%;\"type=\"text\" id=\"" + constants.POPUP_FIELDS.AGENT.SEARCH_INPUT + "\" ></input>\n                 <button id=\"search_button\">Search</button><br></br>\n                 Agent:<br /><br />\n                 <div id=\"select-div\" style=\"background: white;border: solid 1px lightgray; height:500px; width:500px;overflow: scroll;\"></div>\n                 <input id =\"selected-agent\" value=\"-1\" style=\"display:none\"></input>";
        //@ts-ignore
        Ext.MessageBox.show({
            title: "Search Agent",
            msg: "" + message,
            maximizable: true,
            width: 580,
            //@ts-ignore
            buttons: Ext.Msg.OKCANCEL,
            fn: function (pButton) {
                if (pButton == "ok") {
                    //@ts-ignore
                    var agentSelected = Ext.get(constants.POPUP_FIELDS.AGENT.SELECT_AGENT_INPUT).dom.value;
                    log.debug("Selected Agent", JSON.stringify(agentSelected));
                    console.log("Selected Agent " + agentSelected);
                    if (agentSelected != -1) {
                        pContext.currentRecord.setValue({ fieldId: "custevent_caller_name", value: agentSelected });
                    }
                }
                else {
                    return true;
                }
            }
        });
    }
    function getAgents(searchText, mslRegion1, mslRegion2) {
        log.debug("Search text", searchText);
        var mlsRegion;
        if (mslRegion1) {
            mlsRegion = mslRegion1;
        }
        else {
            if (mslRegion2) {
                mlsRegion = mslRegion2;
            }
        }
        log.debug("MLSREGION", mlsRegion);
        var filterMLSRegion = ["custrecord_agent_mls_region", "anyof", Number(mlsRegion)];
        var filterKeyword = [["custrecord_agent_email", "contains", searchText], "OR", ["custrecord_agent_mobile_number", "contains", searchText], "OR", ["name", "contains", searchText], "OR", ["custrecord_agent_id", "contains", searchText]];
        var filters = [];
        filters.push(["isinactive", "is", "F"]);
        if (mlsRegion) {
            filters.push("AND");
            filters.push(filterMLSRegion);
        }
        if (searchText) {
            filters.push("AND");
            filters.push(filterKeyword);
        }
        log.debug("Filters", JSON.stringify(filters));
        var customrecord_agentSearchObj = search.create({
            type: "customrecord_agent",
            filters: filters,
            columns: [
                search.createColumn({
                    name: "custrecord_agent_last_name",
                    sort: search.Sort.ASC,
                    label: "Last Name"
                }),
                search.createColumn({ name: "name", label: "Name" }),
                search.createColumn({ name: "custrecord_agent_first_name", label: "First Name" }),
                search.createColumn({ name: "internalid", label: "Internal ID" }),
                search.createColumn({ name: "custrecord_agent_email", label: "Email" }),
                search.createColumn({ name: "custrecord_agent_mobile_number", label: "Cell Number" }),
                search.createColumn({ name: "custrecord_brokerage", label: "brokerage" }),
                search.createColumn({ name: "custrecord_agent_office_number", label: "Office Number" }),
                search.createColumn({ name: "custrecord_agent_other_number", label: "Other Number" }),
                search.createColumn({ name: "custrecord_agent_id", label: "Agent ID Number" }),
                search.createColumn({
                    name: "custrecord38",
                    join: "CUSTRECORD_BROKERAGE",
                    label: "Brokerage Type"
                }),
                search.createColumn({
                    name: "custrecord52",
                    join: "CUSTRECORD_BROKERAGE",
                    label: "Brokerage or Company Name"
                })
            ]
        }).runPaged({ pageSize: 1000 });
        var count = customrecord_agentSearchObj.count;
        log.debug("Search Results Count", count);
        var agentSearch = customrecord_agentSearchObj;
        var agents = [];
        for (var i = 0; i < agentSearch.pageRanges.length; i++) {
            var page = agentSearch.fetch({ index: agentSearch.pageRanges[i].index });
            for (var j = 0; j < page.data.length; j++) {
                var internalId = Number(page.data[j].getValue("internalid"));
                var agentName = page.data[j].getValue("custrecord_agent_last_name") + ", " + page.data[j].getValue("custrecord_agent_first_name");
                var agentCallerType = page.data[j].getText({ name: "custrecord38", join: "CUSTRECORD_BROKERAGE" });
                var agentBrokerage = page.data[j].getValue({ name: "custrecord52", join: "CUSTRECORD_BROKERAGE" });
                var agentEmail = page.data[j].getValue(constants.AGENT_FIELDS.EMAIL);
                var agentPhone = page.data[j].getValue(constants.AGENT_FIELDS.CELL_PHONE);
                var agentOfficeNumber = page.data[j].getValue(constants.AGENT_FIELDS.OFFICE_NUMBER);
                var agentOtherNumber = page.data[j].getValue(constants.AGENT_FIELDS.OTHER_NUMBER);
                var agentId = page.data[j].getValue(constants.AGENT_FIELDS.AGENT_ID);
                var agent = { name: agentName, internalId: internalId, agentId: agentId, brokerage: agentBrokerage, callerType: agentCallerType, email: agentEmail, phone: agentPhone, officeNumber: agentOfficeNumber, otherNumber: agentOtherNumber };
                agents.push(agent);
            }
        }
        return agents;
    }
    function getMLSRegionId(pName) {
        var locationID;
        log.debug("Getting MLSRegion id", pName);
        if (pName) {
            var locationSearchObj = search.create({
                type: "location",
                filters: [
                    ["name", "is", pName]
                ],
                columns: [
                    search.createColumn({
                        name: "name",
                        sort: search.Sort.ASC,
                        label: "Name"
                    }),
                    search.createColumn({ name: "state", label: "State/Province" }),
                ]
            });
            var searchResultCount = locationSearchObj.runPaged().count;
            log.debug("locationSearchObj result count", searchResultCount);
            locationSearchObj.run().each(function (result) {
                locationID = result.id;
                return true;
            });
            log.debug(locationID);
        }
        return locationID;
    }
    function getProperties(pStreet, pLot, pHouse, pSaleStatus) {
        var streetFilter = ["custrecord_street_text", "contains", pStreet];
        var lotFilter = ["custrecord_lot_number", "contains", pLot];
        var houseFilter = ["custrecord_house_number", "contains", pHouse];
        var saleStatusFilter = ["custrecord_property_status", "anyof", pSaleStatus];
        var filters = [];
        var filterSetStreetHouse = [];
        var filterSetAddress = []; //street house lot
        if (pSaleStatus && pSaleStatus != -1) {
            filters.push(saleStatusFilter);
        }
        //build filter Street house set
        if (pStreet) {
            filterSetStreetHouse.push(streetFilter);
        }
        if (pHouse && pStreet) {
            filterSetStreetHouse.push("AND");
            filterSetStreetHouse.push(houseFilter);
        }
        else {
            if (pHouse) {
                filterSetStreetHouse.push(houseFilter);
            }
        }
        if (filterSetStreetHouse.length > 0) {
            filterSetAddress.push(filterSetStreetHouse);
            if (pLot) {
                filterSetAddress.push("OR");
                filterSetAddress.push(lotFilter);
                if (pSaleStatus && pSaleStatus != -1) {
                    filters.push("AND");
                    filters.push(filterSetAddress);
                }
                else {
                    filters.push(filterSetAddress);
                }
            }
            else { //no street and house but no lot
                if (pSaleStatus && pSaleStatus != -1) {
                    filters.push("AND");
                    filters.push(filterSetStreetHouse);
                }
                else {
                    filters.push(filterSetStreetHouse);
                }
            }
        }
        else { //there is no street and house
            if (pLot) {
                if (pSaleStatus && pSaleStatus != -1) {
                    filters.push("AND");
                    filters.push(lotFilter);
                }
                else {
                    filters.push(lotFilter);
                }
            }
        }
        // [[["custrecord_street_text","contains","Main"],"AND",["custrecord_house_number","contains","Main"]],"OR",["custrecord_lot_number","contains","a"]], 
        // "AND", 
        // ["custrecord_property_status","anyof","2","1"]
        // ["custrecord_property_status","anyof","2"]
        // [["custrecord_street_text","contains",pStreet],"OR",["custrecord_house_number","contains",pHouse],"OR",["custrecord_lot_number","contains",pLot]]
        log.debug("Filters", JSON.stringify(filters));
        var searchObj = search.create({
            type: "customrecord_property_record",
            filters: filters,
            columns: [
                search.createColumn({
                    name: "name",
                    sort: search.Sort.ASC,
                    label: "Name"
                }),
                search.createColumn({ name: "id", label: "ID" }),
                search.createColumn({ name: "custrecord_buyers_last_name", label: "Buyer's Last Name" }),
                search.createColumn({ name: "custrecord_house_number", label: "House Number" }),
                search.createColumn({ name: "custrecordcustrecordsubdname", label: "Subdivision Name" }),
                search.createColumn({ name: "custrecord_lot_number", label: "Lot Number" }),
                search.createColumn({ name: "custrecord_street_text", label: "Street Text" }),
                search.createColumn({ name: "custrecord_property_status", label: "Sale Status" })
            ]
        }).runPaged({ pageSize: 1000 });
        var count = searchObj.count;
        log.debug("Search Results Count", count);
        var properties = [];
        for (var i = 0; i < searchObj.pageRanges.length; i++) {
            var page = searchObj.fetch({ index: searchObj.pageRanges[i].index });
            for (var j = 0; j < page.data.length; j++) {
                var propertyId = Number(page.data[j].id);
                var propertyName = page.data[j].getValue("name");
                var propertyHouse = page.data[j].getValue("custrecord_house_number");
                var propertyLot = page.data[j].getValue("custrecord_lot_number");
                var propertyStreet = page.data[j].getValue("custrecord_street_text");
                var saleStatus = page.data[j].getValue("custrecord_property_status");
                var property = { name: propertyName, id: propertyId, house: propertyHouse, lot: propertyLot, street: propertyStreet, saleStatus: saleStatus };
                properties.push(property);
            }
        }
        return properties;
    }
});
