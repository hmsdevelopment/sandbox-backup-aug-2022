/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["require", "exports", "N/https"], function (require, exports, https) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.afterSubmit = void 0;
    /**
     * Defines the function definition that is executed after record is submitted.
     * @param {Object} pContext
     * @param {Record} pContext.newRecord - New record
     * @param {Record} pContext.oldRecord - Old record
     * @param {string} pContext.type - Trigger type; use values from the context.UserEventType enum
     * @since 2015.2
     */
    function afterSubmit(pContext) {
        const topLevelBuilderName = 'Test UE Script Top Level Builder';
        const builderDivisionName = 'Test UE Script Builder Division';
        const subDivisionName = 'Test UE Script Subdivision';
        const propertyName = 'Test UE Script Property';
        const currentUserName = 'Test User';
        const files = [
            '01HKSWNJQL73LENCBLXNCZ52GHEEZODVXK',
            '01HKSWNJWNTGDP3EDIJNHYCZNHFQ6A7INN',
            '01HKSWNJQNEDSXBFYC3BBZLYSQ7OXLUTVO',
            '01HKSWNJUCFDG5RAL5M5AKVQT7O2YNS3AQ',
            '01HKSWNJSHPPYELUWBKBBZR6C34X6TFSJW',
        ];
        const body = {
            Top: topLevelBuilderName,
            Builder: builderDivisionName,
            SubDiv: subDivisionName,
            Prop: propertyName,
            UserName: currentUserName,
            files: files
        };
        const options = {
            url: 'https://hmstesting.eastus.cloudapp.azure.com/NetTool',
            headers: { 'status': '200', 'content-type': 'application/json' },
            body: body,
        };
        const updateFolders = https.post(options);
    }
    exports.afterSubmit = afterSubmit;
});
