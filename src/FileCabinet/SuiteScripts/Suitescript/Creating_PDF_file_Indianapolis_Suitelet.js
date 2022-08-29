/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Jul 2018     Vikash Singh
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

var notApplicable = "N/A";
var noExceptions = "No Exceptions";

function suitelet(request, response){
	
	var propertyID = request.getParameter("propertyID")
	
	var loadpropertyRecord = nlapiLoadRecord("customrecord_property_record", propertyID);
	
			var builderID = loadpropertyRecord.getFieldValue("custrecord12");
			var list_date = loadpropertyRecord.getFieldValue("custrecord_list_date");
			var house_number = loadpropertyRecord.getFieldValue("custrecord_house_number");
			var record31 = loadpropertyRecord.getFieldText("custrecord31");
			var record10 = loadpropertyRecord.getFieldText("custrecord10");
			var city = loadpropertyRecord.getFieldValue("custrecord_city");
			var zip_code = loadpropertyRecord.getFieldValue("custrecord_zip_code");
			var expiring_date = loadpropertyRecord.getFieldValue("custrecord_expiration_date");
			var listing_prise = loadpropertyRecord.getFieldValue("custrecord_original_listing_price");
			var commission_percent = loadpropertyRecord.getFieldValue("custrecord_commission_percent");
			var commission = loadpropertyRecord.getFieldValue("custrecord_commission");
			
		
	var imageNumber = nlapiLookupField("customer", builderID, "custentity_signature_attachment");
	var fileDetail = nlapiLoadFile(imageNumber);
	fileDetail = fileDetail.getURL();
	fileDetail = nlapiEscapeXML(fileDetail);

	var myvar = "<?xml version=\"1.0\"?><!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\"><pdfset><pdf>"+
	'<head>'+
	//'      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>'+
	'      <title>Listing Contract (Exclusive Right To Sell) - 2005</title>'+
	'      <meta name="author" content="Jeff McDonald"/>'+
	'  <style>'+
	'.under-line {'+
	'    width: 200px;'+
	'    display: inline-block;'+
	'    border-bottom: 1px solid #000; text-align:center;'+
	'}'+
	'span.under-line2 {'+
	'    width: 40%;'+
	'    display: inline-block;'+
	'    border-bottom: 1px solid; text-align:center;'+
	'}'+
	'span.under-line3 {'+
	'    width: 60%;'+
	'    display: inline-block;'+
	'    border-bottom: 1px solid; text-align:center;'+
	'}'+
	'span.under-line4 {'+
	'    width: 460px;'+
	'    display: inline-block;'+
	'}'+
	'.line20{width: 70px;'+
	'    display: inline-block;'+
	'    border-bottom: 1px solid; text-align:center;}'+
	'span.box-x {'+
	'    width: 15px;'+
	'    height: 15px;'+
	'    border: 1px solid #000;'+
	'    display: inline-block;'+
	'    text-align: center;'+
	'}'+
	'.line150{width: 230px;'+
	'    display: inline-block;'+
	'    border-bottom: 1px solid; text-align:center;}'+
	'	.line150a{width: 230px;'+
	'    display: inline-block;'+
	'    }'+
	'	.right{'+
	'	 text-align:right;'+
	'	}'+
	'</style>'+
	'   </head>'+
	'   <body>'+
	'       <h1 style="width:100%; text-align: center;  font-size: 16px;">LISTING CONTRACT <br/>(EXCLUSIVE RIGHT TO SELL)</h1>'+
	'	   <table style="border-collapse: collapse; width: 100%; font-size:11px;">'+
	'	       <tr>'+
	'		       <td style="width:5%; text-align:center;">1</td>'+
	'		       <td>'+
	'			      <table>'+
	'				      <tr>'+
	'					      <td style="width:40px;">Date:</td>'+
	'					      <td align="center" style="width:250px; border-bottom:1px solid #000;">'+list_date+'</td>'+
	'					  </tr>'+
	'				  </table> '+
	'			   </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">2</td>'+
	'		       <td></td>'+
	'		   </tr>'+
	'	       <tr>'+
	'		       <td style="width:5%; text-align:center;">3</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'					      <td>In consideration of services to be performed by</td>'+
	'					      <td align="center" style="width:350px; border-bottom:1px solid #000;">HMS Real Estate, LLC</td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'             </tr>'+
	'	       <tr>'+
	'		       <td style="width:5%; text-align:center;">4</td>'+
	'			   <td>'+
	'                  <table>'+
	'				      <tr>'+
	'					      <td>(Broker/Company, hereinafter referred to as "Broker") for</td>'+
	'					      <td style="width:275px; border-bottom:1px solid #000;"></td>'+
	'					  </tr>'+
	'				  </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">5</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'					      <td style="width:550px; border-bottom:1px solid #000;"></td>'+
	'					      <td>("Seller"),</td>'+
	'					  </tr>'+
	'				  </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">6</td>'+
	'			   <td>Seller appoints Broker as Seller\'s broker with irrevocable and exclusive right to sell, exchange, option, or lease the real property</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">7</td>'+
	'			   <td>'+
	'                  <table>'+
	'				      <tr>'+
	'					      <td>known as</td>'+
	'					      <td  align="center" style="width:250px; border-bottom:1px solid #000;">'+house_number+" "+record31+'</td>'+
	'                          <td>in</td>'+
	'                          <td style="width:250px; border-bottom:1px solid #000;"></td>'+
	'                          <td>Township ,</td>'+
	'					  </tr>'+
	'				  </table>'+
	'               </td>'+
	'		   </tr>'+
	'		 <tr>'+
	'		<td style="width:5%; text-align:center;">8</td>'+
	'	   <td>'+
	'       <table>'+
	'		      <tr>'+
	'			      <td align="center" style="width:170px; border-bottom:1px solid #000;">'+record10+'</td>'+
	'               <td>County,</td>'+
	'               <td align="center" style="width:190px; border-bottom:1px solid #000;">'+city+'</td>'+
	'               <td> , Indiana </td>'+
	'               <td align="center" style="width:170px; border-bottom:1px solid #000;">'+zip_code+'</td>'+
	'			  </tr>'+
	'		  </table>'+
	'    </td>'+
	'			</tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">9</td>'+
	'			   <td>'+
	'                  <table>'+
	'				      <tr>'+
	'					      <td>(zip code) legally described as:</td>'+
	'					      <td style="width:450px; border-bottom:1px solid #000;"></td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">10</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'					      <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'					  </tr>'+
	'				  </table>'+
	'              </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">11</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'                          <td style="width:550px; border-bottom:1px solid #000;"></td>'+
	'					      <td>(the "Property").</td>'+
	'					  </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">12</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">13</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'					      <td>This contract begins on</td>'+
	'					      <td align="center" style="width:200px; border-bottom:1px solid #000;">'+list_date+'</td>'+
	'                          <td>, and expires at midnight</td>'+
	'                          <td align="center" style="width:200px; border-bottom:1px solid #000;">'+expiring_date+'</td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">14</td>'+
	'			   <td>subject to the following terms and conditions:</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">15</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">16</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'					      <td>List Price: $</td>'+
	'					      <td align="center" style="width:200px; border-bottom:1px solid #000;">'+listing_prise+'</td>'+
	'                          <td style="width:60px;"></td>'+
	'                          <td>Possession:</td>'+
	'                          <td style="width:200px; border-bottom:1px solid #000;"></td>'+
	'					  </tr>'+
	'				  </table>'+
	'               </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">17</td>'+
	'			   <td>Seller represents that Seller is not delinquent on any loans which could constitute a lien on the Property and the total loans affecting the</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">18</td>'+
	'			   <td>Property do not exceed the list price and costs of sale. Also, Seller has the capacity to convey the Property by a general Warranty Deed or by</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">19</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'					      <td align="center" style="width:300px; border-bottom:1px solid #000;">N/A</td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">20</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">21</td>'+
	'			   <td colspan="2">Terms of Sale: The Property may be sold for cash or any of the following methods indicated below:</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">22</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'					      <td style="width:70px; border-bottom:1px solid #000;">X</td>'+
	'                          <td style="width:20px;"></td>'+
	'					      <td style="width:250px;">Conventional Mortgage</td>'+
	'                          <td style="width:70px; border-bottom:1px solid #000;"></td>'+
	'                          <td style="width:20px;"></td>'+
	'                          <td>Conditional Sales Contract</td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">23</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'					      <td style="width:70px; border-bottom:1px solid #000;"></td>'+
	'                          <td style="width:20px;"></td>'+
	'					      <td style="width:250px;">Insured Conventional Mortgage</td>'+
	'                          <td style="width:70px; border-bottom:1px solid #000;"></td>'+
	'                          <td style="width:20px;"></td>'+
	'                          <td>FHA</td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">24</td>'+
	'			   <td>'+
	'                  <table>'+
	'				      <tr>'+
	'					      <td style="width:70px; border-bottom:1px solid #000;"></td>'+
	'                          <td style="width:20px;"></td>'+
	'					      <td style="width:250px;">Assumption of Existing Mortgage Balance</td>'+
	'                          <td style="width:70px; border-bottom:1px solid #000;"></td>'+
	'                          <td style="width:20px;"></td>'+
	'                          <td>VA</td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">25</td>'+
	'			   <td>'+
	'                  <table>'+
	'				      <tr>'+
	'					      <td style="width:70px; border-bottom:1px solid #000;"></td>'+
	'                          <td style="width:20px;"></td>'+
	'					      <td style="width:50px;">Other</td>'+
	'                          <td style="width:250px; border-bottom:1px solid #000;"></td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">26</td>'+
	'			   <td>'+
	'                  <table>'+
	'				      <tr>'+
	'					      <td>Seller agrees to pay costs associated with financing not to exceed</td>'+
	'                          <td style="width:250px; border-bottom:1px solid #000;">N/A</td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">27</td>'+
	'			   <td>Property Offered for Sale: The above list price includes the Property and all improvements and fixtures permanently installed and</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">28</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'					      <td>affixed thereto, <strong>except</strong></td>'+
	'                          <td style="width:450px; border-bottom:1px solid #000;">No Exceptions</td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">29</td>'+
	'			   <td>'+
	'                  <table>'+
	'				      <tr>'+
	'					      <td>Items of Personal Property included in the sale:</td>'+
	'                          <td align="center" style="width:400px; border-bottom:1px solid #000;">'+noExceptions+'</td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">31</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'                          <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'					  </tr>'+
	'				  </table>'+
	'                </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">32</td>'+
	'			   <td>'+
	'                 <table>'+
	'				      <tr>'+
	'                          <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'					  </tr>'+
	'				  </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">33</td>'+
	'			   <td>'+
	'                  <table>'+
	'				      <tr>'+
	'                          <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'					  </tr>'+
	'				  </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">34</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">35</td>'+
	'			   <td>(A) <strong>EXCLUSIVE LISTING</strong>. The parties understand and agree that this is an exclusive right to sell, option, exchange or lease</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">36</td>'+
	'			   <td>listing, and Broker shall be entitled to the commission hereinafter established which shall be payable upon the occurrence of any of the</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">37</td>'+
	'			   <td>following events:</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">38</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">39</td>'+
	'			   <td style="padding-left: 60px;">(1) at the time the Property is sold, optioned, exchanged or leased by any person, including the Seller, to any person</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">40</td>'+
	'			   <td style="padding-left: 60px;">during the term of this contract or any renewal or extension thereof,</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">41</td>'+
	'			   <td style="padding-left: 60px;">(2) at the time Seller, Broker, or any other real estate licensee secures a buyer or lessee ready, willing and able to</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">42</td>'+
	'			   <td style="padding-left: 60px;">purchase, option, exchange or lease the Property for such price and terms as specified, or such other price or terms</td>'+
	'		   </tr>'+
	'		     <tr>'+
	'		       <td style="width:5%; text-align:center;">43</td>'+
	'			   <td style="padding-left: 60px;">as Seller may accept,</td>'+
	'		   </tr>'+
	'			 <tr>'+
	'		       <td style="width:5%; text-align:center;">44</td>'+
	'			   <td style="padding-left: 60px;">(3) at the time an agreement is entered into to sell, exchange, option or lease during the term of this contract or any</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">45</td>'+
	'			   <td style="padding-left: 60px;">renewal or extension thereof, and ultimately completed after the termination of this contract,</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">46</td>'+
	'			   <td style="padding-left: 60px;">'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td>(4) the Property is sold, optioned, leased, or exchanged by Seller or any other person within</td>'+
	'                            <td style="width:50px; border-bottom:1px solid #000;">30</td>'+
	'                            <td>days</td>'+
	'                        </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">47</td>'+
	'			   <td style="padding-left: 60px;">after termination of this Listing Contract to any person procured in whole or in part by the efforts of Broker, any</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">48</td>'+
	'			   <td style="padding-left: 60px;">cooperating broker, or Seller, provided, however, this extension clause shall not apply if this Exclusive Listing</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">49</td>'+
	'			   <td style="padding-left: 60px;">Contract terminates and the Property is listed exclusively with another licensed broker, or</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">49</td>'+
	'			   <td style="padding-left: 60px;">(5) at the time of default by Seller to any valid, fully executed, written agreement to sell, option, exchange, or lease the</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">50</td>'+
	'			   <td style="padding-left: 60px;">Property.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">51</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">52</td>'+
	'			   <td>Any commission required to be paid under items (1), (3) and (4) above shall be due and payable at the closing of the transaction</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">53</td>'+
	'			   <td>when title to or any interest in the Property is transferred to a buyer or lessee. Any commission required to be paid under items</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">54</td>'+
	'			   <td>(2) and (5) above shall be due and payable upon demand by Broker. In the event that commission is not paid when due, then</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">55</td>'+
	'			   <td>'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td>Broker shall be entitled to interest at the rate of</td>'+
	'                            <td style="width:80px; border-bottom:1px solid #000;">5.000</td>'+
	'                            <td>% per annum until commission is paid.</td>'+
	'                        </tr>'+
	'                 </table>'+
	'                </td>'+
	'		   </tr>'+
	'		  <tr>'+
	'		       <td style="width:5%; text-align:center;">56</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">57</td>'+
	'			   <td>If the Seller and a Buyer sign a Purchase Agreement, Option to Purchase Real Estate, Lease or the closing of the sale of the Property will not</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">58</td>'+
	'			   <td>take place until after the term of this contract, then this contract shall automatically be extended to coincide with the closing date or term of the</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">59</td>'+
	'			   <td>lease.</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">60</td>'+
	'			   <td><strong>(B) BROKER\'S COMMISSION.</strong> The broker\'s commission charged by the listing Broker for services rendered, with respect to any</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">61</td>'+
	'			   <td>listing, is solely a matter of negotiation between Broker and Seller and is not fixed, controlled, suggested recommended or</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">62</td>'+
	'			   <td>maintained by the Indiana Association of REALTORS®, Inc., the local Board/Association of REALTORS®, the MLS (if</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">63</td>'+
	'			   <td>applicable) or any person not a party to the contract. Seller has been advised of Broker\'s cooperative compensation policy.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">64</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">65</td>'+
	'			   <td>Seller shall pay in cash to Broker for services a total commission as follows: <strong>(Check appropriate paragraph number/numbers)</strong></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">66</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">67</td>'+
	'			   <td>'+
	'                   <table>'+
	'                        <tr>'+
	'                            <td><span class="box-x">X</span>1.   <span class="line20">600</span>% of the selling/exchange price or option selling price, not less than $</td>'+
	'                            <td align="center" style="width:100px; border-bottom:1px solid #000;">'+commission+'</td>'+
	'                        </tr>'+
	'                 </table>'+
	'                </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">68</td>'+
	'			   <td>'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td align="center" style="width:200px; border-bottom:1px solid #000;">N/A</td>'+
	'                        </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">69</td>'+
	'			   <td>'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td><span class="box-x"></span>2.   In the event of a purchase option, the Seller agrees to compensate Broker</td>'+
	'                            <td style="width:100px; border-bottom:1px solid #000;"></td>'+
	'                            <td>%</td>'+
	'                        </tr>'+
	'                 </table>'+
	'                </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">70</td>'+
	'			   <td>of the consideration paid for an Option to Purchase.</td>'+
	'		   </tr>'+
	'			 <tr>'+
	'		       <td style="width:5%; text-align:center;">71</td>'+
	'			   <td>'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td> <span class="box-x"></span>3.   In the event of a lease, the Seller agrees to compensate Broker</td>'+
	'                            <td style="width:100px; border-bottom:1px solid #000;"></td>'+
	'                            <td>% of</td>'+
	'                        </tr>'+
	'                 </table>'+
	'                </td>'+
	'		   </tr>'+
	'			 <tr>'+
	'		       <td style="width:5%; text-align:center;">72</td>'+
	'			   <td>all amounts paid by a lessee to Seller over the term of the lease.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">73</td>'+
	'			   <td>'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td><span class="box-x"></span>4.   Other:</td>'+
	'                            <td style="width:300px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'                </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">74</td>'+
	'			   <td><table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'             </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">75</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">76</td>'+
	'			   <td><strong>(C) COMMISSION IS LIEN; ATTORNEY FEES.</strong> For purposes of this contract, the parties understand and agree that Broker\'s</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">77</td>'+
	'			   <td>commission is deemed to be a share of the purchase money received by Seller, and Broker shall have a lien on the funds and</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">78</td>'+
	'			   <td>a lien upon the Property until the commission is paid. If any action is filed in relation to this Listing Contract, the unsuccessful</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">79</td>'+
	'			   <td>party shall pay to the successful party a reasonable sum for the successful party\'s attorney\'s fees and court costs.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">80</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">81</td>'+
	'			   <td><strong>(D) EARNEST MONEY.</strong> Broker is authorized to accept earnest money or any part of the purchase price and hold it in an</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">82</td>'+
	'			   <td>escrow/trust account. In the event that Seller is to receive any portion of the earnest money, Seller authorizes Broker to keep</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">83</td>'+
	'			   <td>any earnest money deposits up to the amount the commission would have been if the sale was completed in payment for</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">84</td>'+
	'			   <td>Broker\'s expenses, services and advertising.</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">85</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'			 <tr>'+
	'		       <td style="width:5%; text-align:center;">86</td>'+
	'			   <td><strong>(E) MLS INFO (IF APPLICABLE).</strong> It is understood that the Broker may rely on the validity of the data pertaining to this Listing</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">87</td>'+
	'			   <td>Contract which has been provided by the Seller, and the Seller agrees that Broker may disclose the data to a Multiple</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">88</td>'+
	'			   <td>Listing Service ("MLS"), Internet or any advertising media and that the Broker may furnish notice to a MLS or other provider of all</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">89</td>'+
	'			   <td>changes of information concerning the Property.</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">90</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">91</td>'+
	'			   <td><strong>(F) INFORMATION REGARDING PROPERTY.</strong> Seller acknowledges that the information on the Listing Profile Sheet and Seller\'s</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">92</td>'+
	'			   <td>Residential Real Estate Sales Disclosure Form (if applicable) is true and correct, and that Seller is the owner of the Property</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">93</td>'+
	'			   <td>or is the authorized agent(s) of the true owner with complete and full authority to act on behalf of the owner(s). Seller further</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">94</td>'+
	'			   <td>warrants that no other listing contract is now in force with any other broker. The Seller(s) or authorized agent(s) agree to</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">95</td>'+
	'			   <td>indemnify, actively defend and hold Broker, Company and its agents harmless from any damages, loss, liability and expenses including</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">96</td>'+
	'			   <td>attorney fees and costs, arising from incorrect information or failure to supply material information regarding the Property,</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">97</td>'+
	'			   <td>including, but not limited to the condition of appliances, heating, plumbing, electrical, sewage, major defects in structure, mold and/or other</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">98</td>'+
	'			   <td>environmental conditions or hazards, location of property lines, public and private restrictions on the use of the Property, any loss or liability</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">99</td>'+
	'			   <td>in conjunction with this agreement or with Broker or other licensees showing the Property including, but not limited to, injuries suffered by</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">100</td>'+
	'			   <td>other licensees or prospective buyers.</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">101</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">102</td>'+
	'			   <td><strong>(G) ENVIRONMENTAL CONTAMINANTS ADVISORY/RELEASE.</strong>  Seller acknowledges that Listing Broker, Selling Broker and all</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">103</td>'+
	'			   <td>salespersons associated with Brokers are NOT experts and have NO special training, knowledge or experience with regard to the</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">104</td>'+
	'			   <td>evaluation or existence of possible lead-based paint, radon, mold and other biological contaminants ("Environmental Contaminants") which</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">105</td>'+
	'			   <td>might exist and affect the Property. Environmental Contaminants at harmful levels may cause property damage and serious illness,</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">106</td>'+
	'			   <td>including but not limited to, allergic and/or respiratory problems, particularly in persons with immune system problems, young children </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">107</td>'+
	'			   <td>and/or the elderly.</td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">108</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">109</td>'+
	'			   <td><strong>Seller agrees to consult with appropriate experts and accepts all risks for Environmental Contaminants and releases and holds</strong></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">110</td>'+
	'			   <td><strong>harmless all Brokers, their companies and sales associates from any and all liability, including attorney\'s fees and costs, arising</strong></td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">111</td>'+
	'			   <td><strong>out of or related to any inspection, inspection result, repair, disclosed defect or deficiency affecting the Property, including</strong></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">112</td>'+
	'			   <td><strong>Environmental Contaminants. This release shall survive the closing.</strong></td>'+
	'		   </tr>'+
	'			<tr>'+
	'		       <td style="width:5%; text-align:center;">113</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'			 <tr>'+
	'		       <td style="width:5%; text-align:center;">114</td>'+
	'			   <td><strong>(H) AGENCY DISCLOSURES.</strong></td>'+
	'		   </tr>'+
	'           <tr>'+
	'		       <td style="width:5%; text-align:center;">115</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'            <tr>'+
	'		       <td style="width:5%; text-align:center;">116</td>'+
	'			   <td style="padding-left:25px">1. <strong>Office Policy.</strong> Seller acknowledges receipt of a copy of the written office policy relating to agency.</td>'+
	'		   </tr>'+
	'           <tr>'+
	'		       <td style="width:5%; text-align:center;">117</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">118</td>'+
	'			   <td style="padding-left:25px">2. <strong>Agency Relationship.</strong>  I.C. 25-34.1-10-9.5 provides that a Licensee has an agency relationship with, and is</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">119</td>'+
	'			   <td style="padding-left:25px">representing, the individual with whom the Licensee is working unless (1) there is a written agreement to the contrary;</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">120</td>'+
	'			   <td style="padding-left:25px">or (2) the Licensee is merely assisting the individual as a customer. Licensee(Broker) represents the interests of the</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">121</td>'+
	'			   <td style="padding-left:25px">Seller as Seller\'s agent to sell the Property. Licensee owes duties of trust, loyalty, confidentiality, accounting and</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">122</td>'+
	'			   <td style="padding-left:25px">disclosure to the Seller. However, Licensee must deal honestly with a buyer and disclose to the buyer information</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">123</td>'+
	'			   <td style="padding-left:25px">about the Property. All representations made by Licensee about the Property are made as the agent of the Seller.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">123</td>'+
	'			   <td style="padding-left:25px">Seller is advised that the Property may be sold with the assistance of other Licensees working as buyer agents and</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">124</td>'+
	'			   <td style="padding-left:25px">that Licensee\'s company policy is to cooperate with and compensate buyer agents. Buyer agents are Licensees who</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">125</td>'+
	'			   <td style="padding-left:25px">show the Property to prospective buyers, but who represent only the interests of the buyer. Buyer agents owe duties</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">126</td>'+
	'			   <td style="padding-left:25px">of trust, loyalty, confidentiality, accounting and disclosure to buyers. All representations made by buyer agents about</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">127</td>'+
	'			   <td style="padding-left:25px">the Property are not made as the agent of the Seller.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">128</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">129</td>'+
	'			   <td style="padding-left:25px">3. <strong>Limited Agency Authorization.</strong> Licensee or the principal or managing broker may represent Buyer as a buyer agent.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">130</td>'+
	'			   <td style="padding-left:25px">If such a Buyer wishes to see the Property, Licensee has agency duties to both Seller and Buyer, and those duties</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">131</td>'+
	'			   <td style="padding-left:25px">may be different or even adverse. Seller knowingly consents to Licensee acting as a limited agent for such showings.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">132</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">133</td>'+
	'			   <td style="padding-left:25px">If limited agency arises, Licensee shall not disclose the following without the informed consent, in writing, of both </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">134</td>'+
	'			   <td style="padding-left:25px">Seller and Buyer:</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">135</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">136</td>'+
	'			   <td style="padding-left:25px">(a) Any material or confidential information, except adverse material facts or risks actually known by Licensee</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">137</td>'+
	'			   <td style="padding-left:25px">concerning the physical condition of the Property and facts required by statute, rule, or regulation to be</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">138</td>'+
	'			   <td style="padding-left:25px">disclosed and that could not be discovered by a reasonable and timely inspection of the Property by the parties.</td>'+
	'		   </tr>'+
	'		     <tr>'+
	'		       <td style="width:5%; text-align:center;">139</td>'+
	'			   <td style="padding-left:25px">(b) That a Buyer will pay more than the offered purchase price for the Property.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">140</td>'+
	'			   <td style="padding-left:25px">(c) That Seller will accept less than the listed price for the Property.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">141</td>'+
	'			   <td style="padding-left:25px">(d) Other terms that would create a contractual advantage for one party over another party.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">142</td>'+
	'			   <td style="padding-left:25px">(e) What motivates a party to buy or sell the Property.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">143</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">144</td>'+
	'			   <td>In a limited agency situation, the parties agree that there will be no imputation of knowledge or information between any party and</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">145</td>'+
	'			   <td>the limited agent or among Licensees.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">146</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">147</td>'+
	'			   <td>Seller acknowledges that Limited Agency Authorization has been read and understood. Seller understands that Seller does not</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">148</td>'+
	'			   <td>have to consent to Licensee(s) acting as limited agent(s), but gives informed consent voluntarily to limited agency and waives</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">149</td>'+
	'			   <td>any claims, damages, losses, expenses, including attorneys\' fees and costs, against Licensee(s) arising from Licensee\'s(s\') role</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">150</td>'+
	'			   <td>of limited agent(s).</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">151</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">152</td>'+
	'			   <td><strong>(i)  SELLER AUTHORIZATION AND COOPERATION.</strong> Seller agrees to provide Broker with the required information necessary</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">153</td>'+
	'			   <td>for entry into a MLS, Internet or other advertising media, to include electronic media and the use of any exterior/interior photos, if</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">154</td>'+
	'			   <td>applicable. Seller will cooperate with Broker by permitting the Property to be shown at reasonable times and authorizes Broker to place and</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">155</td>'+
	'			   <td>remove "For Sale" and other signs on the Property.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">156</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">157</td>'+
	'			   <td style="padding-left:20px">1. Seller authorizes Broker and cooperating brokers, buyer brokers, Broker\'s personal assistants, contractors, inspectors,</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">158</td>'+
	'			   <td style="padding-left:20px">appraisers and others reasonably necessary to market the Property to enter the Property. Seller acknowledges that a buyer may</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">159</td>'+
	'			   <td style="padding-left:20px">enter the Property with contractors, inspectors or appraisers without being accompanied by Broker. Buyer or Buyer\'s broker may</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">160</td>'+
	'			   <td style="padding-left:20px">take videos, photos and electronic images of the Property.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">161</td>'+
	'			   <td style="padding-left:20px">2. Seller will provide Broker with key(s) necessary to access the Property.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">162</td>'+
	'			   <td style="padding-left:20px">3. Seller authorizes Broker to have duplicate keys made.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">163</td>'+
	'			   <td style="padding-left:20px">4. Seller agrees not to rent or lease the Property during the term of this Listing Contract without written notification to</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">164</td>'+
	'			   <td style="padding-left:20px">Broker.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">165</td>'+
	'			   <td style="padding-left:20px">5. Seller agrees that Broker may work with buyer brokers to assist in performing Broker\'s duties according to the</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">166</td>'+
	'			   <td style="padding-left:20px">terms of this Listing Contract.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">167</td>'+
	'			   <td style="padding-left:20px">6. Seller authorizes Broker to disseminate all listing information as well as the price and terms of financing on a closed</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">168</td>'+
	'			   <td style="padding-left:20px">sale to members of the Indiana Association of REALTORS®, Inc., to other brokers upon request and to a MLS, Internet or</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">169</td>'+
	'			   <td style="padding-left:20px">any advertising media, if applicable, for publication.</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">170</td>'+
	'			   <td style="padding-left:20px">7. Seller authorizes its utility companies to divulge all utility information to Broker and to provide copies of utility</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">171</td>'+
	'			   <td style="padding-left:20px">'+
	'                    <table>'+
	'                        <tr>'+
	'                             <td> statements, if requested. Seller\'s utility companies are as follows:</td>'+
	'                             <td align="center" style="width:150px; border-bottom:1px solid #000;">N/A</td>'+
	'                        </tr>'+
	'                 </table>'+
	'             </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">172</td>'+
	'			   <td style="padding-left:20px">'+
	'                  <table>'+
	'                        <tr>'+
	'                             <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">173</td>'+
	'			   <td style="padding-left:20px">8. Seller authorizes its lending institution to divulge all mortgage information to Broker and to provide copies of the</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">174</td>'+
	'			   <td style="padding-left:20px">'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td>note and mortgage, if requested. Seller\'s lending institution is</td>'+
	'                            <td align="center" style="width:100px; border-bottom:1px solid #000;">N/A</td>'+
	'                        </tr>'+
	'                 </table>'+
	'                </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">175</td>'+
	'			   <td style="padding-left:20px">'+
	'                  <table>'+
	'                        <tr>'+
	'                            <td style="width:150px; border-bottom:1px solid #000;"></td>'+
	'                            <td>and the mortgage loan number is</td>'+
	'                            <td style="width:150px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'                </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">176</td>'+
	'			   <td style="padding-left:20px">9. Seller<span class="box-x">X</span> does <span class="box-x">X</span>does not authorize Broker to disclose the existence of multiple offers to Buyer.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">177</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">178</td>'+
	'			   <td style="padding-left:20px">If Seller\'s mortgage is subject to a pre-payment penalty, Seller agrees to give timely written notice to Seller\'s lender</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">179</td>'+
	'			   <td style="padding-left:20px">that the mortgage is to be pre-paid from the sale proceeds of the Property. It is acknowledged that Seller\'s failure to</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">180</td>'+
	'			   <td style="padding-left:20px">give this notice may result in a pre-payment penalty to be paid by Seller.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">181</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">182</td>'+
	'			   <td>(J)  <strong>LOCKBOX/KEY AUTHORIZATION/USE.</strong> To facilitate access to the Property, a lockbox installation <span class="box-x"></span> is <span class="box-x">X</span> is not</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">183</td>'+
	'			   <td>authorized, subject to the following acknowledgments/conditions:</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">184</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">185</td>'+
	'			   <td style="padding-left:20px">1. Seller will safeguard valuables. Seller accepts responsibility for preparing the Property to minimize the likelihood of injury, damage</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">186</td>'+
	'			   <td style="padding-left:20px">and/or loss of personal property.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">187</td>'+
	'			   <td style="padding-left:20px">2. Seller acknowledges Broker is not an insurer of Seller\'s real estate and personal property and waives claims against</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">188</td>'+
	'			   <td style="padding-left:20px">Broker and Broker\'s authorized persons for loss and/or damage. Seller further agrees to indemnify and hold harmless Broker</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">189</td>'+
	'			   <td style="padding-left:20px">and all authorized persons from claims by third parties from all loss and/or damage.</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">190</td>'+
	'			   <td style="padding-left:20px">3. Seller instructs Broker to make reasonable efforts to notify Seller of showing requests. If Seller cannot be contacted</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">191</td>'+
	'			   <td style="padding-left:20px">to schedule a showing, Seller <span class="box-x"></span> wants <span class="box-x">X</span> does not want Broker to use the lockbox/key for access to the Property.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">192</td>'+
	'			   <td style="padding-left:20px">4. Where a tenant/lessee occupies the Property, it is Seller\'s full responsibility to obtain tenant/lessee consent to allow</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">193</td>'+
	'			   <td style="padding-left:20px">the use of a lockbox/key.</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">194</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">195</td>'+
	'			   <td><strong>(K)  FAIR HOUSING.</strong> The parties acknowledge that the Fair Housing Act prohibits discrimination in housing because of race,</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">196</td>'+
	'			   <td>color, national origin, religion, sex, familial status, and handicap.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">197</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">198</td>'+
	'			   <td><strong>(L)  ADDITIONAL PROVISIONS.</strong></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">199</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">200</td>'+
	'			   <td style="padding-left:20px">1. Seller understands the terms of this Listing Contract and has received a copy.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">201</td>'+
	'			   <td style="padding-left:20px">2. The parties to this contract agree that it contains the entire agreement of the parties and cannot be changed except</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">202</td>'+
	'			   <td style="padding-left:20px">by their written consent.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">203</td>'+
	'			   <td style="padding-left:20px">3. The parties to this contract agree that it is binding upon the parties\' heirs, administrators, executors, successors and</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">204</td>'+
	'			   <td style="padding-left:20px">assigns.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">205</td>'+
	'			   <td style="padding-left:20px">4. Seller acknowledges receipt of an estimate of selling expenses.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">206</td>'+
	'			   <td style="padding-left:20px">'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td>5. Seller acknowledges there are homeowner\'s association fees and/or assessments in the amount of $</td>'+
	'                            <td style="width:80px; border-bottom:1px solid #000;"></td>'+
	'                         </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">207</td>'+
	'			   <td style="padding-left:20px">'+
	'                  <table>'+
	'                        <tr>'+
	'                            <td>per</td>'+
	'                            <td style="width:100px; border-bottom:1px solid #000;"></td>'+
	'                            <td>, which have been paid by Seller through</td>'+
	'                            <td style="width:100px; border-bottom:1px solid #000;"></td>'+
	'                            <td>,</td>'+
	'                            <td style="width:80px; border-bottom:1px solid #000;"></td>'+
	'                         </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">208</td>'+
	'			   <td style="padding-left:20px">6. The parties to this contract agree that this contract may be executed simultaneously or in two or more counterparts,</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">209</td>'+
	'			   <td style="padding-left:20px">each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">210</td>'+
	'			   <td style="padding-left:20px">The parties agree that this contract may be transmitted between them electronically or digitally. The parties intend that</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">211</td>'+
	'			   <td style="padding-left:20px">electronically or digitally transmitted signatures constitute original signatures and are binding on the parties. The original</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">212</td>'+
	'			   <td style="padding-left:20px">document shall be promptly delivered, if requested.</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">213</td>'+
	'			   <td style="padding-left:20px">7. Broker may refer Seller to other professionals, service providers or product vendors, including lenders, loan brokers,</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">214</td>'+
	'			   <td style="padding-left:20px">title insurers, escrow companies, inspectors, pest control companies, contractors and home warranty companies.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">215</td>'+
	'			   <td style="padding-left:20px">Broker does not guarantee the performance of any service provider. Seller is free to select providers other than</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">216</td>'+
	'			   <td style="padding-left:20px">those referred or recommended to Seller by Broker.</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">217</td>'+
	'			   <td style="padding-left:20px">8. Broker is not and shall not be charged with the responsibility for the custody, management, care, maintenance,</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">218</td>'+
	'			   <td style="padding-left:20px">protection or repair of the Property nor for the protection or custody of any personal property located thereon,</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">219</td>'+
	'			   <td style="padding-left:20px">unless provided for in another written agreement.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">220</td>'+
	'			   <td style="padding-left:20px">9. Seller consents to receive communications from Broker via telephone, U.S. mail, email and facsimile at the numbers/addresses</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">221</td>'+
	'			   <td style="padding-left:20px">provided to Broker unless Seller notifies Broker in writing to the contrary.</td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">222</td>'+
	'			   <td style="padding-left:20px">10. Where the word "Broker" appears, it shall mean "Licensee" as provided in I.C.25-34.1-10-6.8.</td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">223</td>'+
	'			   <td style="padding-left:20px">'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td>11. Seller discloses to Listing Broker that Seller is licensed and holds License #</td>'+
	'                            <td align="center" style="width:150px; border-bottom:1px solid #000;">N/A</td>'+
	'                        </tr>'+
	'                 </table>'+
	'              </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">224</td>'+
	'			   <td><strong></strong></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">225</td>'+
	'			   <td><strong>(M)  FURTHER CONDITIONS.</strong></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">226</td>'+
	'			   <td><table>'+
	'                        <tr>'+
	'                            <td  align="center" style="width:600px; border-bottom:1px solid #000;">N/A</td>'+
	'                        </tr>'+
	'                 </table>'+
	'             </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">227</td>'+
	'			   <td>'+
	'                  <table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">228</td>'+
	'			   <td>'+
	'                   <table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table> '+
	'              </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">230</td>'+
	'			   <td>'+
	'                  <table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">231</td>'+
	'			   <td>'+
	'                   <table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">232</td>'+
	'			   <td>'+
	'                  <table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">233</td>'+
	'			   <td>'+
	'                  <table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table> '+
	'              </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">234</td>'+
	'			   <td>'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'                </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">235</td>'+
	'			   <td><table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">236</td>'+
	'			   <td>'+
	'                 <table>'+
	'                        <tr>'+
	'                            <td style="width:600px; border-bottom:1px solid #000;"></td>'+
	'                        </tr>'+
	'                 </table>  '+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">237</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">238</td>'+
	'			   <td>'+
	'                     <table>'+
	'                         <tr>'+
	'                             <td style="width:290px; border-bottom:1px solid #000;"></td>'+
	'                             <td style="width:30px;"></td> '+
	'                             <td style="width:270px; border-bottom:1px solid #000;"></td>'+
	'                         </tr>'+
	'                    </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   	<tr>'+
	'		       <td style="width:5%; text-align:center;">239</td>'+
	'			   <td>'+
	'                  <table>'+
	'                         <tr>'+
	'                             <td style="width:290px;">'+
	'                                  <table>'+
	'                                      <tr>'+
	'                                         <td>SALESPERSON/AGENT</td>'+
	'                                         <td style="text-algn:right; width:100px;" align="right">IN LICENSE</td>'+
	'                                      </tr>'+
	'                                  </table>'+
	'                             </td>'+
	'                             <td style="width:30px;"></td> '+
	'                             <td style="width:270px;">'+
	'                                     <table>'+
	'                                      <tr>'+
	'                                         <td>SELLER\'S SIGNATURE</td>'+
	'                                         <td style="text-algn:right; width:100px;" align="right">DATE</td>'+
	'                                      </tr>'+
	'                                  </table>'+
	'                            </td>'+
	'                         </tr>'+
	'                    </table>'+
	'                 </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">240</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">241</td>'+
	'			   <td>'+
	'                    <table>'+
	'                         <tr>'+
	'                             <td style="width:290px; border-bottom:1px solid #000;"></td>'+
	'                             <td style="width:30px;"></td> '+
	'                             <td style="width:270px; border-bottom:1px solid #000;"></td>'+
	'                         </tr>'+
	'                    </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">242</td>'+
	'			   <td>'+
	'                  <table>'+
	'                         <tr>'+
	'                             <td style="width:290px;">'+
	'                                  <table>'+
	'                                      <tr>'+
	'                                         <td>BROKER OR COMPANY NAME</td>'+
	'                                         <td style="text-algn:right; width:100px;" align="right">IN LICENSE</td>'+
	'                                      </tr>'+
	'                                  </table>'+
	'                             </td>'+
	'                             <td style="width:30px;"></td> '+
	'                             <td style="width:270px;">'+
	'                                     <table>'+
	'                                      <tr>'+
	'                                         <td>PRINTED</td>'+
	'                                         <td></td>'+
	'                                      </tr>'+
	'                                  </table>'+
	'                            </td>'+
	'                         </tr>'+
	'                    </table>'+
	'                 </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">243</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">244</td>'+
	'			   <td>'+
	'                   <table>'+
	'                         <tr>'+
	'                             <td style="width:290px; border-bottom:1px solid #000;"></td>'+
	'                             <td style="width:30px;"></td> '+
	'                             <td style="width:270px; border-bottom:1px solid #000;"></td>'+
	'                         </tr>'+
	'                    </table>'+
	'               </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">245</td>'+
	'			   <td>'+
	'                 <table>'+
	'                         <tr>'+
	'                             <td style="width:290px;">'+
	'                                  <table>'+
	'                                      <tr>'+
	'                                         <td>ACCEPTED BY: PRINCIPAL/MANAGING BROKER</td>'+
	'                                         <td></td>'+
	'                                      </tr>'+
	'                                  </table>'+
	'                             </td>'+
	'                             <td style="width:30px;"></td> '+
	'                             <td style="width:270px;">'+
	'                                     <table>'+
	'                                      <tr>'+
	'                                         <td>SELLER\'S SIGNATURE</td>'+
	'                                         <td style="text-algn:right; width:100px;" align="right">DATE</td>'+
	'                                      </tr>'+
	'                                  </table>'+
	'                            </td>'+
	'                         </tr>'+
	'                    </table>'+
	'                 </td>'+
	'		   </tr>'+
	'		   <tr>'+
	'		       <td style="width:5%; text-align:center;">246</td>'+
	'			   <td></td>'+
	'		   </tr>'+
	'		   '+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">247</td>'+
	'			   <td>'+
	'                 <table>'+
	'                         <tr>'+
	'                             <td style="width:290px;"><img width="150px" src="https://1309901.app.netsuite.com'+(fileDetail).replace('/&amp;/','&')+'"/></td>'+
	'                             <td style="width:30px;"></td> '+
	'                             <td style="width:270px; border-bottom:1px solid #000;"></td>'+
	'                         </tr>'+
	'                    </table>'+
	'              </td>'+
	'		   </tr>'+
	'		    <tr>'+
	'		       <td style="width:5%; text-align:center;">248</td>'+
	'			   <td>'+
	'                 <table>'+
	'                         <tr>'+
	'                             <td style="width:290px;"></td>'+
	'                             <td style="width:30px;"></td> '+
	'                             <td style="width:270px;">'+
	'                                     <table>'+
	'                                      <tr>'+
	'                                        <td>PRINTED</td>'+
	'                                      </tr>'+
	'                                  </table>'+
	'                            </td>'+
	'                         </tr>'+
	'                    </table>'+
	'                 </td>'+
	'             </tr>'+
	'	   </table>'+
	'   </body>'+
	'</pdf></pdfset>';
		
	var pdfFile =nlapiXMLToPDF(myvar)
		var pdfFile1 = pdfFile.getValue();

	
	var fileCreate = nlapiCreateFile(propertyID+".pdf" ,"PDF", pdfFile1)
	
	//nlapiSendEmail(nlapiGetUser(), "vikash.singh@webbee.biz", "file", pdfFile, null, null, null, fileCreate)
//	<img src="https://1309901.app.netsuite.com'+(fileDetail).replace('/&amp;/','&')+'"/>
	nlapiLogExecution("DEBUG", "Line", "1033")
	fileCreate.setFolder("20038");
	nlapiLogExecution("DEBUG", "Line", "1035")
	var ID = nlapiSubmitFile(fileCreate);
	nlapiLogExecution("DEBUG", "Line", "1036")
	
	
	
	response.write(myvar);
	
	
	
	
	

}
