/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @author HMS Marketing Services
 * @developer Jeff McDonald
 * @contact jmcdonald@hmsmarketingservices.com
 */
define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function saveRecord(pContext) {
        fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 694f55ab070acbc484f1c4ce4f662873d5bb8e64',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "long_url": "https://www.yahoo.com", "domain": "showings.info" })
        })
            .then(function (response) { return response.json(); })
            .then(function (json) {
            pContext.currentRecord.setValue('custevent_short_url', json.id);
        });
    }
    exports.saveRecord = saveRecord;
});
