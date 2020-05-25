'use strict';
module.exports = function responseError(
	requestError,
	config,
	code,
	request,
	response
) {
	const error = new Error(requestError);
	error.config = config;
	if (code) {
		error.code = code;
	}
	error.request = request;
	error.response = response;
	error.isConfigError = true;
	error.toJSON = function toJSON() {
		return {
			message: this.message,
			name: this.name,
			description: this.description,
			number: this.number,
			fileName: this.fileName,
			lineNumber: this.lineNumber,
			columnNumber: this.columnNumber,
			stack: this.stack,
			config: this.config,
			code: this.code,
		};
	};
	return error;
};
