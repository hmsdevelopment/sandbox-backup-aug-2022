/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Oct 2017     Admin
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function BuilderSubdivision(request, response){
	if(request.getMethod()=='GET'){
		var builder_id=request.getParameter('builder_id');
		var subdiv=request.getParameter('subdiv');
		var form=nlapiCreateForm('Builder Subdivision');
		form.addButton('custpage_search', 'Search Subdivision', "Search()");
		var builder_list=form.addField('custpage_builder', 'select', 'Builder Division Filter', 'customer', null);
//		var search=nlapiSearchRecord('customer', null, null, [(new nlobjSearchColumn('companyname'))]);
//		builder_list.addSelectOption("0","");
//		if(search!=null){
//			for(var i=0;i<search.length;i++){
//				var id=search[i].getId();
//				var builder_name=search[i].getValue('companyname');
//				builder_list.addSelectOption(id,builder_name);
//			}
//		}
		builder_list.setDefaultValue(builder_id);

		if(builder_id&&builder_id!=0){
			var sublist=form.addSubList('custpage_subdivision', 'list', 'Subdivisions');
			sublist.addField('custpage_select', 'checkbox','SELECT');
			sublist.addField('custpage_id', 'text','ID').setDisplayType('hidden');
			sublist.addField('custpage_name', 'text','Name');
			sublist.addField('custpage_bsr', 'text', 'BSR');
			sublist.addField('custpage_sales_manager', 'text', 'SALES MANAGER');
			sublist.addField('custpage_admin_contact', 'text', 'ADMINSTRATIVE CONTACT');
			
			var columns=[];
			columns.push(new nlobjSearchColumn('internalid'));
			columns.push(new nlobjSearchColumn('name'));
			columns.push(new nlobjSearchColumn('custrecord_bsr_team'));
			columns.push(new nlobjSearchColumn('custrecord27'));//sales manager
			columns.push(new nlobjSearchColumn('custrecord_administrative_contact'));
			var filters=[];
			filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'))
			filters.push(new nlobjSearchFilter('custrecord_builder_division', null, 'anyof', builder_id));
			if(subdiv)
			filters.push(new nlobjSearchFilter('internalid', null, 'anyof',subdiv))

			var search_subdivision=nlapiSearchRecord('customrecord_subdivision', null, filters, columns);
			if(search_subdivision!=null){
				form.removeButton('custpage_search');
				var builder_list=form.addField('custpage_subdivision_list', 'select', 'Subdivision Filter', 'customrecord_subdivision', null);
                builder_list.setDefaultValue(subdiv);
				form.addButton('custpage_back','Back', "Back()");
				form.addButton('custpage_submit',"Submit","Submit();")
				form.addButton('custpage_mark',"Mark All","mark();")
				form.addButton('custpage_unmark',"Unmark All","unmark();")
				form.addButton('custpage_filter',"Apply Filter","Subdiv_filter();")
//				var partners=form.addField('custpage_partners', 'select', 'Partners');
//				var search_partner=nlapiSearchRecord('partner', null, ['custentity1','anyof',builder_id], (new nlobjSearchColumn('entityid')));
//				if(search_partner!=null){
//					for(var t=0;t<search_partner.length;t++){
//						partners.addSelectOption(search_partner[t].getId(), search_partner[t].getValue('entityid'));
//					}
//					
//
//				}
				
				var bsr=form.addField('custpage_newbsr', 'select', 'Select BSR or Team');
				bsr.setBreakType('startcol');
				var sales_man=form.addField('custpage_newsales_manager', 'select', 'Select Sales Manager');
				var admin=form.addField('custpage_newadmin_contact', 'select', 'Select Admin Contact');
				bsr.addSelectOption('0', '');
				sales_man.addSelectOption('0', '');
				admin.addSelectOption('0', '');
				var search_partner=nlapiSearchRecord('partner', null, ['custentity1','anyof',builder_id], (new nlobjSearchColumn('entityid')));
				if(search_partner!=null){
					for(var t=0;t<search_partner.length;t++){
						bsr.addSelectOption(search_partner[t].getId(), search_partner[t].getValue('entityid'));
						sales_man.addSelectOption(search_partner[t].getId(), search_partner[t].getValue('entityid'));
						admin.addSelectOption(search_partner[t].getId(), search_partner[t].getValue('entityid'));

					
					}
					

				}
				var line=1;
				for(var j=0;j<search_subdivision.length;j++){
					var internalid=search_subdivision[j].getValue('internalid');
					var name=search_subdivision[j].getValue('name');
					var bsr=search_subdivision[j].getText('custrecord_bsr_team');
					var sales_manager=search_subdivision[j].getText('custrecord27');
					var admin_contact=search_subdivision[j].getText('custrecord_administrative_contact');
					sublist.setLineItemValue('custpage_id',line,internalid);
               		sublist.setLineItemValue('custpage_name',line,name);
               		sublist.setLineItemValue('custpage_bsr',line,bsr);
               		sublist.setLineItemValue('custpage_sales_manager',line,sales_manager);
               		sublist.setLineItemValue('custpage_admin_contact',line,admin_contact);
               		line++;

				}
			}
		}

		form.setScript('customscript_update_builder_subdivision');

           response.writePage(form)
	}
}
function Search(){
//alert('hllo');
	var builder_id=nlapiGetFieldValue('custpage_builder');
	var url="https://1309901-sb1.app.netsuite.com/app/site/hosting/scriptlet.nl?script=241&deploy=1&builder_id="+builder_id;

window.location.href=url;
}
function Back(){
	var url="https://1309901-sb1.app.netsuite.com/app/site/hosting/scriptlet.nl?script=241&deploy=1";
	window.location.href=url;

}
function mark(){
	var flag=confirm("Are you sure you want to select all of the subdivisions listed?")
	if(flag==true){
		var count=nlapiGetLineItemCount('custpage_subdivision');
		for(var i=1;i<=count;i++){
			nlapiSetLineItemValue('custpage_subdivision', 'custpage_select', i, "T");
		}
	}
	
}
function unmark(){
	var count=nlapiGetLineItemCount('custpage_subdivision');
	for(var i=1;i<=count;i++){
		nlapiSetLineItemValue('custpage_subdivision', 'custpage_select', i, "F");
	}
}
function Submit(){
	try{
	var arr=[];
	var updated_values=[];
	update_fields=[];
	var flag=0;
	var lines=nlapiGetLineItemCount('custpage_subdivision');
	var bsr=nlapiGetFieldValue('custpage_newbsr');
	var sales_manager=nlapiGetFieldValue('custpage_newsales_manager');
	var admin_contact=nlapiGetFieldValue('custpage_newadmin_contact');
    var subdiv_team='';

	if(bsr!=0){
		updated_values.push(bsr);
		update_fields.push('custrecord_bsr_team');
		var team_type=nlapiLookupField('partner', bsr, 'custentity_team_type');
		if(team_type){
			updated_values.push(team_type);
			update_fields.push('custrecord_sub_bsr_team_type');
		}
		var team_member=nlapiLookupField('partner', bsr, 'custentity_team_members');
		if(team_member){
			subdiv_team=team_member;
		}
		flag++;
	}
	if(sales_manager!=0){
		updated_values.push(sales_manager);
		update_fields.push('custrecord27');
		var bsr_email=nlapiLookupField('partner', sales_manager, 'email');
		if(bsr_email){
			updated_values.push(bsr_email);
			update_fields.push('custrecord_sales_mgr_email');
		}
		flag++;
	}
	if(admin_contact!=0){
		updated_values.push(admin_contact);
		update_fields.push('custrecord_administrative_contact');
		var admin_phone=nlapiLookupField('partner', admin_contact, 'mobilephone');
		if(admin_phone){
			updated_values.push(admin_phone);
			update_fields.push('custrecord_administrative_contact_phone');
		}
		var admin_email=nlapiLookupField('partner', admin_contact, 'email');
		if(admin_email){
			updated_values.push(admin_email);
			update_fields.push('custrecord_administrative_contact_email');
		}
		flag++;
	}

	for(var i=1;i<=lines;i++){
		var checkbox=nlapiGetLineItemValue('custpage_subdivision', 'custpage_select', i);
		if(checkbox=='T'){
			arr.push(nlapiGetLineItemValue('custpage_subdivision', 'custpage_id', i));
		}
	}

	if(arr.length>0&&flag>0){

		
		for(var j=0;j<arr.length;j++){
			var subdivision=arr[j];
			nlapiSubmitField('customrecord_subdivision', subdivision, update_fields, updated_values);
			
			if(subdiv_team!=''){
				var arr_team=[];
				arr_team=subdiv_team.split(',');
				var subdivrec=nlapiLoadRecord('customrecord_subdivision', subdivision);
				subdivrec.setFieldValues('custrecord48', arr_team);
				nlapiSubmitRecord(subdivrec, null, true);
//				nlapiSubmitField('customrecord_subdivision',subdivision, 'custrecord48',[3757]);
			}

			
		}
//		var url="https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=241&deploy=1";
//		window.location.href=url;
		location.reload();

	}else{
		alert("No changes performed");
	}
	}catch(e){
		alert(JSON.stringify(e));
	}
}
function Subdiv_filter() {
	
	var builder_id=nlapiGetFieldValue('custpage_builder');
	var subdivision=nlapiGetFieldValue('custpage_subdivision_list');
//	if(subdivision){
	var url="https://1309901-sb1.app.netsuite.com/app/site/hosting/scriptlet.nl?script=241&deploy=1&builder_id="+builder_id+"&subdiv="+subdivision;
window.location.href=url;
//}
}