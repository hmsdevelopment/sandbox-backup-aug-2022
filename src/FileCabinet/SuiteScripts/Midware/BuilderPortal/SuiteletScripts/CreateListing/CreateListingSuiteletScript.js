var ACCESS_LEVEL = {
    NONE : 1,
    VIEW :  2,
    CREATE :  3,
    EDIT :  4,
}

var PRE_CONFIGURED_IDS = {
    BUILDER_PORTAL_ROLE : {
        RECORD_TYPE : "customrecord_mw_builder_portal_role",
        FIELDS : {
            CATEGORY : "custrecord_mw_bpr_category",
            EXCLUDED_PERSONNEL : "custrecord_mw_bpr_excluded_personnel",
            APPOINTMENTS_ACCESS_LEVEL : "custrecord_mw_bpr_appointments",
            AGENT_SURVEYS_ACCESS_LEVEL : "custrecord_mw_bpr_agent_surveys",
            PERSONNEL_ACCESS_LEVEL : "custrecord_mw_bpr_personnel",
            SUBDIVISIONS_ACCESS_LEVEL : "custrecord_mw_bpr_subdivisions",
            PROPERTIES_ACCESS_LEVEL : "custrecord_mw_bpr_properties",
            BUILDER_PREFERENCES : "custrecord_mw_bpr_builder_prefferences", 
            SUBMIT_SALE : "custrecord_mw_bpr_submit_sale",
            SUBMIT_CLOSING : "custrecord_mw_brp_submit_closing"
        }
    },
    BUILDER_PORTAL : {
        DASHBOARD : {
            TITLE : "Dashboard",
            SCRIPT_ID : "407",
            URL : function(params) { return nlapiResolveURL("SUITELET","407","1",true) + params}
        },
        CREATE_LISTING : {
            TITLE : "Create Listing",
            SCRIPT_ID : "439",
            URL : function(params) { return nlapiResolveURL("SUITELET","439","1",true) + params}
        },
        CREATE_EDIT_LISTING : {
            TITLE : "Create Listing",
            SCRIPT_ID : "259",
            URL : function(params) { return nlapiResolveURL("SUITELET","259","1",true) + params}
        },
        MODIFY_INCOMPLETE_LISTING : {
            TITLE : "Modify Incomplete Listing",
            SCRIPT_ID : "440",
            URL : function(params) { return nlapiResolveURL("SUITELET","440","1",true) + params}
        },
        SUBMIT_SALE : {
            TITLE : 'Submit Sale Information',
            SCRIPT_ID : "467",
            URL : function(params) { return nlapiResolveURL("SUITELET","467","1",true) + params}
        },
        SUBMIT_CLOSING : {
            TITLE : "Submit Closing Information",
            SCRIPT_ID : "469",
            URL : function(params) { return nlapiResolveURL("SUITELET","469","1",true) + params}
        },
        BUILDER_PREFERENCES: {
            TITLE: "Builder Preferences",
            SCRIPT_ID: "1458",
            URL : function(params) { return nlapiResolveURL("SUITELET","1458","1",true) + params}
        },
        LOGIN : {
            TITLE : "User Login",
            SCRIPT_ID : "404",
            URL : function(params) { return nlapiResolveURL("SUITELET","404","1",true) + params}
        },
        RESET_PASSWORD: {
            TITLE : "Forgot password?",
            SCRIPT_ID : "971",
            URL : function(params) { return nlapiResolveURL("SUITELET","971","1",true) + params}
        },
        RESET_PASSWORD_CONFIRMATION: {
            TITLE : "Reset Password",
            SCRIPT_ID : "871",
            URL : function(params) { return nlapiResolveURL("SUITELET","871","1",true) + params}
        },
        ENCRYPT: {
            TITLE : "Encrypt",
            SCRIPT_ID : "405",
            URL : function(params) { return nlapiResolveURL("SUITELET","405","1",true) + params}
        }
    },
    PERSONNEL : {
        CATEGORY : 'category',
        APPOINTMENTS_ACCESS_LEVEL : "custentity_mw_bpr_appointmnets",
        AGENT_SURVEYS_ACCESS_LEVEL : "custentity_mw_bpr_agent_surveys",
        PERSONNEL_ACCESS_LEVEL : "custentity_mw_bpr_personnel",
        SUBDIVISIONS_ACCESS_LEVEL : "custentity_mw_bpr_subdivisions",
        PROPERTIES_ACCESS_LEVEL : "custentity_mw_bpr_properties",
        BUILDER_PREFERENCES : "custentity_mw_bpr_builder_prefferences", 
        SUBMIT_SALE : "custentity_mw_bpr_submit_sale",
        SUBMIT_CLOSING : "custentity_mw_brp_submit_closing"
    }
}


// import * as extendFiles from "../../../../Modules/ExtendFilesFunctions";

