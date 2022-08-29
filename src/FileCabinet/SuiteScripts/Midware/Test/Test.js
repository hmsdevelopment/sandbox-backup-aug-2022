/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Bryan Badilla
 * @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/error", "N/http", "N/search"], function (require, exports, log, error, http, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
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
            handleError(error);
        }
    }
    exports.onRequest = onRequest;
    function handleGet(pContext) {
        var key = "5347";
        var bsrEmails;
        var bsrInfo = search.lookupFields({ type: 'partner', id: key, columns: ['category', 'custentity_team_members', 'email', 'custentity_team_type'] });
        var name = search.lookupFields({ type: 'partner', id: '5244', columns: 'firstname' }).firstname;
        log.debug('bsrEmails', name);
        var teamType = bsrInfo.custentity_team_type.length > 0 ? bsrInfo.custentity_team_type[0].value : '';
        if (teamType == "6") {
            bsrEmails = bsrInfo.custentity_team_members.value.split(',');
        }
        else {
            bsrEmails = key;
        }
        log.debug('Recipients', bsrEmails);
    }
    // Functions Get Lines
    function getLines(pFileContent) {
        var lines = [];
        try {
            if (pFileContent) {
                pFileContent = pFileContent.replace(/\s\",/g, "\",");
                lines = pFileContent.split((/\r\n|\n/)).map(function (z) { return z.replace(/\r\n|\n|\r/g, ''); });
            }
        }
        catch (error) {
            log.error('getLines', error.message);
        }
        return lines;
    }
    function handlePost(pContext) {
    }
    function httpRequestError() {
        throw error.create({
            name: "MW_UNSUPPORTED_REQUEST_TYPE",
            message: "Suitelet only supports GET and POST",
            notifyOff: true,
        });
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
