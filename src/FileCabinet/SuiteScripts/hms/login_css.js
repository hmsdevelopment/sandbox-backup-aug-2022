/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       09 Jun 2017     Admin
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){
	var filename='https://1309901.app.netsuite.com/core/media/media.nl?id=30060&c=1309901&h=c1affd8dda9387b99fb8&_xt=.css';
//var file = location.pathname.split( "/" ).pop();

var link = document.createElement( "link" );
link.href =filename;// file.substr( 0, file.lastIndexOf( "." ) ) + ".css";
link.type = "text/css";
link.rel = "stylesheet";
link.media = "screen,print";

document.getElementsByTagName( "head" )[0].appendChild( link );
  
  //loadjscssfile(filename, filetype) 
}

function loadjscssfile(filename, filetype) {
	  if (filetype == "js") { //if filename is a external JavaScript file
	    // alert('called');
	    var fileref = document.createElement('script')
	    fileref.setAttribute("type", "text/javascript")
	    fileref.setAttribute("src", filename)
	    alert('called');
	  } else if (filetype == "css") { //if filename is an external CSS file
	    var fileref = document.createElement("link")
	    fileref.setAttribute("rel", "stylesheet")
	    fileref.setAttribute("type", "text/css")
	    fileref.setAttribute("href", filename)
	  }
	  if (typeof fileref != "undefined")
	    document.getElementsByTagName("head")[0].appendChild(fileref)
	}