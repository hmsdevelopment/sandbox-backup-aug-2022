/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/record", "N/ui/dialog", "N/ui/message","N/redirect"], /**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{dialog} dialog
 * @param{message} message
 */
(record, dialog, message, redirect) => {
	/**
	 * Defines the Suitelet script trigger point.
	 * @param {Object} scriptContext
	 * @param {ServerRequest} scriptContext.request - Incoming request
	 * @param {ServerResponse} scriptContext.response - Suitelet response
	 * @since 2015.2
	 */
	const onRequest = (scriptContext) => {
		try {
			log.debug({
				title: "ScriptContext",
				details: scriptContext
			})
			let callingRec = record.load({
				type: scriptContext.request.parameters.type,
				id: scriptContext.request.parameters.id,
			});

			callingRec.setValue({
				fieldId: "custevent_conf_showing_time",
				value: true,
			});

			callingRec.setValue({
				fieldId: "custevent_conf_showing_time_txt",
				value:"This record has been confirmed using Suitelet Btn"
			});
			callingRec.save();
			let html = `<html><body><h1>Output is:${scriptContext.request.parameters.type} in console </h1></body></html>`;
			scriptContext.response.write(html);
			scriptContext.response.setHeader({
				name: "Response",
				value: "Unknown"
			});
			redirect.toRecord({
				id: scriptContext.request.parameters.id,
				type: scriptContext.request.parameters.type,
				isEditMode: false,
			})
		} catch (error) {
			scriptContext.response.write("Error!");
		}
	};

	return { onRequest };
});
