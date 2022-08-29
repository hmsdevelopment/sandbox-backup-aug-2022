function searchProperty(request,response)
{
  if (request.getMethod() == 'GET')
  {
    nlapiLogExecution('DEBUG','BEGIN','BEGIN');
    
    var houseno = (request.getParameter('houseno'));
    var msg = (request.getParameter('msg'));
    //var streetname = (request.getParameter('custpage_streetname'));
    nlapiLogExecution('DEBUG','houseno','houseno  '+houseno);
    displaySecondPage(houseno, msg);
    
    
  }
  else
  {
    nlapiLogExecution('DEBUG','test','test '+request.getParameter('submitter'));
    if(request.getParameter('submitter') == 'OK')
    {
      createform();
    }
    else if(request.getParameter('submitter') == 'Proceed')
    {
      var houseno = request.getParameter('custpage_housenumber');
      var status = request.getParameter('custpage_status');
      var oldstatus = request.getParameter('custpage_oldstatus');
      displayresult(houseno,status,oldstatus);
    }
    else if(request.getParameter('submitter') == 'Submit')
    {
      //===================== below fields will change on dropdown change =======
    
      var status = request.getParameter('custpage_salesstatus');
      var oldstatus = request.getParameter('custpage_salesstatus');
      var approvaldate = request.getParameter('custpage_contract_approval_date');
      var contrecv4mbuilder = request.getParameter('custpage_contract_receive_from_builder');
      var estclosingdate = request.getParameter('custpage_estimated_closing_date');
      var conststatusatcontract = request.getParameter('custpage_construction_status_at_contract');
      var buyername = request.getParameter('custpage_buyer_name');
      var cooprealstateagentname = request.getParameter('custpage_cooperating_real_estate_agent_name');
      var cooprealestateagentid = request.getParameter('custpage_cooperating_real_estate_agent_id1');
      var realestatebrokername = request.getParameter('custpage_cooperating_real_estate_broker_name');
      var cooprealestatebrokerid1 = request.getParameter('custpage_cooperating_real_estate_broker_id1');
      var pendingnote1 = request.getParameter('custpage_pending_notification1');
      var cooprealestateagentid2 = request.getParameter('custpage_cooperating_real_estate_agent_id2');
      var cooprealestatebrokerid2 = request.getParameter('custpage_cooperating_real_estate_broker_id2');
      var pendingnote2 = request.getParameter('custpage_pending_notification2');
      var purchasecontract = request.getFile('custpage_purchase_contract');
      var salesnote = request.getParameter('custpage_sales_notes');
      var salesagentname = request.getParameter('custpage_sales_notification_agent_name');
      var brokername = request.getParameter('custpage_sales_notification_broker_name');
      
      var propertyid = request.getParameter('custpage_internalid');
      var listing_notes = request.getParameter('custpage_listing_notes');
      
      //====================================================================================================
      var actual_closing_date = request.getParameter('custpage_actual_closing_date');
      var closing_price = request.getParameter('custpage_closing_price');
      var loan_amount = request.getParameter('custpage_loan_amount');
      var financing_type = request.getParameter('custpage_financing_type');
      var closing_notify_date1 = request.getParameter('custpage_closing_notify_date1');
      var closing_notify_date2 = request.getParameter('custpage_closing_notify_date2');
      var hud1 = request.getFile('custpage_hud1');
      var hud_rcvd_date = request.getParameter('custpage_hud_rcvd_date');
      var closing_notes = request.getParameter('custpage_closing_notes');
      var resend_closing_notif = request.getParameter('custpage_resend_closing_notif');
      //====================================================================================================
      
      var mls_no_reg1 = request.getParameter('custpage_mls_no_reg1');
      var mls_no_reg2 = request.getParameter('custpage_mls_no_reg2');
      
      var original_list_price = request.getParameter('custpage_original_list_price');
      var construction_status_list = request.getParameter('custpage_construction_status_list');
      var list_date = request.getParameter('custpage_list_date');
      var estimate_roof_date = request.getParameter('custpage_estimate_roof_date');
      var estimate_completion_date = request.getParameter('custpage_estimate_completion_date');
      var current_list_price = request.getParameter('custpage_current_list_price');
      var current_cnsrtction_status = request.getParameter('custpage_current_cnsrtction_status');
      var last_const_update = request.getParameter('custpage_last_const_update');
      var mls_region1 = request.getParameter('custpage_mls_region1');
      var list_notify_mls_region1 = request.getParameter('custpage_list_notify_mls_region1');
      var mls_region2 = request.getParameter('custpage_mls_region2');
      var list_notify_mls_region2 = request.getParameter('custpage_list_notify_mls_region2');
      var expiration_date = request.getParameter('custpage_expiration_date');
      //var administrative_contact = request.getParameter('custpage_administrative_contact');
      var administrative_contact_email = request.getParameter('custpage_administrative_contact_email');
      var administrative_contact_phno = request.getParameter('custpage_administrative_contact_phno');
      //var sales_manager = request.getParameter('custpage_sales_manager');
      var sales_manager_email = request.getParameter('custpage_sales_manager_email');
      //var division_manager = request.getParameter('custpage_division_manager');
      var division_manager_email = request.getParameter('custpage_division_manager_email');
      var floorplan = request.getParameter('custpage_floorplan');
      var elevation = request.getParameter('custpage_elevation');
      var square_feet = request.getParameter('custpage_square_feet');
      var property_photos = request.getParameter('custpage_property_photos');
      //var listing_notes = request.getParameter('custpage_listing_notes');
      var exist_status = nlapiLookupField('customrecord_property_record', propertyid, 'custrecord_property_status');
      //nlapiLogExecution('DEBUG','if 1',' exist_status '+exist_status);
      
      var proprec = nlapiLoadRecord('customrecord_property_record',propertyid,{"recordmode":"dynamic"});
      proprec.setFieldValue('custrecord_property_status',status);

      //-----------------------------------------------------Adding Date ----------Update on 2/1/2019----------------

      var today = new Date();
      	var dd = today.getDate();
      	var mm = today.getMonth()+1; //January is 0!

      	var yyyy = today.getFullYear();
      	if(dd<10){
      	    dd='0'+dd;
      	} 
      	if(mm<10){
      	    mm='0'+mm;
      	} 
      	var today = mm+'/'+dd+'/'+yyyy;

  proprec.setFieldValue('custrecord_property_date_sales_st_update',today);


      //--------------------------------------------------------------------------------------------------------------
      
      nlapiLogExecution('DEBUG','if 1',' exist_status '+exist_status+' status '+status);
      if((exist_status == 1 ) && (status == 2)) 
      {
        //nlapiLogExecution('DEBUG','if 1','approvaldate  '+approvaldate);
        if(approvaldate)
        proprec.setFieldValue('custrecord_contract_approval_date',approvaldate);
        else
        proprec.setFieldValue('custrecord_contract_approval_date','');
        if(contrecv4mbuilder)
        proprec.setFieldValue('custrecord_contract_received_date',contrecv4mbuilder);
        else
        proprec.setFieldValue('custrecord_contract_received_date','');
        if(estclosingdate)
        proprec.setFieldValue('custrecord_estimated_closing_date',estclosingdate);
        else
        proprec.setFieldValue('custrecord_estimated_closing_date','');
        if(conststatusatcontract)
        proprec.setFieldValue('custrecord_construction_status_contract',conststatusatcontract);
        else
        proprec.setFieldValue('custrecord_construction_status_contract','');
        if(buyername)
        proprec.setFieldValue('custrecord_buyers_last_name',buyername);
        else
        proprec.setFieldValue('custrecord_buyers_last_name','');
        if(cooprealstateagentname)
        proprec.setFieldValue('custrecord_real_estate_agent_name',cooprealstateagentname);
        else
        proprec.setFieldValue('custrecord_real_estate_agent_name','');
        if(cooprealestateagentid)
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_1',cooprealestateagentid);
        else
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_1','');
        if(realestatebrokername)
        proprec.setFieldValue('custrecord_real_estate_broker_name',realestatebrokername);
        else
        proprec.setFieldValue('custrecord_real_estate_broker_name','');
        if(cooprealestatebrokerid1)
        proprec.setFieldValue('custrecord_real_estate_broker_id_mls1',cooprealestatebrokerid1);
        else
        proprec.setFieldValue('custrecord_real_estate_broker_id_mls1','');
        if(pendingnote1)
        proprec.setFieldValue('custrecord_pending_date_mls_region1',pendingnote1);
        else
        proprec.setFieldValue('custrecord_pending_date_mls_region1','');
        if(cooprealestateagentid2)
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_2',cooprealestateagentid2);
        else
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_2','');
        if(cooprealestatebrokerid2)
        proprec.setFieldValue('custrecord_broker_office_id_mlsregion2',cooprealestatebrokerid2);
        else
        proprec.setFieldValue('custrecord_broker_office_id_mlsregion2','');
        if(pendingnote2)
        proprec.setFieldValue('custrecord_pending_date_mls_region2',pendingnote2);
        else
        proprec.setFieldValue('custrecord_pending_date_mls_region2','');
        nlapiLogExecution('DEBUG','purchasecontract',' purchasecontract '+purchasecontract);
        if(purchasecontract)
        {
          purchasecontract.setFolder(38);
          var id1 = nlapiSubmitFile(purchasecontract);
          
          try{
			  nlapiLogExecution('DEBUG', 'purchaseContract', 'ID = ' + id1);
			  
			  var type = 'file';                              //Define record type for the record being attached
			  var id = id1;                                   //Ensure id2 is a valid ID. An error is thrown if id2 is not valid.
			  var type2 = 'customrecord_property_record';     //Define the record type for the record being attached to
			  var id2 = propertyid;                           //Define the internal ID for this record
			  var attributes = null;
			  
			  nlapiAttachRecord(type, id, type2, id2, attributes);
		  }catch(error){
			  nlapiLogExecution('ERROR', 'Execution Error', error);
			  
			  var emailBody = "An error occurred when attaching the Purchase Contract file to the property record with the id: " + propertyid + ".";
              nlapiSendEmail( 3847, 'esteban.gonzalez@midware.net', 'Error Attaching Property File', emailBody );

		  }
          
          proprec.setFieldValue('custrecord_purchase_contract',id1);
        }
        else
        proprec.setFieldValue('custrecord_purchase_contract','');
        if(salesnote)
        proprec.setFieldValue('custrecord_sale_notes',salesnote);
        else
        proprec.setFieldValue('custrecord_sale_notes','');
        if(salesagentname)
        proprec.setFieldValue('custrecord_agent_name_sn',salesagentname);
        else
        proprec.setFieldValue('custrecord_agent_name_sn','');
        if(brokername)
        proprec.setFieldValue(' custrecord_brokerage_name_sn',brokername);
        else
        proprec.setFieldValue(' custrecord_brokerage_name_sn','');
      }
      else if((exist_status == 2 ) && (status == 1))
      {
        //nlapiLogExecution('DEBUG','if 1','approvaldate  '+approvaldate);
        if(approvaldate)
        proprec.setFieldValue('custrecord_contract_approval_date','');
        else
        proprec.setFieldValue('custrecord_contract_approval_date','');
        if(contrecv4mbuilder)
        proprec.setFieldValue('custrecord_contract_received_date','');
        else
        proprec.setFieldValue('custrecord_contract_received_date','');
        if(estclosingdate)
        proprec.setFieldValue('custrecord_estimated_closing_date','');
        else
        proprec.setFieldValue('custrecord_estimated_closing_date','');
        if(conststatusatcontract)
        proprec.setFieldValue('custrecord_construction_status_contract','');
        else
        proprec.setFieldValue('custrecord_construction_status_contract','');
        if(buyername)
        proprec.setFieldValue('custrecord_buyers_last_name','');
        else
        proprec.setFieldValue('custrecord_buyers_last_name','');
        if(cooprealstateagentname)
        proprec.setFieldValue('custrecord_real_estate_agent_name','');
        else
        proprec.setFieldValue('custrecord_real_estate_agent_name','');
        if(cooprealestateagentid)
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_1','');
        else
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_1','');
        if(realestatebrokername)
        proprec.setFieldValue('custrecord_real_estate_broker_name','');
        else
        proprec.setFieldValue('custrecord_real_estate_broker_name','');
        if(cooprealestatebrokerid1)
        proprec.setFieldValue('custrecord_real_estate_broker_id_mls1','');
        else
        proprec.setFieldValue('custrecord_real_estate_broker_id_mls1','');
        if(pendingnote1)
        proprec.setFieldValue('custrecord_pending_date_mls_region1','');
        else
        proprec.setFieldValue('custrecord_pending_date_mls_region1','');
        if(cooprealestateagentid2)
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_2','');
        else
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_2','');
        if(cooprealestatebrokerid2)
        proprec.setFieldValue('custrecord_broker_office_id_mlsregion2','');
        else
        proprec.setFieldValue('custrecord_broker_office_id_mlsregion2','');
        if(pendingnote2)
        proprec.setFieldValue('custrecord_pending_date_mls_region2','');
        else
        proprec.setFieldValue('custrecord_pending_date_mls_region2','');
        if(purchasecontract)
        proprec.setFieldValue('custrecord_purchase_contract','');
        else
        proprec.setFieldValue('custrecord_purchase_contract','');
        if(salesnote)
        proprec.setFieldValue('custrecord_sale_notes','');
        else
        proprec.setFieldValue('custrecord_sale_notes','');
        if(salesagentname)
        proprec.setFieldValue('custrecord_agent_name_sn','');
        else
        proprec.setFieldValue('custrecord_agent_name_sn','');
        if(brokername)
        proprec.setFieldValue(' custrecord_brokerage_name_sn','');
        else
        proprec.setFieldValue(' custrecord_brokerage_name_sn','');
      } 
      else if((exist_status == 1) && (status == 8))
      {
        //nlapiLogExecution('DEBUG','if 2','approvaldate  '+approvaldate);
        if(approvaldate)
        proprec.setFieldValue('custrecord_contract_approval_date',approvaldate);
        else
        proprec.setFieldValue('custrecord_contract_approval_date','');
        if(contrecv4mbuilder)
        proprec.setFieldValue('custrecord_contract_received_date',contrecv4mbuilder);
        else
        proprec.setFieldValue('custrecord_contract_received_date','');
        if(estclosingdate)
        proprec.setFieldValue('custrecord_estimated_closing_date',estclosingdate);
        else
        proprec.setFieldValue('custrecord_estimated_closing_date','');
        if(conststatusatcontract)
        proprec.setFieldValue('custrecord_construction_status_contract',conststatusatcontract);
        else
        proprec.setFieldValue('custrecord_construction_status_contract','');
        if(buyername)
        proprec.setFieldValue('custrecord_buyers_last_name',buyername);
        else
        proprec.setFieldValue('custrecord_buyers_last_name','');
        if(cooprealstateagentname)
        proprec.setFieldValue('custrecord_real_estate_agent_name',cooprealstateagentname);
        else
        proprec.setFieldValue('custrecord_real_estate_agent_name','');
        if(cooprealestateagentid)
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_1',cooprealestateagentid);
        else
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_1','');
        if(realestatebrokername)
        proprec.setFieldValue('custrecord_real_estate_broker_name',realestatebrokername);
        else
        proprec.setFieldValue('custrecord_real_estate_broker_name','');
        if(cooprealestatebrokerid1)
        proprec.setFieldValue('custrecord_real_estate_broker_id_mls1',cooprealestatebrokerid1);
        else
        proprec.setFieldValue('custrecord_real_estate_broker_id_mls1','');
        if(pendingnote1)
        proprec.setFieldValue('custrecord_pending_date_mls_region1',pendingnote1);
        else
        proprec.setFieldValue('custrecord_pending_date_mls_region1','');
        if(cooprealestateagentid2)
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_2',cooprealestateagentid2);
        else
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_2','');
        if(cooprealestatebrokerid2)
        proprec.setFieldValue('custrecord_broker_office_id_mlsregion2',cooprealestatebrokerid2);
        else
        proprec.setFieldValue('custrecord_broker_office_id_mlsregion2','');
        if(pendingnote2)
        proprec.setFieldValue('custrecord_pending_date_mls_region2',pendingnote2);
        else
        proprec.setFieldValue('custrecord_pending_date_mls_region2','');
        if(purchasecontract)
        proprec.setFieldValue('custrecord_purchase_contract',purchasecontract);
        else
        proprec.setFieldValue('custrecord_purchase_contract','');
        if(salesnote)
        proprec.setFieldValue('custrecord_sale_notes',salesnote);
        else
        proprec.setFieldValue('custrecord_sale_notes','');
        if(salesagentname)
        proprec.setFieldValue('custrecord_agent_name_sn',salesagentname);
        else
        proprec.setFieldValue('custrecord_agent_name_sn','');
        if(brokername)
        proprec.setFieldValue(' custrecord_brokerage_name_sn',brokername);
        else
        proprec.setFieldValue(' custrecord_brokerage_name_sn','');
      }
      else if((exist_status == 1 || exist_status == 2) && (status == 4 || status == 7))
      {
        //nlapiLogExecution('DEBUG','if 3','approvaldate  '+approvaldate);
        if(approvaldate)
        proprec.setFieldValue('custrecord_contract_approval_date',approvaldate);
        else
        proprec.setFieldValue('custrecord_contract_approval_date','');
        if(contrecv4mbuilder)
        proprec.setFieldValue('custrecord_contract_received_date',contrecv4mbuilder);
        else
        proprec.setFieldValue('custrecord_contract_received_date','');
        if(estclosingdate)
        proprec.setFieldValue('custrecord_estimated_closing_date',estclosingdate);
        else
        proprec.setFieldValue('custrecord_estimated_closing_date','');
        if(conststatusatcontract)
        proprec.setFieldValue('custrecord_construction_status_contract',conststatusatcontract);
        else
        proprec.setFieldValue('custrecord_construction_status_contract','');
        if(buyername)
        proprec.setFieldValue('custrecord_buyers_last_name',buyername);
        else
        proprec.setFieldValue('custrecord_buyers_last_name','');
        if(cooprealstateagentname)
        proprec.setFieldValue('custrecord_real_estate_agent_name',cooprealstateagentname);
        else
        proprec.setFieldValue('custrecord_real_estate_agent_name','');
        if(cooprealestateagentid)
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_1',cooprealestateagentid);
        else
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_1','');
        if(realestatebrokername)
        proprec.setFieldValue('custrecord_real_estate_broker_name',realestatebrokername);
        else
        proprec.setFieldValue('custrecord_real_estate_broker_name','');
        if(cooprealestatebrokerid1)
        proprec.setFieldValue('custrecord_real_estate_broker_id_mls1',cooprealestatebrokerid1);
        else
        proprec.setFieldValue('custrecord_real_estate_broker_id_mls1','');
        if(pendingnote1)
        proprec.setFieldValue('custrecord_pending_date_mls_region1',pendingnote1);
        else
        proprec.setFieldValue('custrecord_pending_date_mls_region1','');
        if(cooprealestateagentid2)
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_2',cooprealestateagentid2);
        else
        proprec.setFieldValue('custrecord_real_estate_agent_id_region_2','');
        if(cooprealestatebrokerid2)
        proprec.setFieldValue('custrecord_broker_office_id_mlsregion2',cooprealestatebrokerid2);
        else
        proprec.setFieldValue('custrecord_broker_office_id_mlsregion2','');
        if(pendingnote2)
        proprec.setFieldValue('custrecord_pending_date_mls_region2',pendingnote2);
        else
        proprec.setFieldValue('custrecord_pending_date_mls_region2','');
        if(purchasecontract)
        proprec.setFieldValue('custrecord_purchase_contract',purchasecontract);
        else
        proprec.setFieldValue('custrecord_purchase_contract','');
        if(salesnote)
        proprec.setFieldValue('custrecord_sale_notes',salesnote);
        else
        proprec.setFieldValue('custrecord_sale_notes','');
        if(salesagentname)
        proprec.setFieldValue('custrecord_agent_name_sn',salesagentname);
        else
        proprec.setFieldValue('custrecord_agent_name_sn','');
        if(brokername)
        proprec.setFieldValue('custrecord_brokerage_name_sn',brokername);
        else
        proprec.setFieldValue('custrecord_brokerage_name_sn','');
        if(listing_notes)
        proprec.setFieldValue('custrecord_listing_notes',listing_notes);
        else
        proprec.setFieldValue('custrecord_listing_notes','');
      }
      else if((exist_status == 2) && (status == 3))
      {
        //nlapiLogExecution('DEBUG','if 4','actual_closing_date  '+actual_closing_date);
        if(actual_closing_date)
        proprec.setFieldValue('custrecord_actual_closing_date',actual_closing_date);
        else
        proprec.setFieldValue('custrecord_actual_closing_date','');
        if(closing_price)
        proprec.setFieldValue('custrecord50',closing_price);
        else
        proprec.setFieldValue('custrecord50','');
        if(loan_amount)
        proprec.setFieldValue('custrecord_loan_amount',loan_amount);
        else
        proprec.setFieldValue('custrecord_loan_amount','');
        if(financing_type)
        proprec.setFieldValue('custrecord_financing_type',financing_type);
        else
        proprec.setFieldValue('custrecord_financing_type','');
        if(closing_notify_date1)
        proprec.setFieldValue('custrecord_closing_date_mls_region1',closing_notify_date1);
        else
        proprec.setFieldValue('custrecord_closing_date_mls_region1','');
        if(closing_notify_date2)
        proprec.setFieldValue('custrecord_closing_date_mls_region2',closing_notify_date2);
        else
        proprec.setFieldValue('custrecord_closing_date_mls_region2','');
        if(hud1)
        {
          hud1.setFolder(38);
          var id = nlapiSubmitFile(hud1);
          
          try{
			  nlapiLogExecution('DEBUG', 'hud1', 'ID = ' + id);

			  var type = 'file';                              //Define record type for the record being attached
			  var id = id;                                    //Ensure id2 is a valid ID. An error is thrown if id2 is not valid.
			  var type2 = 'customrecord_property_record';     //Define the record type for the record being attached to
			  var id2 = propertyid;                           //Define the internal ID for this record
			  var attributes = null;
            
			  nlapiAttachRecord(type, id, type2, id2, attributes);
			  
		  }catch(error){
			  nlapiLogExecution('ERROR', 'Execution Error', error);
			  
			  var emailBody = "An error occurred when attaching the hudl file to the property record with the id: " + propertyid + ".";
              nlapiSendEmail( 3847, 'esteban.gonzalez@midware.net', 'Error Attaching Property File', emailBody );

		  }
          
          proprec.setFieldValue('custrecord_hud1',id);
        }
        else
        proprec.setFieldValue('custrecord_hud1','');
        if(hud_rcvd_date)
        proprec.setFieldValue('custrecord_hud_received_date',hud_rcvd_date);
        else
        proprec.setFieldValue('custrecord_hud_received_date','');
        if(closing_notes)
        proprec.setFieldValue('custrecord_closing_notes',closing_notes);
        else
        proprec.setFieldValue('custrecord_closing_notes','');
        if(resend_closing_notif)
        proprec.setFieldValue('custrecord_resend_closing_notification',resend_closing_notif);
        else
        proprec.setFieldValue('custrecord_resend_closing_notification','');
      }
      else if((exist_status == 7) && (status == 1))
      {
        //nlapiLogExecution('DEBUG','if 5','original_list_price  '+original_list_price);
        nlapiLogExecution('DEBUG','original_list_price','original_list_price  '+original_list_price);
        if(original_list_price)
        proprec.setFieldValue('custrecord_original_listing_price',original_list_price);
        else
        proprec.setFieldValue('custrecord_original_listing_price','');
        if(construction_status_list)
        proprec.setFieldValue('custrecord_construction_status_listing',construction_status_list);
        else
        proprec.setFieldValue('custrecord_construction_status_listing','');
        if(list_date)
        proprec.setFieldValue('custrecord_list_date',list_date);
        else
        proprec.setFieldValue('custrecord_list_date','');
        if(estimate_roof_date)
        proprec.setFieldValue('custrecord_estimated_under_roof_date',estimate_roof_date);
        else
        proprec.setFieldValue('custrecord_estimated_under_roof_date','');
        if(estimate_completion_date)
        proprec.setFieldValue('custrecord_estimated_completion_date',estimate_completion_date);
        else
        proprec.setFieldValue('custrecord_estimated_completion_date','');
        if(current_list_price)
        proprec.setFieldValue('custrecord_current_list_price',current_list_price);
        else
        proprec.setFieldValue('custrecord_current_list_price','');
        if(current_cnsrtction_status)
        proprec.setFieldValue('custrecord_current_construction',current_cnsrtction_status);
        else
        proprec.setFieldValue('custrecord_current_construction','');
        if(last_const_update)
        proprec.setFieldValue('custrecord_property_date_const_update',last_const_update);
        else
        proprec.setFieldValue('custrecord_property_date_const_update','');
        if(mls_region1)
        proprec.setFieldValue('custrecord15',mls_region1);
        else
        proprec.setFieldValue('custrecord15','');
        if(list_notify_mls_region1)
        proprec.setFieldValue('custrecord_listing_date_mls_region1',list_notify_mls_region1);
        else
        proprec.setFieldValue('custrecord_listing_date_mls_region1','');
        if(mls_region2)
        proprec.setFieldValue('custrecord16',mls_region2);
        else
        proprec.setFieldValue('custrecord16','');
        if(list_notify_mls_region2)
        proprec.setFieldValue('custrecord_listing_date_mls_region2',list_notify_mls_region2);
        else
        proprec.setFieldValue('custrecord_listing_date_mls_region2','');
        if(expiration_date)
        proprec.setFieldValue('custrecord_expiration_date',expiration_date);
        else
        proprec.setFieldValue('custrecord_expiration_date','');
        //if(administrative_contact)
        //proprec.setFieldValue('custrecord17',administrative_contact);
        //else
        //proprec.setFieldValue('custrecord17','');
        if(administrative_contact_email)
        proprec.setFieldValue('custrecord18',administrative_contact_email);
        else
        proprec.setFieldValue('custrecord18','');
        if(administrative_contact_phno)
        proprec.setFieldValue('custrecord19',administrative_contact_phno);
        else
        proprec.setFieldValue('custrecord19','');
        //if(sales_manager)
        //proprec.setFieldValue('custrecord28',sales_manager);
        //else
        //proprec.setFieldValue('custrecord28','');
        if(sales_manager_email)
        proprec.setFieldValue('custrecord_prop_sales_mgr_email',sales_manager_email);
        else
        proprec.setFieldValue('custrecord_prop_sales_mgr_email','');
        //if(division_manager)
        //proprec.setFieldValue('custrecord29',division_manager);
        //else
        //proprec.setFieldValue('custrecord29','');
        if(division_manager_email)
        proprec.setFieldValue('custrecordprop_division_mgr_email',division_manager_email);
        else
        proprec.setFieldValue('custrecordprop_division_mgr_email','');
        if(floorplan)
        proprec.setFieldValue('custrecord_floorplan',floorplan);
        else
        proprec.setFieldValue('custrecord_floorplan','');
        if(elevation)
        proprec.setFieldValue('custrecord_elevation',elevation);
        else
        proprec.setFieldValue('custrecord_elevation','');
        if(square_feet)
        proprec.setFieldValue('custrecord_square_feet',square_feet);
        else
        proprec.setFieldValue('custrecord_square_feet','');
        if(property_photos)
        proprec.setFieldValue('custrecord_property_photos',property_photos);
        else
        proprec.setFieldValue('custrecord_property_photos','');
        if(listing_notes)
        proprec.setFieldValue('custrecord_listing_notes',listing_notes);
        else
        proprec.setFieldValue('custrecord_listing_notes','');
        if(mls_no_reg1)
        proprec.setFieldValue('custrecord_mls_number_region1',mls_no_reg1);
        else
        proprec.setFieldValue('custrecord_mls_number_region1','');
        if(mls_no_reg2)
        proprec.setFieldValue('custrecord_mls_number_region2',mls_no_reg2);
        else
        proprec.setFieldValue('custrecord_mls_number_region2','');
      }


			proprec.setFieldValue('name', (proprec.getFieldText('custrecord31')) + ' ' +(proprec.getFieldValue('custrecord_house_number')) + ' (' +(proprec.getFieldText('custrecord_property_status')) + ') ' +(proprec.getFieldText('custrecordcustrecordsubdname')));
			proprec.setFieldValue('custrecord_simple_name', (proprec.getFieldValue('custrecord_house_number')) + ' ' +(proprec.getFieldText('custrecord31')))

      var recid = nlapiSubmitRecord(proprec,true,true);
      nlapiLogExecution('DEBUG','recid','recid  '+recid);
    //  var recagain = nlapiLoadRecord('customrecord_property_record',recid);
  //    var updatedid = nlapiSubmitRecord(recagain,true,true);
      //------------ add property changes record too------------
      //---------------------- end -----------------------------
      
      
      if(((exist_status == 2) && (status == 1)))
      {
        successForm1(recid);
      }
      else
      {
        successForm(recid);
      }
      
    }
    else if(request.getParameter('company_cust_hidden') == 'searchproperty')
    {
      
    }
  }
}
function createform()
{
  var form = nlapiCreateForm('Sale Status Change Form');
  form.addField('custpage_housenumber','select','Property','customrecord_property_record');
  //form.addField('custpage_housenumber','text','House Number');
  //form.addField('custpage_streetname','text','Street Name');
  form.addSubmitButton('Sale Status Change Form');
  form.addField('company_cust_hidden','text','Hidden').setDisplayType('hidden');
  form.setFieldValues({ company_cust_hidden:'searchproperty'});
    response.writePage( form );
}
function displaySecondPage(houseno, msg )
{
  var form = nlapiCreateForm('Property');
  if(msg)
  {
    form.addField('custpage_abhi_msg','inlinehtml').setDefaultValue('<font style="color:red">'+msg+'</font>');
  }
  form.addField('custpage_housenumber','select','Property','customrecord_property_record').setDisplayType('disabled');
  //form.addField('custpage_status','select','Status','customlist31');
  var selectnew = form.addField('custpage_status','select','Status');
  form.addField('custpage_oldstatus','select','Current Status','customlist31').setDisplayType('disabled');
  var status = nlapiLookupField('customrecord_property_record',houseno,'custrecord_property_status');
  //form.setFieldValues({custpage_housenumber:houseno,custpage_status:status,custpage_oldstatus:status});
  form.setFieldValues({custpage_housenumber:houseno,custpage_oldstatus:status});
  
  //var selectnew = form.addField('custpage_status_n','select','Status 2');
  if(status == 1 || status == '1')
  {
    //2, 8, 4, 7
    selectnew.addSelectOption(2,'Pending');
    selectnew.addSelectOption(8,'Pending (Awaiting Contract)');
    selectnew.addSelectOption(4,'Withdrawn');
    selectnew.addSelectOption(7,'Canceled');
  }
  if(status == 2 || status == '2')
  {
    //1,4,7,3
    selectnew.addSelectOption(1,'Available');
    selectnew.addSelectOption(4,'Withdrawn');
    selectnew.addSelectOption(7,'Canceled');
    selectnew.addSelectOption(3,'Closed');
  }
  if(status == 7 || status == '7')
  {
    //1
    selectnew.addSelectOption(1,'Available');
  }
  
  
  form.addSubmitButton('Proceed');
  response.writePage( form );
  
}
function displayresult(houseno,status,oldstatus)//, streetname)
{
  nlapiLogExecution('DEBUG','else 1','oldstatus  '+oldstatus+' status '+status);
  if((oldstatus == 1 ) && (status == 2))
  { 
    var filter=[];
    var column=[];
    
    filter[0]=new nlobjSearchFilter('isinactive',null,'is','F');
    filter[1]=new nlobjSearchFilter('internalid',null,'anyof',houseno);
    //filter[1]=new nlobjSearchFilter('custrecord_house_number',null,'is',houseno);
    //filter[2]=new nlobjSearchFilter('custrecord_street_text',null,'is',streetname);
    column[0]=new nlobjSearchColumn('internalid');
    var search=nlapiSearchRecord('customrecord_property_record',null,filter,column);
    if(search)
    {
      var internalid=search[0].getValue('internalid');  
      nlapiLogExecution('DEBUG','internalid','internalid  '+internalid);    
      var property=nlapiLoadRecord('customrecord_property_record',internalid);
      // ============= below are used for inline text =============
      var builderdivision = property.getFieldValue('custrecord12');
      var housenum = property.getFieldValue('custrecord_house_number');
      var streetnaam = property.getFieldValue('custrecord31');
      var subdivisionname = property.getFieldValue('custrecordcustrecordsubdname');
      var lotnumber = property.getFieldValue('custrecord_lot_number');
      // ===================== end of inline fields ===============
      
      //===================== below fields will change on dropdown change =======
      //var stat = property.getFieldValue('custrecord_property_status');
      var contractapprovaldate = property.getFieldValue('custrecord_contract_approval_date');
      var contractreceivefrombuilder = property.getFieldValue('custrecord_contract_received_date');
      var extimatedclosingdate = property.getFieldValue('custrecord_estimated_closing_date');
      var constructionStatusAtContract = property.getFieldValue('custrecord_construction_status_contract');
      var buyersName = property.getFieldValue('custrecord_buyers_last_name');
      
      var cooperativeRealEstateAgentName = property.getFieldValue('custrecord_real_estate_agent_name');
      var cooperativeRealEstateAgentIdMLS1 = property.getFieldValue('custrecord_real_estate_agent_id_region_1');
      var cooperativeRealEstateBrokerName = property.getFieldValue('custrecord_real_estate_broker_name');
      var cooperativeRealEstateBrokerIdMLS1 = property.getFieldValue('custrecord_real_estate_broker_id_mls1');
      
      var PendingNotificationDateMLSRegion1 = property.getFieldValue('custrecord_pending_date_mls_region1');
      var cooperativeRealEstateAgentIdMLS2 = property.getFieldValue('custrecord_real_estate_agent_id_region_2');
      var cooperativeRealEstateBrokerIdMLS2 = property.getFieldValue('custrecord_broker_office_id_mlsregion2');
      var PendingNotificationDateMLSRegion2 = property.getFieldValue('custrecord_pending_date_mls_region2');
      
      var purchaseContact = property.getFieldValue('custrecord_purchase_contract');
      var salesNotes = property.getFieldValue('custrecord_sale_notes');
      var salesNotificationAgentName = property.getFieldValue('custrecord_agent_name_sn');
      var salesNotificationBrokerName = property.getFieldValue(' custrecord_brokerage_name_sn');
      
      //var salesStatus = property.getFieldValue('custrecord_property_status');
      nlapiLogExecution('DEBUG','before form','before form  ');   
      var form = nlapiCreateForm('Property');
      form.setScript('customscript80');
      form.addField('custpage_builderdivision','select','Builder Division','customer').setDisplayType('disabled');
      
      form.addField('custpage_house_number','text','House Number').setDisplayType('disabled');
      
      form.addField('custpage_street_name','select','Street Name','customrecord_street_name').setDisplayType('disabled');
      
      form.addField('custpage_sub_division','select','Sub Division Name','customrecord_subdivision').setDisplayType('disabled');
      
      form.addField('custpage_lotnumber','text','Lot Number').setDisplayType('disabled');
      
      var select = form.addField('custpage_salesstatus','select','Sales Status').setDisplayType('disabled');
      select.addSelectOption('1', 'Available',true);
      select.addSelectOption('2', 'Pending');
      select.addSelectOption('3', 'Closed');
      select.addSelectOption('4', 'Withdrawn');
      select.addSelectOption('5', 'Expired');
      select.addSelectOption('6', 'Awaiting Entry Into MLS');
      select.addSelectOption('7', 'Canceled');
      select.addSelectOption('8', 'Pending (Awaiting Contract)');
      select.addSelectOption('9', 'Closed (Awaiting HUD)');
      select.addSelectOption('10', 'Sold/Canceled Before Listed');
      
      form.addField('custpage_contract_approval_date','date','Contract Approval Date');
      
      form.addField('custpage_contract_receive_from_builder','date','Contract Received From Builder');
      
      form.addField('custpage_estimated_closing_date','date','Estimated Closing Date');
      
      form.addField('custpage_construction_status_at_contract','select','Construction Status at Contract','customlist_construction_status');
      
      form.addField('custpage_buyer_name','text','Buyer Name');
      
      form.addField('custpage_cooperating_real_estate_agent_name','select','Cooperating Real Estate Agent Name','customrecord_agent');
      
      form.addField('custpage_cooperating_real_estate_agent_id1','text','Cooperating Real Estate Agent ID MLS 1');
      
      form.addField('custpage_cooperating_real_estate_broker_name','select','Cooperating Real Estate Broker Name','customrecordbrokerage');
      
      form.addField('custpage_cooperating_real_estate_broker_id1','text','Cooperating Real Estate Broker ID MLS 1');
      
      form.addField('custpage_pending_notification1','date','Pending Notification Date MLS Region 1');
      
      form.addField('custpage_cooperating_real_estate_agent_id2','text','Cooperating Real Estate Agent ID MLS 2');
      
      form.addField('custpage_cooperating_real_estate_broker_id2','text','Cooperating Real Estate Broker ID MLS 2');
      
      form.addField('custpage_pending_notification2','date','Pending Notification Date MLS Region 2');
      
      form.addField('custpage_purchase_contract','file','Purchase Contract');
      
      form.addField('custpage_sales_notes','textarea','Sale Notes');
      
      form.addField('custpage_sales_notification_agent_name','text','Sales Notification ­ Agent Name');
      
      form.addField('custpage_sales_notification_broker_name','text','Sales Notification ­ Brokerage Name');
      form.addField('custpage_internalid','text','internalid').setDisplayType('hidden');
      form.addSubmitButton('Submit');
      var script = "history.go(-2)";
          
       form.addButton('custombutton', 'Cancel', script);
      form.setFieldValues({ custpage_internalid:internalid,custpage_builderdivision:builderdivision,custpage_house_number:housenum,custpage_street_name:streetnaam,custpage_sub_division:subdivisionname,custpage_lotnumber:lotnumber,custpage_contract_approval_date:contractapprovaldate,custpage_contract_receive_from_builder:contractreceivefrombuilder,custpage_estimated_closing_date:extimatedclosingdate,custpage_construction_status_at_contract:constructionStatusAtContract,custpage_buyer_name:buyersName,custpage_cooperating_real_estate_agent_name:cooperativeRealEstateAgentName,custpage_cooperating_real_estate_agent_id1:cooperativeRealEstateAgentIdMLS1,custpage_cooperating_real_estate_broker_name:cooperativeRealEstateBrokerName,custpage_cooperating_real_estate_broker_id1:cooperativeRealEstateBrokerIdMLS1,custpage_pending_notification1:PendingNotificationDateMLSRegion1,custpage_cooperating_real_estate_agent_id2:cooperativeRealEstateAgentIdMLS2,custpage_cooperating_real_estate_broker_id2:cooperativeRealEstateBrokerIdMLS2,custpage_pending_notification2:PendingNotificationDateMLSRegion2,custpage_purchase_contract:purchaseContact,custpage_sales_notes:salesNotes,custpage_sales_notification_agent_name:salesNotificationAgentName,custpage_sales_notification_broker_name:salesNotificationBrokerName,custpage_salesstatus:status});
      //form.setFieldValues({ custpage_buyer_name:buyersName,custpage_cooperating_real_estate_agent_name:cooperativeRealEstateAgentName,custpage_cooperating_real_estate_agent_id1:cooperativeRealEstateAgentIdMLS1,custpage_cooperating_real_estate_broker_name:cooperativeRealEstateBrokerName,custpage_cooperating_real_estate_broker_id1:cooperativeRealEstateBrokerIdMLS1,custpage_pending_notification1:PendingNotificationDateMLSRegion1,custpage_cooperating_real_estate_agent_id2:cooperativeRealEstateAgentIdMLS2,custpage_cooperating_real_estate_broker_id2:cooperativeRealEstateBrokerIdMLS2,custpage_pending_notification2:PendingNotificationDateMLSRegion2});
      //form.setFieldValues({ custpage_purchase_contract:purchaseContact,custpage_sales_notes:salesNotes,custpage_sales_notification_agent_name:salesNotificationAgentName,custpage_sales_notification_broker_name:salesNotificationBrokerName});
      response.writePage( form );
      
    }
  }
  else if((oldstatus == 2 ) && (status == 1))
  { 
    var filter=[];
    var column=[];
    
    filter[0]=new nlobjSearchFilter('isinactive',null,'is','F');
    filter[1]=new nlobjSearchFilter('internalid',null,'anyof',houseno);
    //filter[1]=new nlobjSearchFilter('custrecord_house_number',null,'is',houseno);
    //filter[2]=new nlobjSearchFilter('custrecord_street_text',null,'is',streetname);
    column[0]=new nlobjSearchColumn('internalid');
    var search=nlapiSearchRecord('customrecord_property_record',null,filter,column);
    if(search)
    {
      var internalid=search[0].getValue('internalid');  
      nlapiLogExecution('DEBUG','internalid','internalid  '+internalid);    
      var property=nlapiLoadRecord('customrecord_property_record',internalid);
      var builderdivision = property.getFieldValue('custrecord12');
      var housenum = property.getFieldValue('custrecord_house_number');
      var streetnaam = property.getFieldValue('custrecord31');
      var subdivisionname = property.getFieldValue('custrecordcustrecordsubdname');
      var lotnumber = property.getFieldValue('custrecord_lot_number');
      
      var contractapprovaldate = property.getFieldValue('custrecord_contract_approval_date');
      var contractreceivefrombuilder = property.getFieldValue('custrecord_contract_received_date');
      var extimatedclosingdate = property.getFieldValue('custrecord_estimated_closing_date');
      var constructionStatusAtContract = property.getFieldValue('custrecord_construction_status_contract');
      var buyersName = property.getFieldValue('custrecord_buyers_last_name');
      
      var cooperativeRealEstateAgentName = property.getFieldValue('custrecord_real_estate_agent_name');
      var cooperativeRealEstateAgentIdMLS1 = property.getFieldValue('custrecord_real_estate_agent_id_region_1');
      var cooperativeRealEstateBrokerName = property.getFieldValue('custrecord_real_estate_broker_name');
      var cooperativeRealEstateBrokerIdMLS1 = property.getFieldValue('custrecord_real_estate_broker_id_mls1');
      
      var PendingNotificationDateMLSRegion1 = property.getFieldValue('custrecord_pending_date_mls_region1');
      var cooperativeRealEstateAgentIdMLS2 = property.getFieldValue('custrecord_real_estate_agent_id_region_2');
      var cooperativeRealEstateBrokerIdMLS2 = property.getFieldValue('custrecord_broker_office_id_mlsregion2');
      var PendingNotificationDateMLSRegion2 = property.getFieldValue('custrecord_pending_date_mls_region2');
      
      var purchaseContact = property.getFieldValue('custrecord_purchase_contract');
      var salesNotes = property.getFieldValue('custrecord_sale_notes');
      var salesNotificationAgentName = property.getFieldValue('custrecord_agent_name_sn');
      var salesNotificationBrokerName = property.getFieldValue(' custrecord_brokerage_name_sn');
      
      //var salesStatus = property.getFieldValue('custrecord_property_status');
      nlapiLogExecution('DEBUG','before form','before form  ');   
      var form = nlapiCreateForm('Property');
      form.setScript('customscript80');
      
      form.addField('custpage_builderdivision','select','Builder Division','customer').setDisplayType('disabled');
      
      form.addField('custpage_house_number','text','House Number').setDisplayType('disabled');
      
      form.addField('custpage_street_name','select','Street Name','customrecord_street_name').setDisplayType('disabled');
      
      form.addField('custpage_sub_division','select','Sub Division Name','customrecord_subdivision').setDisplayType('disabled');
      
      form.addField('custpage_lotnumber','text','Lot Number').setDisplayType('disabled');
      
      var select = form.addField('custpage_salesstatus','select','Sales Status').setDisplayType('disabled');
      select.addSelectOption('1', 'Available',true);
      select.addSelectOption('2', 'Pending');
      select.addSelectOption('3', 'Closed');
      select.addSelectOption('4', 'Withdrawn');
      select.addSelectOption('5', 'Expired');
      select.addSelectOption('6', 'Awaiting Entry Into MLS');
      select.addSelectOption('7', 'Canceled');
      select.addSelectOption('8', 'Pending (Awaiting Contract)');
      select.addSelectOption('9', 'Closed (Awaiting HUD)');
      select.addSelectOption('10', 'Sold/Canceled Before Listed');
      
      form.addField('custpage_internalid','text','internalid').setDisplayType('hidden');
      form.addSubmitButton('Submit');
      var script = "history.go(-2)";
          
       form.addButton('custombutton', 'Cancel', script);
      form.setFieldValues({ custpage_internalid:internalid,custpage_builderdivision:builderdivision,custpage_house_number:housenum,custpage_street_name:streetnaam,custpage_sub_division:subdivisionname,custpage_lotnumber:lotnumber,custpage_salesstatus:status});
      //form.setFieldValues({ custpage_buyer_name:buyersName,custpage_cooperating_real_estate_agent_name:cooperativeRealEstateAgentName,custpage_cooperating_real_estate_agent_id1:cooperativeRealEstateAgentIdMLS1,custpage_cooperating_real_estate_broker_name:cooperativeRealEstateBrokerName,custpage_cooperating_real_estate_broker_id1:cooperativeRealEstateBrokerIdMLS1,custpage_pending_notification1:PendingNotificationDateMLSRegion1,custpage_cooperating_real_estate_agent_id2:cooperativeRealEstateAgentIdMLS2,custpage_cooperating_real_estate_broker_id2:cooperativeRealEstateBrokerIdMLS2,custpage_pending_notification2:PendingNotificationDateMLSRegion2});
      //form.setFieldValues({ custpage_purchase_contract:purchaseContact,custpage_sales_notes:salesNotes,custpage_sales_notification_agent_name:salesNotificationAgentName,custpage_sales_notification_broker_name:salesNotificationBrokerName});
      response.writePage( form );
      
    }
  }
  else if((oldstatus == 1) && (status == 8))
  {
    var filter=[];
    var column=[];
    
    filter[0]=new nlobjSearchFilter('isinactive',null,'is','F');
    filter[1]=new nlobjSearchFilter('internalid',null,'anyof',houseno);
    //filter[1]=new nlobjSearchFilter('custrecord_house_number',null,'is',houseno);
    //filter[2]=new nlobjSearchFilter('custrecord_street_text',null,'is',streetname);
    column[0]=new nlobjSearchColumn('internalid');
    var search=nlapiSearchRecord('customrecord_property_record',null,filter,column);
    if(search)
    {
      var internalid=search[0].getValue('internalid');  
      nlapiLogExecution('DEBUG','internalid','internalid  '+internalid);    
      var property=nlapiLoadRecord('customrecord_property_record',internalid);
      // ============= below are used for inline text =============
      var builderdivision = property.getFieldValue('custrecord12');
      var housenum = property.getFieldValue('custrecord_house_number');
      var streetnaam = property.getFieldValue('custrecord31');
      var subdivisionname = property.getFieldValue('custrecordcustrecordsubdname');
      var lotnumber = property.getFieldValue('custrecord_lot_number');
      // ===================== end of inline fields ===============
      
      //===================== below fields will change on dropdown change =======
      //var stat = property.getFieldValue('custrecord_property_status');
      var contractapprovaldate = property.getFieldValue('custrecord_contract_approval_date');
      var contractreceivefrombuilder = property.getFieldValue('custrecord_contract_received_date');
      var extimatedclosingdate = property.getFieldValue('custrecord_estimated_closing_date');
      var constructionStatusAtContract = property.getFieldValue('custrecord_construction_status_contract');
      var buyersName = property.getFieldValue('custrecord_buyers_last_name');
      
      var cooperativeRealEstateAgentName = property.getFieldValue('custrecord_real_estate_agent_name');
      var cooperativeRealEstateAgentIdMLS1 = property.getFieldValue('custrecord_real_estate_agent_id_region_1');
      var cooperativeRealEstateBrokerName = property.getFieldValue('custrecord_real_estate_broker_name');
      var cooperativeRealEstateBrokerIdMLS1 = property.getFieldValue('custrecord_real_estate_broker_id_mls1');
      
      var PendingNotificationDateMLSRegion1 = property.getFieldValue('custrecord_pending_date_mls_region1');
      var cooperativeRealEstateAgentIdMLS2 = property.getFieldValue('custrecord_real_estate_agent_id_region_2');
      var cooperativeRealEstateBrokerIdMLS2 = property.getFieldValue('custrecord_broker_office_id_mlsregion2');
      var PendingNotificationDateMLSRegion2 = property.getFieldValue('custrecord_pending_date_mls_region2');
      
      var purchaseContact = property.getFieldValue('custrecord_purchase_contract');
      var salesNotes = property.getFieldValue('custrecord_sale_notes');
      var salesNotificationAgentName = property.getFieldValue('custrecord_agent_name_sn');
      var salesNotificationBrokerName = property.getFieldValue(' custrecord_brokerage_name_sn');
      
      //var salesStatus = property.getFieldValue('custrecord_property_status');
      nlapiLogExecution('DEBUG','before form','before form  ');   
      var form = nlapiCreateForm('Property');
      form.setScript('customscript80');
      form.addField('custpage_builderdivision','select','Builder Division','customer').setDisplayType('disabled');
      
      form.addField('custpage_house_number','text','House Number').setDisplayType('disabled');
      
      form.addField('custpage_street_name','select','Street Name','customrecord_street_name').setDisplayType('disabled');
      
      form.addField('custpage_sub_division','select','Sub Division Name','customrecord_subdivision').setDisplayType('disabled');
      
      form.addField('custpage_lotnumber','text','Lot Number').setDisplayType('disabled');
      var select = form.addField('custpage_salesstatus','select','Sales Status').setDisplayType('disabled');
      select.addSelectOption('1', 'Available',true);
      select.addSelectOption('2', 'Pending');
      select.addSelectOption('3', 'Closed');
      select.addSelectOption('4', 'Withdrawn');
      select.addSelectOption('5', 'Expired');
      select.addSelectOption('6', 'Awaiting Entry Into MLS');
      select.addSelectOption('7', 'Canceled');
      select.addSelectOption('8', 'Pending (Awaiting Contract)');
      select.addSelectOption('9', 'Closed (Awaiting HUD)');
      select.addSelectOption('10', 'Sold/Canceled Before Listed');
      
      
      form.addField('custpage_internalid','text','internalid').setDisplayType('hidden');
      form.addSubmitButton('Submit');
      var script = "history.go(-2)";
          
       form.addButton('custombutton', 'Cancel', script);
      form.setFieldValues({ custpage_internalid:internalid,custpage_builderdivision:builderdivision,custpage_house_number:housenum,custpage_street_name:streetnaam,custpage_sub_division:subdivisionname,custpage_lotnumber:lotnumber,custpage_salesstatus:status});
      //form.setFieldValues({ custpage_buyer_name:buyersName,custpage_cooperating_real_estate_agent_name:cooperativeRealEstateAgentName,custpage_cooperating_real_estate_agent_id1:cooperativeRealEstateAgentIdMLS1,custpage_cooperating_real_estate_broker_name:cooperativeRealEstateBrokerName,custpage_cooperating_real_estate_broker_id1:cooperativeRealEstateBrokerIdMLS1,custpage_pending_notification1:PendingNotificationDateMLSRegion1,custpage_cooperating_real_estate_agent_id2:cooperativeRealEstateAgentIdMLS2,custpage_cooperating_real_estate_broker_id2:cooperativeRealEstateBrokerIdMLS2,custpage_pending_notification2:PendingNotificationDateMLSRegion2});
      //form.setFieldValues({ custpage_purchase_contract:purchaseContact,custpage_sales_notes:salesNotes,custpage_sales_notification_agent_name:salesNotificationAgentName,custpage_sales_notification_broker_name:salesNotificationBrokerName});
      response.writePage( form );
      
    }
  }
  else if((oldstatus == 1 || oldstatus == 2) && (status == 4 || status == 7))
  {
    var filter=[];
    var column=[];
    
    filter[0]=new nlobjSearchFilter('isinactive',null,'is','F');
    filter[1]=new nlobjSearchFilter('internalid',null,'anyof',houseno);
    //filter[1]=new nlobjSearchFilter('custrecord_house_number',null,'is',houseno);
    //filter[2]=new nlobjSearchFilter('custrecord_street_text',null,'is',streetname);
    column[0]=new nlobjSearchColumn('internalid');
    var search=nlapiSearchRecord('customrecord_property_record',null,filter,column);
    if(search)
    {
      var internalid=search[0].getValue('internalid');  
      nlapiLogExecution('DEBUG','internalid','internalid  '+internalid);    
      var property=nlapiLoadRecord('customrecord_property_record',internalid);
      // ============= below are used for inline text =============
      var builderdivision = property.getFieldValue('custrecord12');
      var housenum = property.getFieldValue('custrecord_house_number');
      var streetnaam = property.getFieldValue('custrecord31');
      var subdivisionname = property.getFieldValue('custrecordcustrecordsubdname');
      var lotnumber = property.getFieldValue('custrecord_lot_number');
      var listing_notes = property.getFieldValue('custrecord_listing_notes');
      // ===================== end of inline fields ===============
      
      //===================== below fields will change on dropdown change =======
      //var stat = property.getFieldValue('custrecord_property_status');
      var contractapprovaldate = property.getFieldValue('custrecord_contract_approval_date');
      var contractreceivefrombuilder = property.getFieldValue('custrecord_contract_received_date');
      var extimatedclosingdate = property.getFieldValue('custrecord_estimated_closing_date');
      var constructionStatusAtContract = property.getFieldValue('custrecord_construction_status_contract');
      var buyersName = property.getFieldValue('custrecord_buyers_last_name');
      
      var cooperativeRealEstateAgentName = property.getFieldValue('custrecord_real_estate_agent_name');
      var cooperativeRealEstateAgentIdMLS1 = property.getFieldValue('custrecord_real_estate_agent_id_region_1');
      var cooperativeRealEstateBrokerName = property.getFieldValue('custrecord_real_estate_broker_name');
      var cooperativeRealEstateBrokerIdMLS1 = property.getFieldValue('custrecord_real_estate_broker_id_mls1');
      
      var PendingNotificationDateMLSRegion1 = property.getFieldValue('custrecord_pending_date_mls_region1');
      var cooperativeRealEstateAgentIdMLS2 = property.getFieldValue('custrecord_real_estate_agent_id_region_2');
      var cooperativeRealEstateBrokerIdMLS2 = property.getFieldValue('custrecord_broker_office_id_mlsregion2');
      var PendingNotificationDateMLSRegion2 = property.getFieldValue('custrecord_pending_date_mls_region2');
      
      var purchaseContact = property.getFieldValue('custrecord_purchase_contract');
      var salesNotes = property.getFieldValue('custrecord_sale_notes');
      var salesNotificationAgentName = property.getFieldValue('custrecord_agent_name_sn');
      var salesNotificationBrokerName = property.getFieldValue(' custrecord_brokerage_name_sn');
      
      //var salesStatus = property.getFieldValue('custrecord_property_status');
      nlapiLogExecution('DEBUG','before form','before form  ');   
      var form = nlapiCreateForm('Property');
      form.setScript('customscript80');
      form.addField('custpage_builderdivision','select','Builder Division','customer').setDisplayType('disabled');
      
      form.addField('custpage_house_number','text','House Number').setDisplayType('disabled');
      
      form.addField('custpage_street_name','select','Street Name','customrecord_street_name').setDisplayType('disabled');
      
      form.addField('custpage_sub_division','select','Sub Division Name','customrecord_subdivision').setDisplayType('disabled');
      
      form.addField('custpage_lotnumber','text','Lot Number').setDisplayType('disabled');
      var select = form.addField('custpage_salesstatus','select','Sales Status').setDisplayType('disabled');
      select.addSelectOption('1', 'Available',true);
      select.addSelectOption('2', 'Pending');
      select.addSelectOption('3', 'Closed');
      select.addSelectOption('4', 'Withdrawn');
      select.addSelectOption('5', 'Expired');
      select.addSelectOption('6', 'Awaiting Entry Into MLS');
      select.addSelectOption('7', 'Canceled');
      select.addSelectOption('8', 'Pending (Awaiting Contract)');
      select.addSelectOption('9', 'Closed (Awaiting HUD)');
      select.addSelectOption('10', 'Sold/Canceled Before Listed');
      
      form.addField('custpage_listing_notes','text','Reason for Cancellation/Withdrawal');//.setDisplayType('disabled')
      
      
      form.addField('custpage_internalid','text','internalid').setDisplayType('hidden');
      form.addSubmitButton('Submit');
      var script = "history.go(-2)";
          
       form.addButton('custombutton', 'Cancel', script);
      form.setFieldValues({ custpage_internalid:internalid,custpage_builderdivision:builderdivision,custpage_house_number:housenum,custpage_street_name:streetnaam,custpage_sub_division:subdivisionname,custpage_lotnumber:lotnumber,custpage_salesstatus:status,custpage_reason_cancel:listing_notes});
      //form.setFieldValues({ custpage_buyer_name:buyersName,custpage_cooperating_real_estate_agent_name:cooperativeRealEstateAgentName,custpage_cooperating_real_estate_agent_id1:cooperativeRealEstateAgentIdMLS1,custpage_cooperating_real_estate_broker_name:cooperativeRealEstateBrokerName,custpage_cooperating_real_estate_broker_id1:cooperativeRealEstateBrokerIdMLS1,custpage_pending_notification1:PendingNotificationDateMLSRegion1,custpage_cooperating_real_estate_agent_id2:cooperativeRealEstateAgentIdMLS2,custpage_cooperating_real_estate_broker_id2:cooperativeRealEstateBrokerIdMLS2,custpage_pending_notification2:PendingNotificationDateMLSRegion2});
      //form.setFieldValues({ custpage_purchase_contract:purchaseContact,custpage_sales_notes:salesNotes,custpage_sales_notification_agent_name:salesNotificationAgentName,custpage_sales_notification_broker_name:salesNotificationBrokerName});
      response.writePage( form );
      
    }
  }
  else if((oldstatus == 2) && (status == 3))
  {
    var filter=[];
    var column=[];
    
    filter[0]=new nlobjSearchFilter('isinactive',null,'is','F');
    filter[1]=new nlobjSearchFilter('internalid',null,'anyof',houseno);
    //filter[1]=new nlobjSearchFilter('custrecord_house_number',null,'is',houseno);
    //filter[2]=new nlobjSearchFilter('custrecord_street_text',null,'is',streetname);
    column[0]=new nlobjSearchColumn('internalid');
    var search=nlapiSearchRecord('customrecord_property_record',null,filter,column);
    if(search)
    {
      var internalid=search[0].getValue('internalid');  
      nlapiLogExecution('DEBUG','internalid','internalid  '+internalid);    
      var property=nlapiLoadRecord('customrecord_property_record',internalid);
      // ============= below are used for inline text =============
      var actual_closing_date = property.getFieldValue('custrecord_actual_closing_date');
      var closing_price = property.getFieldValue('custrecord50');
      var loan_amount = property.getFieldValue('custrecord_loan_amount');
      var financing_type = property.getFieldValue('custrecord_financing_type');
      var closing_notify_date1 = property.getFieldValue('custrecord_closing_date_mls_region1');
      var closing_notify_date2 = property.getFieldValue('custrecord_closing_date_mls_region2');
      var hud1 = property.getFieldValue('custrecord_hud1');
      var hud_rcvd_date = property.getFieldValue('custrecord_hud_received_date');
      var closing_notes = property.getFieldValue('custrecord_closing_notes');
      var resend_closing_notif = property.getFieldValue('custrecord_resend_closing_notification');
      // ===================== end of inline fields ===============
      
      //var salesStatus = property.getFieldValue('custrecord_property_status');
      nlapiLogExecution('DEBUG','before form','before form  ');   
      var form = nlapiCreateForm('Property');
      form.setScript('customscript80');
      
      var select = form.addField('custpage_salesstatus','select','Sales Status').setDisplayType('hidden');
      select.addSelectOption('1', 'Available',true);
      select.addSelectOption('2', 'Pending');
      select.addSelectOption('3', 'Closed');
      select.addSelectOption('4', 'Withdrawn');
      select.addSelectOption('5', 'Expired');
      select.addSelectOption('6', 'Awaiting Entry Into MLS');
      select.addSelectOption('7', 'Canceled');
      select.addSelectOption('8', 'Pending (Awaiting Contract)');
      select.addSelectOption('9', 'Closed (Awaiting HUD)');
      select.addSelectOption('10', 'Sold/Canceled Before Listed');
      form.addField('custpage_actual_closing_date','date','Actual Closing Date');
      
      form.addField('custpage_closing_price','currency','Closing Price');
      
      form.addField('custpage_loan_amount','currency','Loan Amount');
      
      form.addField('custpage_financing_type','select','Financing Type','customlist_financing_type');
      
      form.addField('custpage_closing_notify_date1','date','Closing Notification Date MLS Region 1');
      
      form.addField('custpage_closing_notify_date2','date','Closing Notification Date MLS Region 2');
      
      form.addField('custpage_hud1','file','HUD1');
      
      form.addField('custpage_hud_rcvd_date','date','HUD Received Date');
      
      form.addField('custpage_closing_notes','longtext','Closing Notes');
      
      form.addField('custpage_resend_closing_notif','date','Resend Closing Notification');
      
      form.addField('custpage_internalid','text','internalid').setDisplayType('hidden'); 
      form.addSubmitButton('Submit');
      var script = "history.go(-2)";
          
       form.addButton('custombutton', 'Cancel', script);
      form.setFieldValues({ custpage_internalid:internalid,custpage_resend_closing_notif:resend_closing_notif,custpage_closing_notes:closing_notes,custpage_hud_rcvd_date:hud_rcvd_date,custpage_hud1:hud1,custpage_closing_notify_date2:closing_notify_date2,custpage_closing_notify_date1:closing_notify_date1,custpage_financing_type:financing_type,custpage_loan_amount:loan_amount,custpage_closing_price:closing_price,custpage_actual_closing_date:actual_closing_date,custpage_salesstatus:status});
      //form.setFieldValues({ custpage_buyer_name:buyersName,custpage_cooperating_real_estate_agent_name:cooperativeRealEstateAgentName,custpage_cooperating_real_estate_agent_id1:cooperativeRealEstateAgentIdMLS1,custpage_cooperating_real_estate_broker_name:cooperativeRealEstateBrokerName,custpage_cooperating_real_estate_broker_id1:cooperativeRealEstateBrokerIdMLS1,custpage_pending_notification1:PendingNotificationDateMLSRegion1,custpage_cooperating_real_estate_agent_id2:cooperativeRealEstateAgentIdMLS2,custpage_cooperating_real_estate_broker_id2:cooperativeRealEstateBrokerIdMLS2,custpage_pending_notification2:PendingNotificationDateMLSRegion2});
      //form.setFieldValues({ custpage_purchase_contract:purchaseContact,custpage_sales_notes:salesNotes,custpage_sales_notification_agent_name:salesNotificationAgentName,custpage_sales_notification_broker_name:salesNotificationBrokerName});
      response.writePage( form );
      
    }
  }
  else if((oldstatus == 7) && (status == 1))
  {
    var filter=[];
    var column=[];
    
    filter[0]=new nlobjSearchFilter('isinactive',null,'is','F');
    filter[1]=new nlobjSearchFilter('internalid',null,'anyof',houseno);
    //filter[1]=new nlobjSearchFilter('custrecord_house_number',null,'is',houseno);
    //filter[2]=new nlobjSearchFilter('custrecord_street_text',null,'is',streetname);
    column[0]=new nlobjSearchColumn('internalid');
    var search=nlapiSearchRecord('customrecord_property_record',null,filter,column);
    if(search)
    {
      var internalid=search[0].getValue('internalid');  
      nlapiLogExecution('DEBUG','internalid','internalid  '+internalid);    
      var property=nlapiLoadRecord('customrecord_property_record',internalid);
      // ============= below are used for inline text =============
      var original_list_price = property.getFieldValue('custrecord_original_listing_price');
      var construction_status_list = property.getFieldValue('custrecord_construction_status_listing');
      var list_date = property.getFieldValue('custrecord_list_date');
      var estimate_roof_date = property.getFieldValue('custrecord_estimated_under_roof_date');
      var estimate_completion_date = property.getFieldValue('custrecord_estimated_completion_date');
      var current_list_price = property.getFieldValue('custrecord_current_list_price');
      var current_cnsrtction_status = property.getFieldValue('custrecord_current_construction');
      var last_const_update = property.getFieldValue('custrecord_property_date_const_update');
      var mls_region1 = property.getFieldValue('custrecord15');
      var list_notify_mls_region1 = property.getFieldValue('custrecord_listing_date_mls_region1');
      var mls_region2 = property.getFieldValue('custrecord16');
      var list_notify_mls_region2 = property.getFieldValue('custrecord_listing_date_mls_region2');
      var expiration_date = property.getFieldValue('custrecord_expiration_date');
      var administrative_contact = property.getFieldValue('custrecord17');
      var administrative_contact_email = property.getFieldValue('custrecord18');
      var administrative_contact_phno = property.getFieldValue('custrecord19');
      var sales_manager = property.getFieldValue('custrecord28');
      var sales_manager_email = property.getFieldValue('custrecord_prop_sales_mgr_email');
      var division_manager = property.getFieldValue('custrecord29');
      var division_manager_email = property.getFieldValue('custrecordprop_division_mgr_email');
      var floorplan = property.getFieldValue('custrecord_floorplan');
      var elevation = property.getFieldValue('custrecord_elevation');
      var square_feet = property.getFieldValue('custrecord_square_feet');
      var property_photos = property.getFieldValue('custrecord_property_photos');
      var listing_notes = property.getFieldValue('custrecord_listing_notes');
      
      var mls_no_reg1 = property.getFieldValue('custrecord_mls_number_region1');
      var mls_no_reg2 = property.getFieldValue('custrecord_mls_number_region2');
      // ===================== end of inline fields ===============
      
      //var salesStatus = property.getFieldValue('custrecord_property_status');
      nlapiLogExecution('DEBUG','before form','before form  ');   
      var form = nlapiCreateForm('Property');
      form.setScript('customscript80');
      form.addField('custpage_builderdivision','select','Builder Division','customer').setDisplayType('disabled');
      
      form.addField('custpage_house_number','text','House Number').setDisplayType('disabled');
      
      form.addField('custpage_street_name','select','Street Name','customrecord_street_name').setDisplayType('disabled');
      
      form.addField('custpage_sub_division','select','Sub Division Name','customrecord_subdivision').setDisplayType('disabled');
      
      form.addField('custpage_lotnumber','text','Lot Number').setDisplayType('disabled');
      var select = form.addField('custpage_salesstatus','select','Sales Status').setDisplayType('disabled');
      select.addSelectOption('1', 'Available',true);
      select.addSelectOption('2', 'Pending');
      select.addSelectOption('3', 'Closed');
      select.addSelectOption('4', 'Withdrawn');
      select.addSelectOption('5', 'Expired');
      select.addSelectOption('6', 'Awaiting Entry Into MLS');
      select.addSelectOption('7', 'Canceled');
      select.addSelectOption('8', 'Pending (Awaiting Contract)');
      select.addSelectOption('9', 'Closed (Awaiting HUD)');
      select.addSelectOption('10', 'Sold/Canceled Before Listed');
      
      form.addField('custpage_original_list_price','currency','Original List Price');
      
      form.addField('custpage_construction_status_list','select','Construction Status at Listing','customlist_construction_status');
      
      form.addField('custpage_list_date','date','List Date');
      
      form.addField('custpage_estimate_roof_date','date','Estimated Under Roof Date');
      
      form.addField('custpage_estimate_completion_date','date','Estimated Completion Date');
      
      form.addField('custpage_current_list_price','currency','Current List Price');
      
      form.addField('custpage_current_cnsrtction_status','select','Current Construction Status','customlist_construction_status');
      
      form.addField('custpage_last_const_update','date','Date of Last Construction Update');
      
      form.addField('custpage_mls_region1','select','MLS Region 1','customrecord_mls_region');
      
      form.addField('custpage_list_notify_mls_region1','date','Listing Notification Date MLS Region 1');
      
      form.addField('custpage_mls_region2','select','MLS Region 2','customrecord_mls_region');
      
      form.addField('custpage_list_notify_mls_region2','date','Listing Notification Date MLS Region 2');
      
      form.addField('custpage_expiration_date','date','Expiration Date');
      
      //form.addField('custpage_administrative_contact','select','Administrative Contact','');Builder Personnel
      
      form.addField('custpage_administrative_contact_email','email','Administrative Contact\'s Email');
      
      form.addField('custpage_administrative_contact_phno','phone','Administrative Contact\'s Phone Number');
      
      //form.addField('custpage_sales_manager','select','Sales Manager','');Builder Personnel
      
      form.addField('custpage_sales_manager_email','email','Sales Manager Email');
      
      //form.addField('custpage_division_manager','select','Division Manager','');Builder Personnel
      
      form.addField('custpage_division_manager_email','email','Division Manager Email');
      
      form.addField('custpage_floorplan','select','Floorplan','customlist_floorplanlist');
      
      form.addField('custpage_elevation','text','Elevation');
      
      form.addField('custpage_square_feet','integer','Square Feet');
      
      form.addField('custpage_property_photos','url','Property Photos');
      
      form.addField('custpage_listing_notes','longtext','Listing Notes');
      
      form.addField('custpage_mls_no_reg1','text','MLS Number - Region 1');
      
      form.addField('custpage_mls_no_reg2','text','MLS Number - Region 2');
      
      form.addField('custpage_internalid','text','internalid').setDisplayType('hidden'); 
      form.addSubmitButton('Submit');
      var script = "history.go(-2)";
          
       form.addButton('custombutton', 'Cancel', script);
      form.setFieldValues({ custpage_internalid:internalid,custpage_listing_notes:listing_notes,custpage_property_photos:property_photos,custpage_square_feet:square_feet,custpage_elevation:elevation,custpage_floorplan:floorplan,custpage_division_manager_email:division_manager_email,custpage_sales_manager_email:sales_manager_email,custpage_administrative_contact_phno:administrative_contact_phno,custpage_administrative_contact_email:administrative_contact_email,custpage_expiration_date:expiration_date,custpage_list_notify_mls_region2:list_notify_mls_region2,custpage_mls_region2:mls_region2,custpage_list_notify_mls_region1:list_notify_mls_region1,custpage_mls_region1:mls_region1,custpage_last_const_update:last_const_update,custpage_current_cnsrtction_status:current_cnsrtction_status,custpage_current_list_price:current_list_price,custpage_estimate_completion_date:estimate_completion_date,custpage_estimate_roof_date:estimate_roof_date,custpage_list_date:list_date,custpage_construction_status_list:construction_status_list,custpage_original_list_price:original_list_price,custpage_mls_no_reg1:mls_no_reg1,custpage_mls_no_reg2:mls_no_reg2});
      
      //form.setFieldValues({ custpage_buyer_name:buyersName,custpage_cooperating_real_estate_agent_name:cooperativeRealEstateAgentName,custpage_cooperating_real_estate_agent_id1:cooperativeRealEstateAgentIdMLS1,custpage_cooperating_real_estate_broker_name:cooperativeRealEstateBrokerName,custpage_cooperating_real_estate_broker_id1:cooperativeRealEstateBrokerIdMLS1,custpage_pending_notification1:PendingNotificationDateMLSRegion1,custpage_cooperating_real_estate_agent_id2:cooperativeRealEstateAgentIdMLS2,custpage_cooperating_real_estate_broker_id2:cooperativeRealEstateBrokerIdMLS2,custpage_pending_notification2:PendingNotificationDateMLSRegion2});
      //form.setFieldValues({ custpage_purchase_contract:purchaseContact,custpage_sales_notes:salesNotes,custpage_sales_notification_agent_name:salesNotificationAgentName,custpage_sales_notification_broker_name:salesNotificationBrokerName});
      response.writePage( form );
      
    }
  }
  else
  {
    //nlapiLogExecution('DEBUG','else','recid  '+recid);//redirect to the suitelet again.
    var param = {};
    param['houseno'] = houseno; 
    param['msg'] = 'this change is not allowed.'; 
    nlapiSetRedirectURL('SUITELET','customscript_search_property_suitlet','customdeploy1', false, param);
  }
}

