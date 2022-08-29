/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Feb 2018     Admin
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord(){
	var msg='';
var date=new Date();
var day=date.getDay();
date=date.toISOString();
var date1=date.split('T')[0];
date1=date1.split('-');
date=date1[1]+'/'+date1[2]+'/'+date1[0];

var builder_div=nlapiGetFieldValue('company');
var call_reason=nlapiGetFieldValue('category');
var caller_type=nlapiGetFieldValue('custevent_caller_type');
/*
Appraiser	10	 
Appraiser/Inspector	1
Broker Office	11	 
Individual	4	 
Inspector	3	 
Internet Web Leads	12	 
Real Estate Agent	2	 
Web Lead	8	
Web Site	7	 */
var SubdivisionName=nlapiGetFieldText('custevent_subdivision')
var ShowingDate=nlapiGetFieldValue('custevent_showing_date_scheduled');
var admminId=nlapiGetFieldValue('custevent_admin_contact');
if(builder_div=='3643'||builder_div=='3642'){
if(admminId){
	var admin_firstname=nlapiLookupField('partner', admminId, 'firstname');
var admin_lastname=nlapiLookupField('partner', admminId, 'lastname');

	if(builder_div=='3642'){
		if(caller_type!=10&&caller_type!=1&&caller_type!=3){
			if(day==1||day==2||day==3||day==4){
				if(call_reason=='1'){    //Property Question
					 msg="For a weekday property question, assign this to whoever is in the cell for the subdivision and "+date+".";
				}else{
					msg="For a weekday showing, assign this to whoever is in the cell for " + SubdivisionName + " and " + ShowingDate + "."
				}
			}else{
				if(call_reason=='1'){    //Property Question
					 msg="For a weekend property question, assign this to whoever is in the cell for MARKET PERSON for the subdivision and today's date. If MARKET PERSON is N/A for " + SubdivisionName + ", assign it to whoever is there on the cell for " + SubdivisionName + " "+date+".";
				}else{
					mgs="For a weekend showing, assign this to whoever is in the cell for MARKET PERSON for" + SubdivisionName + " and " + ShowingDate + ". If MARKET PERSON is N/A for " + SubdivisionName + "assign it to whoever is in the cell for " + SubdivisionName + " and " + ShowingDate + "."
				}
			}
		}else{
			nlapiSetFieldValue('custevent_builder_sales_rep_subd', admminId);
			msg="Appraisal and Inspection calls are handled by the division coordinator. " + admin_firstname +" "+ admin_lastname+ " has been filled in as the Primary BSR for this call."
		}
		
	}else{

		if(caller_type!=10&&caller_type!=1&&caller_type!=3){
			if(day==1||day==2||day==3||day==4){
				if(call_reason=='1'){    //Property Question
					 msg="For a weekday property question, assign this to whoever is in the cell for the subdivision and "+date+".";
				}else{
					msg="For a weekday showing, assign this to whoever is in the cell for " + SubdivisionName + " and " + ShowingDate + "."
				}
			}else{
				if(call_reason=='1'){    //Property Question
					msg="For a weekend property question, assign this to whoever is in the cell for Showings for the subdivision and today's date. If there is no Showings column for " + SubdivisionName + ", assign it to whoever is there on the cell for " + SubdivisionName + " "+date+"."
				}else{
					msg="For a weekend showing, assign this to whoever is in the cell for Showings for " + SubdivisionName+ "and" + ShowingDate
					+ ". If there is no Showings column for " + SubdivisionName + "assign it to whoever is in the cell for " + SubdivisionName + " and " + ShowingDate + "."
				}
			}
		}else{
			nlapiSetFieldValue('custevent_builder_sales_rep_subd', admminId);
			msg="Appraisal and Inspection calls are handled by the division coordinator. " + admin_firstname +" "+ admin_lastname+ " has been filled in as the Primary BSR for this call."
		}
		
	
	}

}else{
	msg="Please enter ADMINISTRATIVE CONTACT";
}
var target = document.getElementById('div__header');
var para=document.createElement('div');
para.id = 'div__waiting__avt';
target.appendChild(para);
var s = document.createElement('script');
s.setAttribute('type', 'text/javascript');
s.value = showAlertBox('div__waiting__avt', 'Please Note', msg, 0, '100%', null, null);
var div = document.getElementById('div__waiting__avt');
div.style.display = 'none';

div.style.display = '';

    return false;
}else{
	return true;
}

}
function showAlertBox(a,b,c,e,f,d,g){
	0==NS.jQuery("#div__alert").length&&NS.jQuery("div#body, div#innerwrapper").prepend('\x3cdiv id\x3d"div__alert"\x3e\x3c/div\x3e');
	b=uir_getAlertBoxHtml(b,c,e,f,d,g);
	b=NS.jQuery(b).addClass(a);
	a=getAlertBox(a);
	null!=a?replaceAlertBox(a,b.get(0)):(b.hide(),b.appendTo("#div__alert"),b.fadeIn("slow"));
	NS.jQuery(window).trigger("resize")
	}
function uir_getAlertBoxHtml(sTitle, sMessage, iType, width, helpUrl, helpText, imageHostName)
{
    if (iType != NLAlertDialog.TYPE_LOWEST_PRIORITY &&
        iType != NLAlertDialog.TYPE_LOW_PRIORITY &&
        iType != NLAlertDialog.TYPE_MEDIUM_PRIORITY &&
        iType != NLAlertDialog.TYPE_HIGH_PRIORITY)
        iType = NLAlertDialog.TYPE_LOW_PRIORITY;

    if (!sTitle)
    {
        sTitle = NLAlertDialog.defaultTitles[iType];
        if (sTitle == null)
            sTitle = "Error"
    }

    var hasHelpLink = false;
    if (helpUrl && helpUrl.length > 0)
    {
        hasHelpLink = true;
        if (!helpText)
            helpText = "Visit this Help Topic";
    }

    if (!imageHostName)
        imageHostName = "";

    return  "<div class='uir-alert-box " + NLAlertDialog.imageNames[iType] + "'  width='"+width+"' role='status' style='background: red; border: 1px solid black;'> "+
                    "<div class='icon " + NLAlertDialog.imageNames[iType] + "' >" + "<img src='" + imageHostName + "/images/icons/messagebox/icon_msgbox_"+NLAlertDialog.imageNames[iType]+".png' alt=''>" + "</div>" +
                    "<div class='content'>" +
                        "<div class='title' style='color: rgb(255, 255, 255);'>" + sTitle + "</div>" +
                        "<div class='descr' style='color: rgb(255, 255, 255);'>" + sMessage + "</div>"+
                        (hasHelpLink ? "<div class='help'><a href=\"" + helpUrl.replace(/"/g, "&#34") + "\">" + helpText + "</a></div>" : "" ) +
                    "</div>" +
            "</div>";
}
function getAlertBox(a){
	return NS.jQuery("#div__alert").find("."+a).get(0)
	}
function replaceAlertBox(a,b){
	var c=NS.jQuery(b),e=c.html(),c=c.attr("class");
	NS.jQuery(a).fadeTo(100,.5).html(e).attr("class",c).fadeTo(200,1)
	}
function filed_change(type,name){
	if(name=='custevent_property'){
		clientSaveRecord();
	}
}