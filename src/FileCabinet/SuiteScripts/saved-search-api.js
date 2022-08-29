/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope Public
 */
define(["require", "exports", "N/log", "N/search"], function (require, exports, log, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.post = void 0;
    var response; // = new Object();
    function post(request) {
        try {
            if (typeof request.searchID == "undefined" ||
                request.searchID === null ||
                request.searchID == "") {
                throw {
                    type: "error.SavedSearchAPIError",
                    name: "INVALID_REQUEST",
                    message: "No searchID was specified.",
                };
            }
            log.debug("request: ", request);
            var searchObj = search.load({ id: request.searchID });
            response.results = [];
            var resultSet = searchObj.run();
            var start = 0;
            var results = [];
            do {
                results = resultSet.getRange({ start: start, end: start + 1000 });
                start += 1000;
                response.results = response.results.concat(results);
                "";
            } while (results.length);
            return response;
        }
        catch (e) {
            log.debug({ title: "error", details: e });
            var error = {
                type: e.type,
                name: e.name,
                message: e.message
            };
            return error;
        }
    }
    exports.post = post;
});
