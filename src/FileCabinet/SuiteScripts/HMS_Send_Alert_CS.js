function alertOnSave(fieldType, fieldName) {
	try {

		if (fieldName == 'custevent_builder_sales_rep_subd') {
			var alertmsg = nlapiGetContext().getSetting('SCRIPT', 'custscript_alertmsg');
			var company = nlapiGetFieldValue('company');

			if (company) {

				var entitytype = nlapiLookupField('entity', company, 'recordtype');
				var companyRecord = nlapiLoadRecord(entitytype, company);
				var parent = companyRecord.getFieldValue('parent');
				if (parent) {
					company = parent
				}
			}
			var partnerid = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
			var companyidonpartner = '';
			if (partnerid) {
				companyidonpartner = nlapiLookupField('partner', partnerid, 'custentity1');
				if (companyidonpartner) {
					var bsrParent = nlapiLookupField('customer', companyidonpartner, 'parent');
				}
				if (bsrParent) {
					companyidonpartner = bsrParent
				}
			}
			//alert(companyidonpartner + ' ' + company);
			if (company) {
				if (companyidonpartner != company && partnerid) {
					//				r = confirm(alertmsg);
					//				if (r == true)
					//				{
					//                	
					//				return
					//			}
					alert(alertmsg)
					nlapiSetFieldValue('custevent_builder_sales_rep_subd', '')

				}
			}
		} // addded
	}
	catch (e) {
		//alert(e.message);
		return true;
	}
	return true;
}






function alertErrorOnSave() {
	try {
//The builder division for the inquiry does not match the builder division for the selected BSR. To submit this case anyway press Cancel, to return to the case and make changes press OK.
			var alertmsg = nlapiGetContext().getSetting('SCRIPT', 'custscript_alertmsg');
			var company = nlapiGetFieldValue('company');

			if (company) {

				var entitytype = nlapiLookupField('entity', company, 'recordtype');
				var companyRecord = nlapiLoadRecord(entitytype, company);
				var parent = companyRecord.getFieldValue('parent');
				if (parent) {
					company = parent
				}
			}
			var partnerid = nlapiGetFieldValue('custevent_builder_sales_rep_subd');
			var companyidonpartner = '';
			if (partnerid) {
				companyidonpartner = nlapiLookupField('partner', partnerid, 'custentity1');
				if (companyidonpartner) {
					var bsrParent = nlapiLookupField('customer', companyidonpartner, 'parent');
				}
				if (bsrParent) {
					companyidonpartner = bsrParent
				}
			}

			if (company) {
				if (companyidonpartner != company && partnerid) {

					alert(alertmsg)
					nlapiSetFieldValue('custevent_builder_sales_rep_subd', '')
					return false;
				}
			}
	}
	catch (e) {
		// alert(e.message);
		return true;
	}
	return true;
}