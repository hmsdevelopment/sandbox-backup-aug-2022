/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @developer Fernanda Carmona
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/file", "N/redirect", "../Controllers/SubmitClosingInformationController", "../../../Libraries/Midware/BuilderPortalLibrary", "../../../Global/Constants"], function (require, exports, log, file, redirect, SubmitClosingInformationController, builderPortalLibrary, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(pContext) {
        try {
            log.debug("Router", "Start Router");
            var view = "";
            if (pContext.request.method === "GET") {
                log.debug("Router", "GET request");
                log.debug("GET debug", JSON.stringify(pContext.request.headers));
                if (pContext.request.parameters.propertyIdForDetails) {
                    log.debug("GET", "Getting Property Closing Details");
                    try {
                        var propertyValues = SubmitClosingInformationController.getPropertyClosingDetails(pContext.request.parameters.propertyIdForDetails);
                        log.debug("Property Values", JSON.stringify(propertyValues));
                        pContext.response.writeLine({ output: JSON.stringify(propertyValues) });
                    }
                    catch (e) {
                        var errorBody = "{\"id\" : -1, \"message\": \"This suilet only supports GET request.\"}";
                        pContext.response.writeLine({ output: errorBody });
                    }
                }
                else if (pContext.request.parameters.propertyid) {
                    file.create({
                        name: "submitClosingGetRequest.json",
                        folder: 39166,
                        contents: JSON.stringify(pContext.request, null, 2),
                        fileType: file.Type.JSON,
                    }).save();
                    pContext.response.write(SubmitClosingInformationController.getView(pContext.request.parameters, {}, pContext.request.files, pContext.request.method));
                }
                else {
                    var cookieData = builderPortalLibrary.ValidateCookies(pContext.request.headers.cookie);
                    if (cookieData != null) {
                        file.create({
                            name: "submitClosingGetRequest.json",
                            folder: 39166,
                            contents: JSON.stringify(pContext.request, null, 2),
                            fileType: file.Type.JSON,
                        }).save();
                        pContext.response.write(SubmitClosingInformationController.getView(pContext.request.parameters, cookieData, pContext.request.files, pContext.request.method));
                    }
                    else
                        redirect.toSuitelet({ scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: "1", isExternal: true });
                }
            }
            if (pContext.request.method === "POST") {
                log.debug("Router", "POST request");
                //log.debug("post debug", Object.keys(pContext.request.files));
                log.debug("POST debug", JSON.stringify(pContext.request.headers));
                //log.debug("POST debug", JSON.stringify(pContext.request));
                log.debug("POST debug", JSON.stringify(pContext.request.body, null, 2));
                //throw ':D';
                if (pContext.request.parameters.propertyid) {
                    file.create({ name: 'submitClosing.json', folder: 30803, contents: JSON.stringify(pContext.request), fileType: file.Type.JSON }).save();
                    pContext.response.write(SubmitClosingInformationController.getView(pContext.request.parameters, {}, pContext.request.files, pContext.request.method));
                }
                else {
                    var cookieData = builderPortalLibrary.ValidateCookies(pContext.request.headers.cookie);
                    if (cookieData != null) {
                        file.create({ name: 'submitClosing.json', folder: 30803, contents: JSON.stringify(pContext.request), fileType: file.Type.JSON }).save();
                        pContext.response.write(SubmitClosingInformationController.getView(pContext.request.parameters, cookieData, pContext.request.files, pContext.request.method));
                    }
                    else
                        redirect.toSuitelet({ scriptId: constants.PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.SCRIPT_ID, deploymentId: "1", isExternal: true });
                }
            }
        }
        catch (e) {
            log.error("Error", e.message);
        }
    }
    exports.onRequest = onRequest;
});
