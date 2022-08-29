/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(["N/record","N/ui/serverWidget", "N/search"],

function(record, ui, search) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	var form = ui.createForm({
    		title:"Update Construction Status",
    		hideNavBar:true
    	});
    	
    	form.addSubmitButton({
    		label : "Save"
    	});
    	
    	var slProperties = form.addSublist({
    	    id : 'custpage_sublist_properties',
    	    type : ui.SublistType.INLINEEDITOR,
    	    label : 'Properties'
    	});
    	
    	var fldProperty = slProperties.addField({
    	    id : 'custrecord_bcu_property',
    	    type : ui.FieldType.TEXT,
    	    label : 'Property',
    	});
    	
    	
//    	fldProperty.updateDisplayType({
//    	    displayType: ui.FieldDisplayType.INLINE
//    	});
//    	
    	var fldStatus = slProperties.addField({
    	    id : 'custrecord_bcu_status',
    	    type : ui.FieldType.SELECT,
    	    label : 'Construction Status',
    	    source: 'customlist_construction_status'
    	});
    	
    	var propertySearch = search.create({
            type: 'customrecord_property_record',
            columns: ['custrecord31', 'custrecord_house_number', 'custrecord_current_construction','custrecord_property_date_const_update'],
            filters: [
                      ["custrecord_property_bsr_team", "is", 4196],
                      "AND",
                      ["custrecord_property_status","anyof","1"]
                     ]
        });
    	
    		var lineIndex = 0;
    		propertySearch.run().each(function(result){
    		   // .run().each has a limit of 4,000 results
    			var serAddress = result.getValue("custrecord_house_number");
    			var serStreet = result.getText("custrecord31");
    			var serStatus = result.getValue("custrecord_current_construction");
    			
    			slProperties.setSublistValue({
    				id: "custrecord_bcu_property",
    				line : lineIndex,
    				value : serAddress+ " " + serStreet
    			});
    			
    			slProperties.setSublistValue({
    				id: "custrecord_bcu_status",
    				line : lineIndex,
    				value : serStatus
    			});
    			
    			lineIndex++;
    		   return true;
    		});
    	
    	
    	context.response.writePage(form);

    }

    return {
        onRequest: onRequest
    };
    
});
