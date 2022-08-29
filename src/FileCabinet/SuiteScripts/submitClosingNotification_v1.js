var html = '<!DOCTYPE html>';
	html = html + '<html>';
	html = html + '<head>';
	var scripthtml = '';//nlapiGetContext().getSetting('SCRIPT', 'custscript_html');
	scripthtml += '<style>';
	scripthtml += '#customers';
	scripthtml += '{';
	scripthtml += '	font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;';
	scripthtml += '	width:30%;';
	scripthtml += '	border-collapse:collapse;';
	scripthtml += '}';
	scripthtml += '#customers td, #customers th ';
	scripthtml += '{';
	scripthtml += '	font-size:1em;';
	scripthtml += '	text-align:center;';
	scripthtml += '	border:1px solid #F2F7E5;';
	scripthtml += '	padding:3px 7px 2px 7px;';
	scripthtml += '}';
	scripthtml += '#customers th ';
	scripthtml += '{';
	scripthtml += '	font-size:1.1em;';
	scripthtml += '	text-align:center;';
	scripthtml += '	padding-top:5px;';
	scripthtml += '	padding-bottom:4px;';
	scripthtml += '	background-color:#CCCCCC;';
	scripthtml += '	color:#ffffff;';
	scripthtml += '}';
	scripthtml += '#customers tr.alt td ';
	scripthtml += '{';
	//scripthtml += '	color:#F2F2F2;';
	scripthtml += '	background-color:#F2F2F2;';
	scripthtml += '}';
	scripthtml += '#form';
	scripthtml += '{';
	scripthtml += '	text-align:center;';
	scripthtml += '}';
	scripthtml += '</style>';
	scripthtml += '</head>';
	scripthtml += '<body>';

