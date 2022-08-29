/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
* @NModuleScope SameAccount
* @author Midware
* @developer Bryan Badilla
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/search", "N/email", "../Constants/Constants"], function (require, exports, log, search, email, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function execute(pContext) {
        try {
            var cases_1 = [];
            var supportcaseSearchObj = search.create({
                type: "supportcase",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custevent_showing_date_scheduled", "onorafter", "today"],
                    "AND",
                    ["formulatext: {custevent_linked_cases}", "isnotempty", ""],
                    "AND",
                    ["formulatext: {custevent_property}", "isempty", ""]
                ],
                columns: [
                    "internalid"
                ]
            });
            var searchResultCount = supportcaseSearchObj.runPaged().count;
            log.debug("supportcaseSearchObj result count", searchResultCount);
            supportcaseSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                cases_1.push(result.id);
                return true;
            });
            if (cases_1.length > 0) {
                log.debug('Cases', cases_1);
                var list = '<ul>';
                log.debug('List', list);
                for (var i = 0; i < cases_1.length; i++) {
                    list += /*html*/ "<li><a href=\"" + constants.URL_APPOINTMENTS + "id=" + cases_1[i] + "\">" + cases_1[i] + "</a></li>";
                    log.debug('List', list);
                }
                list += '</ul>';
                var message = "These are the cases that are reported with problems and the email has not been sent:</br>";
                log.debug('List', list);
                email.send({
                    author: 3847,
                    recipients: ['jmcdonald@hmsmarketingservices.com', 'bryan.badilla@midware.net'],
                    subject: 'Problem Cases - Bad Cancel Action',
                    body: message + list,
                    relatedRecords: { entityId: 3847 }
                });
                log.debug('Email Sent!', 'Email Sent!');
            }
            else {
                log.debug('No cases', 'No cases'); // to test
            }
        }
        catch (pError) {
            handleError(pError);
        }
    }
    exports.execute = execute;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
