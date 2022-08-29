/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/ui/serverWidget","N/url"],

function(rec, search, ui, url) {
   var objMlsConfig = {};
   var urlSelector = "";
   var propId;
   
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	var response = context.response;
    	var request = context.request;
    	var pageNum = request.parameters.page;
    	propId = request.parameters.pid;
    	
    	if(!pageNum)
    		pageNum = 0;
    	if(!propId)
    		propId = 5517;  //for testing.  Need to trap for this
    	
    	var recProperty = loadProperty(propId);
    	var html = "";
    	
    	objMlsConfig = mlsObject();
    	urlSelector = url.resolveScript({
    	    scriptId: 'customscript_hms_mls_entry_sl',
    	    deploymentId: 'customdeploy_hms_mls_entry_sl'
    	});
    	
    	html += "<html>" + buildHeader() + buildBody(pageNum, recProperty)+ "<br /><br />" + buildFooter(pageNum) + "</body></header>";
    	
    	response.write(html);

    }
    
    function buildHeader(){
    	var html = "<head>";
    	var html = "<style> "+
    	"table {"+
    	"	  width:80%;"+
    	"	}"+
    	"	table, th, td {"+
    	"	  border: 1px solid black;"+
    	"	  border-collapse: collapse;"+
    	"	}"+
    	"	th, td {"+
    	"	  padding: 10px;"+
    	"	  text-align: left;"+
    	"	}"+
    	"	table#t01 tr:nth-child(even) {"+
    	"	  background-color: #eee;"+
    	"	}"+
    	"	table#t01 tr:nth-child(odd) {"+
    	"	 background-color: #fff;"+
    	"	}"+
    	"	table#t01 th {"+
    	"	  background-color: black;"+
    	"	  color: white;"+
    	"	}"+
    	"	</style>"+
    	"</head>"+
    	"<body>";
    	
    	log.debug(objMlsConfig);
    	
    	html+="<h2>"+objMlsConfig.mlsName+"</h2>";
    	
    	return html;
    	
    }
    
    function buildBody(pageNum, recProperty){
    	var html="";
    	var arrFields = [];
    	var arrPages = [];
    	
    	if(!pageNum)
    		pageNum = 0;
    	
    	var curPage = objMlsConfig.pages[pageNum];
    	var arrFields = curPage.fields;
    	
    	html+="<h3>" + curPage.pageName + "</h3>";
    	html+="<p>" + curPage.pageDescription + "</p>";
    	
    	html+="<table>";
    	
    	for(var i=0;i<arrFields.length;i++){
    		var fld = arrFields[i];
    		
    		html+="<tr>";
    		html+="<td>"+fld.ns_label+"</td>";
    		html+="<td>"+fld.mls_name+"</td>";
    		html+='<td><input type="text" id="'+fld.ns_id+'" value="'+recProperty.getText(fld.ns_id)+'"><a href="#">copy</a></td>';
    		html+="</tr>";
    		
    		
    	}
    	
    	html+="</table>";
    	
    	return html;
    }
    
    function buildFooter(pageNum){
    	var html = "";
    	var arrPages = objMlsConfig.pages;
    	
    	html+="<table><tr>";
    	
    	for(var i=0;i<arrPages.length;i++){
    		curPage = arrPages[i];
    		
    		if(pageNum == i){
    			html+='<td>'+curPage.pageLabel+'</td>';
    		}else{
    			html+='<td><a href="'+urlSelector+'&pid='+propId+'&page='+i+'">'+curPage.pageLabel+'</a></td>';
    		}
    	
    		
    	
    	}
    	
    	html+="</table></tr>";
    	
    	return html;
    }
    
    function loadProperty(id){
    	return rec.load({
    		type:"customrecord_property_record",
    		id:id
    	});
    }
    
    
    function mlsObject(){
    	return {
    		  mlsId: 9,
    		  mlsName: "Ft. Wayne IN",
    		  pages: [
    		    {
    		      pageid: "1",
    		      pageName: "Page Name",
    		      pageLabel: "Label 1",
    		      pageDescription: "Page Description",
    		      fields: [
    		        {
    		          ns_id: "custrecordcustrecordsubdname",
    		          ns_label: "SUBDIVISION NAME",
    		          mls_name: "mls name1"
    		        },
    		        {
    		          ns_id: "name",
    		          ns_label: "Property",
    		          mls_name: "mls name2"
    		        },
    		        {
    		          ns_id: "custrecord_house_number",
    		          ns_label: "House Number",
    		          mls_name: "mls name3"
    		        },
    		        {
    		          ns_id: "custrecord31",
    		          ns_label: "Street",
    		          mls_name: "mls name4"
    		        },
    		        {
    		          ns_id: "custrecord_city",
    		          ns_label: "City",
    		          mls_name: "mls name5"
    		        },
    		        {
    		          ns_id: "custrecord_zip_code",
    		          ns_label: "Zip Code",
    		          mls_name: "mls name6"
    		        },
    		        {
    		          ns_id: "custrecord_state",
    		          ns_label: "State",
    		          mls_name: "mls name7"
    		        }
    		      ]
    		    },
    		    {
    		      pageid: 2,
    		      pageName: "Page Name 2",
    		      pageLabel: "Label 2",
    		      pageDescription: "Page Description 2",
    		      fields: [
    		        {
    		          ns_id: "custrecord_current_list_price",
    		          ns_label: "CURRENT LIST PRICE",
    		          mls_name: "mls name1"
    		        },
    		        {
    		          ns_id: "custrecord_current_construction",
    		          ns_label: "CURRENT CONSTRUCTION STATUS",
    		          mls_name: "mls name2"
    		        },
    		        {
    		          ns_id: "custrecord17",
    		          ns_label: "ADMINISTRATIVE CONTACT",
    		          mls_name: "mls name3"
    		        }
    		      ]
    		    },
    		    {
    		      pageid: 3,
    		      pageName: "Page Name 3",
    		      pageLabel: "Label 3",
    		      pageDescription: "Page Description 3",
    		      fields: [
    		        {
    		          ns_id: "custrecord_lot_number",
    		          ns_label: "LOT NUMBER",
    		          mls_name: "mls name1"
    		        },
    		        {
    		          ns_id: "custrecord_property_date_sales_st_update",
    		          ns_label: "SALE STATUS DATE",
    		          mls_name: "mls name2"
    		        },
    		        {
    		          ns_id: "custrecord39",
    		          ns_label: "SUBDIVISION SHOWING INSTRUCTIONS",
    		          mls_name: "mls name3"
    		        }
    		      ]
    		    }
    		  ]
    		}
    }

    return {
        onRequest: onRequest
    };
    
});
