/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/record", "N/ui/serverWidget", "N/ui/message", "N/http", "N/url", "N/runtime"],(record, serverWidget, message, http, url, runtime) => {
	var exports ={};
	/**
	 * Defines the function definition that is executed before record is loaded.
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
	 * @param {Form} scriptContext.form - Current form
	 * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
	 * @since 2015.2
	 */
	//const TestingPop = "Hello There";
	const buttonClk = (scriptContext) => {
		log.debug({
			title: "Button:",
			details: "Button has been clicked!!"
		});
	};

	const beforeLoad = (scriptContext) => {
		let curForm = scriptContext.form;
		curForm.addButton({
			id: "custpage_testBtn",
			label: "Clicke ME!!!",
			functionName: "buttonClk()"
		})
		if (scriptContext.type == "view") {
			
			log.debug("Form: ", scriptContext.form);
			log.debug("Request: ", scriptContext.request);
			log.debug("Type: ", scriptContext.type);
			let objRecord = record.load({
				type: scriptContext.newRecord.type,
				id: scriptContext.newRecord.id
			});

			curForm.addButton({
				id: "custpage_newBtn",
				label: "New A/I",
				functionName: 'window.open("https://1309901-sb1.app.netsuite.com/app/crm/support/supportcase.nl?whence=","_self")'
			});
			curForm.addButton({
				id: "custpage_testBtn",
				label: "Clicke ME!!!",
				functionName: "buttonClk"
			})
			let spamLockBtn = curForm.getButton({
				id: "setSpamLock"
			});
			let mergeBtn = curForm.getButton({
				id: "merge"
			});

			mergeBtn.isHidden = true;
			spamLockBtn.isHidden = true;

			let boxValue = objRecord.getValue({
				fieldId: "custevent_conf_showing_time"
			});

			let suiteletUrl = url.resolveScript({
				deploymentId: "customdeploy_suitelet_showing",
				scriptId: "customscript1765",
				params: {
					id: scriptContext.newRecord.id,
					type: scriptContext.newRecord.type
				}
			});

			curForm.addButton({
				id: "custpage_btn_ue_script",
				label: "Suitelet Btn",
				functionName: `window.open("${suiteletUrl}","_self")`
			});

			if (scriptContext.type == "view") {
				if (boxValue == true) {
					objRecord.setText({
						fieldId: "custevent_conf_showing_time_txt",
						text: ""
					});
				} else {
					objRecord.setText({
						fieldId: "custevent_conf_showing_time_txt",
						text: "This Appointment hasn't been confirmed"
					});
				}

				objRecord.save();
			}
		}
	};

	/**
	 * Defines the function definition that is executed before record is submitted.
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {Record} scriptContext.oldRecord - Old record
	 * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
	 * @since 2015.2
	 */
	const beforeSubmit = (scriptContext) => {};

	/**
	 * Defines the function definition that is executed after record is submitted.
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.newRecord - New record
	 * @param {Record} scriptContext.oldRecord - Old record
	 * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
	 * @since 2015.2
	 */
	const afterSubmit = (scriptContext) => {
		log.debug("ScriptText(After): ", scriptContext.newRecord);
		return true;
	};
	
	exports.beforeLoad = beforeLoad;
	exports.beforeSubmit = beforeSubmit;
	exports.afterSubmit = afterSubmit;
	exports.buttonClk = buttonClk;

	return exports;
});
/* 
define(["N/record"], function (record) {
	return {
		showTime: function (record) {
			let curRec = record.load({
				type: scriptContext.newRecord.type,
				id: scriptContext.newRecord.id,
			})
			let boxValue = curRec.getValue({
				fieldId: "custevent_conf_show_time"
			});
			if (boxValue != true) {
				curRec.setValue({
					fieldId: "custevent_conf_show_time",
					value: true
				});
			}
			curRec.save();
		}
	};
}); */
