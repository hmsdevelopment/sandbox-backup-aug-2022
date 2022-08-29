/**
* @NApiVersion 2.0
* @NScriptType ScheduledScript
* @NModuleScope SameAccount
* @author Midware
* @developer Francisco Alvarado Ferllini
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/search", "N/email", "N/file"], function (require, exports, log, search, email, file) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var FOLDER = 85119;
    function execute(pContext) {
        var newAppointments = { normal: [], linked: [] };
        try {
            //loadCSV and get it as a array
            var lastRunAppointments = loadLastRunAppointments();
            if (lastRunAppointments.length)
                log.debug("lastRunAppointments", lastRunAppointments);
            var lastHourAppointments = getLastHourAppointments(lastRunAppointments);
            // let lastHourAppointments = {"normal":["94994","94995"],"linked":{"4344": {"5054": ["94794"]}},"allLinked":["4344"],"allAppointments":["94994","94995","94794"]};
            if (lastHourAppointments.allAppointments)
                log.debug("lastHourAppointments", lastHourAppointments);
            if (lastHourAppointments.normal.length) {
                log.debug("lastHourAppointments.normal", lastHourAppointments.normal);
                var emailConfirmations_1 = getEmailValidation(lastHourAppointments.normal);
                log.debug("lastHourAppointments.normal emailConfirmations", emailConfirmations_1);
                var remaning = lastHourAppointments.normal.filter(function (element) { return !(emailConfirmations_1.indexOf(element) + 1); });
                newAppointments.normal = newAppointments.normal.concat(remaning);
            }
            if (lastHourAppointments.allLinked.length) {
                log.debug("lastHourAppointments.linked", lastHourAppointments.linked);
                completeLinkedCases(lastHourAppointments);
                log.debug("lastHourAppointments.allLinked completeLinkedCases", lastHourAppointments);
                var linkedKeys = Object.keys(lastHourAppointments.linked);
                for (var x = 0; x < linkedKeys.length; x++) {
                    var bsrKeys = Object.keys(lastHourAppointments.linked[linkedKeys[x]]);
                    for (var y = 0; y < bsrKeys.length; y++) {
                        var actualLinkedCases = lastHourAppointments.linked[linkedKeys[x]][bsrKeys[y]];
                        log.debug("lastHourAppointments.linked actualLinkedCases", actualLinkedCases);
                        var emailConfirmations = getEmailValidation(actualLinkedCases);
                        log.debug("lastHourAppointments.linked emailConfirmations", emailConfirmations);
                        if (!emailConfirmations.length)
                            newAppointments.linked.push(actualLinkedCases.join("/"));
                    }
                }
            }
            try {
                var newActualRunAppointments = file.create({
                    fileType: file.Type.JSON,
                    contents: JSON.stringify(lastHourAppointments.allAppointments),
                    folder: FOLDER, encoding: file.Encoding.UTF8,
                    name: "LasRunAppointments.json"
                }).save();
                log.debug("newActualRunAppointment File Id", newActualRunAppointments);
            }
            catch (error) {
                log.error("allApointmemts file creation", error.message);
            }
            if (newAppointments.normal.length || newAppointments.linked.length) {
                sendEmail(null, newAppointments);
            }
        }
        catch (pError) {
            handleError(pError);
        }
    }
    exports.execute = execute;
    function sendEmail(pFileId, pMissingAppointments) {
        var emailData = {
            author: 3847,
            recipients: ["francisco.alvarado@midware.net", "jmcdonald@hmsmarketingservices.com"],
            subject: "Appointments With Missing Emails",
            body: "These Appointments Are Missing the Creation Emails:  \n\n " + JSON.stringify(pMissingAppointments),
        };
        if (pFileId) {
            emailData["attachments"] = pFileId;
        }
        email.send(emailData);
    }
    function getLastHourAppointments(pLasRunAppointments) {
        var appointments = { normal: [], linked: {}, allLinked: [], allAppointments: [] };
        var actualDate = new Date();
        var actualDateMinutes = actualDate.getMinutes();
        var filters = [
            ["createddate", "within", "today"]
        ];
        if (pLasRunAppointments.length) {
            filters.push("AND");
            filters.push(["internalid", search.Operator.NONEOF, pLasRunAppointments]);
        }
        search.create({
            type: "supportcase",
            filters: filters,
            columns: [
                "internalid",
                "createddate",
                "custevent_linked_cases",
                "custevent_builder_sales_rep_subd",
                search.createColumn({ name: "createddate", label: "Date Created", function: "ageInHours" }),
            ]
        }).run().each(function (pRow) {
            var dateCreated = pRow.getValue({ name: "createddate" });
            var ageInhours = pRow.getValue({ name: "createddate", label: "Date Created", function: "ageInHours" });
            if (ageInhours && ageInhours.toString() == '0' && moreThen15Minutes(actualDateMinutes, dateCreated)) {
                var id = pRow.getValue({ name: "internalid" });
                var bsr = pRow.getValue({ name: "custevent_builder_sales_rep_subd" });
                var linkedcase = pRow.getValue({ name: "custevent_linked_cases" });
                if (linkedcase && bsr) {
                    if (!(appointments.allLinked.indexOf(linkedcase.toString()) + 1)) {
                        appointments.allLinked.push(linkedcase.toString());
                        appointments.linked[linkedcase.toString()][bsr.toString()] = [];
                    }
                    appointments.linked[linkedcase.toString()][bsr.toString()].push(id);
                }
                else {
                    appointments.normal.push(id);
                }
                appointments.allAppointments.push(id);
            }
            return true;
        });
        return appointments;
    }
    function completeLinkedCases(pData) {
        if (pData && pData.allLinked && pData.allAppointments) {
            search.create({
                type: "supportcase",
                filters: [
                    ["internalid", search.Operator.NONEOF, pData.allAppointments],
                    "AND",
                    ["custevent_linked_cases", "anyof", pData.allLinked]
                ],
                columns: [
                    "internalid",
                    "custevent_linked_cases",
                    "custevent_builder_sales_rep_subd",
                ]
            }).run().each(function (pRow) {
                var id = pRow.getValue({ name: "internalid" });
                var bsr = pRow.getValue({ name: "custevent_builder_sales_rep_subd" });
                var linkedcase = pRow.getValue({ name: "custevent_linked_cases" });
                if (linkedcase && bsr) {
                    if (!pData.linked[linkedcase.toString()][bsr.toString()]) {
                        pData.linked[linkedcase.toString()][bsr.toString()] = [];
                    }
                    pData.linked[linkedcase.toString()][bsr.toString()].push(id);
                    pData.allAppointments.push(id);
                }
                return true;
            });
        }
    }
    function moreThen15Minutes(pActualDateMinutes, pDateCreated) {
        // log.debug("moreThen15Minutes pDateCreated", pDateCreated);
        var result = false;
        try {
            if (pActualDateMinutes && pDateCreated) {
                var dateCreated = new Date(pDateCreated);
                var dateCreatedMinutes = dateCreated ? dateCreated.getMinutes() : null;
                if (dateCreatedMinutes) {
                    result = pActualDateMinutes > dateCreatedMinutes ? pActualDateMinutes - dateCreatedMinutes > 15 :
                        pActualDateMinutes < dateCreatedMinutes ? pActualDateMinutes - dateCreatedMinutes + 60 > 15 : false;
                }
            }
        }
        catch (error) {
            log.error("moreThen15Minutes", error.message);
        }
        return result;
    }
    function getEmailValidation(pAppointments) {
        var appoimentsWithEmail = [];
        if (pAppointments) {
            search.create({
                type: "message",
                filters: [
                    ["case.internalid", "anyof", pAppointments],
                    "AND",
                    ["subject", "contains", "New Inquiry"]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid",
                        join: "case",
                        summary: search.Summary.GROUP,
                        sort: search.Sort.ASC
                    })
                ]
            }).run().each(function (pRow) {
                var appintmentId = pRow.getValue({
                    name: "internalid",
                    join: "case",
                    summary: search.Summary.GROUP,
                    sort: search.Sort.ASC
                });
                appoimentsWithEmail.push(appintmentId);
                return true;
            });
        }
        return appoimentsWithEmail;
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
    function loadLastRunAppointments() {
        var contents = [];
        try {
            var lastRunFile = file.load({ id: 'SuiteScripts/Midware/NewAppointmentEmailIssueNotifier/LastRunAppointments/LasRunAppointments.json' });
            if (lastRunFile) {
                var fileContents = lastRunFile.getContents();
                if (fileContents)
                    contents = contents.concat(JSON.parse(fileContents));
            }
        }
        catch (error) {
            log.error("loadLastRunAppointments", error.message);
        }
        return contents;
    }
});
