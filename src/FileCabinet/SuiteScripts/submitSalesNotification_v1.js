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
	
function submitSalesNotification(request, response)
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	month++;
	var year = date.getFullYear();
	var dateFormatted = month + "/" + day + "/" + year;

	if(request.getMethod() == 'GET')
	{
	
		nlapiLogExecution('DEBUG','GET REQUEST:','GET REQUEST');
		
		var builderID = request.getParameter('builderid');
		var currentUser = request.getParameter('partnerid');
	
		html = html + '<title>Submit Sale Notification</title>'+scripthtml;
		html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=68&deploy=1&compid=1309901&h=2656021766731702ecd9" method="POST">';
		html += '<table align = "center" id="customers">';
		
		html += '<tr>';
		html += '<td><input type="hidden" id="custpage_user" name="custpage_user" value="'+currentUser+'" ></td><td></td>';
		html += '</tr>';
		
		
		
		
		
		var accessCheck = 'F';
		var partnerRecord;
		var lastSuccessfulLogin;

		if(currentUser != null && currentUser != '')
		{
			partnerRecord = nlapiLoadRecord('partner', currentUser);
			accessCheck = partnerRecord.getFieldValue('custentity_submit_sale');
			lastSuccessfulLogin = partnerRecord.getFieldValue('custentity_last_successful_login');
		}

      
		if(lastSuccessfulLogin != dateFormatted || partnerRecord == null || partnerRecord == '')
		{
			
			html += '<tr>';
			html += '<th ><span align="center">Session has ended.  Please login again.</th>';
			html += '</tr>';
			html += '<tr>';
			html += '<td><a href="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=71&deploy=1&compid=1309901&h=74a2f7b3ca4cca2fbf10">Login</a> </td>';
			
			html += '</tr>';
			
			html += '</table>';
			
			html += '</form>';
			html += '</body>';
			html += '</html>';
			response.write(html);
			return;
		}
		else
		{
			if(accessCheck == 'F')
			{
				html += '<tr>';
				html += '<td colspan="2"><span align="center">You do not have access to submit sales.</td>';
				html += '</tr>';
				
			}

			else
			{
			
				html += '<tr>';
				html += '<td colspan="2"><input type="hidden" id="custpage_builder" name="custpage_builder" value="'+builderID+'" >';
				html += '<span>Subdivision</span><select id="custpage_subdivision" name="custpage_subdivision">';
				var filters = new Array();
				filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builderID);
				filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
				if(results == null)
				{
					
					html += '<option value="-1">No Subdivisions Found for this Builder Number</option>';
				}
				else
				{
					for(var i=0; results != null && results.length > i; i++)
					{
						var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
						var subdivisionName = subdivisionRecord.getFieldValue('custrecord_subdivision_id');
						
						html += '<option value="'+results[i].getId()+'">'+subdivisionName+'</option>';
					}
				}
				
				html += '</select></td></tr>';
			}
		}

		
		html += '</table>';
		if(accessCheck == 'T')
		{
			html += '<input type="submit" value="Confirm Subdivision">';
		}
		html += '</form>';
		html += '</body>';
		html += '</html>';
		response.write(html);
	}
	else
	{
		var builder = request.getParameter('custpage_builder');
		var user = request.getParameter('custpage_user');
		var subdivision = request.getParameter('custpage_subdivision');
		var property = request.getParameter('custpage_property');
		nlapiLogExecution('DEBUG','builder:','builder :'+builder+' user '+user+' subdivision '+subdivision+' property '+property);
		if(builder != null && builder != '' && (subdivision ==null || subdivision == ''))
		{
		
			html = html + '<title>Submit Sale Notification</title>'+scripthtml
			html += '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=68&deploy=1&compid=1309901&h=2656021766731702ecd9" method="POST">';
			html += '<table align = "center" id="customers">';
			html += '<tr>';
			html += '<th colspan="2">Enter Property Information';
			html += '</th>';
			html += '</tr>';
			
			html += '<tr>';
			
			html += '<td colspan="2"><input type="hidden" id="custpage_builder" name="custpage_builder" value="'+builder+'"><input type="hidden" id="custpage_user" name="custpage_user" value="'+user+'">';
			html += '<span>Subdivision</span>';
			html += '<select id="custpage_subdivision" name="custpage_subdivision">';
			
			
		
		
			
			
			var subdivisionField = builderForm.addField('custpage_subdivision', 'select', 'Subdivision', null, 'fieldgroup');

			var filters = new Array();
			filters[0] = new nlobjSearchFilter('custrecord_builder_division', null, 'is', builder);
			filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

			var results = nlapiSearchRecord('customrecord_subdivision', null, filters);
			if(results == null)
			{
				html += '<option value="-1">No Subdivisions Found for this Builder Number</option>';
				
			}
			else
			{
				for(var i=0; results != null && results.length > i; i++)
				{
					var subdivisionRecord = nlapiLoadRecord(results[i].getRecordType(), results[i].getId());
					var subdivisionName = subdivisionRecord.getFieldValue('custrecord_subdivision_id');
					
					html += '<option value="'+results[i].getId()+'">'+subdivisionName+'</option>';
				}
			}
			
			html += '</select>';
			html += '</td>';
			
			html += '</tr>';
			html += '</table>';
			html += '<input type="submit" value="Confirm Subdivision">';
			html += '</form>';
			html += '</body>';
			html += '</html>';
			response.write(html);
			
		}

		else if(subdivision != null && subdivision != '' && (property == null || property == ''))
		{
			var subdivisionForm = nlapiCreateForm('Submit Sale Notification');
			var group = subdivisionForm.addFieldGroup('fieldgroup', 'Enter Property Information');
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
			var lotNumber = subdivisionForm.addField('custpage_lot_number', 'text', 'Lot Number', null, 'fieldgroup');
			var fileField = subdivisionForm.addField('custpage_contract_file', 'file', 'Upload Sales Contract Here');
      		fileField.setMandatory(true);

      		//Add field for stage of construction at time of sale, and create a dropdown list so they're able to select the entry
      			//Without the list, they would have to type in a status without choices to choose from
      		var stageOfConstruction = subdivisionForm.addField('custpage_stage', 'select', 'Stage of Construction at Sale', null, 'fieldgroup');
      		stageOfConstruction.addSelectOption('','');	
          	stageOfConstruction.addSelectOption('10','Complete');
      		stageOfConstruction.addSelectOption('6','Drywall Complete');
      		stageOfConstruction.addSelectOption('5','Existing Structure');
      		stageOfConstruction.addSelectOption('2','Foundation');
      		stageOfConstruction.addSelectOption('9','Framed');
      		stageOfConstruction.addSelectOption('7','Permit Filed');
      		stageOfConstruction.addSelectOption('3','Prepared');
      		stageOfConstruction.addSelectOption('4','To Be Built');
      		stageOfConstruction.addSelectOption('8','Trim Stage');
      		stageOfConstruction.addSelectOption('1','Under Roof');
          	stageOfConstruction.setMandatory(true);

      		//Add in the rest of the fields
      		var contractExecuted = subdivisionForm.addField('custpage_contract_executed', 'date', 'Date Contract Executed', null, 'fieldgroup');
          	contractExecuted.setMandatory(true);
      		var earliestClosingDate = subdivisionForm.addField('custpage_closing_date', 'date', 'Earliest Possible Closing Date', null, 'fieldgroup');
      		earliestClosingDate.setMandatory(true);
      		var brokerInvolved = subdivisionForm.addField('custpage_broker', 'select', 'Broker Was Involved', null, 'fieldgroup');
      		brokerInvolved.addSelectOption('', '');	
          	brokerInvolved.addSelectOption('1', 'Yes');
      		brokerInvolved.addSelectOption('2', 'No');
          	brokerInvolved.setMandatory(true);
          	//varEnterBrokerInfo=brokerInvolved.isMandatory();
      		var agentFirst = subdivisionForm.addField('custpage_agent_first', 'text', 'Agent First Name', null, 'fieldgroup');
          	//agentFirst.setDisabled(varEnterBrokerInfo);
      		var agentLast = subdivisionForm.addField('custpage_agent_last', 'text', 'Agent Last Name', null, 'fieldgroup');
      		var agentID = subdivisionForm.addField('custpage__agent_id', 'text', 'Agent ID', null, 'fieldgroup');
      		agentID.setMandatory(false);
      		var brokerage = subdivisionForm.addField('custpage_brokerage', 'text', 'Brokerage Name', null, 'fieldgroup');
      		var buyerFirst = subdivisionForm.addField('custpage_buyer_first', 'text', 'Buyer First Name', null, 'fieldgroup');
      		var buyerLast = subdivisionForm.addField('custpage_buyer_last', 'text', 'Buyer Last Name', null, 'fieldgroup');
			//Need to add in all of the relevant sales information fields

			var filters = new Array();
			var saleStatuses = ['1', '8', '2', '12', '11'];
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
			subdivisionForm.addSubmitButton('Submit Sale Information');
			group.setSingleColumn(true);
			response.writePage(subdivisionForm);
		}

		else if(property != null && property != '')
		{
	      	var date = new Date();
	      	var day = date.getDate();
	      	var month = date.getMonth();
	      	month++;
	      	var year = date.getFullYear();
	      	var dateFormatted = month + "/" + day + "/" + year;

	      	//Retrieve all the information entered by the user
	      	var builderID = request.getParameter("custpage_builder");
	      	var user = request.getParameter("custpage_user");
	      	var property = request.getParameter("custpage_property");
	      	var file = request.getFile("custpage_contract_file");
	      	var stage = request.getParameter("custpage_stage");
	      	var contractDate = request.getParameter("custpage_contract_executed");
	      	var closingDate = request.getParameter("custpage_closing_date");
	      	var broker = request.getParameter("custpage_broker");
	      	var agentFirst = request.getParameter("custpage_agent_first");
	      	var agentLast = request.getParameter("custpage_agent_last");
	      	var agentName = agentFirst + " " + agentLast;
	      	var brokerageName = request.getParameter("custpage_brokerage");
	      	var buyerFirst = request.getParameter("custpage_buyer_first");
	      	var buyerLast = request.getParameter("custpage_buyer_last");
	      	var buyer = buyerLast + ", " + buyerFirst;
	      	var agentID = request.getParameter("custpage_agent_id");

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

	      	//Here we set field values on the property record for Construction Status at Contract,
	      		//Contract Approval Date, Contract Received from Builder, Estimated Closing Date,
	      		//and Purchase Contract.
	      	var propertyRecord = nlapiLoadRecord('customrecord_property_record', property);
	      	propertyRecord.setFieldValue('custrecord_contract_approval_date', contractDate);
	      	propertyRecord.setFieldValue('custrecord_contract_received_date', dateFormatted);
	      	propertyRecord.setFieldValue('custrecord_estimated_closing_date', closingDate);
	      	propertyRecord.setFieldValue('custrecord_construction_status_contract', stage);
	      	propertyRecord.setFieldValue('custrecord_purchase_contract', fileID);
	      	propertyRecord.setFieldValue('custrecord_agent_name_sn', agentName);
	      	propertyRecord.setFieldValue('custrecord_brokerage_name_sn', brokerageName);
	      	propertyRecord.setFieldValue('custrecord_buyers_last_name', buyer);
	      	propertyRecord.setFieldValue('custrecord_real_estate_agent_id_region_1', agentID);
	      	var mlsRegion1 = propertyRecord.getFieldValue('custrecord15');
	      	var mlsRegion2 = propertyRecord.getFieldValue('custrecord16');
	      	var mlsNumber1 = propertyRecord.getFieldValue('custrecord_mls_number_region1');
	      	var mlsNumber2 = propertyRecord.getFieldValue('custrecord_mls_number_region2');
	      	var propName = propertyRecord.getFieldValue('name');
	      	nlapiSubmitRecord(propertyRecord);

	      	//Now we will send the notification to HMS personnel
	      	var attachment = nlapiLoadFile(fileID);
	      	var subject = 'Report of Listing/Property Submitted: ' + propName;
	      	//The recipient gets set using a paramter on the deployment of the script.  Open the script in NetSuite, click on 'Deployments',
	      		//then the 'Parameters' tab to find or set this value
	      	var recipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_submission_notification');

	      	var records = new Object();
	      	records['recordtype'] = '18';
	      	records['record'] = property;

	      	//var body = nlapiMergeRecord(10, 'customrecord_property_record', property);
			var emailMerger1 = nlapiCreateEmailMerger(69);//69 is converted type of 10
			emailMerger1.setCustomRecord('customrecord_property_record',property);
			var mergeResult1 = emailMerger1.merge();
			var emailBody1 = mergeResult1.getBody();
	      	nlapiSendEmail('3847', recipient, subject, emailBody1, null, null, records, attachment, null, true);

			var confirmationForm = nlapiCreateForm('Confirmation');
			var confirmationFieldGroup = confirmationForm.addFieldGroup('fieldgroup', 'Confirmation');
			var confirmationField = confirmationForm.addField('custpage_confirmation', 'label', 'Thank you for submitting Sales Information', null, 'fieldgroup');
			var submitAnother = confirmationForm.addField('submitsales', 'url', '-', null, 'fieldgroup').setDisplayType('inline').setLinkText('Submit Another Sale').setDefaultValue('https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=68&deploy=1&compid=1309901&h=2656021766731702ecd9&builderid=' + builderID + '&partnerid=' + user);
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