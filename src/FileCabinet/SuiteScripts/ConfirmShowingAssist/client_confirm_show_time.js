/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord'],function(currentRecord) {
    var exports = {};
    function pageInit(scriptContext){
        function buttonClk(){
            log.debug({
                title: "Button:",
                details: "Button has been clicked!!"
            })
        }
    };
    function buttonClk(){
        log.debug({
            title: "Button:",
            details: "Button has been clicked!!"
        })
    }
     function saveRecord(scriptContext) {
        
        /*var cRec = scriptContext.currentRecord;
        log.debug("Context: ", scriptContext);
        log.debug("cRec(SaveRec)",cRec);
        var boxValue = cRec.getValue({
            fieldId: "custevent_conf_show_time"
        });
        log.debug("BoxValue: ",boxValue);
        if(boxValue == true){
            log.debug("Clearing Text","Clearing Text");
            cRec.setValue({
                fieldId: "custevent_btn_con_show_time",
                value:""
            });
        }else{
            log.debug("Filling Text", "Filling");
            cRec.setValue({
                fieldId: "custevent_btn_con_show_time",
                value:"This Appointment hasn't been confirmed"
            });
        }*/

      	return true;
    };
    exports.saveRecord = saveRecord;
    exports.buttonClk = buttonClk;
    exports.pageInit = pageInit;
    return exports;
});
