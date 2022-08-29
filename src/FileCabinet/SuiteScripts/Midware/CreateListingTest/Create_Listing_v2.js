function suitelet(request, response) {

	//Test
	try {
		if (request.getMethod() == 'GET') {
			
			nlapiLogExecution("DEBUG", "GET", request.getMethod());
			var builderID = request.getParameter('builderid');
			var propertyID = request.getParameter('propertyid');
			var partnerID = request.getParameter('partnerid');
			nlapiLogExecution("DEBUG", "builderID-starting", builderID);
			nlapiLogExecution("DEBUG", "propertyID-starting", propertyID);
			nlapiLogExecution("DEBUG", "partnerID-starting", partnerID);

			var permitidhtml = ''; var photohtml = '';
			if (propertyID != null && propertyID != '' && propertyID != undefined) {

				var loadPropertyRecord = nlapiLoadRecord('customrecord_property_record', propertyID);
				var subdivisionvalue = loadPropertyRecord.getFieldValue("custrecordcustrecordsubdname");
				var lotValue = loadPropertyRecord.getFieldValue('custrecord_lot_number');
				var streetValue = loadPropertyRecord.getFieldValue('custrecord31');
				var streetText = loadPropertyRecord.getFieldText('custrecord31');
				loadPropertyRecord.setFieldValue('custrecord_ready_to_be_entered', 'F');


				//----------------------------------------------File grabing code ---------------------

				var file_id = nlapiLookupField("customrecord_subdivision", subdivisionvalue, "custrecord49");
				var file_Load = nlapiLoadFile(file_id);

				var urlFile = file_Load.getURL();

				//---------------------------------------------------------------------------------------




				nlapiLogExecution("DEBUG", "subdivisionvalue", subdivisionvalue);
				nlapiLogExecution("DEBUG", "streetValue", streetValue);

				var streetRecord = nlapiLoadRecord('customrecord_street_name', streetValue);
				var streetDirectionValue = streetRecord.getFieldValue('custrecord_prefix');
				var streetTypeValue = streetRecord.getFieldValue('custrecord_suffix');
				var streetName = streetRecord.getFieldValue('custrecord_street_name');

				var houseNumberValue = loadPropertyRecord.getFieldValue('custrecord_house_number');
				var constructionStatusValue = loadPropertyRecord.getFieldValue('custrecord_current_construction');
				var underRoofValue = loadPropertyRecord.getFieldValue('custrecord_estimated_under_roof_date');
				var completionDateValue = loadPropertyRecord.getFieldValue('custrecord_estimated_completion_date');
				var remarksValue = loadPropertyRecord.getFieldValue('custrecord_listing_notes');
				var notesValue = loadPropertyRecord.getFieldValue('custrecord_general_property_notes');
				var photoFieldValue = loadPropertyRecord.getFieldValue('custrecord_initial_photo');
				var permitFieldValue = loadPropertyRecord.getFieldValue('custrecord_permit');
				var notesFieldValue = loadPropertyRecord.getFieldValue('custrecord_listing_notes');
				var salesStatusFieldValue = loadPropertyRecord.getFieldValue('custrecord_user_entered_sales_status');
				var listPriceFieldValue = loadPropertyRecord.getFieldValue('custrecord_current_list_price');
				var floorplanFieldValue = loadPropertyRecord.getFieldValue('custrecord_floorplan');
				var floorelevationvalue = loadPropertyRecord.getFieldValue('custrecord_elevation')
				var udate = checkNull(underRoofValue);
				var cdate = checkNull(completionDateValue);
				var filepermit;
				if (permitFieldValue) {
					filepermit = nlapiLoadFile(permitFieldValue);

					var permitidurl = checkNull(filepermit.getURL());
				}
				var openimage = "https://1309901.app.netsuite.com/core/media/media.nl?id=44882&c=1309901&h=5a62fc046f555443ae41";
				var permitidhtml = permitidurl ? '<a href=' + permitidurl + ' target="_blank"><img class="img-size" src=' + openimage + ' alt="Open"  title="open" ></a>' : ':';
				nlapiLogExecution("DEBUG", "permitidurl", permitidurl);
				var filephoto;
				if (photoFieldValue) {
					filephoto = nlapiLoadFile(photoFieldValue);
					var photourl = checkNull(filephoto.getURL());
				}
				var photohtml = photourl ? '<a href=' + photourl + ' target="_blank"><img class="img-size" src=' + openimage + ' alt="Open"  title="open" ></a>' : '';
			}


			//
			// builder personal information
			//
			var filtersbuilderpersonnel = [];
			var columnsbuilderpersonnel = [];
			columnsbuilderpersonnel.push(new nlobjSearchColumn('firstname'));
			columnsbuilderpersonnel.push(new nlobjSearchColumn('lastname'));
			filtersbuilderpersonnel[0] = new nlobjSearchFilter('custentity1', null, 'anyof', builderID);
			filtersbuilderpersonnel[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
			var resultsbuilderpersonnel = nlapiSearchRecord('partner', null, filtersbuilderpersonnel, columnsbuilderpersonnel);
			var builderpersonal = [];
			if (resultsbuilderpersonnel) {
				for (var a = 0; a < resultsbuilderpersonnel.length; a++) {
					var lastname = resultsbuilderpersonnel[a].getValue('lastname');
					var firstname = resultsbuilderpersonnel[a].getValue('firstname');
					var bperid = resultsbuilderpersonnel[a].getId();
					//					custpage_builder_personnel.addSelectOption(bperid, lastname+','+firstname);
					var internalb = [bperid, lastname + "," + firstname];
					builderpersonal.push(internalb);
				}
			}

			/////////////////////////////////////////////////////////////////////////
			// STREET TYPE

			var streetTypeSuffixOptions = [];

			var streetColumns = [];
			streetColumns.push(new nlobjSearchColumn('internalid'));
			streetColumns.push(new nlobjSearchColumn('name'));
			
			var streetFilters = new Array();
			streetFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
			

			var streetResults = nlapiSearchRecord('customlist_street_type_suffix', null, streetFilters, streetColumns);

			if (streetResults == null) {
                streetTypeSuffixOptions.push("No Street Type Suffix");
            } else {

				nlapiLogExecution("DEBUG","Street results length", streetResults.length);
                for (var i = 0; streetResults.length > i; i++) {
                					
					var streetTypeSuffix = {
						name:  streetResults[i].getValue('name'),
						id:  streetResults[i].getValue('internalid')
					}

                    streetTypeSuffixOptions.push(streetTypeSuffix);
				}
				
				nlapiLogExecution("DEBUG","Street results", JSON.stringify(streetTypeSuffixOptions));
                
			}

			/////////////////////////////////////////////////////////////////////////
			// STREET DIRECTION

			var directionalPrefixOptions = [];

			var directionalColumns = [];
			directionalColumns.push(new nlobjSearchColumn('internalid'));
			directionalColumns.push(new nlobjSearchColumn('name'));
			
			var directionalFilters = new Array();
			directionalFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
			

			var directionalResults = nlapiSearchRecord('customlist_directional_prefix', null, directionalFilters, directionalColumns);

			if (directionalResults == null) {
                directionalPrefixOptions.push("No Directional Prefix");
            } else {

				nlapiLogExecution("DEBUG","Directional prefix results length", directionalResults.length);

                for (var i = 0; directionalResults.length > i; i++) {
					var directionName = directionalResults[i].getValue('name');				
					
					if(directionName == 'E' || directionName == 'N' || directionName == 'S' || directionName == 'W'){
						var directionalPrefix = {
							name:  directionName,
							id:  directionalResults[i].getValue('internalid')
						}

						directionalPrefixOptions.push(directionalPrefix);
					}
				}
				
				nlapiLogExecution("DEBUG","Directional results", JSON.stringify(directionalPrefixOptions));
                
			}

			//////////////////////////////////////////////
			// Construction Status

			var constructionStatusOptions = [];

			var constructionStatusColumns = [];
			constructionStatusColumns.push(new nlobjSearchColumn('internalid'));
			constructionStatusColumns.push(new nlobjSearchColumn('name'));
			
			var constructionStatusFilters = new Array();
			constructionStatusFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
			
			var constructionStatusResults = nlapiSearchRecord('customlist_construction_status', null, constructionStatusFilters, constructionStatusColumns);

			if (directionalResults == null) {
                constructionStatusOptions.push("No Construction Status");
            } else {

				nlapiLogExecution("DEBUG","Construction Status results length", constructionStatusResults.length);

                for (var i = 0; constructionStatusResults.length > i; i++) {
					
					var constructionStatus = {
						name: constructionStatusResults[i].getValue('name'),
						id:  constructionStatusResults[i].getValue('internalid')
					}

					constructionStatusOptions.push(constructionStatus);
					
				}
				
				nlapiLogExecution("DEBUG","Construction Status results", JSON.stringify(directionalPrefixOptions));
                
			}

			//var results = nlapiSearchRecord('customlist', 41, null, columns);

			//nlapiLogExecution("DEBUG","list record", JSON.stringify(results));

			//SALE STATUS LIST
			//customlist"
		   // id:"31"
		   nlapiLogExecution("DEBUG","Sale Status Search ++++", "start search");
		   

		   /*  LOAD RECORD
		   saleStatusOptions = [];
		   
		   

		   var listRecord = nlapiLoadRecord('customlist', 31,{recordmode: 'dynamic'});
		   nlapiLogExecution("DEBUG","list record", JSON.stringify(listRecord));
		   nlapiLogExecution("DEBUG","record" , JSON.stringify( listRecord.getFieldValue('name')));
		  // nlapiLogExecution("DEBUG","record" , JSON.stringify( listRecord.getLineItemValue('customvalue', 'value', 0) ));
		   nlapiLogExecution("DEBUG","record" , JSON.stringify( listRecord.getLineItemValue('customValue', 'value', 0) ));
		   nlapiLogExecution("DEBUG","record" , JSON.stringify( listRecord.getLineItemValue('customValueList', 'name', 0) ));
		   nlapiLogExecution("DEBUG","record" , JSON.stringify( listRecord.getLineItemField('customValue', 'name', 0) ));
		   nlapiLogExecution("DEBUG","record" , JSON.stringify( listRecord.getLineItemCount('customvalue') ));
		   nlapiLogExecution("DEBUG","record"  , JSON.stringify( listRecord.getLineItemField('customValue','name',0) ));
		   //nlapiLogExecution("DEBUG","record"  , JSON.stringify( listRecord.customvalue[0]));
   */

		   /*  SEARCH

		   var columns = [];
		   var filters = new Array();
		   filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', 31);
		   columns.push(new nlobjSearchColumn('name'));
		  // columns.push(new nlobjSearchColumn('customvalue'));
		   //columns.push(new nlobjSearchColumn('customValue'));
		   //columns.push(new nlobjSearchColumn('customValueList'));
		   var sResults = nlapiSearchRecord('customlist', null, filters, columns);
		  
		   if (sResults == null) {
				saleStatusOptions.push("No actives sale status");

			} else {
				for (var i = 0; sResults != null && sResults.length > i; i++) {
					
					nlapiLogExecution("DEBUG","results sale status" ,JSON.stringify( sResults[i]));
					nlapiLogExecution("DEBUG","Custom value" , JSON.stringify( sResults[i].getValue('name')));
					nlapiLogExecution("DEBUG","Custom value" , JSON.stringify( sResults[i].getValue('customValue')));
					
					nlapiLogExecution("DEBUG","Custom value e" , JSON.stringify( nlapiGetLineItemValue('customlist', 'customvalue', 0) ));
					nlapiLogExecution("DEBUG","Custom value e" , JSON.stringify( nlapiGetLineItemField('customvalue', 'value', 0) ));
					nlapiLogExecution("DEBUG","Custom value ghg"  , JSON.stringify( nlapiGetLineItemText('customlist', 'value', i)));


					//saleStatusOptions.push(salesStatusResults[i])
				}
				
			}

			*/

			var saleStatusOptions = [];

			var columns = [];
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
			columns.push(new nlobjSearchColumn('internalid'));
			columns.push(new nlobjSearchColumn('name'));
			var sResults = nlapiSearchRecord('customlist31', null, filters, columns);
			
		   
           if (sResults == null) {
                saleStatusOptions.push("No actives sale status");
            } else {

				nlapiLogExecution("DEBUG","results length", sResults.length);
                for (var i = 0; sResults != null && sResults.length > i; i++) {
					var name = String(sResults[i].getValue('name'));
					
					if(name == 'Available' || name == 'Pending (Awaiting Contract)' || name == 'Closed  (Awaiting HUD)'){

                        switch(name){
							case 'Pending (Awaiting Contract)': 
								name = 'Pending';
								break;
							case 'Closed  (Awaiting HUD)': 
								name = 'Closed';
								break;
							default: break;
						}

						var salesStatus = {
							name:  name,
							id:  sResults[i].getValue('internalid')
						}
	
						saleStatusOptions.push(salesStatus);
					}
					
                }
                
			}
			
			nlapiLogExecution("DEBUG","sale status option",JSON.stringify(salesStatus) );


			//
			//buider SubDivision information
			//
			var subdivisionField = [];
			var subdivisionFieldValues = [];
			var hreflink = [];
			var link = [];
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'anyof', builderID);
			filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

			var columns = [];
			columns.push(new nlobjSearchColumn('custrecord_subdivision_id'));
			columns.push(new nlobjSearchColumn("custrecord49"));
			var results = nlapiSearchRecord('customrecord_subdivision', null, filters, columns);
			if (results == null) {
				subdivisionField.push("No Subdivisions Found for this Builder");

			} else {
				var fileRecordMap = {};
				for (var i = 0; results != null && results.length > i; i++) {
					var recordID = results[i].getId();
					//				var record = nlapiLoadRecord('customrecord_subdivision', recordID);
					var subdivisionName = results[i].getValue('custrecord_subdivision_id');

					var hrefname = results[i].getValue('custrecord49')

					nlapiLogExecution("DEBUG", "hrefname", hrefname)

					var contactNumber = "";

					var mlsNumber = nlapiLookupField("customrecord_subdivision", recordID, 'custrecord__subd_hms_callback_number')
					if (mlsNumber) {
						contactNumber = mlsNumber;

					} else {

						contactNumber = "(855) 467-2255"
					}

					//subdivisionField.addSelectOption(recordID, subdivisionName);
					subdivisionField.push(subdivisionName)
					subdivisionFieldValues.push(recordID);
					var fileLink = '';
					var domainUrl = 'https://1309901.app.netsuite.com';
					if (hrefname != '' && hrefname != null && hrefname != undefined) {
						nlapiLogExecution('DEBUG', 'If hrefname', hrefname);
						var file = nlapiLoadFile(hrefname)
						fileLink = file.getURL();

						fileRecordMap[recordID] = domainUrl + '' + fileLink;
						//				hreflink.push(domainUrl+''+fileLink);
					}
					else {
						fileRecordMap[recordID] = domainUrl + '' + fileLink;
						//					hreflink.push(fileLink);
					}


				}
			}
			var edit_create_text = 'Create ';
			if (propertyID) {
				edit_create_text = 'Modify';
			}
			nlapiLogExecution('DEBUG', 'fileRecordMap', fileRecordMap);
			//
			//floor plan 
			//
			var floorplanField = []
			//	  floorplanField.addSelectOption('-1', '', true);

			var floorPlanFilters = new Array();
			floorPlanFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

			var floorPlanColumns = [];
			floorPlanColumns.push(new nlobjSearchColumn('name'));
			var floorPlanID = []
			var floorPlanResults = nlapiSearchRecord('customrecord_floorplan', null, floorPlanFilters, floorPlanColumns);
			for (var n = 0; floorPlanResults != null && floorPlanResults.length > n; n++) {
				floorPlanID.push(floorPlanResults[n].getId());
				//		var floorPlanRecord = nlapiLoadRecord('customrecord_floorplan', floorPlanID);
				var floorPlanName = floorPlanResults[n].getValue('name');
				floorplanField.push(floorPlanName);



			}
			var imageLogo = "https://wwwimages2.adobe.com/content/dam/acom/en/legal/images/badges/Get_Adobe_Acrobat_Reader_DC_web_button_158x39.fw.png";

			var resolveURL = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=259&deploy=1&compid=1309901&h=86cd4feb2e69c3b74288';//nlapiResolveURL('SUITELET', 259, 1)
			//var resolveURL ='https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=484&deploy=1&partnerid=4958&builderid=3643';

			var html = "" ;
				/*
				'<style>' +
				'/* Tooltip container ' +
				'.tooltip {' +
				'position: relative;' +
				'display: inline-block;' +
				'border-bottom: 1px dotted black; /* If you want dots under the hoverable text ' +
				'}' +

				'/* Tooltip text ' +
				'.tooltip .tooltiptext {' +
				'visibility: hidden;' +
				'width: 240px;' +
				'top: 100%;' +
				'left: 50%;' +
				'margin-left: -120px;' +
				'background-color: #01723a;' +
				'color: #fff;' +
				'text-align: center;' +
				'padding: 5px 0;' +
				'border-radius: 6px;' +

				'/* Position the tooltip text - see examples below! ' +
				'position: absolute;' +
				'z-index: 1;' +
				'}' +

				'/* Show the tooltip text when you mouse over the tooltip container ' +
				'.tooltip:hover .tooltiptext {' +
				'visibility: visible;' +
				'}' +
				'</style>'*/
			/*
					<div class="tooltip">Hover over me
					<span class="tooltiptext">Tooltip text</span>
				</div>
			*/

			

			//html += '<style>.add,.remove-block{right:15px;text-decoration:none}.add,.logo,.more-options,.remove-block,.remove-entry{text-decoration:none}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{margin:0;padding:0;border:0;font:inherit;vertical-align:baseline}*,body{font-family:Roboto,sans-serif}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}*{box-sizing:border-box;-webkit-box-sizing:border-box}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:"";content:none}table{border-collapse:collapse;border-spacing:0}.clearfix:after,.clearfix:before{content:"";display:table}.clearfix:after{clear:both}.clearfix{zoom:1}@font-face{font-family:cheddar_jackregular;src:url(../fonts/cheddar_jack-webfont.woff2) format("woff2"),url(../fonts/cheddar_jack-webfont.woff) format("woff");font-weight:400;font-style:normal}input:focus{outline:0}input[type=text]::-webkit-input-placeholder{color:#ddd;opacity:1}input[type=text]::-moz-placeholder{color:#ddd;opacity:1}input[type=text]:-moz-placeholder{color:#ddd;opacity:1}input[type=text]::-mo-input-placeholder{color:#ddd;opacity:1}h2{font-size:36px;margin:0 0 35px;color:#251d86}.form-wrap{float:left;width:70%;padding:0 25px}.question-block input{border:1px solid #bbbaba;padding:5px;font-size:16px;width:100%}.ans-type{float:right;width:30%;padding:10px}.ans-type h3{font-size:18px;font-weight:500;margin:0 0 15px}.ans-type span{display:block;cursor:pointer;padding:10px 35px;font-size:14px;position:relative;transition:.4s all ease;-webkit-transition:.4s all ease;margin:0 0 5px;background:#ccc}.add,.submit-ans,.submit-btn{bottom:10px;transition:.4s all ease;font-weight:600}.ans-type span.active,.ans-type span:hover,.submit-ans,.submit-btn{background:#01723a;color:#fff}.ans-type span i{position:absolute;left:10px;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%)}.multiple-type-ans,.option-type-ans,.para-type-ans{display:none}.visible{display:block}.submit-ans,.submit-btn{position:absolute;left:13px;text-transform:uppercase;border:0;padding:10px 25px;letter-spacing:1px;font-size:15px;border-radius:4px;outline:0;-webkit-transition:.4s all ease;cursor:pointer}.more-options,.select-ans{text-transform:capitalize}.submit-ans:hover,.submit-btn:hover{background:#D4AF37}#survey-form{max-width:1200px;width:100%;margin:0 auto;position:relative;padding:50px 15PX 58px}.qstn-blck-wrap{display:none}.qstn-blck-wrap.block{display:block;box-shadow:0 3px 3px 1px rgba(0,0,0,.5);position:relative;margin:0 0 45px;padding:0 0 31px}.add,.div-conatiner div strong,.logo,.more-options,.p-que p{display:inline-block}.add,.add span,.remove-block{position:absolute}.remove-block{top:18px;color:#fff;font-size:20px}.add{font-size:16px;border:1px solid #01723a;border-radius:4px;padding:10px 25px;color:#01723a;-webkit-transition:.4s all ease}.add:hover{border:1px solid #D4AF37;color:#D4AF37}.add span{font-size:11px;padding:5px;background:#000;left:-80px;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%);color:#fff;opacity:0;transition:.4s all ease;-webkit-transition:.4s all ease}.add:hover span{opacity:1}.add img{max-width:100%}.answer-block{padding:20px 0}.answer-block input{margin:0;vertical-align:middle}.answer-block input[type=text]{border:0;border-bottom:1px solid #ccc;margin-left:10px;width:calc(100% - 27px);padding:5px 0}.answer-block input[type=checkbox]{width:12px;height:12px;border:1px solid #bbbaba}.answer-block li{margin:0 0 17px;position:relative}.remove-entry{position:absolute;right:0;top:0;font-size:12px}.more-options{font-size:14px;margin:15px 0 0;color:#4c4343}.answer-block label{margin:0 6px}.answer-block textarea{width:100%;resize:none;border:0;border-bottom:1px solid #ccc;pointer-events:none;outline:0}.div-conatiner{margin:0 0 30px}.div-conatiner div strong{font-weight:600;width:78px;font-size:18px;vertical-align:top;line-height:22px}.p-opt .option-list label,.p-opt input{vertical-align:middle}.p-que p{width:calc(100% - 104px);line-height:22px}.p-que{margin:0 0 10px}.div-conatiner textarea{resize:none;width:100%;border:0;border-bottom:1px solid;min-height:75px}.p-opt input{margin:0 15px 0 0}.answer-wrap .answer-block li,.p-opt,.p-opt .option-list li{margin:0 0 10px}.logo{font-family:cheddar_jackregular;font-size:50px;color:#f6f9f6;visibility: hidden;}.header{padding:25px;border-bottom:1px solid #ddd;background:#01723a}.submit-ans,.submit-block{position:absolute;left:25px;bottom:14px;text-decoration:none;font-size:12px}.error{border-bottom:1px solid red!important}.answer-wrap input[type=text]{pointer-events:none!important;border:0!important;display:inline-block;width:auto}.answer-wrap textarea{pointer-events:auto!important}.ques-num{padding:15px 30px;font-weight:500;font-size:20px;background:#D4AF37;color:#fff;margin:0 0 15px}.select-ans,span.error-ans{position:absolute;color:red}.answer-wrap .qstn-blck-wrap.block{padding:0}span.error-ans{display:block;padding:0 0 5px;font-size:14px;top:-19px}.answer-wrap .ans-type span{pointer-events:none}.select-ans{top:-23px;right:6px}@media only screen and (max-width:767px){.ans-type,.form-wrap{width:100%}}.col-sm-6{width:50%;float:left}.main-cont,.raw{width:100%;float:left}.main-cont{padding:20px 31px}label{margin-right:10px;width:135px;display:inline-block}select{width:45%;padding:7px 6px}.mb10{margin-bottom:10px}.mb15{margin-bottom:15px}.mb20{margin-bottom:20px}.mb35{margin-bottom:35px}input[type=text]{width:45%;padding:7px 9px}input[type=number]{width:45%;padding:7px 9px}.col-sm-12 input[type=text],.col-sm-12 input[type=date]{width:25%;padding:7px 9px}.col-sm-12 select {width: 25%;	}.col-sm-12 label{width:302px}.col-sm-12 p{font-size:16px;margin:20px 0;line-height:26px;color:#251d86}label.lg{width:370px}label span{font-size:11px;display:table;margin-top:3px}a#sheet:hover {background: #01723a;color: #fff;}a#sheet { color: #000;text-decoration: none;border: 1px solid #01723a;display: inline-block;padding: 5px 19px;border-radius: 7px;transition: 0.5s ease;}button.submit-btn.hms-center {left: 40%;}span.star {display: inline-block;color: red;font-size: 17px;margin-left: 2px;}.col-sm-12 p img { vertical-align: middle;}img.img-size {width: 9%; margin-left: 8px;vertical-align: middle;}span#dd {margin-left: 11px;border: 1px solid #01723a; display: inline-block; vertical-align: bottom; padding: 5px;}.tooltip {width: 302px;margin-right: 10px;border-bottom: 0;}.tooltip .tooltiptext{top: -66px; margin-left: -155px;}</style>' +


		html += '<!DOCTYPE html>' +
				'<html>' +
				'<head>' +
				'	<meta charset="utf-8">' +
				'		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">' +
				'	<title>Listing Form TEST</title>' +
				'	<link rel="stylesheet" type="text/css" href="assets/css/font-awesome.min.css">' +
				'	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900" rel="stylesheet">' +
				'	<link rel="stylesheet" type="text/css" href="assets/css/style.css">' +
				' <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" > '+
                '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">'+
				' <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>'+
				'<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">' ;
				//Include the Mains Theme
		html += '<link rel="stylesheet" href="' + BUILDER_PORTAL.CREATE_MODIFY_LISTING.CREATE_MODIFY_LISTING_URL + '">';
		html += '<link rel="stylesheet" href="' + BUILDER_PORTAL.CREATE_MODIFY_LISTING.CREATE_MODIFY_LISTING_URL + '">';
		html += '<script src="https://code.jquery.com/jquery-1.12.4.js"></script>' +
				'<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>' +
				'<script src="../ToolTips/CreateListing/CreateListingToolTips.js" type="text/javascript"></script> '+
				'<style>'+
				'label[title]:hover:after { '+
				'	content: attr(title); '+
				'	top: -66px; '+
				'	margin-left: -155px; '+
				'	font-size:.875rem; '+
				'	width: 240px; '+
				'	top: 100%; '+
				'	left: 50%; '+
				'	margin-left: -120px; '+
				'	background-color: #01723a; '+
				'	color: #fff; '+
				'	text-align: center; '+
				'	padding: 5px 0; '+
				'	border-radius: 6px; '+
				' 	position: absolute; '+
				'	z-index: 1; '+
				'}'+
				'label[title] { '+
				'  display:hidden;	'+
				'}'+
				'</style>'+
				"<script>var obj=" + JSON.stringify(fileRecordMap) + ";" +
				"function getval(sel){" +
				" var link = document.getElementById('sheet'); console.log('key',sel.value);if(obj[sel.value] == 'https://1309901.app.netsuite.com'){console.log('yaaa!!!!');link.innerHTML = 'No Market Home information Sheet is Available. Please contact us at " + contactNumber + "';link.style.pointerEvents ='none';return;}else{link.innerHTML='Acquire Market Home Information Sheet Here' ; link.setAttribute('href', obj[sel.value]);link.style.pointerEvents ='auto'}" +
				//'link.setAttribute("href", obj[sel.value]);'+
				'return;' +
				"}" +
				"</script>" +
				'<script>jQuery(document).ready(function() {' +
				'jQuery("#ud").datepicker();   ' +
				'jQuery("#cd").datepicker();});' +
				'</script>' +
				'<script> '+
                'function selectbox() { ' +
				'document.getElementById("dir").value =document.getElementById("direction1").value ;' +
				'document.getElementById("st").value=document.getElementById("streetType1").value;' +
				'document.getElementById("ss").value=document.getElementById("salesstatus1").value;' +
				'document.getElementById("cs").value=document.getElementById("constructionstatus1").value;' +
				'document.getElementsByClassName("floorpln")[0].value=document.getElementById("floorplan1").value;' +
				'document.getElementsByClassName("subdiv")[0].value=document.getElementById("subdivisionval1").value;' +
				//	'var fieldid=document.getElementById("floorplan1").value; console.log("fieldid is equal to ",fieldid)'+
				'}'+
				'var submitted = false;'+
				'$(document).ready(function() { '+
				'	$("form").submit(function() {  '+
				'		submitted = true;  '+
				'    });		'+
				' 	window.onbeforeunload = function () {  '+
				'		if (!submitted) {  '+
				'			return "Are you sure you want to leave?"; '+
				'		}  '+
				'	}  '+
				'});  '+
				'$(document).ready(function() { '+
				'	if ("'+ subdivision_label_title +'"!= "") { '+
				'		document.getElementById("subdivision_label").title = "' + subdivision_label_title + '"; '+
				'	}'+
				'	if ("'+ lot_number_label_title +'"!= "") { '+
				'		document.getElementById("lot_number_label").title = "' + lot_number_label_title + '"; '+
				'	}'+
				'	if ("'+ house_number_label_title +'"!= "") { '+
				'		document.getElementById("house_number_label").title = "' + house_number_label_title + '"; '+
				'	}'+
				'	if ("'+lot_number_label_title+'"!= "") { '+
				'		document.getElementById("lot_number_label").title = "' + lot_number_label_title + '"; '+
				'	}'+
				'	if ("'+ street_name_label_title +'"!= "") { '+
				'		document.getElementById("street_name_label").title = "' + street_name_label_title + '"; '+
				'	}'+
				'	if ("'+ street_direction_label_title +'"!= "") { '+
				'		document.getElementById("street_direction_label").title = "' + street_direction_label_title + '"; '+
				'	}'+
				'	if ("'+ street_type_label_title +'"!= "") { '+
				'		document.getElementById("street_type_label").title = "' + street_type_label_title + '"; '+
				'	}'+
				'	if ("'+ list_price_label_title +'"!= "") { '+
				'		document.getElementById("list_price_label").title = "' + list_price_label_title + '"; '+
				'	}'+
				'	if ("'+ sale_status_label_title +'"!= "") { '+
				'		document.getElementById("sale_status_label").title = "' + sale_status_label_title + '"; '+
				'	}'+
				'	if ("'+ current_construction_status_label_title +'"!= "") { '+
				'		document.getElementById("current_construction_status_label").title = "' + current_construction_status_label_title + '"; '+
				'	}'+
				'	if ("'+ estimated_under_roof_date_label_title +'"!= "") { '+
				'		document.getElementById("estimated_under_roof_date_label").title = "' + estimated_under_roof_date_label_title + '"; '+
				'	}'+
				'	if ("'+ estimated_completion_date_label_title +'"!= "") { '+
				'		document.getElementById("estimated_completion_date_label").title = "' + estimated_completion_date_label_title + '"; '+
				'	}'+
				'	if ("'+ compose_marketing_remarks_label_title +'"!= "") { '+
				'		document.getElementById("compose_marketing_remarks_label").title = "' + compose_marketing_remarks_label_title + '"; '+
				'	}'+
				'	if ("'+ check_corner_lot_label_title +'"!= "") { '+
				'		document.getElementById("check_corner_lot_label").title = "' + check_corner_lot_label_title + '"; '+
				'	}'+
				'	if ("'+ floorplan_label_title +'"!= "") { '+
				'		document.getElementById("floorplan_label").title = "' + floorplan_label_title + '"; '+
				'	}'+
				'	if ("'+ add_floorplan_label_title +'"!= "") { '+
				'		document.getElementById("add_floorplan_label").title = "' + add_floorplan_label_title + '"; '+
				'	}'+
				'	if ("'+ floorplan_elevation_label_title +'"!= "") { '+
				'		document.getElementById("floorplan_elevation_label").title = "' + floorplan_elevation_label_title + '"; '+
				'	}'+
				'	if ("'+ building_permit_file_label_title +'"!= "") { '+
				'		document.getElementById("building_permit_file_label").title = "' + building_permit_file_label_title + '"; '+
				'	}'+
				'	if ("'+ send_permit_request_to_label_title +'"!= "") { '+
				'		document.getElementById("send_permit_request_to_label").title = "' + send_permit_request_to_label_title + '"; '+
				'	}'+
				'	if ("'+ front_elevation_file_label_title +'"!= "") { '+
				'		document.getElementById("front_elevation_file_label").title = "' + front_elevation_file_label_title + '"; '+
				'	}'+
				'	if ("'+ use_rendering_on_file_label_title +'"!= "") { '+
				'		document.getElementById("use_rendering_on_file_label").title = "' + use_rendering_on_file_label_title + '"; '+
				'	}'+
				'	if ("'+ completed_market_home_info_label_title +'"!= "") { '+
				'		document.getElementById("completed_market_home_info_label").title = "' + completed_market_home_info_label_title + '"; '+
				'	}'+
				'	if ("'+ selection_sheet_file_label_title +'"!= "") { '+
				'		document.getElementById("selection_sheet_file_label").title = "' + selection_sheet_file_label_title + '"; '+
				'	}'+
				'	if ("'+ change_orders_file_label_title +'"!= "") { '+
				'		document.getElementById("change_orders_file_label").title = "' + change_orders_file_label_title + '"; '+
				'	}'+
				'	if ("'+ drawings_file_label_title +'"!= "") { '+
				'		document.getElementById("drawings_file_label").title = "' + drawings_file_label_title + '"; '+
				'	}'+
				'});  '+
				'jQuery(document).ready(function() {' +
                '	jQuery("#checkboxMarketingRemarks").change(function() { '+
                '		if( jQuery("#checkboxMarketingRemarks").prop("checked") ){'+
				'			jQuery("#tb").prop( "readonly", true ); '+
				'			jQuery("#tb").val(""); '+
				'			jQuery("#tb").val("HMS To Compose Marketing Remarks");'+
                '		} else{ '+
				'			jQuery("#tb").prop( "readonly", false ); '+
				'			jQuery("#tb").val(""); '+
				'		}'+
				'	});'+
			    '});' +
				'</script>' +
				'<script>' +
				' function validatelistprice() {' +
				'var numbers = /^[0-9\.]+$/;' +
				'  var x = document.getElementById("listingprice");' +
				'   if(!x.value.match(numbers))' +
				' {	   alert("Please Enter Listing Price(Number Only)"); return false;	}' +
				'else {	return true;	} ' +
				'}   	</script>' +
				//INDY LIMIT=750
				//COLUMBUS LIMIT=800
				'<script > function wordCount(){var i = 750;var len=document.getElementById("tb").value.length;	len=i-len;var x=document.getElementById("dd").innerHTML=len+" Remaining"; }' +
				'</script>' +
				// Script to change year of date fields if formatted with two digits
				'<script>' +
				'	function adjustyearud()' +
				'	{' +
				'		var dateValue = document.getElementById("ud").value;' +
				'		if (dateValue != "")' +
				'		{' +
				'			dateValueArray = dateValue.split(\'/\');' +
				'			var month = dateValueArray[0];' +
				'			var day = dateValueArray[1];' +
				'			var year = dateValueArray[2];' +
				'			if (year.length == 2)' +
				'			{' +
				'				document.getElementById("ud").value = month + \'/\' + day + \'/20\' + year;' +
				'			}' +
				'			else' +
				'			{' +
				'				document.getElementById("ud").value = dateValue;' +
				'			}' +
				'		}' +
				'	}' +
				'	function adjustyearcd()' +
				'	{' +
				'		var dateValue = document.getElementById("cd").value;' +
				'		if (dateValue != "")' +
				'		{' +
				'			dateValueArray = dateValue.split(\'/\');' +
				'			var month = dateValueArray[0];' +
				'			var day = dateValueArray[1];' +
				'			var year = dateValueArray[2];' +
				'			if (year.length == 2)' +
				'			{' +
				'				document.getElementById("cd").value = month + \'/\' + day + \'/20\' + year;' +
				'			}' +
				'			else' +
				'			{' +
				'				document.getElementById("cd").value = dateValue;' +
				'			}' +
				'		}' +
				'	}' +
				'function fileChanged(browseButton,label) {  '+
				'	console.log(browseButton); var input = document.getElementById(browseButton);'+
				'	var truncated = ""; console.log(name); '+
				'	var fileName = input.files[0].name;; '+
				'	var extension = fileName.split(".");  console.log(extension);'+
				'	if (fileName.length > 25){'+
				'		for(var i = 0; i < 12; i++){ '+
				'			truncated += fileName[i];'+
				'		}  '+
				'		var l =extension[0].length;  console.log(l);'+
				'		truncated += "..." + extension[0].substring(l-6) +"."+extension[1]; '+
				'	} '+
				'	else{  '+
				'		truncated = fileName;  '+
				'    }  '+
				'	console.log(label);document.getElementById(label).innerHTML = truncated;  '+
				'};  '+
				/*'$(\'.listing-check\').click(function(){                '+
				'var fieldValue = (\'#listingprice\').val().trim()'+
				'    if(fieldValue == 0 && fieldValue.length >=0 ) {'+
				'        '+
				'alert("Please enter Value for Listing Price")'+
				'return false;'+
				'    }'+
				'    else{'+
				'        return true;'+
				'    }'+
				'});'+*/
				'</script></head>' +
				'<body onload=\'selectbox()\'>' +
				'<input type = "hidden" name = "direction1" value=\'' + streetDirectionValue + '\' id=\'direction1\'>' +
				'<input type = "hidden" name = "streetType1" value=\'' + streetTypeValue + '\' id=\'streetType1\'>' +
				'<input type = "hidden" name = "salesstatus1" value=\'' + salesStatusFieldValue + '\' id=\'salesstatus1\'>' +
				'<input type = "hidden" name = "constructionstatus1" value=\'' + constructionStatusValue + '\' id=\'constructionstatus1\'>' +
				'<input type = "hidden" name = "floorplan1" value=\'' + floorplanFieldValue + '\' id=\'floorplan1\'>' +
				'<input type = "hidden" name = "subdivisionval1" value=\'' + subdivisionvalue + '\' id=\'subdivisionval1\'>' +
				'	<div class="wrapper">' +
				'		<!-- Header Starts Here -->' +
				'		<header class="header" style="color:white;text-align:center;font-size:x-large">' +
				//	'			<a href="#" class="logo">Survey Form</a>'+
				edit_create_text + ' New Listing' +
				'		</header>' +
				'		<!-- Header Ends Here -->' +
				'		<form id=\'survey-form\'  method=\'POST\' action=\'' + resolveURL + '\' enctype=\'multipart/form-data\'>' +
				//'			<h2>Create or Edit Listing</h2>'+
				'			<button type="reset" value="Reset" class="add">Reset</button>' +
				'				<button type=\'submit\' class=\'submit-btn listing-check\' onClick=\'return validatelistprice();\' name="saveandsubmit" value ="checkmark"  >Save and Submit to HMS</button>' +
				'<button type=\'submit\' class=\'submit-btn hms-center\' name="saveasincomplet">Save as Incomplete</button>' +
				'			<div class="qstn-blck-wrap block clearfix" id="qstn-blck-wrap1">' +
				'				<div class="ques-num">Please Enter the Listing Information Below</div>' +
				'               <div class="main-cont">				' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-6">' +
				'					       <label id="subdivision_label">Subdivision <span>To select a Market Home info Sheet below you must first choose a subdivision</label>' +
				'							<select name=\'recordID\' class=\'subdiv\' onchange="getval(this);" >' +
				'							  <option></option>';
			for (var j = 0; j < subdivisionField.length; j++) {

				html += '<option value=' + subdivisionFieldValues[j] + '>' + subdivisionField[j] + '</option>';
			}


			html += '							</select>' +
				'				     </div> 	' +
				'					 <div class="col-sm-6">' +
				'					     <label id="lot_number_label">Lot Number</label>' +
				'					     <input type=\'text\' name=\'lotnumber\' placeholder=\'Lot Number\' value=\'' + (lotValue || "") + '\' required  > ' +
				'					 </div> 	' +
				'				   </div>' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-6">' +
				'					        <label id="house_number_label">House Number</label>' +
				'							<input type=\'text\' name=\'housenumber\' placeholder=\'House Number\'value=\'' + (houseNumberValue || "") + '\' maxlength=7 > ' +
				'				     </div> 	' +
				'					 <div class="col-sm-6">' +
				'					        <label id="street_name_label">Street Name</label>' +
				'							<input type=\'text\' name=\'streetname\' placeholder=\'Street Name\' value=\'' + (streetName || "") + '\' > ' +
				'					 ' +
				'					 </div> 	' +
				'				   </div>' +
				'				   <div style="border-bottom: 2px solid #bfb9b9;padding-bottom: 20px;" class="raw mb20">				' +
				'					 <div class="col-sm-6">' +
				'					        <label id="street_direction_label">Street Direction</label>' +
				'							<select name=\'direction\' maxlength=2 id=\'dir\'>' +
				'							  <option></option> ';
				for(var j=0; j< directionalPrefixOptions.length ; j++){
					html += '<option value=' + directionalPrefixOptions[j].id + '>' + directionalPrefixOptions[j].name + '</option>';
				}

				html +=	'						</select>' +
				'				     </div> 	' +
				'					 <div class="col-sm-6">' +
				'					      <label id="street_type_label">Street Type</label>' +
				'							<select name=\'streetType\' required id=\'st\'>' +
				'							  ' +
				'							  <option value=\'\'></option>';
				for(var j=0; j< streetTypeSuffixOptions.length ; j++){
					html += '<option value=' + streetTypeSuffixOptions[j].id + '>' + streetTypeSuffixOptions[j].name + '</option>';
				}
				
				html += '						</select>' +
				'					 ' +
				'					 </div> 	' +
				'				   </div>' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-6">' +
				'					        <label id="list_price_label">List Price</label>' +
				'							<input type=\'number\' name=\'lastprice\' placeholder=\'List Price\'value=\'' + (listPriceFieldValue || "") + '\'  id=\'listingprice\' pattern=\'\\d*.\d{1,2}\'> ' +
				'				     </div> 	' +
				'' +
				'' +
				'					 <div class="col-sm-6">' +
				'					     <label id="sale_status_label">Sale Status</label>' +
				'					        <select name=\'salesStatus\'required id=\'ss\'>' +
				'							  <option></option>' ;
				    for(var j=0; j< saleStatusOptions.length ; j++){
						html += '<option value=' + saleStatusOptions[j].id + '>' + saleStatusOptions[j].name + '</option>';
					}
				html +='							</select>' +
				'					 </div> 	' +
				'				   </div>' +
				'				  ' +
				'				   ' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					         <label id = "current_construction_status_label"> Current Construction Status </label>' +
				'							<select name=\'currentStatus\' required id=\'cs\'>' +
				'							 <option value=\'\'></option>';
				for(var j=0; j< constructionStatusOptions.length ; j++){
					html += '<option value=' + constructionStatusOptions[j].id + '>' + constructionStatusOptions[j].name + '</option>';
				}
				html += '							</select>' +
				'				     </div> 		' +
				'				   </div>' +
				'				    <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					        <label id = "estimated_under_roof_date_label">Estimated Under Roof Date</label>' +
				'							<input type=\'text\' name=\'roofdate\' value="' + checkNull(udate) + '" id=\'ud\' onfocusout="adjustyearud()"> ' +
				'				     </div> 		' +
				'				   </div>' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					        <label id = "estimated_completion_date_label">Estimated Completion Date</label>' +
				'							<input type=\'text\' name=\'completiondate\'value="' + checkNull(cdate) + '" id=\'cd\' onfocusout="adjustyearcd()"> ' +
				'				     </div> 		' +
				'				   </div>' +
 				// '					<div class="raw mb20">				' +
				// '					 <div class="col-sm-12">' +
				// '					        <label id = "compose_marketing_remarks_label">HMS To Compose Marketing Remarks</label>' +
				// '							<input type=\'checkbox\' name=\'checkboxMarketingRemarks\'value="' + checkNull(cdate) + '" id=\'checkboxMarketingRemarks\'> ' +
				// '				     </div> 		' +
				// '				   </div>' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				//'					 <input onblur="textCounter(this.form.recipients,this,306);" disabled  onfocus="this.blur();" tabindex="999" maxlength="3" size="3" value="306" name="counter">'+
				'					        <div style="font-size=14px;" class="tooltip">Marketing Remarks<span class="tooltiptext">Enter a Property Description as You Would Like it to Appear in MLS</span></div>' +
				//'					        <label>Marketing Remarks <span> (Enter a Property Description as You Would Like it to Appear in MLS)</span></label>'+
				//<input type=\'text\' name=\'housenumber\' placeholder=\'House Number\'value=\''+(houseNumberValue || "")+'\' maxlength=7 > '+
				'							<textarea style=\'resize:both\' name=\'remarks\' rows=\'4\' cols=\'32\' id=\'tb\' onkeyup=\'wordCount()\'  >' + (remarksValue || "") + '</textarea ><span id="dd">750 Remaining</span> ' +
				//'							<textarea onblur=\'"textCounter(this,this.form.counter,306);" onkeyup="textCounter(this,this.form.counter,306)\' style=\'resize:both\' name=\'remarks\' rows=\'4\' cols=\'32\'  ></textarea > '+

				'</div> 		' +
				'				   </div>';
			/*
							function textCounter( field, countfield, maxlimit ) {
							if ( field.value.length > maxlimit ) 
							{
								field.value = field.value.substring( 0, maxlimit );
								field.blur();
								field.focus();
								return false;
							} 
								else 
							{
								countfield.value = maxlimit - field.value.length;
							}
							}
			*/
			html += '' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					        <div class="tooltip">Listing Notes<span class="tooltiptext">Enter Any Notes or special Instructions for the HMS Staff to be Aware of Here</span></div>' +
				//	'					        <label>Listing Notes <span> (Enter Any Notes or special Instructions for the HMS Staff to be Aware of Here)</label>'+
				'							<textarea style=\'resize:both\' name=\'listingnotes\' rows=\'4\' cols=\'32\'  >' + (notesValue || "") + '</textarea > ' +

				'</div> 		' +
				'				   </div>' +

				'				    <div style="border-bottom: 2px solid #bfb9b9;padding-bottom: 20px;"  class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					        <label id = "check_corner_lot_label">Check if this is a corner lot</label>' +
				'							<input type=\'checkbox\' name=\'checkcornerlot\'> ' +
				'				     </div> 		' +
				'				   </div>' +



				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					       <label id= "floorplan_label">Floorplan</label>' +
				'					        <select name=\'floorPlanID\' id=\'fp\' class=\'floorpln\'>' +
				'							  <option></option> ';
			for (var i = 0; i < floorplanField.length; i++) {
				html += '<option value=' + floorPlanID[i] + '>' + floorplanField[i] + '</option>';
			}

			html += '' +
				'							</select>' +
				'				     </div> 		' +
				'				   </div>' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					        <label id = "add_floorplan_label">Add Floorplan (if not listed above)</label>' +
				'							<input type=\'text\' name=\'currnt\' placeholder=\'Add Floorplan (if not listed above)\' > ' +
				'				     </div> 		' +
				'				   </div>' +
				'				   <div style="border-bottom: 2px solid #bfb9b9;padding-bottom: 20px;" class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					        <label id = "floorplan_elevation_label">Floorplan Elevation</label>' +
				'							<input type=\'text\' name=\'floorplanelevtion\' placeholder=\'Floorplan Elevation\' value=\'' + (floorelevationvalue || "") + '\' > ' +
				'				     </div> 		' +
				'				   </div>' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					    <label id= "building_permit_file_label" class="custom-file-ext-label"style="display:inline-block;">Upload Building Permit Here' + permitidhtml + '</label>' +
				'						<div class="custom-file" style="display:inline">  ' +
				'							<input name=\'permithere\' id=\'permithere\' class=\'custom-file-input\' type=\'file\' aria-describedby=\'inputGroupFileAddon01\' onchange=\'fileChanged("permithere","custom-file-label-permit")\'> ' +
				'    						<label class="custom-file-label" for="permithere" id="custom-file-label-permit"  >Choose File</label> ' +
				'				        </div> 		' +
				'				     </div> 		' +
				'				   </div>' +
				'				    <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					         <label id = "send_permit_request_to_label" >Send Permit Request To <span>(Select someone to send a request for a building permit here)</span></label>' +
				'							 ' +
				'							<select name=\'builderpersonal\' >' +
				'							  <option></option>';
			for (var i = 0; i < builderpersonal.length; i++) {
				html += '<option value=' + builderpersonal[i][0] + '>' + builderpersonal[i][1] + '</option>';
			}

			html += '							</select>	 ' +
				'				     </div> 		' +
				'				   </div>' +
				'				   <div class="raw mb20">				' +
				'					 <div class="col-sm-12">' +
				'					        <label id = "front_elevation_file_label" class="custom-file-ext-label"style="display:inline-block; margin-top: 20px;"> Upload Front Elevation Photo or Rendering' + photohtml + '</label>' +
				'						    <div class="custom-file" style="display:inline">  ' +	'						    <div class="custom-file" style="display:inline">  ' +
				'							<input name=\'photoValue\' id=\'photoValue\' type=\'file\' class=\'custom-file-input\' aria-describedby=\'inputGroupFileAddon01\' onchange=\'fileChanged("photoValue","custom-file-label-photoValue")\'> ' +
				'    						<label class="custom-file-label" for="photoValue" id="custom-file-label-photoValue"  >Choose File</label> ' +
				'				           </div> 		' +
				'				     </div> 		' +
				'				   </div>' +
				'				   ' +
				'				   <div class="raw mb20" style="border-bottom:1px solid; padding-bottom:20px;">				' +
				'					 <div class="col-sm-12">' +
				'					        <label id = "use_rendering_on_file_label">Use Rendering on File with HMS</label>' +
				'							<input type=\'checkbox\' name=\'renderinghms\'> ' +
				'				     </div> 		' +
				'				   </div>' +
				'				   <div class="raw">				' +
				'					 ' +
				'                     <div class="col-sm-12">' +
				'						 <p><a target="_blank" href="' + urlFile + '" id="sheet">Acquire Market Home Information Sheet Here</a></p>' +
				'					     <p>You must right click on the "Acquire Market Home Information Sheet Here" button above, select "Save Link As..." or "Save Target As..." and save it to your desktop (or any other temporaray location). Go to your desktop (or wherever you saved it) and open the file you just saved with <a href="http://www.adobe.com/go/getreader" target="_blank"><img src=' + imageLogo + ' alt="Acrobat Reader"  title="Acrobat Reader" ></a>.'; html += ' Then fill out and save the newly completed PDF. Finally, upload the PDF below. <p><p>If you are not quite ready to fill out a Market Home Information Sheet, or to fully complete this form you can Save as Incomplete and come back to it later.</p>' +
					'				     </div>					 ' +
					'				   </div>' +
					'				   <div class="raw mb20">				' +
					'					 <div class="col-sm-12">' +
					'					        <label id = "completed_market_home_info_label" class="lg" style="display:inline-block;margin-top: 25px;" >Upload Completed Market Home Information Sheet</label>' +
				'						    	<div class="custom-file" style="display:inline">  ' +
					'								<input type=\'file\' name=\'information\' id=\'information\'class=\'custom-file-input\' type=\'file\' aria-describedby=\'inputGroupFileAddon01\' onchange=\'fileChanged("information","custom-file-label-information")\'> ' +
				'    								<label class="custom-file-label" for="permithere" id="custom-file-label-information" >Choose File</label> ' +
					'				             </div> 		' +
					'				        </div> 		' +
					'				     </div> 		' +
					'				   <div class="raw mb20">				' +
					'					 <div class="col-sm-12">' +
					'					        <label  id="selection_sheet_file_label" class="lg" style="display:inline-block;margin-top: 25px;" >Upload Selection Sheet Here</label>' +
					'						    <div class="custom-file" style="display:inline">  ' +
					'								<input type=\'file\' name=\'selectionSheet\' id=\'selectionSheet\'class=\'custom-file-input\' type=\'file\' aria-describedby=\'inputGroupFileAddon01\' onchange=\'fileChanged("selectionSheet","custom-file-label-selectionSheet")\'> ' +
					'    							<label class="custom-file-label"  id="custom-file-label-selectionSheet" >Choose File</label> ' +
					'				         	 </div> 		' +
					'				        </div> 		' +
					'				     </div> 		' +
					'				   <div class="raw mb20">				' +
					'					 <div class="col-sm-12">' +
					'					        <label id = "change_orders_file_label" class="lg" style="display:inline-block;margin-top: 25px;" >Upload Change Orders Here</label>' +
					'						    <div class="custom-file" style="display:inline">  ' +
					'								<input type=\'file\' name=\'orders\' id=\'orders\'class=\'custom-file-input\' type=\'file\' aria-describedby=\'inputGroupFileAddon01\' onchange=\'fileChanged("orders","custom-file-label-orders")\'> ' +
					'    							<label class="custom-file-label" for="orders" id="custom-file-label-orders" >Choose File</label> ' +
					'				          </div> 		' +
					'				         </div> 		' +
					'				     </div> 		' +
					'				   <div class="raw mb20">				' +
					'					 <div class="col-sm-12">' +
					'					        <label  id="drawings_file_label" class="lg" style="display:inline-block;margin-top: 25px;" >Upload Drawings Here</label>' +
					'						    <div class="custom-file" style="display:inline">  ' +
					'								<input type=\'file\' name=\'drawings\' id=\'drawings\'class=\'custom-file-input\' type=\'file\' aria-describedby=\'inputGroupFileAddon01\' onchange=\'fileChanged("drawings","custom-file-label-drawings")\'> ' +
					'    							<label class="custom-file-label" for="drawings" id="custom-file-label-drawings" >Choose File</label> ' +
					'				          </div> 		' +
					'				         </div> 		' +
					'				     </div> 		' +
					'				   </div>' +
					'				   ' +
					'               </div>' +
					'				' +
					'			</div>' +
					'' +
					'' +
					'<input type = "hidden" name = "builderid" value="' + builderID + '">' +
					'<input type = "hidden" name = "propertyiD" value="' + propertyID + '">' +
					'<input type = "hidden" name = "partnerid" value="' + partnerID + '">' +
					'		</form>' +
					'		' +
					'	</div>' +
					'	' +
					'</body>' +
					'</html>';





		    nlapiLogExecution("DEBUG", "Here", "Finish HTML");

			response.write(html);



		}

		else {

            nlapiLogExecution("DEBUG", "POST", request.getMethod());
			//
			//Geting data from HTML 
			//
			var formData = request.getAllParameters()
             nlapiLogExecution("DEBUG", "All params",JSON.stringify(request.getAllParameters()));


			var builderID = checkNull(formData.builderid);
			nlapiLogExecution("DEBUG", "builderID old", builderID)
			var partnerID = checkNull(formData.partnerid)
			nlapiLogExecution("DEBUG", "partnerID old", partnerID)
			var getpropertyID = checkNull(formData.propertyiD)
			nlapiLogExecution("DEBUG", "getpropertyID old", getpropertyID)
			var subdivisionValue = checkNull(formData.recordID);

			nlapiLogExecution('DEBUG', 'subdivisionValue', subdivisionValue);


			var lotValue = checkNull(formData.lotnumber);

			var streetDirectionValue = checkNull(formData.direction);

			var streetNameValue = checkNull(formData.streetname);

			var streetTypeValue = checkNull(formData.streetType);

			var houseNumberValue = checkNull(formData.housenumber);

			var salesStatusValue = checkNull(formData.salesStatus);

			var listPriceFieldValue = Number(checkNull(formData.lastprice));

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





			//nlapiLogExecution("DEBUG", "markascomplet", markascomplet)

			var underRoofValue = checkNull(formData.roofdate);

			nlapiLogExecution("DEBUG", "underRoofValue", underRoofValue)
			//	 	    if (underRoofValue){
			//	    	underRoofValue = underRoofValue.split('/')
			//	        var month=underRoofValue[1]
			//	    	var date=underRoofValue[2]
			//	    	var year=underRoofValue[0]
			//	    	underRoofValue=month+'/'+date+'/'+year;
			//	    }


			var completionDateValue = checkNull(formData.completiondate);

			nlapiLogExecution("DEBUG", "completionDateValue", completionDateValue)
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


			var permitFieldValue = checkNull(request.getFile('permithere'))

			var photoFieldValue = checkNull(request.getFile('photoValue'))

			var useRenderingValue = checkNull(formData.renderinghms);
			if (useRenderingValue == "on") {

				useRenderingValue = "T";
			}


			//	    var formCompleteValue = checkNull(formData.markproperty);
			//	    			if(useRenderingValue=="on"){
			//			
			//	    				useRenderingValue="T";
			//	    			}

			var marketHomeInfoValue = checkNull(request.getFile('information'));

			var selectionSheetValue = checkNull(request.getFile('selectionSheet'));
            nlapiLogExecution('DEBUG', 'selection sheet', selectionSheetValue);
            
            var ordersValue = checkNull(request.getFile('orders'));
			nlapiLogExecution('DEBUG', 'orders', ordersValue);

            var drawingsValue = checkNull(request.getFile('drawings'));
			nlapiLogExecution('DEBUG', 'drawings', drawingsValue);

            var builderpersonnel = checkNull(formData.builderpersonal)
			nlapiLogExecution('DEBUG', 'builderpersonnel', builderpersonnel);


			//	    nlapiLogExecution("DEBUG", "cornerLotValue",cornerLotValue )
			//	     nlapiLogExecution("DEBUG", "useRenderingValue",useRenderingValue )
			////	     nlapiLogExecution("DEBUG", "completionDateValue",completionDateValue )
			//	    

			//Get Sales Status text	  
			var salesStatusFilters = new Array();
			salesStatusFilters[0] = new nlobjSearchFilter('custrecord_property_status', null, 'is', salesStatusValue);
			nlapiLogExecution('DEBUG', 'line', '566');
			var salesStatusResults = nlapiSearchRecord('customrecord_property_record', null, salesStatusFilters);
			for (var j = 0; salesStatusResults != null && j == 0; j++) {
				nlapiLogExecution('DEBUG', 'salesStatusResults[j].getId()', salesStatusResults[j].getId());

				var getSalesStatusRecord = nlapiLoadRecord('customrecord_property_record', salesStatusResults[j].getId());
				var salesStatusText = getSalesStatusRecord.getFieldText('custrecord_property_status');
			}
			//Get Street Direction text
			var streetDirectionText = null;
			if (streetDirectionValue != null && streetDirectionValue != '') {
				var streetDirectionFilters = new Array();
				streetDirectionFilters[0] = new nlobjSearchFilter('custrecord_prefix', null, 'is', streetDirectionValue);
				nlapiLogExecution('DEBUG', 'line', '580');
				var streetDirectionResults = nlapiSearchRecord('customrecord_street_name', null, streetDirectionFilters);
				for (var k = 0; streetDirectionResults != null && k == 0; k++) {
					var streetDirectionRecord = nlapiLoadRecord('customrecord_street_name', streetDirectionResults[k].getId());
					streetDirectionText = streetDirectionRecord.getFieldText('custrecord_prefix');
				}
			}
			//Get Subdivision text
			var subdivisionFilters = new Array();
			subdivisionFilters[0] = new nlobjSearchFilter('internalid', null, 'is', subdivisionValue);
			nlapiLogExecution('DEBUG', 'line', '591');
			var subdivisionResults = nlapiSearchRecord('customrecord_subdivision', null, subdivisionFilters);
			for (var m = 0; subdivisionResults != null && m == 0; m++) {
				var subdivisionRecord = nlapiLoadRecord('customrecord_subdivision', subdivisionResults[m].getId());
				var subdivisionText = subdivisionRecord.getFieldValue('name');
			}
			nlapiLogExecution('DEBUG', 'line', '598');
			var street = null;
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_street_name', null, 'is', streetNameValue);
			filters[1] = new nlobjSearchFilter('custrecord_suffix', null, 'anyof', streetTypeValue);
			filters[2] = new nlobjSearchFilter('custrecord_subdivision', null, 'anyof', subdivisionValue);
			if (streetDirectionValue != '' && streetDirectionValue != null && streetDirectionValue != '-1') {
				filters[3] = new nlobjSearchFilter('custrecord_prefix', null, 'anyof', streetDirectionValue);
			}
			nlapiLogExecution('DEBUG', 'line', '608');
			var streetTypeFilters = new Array();
			streetTypeFilters[0] = new nlobjSearchFilter('custrecord_suffix', null, 'is', streetTypeValue);

			var streetTypeResults = nlapiSearchRecord('customrecord_street_name', null, streetTypeFilters);
			nlapiLogExecution('DEBUG', 'line', '613');
			for (var l = 0; streetTypeResults != null && l == 0; l++) {
				var streetTypeRecord = nlapiLoadRecord('customrecord_street_name', streetTypeResults[l].getId());
				var streetTypeText = streetTypeRecord.getFieldText('custrecord_suffix');
			}
			var results = nlapiSearchRecord('customrecord_street_name', null, filters);
			nlapiLogExecution('DEBUG', 'line', '620');
			if (results == null) {
				var newStreetName;
				var createStreetRecord = nlapiCreateRecord('customrecord_street_name');
				createStreetRecord.setFieldValue('custrecord_subdivision', subdivisionValue);
				createStreetRecord.setFieldValue('custrecord_prefix', streetDirectionValue);
				createStreetRecord.setFieldValue('custrecord_suffix', streetTypeValue);
				createStreetRecord.setFieldValue('custrecord_street_name', streetNameValue);
				createStreetRecord.setFieldValue('custrecord_externally_created', 'T');

				if (streetDirectionValue == null || streetDirectionValue == '') {
					newStreetName = streetNameValue + ' ' + streetTypeText;
				}

				else {
					newStreetName = streetNameValue + ' ' + streetTypeText + ' ' + streetDirectionText;
				}
				createStreetRecord.setFieldValue('name', newStreetName);
				street = nlapiSubmitRecord(createStreetRecord, true, true);
			}
			nlapiLogExecution('DEBUG', 'line', '643');
			for (var i = 0; results != null && results.length > i; i++) {
				street = results[i].getId();
			}

			if (streetDirectionText != null) {
				var roughStreetName = streetNameValue + ' ' + streetTypeText + ' ' + streetDirectionText;
			}

			else {
				var roughStreetName = streetNameValue + ' ' + streetTypeText;
			}
			var propertyName = roughStreetName + ' ' + houseNumberValue + ' (' + salesStatusText + ') ' + subdivisionText;
			var simpleName = houseNumberValue + ' ' + roughStreetName;
			if (addFloorplanValue != null && addFloorplanValue != '' && addFloorplanValue != '-1' && addFloorplanValue != undefined) {
				var newFloorplan = nlapiCreateRecord('customrecord_floorplan');
				newFloorplan.setFieldValue('name', addFloorplanValue);
				floorplanValue = nlapiSubmitRecord(newFloorplan);
			}
			var propertyRecord;
			if (getpropertyID != null && getpropertyID != '' && getpropertyID != undefined && getpropertyID != 'null') {
				nlapiLogExecution('DEBUG', 'line', '669');
				propertyRecord = nlapiLoadRecord('customrecord_property_record', getpropertyID);

				nlapiLogExecution('DEBUG', 'line', '671');
			}


			else {
				propertyRecord = nlapiCreateRecord('customrecord_property_record');
				nlapiLogExecution('DEBUG', 'Creating new record', '710');
			}

			nlapiLogExecution('DEBUG', 'line', '678');

			propertyRecord.setFieldValue('name', propertyName);
			//var readyToBeEntered = propertyRecord.getValue('custrecord_ready_to_be_entered');
			propertyRecord.setFieldValue('custrecord_ready_to_be_entered', 'F');
			//propertyRecord.setFieldValue('custrecord12', builderDivisionID);
			propertyRecord.setFieldValue('custrecordcustrecordsubdname', subdivisionValue);
			propertyRecord.setFieldValue('custrecord_lot_number', lotValue);
			nlapiLogExecution('DEBUG', 'lotValue submited', lotValue);
			propertyRecord.setFieldValue('custrecord_property_status', '6');

			nlapiLogExecution('DEBUG', 'Line No', '782');
			propertyRecord.setFieldValue('custrecord_user_entered_sales_status', salesStatusValue);
			propertyRecord.setFieldValue('custrecord_simple_name', simpleName);
			nlapiLogExecution('DEBUG', 'Line No', '785');
			propertyRecord.setFieldValue('custrecord_house_number', houseNumberValue);
			propertyRecord.setFieldValue('custrecord_current_construction', constructionStatusValue);
			nlapiLogExecution('DEBUG', 'Line No', '788');
			propertyRecord.setFieldValue('custrecord_construction_status_listing', constructionStatusValue);
			nlapiLogExecution('DEBUG', 'Line No', '7931121' + underRoofValue);
			propertyRecord.setFieldValue('custrecord_estimated_under_roof_date', underRoofValue);
			nlapiLogExecution('DEBUG', 'Line No', '795');
			propertyRecord.setFieldValue('custrecord_estimated_completion_date', completionDateValue);
			nlapiLogExecution('DEBUG', 'Line No', '797');

			propertyRecord.setFieldValue('custrecord_listing_notes', remarks);
			nlapiLogExecution('DEBUG', 'Line No', '789');

			//	newNotes = listingnotes.trim() + '\r---Entered Using script 259';
			//        nlapiLogExecution("DEBUG","newNotes", newNotes);
			propertyRecord.setFieldValue('custrecord_general_property_notes', listingnotes);
			nlapiLogExecution('DEBUG', 'Line No', '798');

			propertyRecord.setFieldValue('custrecord_original_listing_price', listPriceFieldValue);
			nlapiLogExecution('DEBUG', 'Line No', '801');

			propertyRecord.setFieldValue('custrecord_current_list_price', listPriceFieldValue);
			nlapiLogExecution('DEBUG', 'Line No', '793');
			propertyRecord.setFieldValue('custrecord31', street);
			propertyRecord.setFieldValue('customform', '12');
			nlapiLogExecution('DEBUG', 'Line No', '796');
			propertyRecord.setFieldValue('custrecord_elevation', floorplanelevtion);
			propertyRecord.setFieldValue('custrecord_corner_lot', cornerLotValue);
			nlapiLogExecution('DEBUG', 'Line No', '799');
			propertyRecord.setFieldValue('custrecord_use_rendering', useRenderingValue);
			propertyRecord.setFieldValue("custrecord_created", partnerID);
			nlapiLogExecution('DEBUG', 'Line No', '802');
			if (markascomplet) {

				propertyRecord.setFieldValue('custrecord_ready_to_be_entered', 'T')

				nlapiLogExecution('DEBUG', 'Line No', '807');
			} else if (markasIncomplet) {
				propertyRecord.setFieldValue('custrecord_ready_to_be_entered', 'F')

				nlapiLogExecution('DEBUG', 'Line No', '811');
			}

			if (floorplanFieldValue != '-1') {
				propertyRecord.setFieldValue('custrecord_floorplan', floorplanFieldValue);
				nlapiLogExecution('DEBUG', 'Line No', '817');
			}

			if (marketHomeInfoValue != null && marketHomeInfoValue != '') {
				nlapiLogExecution('DEBUG', 'Line No', '822');
				marketHomeInfoValue.setFolder(38);
				var marketHomeInfoFile = nlapiSubmitFile(marketHomeInfoValue);
				propertyRecord.setFieldValue('custrecord_market_home_info', marketHomeInfoFile);
				nlapiLogExecution('DEBUG', 'Line No', '826');
			}

			if (permitFieldValue != null && permitFieldValue != '') {
				nlapiLogExecution('DEBUG', 'Line No', '831');
				permitFieldValue.setFolder(951);
				var permitFile = nlapiSubmitFile(permitFieldValue);
				propertyRecord.setFieldValue('custrecord_permit', permitFile);
				nlapiLogExecution('DEBUG', 'Line No', '835');
			}

			if (photoFieldValue != null && photoFieldValue != '') {

				nlapiLogExecution('DEBUG', 'Line No', '841');
				photoFieldValue.setFolder(-4);
				var photoFile = nlapiSubmitFile(photoFieldValue);
				propertyRecord.setFieldValue('custrecord_initial_photo', photoFile);
				nlapiLogExecution('DEBUG', 'Line No', '845');
			}

			if(selectionSheetValue != null && selectionSheetValue != '')
            {
				var fileName = selectionSheetValue.getName();
				var fileExtension = fileName.split("."); 
				fileName = fileExtension[0] + "_" + new Date().getTime() + "." + fileExtension[1];
				selectionSheetValue.setName(fileName);
                selectionSheetValue.setFolder(38); //Information Sheets  old=33792
                nlapiLogExecution('DEBUG', 'File selection sheet', selectionSheetValue);
                var selectionSheetFile =  nlapiSubmitFile(selectionSheetValue);
                nlapiLogExecution('DEBUG', 'File selection sheet file', selectionSheetFile);
            }

            if(drawingsValue != null && drawingsValue != '')
            {
				//add a timestamp to the name
				var fileName = drawingsValue.getName();
				var fileExtension = fileName.split("."); 
				fileName = fileExtension[0] + "_" + new Date().getTime() + "." + fileExtension[1];
				drawingsValue.setName(fileName);
                drawingsValue.setFolder(38); //Information Sheets
				var drawingsFile =  nlapiSubmitFile(drawingsValue);
				nlapiLogExecution('DEBUG', 'File drawings file', drawingsFile);
            }

            if(ordersValue != null && ordersValue != '')
            {
				//add a timestamp to the name
				var fileName = ordersValue.getName();
				var fileExtension = fileName.split("."); 
				fileName = fileExtension[0] + "_" + new Date().getTime() + "." + fileExtension[1];
				ordersValue.setName(fileName);
                ordersValue.setFolder(38); //Information Sheets
				var ordersFile =  nlapiSubmitFile(ordersValue);
				nlapiLogExecution('DEBUG', 'Change Orders file', ordersFile);
            }



			var marketHomeInfoURL = nlapiLookupField('customrecord_subdivision', subdivisionValue, 'custrecord49');
			if (marketHomeInfoURL) {
				nlapiLogExecution('DEBUG', 'Line No', '853');
				var filerec = nlapiLoadFile(marketHomeInfoURL);
				marketHomeInfoURL = filerec.getURL();
				nlapiLogExecution('DEBUG', 'Line No', '856');
			}


			nlapiLogExecution('DEBUG', 'Line No', '860');
			var propertyRecordID = nlapiSubmitRecord(propertyRecord, null, true);


			nlapiLogExecution("DEBUG", "propertyRecordID", propertyRecordID)




			if (marketHomeInfoValue != null && marketHomeInfoValue != '') {
				nlapiAttachRecord("file", marketHomeInfoFile, "customrecord_property_record", propertyRecordID);
			}

			if (permitFieldValue != null && permitFieldValue != '') {
				nlapiAttachRecord("file", permitFile, "customrecord_property_record", propertyRecordID);
			}

			if (photoFieldValue != null && photoFieldValue != '') {
				nlapiAttachRecord("file", photoFile, "customrecord_property_record", propertyRecordID);
			}

			if(selectionSheetFile != null && selectionSheetFile != '')
            {
                nlapiAttachRecord("file", selectionSheetFile, "customrecord_property_record", propertyRecordID);
            }
           
            if(drawingsFile!= null && drawingsFile != '')
            {
                nlapiAttachRecord("file", drawingsFile, "customrecord_property_record", propertyRecordID);
			}

            if(ordersFile!= null && ordersFile != '')
            {
                nlapiAttachRecord("file", ordersFile, "customrecord_property_record", propertyRecordID);
			}


			nlapiLogExecution('DEBUG', 'Start send Emails', 'Start send emails');

			//----------- send emails --------------
			var proprecord = nlapiLoadRecord("customrecord_property_record", propertyRecordID);
			var pthouseno = proprecord.getFieldValue('custrecord_house_number');
			var ptstreet = proprecord.getFieldText('custrecord31');
			var subdiv = proprecord.getFieldValue('custrecordcustrecordsubdname');
			var ptsubdivision = '';
			if (subdiv) {
				ptsubdivision = nlapiLookupField('customrecord_subdivision', subdiv, 'custrecord_subdivision_id');
			}
			var ptlotno = proprecord.getFieldValue('custrecord_lot_number');
			//var builderpersonnel = request.getParameter('builderpersonnel') || '';

			if (builderpersonnel) {
				var partnerRecord = nlapiLoadRecord('partner', builderpersonnel);
				var pemail = partnerRecord.getFieldValue('email');
				var attachrecord = {};
				attachrecord['recordtype'] = 'customrecord_property_record';
				attachrecord['record'] = propertyRecordID;
				var pformurl = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=218&deploy=1&compid=1309901&h=a10cae482e7d12f43423&pid=' + propertyRecordID;
				if (pemail) {
					nlapiLogExecution("DEBUG", "Email recipient", pemail)
					var pemailnotification = 'You have been requested to provide a building permit for ' + pthouseno + ' ' + ptstreet + ' ' + ptsubdivision + ' lot ' + ptlotno + '.<br><br> Please click the following link to submit it to HMS.<br>';
					pemailnotification = pemailnotification + '<br><a href="' + pformurl + '">Click Here</a>';
					nlapiSendEmail('3', pemail, 'Request for Building Permit', pemailnotification, null, null, attachrecord);
				}
			}

			nlapiLogExecution("DEBUG", "builderID", builderID)

			//if (builderID==3642 || builderID==3643 || builderID==3693 || builderID==3697 || builderID==3990 || builderID==4192)
			//	{



			var emailMLS = 'f';

			var mlsRegion1 = proprecord.getFieldValue('custrecord15');
			nlapiLogExecution("DEBUG", "mlsRegion1", mlsRegion1);
			if (mlsRegion1) {
				var mlsRegion1Letter = nlapiLookupField('location', mlsRegion1, 'custrecord_requestsqft_letter');
			}


			var mlsRegion2 = proprecord.getFieldValue('custrecord16');
			nlapiLogExecution("DEBUG", "mlsRegion2", mlsRegion2);
			if (mlsRegion2) {
				var mlsRegion2Letter = nlapiLookupField('location', mlsRegion2, 'custrecord_requestsqft_letter');
			}
			nlapiLogExecution("DEBUG", "mlsRegion2Letter", mlsRegion2Letter);


			if (mlsRegion1Letter == 't' || mlsRegion1Letter == 'T' || mlsRegion2Letter == 't' || mlsRegion2Letter == 'T') {
				var pthouseno = proprecord.getFieldValue('custrecord_house_number');
				var ptstreet = proprecord.getFieldText('custrecord31');



				var htmltest = '<!DOCTYPE html>' +
					'<html>' +
					'<body>' +
					'<input type = "hidden" name = "pthouseno" value=\'' + pthouseno + '\' id=\'house\'>' +
					'<input type = "hidden" name = "ptstreet" value=\'' + ptstreet + '\' id=\'street\'>' +
					'<p>Columbus MLS requires a square footage letter from an offical builder source. Clicking Submit below will open up a new, prefilled, email in your default email client. That email will be sent to HMS (mlsinfo@hmsmarketingservices.com) stating the square footage. We will then forward that email to Columbus MLS</p>' +
					'Total Square Footage for : <input type="text" id="tsq" >' +
					'' +
					'<button onclick=\'myFunction()\'>Submit</button>' +
					'' +
					'<script>' +
					'function myFunction() {' +
					'  var x=  document.getElementById("tsq").value;' +
					' var house= document.getElementById("house").value;' +
					'var street= document.getElementById("street").value;' +
					'  var mail = \'mailto:mlsinfo@hmsmarketingservices.com?subject= SQ FT Letter for \' + house + \' \' + street + \'&body=The square footage for \' + house + \' \' + street + \' is \' + x;' +
					' document.location.href = mail;' +
					'  }' +
					'</script>' +
					'' +
					'</body>' +
					'</html>';



				response.write(htmltest);


			}
			//}

			var newOrIncomplete = proprecord.getFieldValue('custrecord_ready_to_be_entered');
			nlapiLogExecution("DEBUG", "newOrIncomplete", newOrIncomplete);
			//response.write("<script>alert(newOrIncomplete)</script>");

			if (newOrIncomplete == 'T') {
				response.write("<script>alert('Thank you for submitting this new listing!')</script>")
				//I'D LIKE THIS FORM TO REDIRECT TO THE LINK HERE AFTER SUBMISSION BUT I DON"T KNOW THE CORRECT SYNTAX"
				//response.sendRedirect('external', "https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=259&deploy=1&compid=1309901&h=86cd4feb2e69c3b74288&partnerid=" + userID + "&builderid=" + builderDivisionID + "&propertyid=" + modifyListingValue);
			}
			else {
				response.write("<script>alert('Thank you. You may come back and finish entering this listing at any time.')</script>")
			}




			return false;
			//			var url="https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=259&deploy=1&builderid="+builderID;
			//			location.href = url;

			//	
		}



	}
	catch (err) {
		var vDebug = '';

		response.write("<script>alert('" + err + "Please enter Builder Id in URL for further processeg: &builderid=')</script>")
		nlapiLogExecution("DEBUG", "Catch-error", err)
	}

}

function checkNull(value) {
	if (!value || value == "" || value == null || value == undefined || value == 'undefined' || value == 'undefined/undefined/undefined') {
		return '';
	}
	else {
		return value;
	}
}
function conversion(data, id) {
	if (!data) { return '' }

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
		days = '0' + days;
	}
	if (month < 10) {
		month = '0' + month;
	}
	var newDate = year + "-" + month + "-" + days;
	return newDate;
}