const ServerRequest = require('./Request/ServerRequest');
const { getMethod, postMethod } = require('./util');
const mergeConfig = require('./helper/mergeConfig');
const defaults = require('./defaults');

getMethod.forEach((method) => {
	ServerRequest.prototype[method] = function (url, config) {
		return this.request(
			mergeConfig(config || {}, {
				method,
				url,
			})
		);
	};
});
postMethod.forEach((method) => {
	ServerRequest.prototype[method] = function (url, data = {}, config) {
		return this.request(
			mergeConfig(config || {}, {
				method,
				url,
				data: data,
			})
		);
	};
});

const nivedan = new ServerRequest({ ...defaults });
nivedan.createInstance = function (config) {
	return new ServerRequest(mergeConfig({ ...defaults }, config));
};

// track all window errors

if (typeof window !== undefined) {
	window.onerror = function (msg, url, lineNo, columnNo, error) {
		if (nivedan.config.rollbar) {
			var message = msg.toLowerCase();
			var errorType = 'script error';
			if (message.indexOf(errorType) > -1) {
				nivedan.config.rollbar(message);
			} else {
				var errorDetails = {
					Message: msg,
					URL: url,
					Line: lineNo,
					Column: columnNo,
					errorDetails: error,
				};
				nivedan.config.rollbar(JSON.stringify(errorDetails));
			}
		}
	};
}

module.exports = nivedan;
