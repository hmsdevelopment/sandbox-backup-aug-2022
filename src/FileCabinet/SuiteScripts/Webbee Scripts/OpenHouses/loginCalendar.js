/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 May 2017     kulveer
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response obje ct
 */
function login(request, response){

	
	var email = defVal(request.getParameter('email'));
	var passPhone = defVal(request.getParameter('pass_phone'));
	nlapiLogExecution('DEBUG','Email && phone',email+'-'+passPhone);
	if(email ==''){
		
		enterEmail();
	
	}
	if(email && passPhone ==''){
		
		checkPhone(email,passPhone);
	
	}
	
	if(email && passPhone)
	{
		var filter=[];
		filter.push(new nlobjSearchFilter('email', null,'is',email));
		filter.push(new nlobjSearchFilter('phone',null,'is',passPhone));
				
		var column =[];
		column.push(new nlobjSearchColumn('custentity1'))
		column.push(new nlobjSearchColumn('category'))
		
		column.push(new nlobjSearchColumn('phone'))
		
		var result = nlapiSearchRecord('partner',null, filter, column);//Builder Personnel
		
//		var phone = result[0].getValue('phone');
//		nlapiLogExecution('DEBUG','column phone',phone);
//		phone = phone.split('');
//		var checkPhoneGet;
//		for(var k=0;k<phone.length;k++)
//		{
//			var st =""+Number(phone[k]);
//			if(st !='NaN' && phone[k] !=' ')
//			{
//				checkPhoneGet +=st;
//			}
//		}
//		nlapiLogExecution('DEBUG','checkPhone',checkPhoneGet);
//		
		if(result !=null )
		{
			
			var builderPersonnelId =result[0].getId();
			
			var builderId = result[0].getValue(column[0]);
			var category = result[0].getValue(column[1]);
			
			var id;
			var builderPersId;
			
			var checkPropertyAccess = nlapiLookupField('customer',builderId,'custentity_bsr_property_access');
			nlapiLogExecution('DEBUG','builder personnel Id',builderPersonnelId);
			
//			if(checkPropertyAccess == 'F')
//			{
//				builderPersId = builderPersonnelId
//			}
//			else 
			if(checkPropertyAccess == 'T' && category == '5' || checkPropertyAccess == 'T' && category == '7' )
			{
				id = builderId
			}
			else{
				id = builderId
				builderPersId = builderPersonnelId
			}
			
			
			
			
			
			
			
//			id =3675;
			var hash = CryptoJS.HmacSHA256(email,passPhone);
			
			var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);   
			hashInBase = encodeURIComponent(hashInBase64);
			
			
			nlapiLogExecution('DEBUG','hash && hashInBASE64 && base',hash+'-'+hashInBase64+'-'+hashInBase);
			
			
			var url = 'https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=207&deploy=1&compid=1309901&h=b45f23a66debd3dc4292&builderId='+id+'&key='+hashInBase+'&builderPersId='+builderPersId;
			nlapiSetRedirectURL( 'EXTERNAL', url, null, false );
			
//			nlapiSetRedirectURL('SUITELET','customscript_webb_prop_calendar','customdeploy_webb_prop_calendar');
		
		}
		else{
			nlapiLogExecution('DEBUG','no result','NORESULT');
//			alert('Enter Correct Phone Number');
			
//			checkPhone(email);
			
			
			
			
			
			var filter = [];
			filter.push(new nlobjSearchFilter('email',null,'is',email));//fax-email
			
			var column =[];
			column.push(new nlobjSearchColumn('mobilephone'))
			
			var result = nlapiSearchRecord('partner',null,filter,column);
			if(result !=null){
				nlapiLogExecution('DEBUG','result get id',result[0].getId());
				var form = nlapiCreateForm('Login',true);
				var emailShow = form.addField('emailshow','label','Email:-'+email);
				//emailShow.setLayoutType('normal','startcol');
				
			var phone;
//			for(var i=0;i<result.length;i++)
//			{
				phone = result[0].getValue('mobilephone');
				nlapiLogExecution('DEBUG','phone',phone)
				phone = phone.split('');
				
				var phoneSt='';
				var flag=0;
				for(var j=0;j<phone.length;j++)
				{
					var st = ""+Number(phone[j])
					if(j >3 && j <phone.length && flag < 3&& st != "NaN" && phone[j] !=' ')
					{
						nlapiLogExecution('DEBUG','digit come',st);
							
							phoneSt += '*'
								flag++;
							
						
						
					}
					else{
						phoneSt +=phone[j];
					}
				}
				
			
			var html = '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=1309901&h=2532d8ad05b80c2fd4bc" method="post">';
			html += '<table align = "center" id="customers">';
			html += '<tr>';
			html += '<th colspan="2" ><span align="center">Enter Phone No.</span></th>';
			html += '</tr>';
			html += '<tr>';
			html += '<td>Email: </td>';
			html += '<td><input type="email" id="useremail" name="email" value="'+email+'"></td>';
			html += '</tr>';
			html += '<tr class="alt">';
			html += '<td>Phone No:- </td>';
			html += '<td>'+phoneSt+'</td>';
			html += '</tr>';
			
			html += '<tr class="alt">';
			html += '<td>Enter Phone No:- </td>';
			html += '<td><input type="text" id="passPhone" name="pass_phone"></td>';
			html += '</tr>';
			html += '<tr>';
			html += '<td colspan="2">Phone No. is incorrect. </td>';
			
			html += '</tr>';
			html += '</table>';
			html += '<input type="submit" value="Submit">';
			html += '</form>';
			html += '</body>';
			html += '</html>';
			response.write(html);
			
			}
			
		}
	}
	
}

