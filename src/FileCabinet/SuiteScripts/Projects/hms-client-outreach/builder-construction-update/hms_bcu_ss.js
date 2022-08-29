/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(["N/search", "N/record", "N/render", "N/email"],

function(search, record, render, email) {
	var TEST_MODE = true;
	var TEST_SENDER = 4822;  //bturk183@gmail.com
	var TEST_RECIPIENT = 4822;  //bturk183@gmail.com
	var TEST_FILTER =["custrecordcustrecordsubdname.custrecord_administrative_contact","is","4093"];
	var TEST_ADMIN_CONTACT_ID = 4093;
	
	var adminContacts = [];
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} context
     * @param {string} context.type - The context in which the script is executed. It is one of the values from the context.InvocationType enum.
     * @Since 2015.2
     */
    function execute(context) {
    	log.audit("BEGIN", "Processing Construction Update Request Emails");
    	getAdminContacts();
    	log.debug("Administrative Contact List", adminContacts);
    	generateEmails();
    	log.audit("END", "Finished Processing");
    }
    
    function getAdminContacts(){
    	log.debug("Admin Contacts", "Building");
    	var propertySearch = search.create({
    		   type: "customrecord_property_record",
    		   filters:
    		   [
    		      ["custrecord_property_status","anyof","1"],
    		      "and",
    		      ["custrecordcustrecordsubdname.custrecord_administrative_contact","is","4093"]
    		   ],
    		   columns:
    		   [
    		      search.createColumn({
    		    	  name: "custrecord_administrative_contact",
    		          join: "CUSTRECORDCUSTRECORDSUBDNAME",
    		          summary: "GROUP",
    		          sort: search.Sort.ASC,
    		          label: "Administrative Contact"
    		       }),
    		       
    		      search.createColumn({
    		    	  name: "custrecord_administrative_contact_email",
    		          join: "CUSTRECORDCUSTRECORDSUBDNAME",
    		          summary: "GROUP",
    		          label: "Administrative Contact's Email"
    		      }),
    		        
    		      search.createColumn({
    		    	  name: "custrecord_preferred_subdivision_name",
    		          join: "CUSTRECORDCUSTRECORDSUBDNAME",
    		          summary: "GROUP",
    		          label: "Builder Preferred Subdivision Name"
    		      }),
    		      
    		      search.createColumn({
    		    	  name: "custrecordcustrecordsubdname",
    		          summary: "COUNT",
    		          sort: search.Sort.ASC,
    		          label: "Subdivision Name"
    		      }),
    		      
    		      search.createColumn({
    		    	  name: "internalid",
    		          summary: "COUNT",
    		          label: "Internal ID"
    		      })
    		   ]
    	});
    	
//    	if(TEST_MODE)
//    		propertySearch.filters.push(TEST_FILTER);
    	
    	var searchResultCount = propertySearch.runPaged().count;
		log.debug("Administrative Contacts", "Found: " + searchResultCount);
		
		propertySearch.run().each(function(result){
		   // .run().each has a limit of 4,000 results
			adminContacts.push(result.getValue({name:'custrecord_administrative_contact', join: "CUSTRECORDCUSTRECORDSUBDNAME", summary:'GROUP'}));
		   return true;
		});
		
		log.debug("Admin Contacts", "Complete");	
    	
    }
    
    function generateEmails(){
    	log.audit("Generating Emails");
    	for(var i=0; i<adminContacts.length; i++){
    		var subdivisionAdmin = record.load({
    			type: record.Type.PARTNER, 
    		    id: adminContacts[i]
    		});
    		
    		var renderer = render.create();
    		renderer.setTemplateByScriptId({
    		    scriptId: "CUSTTMPL_REQUEST_CONSTRUCTION_UPDATE"
    		});
    		
    		var rs = search.create({
                type: 'customrecord_property_record',
                columns: [
                          'custrecord31', 
                          'custrecord_house_number', 
                          'custrecord_current_construction',
                          'custrecord_property_date_const_update',
                          'custrecordcustrecordsubdname.custrecord_preferred_subdivision_name'
                         ],
                filters: [
                          ["custrecordcustrecordsubdname.custrecord_administrative_contact","is",adminContacts[i]],
                          "AND",
                          ["custrecord_property_status","anyof","1"]
                         ]
            }).run();
            
    		var results = rs.getRange(0, 10);
    		
    		renderer.addSearchResults({
                templateName: 'SEARCH', 
                searchResult: results
            });
    		
    		renderer.addRecord({
    			templateName : 'record',
    			record : subdivisionAdmin
    		});
    		
    		var emailBody = renderer.renderAsString();
    		
   			email.send({
   				author: (TEST_MODE ? TEST_SENDER : 4822), 
    		    recipients: (TEST_MODE ? TEST_RECIPIENT : 4822),
    		    subject: 'Request Construction Update',
    		    body: emailBody
    		});
        		    
    	}
    	log.audit("Finished Generating Emails");
    	
    }
    
    

    return {
        execute: execute
    };
    
});
