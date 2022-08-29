/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["require", "exports", "N/log", "N/query"], function (require, exports, log, query) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    function onRequest(pContext) {
        var searchRecordType = 'customrecord_property_record';
        var isQuery = false;
        var myQueryResults = runQuery();
        log.debug('queryresults', myQueryResults);
        /* 	let mainForm = serverWidget.createList({
            title: 'mainlist',
            hideNavBar: false,
        });
        //mainForm.style = serverWidget.ListStyle.GRID;
        let columnObj = [];
    
        columnObj[0] = {
            name: 'custrecord12',
            label: 'Builder Division',
        };
    
        columnObj[1] = {
            name: 'custrecordcustrecordsubdname',
            label: 'Subd',
        };
    
        columnObj[2] = {
            name: 'formulatext',
            formula: "{custrecord_house_number} || ' ' || {custrecord31}",
            label: 'Address',
        };
    
        let filterObj = [];
    
        filterObj[0] = search.createFilter({
            name: 'custrecord12',
            operator: search.Operator.IS,
            values: '3675',
        });
    
        for (const key in columnObj) {
            if (Object.prototype.hasOwnProperty.call(columnObj, key)) {
                const column = columnObj[key];
                const name = columnObj[key].name;
                let label = name;
                if (columnObj[key].label) {
                    label = columnObj[key].label;
                }
                if (!isQuery) {
                    search.createColumn({
                        name: name,
                        label: label,
                    });
                }
                mainForm.addColumn({
                    id: name,
                    label: label,
                    type: serverWidget.FieldType.TEXT,
                    //align: serverWidget.LayoutJustification.RIGHT,
                });
            }
        }
    
        let mySearch = search.create({
            type: searchRecordType,
            columns: columnObj,
            filters: filterObj,
        });
        //log.debug('objSearch', objSearch);
        let fieldValue;
        let results = [];
    
        let myResultSet = mySearch.run();
        log.debug('length', columnObj.length);
    
        let myResultRange = myResultSet.getRange({ start: 1, end: 5 });
    
        myResultRange.forEach(result => {
            let res = {};
            for (let i = 0; i < columnObj.length; i++) {
                const fieldName = columnObj[i]['name'];
    
                if (result.getText(fieldName)) {
                    res[fieldName] = result.getText(fieldName);
                } else {
                    res[fieldName] = result.getValue(fieldName);
                }
            }
            log.debug('res', res);
            results.push(res);
            return true;
        });
    
        log.debug('results', results);
        //        const name = columnObj[i]['name'];
    
        mainForm.addRows({ rows: results });
        pContext.response.writePage({
            pageObject: mainForm,
        }); */
        return {
            onRequest: onRequest,
        };
    }
    exports.onRequest = onRequest;
    function runQuery() {
        var myQuery = "SELECT property.custrecord12 as division, property.name as name, SystemNote.date as listdate FROM CUSTOMRECORD_PROPERTY_RECORD as property LEFT OUTER JOIN SystemNote on recordtypeid = 18 and property.id = recordid WHERE recordid = 14909 and field = 'CUSTRECORD_LIST_DATE'";
        log.debug('myQuery', myQuery);
        var myResults = query.runSuiteQL({
            query: myQuery,
        });
        return myResults;
    }
});