function enterEmail()
{
	nlapiLogExecution('DEBUG','enter Email','Enter');
//	var form = nlapiCreateForm('Login',true);
//	form.addField('email','text','Enter Email').setLayoutType('startrow','none');
//	form.addSubmitButton('Submit');
//	response.writePage(form);
	
	
	var html = '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=1309901&h=2532d8ad05b80c2fd4bc" method="post">';
	html += '<table align = "center" id="customers">';
	html += '<tr>';
	html += '<th colspan="2" ><span align="center">Login</span></th>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>Email: </td>';
	html += '<td><input type="email" id="useremail" name="email"></td>';
	html += '</tr>';

	html += '</table>';
	html += '<input type="submit" value="Submit">';
	html += '</form>';
	html += '</body>';
	html += '</html>';
	response.write(html);
	
}
function checkPhone(email)
{
	
	
	
	var filter = [];
	filter.push(new nlobjSearchFilter('email',null,'is',email));//fax-email
	
	var column =[];
	column.push(new nlobjSearchColumn('mobilephone'))
	
	var result = nlapiSearchRecord('partner',null,filter,column);
	if(result !=null){
		nlapiLogExecution('DEBUG','result get id',result[0].getId());
		var form = nlapiCreateForm('Login',true);
		var emailShow = form.addField('emailshow','label','Email:-'+email);
		//emailShow.setLayoutType('normal','startcol');
		
	var phone;
//	for(var i=0;i<result.length;i++)
//	{
		phone = result[0].getValue('mobilephone');
		nlapiLogExecution('DEBUG','phone',phone)
		phone = phone.split('');
		
		var phoneSt='';
		var flag=0;
		for(var j=0;j<phone.length;j++)
		{
			var st = ""+Number(phone[j])
			if(j >3 && j <phone.length && flag < 3&& st != "NaN" && phone[j] !=' ')
			{
				nlapiLogExecution('DEBUG','digit come',st);
					
					phoneSt += '*'
						flag++;
					
				
				
			}
			else{
				phoneSt +=phone[j];
			}
		}
//		nlapiLogExecution('DEBUG','phone',JSON.stringify(phone));
//		nlapiLogExecution('DEBUG','phone code',phoneSt);
//	form.addField('hint_phone','label','Phone:-'+phoneSt);
//	form.addField('pass_phone','text','Enter Phone');
//	
//	var email1 = form.addField('email','text','email').setDisplayType('hidden').setDefaultValue(email)
//
//	form.addSubmitButton('Submit');
	

		
		var html = '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=1309901&h=2532d8ad05b80c2fd4bc" method="post">';
		html += '<table align = "center" id="customers">';
		html += '<tr>';
		html += '<th colspan="2" ><span align="center">Enter Phone No.</span></th>';
		html += '</tr>';
		html += '<tr>';
		html += '<td>Email: </td>';
		html += '<td><input type="email" id="useremail" name="email" value="'+email+'"></td>';
		html += '</tr>';
		html += '<tr class="alt">';
		html += '<td>Phone No:- </td>';
		html += '<td>'+phoneSt+'</td>';
		html += '</tr>';
		
		html += '<tr class="alt">';
		html += '<td>Enter Phone No:- </td>';
		html += '<td><input type="text" id="passPhone" name="pass_phone"></td>';
		html += '</tr>';
//		html += '<tr>';
//		html += '<td colspan="2">Text. </td>';
	//	
//		html += '</tr>';
		html += '</table>';
		html += '<input type="submit" value="Submit">';
		html += '</form>';
		html += '</body>';
		html += '</html>';
		response.write(html);
		
		
		
		
		
		
		
		
		
		
//	}
	}
	else{
		nlapiLogExecution('DEBUG','no result get','NO');
//		response.write('Enter a Valid Email');
//		alert('Enter a Valid Email');
		
//		enterEmail();
	
		var html = '<form id="form" align="center" name="input" action="https://1309901.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=220&deploy=1&compid=1309901&h=2532d8ad05b80c2fd4bc" method="post">';
		html += '<table align = "center" id="customers">';
		html += '<tr>';
		html += '<th colspan="2" ><span align="center">Login</span></th>';
		html += '</tr><tr>';
		html += '<td>Email: </td>';
		html += '<td><input type="email" id="useremail" name="email"></td>';
		html += '</tr>';

		html += '<tr>';
		html += '<td colspan="2">No Record exists with this Email Id. </td>';
		
		html += '</tr>';
		html += '</table>';
		html += '<input type="submit" value="Submit">';
		html += '</form>';
		html += '</body>';
		html += '</html>';
		response.write(html);
		
	
		
	}
//	response.writePage(form);	
}


