/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/url", "N/runtime", "N/ui/serverWidget"], function (require, exports, log, url, runtime, serverWidget) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        try {
            var propertyId = pContext.newRecord.id;
            if (runtime.executionContext == runtime.ContextType.USER_INTERFACE && pContext.type == pContext.UserEventType.VIEW && propertyId) {
                var suiteletUrl = url.resolveScript({ scriptId: 'customscript_mw_listing_streamlined', deploymentId: 'customdeploy_mw_listing_streamlined_d', returnExternalUrl: false, params: { pid: propertyId, method: "FirstPage" } });
                //var newOption = `<tr><td id='mw_copy_sales_order' class='ac_text'><a class='ddmAnchor' href='javascript:window.open(${suiteletUrl},'_blanc', "width=960,height=720")'><span class='ac_text_pad'>Reassign Sales Counselor</span></a></td></tr>`;
                pContext.form.addField({ id: "custpage_mw_add_action", label: "Add Action", type: serverWidget.FieldType.INLINEHTML })
                    .defaultValue = "\n            <script>\n                jQuery( document ).ready(function() {\n\n                        setTimeout(addNewOptionSO, 1);\n\n                });\n\n                function addNewOptionSO(){\n                    let reader = jQuery(\"#div_ACTIONMENU_d1 > table > tbody > tr:first-child > td:first-child > table > tbody > tr:first-child\");\n\n                    if(reader.length > 0) {\n                        var option = '<tr><td id=\"mw_copy_sales_order\" class=\"ac_text\"><a class=\"ddmAnchor\" href=\"javascript:openLink()\"><span class=\"ac_text_pad\">New Listing Form</span></a></td></tr>';\n                        reader.after(option);\n                    }\n                    else setTimeout(addNewOptionSO, 100);\n                    \n                } \n                \n                function openLink() {\n                    window.open(\"" + suiteletUrl + "\",'_blanc', 'width=960,height=720');\n                }\n                \n            </script>\n            ";
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeLoad = beforeLoad;
    function beforeSubmit(pContext) {
        try {
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeSubmit = beforeSubmit;
    function afterSubmit(pContext) {
        try {
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.afterSubmit = afterSubmit;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
