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

const requestClient = new ServerRequest({ ...defaults });
requestClient.createInstance = function (config) {
	return new ServerRequest(mergeConfig({ ...defaults }, config));
};

module.exports = requestClient;
