const ServerRequest = require('./Request/ServerRequest');
const { getMethod, postMethod } = require('./util');
const mergeConfig = require('./helper/mergeConfig');
const { get, post, deleteMethod, patch, put } = require('./Request');
const Methods = {
	get,
	post,
	deleteMethod,
	patch,
	put,
};

const requestClient = new ServerRequest();
requestClient.createInstance = function (config) {
	return new ServerRequest(config);
};
getMethod.forEach((method) => {
	requestClient[method] = function (url, config) {
		return this.request(
			mergeConfig(config || {}, {
				method,
				url,
			})
		);
	};
});
postMethod.forEach((method) => {
	requestClient[method] = function (url, data = {}, config) {
		return this.request(
			mergeConfig(config || {}, {
				method,
				url,
				data: data,
			})
		);
	};
});
module.exports = requestClient;