function suitelet(request, response) {
    //Test
    try {

        nlapiLogExecution("DEBUG", "cookie",request.getHeader("cookie"));
        var cookieData = ValidateCookies(request.getHeader("cookie"));


        var paramBuilderID = request.getParameter("builderid")
        var paramPartnerID = request.getParameter("partnerid")
        
        nlapiLogExecution("DEBUG", "cookieData",JSON.stringify(cookieData));
        if (!cookieData && !(paramBuilderID&&paramPartnerID)) nlapiSetRedirectURL("SUITELET", 404, 1, true, {});


        else if (request.getMethod() == "GET") {
            nlapiLogExecution("DEBUG", "GET", request.getMethod());
            var builderID = !paramBuilderID ? cookieData["builderid"]:paramBuilderID;
            var propertyID = request.getParameter("propertyid");
            var partnerID = !paramPartnerID? cookieData["partnerid"]: paramPartnerID;

            //check property here

            var validate = validateAccessDivision(builderID,propertyID);
            if (!validate) response.write(makeBuilderPortalErrorPage(partnerID)); 

            else{
                nlapiLogExecution("DEBUG", "builderID : " + builderID + "propertyID : " + propertyID + "partnerID :" + partnerID);

                var permitidhtml = "";
                var photohtml = "";
                if (propertyID != null && propertyID != "" && propertyID != undefined) {
                    var loadPropertyRecord = nlapiLoadRecord("customrecord_property_record", propertyID);
                    var subdivisionvalue = loadPropertyRecord.getFieldValue("custrecordcustrecordsubdname");
                    var lotValue = loadPropertyRecord.getFieldValue("custrecord_lot_number");
                    var streetValue = loadPropertyRecord.getFieldValue("custrecord31");
                    var streetText = loadPropertyRecord.getFieldText("custrecord31");
                    loadPropertyRecord.setFieldValue("custrecord_ready_to_be_entered", "F");
    
                    //----------------------------------------------File grabing code ---------------------
    
                    var urlFile;
    
                    try {
                        var file_id = nlapiLookupField("customrecord_subdivision", subdivisionvalue, "custrecord49");

                        if (file_id){
                            var file_Load = nlapiLoadFile(file_id);
        
                            urlFile = file_Load.getURL();
                        }

                    } catch (error) {
                        var errBody = "Error when loading Market Home Information Sheet from subdivision: " + subdivisionvalue + ". Stack:\n" + JSON.stringify(error);
                        nlapiLogExecution(
                            "ERROR",
                            "ERROR",
                            errBody
                        );
                        nlapiSendEmail(3847, ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"], "Error when loading Market Home Information Sheet", errBody);
                    }
    
                    //---------------------------------------------------------------------------------------
    
                    nlapiLogExecution("DEBUG", "subdivisionvalue", subdivisionvalue);
                    nlapiLogExecution("DEBUG", "streetValue", streetValue);
    
                    var streetRecord = nlapiLoadRecord("customrecord_street_name", streetValue);
                    var streetDirectionValue = streetRecord.getFieldValue("custrecord_prefix");
                    var streetTypeValue = streetRecord.getFieldValue("custrecord_suffix");
                    var streetName = streetRecord.getFieldValue("custrecord_street_name");
    
                    var houseNumberValue = loadPropertyRecord.getFieldValue("custrecord_house_number");
                    var constructionStatusValue = loadPropertyRecord.getFieldValue("custrecord_current_construction");
                    var underRoofValue = loadPropertyRecord.getFieldValue("custrecord_estimated_under_roof_date");
                    var completionDateValue = loadPropertyRecord.getFieldValue("custrecord_estimated_completion_date");
                    var remarksValue = loadPropertyRecord.getFieldValue("custrecord_listing_notes");
                    var notesValue = loadPropertyRecord.getFieldValue("custrecord_general_property_notes");
                    var photoFieldValue = loadPropertyRecord.getFieldValue("custrecord_initial_photo");
                    var permitFieldValue = loadPropertyRecord.getFieldValue("custrecord_permit");
                    var notesFieldValue = loadPropertyRecord.getFieldValue("custrecord_listing_notes");
                    var salesStatusFieldValue = loadPropertyRecord.getFieldValue("custrecord_user_entered_sales_status");
                    var listPriceFieldValue = loadPropertyRecord.getFieldValue("custrecord_current_list_price");
                    var floorplanFieldValue = loadPropertyRecord.getFieldValue("custrecord_floorplan");
                    var floorelevationvalue = loadPropertyRecord.getFieldValue("custrecord_elevation");
                    var propertyListingTypeValue = loadPropertyRecord.getFieldValue("custrecord_listing_type");
                    var buid_or_job = loadPropertyRecord.getFieldValue("custrecord_job_number");
                    var udate = checkNull(underRoofValue);
                    var cdate = checkNull(completionDateValue);
                    var filepermit;
                    if (permitFieldValue) {
                        filepermit = nlapiLoadFile(permitFieldValue);
    
                        var permitidurl = checkNull(filepermit.getURL());
                        if (permitidurl.indexOf("netsuite")<0) permitidurl = 'https://1309901.app.netsuite.com' + permitidurl;
                    }
                    var openimage = "https://1309901.app.netsuite.com/core/media/media.nl?id=44882&c=1309901&h=5a62fc046f555443ae41";
                    var permitidhtml = permitidurl ? "<a href=" + permitidurl + ' target="_blank"><img class="img-size" src=' + openimage + ' alt="Open"  title="open" ></a>' :
                    ":";
                    nlapiLogExecution("DEBUG", "permitidurl", permitidurl);
                    var filephoto;
                    if (photoFieldValue) {
                        filephoto = nlapiLoadFile(photoFieldValue);
                        var photourl = checkNull(filephoto.getURL());
                        if (photourl.indexOf("netsuite")<0) photourl = 'https://1309901.app.netsuite.com' + photourl;
                    }
                    var photohtml = photourl ? "<a href=" + photourl + ' target="_blank"><img class="img-size" src=' + openimage + ' alt="Open"  title="open" ></a>' :
                        "";
                }

                //
                // builder personal information
                //
                var filtersbuilderpersonnel = [];
                var columnsbuilderpersonnel = [];
                columnsbuilderpersonnel.push(new nlobjSearchColumn("firstname"));
                columnsbuilderpersonnel.push(new nlobjSearchColumn("lastname"));
                filtersbuilderpersonnel[0] = new nlobjSearchFilter("custentity1", null, "anyof", builderID);
                filtersbuilderpersonnel[1] = new nlobjSearchFilter("isinactive", null, "is", "F");
                var resultsbuilderpersonnel = nlapiSearchRecord("partner", null, filtersbuilderpersonnel, columnsbuilderpersonnel);
                var builderpersonal = [];
                if (resultsbuilderpersonnel) {
                    for (var a = 0; a < resultsbuilderpersonnel.length; a++) {
                        var lastname = resultsbuilderpersonnel[a].getValue("lastname");
                        var firstname = resultsbuilderpersonnel[a].getValue("firstname");
                        var bperid = resultsbuilderpersonnel[a].getId();
                        //					custpage_builder_personnel.addSelectOption(bperid, lastname+','+firstname);
                        var internalb = [bperid, lastname + "," + firstname];
                        builderpersonal.push(internalb);
                    }
                }

                //buider SubDivision information

                var subdivisionNames = [];
                var subdivisionsIds = [];
                var subdivisionsAbreviations = [];
                var subdivisionsMLSRequirePermit = {};
                var subdivisionImgsReqByMLS = {};
                var subdivisionsmarketingRemarksLimit = {};
                var subdivisionCallbackNumber = {};
                var hreflink = [];
                var link = [];
                var filters = [];
                filters.push(new nlobjSearchFilter("custrecord_builder_division", null, "anyof", builderID));
                filters.push(new nlobjSearchFilter("isinactive", null, "is", "F"));

                var columns = [];
                columns.push(new nlobjSearchColumn("custrecord_subdivision_id")); //0
                columns.push(new nlobjSearchColumn("custrecord49")); //1
                columns.push(new nlobjSearchColumn("custrecord58"));//2
                
                columns.push(new nlobjSearchColumn("custrecord_permit_required", "CUSTRECORD_MLS_REGION_1", null)); //3 MLS Region 1
                columns.push(new nlobjSearchColumn("custrecord_permit_required", "CUSTRECORD_MLS_REGION_2", null)); //4 MLS Region 2
                columns.push(new nlobjSearchColumn("custrecord_hms_number_of_imgs_req_mls", "CUSTRECORD_MLS_REGION_1", null)); //5 # Files req MLS 1
                columns.push(new nlobjSearchColumn("custrecord_hms_number_of_imgs_req_mls", "CUSTRECORD_MLS_REGION_2", null)); //6 # Files req MLS 2
                columns.push(new nlobjSearchColumn("custrecord_remarks_character_limit", "CUSTRECORD_MLS_REGION_1", null)); //7 # MARKETING REMARKS CHARACTER LIMIT MLS 1
                columns.push(new nlobjSearchColumn("custrecord_remarks_character_limit", "CUSTRECORD_MLS_REGION_2", null)); //8 # MARKETING REMARKS CHARACTER LIMIT MLS 2
                var results = nlapiSearchRecord("customrecord_subdivision", null, filters, columns);
                if (results == null) {
                    subdivisionNames.push("No Subdivisions Found for this Builder");
                } else {
                    var fileRecordMap = {};
                    var filesIds = [];
                    for (var i = 0; results != null && results.length > i; i++) {
                        var subdivisionId = results[i].getId();
                        var subdivisionName = results[i].getValue("custrecord_subdivision_id");
                        var subdivisionAbreviation = results[i].getValue("custrecord58");
                        var subdReqPermit = results[i].getValue(columns[3]) == "T" || results[i].getValue(columns[4]) == "T";
                        var subdImagesReqByMLS = Number(results[i].getValue(columns[5])) > Number(results[i].getValue(columns[6])) ? Number(results[i].getValue(columns[5])) : Number(results[i].getValue(columns[6]));
                        var hrefname = results[i].getValue("custrecord49");

                        var marketingRemarksLimitRaw  = results[i].getValue(columns[7]);
                        var marketingRemarksLimit = marketingRemarksLimitRaw && Number(marketingRemarksLimitRaw)? Number(marketingRemarksLimitRaw) : 0;
                        //nlapiLogExecution("DEBUG", "hrefname", hrefname)

                        var contactNumber = "";

                        //BUG. 
                        //The following code doesn't make sense
                        //The contact number will end up being the last one returnned by the for loop
                        //{
                        var mlsNumber = nlapiLookupField("customrecord_subdivision", subdivisionId, "custrecord__subd_hms_callback_number");
                        if (mlsNumber) {
                            contactNumber = mlsNumber;
                        } else {
                            contactNumber = "(855) 467-2255";
                        }




                        //}

                        // var mslId = nlapiLookupField("customer", builderID, "custentity_mls_service_regions");
                        // if (mslId){
                        //     var permitRequiere = nlapiLookupField("location", mslId, "custrecord_permit_required");
                        //     subdReqPermit = permitRequiere == "T";
                        // }
                        subdivisionNames.push(subdivisionName);
                        subdivisionsIds.push(subdivisionId);
                        subdivisionsAbreviations.push(subdivisionAbreviation);
                        // subdivisionsMLSRequirePermit["ReqPermit"] = subdReqPermit;
                        subdivisionsMLSRequirePermit[subdivisionId] = subdReqPermit;
                        subdivisionImgsReqByMLS[subdivisionId] = subdImagesReqByMLS;
                        subdivisionCallbackNumber[subdivisionId] = contactNumber;
                        subdivisionsmarketingRemarksLimit[subdivisionId] = marketingRemarksLimit;

                        var fileLink = "";
                        var domainUrl = "https://1309901.app.netsuite.com";
                        if (hrefname != "" && hrefname != null && hrefname != undefined) {
                            filesIds.push(hrefname);
                            var file = nlapiLoadFile(hrefname);
                            fileLink = file.getURL();

                            fileRecordMap[subdivisionId] = domainUrl + "" + fileLink;
                            //				hreflink.push(domainUrl+''+fileLink);
                        } else {
                            fileRecordMap[subdivisionId] = domainUrl + "" + fileLink;
                            //					hreflink.push(fileLink);
                        }
                    }
                }

                // HERE SUBDIVISION


                var edit_create_text = "Create ";
                if (propertyID) {
                    edit_create_text = "Modify ";
                }
                nlapiLogExecution("DEBUG", "fileRecordMap", JSON.stringify(fileRecordMap));
                nlapiLogExecution("DEBUG", "filesIds", JSON.stringify(filesIds));

                //
                //floor plan
                //
                var floorplanField = [];
                //	  floorplanField.addSelectOption('-1', '', true);

                var floorPlanFilters = new Array();
                floorPlanFilters[0] = new nlobjSearchFilter("isinactive", null, "is", "F");

                var floorPlanColumns = [];
                floorPlanColumns.push(new nlobjSearchColumn("name"));
                var floorPlanID = [];
                var floorPlanResults = nlapiSearchRecord("customrecord_floorplan", null, floorPlanFilters, floorPlanColumns);
                for (var n = 0; floorPlanResults != null && floorPlanResults.length > n; n++) {
                    floorPlanID.push(floorPlanResults[n].getId());
                    //		var floorPlanRecord = nlapiLoadRecord('customrecord_floorplan', floorPlanID);
                    var floorPlanName = floorPlanResults[n].getValue("name");
                    floorplanField.push(floorPlanName);
                }
                var imageLogo =
                    "https://wwwimages2.adobe.com/content/dam/acom/en/legal/images/badges/Get_Adobe_Acrobat_Reader_DC_web_button_158x39.fw.png";

                var resolveURL =
                    "https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=259&deploy=1&compid=1309901&h=86cd4feb2e69c3b74288";
                //var resolveURL = nlapiResolveURL('SUITELET', 259, 1)
                //var resolveURL ='https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=484&deploy=1&partnerid=4958&builderid=3643';

                var html =
                    "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    '	<meta charset="utf-8">' +
                    '		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">' +
                    "	<title>Listing Form</title>" +
                    '	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">' +
                    ' <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" > ' +
                    "<!-- jQuery 3.5.1 -->"+
                    '<script src="'+getNetsuiteFileURL("SuiteScripts/WebResources/jQuery/3.5.1/jquery-3.5.1.min.js")+'"></script>'+
                    " <!-- Bootstrap 4.1.3 css -->" +
                    '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/WebResources/Bootstrap/4.1.3/bootstrap.min.css") + '" >    ' +
                    " <!-- Bootstrap 4.1.3 js -->" +
                    '   <script src="' + getNetsuiteFileURL("SuiteScripts/WebResources/Bootstrap/4.1.3/bootstrap.min.js") + '"></script>    ' +
                    " <!-- jQuery UI 1.12.1 css -->" +
                    '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/WebResources/jQueryUI/1.12.1/jquery-ui.min.css") + '">    ' ;
                //Include the Mains Theme
                html += '<link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/Style_CSS/Styles/Builder Portal/Create/Modify Listing Form/CreateModifyListingForm.css") + '">';
                // html += '<link rel="stylesheet" href="' + BUILDER_PORTAL.CREATE_MODIFY_LISTING.CREATE_MODIFY_LISTING_URL + '">';

                var html =
                    "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    '	<meta charset="utf-8">' +
                    '		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">' +
                    "	<title>Listing Form</title>" +
                    '	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">' +
                    ' <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" > ' +
                    "<!-- jQuery 3.5.1 -->"+
                    '<script src="'+getNetsuiteFileURL("SuiteScripts/WebResources/jQuery/3.5.1/jquery-3.5.1.min.js")+'"></script>'+
                   
                    " <!-- Bootstrap 4.1.3 css -->" +
                    '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/WebResources/Bootstrap/4.1.3/bootstrap.min.css") + '" >    ' +
                    " <!-- Bootstrap 4.1.3 js -->" +
                    '   <script src="' + getNetsuiteFileURL("SuiteScripts/WebResources/Bootstrap/4.1.3/bootstrap.min.js") + '"></script>    ' +
                   

                    '<!-- Moment.js 2.22.2 -->'+
                    '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>'+
                    
                    "<!-- Popper.js -->"
                    '<script src="' + getNetsuiteFileURL("SuiteScripts/WebResources/Popper/1.16.0/popper.min.js") + '"></script>' +

                    '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/tempusdominus-bootstrap-4/5.0.1/js/tempusdominus-bootstrap-4.min.js"></script>'+
                    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tempusdominus-bootstrap-4/5.0.1/css/tempusdominus-bootstrap-4.min.css" />';

                //Include the Mains Theme
                html += '<link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/Style_CSS/Styles/Builder Portal/Create/Modify Listing Form/CreateModifyListingForm.css") + '">';
                // html += '<link rel="stylesheet" href="' + BUILDER_PORTAL.CREATE_MODIFY_LISTING.CREATE_MODIFY_LISTING_URL + '">';

                html +=
                    "" +
                    " <!-- jQuery UI 1.12.1 .js and .css -->" +
                    '<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" integrity="sha512-uto9mlQzrs59VwILcLiRYeLKPPbS/bT71da/OEBYEwcdNUk8jYIy+D176RYoop1Da+f9mvkYrmj5MCLZWEtQuA==" crossorigin="anonymous"></script>'+
                    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" integrity="sha512-aOG0c6nPNzGk+5zjwyJaoRUgCdOrfSDhmMID2u4+OIslr0GjpLKo7Xm0Ao3xmpM4T8AmIouRkqwj1nrdVsLKEQ==" crossorigin="anonymous" />'+
                    //'<script src="' + getNetsuiteFileURL("SuiteScripts/WebResources/jQueryUI/1.12.1/jquery-ui.min.js") + '"></script>' +
                    //'<link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/WebResources/jQueryUI/1.12.1/jquery-ui.min.css") + '" >    ' +

                    '<script src="' + getNetsuiteFileURL("SuiteScripts/Midware/BuilderPortal/SuiteletScripts/CreateListing/Resources/CreateListingFormScript.js") + '"></script>' +
                    "<script>" +
                    "var obj=" + JSON.stringify(fileRecordMap) + ";" +
                    "var subdivisionsRequirePermit = " + JSON.stringify(subdivisionsMLSRequirePermit) + ";" +
                    "var subdivisionsImgsRequiredByMLS = " + JSON.stringify(subdivisionImgsReqByMLS) + ";" +
                    "var subdivisionsmarketingRemarksLimit = " + JSON.stringify(subdivisionsmarketingRemarksLimit) + ";" +
                    "var contactNumbers = " + JSON.stringify(subdivisionCallbackNumber) + ";" +
                    "var suiteletUrl = '" + nlapiResolveURL("SUITELET", 712, 1, "external") + "';" +
                    "var editSuiteletUrl = '" + nlapiResolveURL("SUITELET", 259, 1, "external") + "';" +
                    "/*console.log(JSON.stringify(subdivisionsRequirePermit));*/" +
                    "var subdivision_label_title = '" + subdivision_label_title + "';" +
                    "var lot_number_label_title = '" + lot_number_label_title + "';" +
                    "var house_number_label_title = '" + house_number_label_title + "';" +
                    "var lot_number_label_title = '" + lot_number_label_title + "';" +
                    "var street_name_label_title = '" + street_name_label_title + "';" +
                    "var street_direction_label_title = '" + street_direction_label_title + "';" +
                    "var street_type_label_title = '" + street_type_label_title + "';" +
                    "var list_price_label_title = '" + list_price_label_title + "';" +
                    "var sale_status_label_title = '" + sale_status_label_title + "';" +
                    "var current_construction_status_label_title = '" + current_construction_status_label_title + "';" +
                    "var estimated_under_roof_date_label_title = '" + estimated_under_roof_date_label_title + "';" +
                    "var estimated_completion_date_label_title = '" + estimated_completion_date_label_title + "';" +
                    "var compose_marketing_remarks_label_title = '" + compose_marketing_remarks_label_title + "';" +
                    "var check_corner_lot_label_title = '" + check_corner_lot_label_title + "';" +
                    "var floorplan_label_title = '" + floorplan_label_title + "';" +
                    "var add_floorplan_label_title = '" + add_floorplan_label_title + "';" +
                    "var floorplan_elevation_label_title = '" + floorplan_elevation_label_title + "';" +
                    "var building_permit_file_label_title = '" + building_permit_file_label_title + "';" +
                    "var send_permit_request_to_label_title = '" + send_permit_request_to_label_title + "';" +
                    "var front_elevation_file_label_title = '" + front_elevation_file_label_title + "';" +
                    "var use_rendering_on_file_label_title = '" + use_rendering_on_file_label_title + "';" +
                    "var completed_market_home_info_label_title = '" + completed_market_home_info_label_title + "';" +
                    "var selection_sheet_file_label_title = '" + selection_sheet_file_label_title + "';" +
                    "var change_orders_file_label_title = '" + change_orders_file_label_title + "';" +
                    "var drawings_file_label_title = '" + drawings_file_label_title + "';" +


                    "</script>" +
                    
                    makeSideNavigation(partnerID);
                    if(isPersonelAllowedToNewPortal(partnerID) || isJustThisPersonelAllowedToNewPortal(partnerID)) {html += makeChatra(partnerID);}

                    html += 
                                       
                    "</head>" +
                    "<body>" +
                    // '<div class="overlay" id="overlay"></div>' +
                    '<div id="modal-container" class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">  ' +
                    '    <div class="modal-dialog" role="document">  ' +
                    '        <div class="modal-content">  ' +
                    '            <div class="modal-header" style="backgroud-color:#D4AF37">  ' +
                    '                <h5 class="modal-title" id="modal-title"></h5>  ' +
                    '            </div>  ' +
                    '            <div class="modal-body justify-content-center" id="modal-content-container">  ' +
                    '                <p id="modal-text"></p>  ' +
                    '            </div>  ' +
                    '            <div class="modal-footer justify-content-center">  ' +
                    '                <button id="btn_ok" style="display:none" class="btn btn-primary waves-effect" type="button" onclick="">Ok</button>  ' +
                    '                <button id="btn_yes" style="display:none" class="btn btn-primary waves-effect" onclick="" type="button">Yes</button>  ' +
                    '                <button id="btn_no" style="display:none" class="btn btn-secondary" data-dismiss="modal" onclick="" type="button">No</button>  ' +
                    '            </div>  ' +
                    '        </div>  ' +
                    '    </div>  ' +
                    '</div>  ' +
                    '<input class="form-control"  type="hidden" clas="form-control" name="direction1" value=\'' + streetDirectionValue + '\' id=\'direction1\'>' +
                    '<input class="form-control"  type="hidden" clas="form-control" name="streetType1" value=\'' + streetTypeValue + '\' id=\'streetType1\'>' +
                    '<input class="form-control"  type="hidden" clas="form-control" name="salesstatus1" value=\'' + salesStatusFieldValue + '\' id=\'salesstatus1\'>' +
                    '<input class="form-control"  type="hidden" clas="form-control" name="constructionstatus1" value=\'' + constructionStatusValue + '\' id=\'constructionstatus1\'>' +
                    '<input class="form-control"  type="hidden" clas="form-control" name="floorplan1" value=\'' + floorplanFieldValue + '\' id=\'floorplan1\'>' +
                    '<input class="form-control"  type="hidden" clas="form-control" name="subdivisionval1" value=\'' + subdivisionvalue + '\' id=\'subdivisionval1\'>' +
                    '<input class="form-control"  type="hidden" clas="form-control" name="propertyType1" value=\'' + propertyListingTypeValue + '\' id=\'propertyType1\'>' +
                    '	<div class="wrapper">' +
                    "		<!-- Header Starts Here -->" +
                    '<div class="header col-12 align-middle">' +
                    '    <div class="row header-row">' +
                    '        <div class="col-1 header-div align-self-center" style="text-align: left;">' +
                    '           <a class="navbar-anchor" href="javascript:showSideBar();"><i class="fa fa-bars"></i></a>'+
                    '         </div>' +
                    '        <div class="col-10 header-div">' +
                    '            <header>' + edit_create_text + 'Listing</header>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>' +
                    "		<!-- Header Ends Here -->" +
                    "		<form id='survey-form'  method='POST' enctype=\"multipart/form-data\">" +
                    //'			<h2>Create or Edit Listing</h2>'+
                    '			<button type="reset" value="Reset" class="add">Reset</button>' +
                    "				<button type='submit' class='submit-btn listing-check' onClick='return validatelistprice("+ builderBelongToFischerHomes(builderID)+");' name=\"saveandsubmit\" value =\"checkmark\"  >Save and Submit to HMS</button>" +
                    "<button type='submit' class='submit-btn hms-center' name=\"saveasincomplet\" onClick='return checkModalFischereAndComp("+ builderBelongToFischerHomes(builderID)+ ");'>Save as Incomplete</button>" +
                    '			<div class="qstn-blck-wrap block clearfix" id="qstn-blck-wrap1">' +
                    '				<div class="ques-num">Please Enter the Listing Information Below</div>' +
                    '               <div class="main-cont">				' +
                    '				   <div class="col-sm-12 raw mb20">				' +
                    '					 <div class="row mb20">';


                    
                    if (builderBelongToFischerHomes(builderID) || partnerID=="5205"){
                        html+=  '					 <div class="col-sm-4">' +
                                '					     <label id = "job_number_label" style="display:block;">Job No</label>' +
                                '					     	 <input class=\"form-control full-width\"  type="text" name="job_number" id="job_number" = true placeholder="Job Number"  value="' + (buid_or_job || "") + '"> ' +
                                "					 </div> 	" ;
                    }

                    if (builderBelongToDRHorton(builderID) || partnerID=="5205"){
                        html+=  '					 <div class="col-sm-4">' +
                                '					     <label id = "buid_label" style="display:block;">Buid</label>' +
                                '					     	 <input class=\"form-control full-width\"  type="text" name="buid" id="buid" = true placeholder="Buid"  value="' + (buid_or_job || "") + '"> ' +
                                "					 </div> 	" ;
                    }



                    html+='					 	<div class="col-sm-4">' +
                    '					       	<label id = "subdivision_label" style="display:block;" >Subdivision <b style="color: #ff0000">*</b></label>' +
                    '							<select name=\'recordID\' id="subdivision-select" class="subdiv full-width" form-control" onchange="subdivisionChangeEventHandler(this);" required = true >' +
                    "							  <option></option>";
                for (var j = 0; j < subdivisionNames.length; j++) {
                    html += "<option value=" + subdivisionsIds[j] +  ' id="' +  subdivisionsAbreviations[j] + '">' + subdivisionNames[j] +  "</option>";
                }
                html +=
                    "							</select>" +
                    "						</div>" +
                    '					 <div class="col-sm-4">' +
                    '					     <label id = "lot_number_label" style="display:block;">Lot/Unit No<b style="color: #ff0000">*</b></label>' +
                    "					     	 <input class=\"form-control half-width\"  type='text' name='lotnumber' id='lotnumber' placeholder='Lot/Unit No' value='" +
                    (lotValue || "") +
                    "' required = true  > " +
                    "					 </div> 	" +
                    "				 </div>" +
                    '				   <div class="row mb20">				' +
                    '					 <div class="col-sm-2">' +
                    '					        <label id = "house_number_label" >House No <b style="color: #ff0000">*</b></label>' +
                    '							<input class="form-control full-width"  type="text" placeholder="House No" id="housenumber" name="housenumber" value="' +
                    (houseNumberValue || "") +
                    '" maxlength=6 required=true> ' +
                    "				     </div> 	" +
                    '					 <div class="col-sm-2">' +
                    '					        <label id = "street_direction" >Street Direction</label>' +
                    "							<select name='direction' maxlength=2 id='dir' class=\"form-control full-width\">" +
                    "							  <option></option> " +
                    "							  <option value='4'>North</option>" +
                    "							  <option value='2'>South</option>" +
                    "							  <option value='3'>East</option>" +
                    "							  <option value='1'>West</option>" +
                    "							</select>" +
                    "				     </div> 	" +
                    '					 <div class="col-sm-4">' +
                    '					        <label id = "street_name_label" >Street Name <b style="color: #ff0000">*</b></label>' +
                    '								<div>' +
                    '								<input class="form-control full-width" type="text" id="streetname" name="streetname" placeholder="Street Name" value="' + (streetName || "") + '" required = true> ' +
                    '							</div>' +
                    "					 " +
                    "					 </div> 	" +
                    '					 <div class="col-sm-3">' +
                    '					      <label id = "street_type_label" >Suffix <b style="color: #ff0000">*</b></label>' +
                    '							<select class="form-control full-width" required name="streetType" id="streetType">' +
                    "							  " +
                    "							  <option value=''></option>" +
                    makeSelectOptions("customlist_street_type_suffix", "street suffixes") +
                    "							</select>" +
                    "					 " +
                    "					 </div> 	" +
                    "				   </div>" +
                    '				   <div class="mb20 separator-div"></div>' +
                    '				   <div class="row mb20">				' +
                    '						<div class="col-sm-4 col-md-3 input-group">' +
                    '					 		<label id = "list_price_label" >List Price <b style="color: #ff0000">*</b></label>' +
                    '							<div>' +
                    "								<input class=\"form-control full-width\"  type='text' name='lastprice'  oninput=\"checkDecimals()\" placeholder='List Price'value='" + (listPriceFieldValue || 0) + "'  id='listingprice'  required = true> " +
                    '							</div>' +
                    "				     </div> 	" +
                    '				<div class="col-sm-4 col-md-3 input-group offset-md-1"> ' +
                    '					<label id = "property_type_label" > Property Type <b style="color: #ff0000">*</b></label>' +
                    '							<div>' +
                    '								<select name="propertyType"  class="form-control full-width" required id="propertyType">' +
                    "									<option></option>" +
                    makeSelectOptions("customlist_listing_type", "listing types") +
                    "   							</select>" +
                    '							</div>' +
                    "	             </div>" +
                    '					 <div class="col-sm-4 col-md-3 input-group offset-md-1">' +
                    '					     <label id = "sale_status_label" >Sale Status <b style="color: #ff0000">*</b></label>' +
                    '							<div>' +
                    "						        <select name='salesStatus'required=true id='ss' class=\"form-control full-width\">" +
                    "								 	<option></option>" +
                    '									<option value="1">Available</option>' +
                    '									<option value="2">Pending</option>' +
                    '									<option value="3">Closed</option>' +
                    "								</select>" +
                    '							</div>' +
                    "					 </div> 	" +
                    "				   </div>" +
                    "				  " +
                    "				   " +
                    '				   <div class="row mb20">				' +
                    '					 <div class="col-sm-4 col-md-3 input-group">' +
                    '					         <label id = "current_construction_status_label" >Current Construction Status <b style="color: #ff0000">*</b></label>' +
                    '							<div>' +
                    "								<select class=\"form-control full-width\" name='currentStatus' required id='cs' class=\"form-control\">" +
                    "							 		<option value=''></option>" +
                    makeSelectOptions("customlist_construction_status", "Construction Statuses") +
                    "								</select>" +
                    '							</div>' +
                    "				     </div> 		" +
                    '					 <div class="col-sm-4 col-md-3 input-group offset-md-1">' +
                    '					        <label id = "estimated_under_roof_date_label" >Estimated Under Roof Date</label>' +
                    '							<div>' +
                    "								<input class=\"form-control full-width\"  type='text' name='roofdate' value=\"" + checkNull(udate) + '" id=\'ud\' class="submit-sale-form-control"> ' +
                    '							</div>' +
                    "				     </div> 		" +
                    '					 <div class="col-sm-4 col-md-3 input-group offset-md-1">' +
                    '					        <label id = "estimated_completion_date_label" >Estimated Completion Date</label>' +
                    '							<div>' +
                    "								<input class=\"form-control full-width\"  type='text' name='completiondate'value=\"" + checkNull(cdate) + '" id=\'cd\' onfocusout="adjustyearcd()"> ' +
                    '							</div>' +
                    "				     	</div> 		" +
                    "				   	</div>" + //end row
                    '					<div class="row mb20">				' +
                    '						<div class="col-8 col-md-4">' +
                    '					       	<label style="width:auto;" class id = "compose_marketing_remarks_label" >HMS To Compose Marketing Remarks</label>' +
                    '						</div>' +
                    '						<div class="col align-self-center">' +
                    "							<input  type='checkbox' name='checkboxMarketingRemarks'value=\"" + checkNull(cdate) + "\" id='checkboxMarketingRemarks'> " +
                    '						</div>' +
                    "				   </div>" +
                    '				   		<div class="col-sm-12 row mb20">' +
                    '					        <div style="" class="tooltip col-sm-12 col-md-4"> ' +
                    '								Marketing Remarks <b style="color: #ff0000">*</b><span class="tooltiptext">Enter a Property Description as You Would Like it to Appear in MLS</span>' +
                    '							</div>' +
                    '							<div class="col-sm-12 col-md-8 row">' +
                    '								<div class="col-sm-12 col-md-8">' +
                    "									<textarea style='width:100%; resize:both;' name='remarks' rows='4' cols='32' id='tb' onkeyup='wordCount()' required = true >" + (remarksValue || "") + '</textarea > ' +
                    "								</div> 		" +
                    '								<div class="col-sm-12 col-md-4">' +
                    '									<span id="dd" style="height:fit-content;">Remaining</span> ' +
                    "								</div> 		" +
                    "							</div> 		" +
                    "				   </div>" +
                    '				   <div class="col-sm-12 row mb20">				' +
                    '					        <div class="tooltip col-sm-12 col-md-4">Listing Notes<span class="tooltiptext"> ' +
                    '								Enter Any Notes or special Instructions for the HMS Staff to be Aware of Here</span>' +
                    '							</div>' +
                    '					        <div class="col-sm-12 col-md-8 row"> ' +
                    '					        	<div class="col-12 col-md-8"> ' +
                    "									<textarea style='width:100%;resize:both' name='listingnotes' rows='4' cols='32'  >" + (notesValue || "") + "</textarea > " +
                    "								</div> 		" +
                    "							</div> 		" +
                    "				   	</div>" +
                    '					 <div class="row mb20">' +
                    '						<div class="col-8 col-md-4">' +
                    '					   	   	<label id="check_corner_lot_label" style="width:auto;">Check if this is a corner lot</label>' +
                    "				     	</div> 		" +
                    '						<div class="col align-self-center">' +
                    "							<input type='checkbox' name='checkcornerlot'> " +
                    "				     	</div> 		" +
                    "				     </div> 		" +
                    '				   <div class="mb20 separator-div"></div>' +
                    '				   <div class="row mb20">				' +
                    '					 <div class="col-sm-4 col-md-3 input-group">' +
                    '				   			<div>				' +
                    '					       		<label id = "floorplan_label" ><br><br>Floorplan</label>' +
                    '				   			</div>				' +
                    '				   			<div>				' +
                    "						    	<select class=\"form-control full-width\" name='floorPlanID' id='fp' class='floorpln form-control'>" +
                    "									<option></option> ";
                for (var i = 0; i < floorplanField.length; i++) {
                    html += "<option value=" + floorPlanID[i] + ">" + floorplanField[i] + "</option>";
                }

                html +=
                    "" +
                    "								</select>" +
                    '				   			</div>				' +
                    "				     </div> 		" +
                    '					 <div class="col-sm-4 col-md-3 input-group offset-md-1">' +
                    '					        <label id = "add_floorplan_label" >Add Floorplan <br>(If Not in Floorplan Dropdown)</label>' +
                    '							<div>' +
                    "								<input class=\"form-control full-width\"  id='currnt' type='text' name='currnt' placeholder='Add Floorplan (if not listed above)' > " +
                    '							</div>' +
                    "				     </div> 		" +
                    '					 <div class="col-sm-4 col-md-3 input-group offset-md-1">' +
                    '					        <label id = "floorplan_elevation_label"  ><br><br>Floorplan Elevation</label>' +
                    '							<div>' +
                    "								<input class=\"form-control full-width\"  type='text' name='floorplanelevtion' placeholder='Floorplan Elevation' value='" + (floorelevationvalue || "") + "' > " +
                    '							</div>' +
                    "				     </div> 		" +
                    "                  </div>" +
                    '				   <div class="mb20 separator-div"></div>' +
                    '				   <div class="row mb20" id="permit-file-div">				' +
                    '					 		<div class="col-8 col-md-4 align-self-center mb-2 mb-md-0">' +
                    '					    		<label id = "building_permit_file_label" class="custom-file-ext-label"style="display:inline-block; margin:auto;">Upload Building Permit Here' + permitidhtml + "</label>" +
                    "				        	</div> 		" +
                    '						<div class="col-11  col-md-3 custom-file ml-md-3 mx-sm-auto" style="display:inline">  ' +
                    "							<input  ondragover='dragOver(event);' ondragleave='dragLeave(event);' ondrop='dragLeave(event);' style='width:255px' name='permithere' id='permithere' class='custom-file-input' type='file' aria-describedby='inputGroupFileAddon01' onchange='fileChanged(event)'> " +
                    '    						<label class="custom-file-label" style="margin:auto;height: auto;" for="permithere" id="permithere-label"  >Drag n Drop</label> ' +
                    "				        </div> 		" +
                    "				   </div>" +
                    '				    <div class="row mb20" id="permit-to">				' +
                    '						<div class="col-8 col-md-4">' +
                    '					         <label id = "send_permit_request_to_label" >Send Permit Request To <span>(Select someone to send a request for a building permit here)</span></label>' +
                    "				     	</div> 		" +
                    '						<div class="col-sm-12 col-md-3 align-self-center">' +
                    '							<select name="builderpersonal" class="form-control" style="width:255px">' +
                    "							  <option></option>";
                for (var i = 0; i < builderpersonal.length; i++) {
                    html += "<option value=" + builderpersonal[i][0] + ">" + builderpersonal[i][1] + "</option>";
                }

                html +=
                    "							</select>	 " +

                    "				     	</div> 		" + '<div class="mb20 separator-div"></div>'+
                    
                    "				   </div>" +
                    '<div id="permit_separator"  class="mb20 separator-div"></div>';

              
                nlapiLogExecution("AUDIT", "Enter Function", "Enter Function");
                nlapiLogExecution("AUDIT", "paramPartnerID", partnerID);
        
                var externalURL = "";
        
                if (propertyID) {
                    externalURL = nlapiLookupField('customrecord_property_record', propertyID, "custrecord_extend_pr_public_upload_link");
                } else {
                    externalURL = nlapiLookupField('partner', partnerID, "custentity_mw_public_link_extfiles");
                }
        
                externalURL = externalURL+"&min=1&hh=1"
                nlapiLogExecution("AUDIT", "externalURL", externalURL);

                if (String(partnerID) == "5205") {

                    // html += extendFiles.addIframe(propertyID, "external-test", "7");

                    html +=  '<div class="col-sm-12 row mb20" id="files-div"> ' +
                    '<table style="width:100%">'+
                    '<tr>'+
                    '<th>'+
                    '   <div class="col-sm-12"> <label id="other_files_label" class="lg"  <label id="other_files_label" class="lg" ' +
                    '   style="display:inline-block">Upload Front Elevation Photo or Rendering</label> ' +
                    '   </div>'+
                    ' </th>'+
                    '<th>'+
                    '            <iframe class="form-control" style="height:78px;" id="external-view-photo" scrolling="no" class="external" src="' + externalURL + '&custrecord_extfile_type_custlist=7' +'" frameBorder="0"></iframe>  '+
                    ' </th> '+
                    '<th>'+
                        "<button type='button' class='btn' style='background: #01723a; border-color: #01723a; color: #ffffff; font-size:14px; margin-left: 25%' onclick='newUpload(\" "+externalURL+'&custrecord_extfile_type_custlist=7' +"\", \"external-view-photo\");'>"+
                            'New Upload'+
                        '</button>'+
                    "</th> "+
                    '</tr>'+
                    '</table>'+
                    '</div>';
                }
               

                html +=    '				    <div class="row mb20">				' +
                    '						<div class="col-8 col-md-4 align-self-center mb-2 mb-md-0">' +
                    '					        <label id = "front_elevation_file_label" class="custom-file-ext-label"style="display:inline-block; margin-top: 20px;"> Upload Front Elevation Photo or Rendering' + photohtml + "</label>" +
                    "				        </div> 		" +
                    '						<div class="col-11 col-md-3 custom-file ml-md-3 mx-sm-auto">' +
                    "							<input ondragover='dragOver(event);' ondragleave='dragLeave(event);' ondrop='dragLeave(event);' name='photoValue' id='photoValue' type='file' class='custom-file-input' aria-describedby='inputGroupFileAddon01' onchange='fileChanged(event)'> " +
                    '    						<label style="height: auto;" class="custom-file-label" for="photoValue" id="photoValue-label"  >Drag n Drop</label> ' +
                    "				        </div> 		" +
                    "				   </div>" ;
                    html +=      '				   <div class="row mb20" id="mls-images-div" style="display:none;"></div>				' +
                    "				   " +
                    '				   <div class="row mb20">				' +
                    '						<div class="col-8 col-md-4">' +
                    '					    	<label id = "use_rendering_on_file_label" >Use Rendering on File with HMS</label>' +
                    "				    	</div> 		" +
                    '						<div class="col align-self-center">' +
                    "					 		<input type='checkbox' name='renderinghms'> " +
                    "				     	</div> 		" +
                    "				   </div>" +
                    '				   <div class="mb20 separator-div"></div>';
                if (!builderBelongToFischerHomes(builderID)) {
                    html +=
                        '          			<div class="raw" id="market-home-sheet-div">				' +
                        '                     <div class="col-sm-12">' +
                        "						<p> " +
                        '							 <a target="_blank" class="sheet" href="' + urlFile + '" id="sheet">Acquire Market Home Information Sheet Here</a>' +
                        '							 <span id="sheet-disabled" class="sheet disabled">Acquire Market Home Information Sheet Here</span> <script>$("#sheet-disabled").hide()</script>' +
                        "						</p>" +
                        '					     <p>You must right click on the "Acquire Market Home Information Sheet Here" button above, select "Save Link As..." or "Save Target As..." and save it to your desktop (or any other temporaray location). Go to your desktop (or wherever you saved it) and open the file you just saved with <a href="http://www.adobe.com/go/getreader" target="_blank"><img src=' + imageLogo + ' alt="Acrobat Reader"  title="Acrobat Reader" ></a> Then fill out and save the newly completed PDF. Finally, upload the PDF below. <p><p>If you are not quite ready to fill out a Market Home Information Sheet, or to fully complete this form you can Save as Incomplete and come back to it later.</p>' +
                        "				     </div>					 " +
                        "				   </div>" +
                        '				   <div class="col-sm-12 row mb20">				' +
                        '					 <div class="col-sm-12">' +
                        '					        <label id = "completed_market_home_info_label" class="lg" style="display:inline-block;margin-top: 25px;" >Upload Completed Market Home Information Sheet</label>' +
                        '						    	<div class="custom-file" style="display:inline">  ' +
                        "									<input  type='file' name='information' id='information'class='custom-file-input' type='file' aria-describedby='inputGroupFileAddon01' onchange='fileChanged(event)'> " +
                        '    								<label class="custom-file-label" for="information" id="information-label" >Choose File</label> ' +
                        "				             	</div> 		" +
                        "			        </div> 		" +
                        "			     </div> 		";

                    // if (String(partnerID) == "5205") {
                    //     html += '<div class="col-sm-12 row mb20" id="files-div"> ' +
                    //     '<table style="width:100%">'+
                    //     '<tr>'+
                    //     '<th>'+
                    //     '   <div class="col-sm-12"> <label id="other_files_label" class="lg"  <label id="other_files_label" class="lg" ' +
                    //     '   style="display:inline-block">Upload Completed Market Home Information Sheet</label> ' +
                    //     '   </div>'+
                    //     ' </th>'+
                    //     '<th>'+
                    //     '            <iframe class="form-control" style="height:78px;" id="external-view" scrolling="no" class="external" src="' + externalURL + '&custrecord_extfile_type_custlist=10' +'" frameBorder="0"></iframe>  '+
                    //     ' </th> '+
                    //     '</tr>'+
                    //     '<tr>'+
                    //     '<th>'+
                    //     ' </table>'+
                    //     '</div>';
                    // }
                }
                    
                html +=
                    '				   <div class="col-sm-12 row mb20">				' +
                    '					 <div class="col-sm-12">' +
                    '					        <label id = "selection_sheet_file_label" class="lg" style="display:inline-block;margin-top: 25px;" >Upload Selection Sheet Here</label>' +
                    '						    <div class="custom-file" style="display:inline">  ' +
                    "								<input ondragover='dragOver(event);' ondragleave='dragLeave(event);' ondrop='dragLeave(event);' type='file' name='selectionSheet' id='selectionSheet'class='custom-file-input' type='file' aria-describedby='inputGroupFileAddon01' onchange='fileChanged(event)'> " +
                    '    							<label style="height: auto;" class="custom-file-label" for="selectionSheet" id="selectionSheet-label" >Drag n Drop</label> ' +
                    "				         	 </div> 		" +
                    "				        </div> 		" +
                    "				     </div> 		" +
                    '				   <div class="col-sm-12 row mb20">				' +
                    '					 <div class="col-sm-12">' +
                    '					        <label id = "change_orders_file_label" class="lg" style="display:inline-block;margin-top: 25px;" >Upload Change Orders Here</label>' +
                    '						    <div class="custom-file" style="display:inline">  ' +
                    "								<input ondragover='dragOver(event);' ondragleave='dragLeave(event);' ondrop='dragLeave(event);' type='file' name='orders' id='orders'class='custom-file-input' type='file' aria-describedby='inputGroupFileAddon01' onchange='fileChanged(event)'> " +
                    '    							<label style="height: auto;" class="custom-file-label" for="orders" id="orders-label" >Drag n Drop</label> ' +
                    "				          </div> 		" +
                    "				         </div> 		" +
                    "				     </div> 		" +
                    '				        <div class="col-sm-12 row mb20">				' +
                    '					    <div class="col-sm-12">' +
                    '					        <label id = "drawings_file_label" class="lg" style="display:inline-block;margin-top: 25px;" >Upload Const. Drawings Here</label>' +
                    '						    <div class="custom-file" style="display:inline">  ' +
                    "								<input ondragover='dragOver(event);' ondragleave='dragLeave(event);' ondrop='dragLeave(event);' type='file' name='drawings' id='drawings'class='custom-file-input' type='file' aria-describedby='inputGroupFileAddon01' onchange='fileChanged(event)'> " +
                    '    							<label style="height: auto;" class="custom-file-label" for="drawings" id="drawings-label" >Drag n Drop</label> ' +
                    "				            </div> 		" +
                    "                       </div> 		" +
                    "				   </div> 		" ;
                    html+= insertMultipleFilesDemoHTML(partnerID, propertyID) +
                    "				   </div>" +
                    "				   " +
                    "				" +
                    "" +
                    "" +
                    '<input class="form-control"  type = "hidden" name = "builderid" id ="builderid" value="' +
                    builderID +
                    '">' +
                    '<input class="form-control"  type = "hidden" name = "propertyiD" id = "propertyiD" value="' +
                    propertyID +
                    '">' +
                    '<input class="form-control"  type = "hidden" name = "partnerid" id = "partnerid" value="' +
                    partnerID +
                    '">' +
                    "		</form>" +
                    "		" +
                    "	</div>" +
                    "	" +
                    "</body>" +
                    "</html>";

                nlapiLogExecution("DEBUG", "Here", "Finish HTML");

                response.write(html);
            }
        } else {
            nlapiLogExecution("DEBUG", "POST", request.getMethod());

            //
            //Geting data from HTML
            //
            var formData = request.getAllParameters();
            // nlapiLogExecution("DEBUG", "request.getAllParameters()", formData.toString());
            nlapiLogExecution("DEBUG", "request.getAllParameters() 2", JSON.stringify(formData));

            var propertyFolder = getPropertyFolder(checkNull(formData.builderid), checkNull(formData.housenumber), checkNull(formData.streetname) + " " + getListTextFromValue(checkNull(formData.streetType), "customlist_street_type_suffix"));

            try {
                var paramKeys = Object.keys(formData);
                
                var paramsObj = {};
                for (var i in paramKeys) {
                    paramsObj[paramKeys[i]] = request.getParameter(paramKeys[i]);
                }
                try {
                    var requestFile = nlapiCreateFile("request", "JSON", JSON.stringify(paramsObj));
                    requestFile.setDescription("form data");
                    requestFile.setFolder(propertyFolder);
                    var requestFileId = nlapiSubmitFile(requestFile);
                    nlapiLogExecution("DEBUG", "Request (form data/post parameters) saved", "File id : " + requestFileId.toString());
                } catch (error) {
                    nlapiLogExecution("ERROR", "Request dump file too large", "Request dump file too large");
                    var errBody = "Error saving request dump file. Request dump file too large\n\n" + JSON.stringify(error, null, 2);
                    nlapiSendEmail(3847, ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"], "Error on Create Listing Form", errBody);
                }
                logFormDataExceptFileContents(paramsObj);
            } catch (error) {
                nlapiLogExecution("ERROR", "ERROR", JSON.stringify(error));
                var errBody = "Error saving request dump file\n\n" + JSON.stringify(error, null, 2);
                nlapiSendEmail(3847, ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"], "Error on Create Listing Form", errBody);
            }

            var builderID = checkNull(formData.builderid);
            nlapiLogExecution("DEBUG", "builderID old", builderID);
            var partnerID = checkNull(formData.partnerid);
            nlapiLogExecution("DEBUG", "partnerID old", partnerID);
            var getpropertyID = checkNull(formData.propertyiD);
            nlapiLogExecution("DEBUG", "getpropertyID old", getpropertyID);
            var subdivisionValue = checkNull(formData.recordID);

            nlapiLogExecution("DEBUG", "subdivisionValue", subdivisionValue);

            var lotValue = checkNull(formData.lotnumber);
            var jobNumber = checkNull(formData.job_number);
            if (jobNumber) jobNumber = jobNumber.replace(/[^A-Za-z0-9 ]/g, '');
            var streetDirectionValue = checkNull(formData.direction);
            var streetNameValue = checkNull(formData.streetname);
            var streetTypeValue = checkNull(formData.streetType);
            var houseNumberValue = checkNull(formData.housenumber);
            var salesStatusValue = checkNull(formData.salesStatus);
            var listPriceFieldValue = Number(checkNull(formData.lastprice));
            var propertyType = checkNull(formData.propertyType);
            var buid = checkNull(formData.buid);

            nlapiLogExecution("DEBUG", "listPriceFieldValue Raw", listPriceFieldValue);
            if (isNaN(listPriceFieldValue)) {
                listPriceFieldValue = 0;
                nlapiLogExecution("DEBUG", "listPriceFieldValue After NaN", listPriceFieldValue);
            }

            var floorplanFieldValue = checkNull(formData.floorPlanID);
            var addFloorplanValue = checkNull(formData.currnt);
            var constructionStatusValue = checkNull(formData.currentStatus);
            var markascomplet = checkNull(formData.saveandsubmit);
            var markasIncomplet = checkNull(formData.saveasincomplet);

            // //nlapiLogExecution("DEBUG", "markascomplet", markascomplet)

            var underRoofValue = checkNull(formData.roofdate);

            nlapiLogExecution("DEBUG", "underRoofValue", underRoofValue);
            //	 	    if (underRoofValue){
            //	    	underRoofValue = underRoofValue.split('/')
            //	        var month=underRoofValue[1]
            //	    	var date=underRoofValue[2]
            //	    	var year=underRoofValue[0]
            //	    	underRoofValue=month+'/'+date+'/'+year;
            //	    }

            var completionDateValue = checkNull(formData.completiondate);

            // nlapiLogExecution("DEBUG", "completionDateValue", completionDateValue)
            //	    	if (completionDateValue){
            //	    		completionDateValue = completionDateValue.split('-')
            //	        var month=completionDateValue[1]
            //	    	var date=completionDateValue[2]
            //	    	var year=completionDateValue[0]
            //	    		completionDateValue=month+'/'+date+'/'+year;
            //	 	    }

            var remarks = checkNull(formData.remarks);
            nlapiLogExecution("DEBUG", "Remark", remarks);
            var listingnotes = checkNull(formData.listingnotes);

            var floorplanelevtion = checkNull(formData.floorplanelevtion);

            var cornerLotValue = checkNull(formData.checkcornerlot);
            if (cornerLotValue == "on") {
                cornerLotValue = "T";
            }

            var permitFieldValue = checkNull(request.getFile("permithere"));

            var photoFieldValue = checkNull(request.getFile("photoValue"));

            var useRenderingValue = checkNull(formData.renderinghms);
            if (useRenderingValue == "on") {
                useRenderingValue = "T";
            }

            //	    var formCompleteValue = checkNull(formData.markproperty);
            //	    			if(useRenderingValue=="on"){
            //
            //	    				useRenderingValue="T";
            //	    			}

            var marketHomeInfoValue = checkNull(request.getFile("information"));

            var selectionSheetValue = checkNull(request.getFile("selectionSheet"));
            nlapiLogExecution("DEBUG", "selection sheet", selectionSheetValue);

            var ordersValue = checkNull(request.getFile("orders"));
            nlapiLogExecution("DEBUG", "orders", ordersValue);

            var drawingsValue = checkNull(request.getFile("drawings"));
            nlapiLogExecution("DEBUG", "drawings", drawingsValue);

            var builderpersonnel = checkNull(formData.builderpersonal);
            nlapiLogExecution("DEBUG", "builderpersonnel", builderpersonnel);

            //	    nlapiLogExecution("DEBUG", "cornerLotValue",cornerLotValue )
            //	     nlapiLogExecution("DEBUG", "useRenderingValue",useRenderingValue )
            ////	     nlapiLogExecution("DEBUG", "completionDateValue",completionDateValue )
            //

            //Get Sales Status text
            var customlist31Search = nlapiSearchRecord(
                "customlist31",
                null, [
                    ["internalidnumber", "equalto", "6"]
                ], [new nlobjSearchColumn("name").setSort(false)]
            );

            var salesStatusText = "";

            if (customlist31Search && customlist31Search[0]) {
                salesStatusText = customlist31Search[0].getValue("name");
            }

            //Get Street Direction text
            var streetDirectionText = null;
            if (streetDirectionValue != null && streetDirectionValue != "") {
                var streetDirectionFilters = new Array();
                streetDirectionFilters[0] = new nlobjSearchFilter("custrecord_prefix", null, "is", streetDirectionValue);
                //nlapiLogExecution("DEBUG", "line", "580");
                var streetDirectionResults = nlapiSearchRecord("customrecord_street_name", null, streetDirectionFilters);
                for (var k = 0; streetDirectionResults != null && k == 0; k++) {
                    var streetDirectionRecord = nlapiLoadRecord("customrecord_street_name", streetDirectionResults[k].getId());
                    streetDirectionText = streetDirectionRecord.getFieldText("custrecord_prefix");
                }
            }
            //Get Subdivision text
            var subdivisionFilters = new Array();
            subdivisionFilters[0] = new nlobjSearchFilter("internalid", null, "is", subdivisionValue);
            //nlapiLogExecution("DEBUG", "line", "591");
            var subdivisionResults = nlapiSearchRecord("customrecord_subdivision", null, subdivisionFilters);
            for (var m = 0; subdivisionResults != null && m == 0; m++) {
                var subdivisionRecord = nlapiLoadRecord("customrecord_subdivision", subdivisionResults[m].getId());
                var subdivisionText = subdivisionRecord.getFieldValue("name");
            }
            //nlapiLogExecution("DEBUG", "line", "598");
            var street = null;
            var filters = [];
            filters[0] = new nlobjSearchFilter("custrecord_street_name", null, "is", streetNameValue);
            filters[1] = new nlobjSearchFilter("custrecord_suffix", null, "anyof", streetTypeValue);
            filters[2] = new nlobjSearchFilter("custrecord_subdivision", null, "anyof", subdivisionValue);
            if (streetDirectionValue != "" && streetDirectionValue != null && streetDirectionValue != "-1") {
                filters[3] = new nlobjSearchFilter("custrecord_prefix", null, "anyof", streetDirectionValue);
            }
            //nlapiLogExecution("DEBUG", "line", "608");
            var streetTypeFilters = new Array();
            streetTypeFilters[0] = new nlobjSearchFilter("custrecord_suffix", null, "is", streetTypeValue);

            var streetTypeResults = nlapiSearchRecord("customrecord_street_name", null, streetTypeFilters);
            //nlapiLogExecution("DEBUG", "line", "613");
            for (var l = 0; streetTypeResults != null && l == 0; l++) {
                var streetTypeRecord = nlapiLoadRecord("customrecord_street_name", streetTypeResults[l].getId());
                var streetTypeText = streetTypeRecord.getFieldText("custrecord_suffix");
            }
            var results = nlapiSearchRecord("customrecord_street_name", null, filters);
            //nlapiLogExecution("DEBUG", "line", "620");
            if (results == null) {
                var newStreetName;
                var createStreetRecord = nlapiCreateRecord("customrecord_street_name");
                createStreetRecord.setFieldValue("custrecord_subdivision", subdivisionValue);
                createStreetRecord.setFieldValue("custrecord_prefix", streetDirectionValue);
                createStreetRecord.setFieldValue("custrecord_suffix", streetTypeValue);
                createStreetRecord.setFieldValue("custrecord_street_name", streetNameValue);
                createStreetRecord.setFieldValue("custrecord_externally_created", "T");

                if (streetDirectionValue == null || streetDirectionValue == "") {
                    newStreetName = streetNameValue + " " + streetTypeText;
                } else {
                    newStreetName = streetNameValue + " " + streetTypeText + " " + streetDirectionText;
                }
                createStreetRecord.setFieldValue("name", newStreetName);
                street = nlapiSubmitRecord(createStreetRecord, true, true);
            }
            //nlapiLogExecution("DEBUG", "line", "643");
            for (var i = 0; results != null && results.length > i; i++) {
                street = results[i].getId();
            }

            if (streetDirectionText != null) {
                var roughStreetName = streetNameValue + " " + streetTypeText + " " + streetDirectionText;
            } else {
                var roughStreetName = streetNameValue + " " + streetTypeText;
            }
            var propertyName = roughStreetName + " " + houseNumberValue + " (" + salesStatusText + ") " + subdivisionText;
            var simpleName = houseNumberValue + " " + roughStreetName;
            var newlyCreatedFloorplan;
            if (addFloorplanValue != null && addFloorplanValue != "" && addFloorplanValue != "-1" && addFloorplanValue != undefined) {
                var newFloorplan = nlapiCreateRecord("customrecord_floorplan");
                newFloorplan.setFieldValue("name", addFloorplanValue);
                newlyCreatedFloorplan = nlapiSubmitRecord(newFloorplan);
            }
            var propertyRecord;
            if (getpropertyID != null && getpropertyID != "" && getpropertyID != undefined && getpropertyID != "null") {
                //nlapiLogExecution("DEBUG", "line", "669");
                propertyRecord = nlapiLoadRecord("customrecord_property_record", getpropertyID);

                //nlapiLogExecution("DEBUG", "line", "671");
            } else {

                var duplicate = checkDuplicates(subdivisionValue,lotValue);

                if (duplicate){
                    nlapiLogExecution("DEBUG", "checkDuplicates", duplicate);

                    response.sendRedirect('SUITELET', formData.script, formData.deploy,null, {h: formData.h, partnerid:partnerID, builderid: builderID});
                    return;
                }
                else{  
                    propertyRecord = nlapiCreateRecord("customrecord_property_record");
                    nlapiLogExecution("DEBUG", "Creating new record", "710");
                }
            }

            //nlapiLogExecution("DEBUG", "line", "678");

            propertyRecord.setFieldValue("name", propertyName);
            //var readyToBeEntered = propertyRecord.getValue('custrecord_ready_to_be_entered');
            propertyRecord.setFieldValue("custrecord_ready_to_be_entered", "F");
            //propertyRecord.setFieldValue('custrecord12', builderDivisionID);
            propertyRecord.setFieldValue("custrecordcustrecordsubdname", subdivisionValue);
            propertyRecord.setFieldValue("custrecord_lot_number", lotValue? lotValue.toString().replace(/\s/g, ''):lotValue);
            nlapiLogExecution("DEBUG", "lotValue submited", lotValue);


            //If property is comp listing
            if (propertyType == 3) {
                propertyRecord.setFieldValue("custrecord_property_status", "17"); // Received
            } else {
                propertyRecord.setFieldValue("custrecord_property_status", "6"); //Awaiting entry into MLS
            }

            //custrecord_date_received, Date Listing Received from Builder
            propertyRecord.setFieldValue("custrecord_date_received", new Date());


            //nlapiLogExecution("DEBUG", "Line No", "782");
            propertyRecord.setFieldValue("custrecord_user_entered_sales_status", salesStatusValue);
            propertyRecord.setFieldValue("custrecord_simple_name", simpleName);
            //nlapiLogExecution("DEBUG", "Line No", "785");
            propertyRecord.setFieldValue("custrecord_house_number", houseNumberValue);
            propertyRecord.setFieldValue("custrecord_current_construction", constructionStatusValue);
            //nlapiLogExecution("DEBUG", "Line No", "788");
            propertyRecord.setFieldValue("custrecord_construction_status_listing", constructionStatusValue);
            //nlapiLogExecution("DEBUG", "Line No", "7931121" + underRoofValue);
            propertyRecord.setFieldValue("custrecord_estimated_under_roof_date", underRoofValue);
            //nlapiLogExecution("DEBUG", "Line No", "795");
            propertyRecord.setFieldValue("custrecord_estimated_completion_date", completionDateValue);
            //nlapiLogExecution("DEBUG", "Line No", "797");

            propertyRecord.setFieldValue("custrecord_listing_notes", remarks);
            //nlapiLogExecution("DEBUG", "Line No", "789");

            propertyRecord.setFieldValue("custrecord_listing_type", propertyType);

            //	newNotes = listingnotes.trim() + '\r---Entered Using script 259';
            //        nlapiLogExecution("DEBUG","newNotes", newNotes);
            propertyRecord.setFieldValue("custrecord_general_property_notes", listingnotes);
            //nlapiLogExecution("DEBUG", "Line No", "798");

            propertyRecord.setFieldValue("custrecord_original_listing_price", listPriceFieldValue);
            //nlapiLogExecution("DEBUG", "Line No", "801");

            propertyRecord.setFieldValue("custrecord_current_list_price", listPriceFieldValue);
            //nlapiLogExecution("DEBUG", "Line No", "793");
            propertyRecord.setFieldValue("custrecord31", street);
            propertyRecord.setFieldValue("customform", "12");
            //nlapiLogExecution("DEBUG", "Line No", "796");
            propertyRecord.setFieldValue("custrecord_elevation", floorplanelevtion);
            propertyRecord.setFieldValue("custrecord_corner_lot", cornerLotValue);
            //nlapiLogExecution("DEBUG", "Line No", "799");
            propertyRecord.setFieldValue("custrecord_use_rendering", useRenderingValue);

            var actualCreated = propertyRecord.getFieldValue("custrecord_created");
            if (actualCreated) propertyRecord.setFieldValue("custrecord_modified", partnerID);
            else propertyRecord.setFieldValue("custrecord_created", partnerID);

            if (jobNumber) propertyRecord.setFieldValue("custrecord_job_number", jobNumber);
            if (buid) propertyRecord.setFieldValue("custrecord_job_number", buid);
            
            //nlapiLogExecution("DEBUG", "Line No", "802");
            if (markascomplet) {
                propertyRecord.setFieldValue("custrecord_ready_to_be_entered", "T");
                //nlapiLogExecution("DEBUG", "Line No", "807");
            } else if (markasIncomplet) {
                propertyRecord.setFieldValue("custrecord_ready_to_be_entered", "F");
                //nlapiLogExecution("DEBUG", "Line No", "811");
            }

            if (floorplanFieldValue != "") {
                propertyRecord.setFieldValue("custrecord_floorplan", floorplanFieldValue);
                //nlapiLogExecution("DEBUG", "Line No", "817");
            } else {
                if (newlyCreatedFloorplan) {
                    propertyRecord.setFieldValue("custrecord_floorplan", newlyCreatedFloorplan);
                } else {
                    nlapiLogExecution("DEBUG", "No floorplan", "No floorplan was added");
                }
            }



            if (marketHomeInfoValue != null && marketHomeInfoValue != "") {
                //nlapiLogExecution("DEBUG", "Line No", "822");
                marketHomeInfoValue.setFolder(propertyFolder);
                var marketHomeInfoFile = nlapiSubmitFile(marketHomeInfoValue);
                propertyRecord.setFieldValue("custrecord_market_home_info", marketHomeInfoFile);
                //nlapiLogExecution("DEBUG", "Line No", "826");
            }

            if (permitFieldValue != null && permitFieldValue != "") {
                //nlapiLogExecution("DEBUG", "Line No", "831");
                permitFieldValue.setFolder(propertyFolder);
                var permitFile = nlapiSubmitFile(permitFieldValue);
                propertyRecord.setFieldValue("custrecord_permit", permitFile);
                //nlapiLogExecution("DEBUG", "Line No", "835");
            }

            if (photoFieldValue != null && photoFieldValue != "") {
                //nlapiLogExecution("DEBUG", "Line No", "841");
                photoFieldValue.setFolder(propertyFolder);
                var photoFile = nlapiSubmitFile(photoFieldValue);
                propertyRecord.setFieldValue("custrecord_initial_photo", photoFile);
                //nlapiLogExecution("DEBUG", "Line No", "845");
            }

            if (selectionSheetValue != null && selectionSheetValue != "") {
                var fileName = selectionSheetValue.getName();
                var fileExtension = fileName.split(".");
                fileName = fileExtension[0] + "_" + new Date().getTime() + "." + fileExtension[1];
                selectionSheetValue.setName(fileName);
                selectionSheetValue.setFolder(propertyFolder); //Information Sheets  old=33792
                nlapiLogExecution("DEBUG", "File selection sheet", selectionSheetValue);
                var selectionSheetFile = nlapiSubmitFile(selectionSheetValue);
                nlapiLogExecution("DEBUG", "File selection sheet file", selectionSheetFile);
            }

            if (drawingsValue != null && drawingsValue != "") {
                //add a timestamp to the name
                var fileName = drawingsValue.getName();
                var fileExtension = fileName.split(".");
                fileName = fileExtension[0] + "_" + new Date().getTime() + "." + fileExtension[1];
                drawingsValue.setName(fileName);
                drawingsValue.setFolder(propertyFolder); //Information Sheets
                var drawingsFile = nlapiSubmitFile(drawingsValue);
                nlapiLogExecution("DEBUG", "File drawings file", drawingsFile);
            }

            if (ordersValue != null && ordersValue != "") {
                //add a timestamp to the name
                var fileName = ordersValue.getName();
                var fileExtension = fileName.split(".");
                fileName = fileExtension[0] + "_" + new Date().getTime() + "." + fileExtension[1];
                ordersValue.setName(fileName);
                ordersValue.setFolder(propertyFolder); //Information Sheets
                var ordersFile = nlapiSubmitFile(ordersValue);
                nlapiLogExecution("DEBUG", "Change Orders file", ordersFile);
            }

            var marketHomeInfoURL = nlapiLookupField("customrecord_subdivision", subdivisionValue, "custrecord49");
            if (marketHomeInfoURL) {
                //nlapiLogExecution("DEBUG", "Line No", "853");
                var filerec = nlapiLoadFile(marketHomeInfoURL);
                marketHomeInfoURL = filerec.getURL();
                //nlapiLogExecution("DEBUG", "Line No", "856");
            }

            //nlapiLogExecution("DEBUG", "Line No", "860");

            //set default reminder to 7 days
            var reminderDate = new Date();
            reminderDate.setDate(reminderDate.getDate() + 7);
            propertyRecord.setFieldValue("custrecord_mw_scheduled_date", reminderDate);

            var notificatioType = !markascomplet? "3" : "1";
            nlapiLogExecution("DEBUG", "notificatioType", notificatioType);
            propertyRecord.setFieldValue("custrecord_mw_sched_notif_type", notificatioType);



            //CREATING RECORD
            var propertyRecordID = nlapiSubmitRecord(propertyRecord, null, true);
            //CREATING RECORD

            //If property type is not comp listing, and is not pending or closed, add note

            //1 : AVailable, 2 : Pending, 3 : Closed
            if (propertyType != 3 && (salesStatusValue == 3 || salesStatusValue == 2)) {
                //This <lisitng type> was submmited as <pending||closedIf> instead of available. Please investigate
                addNoteToPropertyRecord(propertyRecordID, propertyType, salesStatusValue);
            }



            nlapiLogExecution("DEBUG", "propertyRecordID", propertyRecordID);

            // Multiple File Upload Attaching
            //This is for the "additional files at the bottom of the form"

            var params = request.getAllParameters();
            var fileNames = Object.keys(params).filter(function(x) {
                return x.match(/custpage_file_[0-9]*_contents/);
            });
            for (var i = 0; i < fileNames.length; i++) {
                try {
                    var fileJSONStr = params[fileNames[i]];
                    var fileNumber = fileNames[i].match(/custpage_file_([0-9]*)_contents/)[1];
                    var fileJSON = JSON.parse(fileJSONStr);
                    var fileType = getFileTypeId(fileJSON.type);
                    nlapiLogExecution("DEBUG", "File type", fileType);
                    var fileContents = getContentsWithCorrectEncoding(fileJSON);
                    nlapiLogExecution("DEBUG", "Creating file", fileJSON.name);
                    var requestFile = nlapiCreateFile(fileJSON.name, fileType, fileContents);
                    var description = params["description_file_" + fileNumber];
                    if (description) { requestFile.setDescription(params["description_file_" + fileNumber]); };
                    requestFile.setFolder(propertyFolder);
                    var fileId = nlapiSubmitFile(requestFile);
                    nlapiLogExecution("DEBUG", "FILE CREATED", fileId);
                    nlapiAttachRecord("file", fileId, "customrecord_property_record", propertyRecordID);
                } catch (error) {
                    nlapiLogExecution("ERROR", "ADDITIONAL FILES ERROR", JSON.stringify(error));
                    var errBody = "Error saving additional file" + JSON.stringify(error, null, 2);
                    nlapiSendEmail(3847, ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"], "Error on Create Listing Form", errBody);
                    continue;
                }
            }

            // Multiple File Upload Attaching ends


            //Starts MLS Required images storing
            for (var i = 0; i < request.allFiles.length; i++) {
                var currentFileInputId = request.allFiles[i];
                if (currentFileInputId.match(/mls-image-[0-9]+/)) {
                    var imageFile = request.getFile(currentFileInputId);
                    nlapiLogExecution("DEBUG", "MLS File", "Processing file: " + currentFileInputId + ", name :  " + imageFile.getName());
                    imageFile.setFolder(propertyFolder);
                    var imageFileId = nlapiSubmitFile(imageFile);
                    nlapiAttachRecord("file", imageFileId, "customrecord_property_record", propertyRecordID);
                }
            }

            //Ends MLS Required images storing

            if (marketHomeInfoValue != null && marketHomeInfoValue != "") {
                nlapiAttachRecord("file", marketHomeInfoFile, "customrecord_property_record", propertyRecordID);
            }

            if (permitFieldValue != null && permitFieldValue != "") {
                nlapiAttachRecord("file", permitFile, "customrecord_property_record", propertyRecordID);
            }

            if (photoFieldValue != null && photoFieldValue != "") {
                nlapiAttachRecord("file", photoFile, "customrecord_property_record", propertyRecordID);
            }

            if (selectionSheetFile != null && selectionSheetFile != "") {
                nlapiAttachRecord("file", selectionSheetFile, "customrecord_property_record", propertyRecordID);
            }

            if (drawingsFile != null && drawingsFile != "") {
                nlapiAttachRecord("file", drawingsFile, "customrecord_property_record", propertyRecordID);
            }

            if (ordersFile != null && ordersFile != "") {
                nlapiAttachRecord("file", ordersFile, "customrecord_property_record", propertyRecordID);
            }

            nlapiLogExecution("DEBUG", "Start send Emails", "Start send emails");

            //----------- send emails --------------
            var proprecord = nlapiLoadRecord("customrecord_property_record", propertyRecordID);
            var sqFtHouseNo = proprecord.getFieldValue("custrecord_house_number");
            var sqFtStreetName = proprecord.getFieldText("custrecord31");
            var subdiv = proprecord.getFieldValue("custrecordcustrecordsubdname");
            var ptsubdivision = "";
            if (subdiv) {
                ptsubdivision = nlapiLookupField("customrecord_subdivision", subdiv, "custrecord_subdivision_id");
            }
            var ptlotno = proprecord.getFieldValue("custrecord_lot_number");
            //var builderpersonnel = request.getParameter('builderpersonnel') || '';

            if (builderpersonnel) {
                var partnerRecord = nlapiLoadRecord("partner", builderpersonnel);
                var pemail = partnerRecord.getFieldValue("email");
                var attachrecord = {};
                attachrecord["recordtype"] = "customrecord_property_record";
                attachrecord["record"] = propertyRecordID;
                var pformurl = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=218&deploy=1&compid=1309901&h=a10cae482e7d12f43423&pid=' + propertyRecordID;
                if (pemail) {
                    nlapiLogExecution("DEBUG", "Email recipient", pemail)
                    var pemailnotification = 'You have been requested to provide a building permit for ' + sqFtHouseNo + ' ' + sqFtStreetName + ' ' + ptsubdivision + ' lot ' + ptlotno + '.<br><br> Please click the following link to submit it to HMS.<br>';
                    pemailnotification = pemailnotification + '<br><a href="' + pformurl + '">Click Here</a>';
                    nlapiSendEmail("3", pemail, "Request for Building Permit", pemailnotification, null, null, attachrecord);
                }
            }

            nlapiLogExecution("DEBUG", "builderID", builderID);

            //if (builderID==3642 || builderID==3643 || builderID==3693 || builderID==3697 || builderID==3990 || builderID==4192)
            //	{

            var emailMLS = "f";

            var mlsRegion1 = proprecord.getFieldValue("custrecord15");
            nlapiLogExecution("DEBUG", "mlsRegion1", mlsRegion1);
            if (mlsRegion1) {
                var mlsRegion1Letter = nlapiLookupField("location", mlsRegion1, "custrecord_requestsqft_letter");
            }

            var mlsRegion2 = proprecord.getFieldValue("custrecord16");
            nlapiLogExecution("DEBUG", "mlsRegion2", mlsRegion2);
            if (mlsRegion2) {
                var mlsRegion2Letter = nlapiLookupField("location", mlsRegion2, "custrecord_requestsqft_letter");
            }
            nlapiLogExecution("DEBUG", "mlsRegion2Letter", mlsRegion2Letter);

            var sqFtLetter = false;
            var sqFtLetterData = {};

            if (mlsRegion1Letter == "t" || mlsRegion1Letter == "T" || mlsRegion2Letter == "t" || mlsRegion2Letter == "T") {
                sqFtLetter = true;
                var sqFtHouseNo = proprecord.getFieldValue("custrecord_house_number");
                var sqFtStreetName = proprecord.getFieldText("custrecord31");

                sqFtLetterData = {
                    sqFtHouseNo: sqFtHouseNo,
                    sqFtStreetName: sqFtStreetName
                };

                var htmltest = "<!DOCTYPE html>" +
                    "<html>" +
                    "<body>" +
                    '<input class="form-control"  type = "hidden" name = "pthouseno" value=\'' + sqFtHouseNo + '\' id=\'house\'>' +
                    '<input class="form-control"  type = "hidden" name = "ptstreet" value=\'' + sqFtStreetName + '\' id=\'street\'>' +
                    "<p>Columbus MLS requires a square footage letter from an offical builder source. Clicking Submit below will open up a new, prefilled, email in your default email client. That email will be sent to HMS (mlsinfo@hmsmarketingservices.com) stating the square footage. We will then forward that email to Columbus MLS</p>" +
                    'Total Square Footage for : <input class="form-control"  type="text" id="tsq" >' +
                    "" +
                    "<button onclick='myFunction()'>Submit</button>" +
                    "" +
                    "<script>" +
                    "function myFunction() {" +
                    '  var x=  document.getElementById("tsq").value;' +
                    ' var house= document.getElementById("house").value;' +
                    'var street= document.getElementById("street").value;' +
                    "  var mail = 'mailto:mlsinfo@hmsmarketingservices.com?subject= SQ FT Letter for ' + house + ' ' + street + '&body=The square footage for ' + house + ' ' + street + ' is ' + x;" +
                    " document.location.href = mail;" +
                    "  }" +
                    "</script>" +
                    "" +
                    "</body>" +
                    "</html>";

                //SQ Foot card
                //response.write(htmltest);
            }
            //}
            var notifType = propertyRecord.getFieldValue("custrecord_mw_sched_notif_type");
            nlapiLogExecution("DEBUG", "notifType", notifType);

            var newOrIncomplete = proprecord.getFieldValue("custrecord_ready_to_be_entered");
            nlapiLogExecution("DEBUG", "newOrIncomplete", newOrIncomplete);
            //response.write("<script>alert(newOrIncomplete)</script>");

            if (newOrIncomplete == "T") {
                // showSubmitSaleLink = property is type "contract to build" and sale status is either Pending or Closed
                nlapiLogExecution("DEBUG", "Property Type and Sale Status", 'Property Type : ' + propertyType + 'Sale Status : ' + salesStatusValue);
                var showSubmitSaleLink = propertyType == 3 && (salesStatusValue == 3 || salesStatusValue == 2);
                // var label = 'Thank you for submitting this new listing!';
                response.write(getThankYouForm(showSubmitSaleLink, partnerID, builderID, subdivisionValue, propertyRecordID, salesStatusValue, sqFtLetterData,false));
            } else {
                // response.write("<script>alert('Thank you. You may come back and finish entering this listing at any time.')</script>");
                // var label = 'Thank you. You may come back and finish entering this listing at any time.';
                response.write(getThankYouForm(false, partnerID, builderID, subdivisionValue, propertyRecordID, salesStatusValue, {},true));
            }

            return false;
            //			var url="https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=259&deploy=1&builderid="+builderID;
            //			location.href = url;

            //
        }
    } catch (err) {
        var vDebug = "";

        response.write("<script>alert('An error has occurred. " + err + "')</script>");
        nlapiLogExecution("DEBUG", "Catch-error", err);
        nlapiLogExecution("DEBUG", "Catch-error", JSON.stringify(err));
        var errBody = "Error generating view. No view displayed to the user" + JSON.stringify(err, null, 2);
        nlapiSendEmail(3847, ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"], "Error on Create Listing Form", errBody);
    }
}

function checkNull(value) {
    if (!value || value == "" || value == null || value == undefined || value == "undefined" || value == "undefined/undefined/undefined") {
        return "";
    } else {
        return value;
    }
}

function conversion(data, id) {
    if (!data) {
        return "";
    }

    var d = new Date(data);
    nlapiLogExecution("DEBUG", "Date", d);
    //    return d;

    var days = d.getDate();
    nlapiLogExecution("DEBUG", "Days", days);
    var month = d.getMonth() + 1;
    nlapiLogExecution("DEBUG", "Month", month);
    var year = d.getFullYear();
    nlapiLogExecution("DEBUG", "Year ", year);
    if (days < 10) {
        days = "0" + days;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var newDate = year + "-" + month + "-" + days;
    return newDate;
}

function insertMultipleFilesDemoHTML(partnerID, propertyID) {

        nlapiLogExecution("AUDIT", "Enter Function", "Enter Function");
        nlapiLogExecution("AUDIT", "paramPartnerID", partnerID);

        var externalURL = "";

        if (propertyID) {
            externalURL = nlapiLookupField('customrecord_property_record', propertyID, "custrecord_extend_pr_public_upload_link");
        } else {
            externalURL = nlapiLookupField('partner', partnerID, "custentity_mw_public_link_extfiles");
        }

        externalURL = externalURL+"&min=1&hh=1"
        nlapiLogExecution("AUDIT", "externalURL", externalURL);


        // Add here if edit or create!!!


        var html ="<script>" +
        "var fileCount = 0;" +
        "function addFileContentToForm(input, i){ " +
        '    var fileContentsInput = jQuery(`<input class="form-control"  name="custpage_file_${fileCount}_contents" id="custpage_file_${fileCount}_contents" type="text">`); ' +
        '    var fileObj = {name : input.files[i].name, size : input.files[i].size, type : input.files[i].type, contents : ""}; ' +
        "    var f = new FileReader(); " +
        '    console.log("Reading file..."); ' +
        "    f.readAsDataURL(input.files[i]); " +
        "    f.onload = function (evt){ " +
        "        fileObj.contents = evt.target.result.toString(); " +
        "        fileContentsInput[0].value = JSON.stringify(fileObj); " +
        '        jQuery("#others").after(fileContentsInput); ' +
        "        fileContentsInput.hide(); " +
        "    } " +
        "} " +
        "function showFiles (event){ " +
        "    console.log(event.target);var input = event.target; " +
        "    for (var i = 0; i < input.files.length ; i ++){ " +
        '        var newHtml = `<div class="col-sm-12 row mb20"> <div class="col-sm-12"> <label id="other_file_label" class="lg" style="display:inline-block;margin-top: 25px;"><span class="file-name">${input.files[i].name}</span> succesfully added, please enter a description:&nbsp;<span style="color: #ff0000;display: inline-block;"> </label><div class="custom-file" style="display:inline"> <input class="form-control"  type="text" class="file-description" name="description_file_${fileCount}" id="description_file_${fileCount}"><span><i class="fa fa-trash file-exclude" id="file-${fileCount}-exclude"></i></span> </div> </div> </div>`; ' +
        '        jQuery("#files-div").before(newHtml); ' +
        "        addFileContentToForm(input, i); " +
        "        addExcludeFileHander(); " +
        "        fileCount++; " +
        "    } " +
        "} " +
        "function multipleFileInputChanged(evt){ " +
        "    showFiles(event); " +
        "} " +
        " function addExcludeFileHander(){ " +
        "         var counter = fileCount; " +
        "         jQuery(`#file-${counter}-exclude`).click(function (evt){ " +
        '             console.log("file-exclude has been pressed"); ' +
        "             var parent = evt.target.parentElement.parentElement.parentElement.parentElement; " +
        "             parent.parentNode.removeChild(parent); " +
        "             jQuery(`#custpage_file_${counter}_contents`).remove(); " +
        "         }); " +
        "     } " +
        
        "</script>" +
        '<div class="col-sm-12 row mb20" id="files-div"> ' +
        '    <div class="col-sm-12"> <label id="other_files_label" class="lg" ' +
        '            style="display:inline-block;margin-top: 25px;">To upload additional files, click Browse</label> ' +
        '        <div class="custom-file" style="display:inline">  ' +
        '            <input ondragover="dragOver(event);" ondragleave="dragLeave(event);" ondrop="dragLeave(event);" type="file" name="others" id="others"class="custom-file-input"  onchange="multipleFileInputChanged(event)" multiple>  ' +
        '            <label style="height: auto;" class="custom-file-labels" for="others" id="others-label">Drag n Drop / Browse</label>  ' +
        "        </div> " +
        "    </div> " +
        "</div> " +
        " " ;

        if (String(partnerID) == "5205") {
        var html =  '<div class="col-sm-12 row mb20" id="files-div"> ' +
            '<table style="width:100%">'+
            '<tr>'+
            '<th>'+
            '   <div class="col-sm-12"> <label id="other_files_label" class="lg"  <label id="other_files_label" class="lg" ' +
            '   style="display:inline-block">Upload Completed Market Home Information Sheet</label> ' +
            '   </div>'+
            ' </th>'+
            '<th>'+
            '            <iframe class="form-control" style="height:78px;" id="external-view-1" scrolling="no" class="external" src="' + externalURL + '&custrecord_extfile_type_custlist=10' +'" frameBorder="0"></iframe>  '+
            ' </th> '+
            '<th>'+
                "<button type='button' class='btn' style='background: #01723a; border-color: #01723a; color: #ffffff; font-size:14px; margin-left: 25%' onclick='newUpload(\" "+externalURL+'&custrecord_extfile_type_custlist=10' +"\", \"external-view-1\");'>"+
                    'New Upload'+
                '</button>'+
            "</th> "+
            '</tr>'+
            '<tr>'+
            '<th>'+
            '   <div class="col-sm-12"> <label id="other_files_label" class="lg"  <label id="other_files_label" class="lg" ' +
            '   style="display:inline-block;">Upload Selection Sheet Here</label> ' +
            '   </div>'+
            ' </th>'+
            '<th style="padding-top:20px;">'+
            '            <iframe class="form-control" style="height:78px;" id="external-view-2" scrolling="no" class="external" src="' + externalURL + '&custrecord_extfile_type_custlist=1' +'"  frameBorder="0"></iframe>  '+
            ' </th> '+
            '<th>'+
                "<button type='button' class='btn' style='background: #01723a; border-color: #01723a; color: #ffffff; font-size:14px; margin-left: 25%' onclick='newUpload(\" "+externalURL+'&custrecord_extfile_type_custlist=1' +"\", \"external-view-2\");'>"+
                    'New Upload'+
                '</button>'+
            "</th> "+
            '</tr>'+
            '<tr>'+
            '<th>'+
            '   <div class="col-sm-12"> <label id="other_files_label" class="lg"  <label id="other_files_label" class="lg" ' +
            '   style="display:inline-block;">Upload Change Orders Here</label> ' +
            '   </div>'+
            ' </th>'+
            '<th style="padding-top:20px;">'+
            '            <iframe class="form-control" style="height:78px;" id="external-view-3" scrolling="no" class="external" src="' + externalURL + '&custrecord_extfile_type_custlist=2' +'"  frameBorder="0"></iframe>  '+
            ' </th> '+
            '<th>'+
                "<button type='button' class='btn' style='background: #01723a; border-color: #01723a; color: #ffffff; font-size:14px; margin-left: 25%' onclick='newUpload(\" "+externalURL+'&custrecord_extfile_type_custlist=2' +"\", \"external-view-3\");'>"+
                    'New Upload'+
                '</button>'+
            "</th> "+
            '</tr>'+
            '<tr>'+
            '<th>'+
            '   <div class="col-sm-12"> <label id="other_files_label" class="lg"  <label id="other_files_label" class="lg" ' +
            '   style="display:inline-block;">Upload Const. Drawings Here</label> ' +
            '   </div>'+
            ' </th>'+
            '<th style="padding-top:20px;">'+
            '            <iframe class="form-control" style="height:78px;" id="external-view-4" scrolling="no" class="external" src="' + externalURL + '&custrecord_extfile_type_custlist=3' +'"  frameBorder="0"></iframe>  '+
            ' </th> '+
            '<th>'+
                "<button type='button' class='btn' style='background: #01723a; border-color: #01723a; color: #ffffff; font-size:14px; margin-left: 25%' onclick='newUpload(\" "+externalURL+'&custrecord_extfile_type_custlist=3' +"\", \"external-view-4\");'>"+
                    'New Upload'+
                '</button>'+
            "</th> "+
            '</tr>'+
            '<tr>'+
            '<th>'+
            '   <div class="col-sm-12"> <label id="other_files_label" class="lg"  <label id="other_files_label" class="lg" ' +
            '   style="display:inline-block;">To upload additional files, click Browse</label> ' +
            '   </div>'+
            ' </th>'+
            '<th style="padding-top:20px;">'+
            '            <iframe class="form-control" style="height:78px;" id="external-view-5" scrolling="no" class="external" src="' + externalURL +'&custrecord_extfile_type_custlist=9' + '"  frameBorder="0"></iframe>  '+
            ' </th> '+
            '<th>'+
                "<button type='button' class='btn' style='background: #01723a; border-color: #01723a; color: #ffffff; font-size:14px; margin-left: 25%' onclick='newUpload(\" "+externalURL+'&custrecord_extfile_type_custlist=9' +"\", \"external-view-5\");'>"+
                    'New Upload'+
                '</button>'+
            "</th> "+
            '</tr>'+
            ' </table>'+
            "</div> " +
            " " ;
   
        }
        
        html += "<style> " +
        "    .custom-file-labels { " +
        "        margin-top: 0px; " +
        "        position: absolute; " +
        "        height: calc(2.25rem + 2px); " +
        "        top: 0; " +
        "        right: 0; " +
        "        left: 0; " +
        "        border: 1px solid #ced4da; " +
        "        border-radius: .25rem; " +
        "        padding: .375rem .75rem; " +
        "        line-height: 1.5; " +
        "        text-align: center; " +
        "        background-color: #e9ecef; " +
        "        color: #495057; " +
        "    } " +
        "    .file-name{ " +
        "        font-family: monospace; " +
        "        display: inline-block; " +
        "        font-size: 1em; " +
        "    } " +
        "    .file-description{ " +
        "        width : 302px !important; " +
        "    }     " +
        "    .file-exclude { " +
        "        margin-left: 8px; " +
        "        color: black; " +
        "        cursor : pointer; " +
        "    } " +

        "</style> ";

        return html;
}

function getFileTypeId(pContentType) {
    const GENERAL_DEFAULT_FILE_TYPE_ID = "PLAINTEXT";
    const MULTIPART_TYPES = {
        "application/json": "JSON",
        "application/msword": "WORD",
        "application/pdf": "PDF",
        "application/postscript": "POSTSCRIPT",
        "application/rtf": "RTF",
        "application/sms": "SMS",
        "application/vnd.ms-excel": "EXCEL",
        "application/vnd.ms-powerpoint": "POWERPOINT",
        "application/vnd.ms-project": "MSPROJECT",
        "application/vnd.visio": "VISIO",
        "application/x-autocad": "AUTOCAD",
        "application/x-gzip-compressed": "GZIP",
        "application/x-shockwave-flash": "FLASH",
        "application/zip": "ZIP",
        "application/msword": "WORD",
        "audio/mpeg": "MP3",
        "image/gif": "GIFIMAGE",
        "image/ico": "ICON",
        "image/jpeg": "JPGIMAGE",
        "image/pjpeg": "PJPGIMAGE",
        "image/tiff": "TIFFIMAGE",
        "image/x-png": "PNGIMAGE",
        "image/x-xbitmap": "BMPIMAGE",
        "message/rfc822": "MESSAGERFC",
        "text/css": "STYLESHEET",
        "text/csv": "CSV",
        "text/html": "HTMLDOC",
        "text/javascript": "JAVASCRIPT",
        "text/plain": "PLAINTEXT",
        "text/xml": "XMLDOC",
        "video/mpeg": "MPEGMOVIE",
        "video/quicktime": "QUICKTIME",
        //from here on, were added manually. Mostly for office suite type documents and open office documents
        "application/vnd.oasis.opendocument.text": "WORD",
        "application/vnd.oasis.opendocument.spreadsheet": "EXCEL",
        "application/vnd.oasis.opendocument.presentation": "POWERPOINT",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "WORD",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "EXCEL",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation ": "POWERPOINT",
    };
    const CONTENT_TYPES = ["application", "audio", "image", "message", "text", "video"];
    const DEFAULT_FILE_TYPES_IDS = {
        application: "ZIP",
        audio: "MP3",
        image: "JPGIMAGE",
        message: "MESSAGERFC",
        text: "PLAINTEXT",
        video: "MPEGMOVIE",
    };
    //check for the ones that Netsuite specifies
    var fileTypeID = MULTIPART_TYPES[pContentType];
    // else return a default
    if (!fileTypeID) {
        var contentType = pContentType.split("/")[0];
        if (CONTENT_TYPES.indexOf(contentType) != -1) {
            return DEFAULT_FILE_TYPES_IDS[contentType];
        }
        // else return plaintext as general default
        return GENERAL_DEFAULT_FILE_TYPE_ID;
    }
    return fileTypeID;
}

function getContentsWithCorrectEncoding(pResponseFile) {
    const APPLICATION_EXCEPTIONS = ["application/json", "application/postscript"];
    var contents = pResponseFile.contents.substr(pResponseFile.contents.indexOf(",") + 1);
    var fileType = pResponseFile.type.split("/")[0];
    if (fileType == "text" || fileType == "message" || APPLICATION_EXCEPTIONS.indexOf(pResponseFile.type) != -1) {
        return forge.util.decode64(contents);
    } else {
        return contents;
    }
}

function makeSelectOptions(pListInternalId, pPluralListName, pFilters) {
    var columns = [];
    var filters = new Array();
    var optionsHTML = "";

    filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F");
    pFilters = pFilters ? pFilters : [];
    filters = filters.concat(pFilters);

    columns.push(new nlobjSearchColumn("internalid"));
    columns.push(new nlobjSearchColumn("name"));

    var sResults = nlapiSearchRecord(pListInternalId, null, filters, columns);

    //nlapiLogExecution("DEBUG", "directional prefixes length", sResults.length);

    if (!sResults || !sResults.length) {
        return "<option> No " + pPluralListName + " found</option>";
    }

    for (var i = 0; sResults != null && sResults.length > i; i++) {
        optionsHTML += '<option value="' + sResults[i].getValue("internalid") + '">' + sResults[i].getValue("name") + "</option>\n";
    }

    return optionsHTML;
}

function builderBelongToFischerHomes(pBuilderId) {
    var FISCHER_HOMES = "509";
    try {
        var parent = nlapiLookupField("customer", pBuilderId, ["parent"]);
        nlapiLogExecution("DEBUG", "parent", JSON.stringify(parent));
        var belongs = parent["parent"] == FISCHER_HOMES;
        nlapiLogExecution("DEBUG", "builderBelongToFischerHomes", pBuilderId + " : " + belongs);
        return belongs;
    } catch (error) {
        nlapiLogExecution("DEBUG", "Error checking top level builder of current logged in user", JSON.stringify(error));
        nlapiLogExecution("ERROR", "Error checking top level builder of current logged in user", error.message);
        var errBody = "Error checking top level builder of current logged in user " + pBuilderId + ".\n\n" + JSON.stringify(error, null, 2);
        nlapiSendEmail(3847, ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"], "Error on Create Listing Form", errBody);
    }
}

function builderBelongToDRHorton(pBuilderId) {
    var DR_HORTON = "4903";
    try {
        var parent = nlapiLookupField("customer", pBuilderId, ["parent"]);
        nlapiLogExecution("DEBUG", "parent", JSON.stringify(parent));
        var belongs = parent["parent"] == DR_HORTON;
        nlapiLogExecution("DEBUG", "builderBelongToDRHorton", pBuilderId + " : " + belongs);
        return belongs;
    } catch (error) {
        nlapiLogExecution("DEBUG", "Error checking top level builder of current logged in user", JSON.stringify(error));
        nlapiLogExecution("ERROR", "Error checking top level builder of current logged in user", error.message);
        var errBody = "Error checking top level builder of current logged in user " + pBuilderId + ".\n\n" + JSON.stringify(error, null, 2);
        nlapiSendEmail(3847, ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"], "Error on Create Listing Form", errBody);
    }
}


function getThankYouForm(pRedirectToSubmitSale, pPartnerId, pBuilderId, pSubdivision, pPropertyId, pSalesStatusValue, sqFtLetterData,pAsIncomplete) {

    var mainMenuUrl = nlapiResolveURL("SUITELET", 407, 1, "external");
    // try {
    //     var token = encryptParams({ "builderid": pBuilderId, "partnerid": pPartnerId });
    //     mainMenuUrl += token ? "&token=" + token : '';

    // } catch (error) {
    //     nlapiLogExecution("ERROR", "Error generating token", JSON.stringify(error));
    //     var errBody = "Error Error generating token.\n\n" + JSON.stringify(error, null, 2);
    //     nlapiSendEmail(3847, ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"], "Error on Create Listing Form", errBody);
    // }
    var html = "";

    var submitSaleUrl = nlapiResolveURL("SUITELET", 467, 1, "external") + "&partnerid=" + pPartnerId + "&builderid=" + pBuilderId + "&custpage_subdivision=" + pSubdivision + "&propertyid=" + pPropertyId;
    var saleStatusText = nlapiSearchRecord(
        "customlist31",
        null, [new nlobjSearchFilter("internalid", null, "is", pSalesStatusValue)], [new nlobjSearchColumn("name")]
    )[0].getValue("name");
    var createListingUrl = nlapiResolveURL("SUITELET", 259, 1, "external");

    var message = pAsIncomplete? 'Thank you. You may come back and finish entering this listing at any time.': 'Thank you for submitting this new listing!'  ;

    var html =
        '<html>    ' +
        '<head>    ' +
        '   <meta name="viewport" content="width=device-width, initial-scale=1.0">    ' +
        '   <meta http-equiv="X-UA-Compatible" content="IE=edge">    ' +
        '   <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">    ' +
        '   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">    ' +
        '   <script src="'+getNetsuiteFileURL("SuiteScripts/WebResources/jQuery/3.5.1/jquery-3.5.1.min.js")+'"></script>'+
        '   <script src="' + getNetsuiteFileURL("SuiteScripts/WebResources/Bootstrap/4.1.3/bootstrap.min.js") + '"></script>    ' +
        '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/WebResources/jQueryUI/1.12.1/jquery-ui.min.css") + '">    ' +
        '   <script src="' + getNetsuiteFileURL("SuiteScripts/WebResources/jQueryUI/1.12.1/jquery-ui.min.js") + '"></script>    ' +
        '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/Style_CSS/Styles/Builder Portal/Global.css") + '">    ' +
        '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/Style_CSS/Styles/Builder Portal/Post-Submit.css") + '">    ' +
        '<link rel="stylesheet" href="' + BUILDER_PORTAL.CREATE_MODIFY_LISTING.CREATE_MODIFY_LISTING_URL + '">'+
        '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/WebResources/Bootstrap/4.1.3/bootstrap.min.css") + '" >    ' +
        '	<script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.2/dist/jquery.validate.min.js"></script>		' +
        '	<script src="' + getNetsuiteFileURL("SuiteScripts/Midware/BuilderPortal/SuiteletScripts/CreateListing/Resources/CreateListingPostSubmit.js") + '"></script>' +
        '	<script> ' +
        '		window.createListingServicesSuiteletURL = "' + nlapiResolveURL("SUITELET", 712, 1, "external") + '";' +
        '		var propertyId = "' + pPropertyId + '";' +
        "		var sqFtLetterData = " + JSON.stringify(sqFtLetterData) + ";" +
        '	</script> ' +
        '<script>'+
        "function showSideBar(){$('#sidebar').addClass('active'); $('#overlay').addClass('active'); $('.collapse.in').toggleClass('in'); $('a[aria-expanded=true]').attr('aria-expanded', 'false');}"+
        "$( document ).ready(function() {"+
        "jQuery('#overlay').on('click', function(){$('#sidebar').removeClass('active'); $('#overlay').removeClass('active');;});});"+
        'function toggleSubmenu(){$(`#pageSubmenu`).collapse(`toggle`);}</script>' +
        makeSideNavigation(pPartnerId);
        if(isPersonelAllowedToNewPortal(pPartnerId) || isJustThisPersonelAllowedToNewPortal(pPartnerId)) html += makeChatra(pPartnerId);

        html +='</head>    ' +
        '<title>Listing Form</title>    ' +
        '<body data-gr-c-s-loaded="true">    ' +
        // '	<div class="overlay" id="overlay"></div>' +
        '	<div id="modal-container" class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">  ' +
        '	    <div class="modal-dialog" role="document">  ' +
        '	        <div class="modal-content">  ' +
        '	            <div class="modal-header" style="backgroud-color:#D4AF37">  ' +
        '	                <h5 class="modal-title" id="modal-title"></h5>  ' +
        '	            </div>  ' +
        '	            <div class="modal-body justify-content-center" id="modal-content-container">  ' +
        '	                <p id="modal-text"></p>  ' +
        '	            </div>  ' +
        '	            <div class="modal-footer justify-content-center">  ' +
        '	                <button id="btn_ok" style="display:none" class="btn btn-primary waves-effect" type="button" onclick="">Ok</button>  ' +
        '	                <button id="btn_yes" style="display:none" class="btn btn-primary waves-effect" onclick="" type="button">Yes</button>  ' +
        '	                <button id="btn_no" style="display:none" class="btn btn-secondary" data-dismiss="modal" onclick="" type="button">No</button>  ' +
        '	            </div>  ' +
        '	        </div>  ' +
        '	    </div>  ' +
        '	</div>  ' +
        '    <style>    ' +
        '   input::-webkit-outer-spin-button, ' +
        '   input::-webkit-inner-spin-button { ' +
        '       -webkit-appearance: none; ' +
        '       margin: 0; ' +
        '   } ' +
        '   input[type=number] { ' +
        '       -moz-appearance: textfield; ' +
        '   } ' +
        '    </style>    ' +
        '    <div class="wrapper">    ' +
        '        <!-- Header Starts Here -->    ' +
        '        <div class="header col-12 align-middle">    ' +
        '            <div class="row header-row">    ' +
        '                <div class="col-1 header-div align-self-center" style="text-align: left;">'+
        '                   <a class="navbar-anchor" href="javascript:showSideBar();"><i class="fa fa-bars"></i></a>'+
        '               </div>    ' +
        '                <div class="col-10 header-div">    ' +
        '                    <header>Listing Form</header>    ' +
        '                </div>    ' +
        '            </div>    ' +
        '        </div>    ' +
        '        <!-- Header Ends Here -->    ' +
        '        <div class="form-group">    ' +
        '            <div class="container-fluid">    ';
    if (sqFtLetterData.hasOwnProperty('sqFtStreetName') || sqFtLetterData.hasOwnProperty('sqFtHouseNo')) {
        html +=
            '               <!-- Starts SQFt Letter -->' +
            '               <div class="panel panel-default col-sm-11 col-md-6 px-0 mt-4">' +
            '                   <div class="ques-num row p-auto m-0">' +
            '                       <div class="col-11">' +
            '                           <h3 class="panel-title">Square Footage Letter Required</h3>' +
            '                       </div>' +
            '                       <div class="col-1 my-auto">' +
            '                           <a onclick="toggleSqFt()" style="cursor:pointer;" data-toggle="tooltip" title="Edit"><i' +
            '                                   class="fa fa-minus-square" aria-hidden="true" id="sqFtExpandCollapse"></i>' +
            '                           </a>' +
            '                       </div>' +
            '                   </div>' +
            '                   <div class="panel-body" id="sqFtBody" style="display: block;">' +
            '                       <div class="row justify-content-center">' +
            '                           <form id="email-request-form" class="col-12 col-md-9 text-center d-block">' +
            '                               <div class="bp-input-group d-inline-block mt-0"> ' +
            '                                   <label class="my-2">Columbus MLS requires a square footage' +
            '                                       letter from an offical builder source. Clicking Submit below will open up a new, prefilled,' +
            '                                       email in your default email client. That email will be sent to HMS' +
            '                                       (mlsinfo@hmsmarketingservices.com) stating the square footage. We will then forward that email' +
            '                                       to Columbus MLS ' +
            '                                   </label>' +
            '                                   <label class="my-2">Please enter the sq ft below</label>' +
            '                                   <input id="sqFt" type="text" class="form-control my-2 mx-auto" style="width: 15%;text-align: center;">' +
            '                               </div>' +
            '                               <div class="d-inline-block mt-2"> ' +
            '                                   <a onclick="javascript:toggleSqFt()" id="sqFtAnchor" href="" target="_blank" class="hms-btn">Open prefilled email</a> ' +
            '                               </div>' +
            '                           </form> ' +
            '                       </div>' +
            '                   </div>' +
            '               </div>' +
            '               <!-- ENDS SQFt Letter -->';
    }

    html += '                <div class="panel panel-default col-sm-11 col-md-6 px-0 mt-4">    ' +
        '                    <div class="ques-num text-center">    ' +
        '                        <h3 class="panel-title">Thank you!</h3>    ' +
        '                    </div>    ' +
        '                    <div class="panel-body">    ' +
        '                        <div class="row justify-content-center">    ' +
        '                            <!-- Starts Thank you div -->    ' +
        '                            <div class="col-12 col-md-9 text-center">    ' +
        '                                <div class="bp-input-group mb-0">    ' +
        '                                    <div>    ' +
        '                                        <label>'+message+'</label>    '+
        '                                    </div>    ' +
        '                                </div>    ' +
        '                            </div>    ' +
        '                            <!-- Ends Thank you div -->    ';
    if (pRedirectToSubmitSale) {
        html += '                       <!-- SEPARATOR -->    ' +
            '                        <div id="sale-data-div" class="separator-div"></div>    ' +
            '                        <!-- SEPARATOR -->    ' +
            '                        <!-- STARTS Enter Sale Information -->    ' +
            '                        <div class="col-12 col-md-9 text-center">    ' +
            '                            <div class="bp-input-group mb-0 d-inline-block">    ' +
            '                                <label class="">    ' +
            '                                    We noticed this is a contract to build listing that is currently ' + saleStatusText + '.    ' +
            '                                    Click the button directly below to enter the sale information    ' +
            '                                </label>    ' +
            '                            </div>    ' +
            '                            <div class="bp-input-group d-inline-block">    ' +
            '                                <a href="' + submitSaleUrl + '" onclick="modalInProgress=true;actionPerformed=true;" class="hms-btn d-inline-block"> Enter Sale Information </a>    ' +
            '                            </div>    ' +
            '                        </div>    ' +
            '                        <!-- SEPARATOR -->    ' +
            '                        <div class="w-75 row justify-content-center">    ' +
            '                            <div class="col-12 or-div row">    ' +
            '                                <div style="width:45%;">    ' +
            '                                    <hr class="or-hr">    ' +
            '                                </div>    ' +
            '                                <div style="width:10%" class="text-center d-flex align-items-center">    ' +
            '                                    <span class="m-auto" style="font-size: 1.25em;">OR</span>    ' +
            '                                </div>    ' +
            '                                <div style="width:45%">    ' +
            '                                    <hr class="or-hr">    ' +
            '                                </div>    ' +
            '                            </div>    ' +
            '                        </div>    ' +
            '                        <!-- SEPARATOR -->    ' +
            '                        <form id="reminder-form" class="col-12 col-md-9 text-center d-block">    ' +
            '                            <div class="bp-input-group">    ' +
            '                                <label class="">    ' +
            '                                    If you\'re not yet ready to enter the sale data, HMS can email you a Request for    ' +
            '                                    Sale Information email in    ' +
            '                                </label>    ' +
            '                                <input id="days" type="number" class="form-control my-2 mx-auto" style="width: 15%;text-align:center;" min="1" max="31" required>    ' +
            '                                <label class="my-2">    ' +
            '                                    day(s) as a reminder    ' +
            '                                </label>    ' +
            '   							<div class="d-block"> ' +
            '   							    <label style=" display: none; color: rgb(1, 114, 58); font-size: 1.25em;" class="my-0" id="reminder-status-label"><label> ' +
            '   							</div> ' +
            '                            </div>    ' +
            '                            <div class="bp-input-group mb-0">    ' +
            '                                <button id="reminder-btn" class="hms-btn">Set reminder</button>    ' +
            '                            </div>    ' +
            '                        </form>    ' +
            '                        <!-- SEPARATOR -->    ' +
            '                        <div class="w-75 row justify-content-center">    ' +
            '                            <div class="col-12 or-div row">    ' +
            '                                <div style="width:45%;">    ' +
            '                                    <hr class="or-hr">    ' +
            '                                </div>    ' +
            '                                <div style="width:10%" class="text-center d-flex align-items-center">    ' +
            '                                    <span class="m-auto" style="font-size: 1.25em;">OR</span>    ' +
            '                                </div>    ' +
            '                                <div style="width:45%">    ' +
            '                                    <hr class="or-hr">    ' +
            '                                </div>    ' +
            '                            </div>    ' +
            '                        </div>    ' +
            '                        <!-- SEPARATOR -->    ' +
            '                        <form id="email-request-form" class="col-12 col-md-9 text-center d-block">    ' +
            '                            <div class="bp-input-group d-inline-block">    ' +
            '                                <label class="my-2">    ' +
            '                                    If you would rather someone else in your organization provide the sale details    ' +
            '                                    select that person below and they\'ll be sent a Request for Sale Information email    ' +
            '                                    right away    ' +
            '                                </label>    ' +
            '                                <select id="personnel-to-notify" class="form-control w-25 my-2 mx-auto d-inline-block" required>    ' +
            '                                    <option></option>    ' +
            makePersonnelOptions(pBuilderId) +
            '                                </select>    ' +
            '   							<div class="d-block"> ' +
            '   							    <label style=" display: none; color: rgb(1, 114, 58); font-size: 1.25em;" class="my-0" id="email-request-status-label"><label> ' +
            '   							</div> ' +
            '                            </div>    ' +
            '                        	<div class="d-inline-block">    ' +
            '                        	    <button class="hms-btn">send request for sale information email</button>    ' +
            '                        	</div><!-- ENDS Enter Sale Information -->    ' +
            '                        </form>    ' +
            '';
    }
    if (pAsIncomplete){

        

        // if(isPersonelAllowedToNewPortal(pPartnerId)){


            html += 
            '                      <!-- SEPARATOR -->    ' +
            '                            <div class="separator-div"></div>    ' +
            '                            <!-- SEPARATOR -->    ' ;
            html += 
            
            '                        <div style="height: 400px">    ' +
            // '                            <div class="bp-input-group">    ' +
            // '                                <label class="">    ' +
            // '                                    If you\'re not yet ready to Complete the Listing, HMS can email you a Request for    ' +
            // '                                    Complete The listing in    ' +
            // '                                </label>    ' +
            // '                                <input id="reminderType"  type="hidden" value="3">    ' +
            // '                                <input id="days" type="number" class="form-control my-2 mx-auto" style="width: 15%;text-align:center;" min="1" max="31" required>    ' +
            // '                                <label class="my-2">    ' +
            // '                                    day(s) as a reminder    ' +
            // '                                </label>    ' +
            
            
            // '                                 <br> <br><label class="my-2">    ' +
            // '                                    If you want someone else in your organization to be in charge of this property and receive reminders.  Select the person below.'+
            // '                                </label>    ' +
            // '                                <select id="personnel" class="form-control w-25 my-2 mx-auto d-inline-block">    ' +
            // '                                    <option></option>    ' + makePersonnelOptions(pBuilderId) +
            // '                                </select>    ' +




            // '                                <div class="d-block"> ' +
            // '   							    <label style=" display: none; color: rgb(1, 114, 58); font-size: 1.25em;" class="my-0" id="reminder-status-label"><label> ' +
            // '   							</div> ' +



            // '                            </div>    ' +





            // '                            <div class="bp-input-group mb-0">    ' +
            // '                                <button id="reminder-btn" class="hms-btn">Set reminder</button>    ' +
            // '                            </div>    ' +
            ' <iframe style="height: 440px; width:650px;" id="external-view" class="" src="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1597&deploy=1&compid=1309901&h=3720d882fb1e336f4683&id='+pPropertyId+'&pid='+pPartnerId+'&listing=true" frameBorder="0"></iframe>'+
            '                        </div>    ' ;
            
        // }

        html += 
        '                      <!-- SEPARATOR -->    ' +
        '                            <div class="separator-div"></div>    ' +
        '                            <!-- SEPARATOR -->    ' +
        '                            <div class="col-12 col-md-9 text-center">    ' +
        '                                <div class="bp-input-group">    ' +
        '                                    <button onclick="location.href =\'' + createListingUrl.replace(/\s/, '') + '\';" class="hms-btn d-inline-block"> Enter another Listing</button>    ' +
        '                                </div>    ' +
        '                                <div class="bp-input-group">    ' +
        '                                    <button onclick="location.href =\'' + mainMenuUrl.replace(/\s/, '') + '\';" class="hms-btn d-inline-block"> Return to main menu</button>    ' +
        '                                </div>    ' +
        '                            </div>    ' +
        '                        </div>    ' +
        '                    </div>    ' +
        '                </div>    ' +
        '            </div>    ' +
        // '        </form>    ' +
        '    </div>    ' +
        '</body>    ' +
        '</html>    ';
    }

    else {
        html += '                      <!-- SEPARATOR -->    ' +
            '                            <div class="separator-div"></div>    ' +
            '                            <!-- SEPARATOR -->    ' +
            '                            <div class="col-12 col-md-9 text-center">    ' +
            '                                <div class="bp-input-group">    ' +
            '                                    <button onclick="confirmBeforeNavigate(\'' + createListingUrl.replace(/\s/, '') + '\')" class="hms-btn d-inline-block"> Enter another Listing</button>    ' +
            '                                </div>    ' +
            '                                <div class="bp-input-group">    ' +
            '                                    <button onclick="confirmBeforeNavigate(\'' + mainMenuUrl.replace(/\s/, '') + '\')" class="hms-btn d-inline-block"> Return to main menu</button>    ' +
            '                                </div>    ' +
            '                            </div>    ' +
            '                        </div>    ' +
            '                    </div>    ' +
            '                </div>    ' +
            '            </div>    ' +
            '        </form>    ' +
            '    </div>    ' +
            '</body>    ' +
            '</html>    ';

}
    return html;
}


function makeBuilderPortalErrorPage(pPartnerId) {

    var mainMenuUrl = nlapiResolveURL("SUITELET", 407, 1, "external");

    var html = "";


    var message = "Sorry, you don't have the necessary permissions to access this Infomation. Please contact us if this is a mistake." ;

    var html =
        '<html>    ' +
        '<head>    ' +
        '   <meta name="viewport" content="width=device-width, initial-scale=1.0">    ' +
        '   <meta http-equiv="X-UA-Compatible" content="IE=edge">    ' +
        '   <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">    ' +
        '   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">    ' +
        '   <script src="'+getNetsuiteFileURL("SuiteScripts/WebResources/jQuery/3.5.1/jquery-3.5.1.min.js")+'"></script>'+
        '   <script src="' + getNetsuiteFileURL("SuiteScripts/WebResources/Bootstrap/4.1.3/bootstrap.min.js") + '"></script>    ' +
        '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/WebResources/jQueryUI/1.12.1/jquery-ui.min.css") + '">    ' +
        '   <script src="' + getNetsuiteFileURL("SuiteScripts/WebResources/jQueryUI/1.12.1/jquery-ui.min.js") + '"></script>    ' +
        '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/Style_CSS/Styles/Builder Portal/Global.css") + '">    ' +
        '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/Style_CSS/Styles/Builder Portal/Post-Submit.css") + '">    ' +
        '<link rel="stylesheet" href="' + BUILDER_PORTAL.CREATE_MODIFY_LISTING.CREATE_MODIFY_LISTING_URL + '">'+
        '   <link rel="stylesheet" href="' + getNetsuiteFileURL("SuiteScripts/WebResources/Bootstrap/4.1.3/bootstrap.min.css") + '" >    ' +
        '	<script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.2/dist/jquery.validate.min.js"></script>		' +
        '	<script src="' + getNetsuiteFileURL("SuiteScripts/Midware/BuilderPortal/SuiteletScripts/CreateListing/Resources/CreateListingPostSubmit.js") + '"></script>' +
        '<script>'+
        "function showSideBar(){$('#sidebar').addClass('active'); $('#overlay').addClass('active'); $('.collapse.in').toggleClass('in'); $('a[aria-expanded=true]').attr('aria-expanded', 'false');}"+
        "$( document ).ready(function() {"+
        "jQuery('#overlay').on('click', function(){$('#sidebar').removeClass('active'); $('#overlay').removeClass('active');;});});"+
        'function toggleSubmenu(){$(`#pageSubmenu`).collapse(`toggle`);}</script>' +
        makeSideNavigation(pPartnerId);
        if(isPersonelAllowedToNewPortal(pPartnerId) || isJustThisPersonelAllowedToNewPortal(pPartnerId)) html += makeChatra(pPartnerId);

        html += '</head>    ' +

        '<title>Listing Form</title>    ' + 
        '<body data-gr-c-s-loaded="true">    ' +
        // '	<div class="overlay" id="overlay"></div>' +
        '	<div id="modal-container" class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">  ' +
        '	    <div class="modal-dialog" role="document">  ' +
        '	        <div class="modal-content">  ' +
        '	            <div class="modal-header" style="backgroud-color:#D4AF37">  ' +
        '	                <h5 class="modal-title" id="modal-title"></h5>  ' +
        '	            </div>  ' +
        '	            <div class="modal-body justify-content-center" id="modal-content-container">  ' +
        '	                <p id="modal-text"></p>  ' +
        '	            </div>  ' +
        '	            <div class="modal-footer justify-content-center">  ' +
        '	                <button id="btn_ok" style="display:none" class="btn btn-primary waves-effect" type="button" onclick="">Ok</button>  ' +
        '	                <button id="btn_yes" style="display:none" class="btn btn-primary waves-effect" onclick="" type="button">Yes</button>  ' +
        '	                <button id="btn_no" style="display:none" class="btn btn-secondary" data-dismiss="modal" onclick="" type="button">No</button>  ' +
        '	            </div>  ' +
        '	        </div>  ' +
        '	    </div>  ' +
        '	</div>  ' +
        '    <style>    ' +
        '   input::-webkit-outer-spin-button, ' +
        '   input::-webkit-inner-spin-button { ' +
        '       -webkit-appearance: none; ' +
        '       margin: 0; ' +
        '   } ' +
        '   input[type=number] { ' +
        '       -moz-appearance: textfield; ' +
        '   } ' +
        '    </style>    ' +
        '    <div class="wrapper">    ' +
        '        <!-- Header Starts Here -->    ' +
        '        <div class="header col-12 align-middle">    ' +
        '            <div class="row header-row">    ' +
        '                <div class="col-1 header-div align-self-center" style="text-align: left;">'+
        '                   <a class="navbar-anchor" href="javascript:showSideBar();"><i class="fa fa-bars"></i></a>'+
        '               </div>    ' +
        '                <div class="col-10 header-div">    ' +
        '                    <header>Listing Form</header>    ' +
        '                </div>    ' +
        '            </div>    ' +
        '        </div>    ' +
        '        <!-- Header Ends Here -->    ' +
        '        <div class="form-group">    ' +
        '            <div class="container-fluid">    ';


    html += '                <div class="panel panel-default col-sm-11 col-md-6 px-0 mt-4">    ' +
        '                    <div class="ques-num text-center">    ' +
        '                        <h3 class="panel-title">Validation Error</h3>    ' +
        '                    </div>    ' +
        '                    <div class="panel-body">    ' +
        '                        <div class="row justify-content-center">    ' +
        '                            <!-- Starts Thank you div -->    ' +
        '                            <div class="col-12 col-md-9 text-center">    ' +
        '                                <div class="bp-input-group mb-0">    ' +
        '                                    <div>    ' +
        '                                        <label>'+message+'</label>    '+
        '                                    </div>    ' +
        '                                </div>    ' +
        '                            </div>    ' +
        '                            <!-- Ends Thank you div -->    ';

        html += '                      <!-- SEPARATOR -->    ' +
        '                            <div class="separator-div"></div>    ' +
        '                            <!-- SEPARATOR -->    ' +
        '                            <div class="col-12 col-md-9 text-center">    ' +
        '                                <div class="bp-input-group">    ' +
        '                                    <button onclick="location.href =\'' + mainMenuUrl.replace(/\s/, '') + '\';" class="hms-btn d-inline-block"> Main Menu</button>    ' +
        '                                </div>    ' +
        '                            </div>    ' +
        '                        </div>    ' +
        '                    </div>    ' +
        '                </div>    ' +
        '            </div>    ' +
        '        </form>    ' +
        '    </div>    ' +
        '</body>    ' +
        '</html>    ';
    

    return html;
}


function logFormDataExceptFileContents(paramsObj) {
    var elementsToNotLog = Object.keys(paramsObj).filter(function(x) {
        return x.match(/custpage_file_[0-9]*_contents/);
    });
    for (var i in elementsToNotLog) {
        delete paramsObj[elementsToNotLog[i]];
    }
    nlapiLogExecution("DEBUG", "All params", JSON.stringify(paramsObj));
}

function encryptParams(pParams) {
    var randomToken = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++) {
        randomToken += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    randomToken = nlapiEncrypt(randomToken, 'base64');

    nlapiSubmitField('partner', pParams.partnerid, 'custentity_mw_temp_access_token', randomToken);

    try {
        var partnerLastLoginDate = nlapiLookupField("partner", pParams.partnerid, "custentity_last_successful_login");
        var dateMembers = partnerLastLoginDate.split("/");
        var lastLoginDate = new Date();
        lastLoginDate.setMonth(dateMembers[0] - 1);
        lastLoginDate.setDate(dateMembers[1]);
        lastLoginDate.setYear(dateMembers[2]);
        lastLoginDate.setHours(0, 0, 0);
        pParams["lastlogin"] = lastLoginDate.toISOString();
        nlapiLogExecution("DEBUG", "last login date", pParams["lastlogin"]);
    } catch (error) {
        //console.error(error);
        nlapiLogExecution("DEBUG", "Error setting last login date", JSON.stringify(error));
        var errBody = "Error setting last login date" + JSON.stringify(error, null, 2);
        nlapiSendEmail(3847, ["hms@midware.net", "jmcdonald@hmsmarketingservices.com"], "Error on Create Listing Form", errBody);
    }

    pParams["randomToken"] = randomToken;

    var token = nlapiEncrypt(JSON.stringify(pParams), 'base64');

    return token;

}

function addNoteToPropertyRecord(pPropertyRecordId, pPropertyTypeValue, pSalesStatusValue) {

    var newNote = nlapiCreateRecord('note');

    newNote.setFieldValue('recordtype', 18);
    newNote.setFieldValue('record', pPropertyRecordId);

    var propertyTypeText = getListTextFromValue(pPropertyTypeValue, "customlist_listing_type");
    var salesStatusText = getListTextFromValue(pSalesStatusValue, "customlist31");

    var noteText = "This " + propertyTypeText + " was submmited as " + salesStatusText + " instead of available. Please investigate.";
    var noteTitle = "Investigation Needed";

    newNote.setFieldValue('note', noteText);
    newNote.setFieldValue('title', noteTitle);

    nlapiSubmitRecord(newNote);

}

function getListTextFromValue(pListValue, pListName) {
    return nlapiSearchRecord(
        pListName,
        null, [
            ["internalidnumber", "equalto", pListValue.toString()]
        ], [new nlobjSearchColumn("name").setSort(false)]
    )[0].getValue("name");
}

function getPropertyFolder(pDivisionId, pHouseNumber, pStreetName) {

    var forlderName = pHouseNumber + ' ' + pStreetName;
    nlapiLogExecution("DEBUG", "getPropertyFolder", "pDivisionId : " + pDivisionId + ", pHouseNumber : " + pHouseNumber + ", pStreetName : " + pStreetName + "FOLDER NAME : " + forlderName);
    var parentFolder = getDivisionRootFolderId(pDivisionId);
    var folderId = createFolders(forlderName, parentFolder);
    nlapiLogExecution("DEBUG", "getPropertyFolder", "FOLDER ID : " + folderId);
    return folderId
}

function getDivisionRootFolderId(pDivisionId) {
    return nlapiLookupField('customer', pDivisionId, ['custentity_mw_root_folder'])['custentity_mw_root_folder'];

}

function createFolders(pFolderPath, pParentId) {


    var folderArray = pFolderPath.split('/');
    var topFolder = folderArray[0];
    var nextFolders = folderArray.slice(1);
    var folderFilters = [];
    folderFilters.push(new nlobjSearchFilter('name', null, 'is', topFolder))
    folderFilters.push(pParentId ? new nlobjSearchFilter('parent', null, 'anyof', [pParentId]) : new nlobjSearchFilter('istoplevel', null, 'is', true))
    var folderId = null;

    var folderSearchResults = nlapiSearchRecord('folder', null, folderFilters);

    for (var i = 0; folderSearchResults != null && i < folderSearchResults.length; i++) {
        folderId = folderSearchResults[i].getId();
    }

    if (!folderId) {
        var folderRecord = nlapiCreateRecord("folder");
        folderRecord.setFieldValue('name', topFolder);
        folderRecord.setFieldValue('parent', pParentId);
        folderId = nlapiSubmitRecord(folderRecord, null, true)
    }

    if (!nextFolders || nextFolders.length == 0) {
        return folderId;
    } else {
        var newFolderPath = nextFolders.join('/');
        return createFolders(newFolderPath, folderId);
    }
}

function getNetsuiteFileURL(pFilePath) {
    var loadedFile = nlapiLoadFile(pFilePath);
    return loadedFile.getURL();
}

function getPersonnelByDivision(pDivisionId) {

    var divisionParent = nlapiLookupField('customer', pDivisionId, ['parent'])['parent'];
    var partnerSearch = nlapiSearchRecord("partner", null, [
        //["custentity1.parent", "anyof", divisionParent]
        ["custentity1", "anyof", pDivisionId]
    ], [
        new nlobjSearchColumn("entityid").setSort(false),
    ]);
    var personnel = [];
    if (partnerSearch && partnerSearch.length > 0) {
        for (var i = 0; i < partnerSearch.length; i++) {
            var personnelName = partnerSearch[i].getValue('entityid');
            personnelName = personnelName.indexOf(":") == -1 ? personnelName : personnelName.substring(personnelName.lastIndexOf(':') + 1, personnelName.length).trim();
            personnel.push({ name: personnelName, id: partnerSearch[i].getId() });
        }
    }
    return personnel;

}

function makePersonnelOptions(pDivisionId) {
    var personnelList = getPersonnelByDivision(pDivisionId);
    var html = "";
    for (var i = 0; i < personnelList.length; i++) {
        var personnel = personnelList[i];
        html += "<option value=" + personnel.id + ">" + personnel.name + "</option>";
    }
    return html;
}



function ValidateCookies(cookie){
    var cookieValues = extractBuilderPortalCookie(cookie);
  
    var builderID = null;
    var partnerID = null;
    var randomToken = null;
  
    if (cookieValues){
        
        builderID = cookieValues.builderid;
        partnerID = cookieValues.partnerid;
        randomToken = cookieValues.randomToken;
        

        nlapiLogExecution("DEBUG", 'validateUserInParams',  'source : cookies');
        var isValid = validatePartnerToken (partnerID, randomToken);
  
        if (isValid) return {builderid: builderID,partnerid: partnerID};
        else return null
    }
    else return null;
  }


function extractBuilderPortalCookie(pCookieString){

    if (pCookieString) {

        var cookiesArray = pCookieString.split(";")

        var bpCookie = cookiesArray.filter(function (cookie) {
            return cookie.indexOf("bp") == 0
        })[0];

        if (bpCookie) {

            var cookieValues = bpCookie.split('|');

            if (cookieValues.length == 3) {

                var builderid = cookieValues[0];
                builderid = Number(builderid.substring(builderid.indexOf("=") + 1, builderid.length));
                var partnerid = Number(cookieValues[1]);
                var randomToken = cookieValues[2];

                return { builderid : builderid, partnerid: partnerid, randomToken:randomToken }
            }
        }
    }

}



function validatePartnerToken(pPartnerId, pToken) {

    nlapiLogExecution("DEBUG", 'validateUserInParams', 'pPartner : ' + pPartnerId + ' pToken : '+pToken);
    // Validate if randomToken corresponds to user coming in params
    var partner = nlapiLookupField('partner', pPartnerId, ["custentity_mw_temp_access_token"]);

    var validation  = pToken === partner['custentity_mw_temp_access_token'];
    nlapiLogExecution("DEBUG", 'validateUserInParams', 'Is '  + pToken +  ' == ' + partner['custentity_mw_temp_access_token'] + ' : ' + validation);
    if (validation) {
        return true;
    }
    else {
        return false;
    }
}



function validateAccessDivision(pBuilderId,pProperty){

    try {

        nlapiLogExecution("DEBUG","validateAccessDivision pBuilderId",pBuilderId);
        nlapiLogExecution("DEBUG","validateAccessDivision pProperty",pProperty?pProperty:"");
        
        if (pBuilderId && pProperty){ 
                var property = nlapiLookupField("customrecord_property_record",pProperty,["custrecord12"]);
                var division = property["custrecord12"];

                if (division && division.toString() == pBuilderId.toString()) return true;
        }
        else if (pBuilderId) return true;

        return false;

    } catch (error) {
        nlapiLogExecution("ERROR","validateAccessDivision",error.message)
            return false;
    }
  }




 function makeSideNavigation(pPersonnelId) {
    var personnelPermissions = getPermissions(pPersonnelId);

    var builderInfo = nlapiLookupField('partner',pPersonnelId,['firstname', 'lastname', 'custentity1']);
    var builderName = builderInfo['firstname'] + ' '+ builderInfo['lastname'];
    var divisionId = builderInfo['custentity1'];
    var childdivisionId = nlapiLookupField('customer',divisionId,['parent'])['parent'];
    var divisionName  = nlapiLookupField('customer',childdivisionId,['companyname'])['companyname'];
    divisionName = divisionName.indexOf(':') > -1 ? divisionName.substring(0, divisionName.indexOf(':') - 1).trim() : divisionName
    var html =
        '<nav id="sidebar">'+
        '<div class="sidebar-header"><h3>HMS Builder Portal</h3><hr class="sidebar-header-hr"><h4>' + builderName + '</h4><h5>'+ divisionName+ '</h5></div>'+
        '<div><span class="sidebar-label">Navigation</span></div><ul class="list-unstyled components">'+
        '<li><a class="navbar-anchor" href="'+PRE_CONFIGURED_IDS.BUILDER_PORTAL.DASHBOARD.URL("&source=sidebar")+'">Dashboard</a></li>';


        if (personnelPermissions.PROPERTIES_ACCESS_LEVEL >= ACCESS_LEVEL.VIEW ){
            html += '<li>'+
                                '<a class="navbar-anchor" href="'+PRE_CONFIGURED_IDS.BUILDER_PORTAL.SUBMIT_SALE.URL("&source=sidebar")+'">Create Listing</a>'+
                            '</li>'+
                            '<li>'+
                                '<a class="navbar-anchor" href="'+ PRE_CONFIGURED_IDS.BUILDER_PORTAL.MODIFY_INCOMPLETE_LISTING.URL("&source=sidebar")+'">&nbsp;&nbsp;&nbsp;Modify Incomplete Listing</a>'+
                            '</li>';
        }

        // if (personnelPermissions.PROPERTIES_ACCESS_LEVEL >= ACCESS_LEVEL.VIEW ){
        //     html += '<li><a class="navbar-anchor dropdown-toggle" onclick="toggleSubmenu()" data-toggle="collapse" aria-expanded="false">Listings</a>'+
        //                 '<ul class="collapse list-unstyled" id="pageSubmenu">'+
        //                     '<li>'+
        //                         '<a class="navbar-anchor" href="'+PRE_CONFIGURED_IDS.BUILDER_PORTAL.SUBMIT_SALE.URL("&source=sidebar")+'">&nbsp;&nbsp;&nbsp;Create Listing</a>'+
        //                     '</li>'+
        //                     '<li>'+
        //                         '<a class="navbar-anchor" href="'+ PRE_CONFIGURED_IDS.BUILDER_PORTAL.MODIFY_INCOMPLETE_LISTING.URL("&source=sidebar")+'">&nbsp;&nbsp;&nbsp;Edit Incomplete Listing</a>'+
        //                     '</li>'+
        //                 '</ul>'+
        //             '</li>';
        // }
        if (personnelPermissions.SUBMIT_SALE)
            html += '<li><a class="navbar-anchor" href="'+ PRE_CONFIGURED_IDS.BUILDER_PORTAL.SUBMIT_SALE.URL("&source=sidebar")+'">Submit Sale</a></li>'; 

        if (personnelPermissions.SUBMIT_CLOSING)
            html +='<li><a class="navbar-anchor" href="'+ PRE_CONFIGURED_IDS.BUILDER_PORTAL.SUBMIT_CLOSING.URL("&source=sidebar")+'">Submit Closing</a> </li>'; 


        // if (isBuilderisAllowedToNewPortal(divisionId)){
        //     html +='</ul><hr class="sidebar-separator-hr"><div><span class="sidebar-label">Preferences</span></div><ul class="list-unstyled components">';

        //     if (personnelPermissions.BUILDER_PREFERENCES )
        //     html +='<li><a class="navbar-anchor" href="'+ PRE_CONFIGURED_IDS.BUILDER_PORTAL.BUILDER_PREFERENCES.URL("&source=sidebar")+'">Builder Preferences</a></li>';
        // }


    
    html += "</ul>" +

    '<hr class="sidebar-separator-hr">'+
    '<ul class="list-unstyled components">'+
        '<li><a class="navbar-anchor" href="'+ PRE_CONFIGURED_IDS.BUILDER_PORTAL.LOGIN.URL("") +  '">Log Out</a></li> '+
    '</ul></nav>';

    return html;
}



    



function getPermissions(pPersonnelId){

    nlapiLogExecution("DEBUG",'pPersonnelId', pPersonnelId);

    var personnelRecord = nlapiLoadRecord('partner',pPersonnelId );

    var personnelCategory = personnelRecord.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.CATEGORY);

    nlapiLogExecution("DEBUG",'getPermissions', 'personnelCategory : '+  personnelCategory);

    var searchCols = [];
    var searchFilters = [];


    var objects = Object.keys(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS);
    for (var c = 0; c < objects.length;  c++) {
        searchCols.push( new nlobjSearchColumn(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS[objects[c]]) );
    };

    searchFilters.push(new nlobjSearchFilter(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.CATEGORY, null, "is", personnelCategory));
    searchFilters.push(new nlobjSearchFilter(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.EXCLUDED_PERSONNEL, null, "noneof", pPersonnelId));

    var builderPortalRoleSearchResults = nlapiSearchRecord(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.RECORD_TYPE, null,searchFilters,searchCols);
    nlapiLogExecution("DEBUG",'getPermissions', 'personnelCategory : '+  personnelCategory);

    return mergePermissions(builderPortalRoleSearchResults, personnelRecord);

}

function mergePermissions(pBuilderPortalRoleSearchResults, pPersonnelInfo) {

    var builderPortalRolePermissions;
    var personnelPermissions;

    if (pBuilderPortalRoleSearchResults && pBuilderPortalRoleSearchResults.length > 0) {

        var builderPortalRole = pBuilderPortalRoleSearchResults[0];
        
        nlapiLogExecution("DEBUG",'getPermissions', 'JSON.stringify(builderPortalRole : '+  JSON.stringify(builderPortalRole));
        builderPortalRolePermissions = {
            AGENT_SURVEYS_ACCESS_LEVEL: builderPortalRole.getValue(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.AGENT_SURVEYS_ACCESS_LEVEL),
            APPOINTMENTS_ACCESS_LEVEL: builderPortalRole.getValue(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.APPOINTMENTS_ACCESS_LEVEL),
            PERSONNEL_ACCESS_LEVEL: builderPortalRole.getValue(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.PERSONNEL_ACCESS_LEVEL),
            PROPERTIES_ACCESS_LEVEL: builderPortalRole.getValue(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.PROPERTIES_ACCESS_LEVEL),
            SUBDIVISIONS_ACCESS_LEVEL: builderPortalRole.getValue(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.SUBDIVISIONS_ACCESS_LEVEL),
            BUILDER_PREFERENCES: builderPortalRole.getValue(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.BUILDER_PREFERENCES),

            SUBMIT_SALE: builderPortalRole.getValue(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.SUBMIT_SALE),
            SUBMIT_CLOSING: builderPortalRole.getValue(PRE_CONFIGURED_IDS.BUILDER_PORTAL_ROLE.FIELDS.SUBMIT_CLOSING),
        }
    }

    nlapiLogExecution("DEBUG",'builderPortalRolePermissions', JSON.stringify(builderPortalRolePermissions));

    personnelPermissions = {
        AGENT_SURVEYS_ACCESS_LEVEL: pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.AGENT_SURVEYS_ACCESS_LEVEL) ? pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.AGENT_SURVEYS_ACCESS_LEVEL) : "",
        APPOINTMENTS_ACCESS_LEVEL: pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.APPOINTMENTS_ACCESS_LEVEL) ? pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.APPOINTMENTS_ACCESS_LEVEL) : "",
        PERSONNEL_ACCESS_LEVEL: pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.PERSONNEL_ACCESS_LEVEL) ? pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.PERSONNEL_ACCESS_LEVEL) : "",
        PROPERTIES_ACCESS_LEVEL: pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.PROPERTIES_ACCESS_LEVEL) ? pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.PROPERTIES_ACCESS_LEVEL) : "",
        SUBDIVISIONS_ACCESS_LEVEL: pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.SUBDIVISIONS_ACCESS_LEVEL) ? pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.SUBDIVISIONS_ACCESS_LEVEL) : "",
        BUILDER_PREFERENCES: pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.BUILDER_PREFERENCES) ? pPersonnelInfo.getFieldValue(PRE_CONFIGURED_IDS.PERSONNEL.BUILDER_PREFERENCES) : "",

        SUBMIT_SALE: pPersonnelInfo[PRE_CONFIGURED_IDS.PERSONNEL.SUBMIT_SALE],
        SUBMIT_CLOSING: pPersonnelInfo[PRE_CONFIGURED_IDS.PERSONNEL.SUBMIT_CLOSING],
    }


    nlapiLogExecution("DEBUG",'personnelPermissions', JSON.stringify(personnelPermissions));

    if (builderPortalRolePermissions) {
        var permissions = {};
        for (var i in Object.keys(personnelPermissions)) {
            var permissionName = Object.keys(personnelPermissions)[i];
            permissions[permissionName] = personnelPermissions[permissionName] > builderPortalRolePermissions[permissionName] ? personnelPermissions[permissionName] : builderPortalRolePermissions[permissionName]
        }
        return permissions;
    }
    else {
        return personnelPermissions;
    }
}