function submitClosingNotification(request, response)
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	month++;
	var year = date.getFullYear();
	var dateFormatted = month + "/" + day + "/" + year;

	if(request.getMethod() == 'GET')
	{
		
		var builder = request.getParameter('builderid');
		var currentUser = request.getParameter('partnerid');
		html = html + '<title>Submit a Closing</title>'+scripthtml;
		html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=69&deploy=1&compid=1309901&h=476a7ef32cbb69b07c8a" method="POST">';
		html += '<table align = "center" id="customers">';
		
		html += '<tr>';
		html += '<td><input type="hidden" id="custpage_user" name="custpage_user" value="'+currentUser+'" ></td><td></td>';
		html += '</tr>';
		//field group
		html += '<tr>';
		html += '<th colspan="2"><span align="center">Enter Property Information.</th>';
		html += '</tr>';
		//var builderForm = nlapiCreateForm('Submit a Closing');
		//var group = builderForm.addFieldGroup('fieldgroup', 'Enter Property Information');
		//var user = builderForm.addField('custpage_user', 'text', 'User', null, 'fieldgroup');
		//user.setDisplayType('hidden');
		var accessCheck = 'F';
		var lastSuccessfulLogin;
		var partnerRecord = null;

		if(currentUser != null && currentUser != '')
		{
			partnerRecord = nlapiLoadRecord('partner', currentUser);
			accessCheck = partnerRecord.getFieldValue('custentity_submit_closing');
			lastSuccessfulLogin = partnerRecord.getFieldValue('custentity_last_successful_login');
		}

		if(lastSuccessfulLogin != dateFormatted || partnerRecord == null || partnerRecord == '')
		{
		
			html += '<tr>';
			html += '<td colspan="2"><span align="center">Session has ended.  Please login again.</td>';
			html += '</tr>';
			html += '<tr class="alt">';
			html += '<td colspan="2"><a href="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=71&deploy=1&compid=1309901&h=74a2f7b3ca4cca2fbf10">Login</a> </td>';
			
			html += '</tr>';
			
			html += '</table>';
			
			html += '</form>';
			html += '</body>';
			html += '</html>';
			response.write(html);
			return;
			
			//var note = builderForm.addField('formnote', 'label', 'Session has ended.  Please login again.', null, 'fieldgroup');
			//var loginLink = builderForm.addField('loginlink', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Login').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=71&deploy=1&compid=1309901&h=74a2f7b3ca4cca2fbf10');
			//group.setSingleColumn(true);
			//response.writePage(builderForm);
			//return;
			
		}

		else
		{
			
			if(accessCheck == 'F')
			{
				html += '<tr>';
				html += '<td  colspan="2"><span align="center">You do not have access to submit closings.</td>';
				html += '</tr>';
				//var noAccessField = builderForm.addField('noaccess', 'label', 'You do not have access to submit closings.', null, 'fieldgroup');
			}
			else
			{
				html += '<tr>';
				html += '<td colspan="2"><input type="hidden" id="custpage_builder" name="custpage_builder" value="'+builder+'" >';
				html += '<span>Subdivision</span><select id="custpage_subdivision" name="custpage_subdivision">';
				//var builderField = builderForm.addField('custpage_builder', 'text', 'Builder number', null, 'fieldgroup');
				//builderField.setDisplayType('hidden');
				//var subdivisionField = builderForm.addField('custpage_subdivision', 'select', 'Subdivision', null, 'fieldgroup');
				

				var filters = new Array();
				filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builder);
				filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
				if(results == null)
				{
					html += '<option value="-1">No Subdivisions Found for this Builder Number</option>';
					//subdivisionField.addSelectOption('-1', 'No Subdivisions Found for this Builder Number');
				}
				else
				{
					for(var i=0; results != null && results.length > i; i++)
					{
						var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
						var subdivisionName = subdivisionRecord.getFieldValue('custrecord_subdivision_id');
						html += '<option value="'+results[i].getId()+'">'+subdivisionName+'</option>';
						//subdivisionField.addSelectOption(results[i].getId(), subdivisionName);
					}
				}
				html += '</select></td></tr>';
				
				html += '<tr><td></td><td><input type="submit" value="Confirm Subdivision"></td></tr>';
				//builderForm.setFieldValues({custpage_builder:builder,custpage_user:currentUser});
				//builderForm.addSubmitButton('Confirm Subdivision');
			}
		}
		html += '</form>';
		html += '</body>';
		html += '</html>';
		response.write(html);
		//group.setSingleColumn(true);
		//response.writePage(builderForm);
	}

	else
	{
		var builder = request.getParameter('custpage_builder');
		var user = request.getParameter('custpage_user');
		var subdivision = request.getParameter('custpage_subdivision');
		var property = request.getParameter('custpage_property');
		if(builder != null && builder != '' && (subdivision ==null || subdivision == ''))
		{
			var builderForm = nlapiCreateForm('Submit a Closing');
			var group = builderForm.addFieldGroup('fieldgroup', 'Enter Property Information');
			builderForm.setScript('customscript_submit_sales_not_field_chng');
			var builderField = builderForm.addField('custpage_builder', 'text', 'Builder number', null, 'fieldgroup');
			builderField.setDisplayType('hidden');
			var userField = builderForm.addField('custpage_user', 'text', 'User', null, 'fieldgroup');
			userField.setDisplayType('hidden');
			var subdivisionField = builderForm.addField('custpage_subdivision', 'select', 'Subdivision', null, 'fieldgroup');
			subdivisionField.addSelectOption('-2', '', true);

			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builder);
			filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

			var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
			if(results == null)
			{
				subdivisionField.addSelectOption('-1', 'No Subdivisions Found for this Builder Number');
			}
			else
			{
				for(var i=0; results != null && results.length > i; i++)
				{
					var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
					var subdivisionName = subdivisionRecord.getFieldValue('custrecord_subdivision_id');
					subdivisionField.addSelectOption(results[i].getId(), subdivisionName);
				}
			}
			builderForm.setFieldValues({custpage_builder:builder,custpage_user:user});
			builderForm.addSubmitButton('Confirm Subdivision');
			group.setSingleColumn(true);
			response.writePage(builderForm);
		}

		else if(subdivision != null && subdivision != '' && (property == null || property == ''))
		{
			var subdivisionForm = nlapiCreateForm('Submit a Closing');
			var group = subdivisionForm.addFieldGroup('fieldgroup', 'Enter Property Information');
			subdivisionForm.setScript('customscript_submit_sales_not_field_chng');
			var builderField = subdivisionForm.addField('custpage_builder', 'text', 'Builder number', null, 'fieldgroup');
			builderField.setDisplayType('hidden');
			var userField = subdivisionForm.addField('custpage_user', 'text', 'User', null, 'fieldgroup');
			userField.setDisplayType('hidden');
			var subdivisionField = subdivisionForm.addField('custpage_subdivision', 'select', 'Subdivision', null, 'fieldgroup');
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builder);
			filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

			var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
			if(results == null)
			{
				subdivisionField.addSelectOption('-1', 'No Subdivisions Found for this Builder Number');
			}
			else
			{
				for(var i=0; results != null && results.length > i; i++)
				{
					var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
					var subdivisionName = subdivisionRecord.getFieldValue('custrecord_subdivision_id');
					subdivisionField.addSelectOption(results[i].getId(), subdivisionName);
				}
			}
			var propertyField = subdivisionForm.addField('custpage_property', 'select', 'Property', null, 'fieldgroup');
			propertyField.addSelectOption('-2', '', true);
			var lotNumber = subdivisionForm.addField('custpage_lot_number', 'text', 'Lot Number', null, 'fieldgroup');
			var fileField = subdivisionForm.addField('custpage_contract_file', 'file', 'Upload Closing Document Here');
      		fileField.setMandatory(true);

    		//Add field for Financing Type at time of sale, and create a dropdown list so they're able to select the entry
   			//Without the list, they would have to type in a status without choices to choose from
   			var financingType = subdivisionForm.addField('custpage_financing', 'select', 'Financing Type', null, 'fieldgroup');
   			financingType.addSelectOption('','');
            financingType.addSelectOption('13','1031E');
   			financingType.addSelectOption('4','Assumable');
   			financingType.addSelectOption('11','Cash');
   			financingType.addSelectOption('1','Conventional');
   			financingType.addSelectOption('9','Exchange');
   			financingType.addSelectOption('2','FHA');
   			financingType.addSelectOption('14','FMHA');
   			financingType.addSelectOption('15','ICON');
   			financingType.addSelectOption('16','IHFA');
   			financingType.addSelectOption('3','Land Contract');
   			financingType.addSelectOption('10','Lease Option');
   			financingType.addSelectOption('7','Lease/Purchase Option');
   			financingType.addSelectOption('18','Other');
   			financingType.addSelectOption('5','Owner');
   			financingType.addSelectOption('17','RHS');
   			financingType.addSelectOption('8','USDA');
   			financingType.addSelectOption('12','USDAR');
   		    financingType.addSelectOption('6','VA');
			financingType.setMandatory(true);

			//Add in the rest of the fields
			var actualClosingDate = subdivisionForm.addField('custpage_closingdate', 'date', 'Actual Closing Date', null, 'fieldgroup');
          	actualClosingDate.setMandatory(true);
			//var cancelledDelayedNote = subdivisionForm.addField('custpage_cancelleddelayed', 'label', 'Was the closing ');
			var cancelledDelayed = subdivisionForm.addField('custpage_cancelleddelayedlist', 'select', 'Was the closing cancelled or delayed?', null, 'fieldgroup');
			cancelledDelayed.addSelectOption('3', '');
			cancelledDelayed.addSelectOption('1', 'Cancelled');
			cancelledDelayed.addSelectOption('2', 'Delayed');
			var updatedClosingDate = subdivisionForm.addField('custpage_updatedclosingdate', 'date', 'Revised Estimated Closing Date', null, 'fieldgroup');
			var closingPrice = subdivisionForm.addField('custpage_closingprice', 'currency', 'Closing Price', null, 'fieldgroup');
          	closingPrice.setMandatory(true)
			var loanAmount = subdivisionForm.addField('custpage_loanamount', 'currency', 'Loan Amount', null, 'fieldgroup');
			var closingCostbySeller = subdivisionForm.addField('custpage_closecostxseller', 'currency', 'Closing Costs ($) Paid by Seller', null, 'fieldgroup');
			closingCostbySeller.setMandatory(true)
			var concessions = subdivisionForm.addField('custpage_concessions', 'text', 'Seller Concessions', null, 'fieldgroup');
			var closingNotes = subdivisionForm.addField('custpage_closingnotes', 'textarea', 'Closing Notes', null, 'fieldgroup');

			var filters = new Array();
			var saleStatuses = ['1', '11','8', '2', '12', '9'];
			filters[0] = new nlobjSearchFilter('custrecordcustrecordsubdname', null, 'is', subdivision);
			filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
			filters[2] = new nlobjSearchFilter('custrecord_property_status', null, 'anyOf', saleStatuses);

			var results = nlapiSearchRecord('customrecord_property_record', null, filters);
			if(results == null)
			{
				propertyField.addSelectOption('-1', 'Builder Number Not Found');
			}
			else
			{
				for(var i=0; results != null && results.length > i; i++)
				{
					var propertyRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
					var propertyName = propertyRecord.getFieldValue('custrecord_simple_name');
					propertyField.addSelectOption(results[i].getId(), propertyName);
				}
			}
			subdivisionForm.setFieldValues({custpage_builder:builder,custpage_subdivision:subdivision,custpage_user:user});
			subdivisionForm.addSubmitButton('Submit Closing Information');
			group.setSingleColumn(true);
			response.writePage(subdivisionForm);
		}

		else if(property != null && property != '')
		{
			//This portion of the script is executed when the page is submitted via the "Submit" button

			var date = new Date();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var year = date.getFullYear();
			var dateFormatted = month + "/" + day + "/" + year

			//Retrieve all the information entered by the user
	      	var builderID = request.getParameter("custpage_builder");
	      	var user = request.getParameter("custpage_user");
			var property = request.getParameter("custpage_property");
			var file = request.getFile("custpage_contract_file");
			var financingTypeValue = request.getParameter("custpage_financing");
			var updatedClosingDateValue = request.getParameter("custpage_updatedclosingdate");
			var cancelledDelayedValue = request.getParameter("custpage_cancelleddelayedlist");
			var closingDateValue = request.getParameter("custpage_closingdate");
			var closingPriceValue = request.getParameter("custpage_closingprice");
			var concessionsValue = request.getParameter("custpage_concessions");
			var closingCostbySellerValue = request.getParameter("custpage_closecostxseller");
			var loanAmountValue = request.getParameter("custpage_loanamount");
			var closingNotesValue = request.getParameter("custpage_closingnotes");

			// set the folder where this file will be added. In this case, 41 is the internal ID
				// of the Sales Contracts folder in the NetSuite file cabinet
				var oldFileName =  file.getName()
				var fileName = changeName(oldFileName)
			file.setName(fileName);
			file.setFolder(41);

			// now create file and upload it to the file cabinet.
			var fileID = nlapiSubmitFile(file);

			// now attach file to property record
			nlapiAttachRecord("file", fileID, "customrecord_property_record", property);

			//Here we set field values on the property record
			var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
			propertyRecord.setFieldValue('custrecord_actual_closing_date', closingDateValue);
			propertyRecord.setFieldValue('custrecord50', closingPriceValue);
			propertyRecord.setFieldValue('custrecord_loan_amount', loanAmountValue);
			propertyRecord.setFieldValue('custrecord_seller_paid_closing_costs', closingCostbySellerValue);

			propertyRecord.setFieldValue('custrecord_concessions', concessionsValue);
			propertyRecord.setFieldValue('custrecord_financing_type', financingTypeValue);
			propertyRecord.setFieldValue('custrecord_hud1', fileID);
			propertyRecord.setFieldValue('custrecord_closing_notes', closingNotesValue);
			propertyRecord.setFieldValue('custrecord_hud_received_date', dateFormatted);

 			if(cancelledDelayedValue == '2')
			{
				propertyRecord.setFieldValue('custrecord_estimated_closing_date', updatedClosingDateValue);
			}
			else if(cancelledDelayedValue == '1')
			{
				propertyRecord.setFieldValue('custrecord_property_status', '1');
			}
			var mlsRegion1 = propertyRecord.getFieldValue('custrecord15');
			var mlsRegion2 = propertyRecord.getFieldValue('custrecord16');
			var mlsNumber1 = propertyRecord.getFieldValue('custrecord_mls_number_region1');
			var mlsNumber2 = propertyRecord.getFieldValue('custrecord_mls_number_region2');
			var propName = propertyRecord.getFieldValue('name');
			nlapiSubmitRecord(propertyRecord);

			//Now we will send the notification to HMS personnel
			var attachment = nlapiLoadFile(fileID);
			var subject = 'Closing of Market Home Submitted: ' + propName;
			//The recipient gets set using a paramter on the deployment of the script.  Open the script in NetSuite, click on 'Deployments',
				//then the 'Parameters' tab to find or set this value
			var recipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_closing_recipient');

			var records = new Object();
			records['recordtype'] = '18';
			records['record'] = property;

			//var body = nlapiMergeRecord(12, 'customrecord_property_record', property);
			var emailMerger1 = nlapiCreateEmailMerger(60);//60 is converted type of 12
			emailMerger1.setCustomRecord('customrecord_property_record',property);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
			nlapiSendEmail('3847', recipient, subject, emailBody1, null, null, records, attachment, null, true);

			var confirmationForm = nlapiCreateForm('Confirmation');
			var confirmationFieldGroup = confirmationForm.addFieldGroup('fieldgroup', 'Confirmation');
			var confirmationField = confirmationForm.addField('custpage_confirmation', 'label', 'Thank you for submitting Closing  Information', null, 'fieldgroup');
			var submitAnother = confirmationForm.addField('submitclosing', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Submit Another Closing').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=69&deploy=1&compid=1309901&h=476a7ef32cbb69b07c8a&builderid=' + builderID + '&partnerid=' + user);
			var mainMenu = confirmationForm.addField('mainmenu', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Return to Main Menu').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=72&deploy=1&compid=1309901&h=95f2259d7dfe3875be53&builderid=' + builderID + '&partnerid=' + user);
			confirmationField.setDisplayType('disabled');
			confirmationFieldGroup.setSingleColumn(true);
			response.writePage(confirmationForm);
		}
	}
}




function changeName(oldFileName)
{
	var newName;
var date = new Date();

var dd= date.getDate();
var mm = date.getMonth()+1;
var yy =  date.getFullYear();
if (dd < 10) {
	  dd = '0' + dd;
	}

	if (mm < 10) {
	  mm = '0' + mm;
	}

var hours = String(date.getHours());
var minutes = String(date.getMinutes());
var ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12;
minutes = minutes < 10 ? '0'+minutes : minutes;
var strTime = hours + minutes + ampm;


if(oldFileName.indexOf(".") != -1){
	
var nameSplit =  oldFileName.split("."); 
 newName = nameSplit[0]+"-"+dd+mm+yy+"-"+strTime+"."+nameSplit[1];

}else{
	
 newName = oldFileName +"-"+dd+mm+yy+"-"+strTime;
	
	
}
return newName;

}