/**
 *@NApiVersion 2.x
 *@NScriptType Portlet
 */

// This sample creates a portlet that includes a simple form with a text field and a submit button
define([], function() {
    function render(params) {
        var portlets = params.portlet;
        portlets.title = 'Simple Form Portlet';
      var content = '<td><span><b>Hello!!!</b></span></td>';
        params.portlet.html = content;
/*      var fld = portlets.addField({
        id: 'textfield',
        type: 'text',
        label: 'Text'
      });*/
        /*var fld = portlet.addField({
            id: 'text',
            type: 'text',
            label: 'Text'
        });
        fld.updateLayoutType({
            layoutType: 'normal'
        });
        fld.updateBreakType({
            breakType: 'startcol'
        });
        portlet.setSubmitButton({
            url: 'http://httpbin.org/post',
            label: 'Submit',
            target: '_top'
        });*/
      
    }

    return {
        render: render
    };
});