function checkDuplicates(pSubdivisionId, pLotNumber){
 
    nlapiLogExecution("DEBUG", "checkDuplocates pSubdivisionId", pSubdivisionId);
    nlapiLogExecution("DEBUG", "checkDuplocates pLotNumber",pLotNumber) ;
    var duplicate = false;

    try {

        if(pSubdivisionId && pLotNumber){ 
            var newLot = pLotNumber.replace(/^0+/g, '').replace(/[^A-Za-z0-9 ]/g, '');
            var searchResuilts = nlapiSearchRecord("customrecord_property_record",null,
            [
               ["custrecordcustrecordsubdname","anyof",pSubdivisionId], 
               "AND", 
               ["formulatext: REGEXP_REPLACE({custrecord_lot_number}, '^0+|[^A-Za-z0-9 ]', '') ","is",newLot]
            ], 
            [new nlobjSearchColumn("internalid"), ]
            );

            if (searchResuilts && searchResuilts.length) duplicate = true;
        }
        
    } catch (error) {
        nlapiLogExecution("ERROR", "checkDuplocates", JSON.stringify(error));
    }


    return duplicate;
}



function isBuilderisAllowedToNewPortal(pBuilderId){
    var isAllowed = false;

    try {

        if(pBuilderId){
            var BuilderIsAllowed =  nlapiLookupField("customer", pBuilderId.toString(), "custentity_mw_new_portal_access");

            if (BuilderIsAllowed == "T" )  isAllowed = true;
        }
        
    } catch (error) {
        nlapiLogExecution("ERROR","isBuilderisAllowedToNewPortal",error.message);
    }


    return isAllowed;
}



