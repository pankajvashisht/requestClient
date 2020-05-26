const mergeConfig = require('./mergeConfig');
const { Request } = require('../Request/request');
module.exports = function dispatchRequest(config) {
	config.headers = config.headers || {};
	config.headers = mergeConfig(
		config.headers.common || {},
		config.headers[config.method] || {},
		config.headers
	);

	['delete', 'get', 'head', 'post', 'put', 'patch', 'common'].forEach(
		function cleanHeaderConfig(method) {
			delete config.headers[method];
		}
	);
	const plugin = config.plugin || Request;
	return plugin(config);
};
