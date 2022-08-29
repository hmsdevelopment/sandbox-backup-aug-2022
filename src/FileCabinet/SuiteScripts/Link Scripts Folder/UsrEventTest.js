/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/url", "N/record", "N/runtime", "N/ui/serverWidget"],
    
    (url, record, runtime,serverWidget) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            log.audit({
                title: "User Event",
                details: "before Load"
            })
            var currentForm = scriptContext.form;
            currentForm.clientScriptFileId = 598083;

            var record = scriptContext.newRecord;
            log.debug({
                title: "Logging Script Context New Rec",
                details: record
            })

            currentForm.addButton({
                id:'custpage_clientscrpt_trigger',
                label: 'Trigger ClientScript',
                functionName: 'TriggeredClient()'
            })
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            log.audit({
                title: "User Event",
                details: "Before Submit"
            })
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            log.audit({
                title: "User Event",
                details: "after Submit"
            })
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
