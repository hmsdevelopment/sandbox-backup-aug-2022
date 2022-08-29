/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Felipe Castro
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/search", "N/email", "../../GhostList/forge.min.js"], function (require, exports, log, search, email, forge) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Defined Constants */
    var KEY = "D3A1C8FDEFE8A623300D35C5DEFC3EA2";
    var IV = "BCCD6545AC036A61";
    /* Execute this method each defined time */
    function execute(context) {
        try {
            /* Search all the property record with the defined filters */
            var propRecordSearch = search.create({
                type: "customrecord_property_record",
                filters: [
                    ["internalid", "is", "9370"],
                    "AND",
                    ["custrecord_top_level_builder", "anyof", "3642"],
                    "AND",
                    ["custrecord_listing_type", "anyof", "2"],
                    "AND",
                    ["custrecord_mw_enable_test_property_email", "is", true]
                ],
                columns: [
                    search.createColumn({ name: "name", sort: search.Sort.ASC }),
                    search.createColumn({ name: "id" }),
                    search.createColumn({ name: "custrecord_top_level_builder" }),
                    search.createColumn({ name: "custrecord12" }),
                    search.createColumn({ name: "custrecord18" }),
                    search.createColumn({ name: "custrecord_list_date" }),
                    search.createColumn({ name: "custrecord_listing_type" }),
                ]
            });
            var searchResultCount = propRecordSearch.runPaged().count;
            log.debug("Property Records Search Result count: ", searchResultCount);
            propRecordSearch.run().each(function (result) {
                log.debug("Running the property record each", "The id of the property record is " + result.id);
                if (result.getValue("custrecord12")) /* Checking if the property record have a defined builder division */ {
                    var ghostListingReminder = search.lookupFields({
                        type: "customer",
                        id: String(result.getValue("custrecord12")),
                        columns: "custentity_mw_ghost_listing_reminder"
                    }).custentity_mw_ghost_listing_reminder;
                    if (ghostListingReminder) {
                        if (result.getValue("custrecord_list_date")) /* Checking if the property record have a defined list date */ {
                            var listDate = new Date(String(result.getValue("custrecord_list_date")));
                            log.debug("Running the property record each", "Testing the list date: " + listDate.toDateString());
                            var newListDate = listDate;
                            newListDate.setDate(newListDate.getDate() + Number(ghostListingReminder));
                            log.debug("Running the property record each", "Testing the new list date: " + newListDate.toDateString());
                            if (isValidDate(newListDate)) /* Check if the new list date is valid with the actual date */ {
                                log.debug("Running the property record each", "The list date is valid with the actual date");
                                sendEmail(result.id, Number(ghostListingReminder));
                            }
                        }
                        else {
                            log.debug("Running the property record each", "The list date is not defined");
                        }
                    }
                    else {
                        log.debug("Running the property record each", "The ghost listing reminder is not defined in the builder");
                    }
                }
                else {
                    log.debug("Running the property record each", "The top level builder is not defined in the property record");
                }
                return true;
            });
        }
        catch (e) {
            /* If failed give me the message of the error */
            log.debug("Error", "Message: " + e.message);
        }
    }
    exports.execute = execute;
    /* Function to validate the date */
    function isValidDate(pListingDate) {
        var isValidDate = false;
        var actualDate = new Date();
        try {
            if (actualDate.getFullYear() > pListingDate.getFullYear()) {
                isValidDate = true;
            }
            else {
                if (actualDate.getMonth() > pListingDate.getMonth() && actualDate.getFullYear() == pListingDate.getFullYear()) {
                    isValidDate = true;
                }
                else {
                    if (actualDate.getDate() >= pListingDate.getDate() && actualDate.getMonth() == pListingDate.getMonth() && actualDate.getFullYear() == pListingDate.getFullYear()) {
                        isValidDate = true;
                    }
                }
            }
            return isValidDate;
        }
        catch (e) {
            /* If failed give me the message of the error */
            log.debug("Error", "Message: " + e.message);
        }
    }
    /************** Functions to send the email *********************/
    /*Email Sending Method*/
    function sendEmail(pIdOfTheProperty, pGhostListingReminder) {
        log.debug("Start of sendEmail", "Writing email");
        try {
            var daysToReminder = pGhostListingReminder;
            var numberOfInquiries = getNumberOfInquiries(pIdOfTheProperty);
            var propertyData = getPropertyData(pIdOfTheProperty);
            log.debug("Data for the email", "All gathered");
            sendEmailToBuilder(numberOfInquiries, daysToReminder, propertyData, pIdOfTheProperty);
            log.debug('End of sendEmail', "Success");
        }
        catch (error) {
            log.debug("SendEmail - Error ", "Error : " + error);
        }
        ;
    }
    exports.sendEmail = sendEmail;
    /*Returns the numbers of inquiries*/
    function getNumberOfInquiries(pPropertyId) {
        return search.create({
            type: "supportcase",
            filters: [
                "custevent_property", "anyof", pPropertyId
            ],
            columns: [
                "internalid"
            ]
        }).runPaged().count;
    }
    /*Returns the Property's data */
    function getPropertyData(pPropertyId) {
        log.debug("TEST LOOKUPFIELDS", "START, id = " + pPropertyId);
        var testStatus = search.lookupFields({ type: "customrecord_property_record",
            id: pPropertyId,
            columns: ["custrecord_property_status",
                "custrecord_house_number",
                "custrecord_lot_number",
                "custrecord_current_list_price",
                "custrecord_original_listing_price",
                "custrecord_subdivision_text",
                "custrecord_floorplan",
                "custrecord_elevation"] });
        var propertyStatus = testStatus['custrecord_property_status'][0] ? testStatus['custrecord_property_status'][0].text : '';
        var propertyAddress = testStatus['custrecord_house_number'];
        var propertyLotNumber = testStatus['custrecord_lot_number'];
        var propertyCurrentListPrice = testStatus['custrecord_current_list_price'];
        var propertyOrigListPrice = "$" + testStatus['custrecord_original_listing_price'];
        var propertySubdivision = testStatus['custrecord_subdivision_text'];
        var propertyElevation = testStatus['custrecord_elevation'];
        var propertyFloorplan;
        try {
            if (testStatus['custrecord_floorplan'].length == 0) {
                console.log("Empty");
                propertyFloorplan = "";
            }
            else {
                propertyFloorplan = testStatus['custrecord_floorplan'][0].text;
            }
        }
        catch (e) {
        }
        //Deletes extra 0s after de dot (.)
        var auxiliaryVar = propertyCurrentListPrice.toString();
        if (auxiliaryVar.indexOf(".") != -1) {
            var index = auxiliaryVar.indexOf(".");
            propertyCurrentListPrice = "$" + auxiliaryVar.substr(0, index);
        }
        log.debug("Returned Values", "Values: " + propertyStatus + " " + propertyAddress + " " + propertyLotNumber + " " + propertyCurrentListPrice + " " + propertyOrigListPrice + " " + propertySubdivision + " " + propertyFloorplan + " " + propertyElevation);
        return "<ul>\n                <li>Address: " + propertyAddress + "</li>\n                <li>Lot: " + propertyLotNumber + "</li>                            \n                <li>Subdivision: " + propertySubdivision + "</li>\n                <li>Floorplan: " + propertyFloorplan + "</li>                            \n                <li>Elevation: " + propertyElevation + "</li>\n                <li>Status: " + propertyStatus + "</li>\n                <li>Current List Price: " + propertyCurrentListPrice + "</li>\n                <li>Original List Price: " + propertyOrigListPrice + "</li>\n            </ul>";
    }
    /*Gathers parameters and sends the email*/
    function sendEmailToBuilder(pInquiriesNumber, pAvailableDays, pPropertyData, pPropertyRecordId) {
        //let recipientEmail = "jmcdonald@hmsmarketingservices.com";
        // let recipientEmail = "roy.cordero@midware.net";
        var recipientEmail = getEmailToSend(pPropertyRecordId);
        var propertyIdEnc = ForgeAesEncrypt(pPropertyRecordId.toString());
        var emailBody = "<p>The following GL has been available in MLS for " + pAvailableDays + " days.</p><p>It has had " + pInquiriesNumber + " number of inquiries.</p>";
        emailBody = emailBody.concat(pPropertyData);
        emailBody = emailBody.concat("<p>It's time to reassess the productivity of this ghost listing. Your cooperation in updating this GL is an important component to continuing and vibrant GL program for your division. <a href=\"https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=411&deploy=1&compid=1309901&h=e11f8c425cb221a7ff63&action=updateData&propertyId=" + propertyIdEnc + "&builderEmail=" + recipientEmail + "\">Click here</a></p>");
        log.debug("Attempting to send an Email", "Before try");
        try {
            email.send({
                author: 4834,
                recipients: [recipientEmail],
                subject: "Email to Builder Test",
                body: emailBody
            });
            log.debug("Email status...", "Email successfully sent.");
        }
        catch (error) {
            log.debug("SendEmailToBuilder - Error ", "Error : " + error);
        }
        ;
    }
    /*Search in fields to return the right email */
    function getEmailToSend(propertyRecordId) {
        try {
            var propertyRecordFields = search.lookupFields({
                type: "customrecord_property_record",
                id: String(propertyRecordId),
                columns: ['custrecord_mw_build_pers_tobe_reminded', 'custrecord_mw_builder_personnel_notified']
            });
            var personnelReminded = propertyRecordFields.custrecord_mw_build_pers_tobe_reminded;
            var personnelNotified = propertyRecordFields.custrecord_mw_builder_personnel_notified;
            var validPRemainded = false;
            try {
                if (personnelReminded[0].value) {
                    validPRemainded = true;
                }
                else {
                    validPRemainded = false;
                }
            }
            catch (e) {
            }
            if (validPRemainded === true) {
                var personnelRemindedFields = search.lookupFields({
                    type: "partner",
                    id: String(personnelReminded[0].value),
                    columns: ['email']
                });
                log.debug("Personnel Reminded id ", JSON.stringify(personnelReminded[0].value));
                console.log("Personnel Reminded id " + String(personnelReminded[0].value));
                console.log("Email for Personnel Reminded ", personnelRemindedFields.email);
                log.debug("Email for Personnel Reminded", personnelRemindedFields.email);
                return personnelRemindedFields.email;
            }
            else {
                var personnelNotifiedFields = search.lookupFields({
                    type: "partner",
                    id: String(personnelNotified[0].value),
                    columns: ['email']
                });
                log.debug("Personnel Notified id ", String(personnelNotified[0].value));
                console.log("Personnel Notified id " + String(personnelNotified[0].value));
                console.log("Email for Personnel Notified " + personnelNotifiedFields.email);
                log.debug("Email for Personnel Notified ", personnelNotifiedFields.email);
                return personnelNotifiedFields.email;
            }
        }
        catch (e) {
        }
    }
    /*Encrypts data*/
    function ForgeAesEncrypt(pData) {
        var cipher = forge.cipher.createCipher('AES-CBC', forge.util.encodeUtf8(KEY));
        cipher.start({ iv: forge.util.encodeUtf8(IV) });
        cipher.update(forge.util.createBuffer(pData));
        cipher.finish();
        var encrypted = cipher.output;
        // outputs encrypted hex
        return (forge.util.bytesToHex(forge.util.encode64(encrypted.data)));
    }
});
