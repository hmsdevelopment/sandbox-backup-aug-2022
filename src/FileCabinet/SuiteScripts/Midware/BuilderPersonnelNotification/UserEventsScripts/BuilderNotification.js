/**
 * @NAPIVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @author Midware
 * @Website www.midware.net
 * @Developer Sergio Tijerino
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "N/ui/serverWidget"], function (require, exports, log, serverWidget) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Page Init Method */
    function beforeLoad(pContext) {
        try {
            log.debug("BeforeLoad", 'Starting Function');
            var record = pContext.newRecord;
            var recordId = record.id;
            var listingType = record.getValue('custrecord_listing_type');
            var salesStatus = record.getValue('custrecord_property_status');
            var builderToBeNotified = record.getValue('custrecord_mw_builder_personnel_notified');
            log.debug("BeforeLoad", "Record ID: " + recordId);
            log.debug("BeforeLoad", "Listing Type: " + listingType);
            log.debug("BeforeLoad", "Sales Status: " + salesStatus);
            log.debug("BeforeLoad", "Builder to be Notified: " + builderToBeNotified);
            //  'Ghost Listing' == 2    'Awaiting Entry in MLS' == 6
            if (9370 == recordId &&
                2 == listingType &&
                6 != salesStatus &&
                '' == builderToBeNotified) {
                log.debug("BeforeLoad", "Warning should be displayed");
                pContext.form.clientScriptModulePath = '../ClientScripts/ShowBuilderNotification.js';
                pContext.form.addField({ id: "custpage_show_message_builder", label: "null", type: serverWidget.FieldType.INLINEHTML })
                    .defaultValue = "<script>jQuery(function($){ require(['/SuiteScripts/Midware/BuilderPersonnelNotification/ClientScripts/ShowBuilderNotification.js'], function(pResult){pResult.showMessage();});});</script>";
            }
        }
        catch (e) {
            log.debug("BeforeLoad - ERROR", "ERROR: " + e);
        }
    }
    exports.beforeLoad = beforeLoad;
});
