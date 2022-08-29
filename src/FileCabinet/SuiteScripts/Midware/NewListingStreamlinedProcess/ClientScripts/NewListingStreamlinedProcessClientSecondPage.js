/**
* @NApiVersion 2.0
* @NScriptType ClientScript
* @NModuleScope SameAccount
* @author Midware
* @developer Francisco Alvarado Ferllini
* @contact contact@midware.net
*/
define(["require", "exports", "N/log", "N/url", "N/https", "N/ui/message", "../Constants/Constants"], function (require, exports, log, url, https, message, constants) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function pageInit(pContext) {
        try {
            pContext.currentRecord.setValue({ fieldId: constants.PAGES.SECOND_PAGE.FORM_FIELDS.PROCESSING.ID, value: null });
            window.onbeforeunload = function () {
                var status = document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.PROCESSING.ID);
                if (status.value) {
                    return "Are you sure you want to leave?";
                }
            };
            var actualSelectedValues = pContext.currentRecord.getValue({ fieldId: constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID }).toString();
            if (!actualSelectedValues)
                pContext.currentRecord.setValue({ fieldId: constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID, value: JSON.stringify([]) });
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.pageInit = pageInit;
    function fieldChanged(pContext) {
        try {
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.fieldChanged = fieldChanged;
    function secondPageSaveButton(pPropertyId, pScriptId, pDeploymentId) {
        console.log("Enters secondPageSaveButton");
        document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.PROCESSING.ID).value = 'Procesing';
        var processingMessage = message.create({ title: "Procesing ...", message: "Files are Being Uploaded.", type: message.Type.INFORMATION });
        try {
            var valuesField = document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID);
            var values = valuesField ? valuesField.value : JSON.stringify({});
            var fileList_1 = JSON.parse(values);
            var fileListLength_1 = fileList_1.length;
            if (!fileListLength_1) {
                goToProperty(pPropertyId);
            }
            else {
                processingMessage.show();
                var filesUploades_1 = 0;
                var filesFail_1 = 0;
                var percentageIndex_1 = 0;
                var _loop_1 = function (x) {
                    var body = {};
                    body["files"] = [fileList_1[x]];
                    var status_1 = fileList_1[x].send;
                    if (status_1) {
                        filesUploades_1++;
                        percentageIndex_1++;
                        console.log("Do not processed : " + fileList_1[x].name);
                        colorLiElement(fileList_1[x].name, '#4CAF50');
                        if (filesUploades_1 == fileListLength_1) {
                            processingMessage.hide();
                            goToProperty(pPropertyId);
                        }
                    }
                    else {
                        var ProcessRecordURl = url.resolveScript({ scriptId: pScriptId, deploymentId: pDeploymentId, params: {
                                method: constants.METHODS.UPLOAD_FILES,
                                pid: pPropertyId
                            } });
                        https.post.promise({ url: ProcessRecordURl, body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }).then(function (pResult) {
                            var bodyJson = JSON.parse(pResult.body);
                            if (!bodyJson.status) {
                                filesUploades_1++;
                                percentageIndex_1++;
                                document.getElementById('processCount').innerText = filesUploades_1 + "/" + fileListLength_1;
                                document.getElementById("myBar").style.width = (percentageIndex_1) * (100 / fileListLength_1) + "%";
                                var actualFilesRaw = document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID).value;
                                var actualFiles = JSON.parse(actualFilesRaw);
                                actualFiles[x].send = true;
                                document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID).value = JSON.stringify(actualFiles);
                                colorLiElement(fileList_1[x].name, '#4CAF50');
                                if (filesUploades_1 == fileListLength_1) {
                                    processingMessage.hide();
                                    goToProperty(pPropertyId);
                                }
                            }
                            else {
                                filesFail_1++;
                                colorLiElement(fileList_1[x].name, "red");
                                jQuery("#tbl_" + constants.PAGES.SECOND_PAGE.FORM_BUTTOMS.PROPERTY.ID).closest('td').show();
                                if ((filesUploades_1 + filesFail_1) == fileListLength_1) {
                                    processingMessage.hide();
                                    document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.PROCESSING.ID).value = null;
                                }
                                var messages = bodyJson.message;
                                for (var x_1 = 0; x_1 < messages.length; x_1++) {
                                    message.create({ title: "FAILURE", message: "Process Finished with Errors : " + messages[x_1], type: message.Type.ERROR }).show({ duration: 6000 });
                                }
                            }
                        }).catch(function (pError) {
                            filesFail_1++;
                            if ((filesUploades_1 + filesFail_1) == fileListLength_1) {
                                processingMessage.hide();
                                document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.PROCESSING.ID).value = null;
                            }
                            colorLiElement(fileList_1[x].name, "red");
                            jQuery("#tbl_" + constants.PAGES.SECOND_PAGE.FORM_BUTTOMS.PROPERTY.ID).closest('td').show();
                            document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.PROCESSING.ID).value = null;
                            message.create({ title: "FAILURE", message: "Process Finished with Errors : " + JSON.stringify(pError), type: message.Type.ERROR }).show({ duration: 6000 });
                            console.log("Request finished with errores: " + JSON.stringify(pError));
                        });
                    }
                };
                for (var x = 0; x < fileList_1.length; x++) {
                    _loop_1(x);
                }
            }
        }
        catch (pError) {
            processingMessage.hide();
            handleError(pError);
            document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.PROCESSING.ID).value = null;
        }
    }
    exports.secondPageSaveButton = secondPageSaveButton;
    function colorLiElement(pName, pColor) {
        var liElement = document.getElementById(pName).closest("li");
        if (liElement) {
            liElement.style["color"] = pColor;
            liElement.style["font-weight"] = 'bold';
        }
    }
    function getBase64Result(pFile) {
        var reader = new FileReader();
        return new Promise(function (resolve, reject) {
            reader.onload = function () {
                var base64 = this.result;
                if (base64) {
                    console.log("good to go");
                    resolve({ name: pFile.name, base64: base64, send: false });
                }
                else
                    reject();
            };
            reader.readAsDataURL(pFile);
        });
    }
    function addFiles() {
        var uploadfiles = document.querySelector('[name="fileinput"]');
        var ul = document.querySelector('#listing');
        uploadfiles.addEventListener('change', function () {
            var files = this.files;
            var fileList = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (checkFile(file.name)) {
                    var size = file.size;
                    if (size > 0) {
                        if (size < 10240000) {
                            ul.innerHTML += "<li class= \"myli\" >" + file.name + "<span class=\"del\" id='" + file.name + "'>&times;</span></li>";
                            fileList.push(file);
                        }
                        else {
                            alert("The file " + file.name + " Size is Over 10 MB.");
                        }
                    }
                    else {
                        alert("The file " + file.name + " Has no Content.");
                    }
                }
            }
            processReceivedFiles(fileList);
            document.getElementById('fileinput').value = null;
        });
        jQuery(document).on('click', '.del', function () {
            var fileName = this.id;
            var liElement = this.closest("li");
            var actualFilesRaw = document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID).value;
            var actualFiles = JSON.parse(actualFilesRaw);
            for (var i = 0; i < actualFiles.length; i++) {
                var file = actualFiles[i];
                if (file.name == fileName) {
                    actualFiles.splice(i, 1);
                    ul.removeChild(liElement);
                    break;
                }
            }
            document.getElementById('processCount').innerText = "0/" + actualFiles.length;
            document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID).value = JSON.stringify(actualFiles);
        });
    }
    exports.addFiles = addFiles;
    function addFilesTest() {
        var uploadfiles = document.querySelector('[name="fileinput"]');
        var ul = document.querySelector('#listing');
        uploadfiles.addEventListener('change', function () {
            var files = this.files;
            var fileList = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (checkFile(file.name)) {
                    var size = file.size;
                    if (size > 0) {
                        if (size < 10240000) {
                            ul.innerHTML += "<li class= \"myli\" >" + file.name + "<span class=\"del\" id='" + file.name + "'>&times;</span></li>";
                            fileList.push(file);
                        }
                        else {
                            alert("The file " + file.name + " Size is Over 10 MB.");
                        }
                    }
                    else {
                        alert("The file " + file.name + " Has no Content.");
                    }
                }
            }
            // processReceivedFiles(fileList);
            processReceivedZipFiles(fileList);
            document.getElementById('fileinput').value = null;
        });
        jQuery(document).on('click', '.del', function () {
            var fileName = this.id;
            var liElement = this.closest("li");
            var actualFilesRaw = document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID).value;
            var actualFiles = JSON.parse(actualFilesRaw);
            for (var i = 0; i < actualFiles.length; i++) {
                var file = actualFiles[i];
                if (file.name == fileName) {
                    actualFiles.splice(i, 1);
                    ul.removeChild(liElement);
                    break;
                }
            }
            document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID).value = JSON.stringify(actualFiles);
        });
    }
    exports.addFilesTest = addFilesTest;
    function processReceivedFiles(pFiles) {
        var actualFilesRaw = document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID).value;
        var actualFiles = JSON.parse(actualFilesRaw);
        sleep(100).then(function () {
            function serialPromises(files) {
                return files.reduce(function (promise, file) {
                    return promise
                        .then(function (result) {
                        return getBase64Result(file)
                            .then(function (result) {
                            actualFiles.push(result);
                        });
                    })
                        .catch(function (error) {
                        console.log(error);
                    });
                }, Promise.resolve());
            }
            serialPromises(pFiles).then(function () {
                document.getElementById('processCount').innerText = "0/" + actualFiles.length;
                document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID).value = JSON.stringify(actualFiles);
            });
        });
    }
    ;
    function processReceivedZipFiles(pFiles) {
        console.log("la shit si entra");
        var zipReader = new JSZip();
        zipReader.loadAsync(pFiles[0]).then(function (zip) {
            zip.forEach(function (relativePath, zipEntry) {
                zipEntry.async("base64")
                    .then(function success(content) {
                    console.log(zipEntry);
                    // console.log(content);
                }, function error(e) {
                    console.log(e);
                });
            });
        }, function (e) {
            console.log(e);
        });
    }
    var sleep = function (milliseconds) {
        return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
    };
    function checkFile(pFileName) {
        var actualFilesRaw = document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.SELECTED_FILES.ID).value;
        var actualFiles = JSON.parse(actualFilesRaw);
        for (var x = 0; x < actualFiles.length; x++) {
            if (actualFiles[x].name == pFileName)
                return false;
        }
        return true;
    }
    function goToProperty(pPropertyId) {
        document.getElementById(constants.PAGES.SECOND_PAGE.FORM_FIELDS.PROCESSING.ID).value = null;
        var propertyURL = url.resolveRecord({ recordType: constants.RECORDS.PROPERTY_RECORD.ID, recordId: pPropertyId });
        location.href = propertyURL;
    }
    exports.goToProperty = goToProperty;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
        console.log(pError.message);
    }
});
