/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
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
    	var request = context.request;
    	var response = context.response;
    	var outputHTML = '<style>'+
    	'table {'+
    		  'font-family: arial, sans-serif;'+
    		  'border-collapse: collapse;'+
    		  'width: 100%;'+
    		'}'+

    		'td, th {'+
    		  'border: 1px solid #dddddd;'+
    		  'text-align: left;'+
    		  'padding: 8px;'+
    		'}'+

    		'tr:nth-child(even) {'+
    		  'background-color: #dddddd;'+
    		'}'+
    		'</style>';
    	outputHTML += "<h1>Closing Appointment</h1>";
    	outputHTML += "<h3>Contact Details</h3>";
    	
    	
    	outputHTML += "<table>";
    	outputHTML += "<tr>";
    	outputHTML += "<th>Contact Type</th>";
    	outputHTML += "<th>Name</th>";
    	outputHTML += "<th>Email</th>";
    	outputHTML += "<th>Opt out RTAN</th>";
    	outputHTML += "<th>SMS</th>";
    	outputHTML += "</tr>";
    	
    	
    	appointmentId = request.parameters.appt_id;
    	
    	var appointment = record.load({
    		type:record.Type.SUPPORT_CASE,
    		id:appointmentId
    	});

    	log.debug("2");
    	var primaryBsrId = appointment.getValue({fieldId:"custevent_builder_sales_rep_subd"});
    	var salesManagerId = appointment.getValue("custevent7");
    	var builderId = appointment.getValue("company");
    	
    	log.debug("primaryBsrId",primaryBsrId);
    	log.debug("salesManagerId",salesManagerId);
    	log.debug("builderId",builderId);
    	
    	log.debug("3");
    	var primaryBsr = search.lookupFields({
    	    type: search.Type.PARTNER,
    	    id: primaryBsrId,
    	    columns: ['entityid', 'email', 'custentity_opt_out_rtan', 'custentity_enable_two_way_sms']
    	});
    	
    	outputHTML += "<tr>";
    	outputHTML += "<td>Primary BSR</td>";
    	outputHTML += "<td>"+ primaryBsr.entityid + "</td>";
    	outputHTML += "<td>"+ primaryBsr.email + "</td>";
    	outputHTML += "<td>"+ primaryBsr.custentity_opt_out_rtan + "</td>";
    	outputHTML += "<td>"+ primaryBsr.custentity_enable_two_way_sms + "</td>";
    	outputHTML += "</tr>";
    		
    	log.debug("4");
    	log.debug("primaryBsr",primaryBsr);
    	
    	var salesManager;
    	if(salesManagerId){
    		salesManager = search.lookupFields({
        	    type: search.Type.PARTNER,
        	    id: salesManagerId,
        	    columns: ['entityid', 'email', 'custentity_opt_out_rtan', 'custentity_enable_two_way_sms']
        	});
    		
    		outputHTML += "<tr>";
        	outputHTML += "<td>Sales Manager</td>";
        	outputHTML += "<td>"+ salesManager.entityid + "</td>";
        	outputHTML += "<td>"+ salesManager.email + "</td>";
        	outputHTML += "<td>"+ salesManager.custentity_opt_out_rtan + "</td>";
        	outputHTML += "<td>"+ salesManager.custentity_enable_two_way_sms + "</td>";
        	outputHTML += "</tr>";
    	}
    	
    	log.debug("salesManager",salesManager);
    	log.debug("5");
    	var builder = search.lookupFields({
    		type: search.Type.CUSTOMER,
    		id: builderId,
    		columns: ['custentity_copy_on_ren']
    	});
    	log.debug("builder",builder);
    	
    	var renId = builder.custentity_copy_on_ren.value;
    	var ren;
    	
    	if(renId){
    		ren = search.lookupFields({
        		type: search.Type.PARTNER,
        		id: renId,
        		columns: ['entityid', 'email', 'custentity_opt_out_rtan', 'custentity_enable_two_way_sms']
        	});
    		outputHTML += "<tr>";
        	outputHTML += "<td>REN</td>";
        	outputHTML += "<td>"+ ren.entityid + "</td>";
        	outputHTML += "<td>"+ ren.email + "</td>";
        	outputHTML += "<td>"+ ren.custentity_opt_out_rtan + "</td>";
        	outputHTML += "<td>"+ ren.custentity_enable_two_way_sms + "</td>";
        	outputHTML += "</tr>";
    		log.debug("ren",ren);
    	};
    	
    	
    	outputHTML += "</tr></table>";
    	
    	
    	response.write(outputHTML);
    }

    return {
        onRequest: onRequest
    };
    
});
