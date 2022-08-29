/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Arturo Padilla
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "../Controllers/GhostListingRelocateController"], function (require, exports, log, GhostListingRelocateController) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function onRequest(pContext) {
        try {
            log.debug('Router', 'Start Router');
            //Execute GET
            if (pContext.request.method === 'GET') {
                log.debug('Router', 'GET request');
                var propertyId = pContext.request.parameters.propertyid;
                if (propertyId != '' && propertyId != null && propertyId != undefined) {
                    // Get HTML view of form
                    var form = GhostListingRelocateController.getForm(propertyId);
                    pContext.response.write(form);
                }
            }
            //Execute POST
            else if (pContext.request.method === 'POST') {
                log.debug('Router', 'POST request');
                log.debug('Router Request Headers', JSON.stringify(pContext.request.headers));
                // Get HTML to return as response after submit
                var relocationResult = GhostListingRelocateController.handleRelocation(pContext.request.parameters);
                if (!relocationResult) { //undefined means no errors
                    var responseView = GhostListingRelocateController.afterSubmitView();
                    pContext.response.write(responseView);
                }
                else {
                    pContext.response.write("An error has occurred saving the data : " + relocationResult.message);
                }
            }
        }
        catch (e) {
            log.debug('Execution error', "Detail: " + e);
        }
    }
    exports.onRequest = onRequest;
});