function defVal(value)
{	
	try
	{ 
	    if(value == null || value == undefined) 
	    value = '';
	    return value;
	}
	catch(ex)
	{
		body = 'defVal : '+ex;
		body += ex.name+' : '+ex.message;
		nlapiSendEmail(author,recipient,subject, body);
		nlapiLogExecution('DEBUG', ' Body : ',body);	
        return '';
	}
}



//----------------------------------------------------------------------


/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(h,i){var e={},f=e.lib={},l=f.Base=function(){function a(){}return{extend:function(j){a.prototype=this;var d=new a;j&&d.mixIn(j);d.$super=this;return d},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var d in a)a.hasOwnProperty(d)&&(this[d]=a[d]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),k=f.WordArray=l.extend({init:function(a,j){a=
this.words=a||[];this.sigBytes=j!=i?j:4*a.length},toString:function(a){return(a||m).stringify(this)},concat:function(a){var j=this.words,d=a.words,c=this.sigBytes,a=a.sigBytes;this.clamp();if(c%4)for(var b=0;b<a;b++)j[c+b>>>2]|=(d[b>>>2]>>>24-8*(b%4)&255)<<24-8*((c+b)%4);else if(65535<d.length)for(b=0;b<a;b+=4)j[c+b>>>2]=d[b>>>2];else j.push.apply(j,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-8*(b%4);a.length=h.ceil(b/4)},clone:function(){var a=
l.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],d=0;d<a;d+=4)b.push(4294967296*h.random()|0);return k.create(b,a)}}),o=e.enc={},m=o.Hex={stringify:function(a){for(var b=a.words,a=a.sigBytes,d=[],c=0;c<a;c++){var e=b[c>>>2]>>>24-8*(c%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var b=a.length,d=[],c=0;c<b;c+=2)d[c>>>3]|=parseInt(a.substr(c,2),16)<<24-4*(c%8);return k.create(d,b/2)}},q=o.Latin1={stringify:function(a){for(var b=
a.words,a=a.sigBytes,d=[],c=0;c<a;c++)d.push(String.fromCharCode(b[c>>>2]>>>24-8*(c%4)&255));return d.join("")},parse:function(a){for(var b=a.length,d=[],c=0;c<b;c++)d[c>>>2]|=(a.charCodeAt(c)&255)<<24-8*(c%4);return k.create(d,b)}},r=o.Utf8={stringify:function(a){try{return decodeURIComponent(escape(q.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return q.parse(unescape(encodeURIComponent(a)))}},b=f.BufferedBlockAlgorithm=l.extend({reset:function(){this._data=k.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,d=b.words,c=b.sigBytes,e=this.blockSize,g=c/(4*e),g=a?h.ceil(g):h.max((g|0)-this._minBufferSize,0),a=g*e,c=h.min(4*a,c);if(a){for(var f=0;f<a;f+=e)this._doProcessBlock(d,f);f=d.splice(0,a);b.sigBytes-=c}return k.create(f,c)},clone:function(){var a=l.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});f.Hasher=b.extend({init:function(){this.reset()},
reset:function(){b.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=b.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,d){return a.create(d).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return g.HMAC.create(a,d).finalize(b)}}});var g=e.algo={};return e}(Math);
(function(h){var i=CryptoJS,e=i.lib,f=e.WordArray,e=e.Hasher,l=i.algo,k=[],o=[];(function(){function e(a){for(var b=h.sqrt(a),d=2;d<=b;d++)if(!(a%d))return!1;return!0}function f(a){return 4294967296*(a-(a|0))|0}for(var b=2,g=0;64>g;)e(b)&&(8>g&&(k[g]=f(h.pow(b,0.5))),o[g]=f(h.pow(b,1/3)),g++),b++})();var m=[],l=l.SHA256=e.extend({_doReset:function(){this._hash=f.create(k.slice(0))},_doProcessBlock:function(e,f){for(var b=this._hash.words,g=b[0],a=b[1],j=b[2],d=b[3],c=b[4],h=b[5],l=b[6],k=b[7],n=0;64>
n;n++){if(16>n)m[n]=e[f+n]|0;else{var i=m[n-15],p=m[n-2];m[n]=((i<<25|i>>>7)^(i<<14|i>>>18)^i>>>3)+m[n-7]+((p<<15|p>>>17)^(p<<13|p>>>19)^p>>>10)+m[n-16]}i=k+((c<<26|c>>>6)^(c<<21|c>>>11)^(c<<7|c>>>25))+(c&h^~c&l)+o[n]+m[n];p=((g<<30|g>>>2)^(g<<19|g>>>13)^(g<<10|g>>>22))+(g&a^g&j^a&j);k=l;l=h;h=c;c=d+i|0;d=j;j=a;a=g;g=i+p|0}b[0]=b[0]+g|0;b[1]=b[1]+a|0;b[2]=b[2]+j|0;b[3]=b[3]+d|0;b[4]=b[4]+c|0;b[5]=b[5]+h|0;b[6]=b[6]+l|0;b[7]=b[7]+k|0},_doFinalize:function(){var e=this._data,f=e.words,b=8*this._nDataBytes,
g=8*e.sigBytes;f[g>>>5]|=128<<24-g%32;f[(g+64>>>9<<4)+15]=b;e.sigBytes=4*f.length;this._process()}});i.SHA256=e._createHelper(l);i.HmacSHA256=e._createHmacHelper(l)})(Math);
(function(){var h=CryptoJS,i=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(e,f){e=this._hasher=e.create();"string"==typeof f&&(f=i.parse(f));var h=e.blockSize,k=4*h;f.sigBytes>k&&(f=e.finalize(f));for(var o=this._oKey=f.clone(),m=this._iKey=f.clone(),q=o.words,r=m.words,b=0;b<h;b++)q[b]^=1549556828,r[b]^=909522486;o.sigBytes=m.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var f=
this._hasher,e=f.finalize(e);f.reset();return f.finalize(this._oKey.clone().concat(e))}})})();


/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();



