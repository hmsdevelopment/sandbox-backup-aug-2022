/**
* @NApiVersion 2.x
* @NScriptType Suitelet
* @NModuleScope SameAccount
*/

define([],

function() {

    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */

    function onRequest(context) {
      
      	log.debug("Start");
    	
    	log.debug("Context", context);
    	log.debug("Parameters", context.request.parameters);
        var params = context.request.parameters;
        var outputHTML = "<h2>Received Data from PDF</h2>";
        var paramHTML = "";
      
     	 for (var param in params) {
    		if (params.hasOwnProperty(param)) {
        	paramHTML += "<br>" + param + " = " + params[param];
            }
    	}
           
        
     	var objJSON = JSON.stringify(params);
        outputHTML += paramHTML;
 
        context.response.write(outputHTML);
        context.response.write('<br /><br />JSON<br />' + objJSON);
    	
    	log.debug("End");
      
      /**
      var html ='<html><head><title>Test PDF</title>'+
            '<script src="//integrations-static.pdffiller.com/1.1.0/PDFfillerClient.js"></script>'+
            '<script>'+
            'function initPDF(){'+
            'PDFfiller.init({'+
                        'client_id: "aa1507c5b807796d",'+
                        'url: "https://pdf.ac/4DUMmb",'+
                        'width: "960",'+
                        'events: {'+
                        '     opened: function () {'+
                        '     },'+
                        '     error: function () {'+
                        '     },'+
                        '     closed: function () {'+
                        '     },'+
                        '     completed: function () {'+
                        '     },'+
                        '     in_progress: function () {'+
                        '     }'+
                        '},'+
                        'editorModules: {'+
                        '     "buttonHelp": true,'+ 
                        '     "buttonFeedback": false,'+
                        '     "buttonSearch": true,'+
                        '     "toolsArrow": true,'+
                        '     "toolsLine": false,'+
                        '     "toolsPen": true,'+
                        '     "toolsSticky": false'+
                        '}'+
                  '});'+
            '}'+
            '</script>'+
            '</head><body onload="initPDF()">PDF Test</body></html>';

      context.response.write(html);
      
      **/
    }

    return {
        onRequest: onRequest
    };
});