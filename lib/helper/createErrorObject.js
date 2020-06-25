'use strict';

const errorExpands = (
	{
		response,
		request,
		message,
		config,
		response: { data = {}, statusText, status } = {},
	},
	errorKey
) => {
	var errorData = JSON.parse(data);
	switch (true) {
		case response && data && status >= 400 && status !== 404 && status <= 499:
			return returnErrorObject(
				true,
				errorData,
				errorData[errorKey] || statusText,
				false,
				status
			);

		case response && status >= 500:
			return returnErrorObject(false, null, statusText, true, status);
		case response && status >= 300 && status <= 399:
			return returnErrorObject(false, null, statusText, true, status);
		case response && status === 404:
			return returnErrorObject(
				true,
				errorData,
				errorData[errorKey] || statusText,
				false,
				status
			);

		case !response && request:
			return returnErrorObject(false, null, request, false, null);

		case !!message:
			return returnErrorObject(false, null, message, false, null);

		default:
			return returnErrorObject(false, null, config, false, null);
	}
};

const returnErrorObject = (
	clientError,
	errorDetails,
	message,
	serverError,
	status
) => ({
	clientError,
	errorDetails,
	message,
	serverError,
	status,
});

const trackError = (rollbar, status, error, configStatus) => {
	if (!status) {
		return rollbar.error(error);
	}
	if (Array.isArray(configStatus) && configStatus.indexOf(status) === '-1') {
		return false;
	}
	rollbar.error(error);
};

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
	error.Expend = function () {
		return {
			message: this.message || '',
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
	if (config.rollbar) {
		trackError(
			config.rollbar,
			error.response.status,
			error,
			config.rollbarConfig
		);
	}
	if (config.errorExpand) {
		return errorExpands(error, config.errorMessageKey);
	}

	return error;
};
