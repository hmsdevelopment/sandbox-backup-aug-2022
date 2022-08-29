/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search'],
    /**
     * @param{serverWidget} serverWidget
     */
    function(search) {

        // var dynamicHelp = {
        //     "custevent_caller_phone_number": "This should be the main phone number",
        //     "custevent_agent_mobile_number": "This should be mobile phone number",
        //     "custevent_assistant_name": "This should be a person that offers to wash your car",
        //     "custevent_assistant_phone_number": "The number to call for people who are not afraid of no ghosts",
        //     "custevent_caller_email": "An email to spam",
        //     "custevent_caller_name": "This field will never get referenced",
        //     "custevent_caller_name_display": "This is the NetSuite UI name when dealing with a jQuery call",
        //     "custevent_property_display": "This was for Jeff demo"
        // };

        var dynamicHelp = {};


        function pageInit(scriptContext){
            console.log("starting page init");
            jQuery('#dh_container').hide();
            var rec = scriptContext.currentRecord;
            console.log("record type = " + rec.type);


            var helpSearch = search.create({
                type: "customrecord_hms_dynamic_help",
                filters:
                    [
                        ["custrecord_hms_dh_record_id","is","supportcase"]
                    ],
                columns:
                    [
                        "name",
                        search.createColumn({
                            name: "custrecord_hms_dh_record_id",
                            sort: search.Sort.ASC
                        }),
                        "custrecord_hms_dh_field_id",
                        "custrecord_hms_dh_criteria_field",
                        "custrecord_hms_dh_criteria_value",
                        "custrecord_hms_dh_help_message"
                    ]
            });

            var helpSearchCount = helpSearch.runPaged().count;
            console.log("Dynamic Help Items Found: " + helpSearchCount);

            helpSearch.run().each(function(result){
                // .run().each has a limit of 4,000 results

                var title = result.getValue("name");
                var fieldId = result.getValue("custrecord_hms_dh_field_id");
                var criteriaFieldId = result.getValue("custrecord_hms_dh_criteria_field");
                var criteriaValue = result.getValue("custrecord_hms_dh_criteria_value");
                var helpMessage = result.getValue("custrecord_hms_dh_help_message");

                helpDetails = {
                    title:title,
                    criteria_field: criteriaFieldId,
                    criteria_value: criteriaValue,
                    help_message: helpMessage
                }

                console.log(helpDetails);

                if(!dynamicHelp[fieldId]){
                    dynamicHelp[fieldId] = [];
                }

                dynamicHelp[fieldId].push(helpDetails);


                return true;
            });

            console.log("========================dynamicHelp============================");
            console.log(dynamicHelp);




            jQuery('input').focus(function(){
                console.log("Hello : " + this.id);

                dh = handleDynamicHelp(rec, this.id);

               console.log("========dh===========");
               console.log(dh);


                if(dh.displayHelp == true){

                    var pos = jQuery(this).offset();
                    var width = jQuery(this).outerWidth();

                    var helpText = dynamicHelp[this.id];

                    console.log("helpText: " + helpText);

                    jQuery('#dh_header').text(dh.title);
                    jQuery('#dh_help_text').html(dh.help_message);

                    jQuery('#dh_container').css({
                        position: "absolute",
                        top: pos.top + "px",
                        left: (pos.left + width) + "px",
                        zIndex: "1000"
                    }).show();
                }else{
                    console.log("No help needed for : " + this.id);
                }

            }).focusout(function(){
                if(dynamicHelp[this.id]){
                    jQuery('#dh_container').hide();
                }else{
                    console.log("Nothing to hide for : " + this.id);
                }

                console.log("Goodbye : " + this.id);
            });


            console.log("exit page init");
            return true;

        }

        function handleDynamicHelp(rec, fldId){


            if(!dynamicHelp[fldId])
                return {displayHelp:false};

            var arrHelpOptions = dynamicHelp[fldId];
            var returnMessage = {};

            for(var i=0;i<arrHelpOptions.length;i++){
                var helpDetail = arrHelpOptions[i];
                var title = helpDetail.title;
                var criteriaFieldId = helpDetail.criteria_field;
                var criteriaValue = helpDetail.criteria_value;
                var helpMessage = helpDetail.help_message;

                if(criteriaFieldId == ""){
                    returnMessage = {
                        displayHelp:true,
                        title:title,
                        criteria_field: criteriaFieldId,
                        criteria_value: criteriaValue,
                        help_message: helpMessage
                    }
                }

                if(criteriaFieldId && criteriaValue){
                    var valueFromNS = rec.getValue(criteriaFieldId);
                    if(valueFromNS==criteriaValue){
                        returnMessage = {
                            displayHelp:true,
                            title:title,
                            criteria_field: criteriaFieldId,
                            criteria_value: criteriaValue,
                            help_message: helpMessage
                        }

                        return returnMessage;
                    }
                }


            }

            return returnMessage;


        }

        return {
            pageInit : pageInit
        };



    });