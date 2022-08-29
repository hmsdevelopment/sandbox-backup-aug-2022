/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define(["require", "exports", "N/file", "N/log", "N/query", "N/render", "N/runtime", "N/ui/serverWidget", "N/url"], function (require, exports, file, log, query, render, runtime, serverWidget, url) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    var datatablesEnabled = true, remoteLibraryEnabled = true, rowsReturnedDefault = 25, queryFolderID = 165297, toolUpgradesEnabled = true, workbooksEnabled = false;
    var page, scriptURL, version = "2021.2";
    /* function main( fileModule, httpsModule, logModule, messageModule, queryModule, recordModule, renderModule, runtimeModule, serverWidgetModule, urlModule ) {
    
        file = fileModule;
        https = httpsModule;
        log = logModule;
        message = messageModule;
        query= queryModule;
        record = recordModule;
        render = renderModule;
        runtime = runtimeModule;
        serverWidget = serverWidgetModule;
        url = urlModule; */
    //  return {
    function onRequest(context) {
        scriptURL = url.resolveScript({
            scriptId: runtime.getCurrentScript().id,
            deploymentId: runtime.getCurrentScript().deploymentId,
            returnExternalUrl: false,
        });
        if (context.request.method == "POST") {
            postRequestHandle(context);
        }
        else {
            getRequestHandle(context);
        }
    }
    exports.onRequest = onRequest;
    //}
    //}
    function documentGenerate(context) {
        try {
            var sessionScope = runtime.getCurrentSession();
            var docInfo = JSON.parse(sessionScope.get({ name: "suiteQLDocumentInfo" }));
            var moreRecords = true;
            var paginatedRowBegin = docInfo.rowBegin;
            var paginatedRowEnd = docInfo.rowEnd;
            var queryParams = new Array();
            var records = new Array();
            do {
                var paginatedSQL = "SELECT * FROM ( SELECT ROWNUM AS ROWNUMBER, * FROM (" +
                    docInfo.query +
                    " ) ) WHERE ( ROWNUMBER BETWEEN " +
                    paginatedRowBegin +
                    " AND " +
                    paginatedRowEnd +
                    ")";
                var queryResults = query.runSuiteQL({ query: paginatedSQL, params: queryParams }).asMappedResults();
                records = records.concat(queryResults);
                if (queryResults.length < 5000) {
                    moreRecords = false;
                }
                paginatedRowBegin = paginatedRowBegin + 5000;
            } while (moreRecords);
            var recordsDataSource = { records: records };
            var renderer = render.create();
            renderer.addCustomDataSource({ alias: "results", format: render.DataSource.OBJECT, data: recordsDataSource });
            renderer.templateContent = docInfo.template;
            if (docInfo.docType == "pdf") {
                var renderObj = renderer.renderAsPdf();
                var pdfString = renderObj.getContents();
                context.response.setHeader("Content-Type", "application/pdf");
                context.response.write(pdfString);
            }
            else {
                var htmlString = renderer.renderAsString();
                context.response.setHeader("Content-Type", "text/html");
                context.response.write(htmlString);
            }
        }
        catch (e) {
            log.error({ title: "documentGenerate Error", details: e });
            context.response.write("Error: " + e);
        }
    }
    function documentSubmit(context, requestPayload) {
        try {
            var responsePayload;
            var sessionScope = runtime.getCurrentSession();
            sessionScope.set({ name: "suiteQLDocumentInfo", value: JSON.stringify(requestPayload) });
            responsePayload = { submitted: true };
        }
        catch (e) {
            log.error({ title: "queryExecute Error", details: e });
            responsePayload = { error: e };
        }
        context.response.write(JSON.stringify(responsePayload, null, 5));
    }
    function getRequestHandle(context) {
        if (context.request.parameters.hasOwnProperty("function")) {
            if (context.request.parameters["function"] == "tablesReference") {
                htmlGenerateTablesReference(context);
            }
            if (context.request.parameters["function"] == "documentGenerate") {
                documentGenerate(context);
            }
        }
        else {
            var form = serverWidget.createForm({ title: "SuiteQL Query Tool", hideNavBar: false });
            var htmlField = form.addField({
                id: "custpage_field_html",
                type: serverWidget.FieldType.INLINEHTML,
                label: "HTML",
            });
            htmlField.defaultValue = htmlGenerateTool();
            context.response.writePage(form);
        }
    }
    function htmlDataTablesFormatOption() {
        if (datatablesEnabled === true) {
            return "\n\t\t\t<div class=\"form-check-inline\">\n\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t<input type=\"radio\" class=\"form-check-input\" name=\"resultsFormat\" value=\"datatable\" onChange=\"responseGenerate();\">DataTable\n\t\t\t\t</label>\n\t\t\t</div>\t\t\t\n \t\t";
        }
        else {
            return "";
        }
    }
    function htmlEnableViewsOption() {
        if (queryFolderID !== null) {
            return "\n\t\t\t<div style=\"margin-top: 12px; border-top: 1px solid #eee; padding-top: 12px;\">\n\t\t\t\t<div class=\"form-check\" style=\"margin-top: 6px;\">\n\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t<input type=\"checkbox\" class=\"form-check-input\" id=\"enableViews\" checked>Enable Virtual Views\n\t\t\t\t\t</label>\n\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t</div>\t\n\t\t";
        }
        else {
            return "";
        }
    }
    function htmlGenerateTablesReference(context) {
        var form = serverWidget.createForm({ title: "SuiteQL Tables Reference", hideNavBar: false });
        var htmlField = form.addField({
            id: "custpage_field_html",
            type: serverWidget.FieldType.INLINEHTML,
            label: "HTML",
        });
        htmlField.defaultValue = "\n\t\n\t\t<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css\">\n\t\t<script src=\"/ui/jquery/jquery-3.5.1.min.js\"></script>\n\t\t<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js\"></script>\n\t\t" + jsFunctionDataTablesExternals() + "\t\t\n\t\t\n\t\t<style type = \"text/css\"> \n\t\t\n\t\t\tinput[type=\"text\"], input[type=\"search\"], textarea, button {\n\t\t\t\toutline: none;\n\t\t\t\tbox-shadow:none !important;\n\t\t\t\tborder: 1px solid #ccc !important;\n\t\t\t}\n\t\t\t\n\t\t\tp, pre {\n\t\t\t\tfont-size: 10pt;\n\t\t\t}\n\t\t\t\n\t\t\ttd, th { \n\t\t\t\tfont-size: 10pt;\n\t\t\t\tborder: 3px;\n\t\t\t}\n\t\t\t\n\t\t\tth {\n\t\t\t\tfont-weight: bold;\t\t\t\t\n\t\t\t}\n\t\t\t\n\t\t</style>\t\t\n\t\t\n\t\t<table style=\"table-layout: fixed; width: 100%; border-spacing: 6px; border-collapse: separate;\">\t\n\t\t\t<tr>\n\t\t\t\t<td width=\"30%\" valign=\"top\">\n\t\t\t\t\t<p style=\"color: #4d5f79; font-weight: 600;\">Select a table to view its details.</p>\n\t\t\t\t\t<divstyle=\"margin-top: 3px;\" id=\"tablesColumn\">Loading Tables Index...</div>\n\t\t\t\t</td>\n\t\t\t\t<td id=\"tableInfoColumn\" valign=\"top\">&nbsp;</td>\t\t\t\n\t\t\t</tr>\n\t\t</table>\n\t\t\n\t\t<script>\t\n\t\t\t\t\t\t\t\n\t\t\twindow.jQuery = window.$ = jQuery;\t\t\t\n\t\t\t\n\t\t\t" + jsFunctionTableDetailsGet() + "\n\t\t\t" + jsFunctionTableNamesGet() + "\n\t\t\t" + jsFunctionTableQueryCopy() + "\t\t\t\t\t\t\n\t\t\t\n\t\t\ttableNamesGet();\t\t\t\n\t\t\t\n\t\t</script>\n\t\t\n\t";
        context.response.writePage(form);
    }
    function htmlGenerateTool() {
        return "\n\n\t\t<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css\">\n\t\t<script src=\"/ui/jquery/jquery-3.5.1.min.js\"></script>\n\t\t<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js\"></script>\n\t\t" + jsFunctionDataTablesExternals() + "\n\t\t<style type = \"text/css\"> \n\t\t\n\t\t\tinput[type=\"text\"], input[type=\"search\"], textarea, button {\n\t\t\t\toutline: none;\n\t\t\t\tbox-shadow:none !important;\n\t\t\t\tborder: 1px solid #ccc !important;\n\t\t\t}\n\t\t\t\n\t\t\tp, pre {\n\t\t\t\tfont-size: 10pt;\n\t\t\t}\n\t\t\t\n\t\t\ttd, th { \n\t\t\t\tfont-size: 10pt;\n\t\t\t\tborder: 3px;\n\t\t\t}\n\t\t\t\n\t\t\tth {\n\t\t\t\ttext-transform: lowercase;\n\t\t\t\tfont-weight: bold;\t\t\t\t\n\t\t\t}\n\t\t\t\n\t\t</style>\n\t\t\n\t\t" + htmlLocalLoadModal() + "\n\t\t\n\t\t" + htmlRemoteLoadModal() + "\t\n\n\t\t" + htmlSaveModal() + "\n\t\t\n\t\t" + htmlWorkbooksModal() + "\n\t\t\t\n\t\t" + htmlQueryUI() + "\n\n\t\t<script>\t\n\t\t\n\t\t\tvar\n\t\t\t\tactiveSQLFile = {},\n\t\t\t\tqueryResponsePayload,\n\t\t\t\tfileLoadResponsePayload;\n\t\t\t\n\t\t\twindow.jQuery = window.$ = jQuery;\n\t\t\t\n\t\t\t$('#queryUI').show();\n\t\t\t$('#templateHeaderRow').hide();\n\t\t\t$('#templateFormRow').hide();\n\t\t\t\t\t\t\n\t\t\t" + jqueryKeydownHandler() + "\n\t\t\t" + jqueryModalHandlers() + "\n\t\t\t" + jsFunctionDefaultQuerySet() + "\n\t\t\t" + jsFunctionDocumentGenerate() + "\n\t\t\t" + jsFunctionEnablePaginationToggle() + "\n\t\t\t" + jsFunctionFileInfoRefresh() + "\n\t\t\t" + jsFunctionHideRowNumbersToggle() + "\n\t\t\t" + jsFunctionLocalLibraryFilesGet() + "\n\t\t\t" + jsFunctionLocalSQLFileLoad() + "\n\t\t\t" + jsFunctionLocalSQLFileSave() + "\n\t\t\t" + jsFunctionQueryFormRowToggle() + "\n\t\t\t" + jsFunctionQuerySubmit() + "\n\t\t\t" + jsFunctionQueryTextAreaResize() + "\n\t\t\t" + jsFunctionRadioFieldValueGet() + "\n\t\t\t" + jsFunctionRemoteLibraryIndexGet() + "\t\n\t\t\t" + jsFunctionRemoteSQLFileLoad() + "\n\t\t\t" + jsFunctionResponseDataCopy() + "\n\t\t\t" + jsFunctionResponseGenerate() + "\n\t\t\t" + jsFunctionResponseGenerateCSV() + "\n\t\t\t" + jsFunctionResponseGenerateJSON() + "\n\t\t\t" + jsFunctionResponseGenerateTable() + "\n\t\t\t" + jsFunctionReturnAllToggle() + "\n\t\t\t" + jsFunctiontablesReferenceOpen() + "\n\t\t\t" + jsFunctionWorkbookLoad() + "\n\t\t\t" + jsFunctionWorkbooksListGet() + "\n\n\t\t</script>\t\n\t\t\n\t";
    }
    function htmlLocalLoadModal() {
        return "\n\t\t<div class=\"modal fade\" id=\"localLoadModal\">\n\t\t\t<div class=\"modal-dialog modal-lg\">\n\t\t\t\t<div class=\"modal-content\">\n\n\t\t\t\t\t<div class=\"modal-header\">\n\t\t\t\t\t\t<h4 class=\"modal-title\">Local Query Library</h4>\n\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"modal-body\" id=\"localSQLFilesList\">\t\t\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\t\n\t";
    }
    function htmlQueryUI() {
        return "\n\n\t\t<div class=\"collapse\" id=\"queryUI\" style=\"text-align: left;\">\t\n\t\t\n\t\t\t<table style=\"table-layout: fixed; width: 100%; border-spacing: 6px; border-collapse: separate;\">\n\t\t\t\n\t\t\t\t<tr>\t\t\t\t\n\t\t\t\t\t<td width=\"20%\">\n\t\t\t\t\t\t<h5 id=\"queryHeader\" style=\"margin-bottom: 0px; color: #4d5f79; font-weight: 600;\"><a href=\"#\" onClick=\"javascript:defaultQuerySet();\" title=\"Click to load a sample query.\" style=\"color: #4d5f79;\">Query Editor</a></h5>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td width=\"55%\" style=\"text-align: right;\">\n\t\t\t\t\t\t<div id=\"buttonsDiv\">\n\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-sm btn-light\" onClick=\"javascript:tablesReferenceOpen();\">Tables Reference</button>\n\t\t\t\t\t\t\t" + jsFunctionWorkbooksButton() + "\t\n\t\t\t\t\t\t\t" + jsFunctionRemoteLibraryButton() + "\t\n\t\t\t\t\t\t\t" + jsFunctionLocalLibraryButtons() + "\n\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-sm btn-success\" onclick=\"querySubmit();\" accesskey=\"r\">Run Query</button>\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\t\n\t\t\t\t\t<td width=\"25%\" style=\"text-align: right;\">\n\t\t\t\t\t\t<button id=\"btnQueryFormRowToggle\" type=\"button\" class=\"btn btn-sm btn-light\" onclick=\"queryFormRowToggle();\">Hide Query Editor</button>\n\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t</tr>\n\t\t\t\t\n\t\t\t\t<tr id=\"queryFormRow\">\n\t\t\t\t\t<td colspan=\"2\" style=\"vertical-align: top;\">\n\t\t\t\t\t\t<textarea \n\t\t\t\t\t\t\tclass=\"form-control small\"\n\t\t\t\t\t\t\tid=\"query\" \n\t\t\t\t\t\t\tstyle=\"\n\t\t\t\t\t\t\t\tfont-size: 10pt;\n\t\t\t\t\t\t\t\tbackground-color: #FFFFFF; \n\t\t\t\t\t\t\t\tx-font-family: 'Courier New', monospace; \n\t\t\t\t\t\t\t\tcolor: #000000;\n\t\t\t\t\t\t\t\tline-height: 1.3;\n\t\t\t\t\t\t\t\tpadding: 12px;\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\trows=\"22\" \n\t\t\t\t\t\t\tplaceholder=\"Enter a SuiteQL query here. Click &quot;Query Editor&quot; (above) to load a sample query.\" \n\t\t\t\t\t\t\tautofocus \n\t\t\t\t\t\t\t></textarea>\n\t\t\t\t\t\t<div id=\"fileInfo\"></div>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td style=\"vertical-align: top;\">\n\t\t\t\t\t\n\t\t\t\t\t\t<div style=\"margin-left: 6px; padding: 12px; border: 1px solid #ccc; border-radius: 5px; background-color: #FAFAFA;\">\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"form-check\" style=\"margin-top: 6px;\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"form-check-input\" id=\"enablePagination\" onChange=\"enablePaginationToggle();\">Enable Pagination Options\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<p style=\"font-size: 10pt; margin-bottom: 3px; display: none;\" id=\"returnRowsP\">Return Rows:</p>\n\t\t\t\t\t\t\t\t<div class=\"form-inline\" id=\"rowRangeDiv\" style=\"display: none;\">\n\t\t\t\t\t\t\t\t\t<input type=\"number\" class=\"form-control-sm\" name=\"rowBegin\" id=\"rowBegin\" style=\"max-width: 100px;\" value=\"1\" required>\n\t\t\t\t\t\t\t\t\t&nbsp;thru&nbsp;\n\t\t\t\t\t\t\t\t\t<input type=\"number\" class=\"form-control-sm\" name=\"rowEnd\" id=\"rowEnd\" style=\"max-width: 100px;\" value=\"" + rowsReturnedDefault + "\" required>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"form-check\" style=\"margin-top: 6px; display: none;\" id=\"rowAllRowsDiv\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"form-check-input\" id=\"returnAll\" onChange=\"returnAllToggle();\">Return All Rows\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"form-check\" style=\"margin-top: 6px;  display: none;\" id=\"rowTotalRowsDiv\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"form-check-input\" id=\"returnTotals\" onChange=\"returnAllToggle();\">Return Total Rows Count\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"form-check\" style=\"margin-top: 6px;  display: none;\" id=\"hideRowNumbersDiv\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"form-check-input\" id=\"hideRowNumbers\" onChange=\"hideRowNumbersToggle();\" checked>Hide Row Numbers\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t" + htmlEnableViewsOption() + "\n\n\t\t\t\t\t\t\t<div style=\"margin-top: 12px; border-top: 1px solid #eee; padding-top: 12px;\">\n\t\t\t\t\t\t\t\t<p style=\"font-size: 10pt; margin-bottom: 3px;\">Format Results As:</p>\n\t\t\t\t\t\t\t\t<div class=\"form-check-inline\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" class=\"form-check-input\" name=\"resultsFormat\" value=\"table\" checked onChange=\"responseGenerate();\">Table\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t" + htmlDataTablesFormatOption() + "\n\t\t\t\t\t\t\t\t<div class=\"form-check-inline\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" class=\"form-check-input\" name=\"resultsFormat\" value=\"csv\" onChange=\"responseGenerate();\">CSV\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t<div class=\"form-check-inline\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" class=\"form-check-input\" name=\"resultsFormat\" value=\"json\" onChange=\"responseGenerate();\">JSON\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t<div class=\"form-check-inline\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" class=\"form-check-input\" name=\"resultsFormat\" value=\"pdf\" onChange=\"responseGenerate();\">PDF\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t<div class=\"form-check-inline\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" class=\"form-check-input\" name=\"resultsFormat\" value=\"html\" onChange=\"responseGenerate();\">HTML\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\t\n\n\t\t\t\t\t\t\t<div style=\"margin-top: 12px; border-top: 1px solid #eee; padding-top: 12px;\" id=\"nullFormatDiv\">\n\t\t\t\t\t\t\t\t<p style=\"font-size: 10pt; margin-bottom: 3px;\">Display NULL Values As:</p>\n\t\t\t\t\t\t\t\t<div class=\"form-check-inline\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" class=\"form-check-input\" name=\"nullFormat\" value=\"dimmed\" checked onChange=\"responseGenerate();\">Dimmed\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"form-check-inline\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" class=\"form-check-input\" name=\"nullFormat\" value=\"blank\" onChange=\"responseGenerate();\">Blank\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"form-check-inline\">\n\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" style=\"font-size: 10pt;\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" class=\"form-check-input\" name=\"nullFormat\" value=\"null\" onChange=\"responseGenerate();\">null\n\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t\t\n\t\t\t\t<tr id=\"templateHeaderRow\">\t\t\t\t\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<h5 style=\"margin-top: 12px; margin-bottom: 0px; color: #4d5f79; font-weight: 600;\"><a href=\"#\" onClick=\"javascript:defaultQuerySet();\" title=\"Click to load a sample query.\" style=\"color: #4d5f79;\">Template Editor</a></h5>\n\t\t\t\t\t</td>\n\t\t\t\t\t<td colspan=\"2\" style=\"text-align: right; vertical-align: top;\">\n\t\t\t\t\t\t<div id=\"templateButtonsDiv\">\n\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-sm btn-light\" onClick=\"window.open( 'https://bfo.com/products/report/docs/userguide.pdf' );\">BFO Reference</button>\n\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-sm btn-light\" onClick=\"window.open( 'https://freemarker.apache.org/docs/index.html' );\">FreeMarker Reference</button>\n\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-sm btn-success\" onclick=\"documentGenerate();\" accesskey=\"g\">Generate Document</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t</tr>\n\t\t\t\t\n\t\t\t\t<tr id=\"templateFormRow\">\n\t\t\t\t\t<td colspan=\"3\" style=\"vertical-align: top;\">\n\t\t\t\t\t\t<textarea \n\t\t\t\t\t\t\tclass=\"form-control small\" \n\t\t\t\t\t\t\tid=\"template\" \n\t\t\t\t\t\t\tstyle=\"\n\t\t\t\t\t\t\t\tfont-size: 10pt;\n\t\t\t\t\t\t\t\tbackground-color: #FFFFFF; \n\t\t\t\t\t\t\t\tx-font-family: 'Courier New', monospace; \n\t\t\t\t\t\t\t\tcolor: #000000;\n\t\t\t\t\t\t\t\tline-height: 1.3;\n\t\t\t\t\t\t\t\tpadding: 12px;\n\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\trows=\"20\" \n\t\t\t\t\t\t\tplaceholder=\"Enter your template here.\" \n\t\t\t\t\t\t\tautofocus \n\t\t\t\t\t\t\t></textarea>\n\t\t\t\t\t\t<div id=\"templateFileInfo\"></div>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\t\t\t\t\n\t\t\t\t\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=\"3\">\t\n\t\t\t\t\t\t<div id=\"resultsDiv\" style=\"max-width: 100%; margin-top: 12px; display: none; overflow: auto; overflow-y: hidden;\">\n\t\t\t\t\t\t<!-- RESULTS -->\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\t\n\t\t\t\t\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan=\"3\">\n\t\t\t\t\t\t<div style=\"margin-top: 12px; padding: 12px; border: 0px solid #ccc; border-radius: 5px; background-color: #FFFFFF; font-size: 10pt; color: #848484;\">\n\t\t\t\t\t\t\t<p style=\"text-align: center; margin-bottom: 0px;\">\n\t\t\t\t\t\t\t\tSuiteQL Query Tool Version " + version + ". \n\t\t\t\t\t\t\t\tDeveloped by <a href=\"https://timdietrich.me/\" target=\"_tim\" style=\"color: #4d5f79;\">Tim Dietrich</a>.\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t</td>\t\t\t\n\t\t\t\t</tr>\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t</table>\n\t\t\n\t\t</div>\n\n\t";
    }
    function htmlRemoteLoadModal() {
        return "\n\t\t<div class=\"modal fade\" id=\"remoteLoadModal\">\n\t\t\t<div class=\"modal-dialog modal-lg\">\n\t\t\t\t<div class=\"modal-content\">\n\n\t\t\t\t\t<div class=\"modal-header\">\n\t\t\t\t\t\t<h4 class=\"modal-title\">Remote Query Library</h4>\n\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"modal-body\" id=\"remoteSQLFilesList\">\t\t\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\t\n\t";
    }
    function htmlSaveModal() {
        return "\n\t\t<div class=\"modal fade\" id=\"saveModal\">\n\t\t\t<div class=\"modal-dialog modal-lg\">\n\t\t\t\t<div class=\"modal-content\">\n\n\t\t\t\t\t<div class=\"modal-header\">\n\t\t\t\t\t\t<h4 class=\"modal-title\">Save Query</h4>\n\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<div class=\"modal-body\" id=\"saveQueryMessage\" style=\"display: none;\">\n\t\t\t\t\t\tERROR\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"modal-body\" id=\"saveQueryForm\" style=\"display: none;\">\n\t\t\t\t\t\t<form class=\"row\" style=\"margin-bottom: 24px;\">\n\t\t\t\t\t\t\t<div class=\"col-12\" style=\"margin-top: 12px;\">\n\t\t\t\t\t\t\t\t<p style=\"font-size: 10pt; margin-bottom: 3px;\">File Name:</p>\n\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" name=\"saveQueryFormFileName\" id=\"saveQueryFormFileName\" style=\"width: 200px; padding: 3px;\" value=\"\">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"col-12\" style=\"margin-top: 12px;\">\n\t\t\t\t\t\t\t\t<p style=\"font-size: 10pt; margin-bottom: 3px;\">Description:</p>\n\t\t\t\t\t\t\t\t<input type=\"text\" class=\"form-control\" name=\"saveQueryFormDescription\" id=\"saveQueryFormDescription\" style=\"width: 400px; padding: 3px;\" value=\"\">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"col-12\" style=\"margin-top: 12px;\">\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-sm btn-success\" onclick=\"javascript:localSQLFileSave();\">Save The Query &gt;</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t";
    }
    function htmlWorkbooksModal() {
        return "\n\t\t<div class=\"modal fade\" id=\"workbooksModal\">\n\t\t\t<div class=\"modal-dialog modal-lg\">\n\t\t\t\t<div class=\"modal-content\">\n\n\t\t\t\t\t<div class=\"modal-header\">\n\t\t\t\t\t\t<h4 class=\"modal-title\">Workbooks</h4>\n\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class=\"modal-body\" id=\"workbooksList\">\t\t\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\t\n\t";
    }
    function jqueryKeydownHandler() {
        return "\n\t\n\t\t$('textarea').keydown(\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\n\t\t\tfunction(e) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\tif ( e.keyCode === 9 ) {\n\t\t\t\t\tvar start = this.selectionStart;\n\t\t\t\t\tvar end = this.selectionEnd;\n\t\t\t\t\tvar $this = $(this);\n\t\t\t\t\tvar value = $this.val();\n\t\t\t\t\t$this.val(value.substring(0, start) + \"\t\" + value.substring(end));\n\t\t\t\t\tthis.selectionStart = this.selectionEnd = start + 1;\n\t\t\t\t\te.preventDefault();\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\tif ( e.keyCode === 190 ) {\t\t\n\t\t\t\t\n\t\t\t\t\tvar queryField = document.getElementById('query');\n\n\t\t\t\t\tvar pos = queryField.selectionStart;\t\t\t\n\t\t\t\t\t\n\t\t\t\t\tif ( pos > 1 ) {\t\t\n\n\t\t\t\t\t\tif ( queryField.value.charAt( pos - 1 ) == '.' ) {\n\t\t\t\n\t\t\t\t\t\t\tvar tableStart = -2;\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tfor ( i = pos - 2; i > 0; i--) {\n\t\t\t\t\t\t\t\tvar c = queryField.value.charAt(i);\t\t\t\t\t\n\t\t\t\t\t\t\t\tif ( ( c == '\\t' )  || ( c == ' ' )  || ( c == '\\n' )  || ( c == '\\r' ) ) {\n\t\t\t\t\t\t\t\t\ti = i + 1;\n\t\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t\t}\t\t\t\t\t\n\t\t\t\t\t\t\t}\t\t\t\t\n\n\t\t\t\t\t\t\tvar tableName = queryField.value.substring( i, pos - 1 );\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t// alert( tableName );\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\ttablesReferenceOpen();\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\ttableDetailsGet( tableName );\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\treturn false;\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\treturn;\n\n\t\t\t\t}\t\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\tfileInfoRefresh();\t\t\t\t\t\t\t\n\n\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t);\t\n\t\n\t";
    }
    function jqueryModalHandlers() {
        return "\n\t\n\t\t$('#localLoadModal').on('shown.bs.modal', \n\t\t\n\t\t\tfunction (e) {\n\t\t\t\tlocalLibraryFilesGet();\n\t\t\t}\n\t\t\t\n\t\t);\n\t\t\n\t\t$('#remoteLoadModal').on('shown.bs.modal', \n\t\t\n\t\t\tfunction (e) {\n\t\t\t\tremoteLibraryIndexGet();\n\t\t\t}\n\t\t\t\n\t\t);\t\t\n\t\t\n\t\t$('#saveModal').on('shown.bs.modal', \n\t\t\n\t\t\tfunction (e) {\n\t\t\t\n\t\t\t\tdocument.getElementById('saveQueryMessage').style.display = \"none\";\n\t\t\t\tdocument.getElementById('saveQueryForm').style.display = \"none\";\n\t\t\t\n\t\t\t\tif ( document.getElementById('query').value == '' ) { \n\t\t\t\t\n\t\t\t\t\tdocument.getElementById('saveQueryMessage').innerHTML = '<p>Please enter a query.</p>';\t\n\t\t\t\t\tdocument.getElementById('saveQueryMessage').style.display = \"block\";\t\t\t\t\t\t\t\n\t\t\t\t\treturn; \n\t\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\t\n\t\t\t\t\tdocument.getElementById('saveQueryForm').style.display = \"block\";\n\t\t\t\t\t\n\t\t\t\t\tif ( activeSQLFile.hasOwnProperty( 'fileName' ) ) {\t\t\t\t\t\t\t\t\n\t\t\t\t\t\tdocument.getElementById('saveQueryFormFileName').value = activeSQLFile.fileName;\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t}\n\t\t\t\t\t\n\t\t\t\t\tif ( activeSQLFile.hasOwnProperty( 'description' ) ) {\t\t\t\t\t\t\t\t\n\t\t\t\t\t\tdocument.getElementById('saveQueryFormDescription').value = activeSQLFile.description;\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\tdocument.getElementById('saveQueryFormFileName').focus();\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t}\t\t\t\t\t\n\t\t\t\t\n\t\t\t}\n\t\t\t\n\t\t);\t\t\n\t\t\n\t\t$('#workbooksModal').on('shown.bs.modal', \n\t\t\n\t\t\tfunction (e) {\n\t\t\t\tworkbooksListGet();\n\t\t\t}\n\t\t\t\n\t\t);\t\t\t\n\t\t\t\n\t";
    }
    function jsFunctionDataTablesExternals() {
        if (datatablesEnabled === true) {
            return "\n\t\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.datatables.net/1.10.25/css/jquery.dataTables.css\">\n \t\t\t<script type=\"text/javascript\" charset=\"utf8\" src=\"https://cdn.datatables.net/1.10.25/js/jquery.dataTables.js\"></script>\t\t\n \t\t";
        }
        else {
            return "";
        }
    }
    function jsFunctionDefaultQuerySet() {
        return "\n\t\tfunction defaultQuerySet() {\t\n\t\t\tdocument.getElementById('query').value = `SELECT\n\tID,\n\tLastName,\n\tFirstName,\n\tPhone,\n\tEmail\nFROM\n\tEmployee\nWHERE\n\tEmail LIKE '%@test.com'\nORDER BY\n\tLastName,\n\tFirstName`;\n\t\t\treturn false;\n\t\t}\t\n\t";
    }
    function jsFunctionDocumentGenerate() {
        return "\n\t\n\t\tfunction documentGenerate() {\n\t\n\t\t\tif ( document.getElementById('query').value == '' ) { \n\t\t\t\talert( 'Please enter a query.' );\n\t\t\t\treturn; \n\t\t\t}\n\t\t\n\t\t\tif ( document.getElementById('returnAll').checked ) {\n\t\t\n\t\t\t\trowBegin = 1;\n\t\t\t\trowEnd = 999999;\n\t\t\n\t\t\t} else {\n\t\t\n\t\t\t\trowBegin = parseInt( document.getElementById('rowBegin').value );\n\t\t\n\t\t\t\tif ( Number.isInteger( rowBegin ) === false ) {\n\t\t\t\t\talert( 'Enter an integer for the beginning row.' );\n\t\t\t\t\tdocument.getElementById('rowBegin').focus();\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\n\t\t\t\trowEnd = parseInt( document.getElementById('rowEnd').value );\n\t\t\n\t\t\t\tif ( Number.isInteger( rowEnd ) === false ) {\n\t\t\t\t\talert( 'Enter an integer for the ending row.' );\n\t\t\t\t\tdocument.getElementById('rowEnd').focus();\n\t\t\t\t\treturn;\n\t\t\t\t}\t\n\t\t\t\n\t\t\t}\t\n\t\t\t\n\t\t\tif ( document.getElementById('template').value == '' ) { \n\t\t\t\talert( 'Please enter a template.' );\n\t\t\t\treturn; \n\t\t\t}\t\n\t\t\t\n\t\t\tvar viewsEnabled = false;\n\t\t\t\n\t\t\tif ( document.getElementById('enableViews') ) {\n\t\t\t\tviewsEnabled = document.getElementById('enableViews').checked;\n\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\tvar requestPayload = { \n\t\t\t\t'function': 'documentSubmit', \n\t\t\t\t'query': document.getElementById('query').value,\n\t\t\t\t'rowBegin': rowBegin,\n\t\t\t\t'rowEnd': rowEnd,\n\t\t\t\t'viewsEnabled': viewsEnabled,\n\t\t\t\t'returnTotals': document.getElementById('returnTotals').checked,\t\t\t\t\n\t\t\t\t'template': document.getElementById('template').value,\n\t\t\t\t'docType': radioFieldValueGet( 'resultsFormat' )\n\t\t\t}\n\t\t\t\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\n\t\t\txhr.open( 'POST', '" + scriptURL + "', true );\n\t\t\t\n\t\t\txhr.setRequestHeader( 'Accept', 'application/json' );\t\t\n\t\t\n\t\t\txhr.send( JSON.stringify( requestPayload ) );\n\t\t\n\t\t\txhr.onload = function() {\n\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\n\t\t\t\t\ttry {\t\t\t\n\t\t\t\t\t\tqueryResponsePayload = JSON.parse( xhr.response );\t\t\t\t\t\t\n\t\t\t\t\t} catch( e ) {\t\n\t\t\t\t\t\talert( 'Unable to parse the response.' );\n\t\t\t\t\t\treturn;\t\t\t\t\t\n\t\t\t\t\t}\n\t\t\t\n\t\t\t\t\tif ( queryResponsePayload['error'] == undefined ) {\t\t\t\t\n\t\t\t\t\t\twindow.open( '" + scriptURL + "&function=documentGenerate' );\n\t\t\t\t\t} else {\t\t\t\t\t\n\t\t\t\t\t\talert( 'Error: ' + queryResponsePayload.error.message );\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t} else {\t\t\t\t\n\t\t\t\t\talert( 'Error: ' + xhr.status );\t\t\t\t\t\t\t\t\t\n\t\t\t\t}\n\t\t\t\n\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t}\n\t\n\t\n\t";
    }
    function jsFunctionEnablePaginationToggle() {
        return "\n\t\n\t\tfunction enablePaginationToggle() {\n\t\t\n\t\t\tif ( document.getElementById('enablePagination').checked ) {\n\t\t\t\tdocument.getElementById('returnRowsP').style.display = \"block\";\t\t\t\t\t\n\t\t\t\tif ( document.getElementById('returnAll').checked ) {\n\t\t\t\t\tdocument.getElementById('rowRangeDiv').style.display = \"none\";\t\n\t\t\t\t\tdocument.getElementById('returnRowsP').style.display = \"none\";\t\t\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\t\tdocument.getElementById('rowRangeDiv').style.display = \"block\";\n\t\t\t\t\tdocument.getElementById('returnRowsP').style.display = \"block\";\n\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\tdocument.getElementById('rowAllRowsDiv').style.display = \"block\";\t\n\t\t\t\tdocument.getElementById('rowTotalRowsDiv').style.display = \"block\";\t\n\t\t\t\tdocument.getElementById('hideRowNumbersDiv').style.display = \"block\";\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t} else {\n\t\t\t\tdocument.getElementById('returnRowsP').style.display = \"none\";\t\n\t\t\t\tdocument.getElementById('rowRangeDiv').style.display = \"none\";\t\n\t\t\t\tdocument.getElementById('rowAllRowsDiv').style.display = \"none\";\t\n\t\t\t\tdocument.getElementById('rowTotalRowsDiv').style.display = \"none\";\t\n\t\t\t\tdocument.getElementById('returnRowsP').style.display = \"none\";\t\n\t\t\t\tdocument.getElementById('hideRowNumbersDiv').style.display = \"none\";\n\t\t\t}\n\t\t\t\n\t\t}\t\n\t\t\n\t";
    }
    function jsFunctionFileInfoRefresh() {
        return "\n\t\n\t\tfunction fileInfoRefresh() {\n\n\t\t\tvar content = '';\n\t\t\tvar status = '';\n\t\t\t\n\t\t\tif ( activeSQLFile.source == undefined ) {\t\n\t\t\t\n\t\t\t\tif ( document.getElementById('query').value != '' ) {\n\t\t\t\t\tcontent = '<span class=\"text-danger\">unsaved</span>';\n\t\t\t\t}\n\t\t\t\t\n\t\t\t} else {\n\t\t\t\n\t\t\t\tstatus = 'Unchanged';\n\t\t\t\tif ( document.getElementById('query').value != activeSQLFile.sql ) {\n\t\t\t\t\tstatus = 'Changed / Unsaved';\n\t\t\t\t} else {\n\t\t\t\t\tstatus = 'Unchanged';\n\t\t\t\t}\n\t\t\t\n\t\t\t\tvar tooltip = 'Source: ' + activeSQLFile.source + '\\n';\n\t\t\t\ttooltip += 'Status: ' + status;\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\tcontent = '<span title=\"' + tooltip + '\">' + activeSQLFile.fileName + '</span>';\n\t\t\t\t\n\t\t\t\tif ( document.getElementById('query').value != activeSQLFile.sql ) {\n\t\t\t\t\tcontent = '<span class=\"text-danger\">' + content + '</span>';\n\t\t\t\t}\n\t\t\t\t\n\t\t\t}\n\t\t\t\n\t\t\tcontent = '<p style=\"margin-top: 3px;\">' + content + '</p>';\n\t\t\t\n\t\t\tdocument.getElementById('fileInfo').innerHTML = content;\n\t\t\n\t\t}\t\n\t\t\n\t";
    }
    function jsFunctionHideRowNumbersToggle() {
        return "\n\t\n\t\tfunction hideRowNumbersToggle() {\n\t\t\tresponseGenerateTable();\n\t\t}\t\n\t\t\n\t";
    }
    function jsFunctionLocalLibraryButtons() {
        if (queryFolderID !== null) {
            return "<button type=\"button\" class=\"btn btn-sm btn-light\" data-toggle=\"modal\" data-target=\"#localLoadModal\">Local Library</button>\t\t\t\t\t\t\t\t\t\n\t\t<button type=\"button\" class=\"btn btn-sm btn-light\" data-toggle=\"modal\" data-target=\"#saveModal\">Save Query</i></button>";
        }
        else {
            return "";
        }
    }
    function jsFunctionLocalLibraryFilesGet() {
        return "\n\t\n\t\tfunction localLibraryFilesGet() {\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\tdocument.getElementById('localSQLFilesList').innerHTML = '<h5 style=\"color: green;\">Getting the list of SQL files...</h5>';\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\tvar requestPayload = { \n\t\t\t\t'function': 'localLibraryFilesGet'\n\t\t\t}\n\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\n\t\t\txhr.open( 'POST', '" + scriptURL + "', true );\n\t\t\t\n\t\t\txhr.send( JSON.stringify( requestPayload ) );\n\t\t\t\n\t\t\txhr.onload = function() {\n\t\t\t\n\t\t\t\tvar content = '';\n\t\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\n\t\t\t\t\tpayload = JSON.parse( xhr.response );\n\t\t\t\t\n\t\t\t\t\tif ( payload.error == undefined ) {\t\n\t\t\t\t\t\n\t\t\t\t\t\tcontent = '<div class=\"table-responsive\">';\n\t\t\t\t\t\t\tcontent += '<table id=\"localFilesTable\" class=\"table table-sm table-bordered table-hover table-responsive-sm\">';\n\t\t\t\t\t\t\t\tcontent += '<thead class=\"thead-light\">';\n\t\t\t\t\t\t\t\t\tcontent += '<tr>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<th>Name</th>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<th>Description</th>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<th></th>';\n\t\t\t\t\t\t\t\t\tcontent += '</tr>';\n\t\t\t\t\t\t\t\tcontent += '</thead>';\n\t\t\t\t\t\t\t\tcontent += '<tbody>';\n\t\t\t\t\t\t\t\tfor ( r = 0; r < payload.records.length; r++ ) {\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tvar description = payload.records[r].description;\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tif( description === null ) { description = ''; }\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tcontent += '<tr>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<td style=\"vertical-align: middle;\">' + payload.records[r].name + '</td>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<td style=\"vertical-align: middle;\">' + description + '</td>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-sm  btn-primary\" onclick=\"localSQLFileLoad(' + payload.records[r].id + ');\">Load</button></td>';\n\t\t\t\t\t\t\t\t\tcontent += '</tr>';\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t}\t\n\t\t\t\t\t\t\t\tcontent += '</tbody>';\n\t\t\t\t\t\t\tcontent += '</table>';\n\t\t\t\t\t\tcontent += '</div>';\n\t\t\t\t\t\t\n\t\t\t\t\t\tdocument.getElementById('localSQLFilesList').innerHTML = content;\n\t\t\t\t\t\n\t\t\t\t\t\tif ( " + datatablesEnabled + " ) {\n\t\t\t\t\t\t\t$('#localFilesTable').DataTable();\n\t\t\t\t\t\t}\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t} else {\n\t\t\t\t\t\n\t\t\t\t\t\tif ( payload.error == 'No SQL Files' ) {\n\t\t\t\t\t\t\n\t\t\t\t\t\t\tcontent += '<p class=\"text-danger\">No query files were found in the local folder.</p>';\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tdocument.getElementById('localSQLFilesList').innerHTML = content;\n\t\t\t\t\t\t\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\n\t\t\t\t\t\t\tcontent = '<h5 class=\"text-danger\">Error</h5>';\n\t\t\t\t\t\t\tcontent += '<pre>';\n\t\t\t\t\t\t\tcontent += payload.error;\n\t\t\t\t\t\t\tcontent += '</pre>';\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tdocument.getElementById('localSQLFilesList').innerHTML = content;\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t}\t\n\t\t\t\t\t\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\t\n\t\t\t\t\tvar content = '<h5 class=\"text-danger\">Error</h5>';\n\t\t\t\t\tcontent += '<pre>';\n\t\t\t\t\tcontent += 'XHR Error: Status ' + xhr.status;\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\tdocument.getElementById('localSQLFilesList').innerHTML = content;\t\t\n\t\t\t\t\n\t\t\t\t}\n\t\t\t\t\t\t\t\t\n\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t}\t\n\t\t\t\n\t";
    }
    function jsFunctionLocalSQLFileLoad() {
        return "\n\t\n\t\tfunction localSQLFileLoad( fileID ) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\tvar requestPayload = { \n\t\t\t\t'function': 'sqlFileLoad',\n\t\t\t\t'fileID': fileID\n\t\t\t}\n\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\n\t\t\txhr.open( 'POST', '" + scriptURL + "', true );\n\t\t\t\n\t\t\txhr.send( JSON.stringify( requestPayload ) );\n\t\t\t\n\t\t\txhr.onload = function() {\n\t\t\t\t\t\t\t\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\n\t\t\t\t\tfileLoadResponsePayload = JSON.parse( xhr.response );\t\n\t\t\t\t\t\n\t\t\t\t\tif ( fileLoadResponsePayload.error == undefined ) {\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\tdocument.getElementById('query').value = fileLoadResponsePayload.sql;\n\t\t\t\t\t\t\n\t\t\t\t\t\tqueryTextAreaResize();\n\t\t\t\t\t\t\n\t\t\t\t\t\t$('#localLoadModal').modal('toggle');\n\t\t\t\t\t\t\n\t\t\t\t\t\tdocument.getElementById('resultsDiv').style.display = \"none\";\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\tactiveSQLFile.source = 'Local SQL Library';\n\t\t\t\t\t\tactiveSQLFile.fileName = fileLoadResponsePayload.file.name;\n\t\t\t\t\t\tactiveSQLFile.description = fileLoadResponsePayload.file.description;\n\t\t\t\t\t\tactiveSQLFile.fileID = fileLoadResponsePayload.file.id;\n\t\t\t\t\t\tactiveSQLFile.sql = fileLoadResponsePayload.sql;\n\t\t\t\t\t\tfileInfoRefresh();\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t} else {\n\t\t\t\t\t\n\t\t\t\t\t\talert( 'Error: ' + payload.error );\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\t\n\t\t\t\t\talert( 'Error: ' + xhr.status );\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t}\t\t\t\t\t\t\t\n\t\t\n\t\t}\t\n\t\t\n\t";
    }
    function jsFunctionLocalSQLFileSave() {
        return "\n\t\n\t\tfunction localSQLFileSave() {\n\t\t\n\t\t\tvar filename = document.getElementById('saveQueryFormFileName').value;\n\t\t\n\t\t\tif ( filename == '' ) {\n\t\t\t\talert( 'Please enter a name for the file.' );\n\t\t\t\treturn;\n\t\t\t}\n\t\t\t\n\t\t\tvar requestPayload = { \n\t\t\t\t'function': 'sqlFileExists',\n\t\t\t\t'filename': filename\n\t\t\t}\n\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\n\t\t\txhr.open( 'POST', '" + scriptURL + "', false );\n\t\t\t\n\t\t\txhr.send( JSON.stringify( requestPayload ) );\t\t\n\t\t\t\n\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\n\t\t\t\tfileExistsResponsePayload = JSON.parse( xhr.response );\t\n\t\t\t\t\n\t\t\t\tif ( fileExistsResponsePayload.exists == true ) {\t\t\t\t\t\t\t\t\t\n\n   \t\t\t\t\tvar confirmResponse = confirm( \"A file named \\\"\" + filename + \"\\\" already exists. Do you want to replace it?\");\n   \t\t\t\t\t\n   \t\t\t\t\tif ( confirmResponse == false ) {\n   \t\t\t\t\t\treturn;\n   \t\t\t\t\t}\n\n\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t} else {\n\t\t\t\n\t\t\t\talert( 'Error: ' + xhr.status );\t\n\t\t\t\treturn;\t\t\t\t\t\t\t\n\t\t\t\n\t\t\t}\t\t\t\t\t\n\t\t\t\n\t\t\tvar requestPayload = { \n\t\t\t\t'function': 'sqlFileSave',\n\t\t\t\t'filename': filename,\n\t\t\t\t'contents': document.getElementById('query').value,\n\t\t\t\t'description': document.getElementById('saveQueryFormDescription').value\n\t\t\t}\n\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\n\t\t\txhr.open( 'POST', '" + scriptURL + "', true );\n\t\t\t\n\t\t\txhr.send( JSON.stringify( requestPayload ) );\n\t\t\t\n\t\t\txhr.onload = function() {\n\t\t\t\t\t\t\t\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\n\t\t\t\t\tfileSaveResponsePayload = JSON.parse( xhr.response );\t\n\t\t\t\t\t\n\t\t\t\t\tif ( fileSaveResponsePayload.error == undefined ) {\t\t\n\t\t\t\t\t\n\t\t\t\t\t\tactiveSQLFile.source = 'Local SQL Library';\n\t\t\t\t\t\tactiveSQLFile.fileName = filename;\n\t\t\t\t\t\tactiveSQLFile.description = document.getElementById('saveQueryFormDescription').value;\n\t\t\t\t\t\tactiveSQLFile.fileID = fileSaveResponsePayload.fileID;\n\t\t\t\t\t\tactiveSQLFile.sql = document.getElementById('query').value;\n\t\t\t\t\t\tfileInfoRefresh();\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\talert( 'The file has been saved.' );\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t} else {\n\t\t\t\t\t\n\t\t\t\t\t\talert( 'Error: ' + payload.error );\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\t\n\t\t\t\t\talert( 'Error: ' + xhr.status );\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t}\t\t\n\t\t\t\n\t\t\t$('#saveModal').modal('toggle');\n\t\t\n\t\t\treturn;\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\n\t\t}\t\t\t\t\n\n\n\t";
    }
    function jsFunctionQueryFormRowToggle() {
        return "\n\n\t\tfunction queryFormRowToggle() {\t\n\t\t\n\t\t\tif ( $('#queryFormRow').is(\":visible\") ) {\n\t\t\t\t$('#queryFormRow').hide();\t\t\t\t\n\t\t\t\t$('#queryHeader').hide();\n\t\t\t\t$('#buttonsDiv').hide();\t\t\t\t\t\t\t\n\t\t\t\t$('#btnQueryFormRowToggle').html('Show Query Editor');\t\t\t\t\n\t\t\t} else {\n\t\t\t\t$('#queryFormRow').show();\n\t\t\t\t$('#queryHeader').show();\n\t\t\t\t$('#buttonsDiv').show();\t\t\t\t\t\n\t\t\t\t$('#btnQueryFormRowToggle').html('Hide Query Editor');\n\t\t\t}\n\t\t\n\t\t}\t\n\t\n\t";
    }
    function jsFunctionQuerySubmit() {
        return "\n\n\t\tfunction querySubmit() {\t\n\t\t\t\n\t\t\tif ( document.getElementById('query').value == '' ) { \n\t\t\t\talert( 'Please enter a query.' );\n\t\t\t\treturn; \n\t\t\t}\n\t\t\t\n\t\t\tvar theQuery;\n\t\t\t\t\t\t\n\t\t\tvar textArea = document.getElementById('query');\n\t\t\t\t\t\t\n\t\t\t// Source: https://stackoverflow.com/questions/275761/how-to-get-selected-text-from-textbox-control-with-javascript\n\t\t\tif ( textArea.selectionStart !== undefined ) {\n\t\t\t\t// Standards-Compliant Version\n\t\t\t\tvar startPos = textArea.selectionStart;\n\t\t\t\tvar endPos = textArea.selectionEnd;\n\t\t\t\ttheQuery = textArea.value.substring( startPos, endPos );\n\t\t\t} else if ( document.selection !== undefined ) {\n\t\t\t\t// IE-Version\n\t\t\t\ttextArea.focus();\n\t\t\t\tvar sel = document.selection.createRange();\n\t\t\t\ttheQuery = sel.text;\n\t\t\t}\n\t\t\t\n\t\t\tif ( theQuery == '' ) { theQuery = document.getElementById('query').value; }\n\n\t\t\tif ( document.getElementById('returnAll').checked ) {\n\t\t\n\t\t\t\trowBegin = 1;\n\t\t\t\trowEnd = 999999;\n\t\t\n\t\t\t} else {\n\t\t\n\t\t\t\trowBegin = parseInt( document.getElementById('rowBegin').value );\n\t\t\n\t\t\t\tif ( Number.isInteger( rowBegin ) === false ) {\n\t\t\t\t\talert( 'Enter an integer for the beginning row.' );\n\t\t\t\t\tdocument.getElementById('rowBegin').focus();\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\n\t\t\t\trowEnd = parseInt( document.getElementById('rowEnd').value );\n\t\t\n\t\t\t\tif ( Number.isInteger( rowEnd ) === false ) {\n\t\t\t\t\talert( 'Enter an integer for the ending row.' );\n\t\t\t\t\tdocument.getElementById('rowEnd').focus();\n\t\t\t\t\treturn;\n\t\t\t\t}\t\n\t\t\t\n\t\t\t}\t\n\t\t\t\n\t\t\tvar viewsEnabled = false;\n\t\t\t\n\t\t\tif ( document.getElementById('enableViews') ) {\n\t\t\t\tviewsEnabled = document.getElementById('enableViews').checked;\n\t\t\t}\n\t\t\t\n\t\t\tvar paginationEnabled = document.getElementById('enablePagination').checked;\n\t\n\t\t\tdocument.getElementById('resultsDiv').style.display = \"block\";\n\t\t\n\t\t\tdocument.getElementById('resultsDiv').innerHTML = '<h5 style=\"color: green;\">Running query...</h5>';\t\t\t\n\t\t\t\t\t\t\t\n\t\t\tvar requestPayload = { \n\t\t\t\t'function': 'queryExecute', \n\t\t\t\t'query': theQuery,\n\t\t\t\t'rowBegin': rowBegin,\n\t\t\t\t'rowEnd': rowEnd,\n\t\t\t\t'paginationEnabled': paginationEnabled,\n\t\t\t\t'viewsEnabled': viewsEnabled,\n\t\t\t\t'returnTotals': document.getElementById('returnTotals').checked\n\t\t\t}\n\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\n\t\t\txhr.open( 'POST', '" + scriptURL + "', true );\n\t\t\t\n\t\t\txhr.setRequestHeader( 'Accept', 'application/json' );\t\t\n\t\t\n\t\t\txhr.send( JSON.stringify( requestPayload ) );\n\t\t\n\t\t\txhr.onload = function() {\n\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\n\t\t\t\t\ttry {\n\t\t\t\n\t\t\t\t\t\tqueryResponsePayload = JSON.parse( xhr.response );\n\t\t\t\t\t\t\n\t\t\t\t\t} catch( e ) {\t\n\t\t\t\t\t\talert( 'Unable to parse the response.' );\n\t\t\t\t\t\treturn;\t\t\t\t\t\n\t\t\t\t\t}\n\t\t\t\n\t\t\t\t\tif ( queryResponsePayload['error'] == undefined ) {\t\t\n\n\t\t\t\t\t\tresponseGenerate();\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\n\t\t\t\t\t} else {\n\t\t\n\t\t\t\t\t\tvar content = '<h5 class=\"text-danger\">Error</h5>';\n\t\t\t\t\t\tcontent += '<pre>';\n\t\t\t\t\t\tcontent += queryResponsePayload.error.message;\n\t\t\t\t\t\tcontent += '</pre>';\t\t\n\n\t\t\t\t\t\tdocument.getElementById('resultsDiv').innerHTML = content;\t\t\t\t\t\t\t\t\n\t\t\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\n\t\t\t\t\tvar content = '<h5 class=\"text-danger\">Error</h5>';\n\t\t\t\t\tcontent += '<pre>';\n\t\t\t\t\tcontent += 'XHR Error: Status ' + xhr.status;\n\t\t\t\t\tcontent += '</pre>';\t\t\n\n\t\t\t\t\tdocument.getElementById('resultsDiv').innerHTML = content;\t\t\t\t\t\t\t\t\n\t\t\t\n\t\t\t\t}\n\t\t\t\n\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t}\n\t\n\t\n\t";
    }
    function jsFunctionQueryTextAreaResize() {
        return "\n\t\n\t\tfunction queryTextAreaResize() {\t\t\t\t\t\n\t\t\tvar lines = document.getElementById('query').value.split(/\\r*\\n/);\n\t\t\tvar lineCount = lines.length + 1;\n\t\t\tif ( lineCount < 12 ) { lineCount = 12; }\n\t\t\tdocument.getElementById('query').rows = lineCount + 1;\t\t\t\t\t\t\n\t\t}\n\t\t\t\t\t\n\t";
    }
    function jsFunctionRadioFieldValueGet() {
        return "\n\t\n\t\tfunction radioFieldValueGet( fieldName ) {\t\t\t\t\t\n\t\t\tvar radios = document.getElementsByName( fieldName );\n\t\t\tfor (var i = 0, length = radios.length; i < length; i++) {\t\t\t\t\t\t\n\t\t\t  if (radios[i].checked) {\t\t\t\t\t\t  \n\t\t\t\treturn( radios[i].value );\n\t\t\t  }\n\t\t\t}\t\t\t\t\t\t\n\t\t\treturn '';\t\t\t\t\t\t\n\t\t}\t\t\n\t\n\t";
    }
    function jsFunctionRemoteLibraryButton() {
        if (remoteLibraryEnabled === true) {
            return "<button type=\"button\" class=\"btn btn-sm btn-light\" data-toggle=\"modal\" data-target=\"#remoteLoadModal\">Remote Library</button>";
        }
        else {
            return "";
        }
    }
    function jsFunctionRemoteLibraryIndexGet() {
        return "\n\t\n\t\tfunction remoteLibraryIndexGet() {\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\tdocument.getElementById('remoteSQLFilesList').innerHTML = '<h5 style=\"color: green;\">Loading SuiteQL Query Library...</h5>';\t\t\t\t\t\t\t\t\t\t\t\n\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\n\t\t\txhr.open( 'GET', 'https://suiteql.s3.us-east-1.amazonaws.com/queries/index.json?nonce=' + new Date().getTime(), true );\n\t\t\t\t\t\t\t\t\t\n\t\t\txhr.send();\n\t\t\t\n\t\t\txhr.onload = function() {\n\t\t\t\n\t\t\t\tvar content = '';\n\t\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\tpayload = JSON.parse( xhr.response );\n\t\t\t\t\n\t\t\t\t\tcontent = '<div class=\"table-responsive\">';\n\t\t\t\t\t\tcontent += '<table class=\"table table-sm table-bordered table-hover table-responsive-sm\" id=\"remoteFilesTable\">';\n\t\t\t\t\t\t\tcontent += '<thead class=\"thead-light\">';\n\t\t\t\t\t\t\t\tcontent += '<tr>';\n\t\t\t\t\t\t\t\t\tcontent += '<th>Name</th>';\n\t\t\t\t\t\t\t\t\tcontent += '<th>Description</th>';\n\t\t\t\t\t\t\t\t\tcontent += '<th></th>';\n\t\t\t\t\t\t\t\tcontent += '</tr>';\n\t\t\t\t\t\t\tcontent += '</thead>';\n\t\t\t\t\t\t\tcontent += '<tbody>';\n\t\t\t\t\t\t\tfor ( r = 0; r < payload.length; r++ ) {\t\n\t\t\t\t\t\t\t\tcontent += '<tr>';\n\t\t\t\t\t\t\t\t\tcontent += '<td style=\"vertical-align: middle;\" width=\"40%\">' + payload[r].name + '</td>';\n\t\t\t\t\t\t\t\t\tcontent += '<td style=\"vertical-align: middle;\">' + payload[r].description + '</td>';\n\t\t\t\t\t\t\t\t\tcontent += '<td style=\"text-align: center;\"><button type=\"button\" class=\"btn btn-sm  btn-primary\" onclick=\"remoteSQLFileLoad(\\'' + payload[r].fileName + '\\');\">Load</button></td>';\n\t\t\t\t\t\t\t\tcontent += '</tr>';\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t}\t\n\t\t\t\t\t\t\tcontent += '</tbody>';\n\t\t\t\t\t\tcontent += '</table>';\n\t\t\t\t\tcontent += '</div>';\t\n\t\t\t\t\t\n\t\t\t\t\tdocument.getElementById('remoteSQLFilesList').innerHTML = content;\n\t\t\t\t\t\n\t\t\t\t\tif ( " + datatablesEnabled + " ) {\n\t\t\t\t\t\t$('#remoteFilesTable').DataTable();\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t} else {\t\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t\tvar content = '<h5 class=\"text-danger\">Error</h5>';\n\t\t\t\t\tcontent += '<pre>';\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\tcontent += 'XHR Error: Status ' + xhr.status;\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\tdocument.getElementById('remoteSQLFilesList').innerHTML = content;\n\t\t\t\t\n\t\t\t\t}\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t}\n\t";
    }
    function jsFunctionRemoteSQLFileLoad() {
        return "\n\n\t\tfunction remoteSQLFileLoad( filename ) {\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\t\t\t\t\t\t\n\t\t\txhr.open( 'GET', 'https://suiteql.s3.us-east-1.amazonaws.com/queries/' + filename+ '?nonce=' + new Date().getTime(), true );\n\t\t\t\n\t\t\txhr.send();\n\t\t\t\n\t\t\txhr.onload = function() {\n\t\t\t\n\t\t\t\tvar content = '';\n\t\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\tdocument.getElementById('query').value = xhr.response;\n\t\t\t\t\t\n\t\t\t\t\tqueryTextAreaResize();\n\t\t\t\t\t\n\t\t\t\t\t$('#remoteLoadModal').modal('toggle');\n\t\t\t\t\t\n\t\t\t\t\tdocument.getElementById('resultsDiv').style.display = \"none\";\t\t\t\n\t\t\t\t\t\n\t\t\t\t\tactiveSQLFile.source = 'Remote SQL Library';\n\t\t\t\t\tactiveSQLFile.fileName = filename;\n\t\t\t\t\tactiveSQLFile.sql = xhr.response;\n\t\t\t\t\tfileInfoRefresh();\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\t\n\t\t\t\t\talert( 'XHR Error: Status ' + xhr.status );\n\t\t\t\t\n\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t}\n\t\t\n\t";
    }
    function jsFunctionResponseDataCopy() {
        return "\n\t\tfunction responseDataCopy() {\n\t\t\tvar copyText = document.getElementById(\"responseData\");\n\t\t\tcopyText.select(); \n\t\t\tdocument.execCommand(\"copy\");\n\t\t\treturn false;\n\t\t}\t\t\n\t";
    }
    function jsFunctionResponseGenerate() {
        return "\n\t\n\t\tfunction responseGenerate() {\n\t\t\n\t\t\t$('#templateHeaderRow').hide();\n\t\t\t$('#templateFormRow').hide();\t\t\t\n\t\t\n\t\t\tswitch ( radioFieldValueGet( 'resultsFormat' ) ) {\n\n\t\t\t\tcase 'csv':\n\t\t\t\t\tresponseGenerateCSV();\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\tbreak;\t\n\n\t\t\t\tcase 'json':\n\t\t\t\t\tresponseGenerateJSON();\n\t\t\t\t\tbreak;\t\n\t\t\t\t\t\n\t\t\t\tcase 'pdf':\n\t\t\t\t\t$('#templateHeaderRow').show();\n\t\t\t\t\t$('#templateFormRow').show();\n\t\t\t\t\tresponseGenerateTable();\n\t\t\t\t\tbreak;\t\n\t\t\t\t\t\n\t\t\t\tcase 'html':\n\t\t\t\t\t$('#templateHeaderRow').show();\n\t\t\t\t\t$('#templateFormRow').show();\n\t\t\t\t\tresponseGenerateTable();\n\t\t\t\t\tbreak;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\n\t\t\t\tdefault:\t\t\t\t\t\t\t\t\n\t\t\t\t\tresponseGenerateTable();\n\n\t\t\t} \t\n\t\t\t\n\t\t}\t\n\t\t\t\t\t\n\t";
    }
    function jsFunctionResponseGenerateCSV() {
        return "\n\t\n\t\tfunction responseGenerateCSV() {\t\t\n\t\t\n\t\t\tdocument.getElementById('nullFormatDiv').style.display = \"none\";\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\tvar columnNames = Object.keys( queryResponsePayload.records[0] );\t\n\t\t\tvar row = '\"' + columnNames.join( '\",\"' ) + '\"';\n\t\t\tvar csv = row + \"\\r\\n\";\n\n\t\t\tfor ( r = 0; r < queryResponsePayload.records.length; r++ ) {\n\n\t\t\t\tvar record = queryResponsePayload.records[r];\n\n\t\t\t\tvar values = [];\n\n\t\t\t\tfor ( c = 0; c < columnNames.length; c++ ) {\n\n\t\t\t\t\tvar column = columnNames[c];\n\n\t\t\t\t\tvar value = record[column];\n\n\t\t\t\t\tif ( value != null ) {\n\t\t\t\t\t\tvalue = value.toString();\n\t\t\t\t\t} else {\n\t\t\t\t\t\tvalue = '';\n\t\t\t\t\t}\n\n\t\t\t\t\tvalues.push( '\"' + value + '\"' );\t\t     \n\n\t\t\t\t}\n\n\t\t\t\tvar row = values.join( ',' );\n\t\t\t\tcsv += row + \"\\r\\n\";\t\t\n\t\t\t\t\n\t\t\t}\t\n\t\t\t\n\t\t\tvar content = '<h5 style=\"margin-bottom: 3px; color: #4d5f79; font-weight: 600;\">Results</h5>';\n\t\t\tcontent += 'Retrieved ' + queryResponsePayload.records.length;\n\t\t\tif ( document.getElementById('returnTotals').checked ) {\n\t\t\t\tcontent += ' of ' + queryResponsePayload.totalRecordCount;\n\t\t\t}\n\t\t\tcontent += ' rows in ' + queryResponsePayload.elapsedTime + 'ms.<br>';\t\t\n\t\t\tcontent += '<p>';\n\t\t\tcontent += ' <a href=\"#\" onclick=\"javascript:responseDataCopy();\">Click here</a> to copy the data.';\n\t\t\tcontent += '</p>';\t\n\t\t\tcontent += '<textarea class=\"form-control small\" id=\"responseData\" name=\"responseData\" rows=\"25\" placeholder=\"Enter your query here.\" autofocus style=\"font-size: 10pt;\">' + csv + '</textarea>';\n\t\t\tcontent += '</div>';\t\n\t\t\t\t\t\t\t\t\t\n\t\t\tdocument.getElementById('resultsDiv').innerHTML = content;\t\t\t\t\t\t\t\n\t\t\n\t\t}\t\n\t\n\t";
    }
    function jsFunctionResponseGenerateJSON() {
        return "\n\t\n\t\tfunction responseGenerateJSON() {\t\n\t\t\n\t\t\tdocument.getElementById('nullFormatDiv').style.display = \"none\";\t\n\t\t\n\t\t\tvar content = '<h5 style=\"margin-bottom: 3px; color: #4d5f79; font-weight: 600;\">Results</h5>';\n\t\t\tcontent += 'Retrieved ' + queryResponsePayload.records.length;\n\t\t\tif ( document.getElementById('returnTotals').checked ) {\n\t\t\t\tcontent += ' of ' + queryResponsePayload.totalRecordCount;\n\t\t\t}\n\t\t\tcontent += ' rows in ' + queryResponsePayload.elapsedTime + 'ms.<br>';\t\n\t\t\tcontent += '<p>';\n\t\t\tcontent += ' <a href=\"#\" onclick=\"javascript:responseDataCopy();\">Click here</a> to copy the data.';\n\t\t\tcontent += '</p>';\t\n\t\t\tcontent += '<textarea class=\"form-control small\" id=\"responseData\" name=\"responseData\" rows=\"25\" placeholder=\"Enter your query here.\" autofocus style=\"font-size: 10pt;\">' + JSON.stringify( queryResponsePayload.records, null, 5 ) + '</textarea>';\n\t\t\tcontent += '</div>';\t\n\t\t\t\n\t\t\tdocument.getElementById('resultsDiv').innerHTML = content;\t\t\t\t\t\t\t\n\t\t\n\t\t}\t\n\t\t\n\t";
    }
    function jsFunctionResponseGenerateTable() {
        return "\n\t\n\t\tfunction responseGenerateTable() {\n\t\t\n\t\t\tdocument.getElementById('nullFormatDiv').style.display = \"block\";\n\t\t\t\t\t\n\t\t\tif ( queryResponsePayload.records.length > 0 ) {\n\t\t\t\t\t\t\t\t\n\t\t\t\tvar columnNames = Object.keys( queryResponsePayload.records[0] );\n\t\t\t\t\n\t\t\t\tvar firstColumnIsRowNumber = false;\n\t\t\t\tvar rowNumbersHidden = false;\n\n\t\t\t\tif ( document.getElementById('enablePagination').checked ) {\n\t\t\t\t\tfirstColumnIsRowNumber = true;\n\t\t\t\t\tif ( document.getElementById('hideRowNumbers').checked ) {\n\t\t\t\t\t\trowNumbersHidden = true;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tvar thead = '<thead class=\"thead-light\">';\n\t\t\t\tthead += '<tr>';\n\t\t\t\tfor ( i = 0; i < columnNames.length; i++ ) {\n\t\t\t\t\tif ( ( i == 0 ) && ( firstColumnIsRowNumber ) && ( rowNumbersHidden === false) ) {\n\t\t\t\t\t\tthead += '<th style=\"text-align: center;\">&nbsp;#&nbsp;</th>';\n\t\t\t\t\t} else if ( ( i == 0 ) && ( firstColumnIsRowNumber ) && ( rowNumbersHidden === true) ) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tthead += '<th>' + columnNames[i] + '</th>';\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tthead += '</tr>';\n\t\t\t\tthead += '</thead>';\n\n\t\t\t\tvar tbody = '<tbody>';\n\t\t\t\tfor ( r = 0; r < queryResponsePayload.records.length; r++ ) {\t\t\n\t\t\t\t\ttbody += '<tr>';\n\t\t\t\t\tfor ( i = 0; i < columnNames.length; i++ ) {\n\t\t\t\t\t\tvar value = queryResponsePayload.records[r][ columnNames[i] ];\n\t\t\t\t\t\tif ( value === null ) {\n\t\t\t\t\t\t\tvar nullFormat = radioFieldValueGet( 'nullFormat' );\n\t\t\t\t\t\t\tif ( nullFormat == 'dimmed' ) {\n\t\t\t\t\t\t\t\tvalue = '<span style=\"color: #ccc;\">' + value + '</span>';\n\t\t\t\t\t\t\t} else if ( nullFormat == 'blank' ) {\n\t\t\t\t\t\t\t\tvalue = '';\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tvalue = 'null';\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif ( ( i == 0 ) && ( firstColumnIsRowNumber ) && ( rowNumbersHidden === false) ) {\n\t\t\t\t\t\t\ttbody += '<td style=\"text-align: center;\">' + value + '</td>';\n\t\t\t\t\t\t} else if ( ( i == 0 ) && ( firstColumnIsRowNumber ) && ( rowNumbersHidden === true) ) {\n\t\t\t\t\t\t\tcontinue;\t\t\t\t\t\t\t\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\ttbody += '<td>' + value + '</td>';\t\t\t\t\t\n\t\t\t\t\t\t}\n\t\t\t\t\t}\t\t\t\t\n\t\t\t\t\ttbody += '</tr>';\t\t\n\t\t\t\t}\t\n\t\t\t\ttbody += '</tbody>';\n\t\t\t\n\t\t\t\tvar content = '<h5 style=\"margin-bottom: 3px; color: #4d5f79; font-weight: 600;\">Results</h5>';\n\t\t\t\tcontent += 'Retrieved ' + queryResponsePayload.records.length;\n\t\t\t\tif ( document.getElementById('returnTotals').checked ) {\n\t\t\t\t\tcontent += ' of ' + queryResponsePayload.totalRecordCount;\n\t\t\t\t}\n\t\t\t\tcontent += ' rows in ' + queryResponsePayload.elapsedTime + 'ms.<br>';\t\n\t\t\t\tcontent += '<div class=\"table-responsive\">';\n\t\t\t\tcontent += '<table class=\"table table-sm table-bordered table-hover table-responsive-sm\" id=\"resultsTable\">';\n\t\t\t\tcontent += thead;\n\t\t\t\tcontent += tbody;\n\t\t\t\tcontent += '</table>';\n\t\t\t\tcontent += '</div>';\t\t\n\n\t\t\t\tdocument.getElementById('resultsDiv').innerHTML = content;\n\t\t\t\n\t\t\t\tif ( radioFieldValueGet( 'resultsFormat' ) == 'datatable' ) {\n\t\t\t\t\t$('#resultsTable').DataTable();\n\t\t\t\t}\n\t\t\t\n\t\t\t} else {\n\t\t\t\n\t\t\t\tdocument.getElementById('resultsDiv').innerHTML = '<h5 class=\"text-warning\">No Records Were Found</h5>';\n\t\t\t\t\n\t\t\t}\n\n\t\t}\t\n\t\t\t\n\t";
    }
    function jsFunctionReturnAllToggle() {
        return "\n\t\n\t\tfunction returnAllToggle() {\n\t\t\n\t\t\tif ( document.getElementById('returnAll').checked ) {\n\t\t\t\tdocument.getElementById('rowRangeDiv').style.display = \"none\";\t\n\t\t\t\tdocument.getElementById('returnRowsP').style.display = \"none\";\t\t\t\t\t\t\n\t\t\t} else {\n\t\t\t\tdocument.getElementById('rowRangeDiv').style.display = \"block\";\n\t\t\t\tdocument.getElementById('returnRowsP').style.display = \"block\";\n\t\t\t}\n\t\t\t\n\t\t}\t\n\t\t\n\t";
    }
    function jsFunctionTableDetailsGet() {
        return "\n\t\n\t\tfunction tableDetailsGet( tableName ) {\n\t\t\n\t\t\tdocument.getElementById('tableInfoColumn').innerHTML = '<h5 style=\"color: green;\">Loading information for ' + tableName + ' table...</h5>';\n\t\t\n\t\t\tvar url = '/app/recordscatalog/rcendpoint.nl?action=getRecordTypeDetail&data=' + encodeURI( JSON.stringify( { scriptId: tableName, detailType: 'SS_ANAL' } ) );\n\t\t\t\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\n\t\t\txhr.open( 'GET', url, true );\n\t\t\t\n\t\t\txhr.send();\n\t\t\t\n\t\t\txhr.onload = function() {\n\t\t\t\t\t\t\t\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\tlet recordDetail = JSON.parse( xhr.response ).data;\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\tcontent = '<h4 style=\"color: #4d5f79; font-weight: 600;\">' + recordDetail.label + ' (\"' + tableName + '\")</h4>';\t\n\t\t\t\t\t\n\t\t\t\t\tcontent += '<h5 style=\"margin-top: 18px; margin-bottom: 6px; color: #4d5f79; font-weight: 600;\">Columns</h5>';\t\n\t\t\t\t\tcontent += '<div class=\"table-responsive\">';\n\t\t\t\t\tcontent += '<table class=\"table table-sm table-bordered table-hover table-responsive-sm\" id=\"tableColumnsTable\">';\t\n\t\t\t\t\tcontent += '<thead class=\"thead-light\">';\n\t\t\t\t\tcontent += '<tr>';\t\n\t\t\t\t\tcontent += '<th>Label</th>';\t\n\t\t\t\t\tcontent += '<th>Name</th>';\t\n\t\t\t\t\tcontent += '<th>Type</th>';\t\n\t\t\t\t\tcontent += '</tr>';\t\n\t\t\t\t\tcontent += '</thead>';\n\t\t\t\t\tcontent += '<tbody>';\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\tfor ( i = 0; i < recordDetail.fields.length; i++ ) {\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\tvar field = recordDetail.fields[i];\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\tif ( field.isColumn ) {;\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tcontent += '<tr>';\t\n\t\t\t\t\t\t\tcontent += '<td>' + field.label + '</td>';\t\n\t\t\t\t\t\t\tcontent += '<td>' + field.id + '</td>';\n\t\t\t\t\t\t\tcontent += '<td>' + field.dataType + '</td>';\n\t\t\t\t\t\t\tcontent += '</tr>';\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t};\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t}\t\t\n\t\t\t\t\tcontent += '</tbody>';\t\t\t\t\t\n\t\t\t\t\tcontent += '</table>';\n\t\t\t\t\tcontent += '</div>';\t\t\t\t\n\n\t\t\t\t\tif ( recordDetail.joins.length > 0 ) {\n\t\t\t\t\t\tcontent += '<h5 style=\"margin-top: 18px; margin-bottom: 6px; color: #4d5f79; font-weight: 600;\">Joins</h5>';\t\n\t\t\t\t\t\tcontent += '<div class=\"table-responsive\">';\n\t\t\t\t\t\tcontent += '<table class=\"table table-sm table-bordered table-hover table-responsive-sm\" id=\"tableJoinsTable\">';\n\t\t\t\t\t\tcontent += '<thead class=\"thead-light\">';\n\t\t\t\t\t\tcontent += '<tr>';\t\n\t\t\t\t\t\tcontent += '<th>Label</th>';\t\n\t\t\t\t\t\tcontent += '<th>Table Name</th>';\t\n\t\t\t\t\t\tcontent += '<th>Cardinality</th>';\n\t\t\t\t\t\tcontent += '<th>Join Pairs</th>';\t\n\t\t\t\t\t\tcontent += '</tr>';\t\t\n\t\t\t\t\t\tcontent += '</thead>';\n\t\t\t\t\t\tcontent += '<tbody>';\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\tfor ( i = 0; i < recordDetail.joins.length; i++ ) {\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tvar join = recordDetail.joins[i];\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tcontent += '<tr>';\t\n\t\t\t\t\t\t\tcontent += '<td>' + join.label + '</td>';\t\n\t\t\t\t\t\t\tcontent += '<td><a href=\"#\" onclick=\"javascript:tableDetailsGet( \\'' + join.sourceTargetType.id + '\\' );\">' + join.sourceTargetType.id + '</a></td>';\n\t\t\t\t\t\t\tcontent += '<td>' + join.cardinality + '</td>';\n\t\t\t\t\t\t\tvar joinInfo = \"\";\n\t\t\t\t\t\t\tfor ( j = 0; j < join.sourceTargetType.joinPairs.length; j++ ) {\t\n\t\t\t\t\t\t\tvar joinPair = join.sourceTargetType.joinPairs[j];\n\t\t\t\t\t\t\tjoinInfo += joinPair.label + '<br>';\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tcontent += '<td>' + joinInfo + '</td>';\n\t\t\t\t\t\t\tcontent += '</tr>';\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t}\t\n\t\t\t\t\t\tcontent += '</tbody>';\t\t\t\t\t\n\t\t\t\t\t\tcontent += '</table>';\t\n\t\t\t\t\t\tcontent += '</div>';\t\n\t\t\t\t\t}\t\n\t\t\t\t\t\n\t\t\t\t\tlet textareaRows = recordDetail.fields.length + 5;\n\t\t\t\t\t\n\t\t\t\t\tcontent += '<h5 style=\"margin-top: 18px; margin-bottom: 6px; color: #4d5f79; font-weight: 600;\">Sample Query</h5>';\n\t\t\t\t\tcontent += '<span style=\"font-size: 11pt;\"><a href=\"#\" onclick=\"javascript:tableQueryCopy();\">Click here</a> to copy the query.</span>';\n\t\t\t\t\tcontent += '<textarea class=\"form-control small\" id=\"tableQuery\" name=\"sampleQuery\" rows=\"' + textareaRows + '\" style=\"font-size: 10pt;\">';\n\t\t\t\t\tcontent += 'SELECT\\n';\n\t\t\t\t\tfor ( i = 0; i < recordDetail.fields.length; i++ ) {\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\tvar field = recordDetail.fields[i];\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\tif ( field.isColumn ) {\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tcontent += '\\t' + tableName + '.' + field.id;\n\t\t\t\t\t\t\tif ( ( i + 1 ) < recordDetail.fields.length ) { content += ','; }\t\n\t\t\t\t\t\t\tcontent += '\\n';\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t}\t\t\n\t\t\t\t\tcontent += 'FROM\\n';\t\n\t\t\t\t\tcontent += '\\t' + tableName + '\\n';\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\tcontent += '</textarea>';\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\tdocument.getElementById('tableInfoColumn').innerHTML = content;\t\t\n\t\t\t\t\t\n\t\t\t\t\tif ( " + datatablesEnabled + " ) {\n\t\t\t\t\t\t$('#tableColumnsTable').DataTable();\n\t\t\t\t\t\t$('#tableJoinsTable').DataTable();\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\t\n\t\t\t\t\talert( 'Error: ' + xhr.status );\n\t\t\t\t}\n\t\t\t\t\n\t\t\t}\t\t\t\n\n\t\t}\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t";
    }
    function jsFunctionTableNamesGet() {
        return "\n\t\n\t\tfunction tableNamesGet() {\n\t\t\n\t\t\tvar url = '/app/recordscatalog/rcendpoint.nl?action=getRecordTypes&data=' + encodeURI( JSON.stringify( { structureType: 'FLAT' } ) );\n\t\t\t\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\n\t\t\txhr.open( 'GET', url, true );\n\t\t\t\n\t\t\txhr.send();\n\t\t\t\n\t\t\txhr.onload = function() {\n\t\t\t\t\t\t\t\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\tlet recordTypes = JSON.parse( xhr.response ).data;\n\t\t\t\t\t\n\t\t\t\t\tcontent = '<div class=\"table-responsive\">';\n\t\t\t\t\t\tcontent += '<table class=\"table table-sm table-bordered table-hover table-responsive-sm\" id=\"tableNamesTable\">';\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tcontent += '<thead class=\"thead-light\">';\n\t\t\t\t\t\t\t\tcontent += '<tr>';\n\t\t\t\t\t\t\t\t\tcontent += '<th>Table</th>';\n\t\t\t\t\t\t\t\tcontent += '</tr>';\n\t\t\t\t\t\t\tcontent += '</thead>';\n\t\t\t\t\t\t\tcontent += '<tbody>';\n\t\t\t\t\t\t\tfor ( i = 0; i < recordTypes.length; i++ ) {\t\n\t\t\t\t\t\t\t\tcontent += '<tr>';\n\t\t\t\t\t\t\t\t\tcontent += '<td>';\n\t\t\t\t\t\t\t\t\tcontent += '<a href=\"#\" onclick=\"javascript:tableDetailsGet( \\'' + recordTypes[i].id + '\\' );\" style=\"font-weight: bold;\">' + recordTypes[i].label + '</a><br>';\n\t\t\t\t\t\t\t\t\tcontent += recordTypes[i].id;\n\t\t\t\t\t\t\t\t\tcontent += '</td>';\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\tcontent += '</tr>';\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t}\t\n\t\t\t\t\t\t\tcontent += '</tbody>';\n\t\t\t\t\t\tcontent += '</table>';\n\t\t\t\t\tcontent += '</div>';\n\n\t\t\t\t\tdocument.getElementById('tablesColumn').innerHTML = content;\t\n\t\t\t\t\t\n\t\t\t\t\tif ( " + datatablesEnabled + " ) {\n\t\t\t\t\t\t$('#tableNamesTable').DataTable();\n\t\t\t\t\t}\n\t\t\t\t\n\t\t\t\t} else {\t\t\t\t\n\t\t\t\t\talert( 'Error: ' + xhr.status );\n\t\t\t\t}\n\t\t\t\t\n\t\t\t}\t\t\t\n\n\t\t}\n\t\t\t\n\t";
    }
    function jsFunctionTableQueryCopy() {
        return "\n\t\tfunction tableQueryCopy() {\n\t\t\tvar copyText = document.getElementById(\"tableQuery\");\n\t\t\tcopyText.select(); \n\t\t\tdocument.execCommand(\"copy\");\n\t\t\treturn false;\t\t\t\t\t\n\t\t}\t\t\n\t\n\t";
    }
    function jsFunctiontablesReferenceOpen() {
        return "\n\n\t\tfunction tablesReferenceOpen() {\t\t\n\t\t\twindow.open( \"" + scriptURL + "&function=tablesReference\", \"_tablesRef\" );\t\t\t\n\t\t}\n\t\n\t";
    }
    function jsFunctionWorkbooksButton() {
        if (workbooksEnabled === true) {
            return "<button type=\"button\" class=\"btn btn-sm btn-light\" data-toggle=\"modal\" data-target=\"#workbooksModal\">Workbooks</button>";
        }
        else {
            return "";
        }
    }
    function jsFunctionWorkbookLoad() {
        return "\n\t\n\t\tfunction workbookLoad( scriptID ) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\tvar requestPayload = { \n\t\t\t\t'function': 'workbookLoad',\n\t\t\t\t'scriptID': scriptID\n\t\t\t}\n\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\n\t\t\txhr.open( 'POST', '" + scriptURL + "', true );\n\t\t\t\n\t\t\txhr.send( JSON.stringify( requestPayload ) );\n\t\t\t\n\t\t\txhr.onload = function() {\n\t\t\t\t\t\t\t\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\n\t\t\t\t\tworkbookLoadResponsePayload = JSON.parse( xhr.response );\t\n\t\t\t\t\t\n\t\t\t\t\tif ( workbookLoadResponsePayload.error == undefined ) {\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\tdocument.getElementById('query').value = workbookLoadResponsePayload.sql;\n\t\t\t\t\t\t\n\t\t\t\t\t\tqueryTextAreaResize();\n\t\t\t\t\t\t\n\t\t\t\t\t\t$('#workbooksModal').modal('toggle');\n\t\t\t\t\t\t\n\t\t\t\t\t\tdocument.getElementById('resultsDiv').style.display = \"none\";\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\tactiveSQLFile.source = 'Workbook ' + scriptID;\n\t\t\t\t\t\tactiveSQLFile.fileName = '';\n\t\t\t\t\t\tactiveSQLFile.description = '';\n\t\t\t\t\t\tactiveSQLFile.fileID = '';\n\t\t\t\t\t\tactiveSQLFile.sql = workbookLoadResponsePayload.sql;\n\t\t\t\t\t\tfileInfoRefresh();\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t} else {\n\t\t\t\t\t\n\t\t\t\t\t\talert( 'Error: ' + payload.error );\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\t\n\t\t\t\t\talert( 'Error: ' + xhr.status );\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t}\t\t\t\t\t\t\t\n\t\t\n\t\t}\t\n\t\t\n\t";
    }
    function jsFunctionWorkbooksListGet() {
        return "\n\t\n\t\tfunction workbooksListGet() {\t\n\t\t\t\t\t\t\t\t\t\t\n\t\t\tdocument.getElementById('workbooksList').innerHTML = '<h5 style=\"color: green;\">Getting the list of Workbooks...</h5>';\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\tvar requestPayload = { \n\t\t\t\t'function': 'workbooksGet'\n\t\t\t}\n\n\t\t\tvar xhr = new XMLHttpRequest();\n\t\t\t\n\t\t\txhr.open( 'POST', '" + scriptURL + "', true );\n\t\t\t\n\t\t\txhr.send( JSON.stringify( requestPayload ) );\n\t\t\t\n\t\t\txhr.onload = function() {\n\t\t\t\n\t\t\t\tvar content = '';\n\t\t\t\n\t\t\t\tif( xhr.status === 200 ) {\t\n\t\t\t\t\n\t\t\t\t\tpayload = JSON.parse( xhr.response );\n\t\t\t\t\n\t\t\t\t\tif ( payload.error == undefined ) {\t\n\t\t\t\t\t\n\t\t\t\t\t\tcontent = '<div class=\"table-responsive\">';\n\t\t\t\t\t\t\tcontent += '<table id=\"workbooksTable\" class=\"table table-sm table-bordered table-hover table-responsive-sm\">';\n\t\t\t\t\t\t\t\tcontent += '<thead class=\"thead-light\">';\n\t\t\t\t\t\t\t\t\tcontent += '<tr>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<th>Name</th>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<th>Description</th>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<th>Owner</th>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<th></th>';\n\t\t\t\t\t\t\t\t\tcontent += '</tr>';\n\t\t\t\t\t\t\t\tcontent += '</thead>';\n\t\t\t\t\t\t\t\tcontent += '<tbody>';\n\t\t\t\t\t\t\t\tfor ( r = 0; r < payload.records.length; r++ ) {\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tvar description = payload.records[r].description;\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tif( description === null ) { description = ''; }\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\tcontent += '<tr>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<td style=\"vertical-align: middle;\">' + payload.records[r].name + '</td>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<td style=\"vertical-align: middle;\">' + description + '</td>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<td style=\"vertical-align: middle;\">' + payload.records[r].owner + '</td>';\n\t\t\t\t\t\t\t\t\t\tcontent += '<td style=\"text-align: center; vertical-align: middle;\"><button type=\"button\" class=\"btn btn-sm  btn-primary\" onclick=\"workbookLoad(\\'' + payload.records[r].scriptid + '\\');\" >Load</button></td>';\n\t\t\t\t\t\t\t\t\tcontent += '</tr>';\t\t\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t}\t\n\t\t\t\t\t\t\t\tcontent += '</tbody>';\n\t\t\t\t\t\t\tcontent += '</table>';\n\t\t\t\t\t\tcontent += '</div>';\n\t\t\t\t\t\t\n\t\t\t\t\t\tdocument.getElementById('workbooksList').innerHTML = content;\n\t\t\t\t\t\n\t\t\t\t\t\tif ( " + datatablesEnabled + " ) {\n\t\t\t\t\t\t\t$('#workbooksTable').DataTable();\n\t\t\t\t\t\t}\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t} else {\n\t\t\t\t\t\n\t\t\t\t\t\tif ( payload.error == 'No Workbooks' ) {\n\t\t\t\t\t\t\n\t\t\t\t\t\t\tcontent += '<p class=\"text-danger\">No workbooks were found.</p>';\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tdocument.getElementById('workbooksList').innerHTML = content;\n\t\t\t\t\t\t\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\n\t\t\t\t\t\t\tcontent = '<h5 class=\"text-danger\">Error</h5>';\n\t\t\t\t\t\t\tcontent += '<pre>';\n\t\t\t\t\t\t\tcontent += payload.error;\n\t\t\t\t\t\t\tcontent += '</pre>';\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tdocument.getElementById('workbooksList').innerHTML = content;\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t}\t\n\t\t\t\t\t\n\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t} else {\n\t\t\t\t\n\t\t\t\t\tvar content = '<h5 class=\"text-danger\">Error</h5>';\n\t\t\t\t\tcontent += '<pre>';\n\t\t\t\t\tcontent += 'XHR Error: Status ' + xhr.status;\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\tdocument.getElementById('workbooksList').innerHTML = content;\t\t\n\t\t\t\t\n\t\t\t\t}\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t}\t\n\t\t\t\n\t";
    }
    function localLibraryFilesGet(context) {
        var responsePayload;
        var sql = "\n\t\tSELECT\n\t\t\tID,\n\t\t\tName,\n\t\t\tDescription\n\t\tFROM\n\t\t\tFile\n\t\tWHERE \n\t\t\t( Folder = ? )\n\t\tORDER BY \n\t\t\tName\n\t";
        var queryResults = query.runSuiteQL({ query: sql, params: [queryFolderID] });
        var records = queryResults.asMappedResults();
        if (records.length > 0) {
            responsePayload = { records: records };
        }
        else {
            responsePayload = { error: "No SQL Files" };
        }
        context.response.write(JSON.stringify(responsePayload, null, 5));
    }
    function postRequestHandle(context) {
        var requestPayload = JSON.parse(context.request.body);
        context.response.setHeader("Content-Type", "application/json");
        switch (requestPayload["function"]) {
            case "documentSubmit":
                return documentSubmit(context, requestPayload);
                break;
            case "queryExecute":
                return queryExecute(context, requestPayload);
                break;
            case "sqlFileExists":
                return sqlFileExists(context, requestPayload);
                break;
            case "sqlFileLoad":
                return sqlFileLoad(context, requestPayload);
                break;
            case "sqlFileSave":
                return sqlFileSave(context, requestPayload);
                break;
            case "localLibraryFilesGet":
                return localLibraryFilesGet(context);
                break;
            case "workbookLoad":
                return workbookLoad(context, requestPayload);
                break;
            case "workbooksGet":
                return workbooksGet(context);
                break;
            default:
                log.error({ title: "Payload - Unsupported Function", details: requestPayload["function"] });
        }
    }
    function queryExecute(context, requestPayload) {
        try {
            var responsePayload;
            var moreRecords = true;
            var records = new Array();
            var totalRecordCount = 0;
            var queryParams = new Array();
            var paginatedRowBegin = requestPayload.rowBegin;
            var paginatedRowEnd = requestPayload.rowEnd;
            var nestedSQL = requestPayload.query + "\n";
            if (requestPayload.viewsEnabled && queryFolderID !== null) {
                var pattern = /(?:^|\s)\#(\w+)\b/gi;
                var views = nestedSQL.match(pattern);
                if (views !== null && views.length > 0) {
                    for (var i = 0; i < views.length; i++) {
                        var view = views[i].replace(/\s+/g, "");
                        var viewFileName = view.substring(1, view.length) + ".sql";
                        var sql = "SELECT ID FROM File WHERE ( Folder = ? ) AND ( Name = ? )";
                        var queryResults = query.runSuiteQL({ query: sql, params: [queryFolderID, viewFileName] });
                        var files = queryResults.asMappedResults();
                        if (files.length == 1) {
                            var fileObj = file.load({
                                id: files[0].id,
                            });
                            nestedSQL = nestedSQL.replace(view, "( " + fileObj.getContents() + " ) AS " + view.substring(1, view.length));
                        }
                        else {
                            throw {
                                "name:": "UnresolvedViewException",
                                "message": "Unresolved View " + viewFileName,
                            };
                        }
                    }
                }
            }
            var beginTime = new Date().getTime();
            if (requestPayload.paginationEnabled) {
                do {
                    var paginatedSQL = "SELECT * FROM ( SELECT ROWNUM AS ROWNUMBER, * FROM ( " +
                        nestedSQL +
                        " ) ) WHERE ( ROWNUMBER BETWEEN " +
                        paginatedRowBegin +
                        " AND " +
                        paginatedRowEnd +
                        ")";
                    var queryResults_1 = query.runSuiteQL({ query: paginatedSQL, params: queryParams }).asMappedResults();
                    records = records.concat(queryResults_1);
                    if (queryResults_1.length < 5000) {
                        moreRecords = false;
                    }
                    paginatedRowBegin = paginatedRowBegin + 5000;
                } while (moreRecords);
            }
            else {
                log.debug({ title: "nestedSQL", details: nestedSQL });
                records = query.runSuiteQL({ query: nestedSQL, params: queryParams }).asMappedResults();
                log.debug({ title: "records", details: records });
            }
            var elapsedTime = new Date().getTime() - beginTime;
            responsePayload = { records: records, elapsedTime: elapsedTime };
            if (requestPayload.returnTotals) {
                if (records.length > 0) {
                    var paginatedSQL = "SELECT COUNT(*) AS TotalRecordCount FROM ( " + nestedSQL + " )";
                    var queryResults_2 = query.runSuiteQL({ query: paginatedSQL, params: queryParams }).asMappedResults();
                    responsePayload.totalRecordCount = queryResults_2[0].totalrecordcount;
                }
            }
        }
        catch (e) {
            log.error({ title: "queryExecute Error", details: e });
            responsePayload = { error: e };
        }
        context.response.write(JSON.stringify(responsePayload, null, 5));
    }
    function sqlFileExists(context, requestPayload) {
        var responsePayload;
        var sql = "\n\t\tSELECT\n\t\t\tID\n\t\tFROM\n\t\t\tFile\n\t\tWHERE \n\t\t\t( Folder = ? ) AND ( Name = ? )\n\t";
        var queryResults = query.runSuiteQL({ query: sql, params: [queryFolderID, requestPayload.filename] });
        var records = queryResults.asMappedResults();
        if (records.length > 0) {
            responsePayload = { exists: true };
        }
        else {
            responsePayload = { exists: false };
        }
        context.response.write(JSON.stringify(responsePayload, null, 5));
    }
    function sqlFileLoad(context, requestPayload) {
        var responsePayload;
        try {
            var fileObj = file.load({ id: requestPayload.fileID });
            responsePayload = {};
            responsePayload.file = fileObj;
            responsePayload.sql = fileObj.getContents();
        }
        catch (e) {
            log.error({ title: "sqlFileLoad Error", details: e });
            responsePayload = { error: e };
        }
        context.response.write(JSON.stringify(responsePayload, null, 5));
    }
    function sqlFileSave(context, requestPayload) {
        var responsePayload;
        try {
            var fileObj = file.create({
                name: requestPayload.filename,
                contents: requestPayload.contents,
                description: requestPayload.description,
                fileType: file.Type.PLAINTEXT,
                folder: queryFolderID,
                isOnline: false,
            });
            var fileID = fileObj.save();
            responsePayload = {};
            responsePayload.fileID = fileID;
        }
        catch (e) {
            log.error({ title: "sqlFileSave Error", details: e });
            responsePayload = { error: e };
        }
        context.response.write(JSON.stringify(responsePayload, null, 5));
    }
    function workbookLoad(context, requestPayload) {
        var responsePayload;
        try {
            var loadedQuery = query.load({ id: requestPayload.scriptID });
            responsePayload = {};
            responsePayload.sql = loadedQuery.toSuiteQL().query;
        }
        catch (e) {
            log.error({ title: "workbookLoad Error", details: e });
            responsePayload = { error: e };
        }
        context.response.write(JSON.stringify(responsePayload, null, 5));
    }
    function workbooksGet(context) {
        var responsePayload;
        var sql = "\n\t\tSELECT\n\t\t\tScriptID,\n\t\t\tName,\n\t\t\tDescription,\n\t\t\tBUILTIN.DF( Owner ) AS Owner\n\t\tFROM\n\t\t\tUsrSavedSearch\n\t\tORDER BY\n\t\t\tName\n\t";
        var queryResults = query.runSuiteQL({ query: sql, params: [] });
        var records = queryResults.asMappedResults();
        if (records.length > 0) {
            responsePayload = { records: records };
        }
        else {
            responsePayload = { error: "No Workbooks" };
        }
        context.response.write(JSON.stringify(responsePayload, null, 5));
    }
});
