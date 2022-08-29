/**
 * @NAPIVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer David González
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/https", "N/redirect", "../../../Global/Constants", "../Controllers/ViewCategoryListController", "../../../Libraries/Midware/BuilderPortalLibrary"], function (require, exports, log, https, redirect, constants, viewCategoryListController, builderPortalLibrary) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
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
            pContext.response.write("Unexpected error. Detail: ".concat(error.datails));
            log.error('EXECUTION ERROR', "Detail: ".concat(JSON.stringify(error)));
        }
    }
    exports.onRequest = onRequest;
    function handleGet(pContext) {
        log.audit('GET request', 'Processing GET request');
        var method = pContext.request.parameters.method;
        var cookie = pContext.request.headers.cookie;
        if (!cookie) {
            redirect.toSuitelet({ scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: '1', isExternal: true, });
        }
        else {
            var cookieData = builderPortalLibrary.extractBuilderPortalCookie(cookie);
            if (!cookieData) {
                redirect.toSuitelet({
                    scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: '1', isExternal: true,
                });
            }
            else {
                var tokenIsValid = builderPortalLibrary.validatePartnerToken(cookieData.partnerid, cookieData.randomToken);
                if (!tokenIsValid) {
                    redirect.toSuitelet({ scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: '1', isExternal: true, });
                }
                else {
                    var partnerId = cookieData.partnerid;
                    var builderId = cookieData.builderid;
                    var recordType = pContext.request.parameters.recordType;
                    if (method == 'config') {
                        log.debug('Get Config', 'View');
                        pContext.response.write(viewCategoryListController.getPreferencesView(partnerId, recordType));
                    }
                    else {
                        pContext.response.write(viewCategoryListController.getListView(builderId, partnerId, recordType));
                    }
                }
            }
        }
    }
    function handlePost(pContext) {
        log.audit('POST request', 'Processing POST request');
        var cookie = pContext.request.headers.cookie;
        log.debug('Parameters', JSON.stringify(pContext.request.parameters));
        log.debug('Parameters preferences', pContext.request.parameters.preferencesfinal);
        if (!cookie) {
            throw {
                name: 'BP_COOKIE_NOT_PRESENT',
                datails: 'Request without cookie',
            };
        }
        else {
            var cookieData = builderPortalLibrary.extractBuilderPortalCookie(cookie);
            if (!cookieData) {
                throw {
                    name: 'BP_COOKIE_NOT_PRESENT',
                    datails: 'Request without cookie',
                };
            }
            else {
                // let tokenIsValid = builderPortalLibrary.validatePartnerToken(cookieData.partnerid, cookieData.randomToken);
                // if (!tokenIsValid)
                // {
                //     throw {
                //         name: 'TOKEN_EXPIRED',
                //         datails: 'User session token has expired'
                //     };
                // }
                // else
                // {
                var partnerId = cookieData.partnerid;
                var builderId = cookieData.builderid;
                var recordType = pContext.request.parameters.recordType;
                var preferences = pContext.request.parameters.preferencesfinal;
                viewCategoryListController.savePreaferences(partnerId, recordType, preferences);
                pContext.response.write(viewCategoryListController.getListView(builderId, partnerId, recordType));
                // }
            }
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
