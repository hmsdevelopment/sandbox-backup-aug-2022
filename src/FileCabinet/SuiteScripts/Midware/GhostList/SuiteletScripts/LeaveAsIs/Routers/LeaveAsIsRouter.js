/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Arturo Padilla
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "../Controllers/LeaveAsIsController"], function (require, exports, log, LeaveAsIsController) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function onRequest(pContext) {
        try {
            if (pContext.request.method === 'GET' && pContext.request.parameters.action === 'thanks') {
                if (pContext.request.parameters.propertyId) {
                    var encPropertyId = pContext.request.parameters.propertyId;
                    log.debug('propertyId', encPropertyId);
                    var personnelId = pContext.request.parameters.partner;
                    log.debug('personnelId', personnelId);
                    pContext.response.write(LeaveAsIsController.getThanksPageView(encPropertyId, personnelId));
                }
            }
            else if (pContext.request.method === 'GET' && pContext.request.parameters.action === 'changePrice') {
                if (pContext.request.parameters.propertyId) {
                    var encPropertyId = pContext.request.parameters.propertyId;
                    log.debug('propertyId', encPropertyId);
                    var personnelId = pContext.request.parameters.partner;
                    log.debug('get changePrice personnelId', personnelId);
                    pContext.response.write(LeaveAsIsController.getChangePriceForm(encPropertyId, personnelId));
                }
            }
            else if (pContext.request.method === 'GET' && pContext.request.parameters.action === 'updateData') {
                if (pContext.request.parameters.propertyId) {
                    var encPropertyId = pContext.request.parameters.propertyId;
                    var builderEmail = pContext.request.parameters.builderEmail;
                    var pPartnerId = pContext.request.parameters.partner;
                    log.debug('propertyId', encPropertyId);
                    pContext.response.write(LeaveAsIsController.getUpdateDataForm(encPropertyId, builderEmail, pPartnerId));
                }
            }
            else if (pContext.request.method === 'GET' && pContext.request.parameters.action === 'noLotBeenSold') {
                if (pContext.request.parameters.propertyId) {
                    var encPropertyId = pContext.request.parameters.propertyId;
                    log.debug('propertyId', encPropertyId);
                    pContext.response.write(LeaveAsIsController.getThanksPageForNoLotBeenSold(encPropertyId));
                }
            }
            else if (pContext.request.method === 'GET' && pContext.request.parameters.action === 'guidanceReq') {
                if (pContext.request.parameters.propertyId) {
                    var encPropertyId = pContext.request.parameters.propertyId;
                    var builderEmail = pContext.request.parameters.builderEmail;
                    log.debug('propertyId', encPropertyId);
                    pContext.response.write(LeaveAsIsController.getComingSoonPage(encPropertyId, builderEmail));
                }
            }
            else if (pContext.request.method === 'GET' && pContext.request.parameters.action === 'defaultThankYou') {
                pContext.response.write(LeaveAsIsController.getDefaultThankyouPage());
            }
            if (pContext.request.method === 'POST') {
                var action = pContext.request.parameters.action;
                var encPropertyId = pContext.request.parameters.propertyId;
                var params = pContext.request.parameters;
                log.debug('Parameters', params);
                log.debug('Body', pContext.request.body);
                // Price Has Changed
                if (action == 'changePrice') {
                    var newPrice = pContext.request.parameters.newprice;
                    log.debug("New Price", newPrice);
                    newPrice = newPrice.replace(',', '');
                    pContext.response.write(LeaveAsIsController.changePropertyPrice(encPropertyId, newPrice));
                    // Method Update Data
                }
                else if (action == 'updateData') {
                    var reminderWeeks = pContext.request.parameters.reminder_weeks;
                    var builderPersonnelSelected = pContext.request.parameters.builder_personnel;
                    if (!reminderWeeks || (reminderWeeks && reminderWeeks == '')) {
                        // Update Personnel Data reminder
                        if (builderPersonnelSelected && builderPersonnelSelected != '') {
                            var optionSelected = pContext.request.parameters.optradio;
                            pContext.response.write(LeaveAsIsController.updateBuilderPersonnelDataReminder(encPropertyId, builderPersonnelSelected, optionSelected));
                        }
                        else {
                            // This lot has been sold
                            log.debug('LeaveAsIsRouter', JSON.stringify(pContext.request.files));
                            var result = LeaveAsIsController.handleThisLotHasBeenSold(pContext.request.parameters, pContext.request.files);
                            if (!result) {
                                pContext.response.write(LeaveAsIsController.getDefaultThankyouPage());
                            }
                            else {
                                pContext.response.write("An error has occurred saving the data : " + result.message);
                            }
                        }
                    }
                    else if (reminderWeeks && reminderWeeks != '') {
                        pContext.response.write(LeaveAsIsController.updateReminderDate(encPropertyId, reminderWeeks));
                    }
                }
            }
        }
        catch (e) {
            log.debug('Execution error', "Detail: " + JSON.stringify(e));
        }
    }
    exports.onRequest = onRequest;
});
