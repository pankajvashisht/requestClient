const mergeConfig = require('./mergeConfig');
const { mergeUrl, parseURL, parseData, createResponse } = require('./index');
const package = require('../../package.json');
module.exports = function dispatchRequest(config) {
	const { url, data, baseURL, params } = config;
	config.headers = config.headers || {};
	config.headers = mergeConfig(
		config.headers,
		Object.assign(
			config.headers.common || {},
			config.headers[config.method] || {}
		)
	);
	if (!config.headers['User-Agent'] && !config.headers['user-agent']) {
		config.headers['User-Agent'] = 'requestClient/' + package.version;
	}
	// add basic auth
	let auth = undefined;
	if (config.auth) {
		const username = config.auth.username || '';
		const password = config.auth.password || '';
		auth = username + ':' + password;
		delete config.headers.Authorization;
	}
	const newUrl = mergeUrl(baseURL, url);
	config.url = parseURL(newUrl, params);
	['delete', 'get', 'head', 'post', 'put', 'patch', 'common'].forEach(
		(method) => {
			delete config.headers[method];
		}
	);
	if (data) {
		const parsedata = parseData(data, config.headers);
		config.data = parsedata.data;
		config.headers = mergeConfig(config.headers, parsedata.headers);
	}
	const plugin = config.plugin;
	return plugin(config).then(
		(response) => {
			response.data = createResponse(response.data, response.headers);
			if (config.dataOnly) {
				return response.data;
			}
			return response;
		},
		function (error) {
			return Promise.reject(error);
		}
	);
};
