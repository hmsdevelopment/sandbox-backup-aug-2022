/**
 * @NAPIVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer Sergio Tijerino
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log"], function (require, exports, log) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Before Load Method */
    function beforeLoad(pContext) {
        try {
            log.debug("Start of beforeLoad", "Running");
            pContext.form.clientScriptModulePath = '../ClientScripts/SendEmailMethod.js';
            pContext.form.addButton({
                id: 'custpage_send_email',
                label: 'Send Notification Email',
                functionName: "sendEmail()"
            });
            log.debug("End of beforeLoad", "Success");
        }
        catch (error) {
            log.debug("Before Load Method - Error ", "Error : " + error);
        }
    }
    exports.beforeLoad = beforeLoad;
});
