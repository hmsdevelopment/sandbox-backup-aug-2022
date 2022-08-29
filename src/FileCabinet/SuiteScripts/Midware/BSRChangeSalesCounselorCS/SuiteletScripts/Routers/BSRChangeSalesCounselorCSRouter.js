/**
 * @NAPIVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer Reinaldo Stephens Chaves
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/https", "../Controllers/BSRChangeSalesCounselorCSController"], function (require, exports, log, https, BSRChangeSalesCounselorCSController) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Depending on the request chooses the correct function (GET or POST).
     * @param {EntryPoints.Suitelet.onRequestContext} pContext - SuiteletScript event.
     */
    function onRequest(pContext) {
        try {
            log.audit('OnRequest', 'Request received');
            var eventMap = {};
            eventMap[https.Method.GET] = handleGet;
            eventMap[https.Method.POST] = handlePost;
            eventMap[pContext.request.method]
                ? eventMap[pContext.request.method](pContext)
                : handleError();
        }
        catch (error) {
            pContext.response.write("Unexpected error. Detail: " + error.message);
            log.error('EXECUTION ERROR', "Detail: " + error);
        }
    }
    exports.onRequest = onRequest;
    /**
     * Handles the GET request. Displays the Reassign Sales Counselor Form.
     * @param {EntryPoints.Suitelet.onRequestContext} pContext - SuiteletScript event
     */
    function handleGet(pContext) {
        log.audit('GET request', 'Processing GET request');
        var appointmentId = pContext.request.parameters.apptid;
        var pId = pContext.request.parameters.pid;
        log.debug('Appointment Identifier', appointmentId);
        log.debug('Personnel Identifier', pId);
        if (appointmentId) {
            if (appointmentId.length < 10) {
                pContext.response.write(BSRChangeSalesCounselorCSController.getForm(appointmentId, pContext.request.parameters.p, pId));
            }
            else if (!Number(appointmentId)) {
                pContext.response.write('Invalid Appointment Identifier (It must be a number)');
            }
            else {
                pContext.response.write('Invalid Appointment Identifier');
            }
        }
        else {
            pContext.response.write('Not params were provided');
        }
    }
    /**
     * Handles the POST request. Handles the after submit action.
     * @param {EntryPoints.Suitelet.onRequestContext} pContext - SuiteletScript event
     */
    function handlePost(pContext) {
        log.audit('POST request', 'Processing POST request');
        var appointmentId = pContext.request.parameters.apptid;
        log.debug('POST params', pContext.request.parameters);
        if (appointmentId) {
            pContext.response.write(BSRChangeSalesCounselorCSController.submitForm(pContext.request.parameters));
        }
        else {
            pContext.response.write('Not params were provided');
        }
    }
    /**
     * Handles errors.
     */
    function handleError() {
        throw {
            name: 'UNSUPPORTED_REQUEST_TYPE',
            datails: 'This Suilet only supports GET and POST request',
        };
    }
});
