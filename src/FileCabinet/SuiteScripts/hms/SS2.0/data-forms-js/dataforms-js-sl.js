/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType Suitelet
 */
define(["require", "exports", "N/ui/serverWidget", "./html"], function (require, exports, serverWidget, html_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(context) {
        const form = serverWidget.createForm({
            title: "Test HTML"
        });
        form.addField({
            id: "custpage_label",
            label: "Label",
            type: serverWidget.FieldType.TEXT
        }).defaultValue = "Test";
        form.addField({
            id: "custpage_html",
            label: "html",
            type: serverWidget.FieldType.INLINEHTML
        }).defaultValue = html_1.html;
        context.response.write(html_1.html);
        return { onRequest };
    }
    exports.onRequest = onRequest;
});
