/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Fenanda Carmona
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/ui/serverWidget", "../Global/Constants"], function (require, exports, log, serverWidget, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function beforeLoad(pContext) {
        try {
            log.debug("Script init", pContext.newRecord.id);
            // Add button to search agents
            var agentInlineHtml = pContext.form.addField({ id: "custpage_mw_agent_inlinehtml", type: serverWidget.FieldType.INLINEHTML, label: "agent inline html" });
            agentInlineHtml.defaultValue = "<script> \n            jQuery(\"#" + constants.NS_FORM_FIELDS.AGENT + "\").after('<span id=\"search-agent\"> <a id=\"" + constants.SEARCH_BUTTONS.AGENT + "\" tabindex=\"-1\"><img src=\"/uirefresh/img/find.png\" title=\"Search Agent\" alt=\"Search Agent\"></a></span>');\n            </script>";
            // Add button search properties
            var propertyInlineHtml = pContext.form.addField({ id: "custpage_mw_property_inlinehtml", type: serverWidget.FieldType.INLINEHTML, label: "Property inline html" });
            propertyInlineHtml.defaultValue = "<script> \n             jQuery(\"#" + constants.NS_FORM_FIELDS.PROPERTY + "\").after('<span id=\"search-property\"> <a id=\"" + constants.SEARCH_BUTTONS.PROPERTY + "\" tabindex=\"-1\"><img src=\"/uirefresh/img/find.png\" title=\"Search Property\" alt=\"Search Property\"></a></span>');\n             </script>";
        }
        catch (e) {
            log.error("Execution Error", "Detail " + e);
        }
    }
    exports.beforeLoad = beforeLoad;
});
