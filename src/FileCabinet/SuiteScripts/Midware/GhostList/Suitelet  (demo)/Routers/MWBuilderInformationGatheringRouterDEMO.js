/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 */
define(["require", "exports", "N/log", "N/file", "N/record", "../Controllers/MWBuilderInformationGatheringController"], function (require, exports, log, file, record, MWBuilderInformationGatheringController) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function onRequest(pContext) {
        log.debug("Router", "Start Router");
        //Execute GET
        if (pContext.request.method === 'GET') {
            log.debug("Router", "GET request");
            var propertyId = pContext.request.parameters.propertyid;
            // Get FloorPlan list
            var floorPlanList = MWBuilderInformationGatheringController.getFloorPlanList();
            // Get HTML view of form
            var form = MWBuilderInformationGatheringController.getForm(floorPlanList, propertyId);
            pContext.response.write(form);
        }
        //Execute POST
        else if (pContext.request.method === 'POST') {
            //throw 'dev stop';
            log.debug("Router", "POST request");
            var params = pContext.request.parameters;
            log.debug("Incoming parameters", JSON.stringify(params));
            // Get HTML to return as response after submit
            var responseView = MWBuilderInformationGatheringController.afterSubmitView();
            pContext.response.write(responseView);
            var reminderWeeks = params.reminder_weeks;
            var builderPersonnelSelected = params.builder_personnel;
            try {
                var fileNames = Object.keys(params).filter(function (x) { return x.match(/custpage_file_[0-9]*_contents/); });
                for (var i = 0; i < fileNames.length; i++) {
                    var fileJSONStr = params[fileNames[i]];
                    var fileNumber = fileNames[i].match(/custpage_file_([0-9]*)_contents/)[1];
                    var fileJSON = JSON.parse(fileJSONStr);
                    var contentsParsed = fileJSON.contents.substr(fileJSON.contents.indexOf(',') + 1);
                    var f = file.create({ name: fileJSON.name, contents: contentsParsed, folder: 34478, fileType: file.Type.PDF, description: params["description_file_" + fileNumber] }).save();
                    log.debug("file created", f);
                    record.attach({
                        record: {
                            type: "file",
                            id: Number(f)
                        },
                        to: {
                            type: "customrecord_property_record",
                            id: params.propertyId,
                        }
                    });
                }
            }
            catch (error) {
                log.debug("FILE TEST ERROR", JSON.stringify(error));
            }
            if (!reminderWeeks || reminderWeeks && reminderWeeks == "") {
                if (builderPersonnelSelected && builderPersonnelSelected != "") {
                    //MWBuilderInformationGatheringController.saveValues(params);
                }
                else {
                    //Save submit a sale values
                    file.create({ name: "HMS Ghost Listing Maintenance System (DEMO).json", folder: 34478, contents: JSON.stringify(pContext.request), fileType: file.Type.JSON }).save();
                    //MWBuilderInformationGatheringController.saveSaleInformationValues(params, pContext.request.files);
                    // Create copy of property record if required
                    //MWBuilderInformationGatheringController.copyRecords(params);
                }
            }
            // Save values on custom record
        }
    }
    exports.onRequest = onRequest;
});
