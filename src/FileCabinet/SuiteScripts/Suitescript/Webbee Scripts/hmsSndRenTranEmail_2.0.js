	/**
	 * @NApiVersion 2.x
	 * @NScriptType UserEventScript
	 * @NModuleScope SameAccount
	 */
	define(['N/ui/dialog','N/record', 'N/ui/serverWidget','N/url','N/http'],
	function(dialog,record,serverWidget,url,http) {
	var details = '';
	
	//var url = url.resolveScript({
	//    scriptId: 114,
	//    deploymentId:1,
	//    returnExternalUrl: true
	//});
	function sendRenTran(scriptContext)
	{
		log.debug('sendRenTran function started');
		try
		{
		
			  var type = scriptContext.type;
	      log.debug(type);
	      var record = scriptContext.newRecord
	      var form = scriptContext.form
			  if(scriptContext.type=='view')
	      		{
				var id = record.id;
				log.debug("ID",id);
			//	var url = "window.open('https://www.google.com/');";
				var url = 'https://1309901.app.netsuite.com/app/site/hosting/scriptlet.nl?script=438&deploy=1&recordid='+id;
				/*var url1 = url.resolveScript({
			    scriptId: 438,
			    deploymentId:1,
			    returnExternalUrl: true,
			    params:{'id':id}
			});		*/
				
				//var openscript = 'window.open(\''+url+'\',\'_blank\')';
				     form.addButton({
			    	 id:'custpage_email_ren_tran',
			    	 label:'Test Button Name ',
			    	//functionName:'window.open("'+url1+'")'
			    	 functionName:callSuitelet(url)
			     });
	//			     var response = http.get({
	//			         url: "https://www.google.com"
	//			     });
	//			     log.debug({
	//			    	 title:'response',
	//			    	 details:response
	//			     });
	      		}
	      
		}
		  catch(ex)
		   {
			  details = 'Exception ,sendRenTran  ';
			  details +='Name : '+ex.name+', Message : '+ex.message;
			  log.debug({
				  title:'Body : ',
				  details:details
			  });
		   }
			log.debug({
				title:'sendRenTran function end'
			}); 
	}
	
 function callSuitelet(url,id){
		
		//var url= suiteletURL+'recId='+record.id;
	  log.debug('enter in suitelet');
//	    redirect.toSuitelet({
//	        scriptId: 438 ,
//	        deploymentId: 1
//	      
//	    });
	  log.debug({
		 title:'url',
		 details:url
	  });
	  log.debug({
		 title:'id',
		 details:id
	  });
	  
	  var url1= url
	  log.debug({
			 title:'url1',
			 details:url1
		  });
	    var response = http.post({
	        url:"www.google.com"
	    });
	    location.reload();
	  

//	  log.debug('exit form suitelet');
//	    location.reload();
		
	}
	
	
	
	
	return {
		beforeLoad:sendRenTran
	  
	};
	});
