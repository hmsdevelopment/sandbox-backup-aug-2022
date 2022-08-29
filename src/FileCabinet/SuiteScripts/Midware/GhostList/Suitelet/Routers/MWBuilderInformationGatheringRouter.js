/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 */
define(["require", "exports", "N/log", "../Controllers/MWBuilderInformationGatheringController"], function (require, exports, log, MWBuilderInformationGatheringController) {
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
            var builderPersonnelSelected = params.builder_personnel_name;
            var closedPropertyId;
            var soldPropertyId;
            var relocatedPropertyId;
            if (!reminderWeeks || reminderWeeks && reminderWeeks == "") {
                if (builderPersonnelSelected && builderPersonnelSelected != "") {
                    MWBuilderInformationGatheringController.saveValues(params);
                }
                else {
                    //Save submit a sale values
                    //file.create({name : "MWBuilderInformationGatherinnRequest.json", folder : 21834, contents : JSON.stringify(pContext.request), fileType : file.Type.JSON}).save();
                    closedPropertyId = MWBuilderInformationGatheringController.setOriginalPropertyAsClosed(params);
                    soldPropertyId = MWBuilderInformationGatheringController.makeSoldPropertyRecordCopy(params, pContext.request.files);
                    var pGhostMoved = params.custrecord_mw_ghost_moved;
                    if (pGhostMoved && pGhostMoved == '1') { //'1' is the constant for YES on these forms
                        relocatedPropertyId = MWBuilderInformationGatheringController.makeRelocatedPropertyRecordCopy(params);
                    }
                    MWBuilderInformationGatheringController.sendNotificationToHMSPersonnel(closedPropertyId, soldPropertyId, relocatedPropertyId);
                }
            }
        }
    }
    exports.onRequest = onRequest;
});
