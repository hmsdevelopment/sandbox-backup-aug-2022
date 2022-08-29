/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope Public
 */
define(['N/runtime','N/search','N/record'],

function(runtime,s,record) {
	
	var MAX_LOOKUPS = 20;
	var LOOKUP_ATTEMPT = 1;
	var LOOKUP_ID;
	
	function pageInit(context){
//		console.log("list contract initializing...");
//		LOOKUP_ID = window.setInterval(checkStatus, 1000);
//		console.log("Interval Set: " + LOOKUP_ID);
		
		setTimeout(function(){
			   window.location.reload(1);
			}, 3500);
	}
	
	function checkStatus(){
		if(LOOKUP_ATTEMPT<MAX_LOOKUPS){
			console.log("Checking status.  Number of attempts: "+ LOOKUP_ATTEMPT);
			if(LOOKUP_ATTEMPT==8){
				pdf_status.innerHTML = '<span style="color:#fff;background-color:#4caf50;display:inline-block;padding-left:8px;padding-right:8px;text-align:center;" >Processing</span>';
			}
			
			if(LOOKUP_ATTEMPT==14){
				pdf_status.innerHTML = '<span style="color:#fff;background-color:#4caf50;display:inline-block;padding-left:8px;padding-right:8px;text-align:center;" >Rendering</span>';
			}
			
			if(LOOKUP_ATTEMPT==19){
				pdf_status.innerHTML = '<a href="#">Completed File</a>';
			}
			
			LOOKUP_ATTEMPT++;
		}else{
			console.log("clearing interval with an id of " + LOOKUP_ID);
			window.clearInterval(LOOKUP_ID);
			console.log("cleared");
		}
	}
	
	
    return {
        pageInit: pageInit,
    };
    
});
