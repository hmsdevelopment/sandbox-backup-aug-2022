/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget'],

    function(serverWidget) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type
         * @param {Form} scriptContext.form - Current form
         * @Since 2015.2
         */
        function beforeLoad(scriptContext) {
            var form = scriptContext.form;
            var fldCustomHelp = form.addField({
                id:'custpage_dynamic_help',
                label:'Internal Help',
                type: serverWidget.FieldType.INLINEHTML,
            });

            var divHTML = getHelpHTML();

            fldCustomHelp.defaultValue = divHTML;

        }

        function getHelpHTML() {
            // var html = '<html><body>' +
            //     '<div id="customHelp">' +
            //     'This is my custom help box!' +
            //     '</div>' +
            //     '</body>';

            var html='<html>' +
                '    <style>' +
                '        #dh_container {' +
                '        margin-left: 20px;' +
                '        max-width: 300px;' +
                '    }' +
                '    #dh_header {' +
                '        padding: 5px 5px;' +
                '        background: #01723a;' +
                '        font-size: 13px;' +
                '        color: white;' +
                '        border-bottom: 5px solid #D4AF37;' +
                '    }' +
                '    #dh_help_text {' +
                '        padding: 15px;' +
                '        background-color: #f1f1f1;' +
                '        color: #212529' +
                '    }</style>' +
                '<body>' +
                '<div id="dh_container">' +
                '    <div id="dh_header">Header Message</div>' +
                '    <div id="dh_help_text">Body Message</div>' +
                '</div>' +
                '</body>' +
                '</html>'

            return html;
        }

        return {
            beforeLoad: beforeLoad,
        };

    });