function successForm(id)
{
  var form = nlapiCreateForm("Success...");
  //form.setScript(42);
  
  var success=form.addField('success', 'text', 'Property Successfully Updated.',null);
    success.setDisplayType('inline');
    //form.addSubmitButton('OK');
  var url = 'https://1309901.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=18&id='+id;
     
  form.addButton('custpage_ok', 'OK', 'window.open(\''+url+'\',\'_self\')');
  response.writePage(form);
}

function successForm1(id)
{
  var form = nlapiCreateForm("Success...");
  //form.setScript(42);
  
  var success=form.addField('success', 'text', 'The property has been changed from Pending to Available.',null);
    success.setDisplayType('inline');
    var url = 'https://1309901.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=18id='+id;
     
  form.addButton('custpage_ok', 'OK', 'window.open(\''+url+'\',\'_self\')');
  response.writePage(form);
}

function searchPropertyUE(type, form, request)
{
  try
  {
    if(type == 'view')
    {
      //getting internalid of current opp rec
      var recid = nlapiGetRecordId();
      //suitelet deployment url for sending id to suitelet
      var url = 'https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=77&deploy=1&compid=1309901&houseno='+recid;
      //sending current rec to suitelet urlk
      //url = url+'&estid='+recid;
      //dipslaying button and logic to transfer to suitelet when clicked on button
      form.addButton('custpage_search_prop', 'Sale Status Change Form...', 'window.open(\''+url+'\',\'_blank\')');
    }
  }
  catch(e)
  {
  }
}