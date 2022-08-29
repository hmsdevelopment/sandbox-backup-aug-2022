/**
 * Author Brian Turk <bturk183@gmail.com>
 * 
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * 
 * This script handles checking the the property record changes
 * to see if a PDF Listing Amendment needs to be generated.  If
 * the critieria is met, the user will prompted and asked if 
 * they would like it be generated.
 * 
 * The created listing amendment will be created and stored
 * in the Listing Amendments folder.  Additionally, if it
 * is for the Cincy region, and email will be generated.
 * 
 * 
 * ==========================================================
 * Change Log
 * ==========================================================
 * 
 * 2018.04.25 BT Initial Conversion from SS 1.0 to 2.0
 * 
 */
define(["N/ui/dialog", "N/url"],

function(dialog, url) {
	
	//Variables to track orignal values.
	var oldListPrice = null; 
	var oldExpDate = null;
    var details = '';
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @param {string} context.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     * 
     */
    function pageInit(context) {
    	var rec = context.currentRecord;
    	
    	try{
    		//Capture Initial Values to compare for changes when saving record.
    		oldListPrice =  rec.getValue({
        		fieldId:'custrecord_current_list_price'
        	});
        	
        	oldExpDate =  rec.getValue({
        		fieldId:'custrecord_expiration_date'
        	});
    	}catch(ex){
    		details = 'Exception : '+ex+', Message : '+ex.message+' Name : '+ex.name;
    		log.error('List Amendment','Exception : '+ex+', Message : '+ex.message+' Name : '+ex.name);
    		log.debug('List Amendment',ex);
    	}
    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} context
     * @param {Record} context.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(context) {
    	var rec = context.currentRecord;
    	
    	try{
    		
    		//Initial necessary variables
    		var propertyName = rec.getText('name');
    		var mlsRegionName = rec.getText('custrecord15');
    		var newListPrice = rec.getValue('custrecord_current_list_price');	
    		var newExpDate = rec.getValue('custrecord_expiration_date');	
            var mlsRegionId = rec.getValue('custrecord15'); //Cincinnati OH 1
            var topLevelBuilder = rec.getValue('custrecord_top_level_builder'); // Fischer Homes 509
            
            log.audit('Save Record', 'Checking if Listing Amendment may be needed');
            log.audit('Save Record', 'Property: ' + name);
            
            //Check if the build is Fischer Homes and if a MLS Region is selected
            if((topLevelBuilder==4903 || topLevelBuilder==509 || topLevelBuilder == 3990 || topLevelBuilder ==5053 || topLevelBuilder ==5208 || topLevelBuilder ==5184) && mlsRegionId){
            	var isChanged = false;

            	//Evaluate Price and Date fields to see if a Listing Amendment may be needed
            	if(oldListPrice && newListPrice && oldExpDate && newExpDate){
    	        	if(oldListPrice != newListPrice && oldExpDate.getTime() == newExpDate.getTime()){
    	        		isChanged = true;
    	        		log.audit('Save Record', 'Current Price  : '+oldListPrice+' Changed with : '+newListPrice);
    	        	}else if(oldListPrice == newListPrice && oldExpDate.getTime() != newExpDate.getTime()){
                        isChanged = true;
                        log.audit('Save Record', 'Expiry Date : '+oldExpDate +' Changed  with : '+newExpDate);
                    }else if(oldListPrice != newListPrice && oldExpDate.getTime() != newExpDate.getTime()){
    	                isChanged = true;
    	                log.audit('Save Record', 'Property Record , Current Price  : '+oldListPrice+' Changed  with : '+newListPrice);
    	                log.audit('Save Record', 'Expiry Date : '+oldExpDate +' Changed  with :'+newExpDate);
    	            }	
                }
    			
    	        if(isChanged){
    	        	//If price or date has changed, an amendment may be needed.  There are times the user
    	        	//may not want an amendment, so we prompt them and ask.  
    	        	log.audit('Save Record', 'Changes found that may require a new Listing Amendment');
    	        	log.audit('Save Record', 'Prompt User for Listing Amendment Options');
    	        	
    	        	var res = confirm('Create New Listing Amendment ? ');
    	        	
    				if( res == true){
    					rec.setValue({fieldId:'custrecord_is_changed', value:true});
    					log.audit('Save Record', 'User requests a Listing Amendment be CREATED');
    					
    					//Check if this is a region that may require an email.  If so, ask user if they want an email generated
    					if(mlsRegionId  == 1)
                        {
    						log.audit('Save Record', 'Ask user if email is needed for ' + mlsRegionName + ' region');
                            var res2 = confirm('Email Listing Amendment to MLS?'); 
                            if( res2 == true){
                            	rec.setValue({fieldId:'custrecord_email_to_mls', value:true});
                            	log.audit('Save Record', 'User wants email = YES');
                            }else{
                            	rec.setValue({fieldId:'custrecord_email_to_mls', value:false});
                            	log.audit('Save Record', 'User wants email = NO');
                            }
                        }
                    	
    				}else{
    					rec.setValue({fieldId:'custrecord_is_changed', value:false});
                    	rec.setValue({fieldId:'custrecord_email_to_mls', value:false});
                    	log.audit('Save Record', 'User requests a Listing Amendment NOT BE CREATED');
    				}
    	        } else {
    	        	log.audit('Save Record', 'Listing Amendment IS NOT needed');
    	        }
    	        
              }           
    		  return true;
    	}
    	catch(ex)
    	{
    		details = 'Exception : '+ex+', Message : '+ex.message+' Name : '+ex.name;
    		log.error('Save Record', details);
    		log.debug('Save Record', ex);
    		alert(details);
    		
    	}

    }
    
    return {
        pageInit: pageInit,
      //  fieldChanged: fieldChanged,
      //  postSourcing: postSourcing,
      //  sublistChanged: sublistChanged,
      //  lineInit: lineInit,
      //  validateField: validateField,
      //  validateLine: validateLine,
      //  validateInsert: validateInsert,
      //  validateDelete: validateDelete,
        saveRecord: saveRecord
    };
    
});