function isPersonelAllowedToNewPortal(pPartnerId){
    
    var isAllowed = false;

    try {

        if(pPartnerId){
            var Builderid =  nlapiLookupField('partner', pPartnerId.toString(),"custentity1");

            isAllowed =  isBuilderisAllowedToNewPortal(Builderid);
        }
        
    } catch (error) {
        nlapiLogExecution("ERROR","isBuilderisAllowedToNewPortal",error.message);
    }


    return isAllowed;
}


function isJustThisPersonelAllowedToNewPortal(pPartnerId){
    
    var isAllowed = false;

    try {

        if(pPartnerId){
            var PersonelIsAllowed =  nlapiLookupField('partner', pPartnerId.toString(),"custentity_temp_field_portal_tester");

            if (PersonelIsAllowed)  isAllowed = true;
        }
        
    } catch (error) {
        nlapiLogExecution("ERROR","isBuilderisAllowedToNewPortal",error.message);
    }


    return isAllowed;
}


function makeChatra(pPartnerId){
    var  chatraCode = '';
    try {

        if (pPartnerId){

            var builderInfo = nlapiLookupField('partner', pPartnerId,['firstname', 'lastname', 'email']);
            var builderName = builderInfo['firstname']+ ' ' + builderInfo['lastname'];
            var email = builderInfo['email'];


            chatraCode += "<script> window.ChatraIntegration = { name: '"+builderName +"',  email: '"+email+"', clientId: '"+pPartnerId+"' };" + 
                "(function(d, w, c) { w.ChatraID = 'kafHu8QE7kjrx7kNk';  var s = d.createElement('script');  w[c] = w[c] || function() {(w[c].q = w[c].q || []).push(arguments);};"+
                    "s.async = true; s.src = 'https://call.chatra.io/chatra.js'; if (d.head) d.head.appendChild(s); })(document, window, 'Chatra');</script>"
        }
        
    } catch (error) {
     
        nlapiLogExecution("ERROR","makeChatra",error.message);
    }

    return chatraCode;
}