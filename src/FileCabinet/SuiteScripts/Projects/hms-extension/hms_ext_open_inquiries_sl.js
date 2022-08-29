/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/**
 * author <bturk@3eyetech.com>
 * date 2020.08.25
 *
 * description
 * Returns a list of open property inquiries in JSON format
 * to be consumed by the HMS Extension.  This suitelet is
 * call at 5 minute intervals by the extension checking
 * for new inquiries
 *
 * ==========================================================
 * Change Log
 * ==========================================================
 * 2020.08.25 BT initial release
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
            log.debug("Incoming Inquiry List Request");

            var results = [];

            results = handleOpenInquiryRequest();

            context.response.write(JSON.stringify(results));

        }

        function handleOpenInquiryRequest(){

            return mapInquiries(getOpenInquirySearch());

        }

        function mapInquiries(inquirySearch){
            var openInquiries = [];

            var inquiryCount = inquirySearch.runPaged().count;
            log.debug("Open Inquiry Count",inquiryCount);

            inquirySearch.run().each(function(result){
                var currentInquiry = {
                    id:result.getValue({name:"internalid", summary:"GROUP"}),
                    contact: result.getValue({name:"formulatextcontact", summary: "GROUP"}),
                    builder: result.getValue({name:"parent", join:"customer", summary: "GROUP"}),
                    address: result.getValue({name:"formulatextaddress", summary: "GROUP"}),
                    caller: result.getValue({name:"formulatextcaller", summary: "GROUP"}),
                    showing: result.getValue({name:"formulatextshowing", summary: "GROUP"}),
                    inquirydate: result.getValue({name:"startdate", summary: "GROUP"}),
                    callstatus: result.getValue({name:"status", summary: "GROUP"}),
                    incidentdate: result.getValue({name:"startdate", summary: "GROUP"}),
                    currenttime: result.getValue({name:"formulanumerictime", summary: "GROUP"}),
                    showtime: result.getValue({name:"formulanumericshowtime", summary: "GROUP"}),
                    subtraction: result.getValue({name:"formulanumerictimediff", summary: "GROUP"}),
                    threshold: result.getValue({name:"formulatextthreshold", summary: "GROUP"}),
                    emailcount: result.getValue({ name:"internalid", join: "messages", summary:"COUNT" })
                };


                openInquiries.push(currentInquiry);
                return true;
            });
            return openInquiries;
        }

        function getOpenInquirySearch(){
            return search.create({
                type: "supportcase",
                filters:
                    [
                        ["status","anyof","2","3","4","1","9","10"],
                        "AND",
                        ["custevent_builder_sales_rep_subd.custentity1","noneof","3642","3643"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP",
                            label: "Id"
                        }),
                        search.createColumn({
                            name: "formulatextcontact",
                            summary: "GROUP",
                            formula: "CASE {customer.custentity8} WHEN 'T' THEN {custevent_bsr_for_ren} ELSE {activity.custevent_contact_short_first_name} || ' ' || {activity.custevent_contact_short_last_name} END",
                            label: "Contact"
                        }),
                        search.createColumn({
                            name: "parent",
                            join: "customer",
                            summary: "GROUP",
                            label: "Builder"
                        }),
                        search.createColumn({
                            name: "formulatextaddress",
                            summary: "GROUP",
                            formula: "CASE {custevent_subdivision_search} WHEN 'Property' THEN {custevent_property.custrecord_house_number} || ' ' || {custevent_property.custrecord31} WHEN 'Subdivision' THEN {custevent_subdivision.custrecord_subdivision_id} ELSE 'N/A' END",
                            label: "Address"
                        }),
                        search.createColumn({
                            name: "formulatextcaller",
                            summary: "GROUP",
                            formula: "{custevent_caller_name.custrecord_agent_first_name} || ' ' || {custevent_caller_name.custrecord_agent_last_name}",
                            label: "Caller"
                        }),
                        search.createColumn({
                            name: "formulatextshowing",
                            summary: "GROUP",
                            formula: "to_char({custevent_showing_date_scheduled},'fmMM/DD/YYYY') || ' ' || to_char({custevent_showing_time_scheduled},'fmHH:') || to_char({custevent_showing_time_scheduled}, 'MI am')",
                            label: "Showing Date/Time"
                        }),
                        search.createColumn({
                            name: "startdate",
                            summary: "GROUP",
                            sort: search.Sort.DESC,
                            label: "Inquiry Date"
                        }),
                        search.createColumn({name: "status", summary: "GROUP", label: "Call Status"}),
                        search.createColumn({
                            name: "startdate",
                            summary: "GROUP",
                            sort: search.Sort.DESC,
                            label: "Incident Date"
                        }),
                        search.createColumn({
                            name: "formulanumerictime",
                            summary: "GROUP",
                            formula: "TO_CHAR(CURRENT_TIMESTAMP , 'HH24')",
                            label: "Current time"
                        }),
                        search.createColumn({
                            name: "formulanumericshowtime",
                            summary: "GROUP",
                            formula: "TO_CHAR({startdate} , 'HH24')",
                            label: "Showing date time"
                        }),
                        search.createColumn({
                            name: "formulanumerictimediff",
                            summary: "GROUP",
                            formula: "TO_CHAR(CURRENT_TIMESTAMP , 'HH24') - TO_CHAR({startdate} , 'HH24') ",
                            label: "Subtraction"
                        }),
                        search.createColumn({
                            name: "formulatextthreshold",
                            summary: "GROUP",
                            formula: "CASE WHEN (TO_CHAR(CURRENT_TIMESTAMP , 'HH24') - TO_CHAR({startdate} , 'HH24')) < 2 THEN 'less than 2h' ELSE 'not less than 2h' END",
                            label: "Formula"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "messages",
                            summary: "COUNT"
                        })
                    ]
            });

        }

        return {
            onRequest: onRequest
        };

    });




