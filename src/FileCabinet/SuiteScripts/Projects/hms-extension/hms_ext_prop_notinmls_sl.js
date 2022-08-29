/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/**
 * author <bturk183@gmail.com>
 * date 2020.09.12
 *
 * description
 * Returns a list of properties not yet entered in MLS in JSON format
 * to be consumed by the HMS Extension.  This suitelet is
 * call at 5 minute intervals by the extension checking
 * for new inquiries
 *
 * ==========================================================
 * Change Log
 * ==========================================================
 * 2020.09.12 BT initial release
 *
 */
define(["N/record", "N/search"],

    function(record, search) {

        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {
            log.debug("Incoming Property List Request");

            var results = [];

            results = handlePropertyNotInMLSRequest();

            context.response.write(JSON.stringify(results));

        }

        function handlePropertyNotInMLSRequest(){

            return mapProperties(getPropertySearch());

        }

        function mapProperties(propertySearch){
            var arrProperties = [];

            var propertyCount = propertySearch.runPaged().count;
            log.debug("Properties Not in MLS",propertyCount);

            propertySearch.run().each(function(result){
                 var currentProperty = {
                    id:result.getValue({name:"internalid"}),
                    address: result.getValue({name:"formulatextaddress"}),
                    subdivision: result.getText({name:"custrecord_subdivision_id", join:"CUSTRECORDCUSTRECORDSUBDNAME"}),
                    subdivisionId: result.getValue({name:"custrecord_subdivision_id", join:"CUSTRECORDCUSTRECORDSUBDNAME"}),
                    lotnumber: result.getValue({name:"custrecord_lot_number"}),
                    builder: result.getText({name:"custrecord_top_level_builder"}),
                    mlsregion1: result.getText({name:"custrecord15"}),
                    estimatedclosingdate: result.getValue({name:"custrecord_estimated_closing_date"}),
                    propertystatus: result.getText({name:"custrecord_property_status"}),
                    mlsregion2: result.getText({name:"custrecord16"}),
                    enteredmls: result.getValue({name:"custrecord_entered_mls"})
                };


                arrProperties.push(currentProperty);
                return true;
            });
            return arrProperties;
        }

        function getPropertySearch(){
            return search.create({
                type: "customrecord_property_record",
                filters:
                    [
                        [[["isinactive","is","F"],"AND",["custrecord12.isinactive","is","F"],"AND",["custrecord_entered_mls","is","F"],"AND",["custrecord_property_status","noneof","10","7","17","18","13","16"]],"OR",["custrecord_property_status","anyof","6"]],
                        "AND",
                        ["custrecord12","noneof","3642","3643","3678"],
                        "AND",
                        ["custrecord_ready_to_be_entered","is","T"]
                    ],
                columns:
                    [
                        "internalid",
                        search.createColumn({
                            name: "formulatextaddress",
                            formula: "{custrecord_house_number} || ' ' || {custrecord31}"
                        }),
                        search.createColumn({
                            name: "custrecord_subdivision_id",
                            join: "CUSTRECORDCUSTRECORDSUBDNAME"
                        }),
                        "custrecord_lot_number",
                        "custrecord_top_level_builder",
                        search.createColumn({
                            name: "custrecord15",
                            sort: search.Sort.ASC
                        }),
                        search.createColumn({
                            name: "custrecord_estimated_closing_date",
                            sort: search.Sort.ASC
                        }),
                        "custrecord_property_status",
                        "custrecord16",
                        "custrecord_entered_mls"
                    ]
            });

        }

        return {
            onRequest: onRequest
        };

    });




