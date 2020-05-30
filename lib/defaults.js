'use strict';
const enablePlugin = () => {
	let plugin = '';
	if (typeof XMLHttpRequest !== 'undefined') {
		plugin = require('./plugin/browser');
	} else if (
		typeof process !== 'undefined' &&
		Object.prototype.toString.call(process) === '[object process]'
	) {
		plugin = require('./plugin/server');
	}
	return plugin;
};

const defaults = {
	plugin: enablePlugin(),
	timeout: 0,
	xsrfCookieName: 'XSRF-TOKEN',
	xsrfHeaderName: 'X-XSRF-TOKEN',
	maxContentLength: -1,
	maxBodyLength: -1,
	headers: {},
	allowSuccessStatus: function (status) {
		return status < 300;
	},
};

defaults.headers = {
	common: {
		Accept: 'application/json, text/plain, */*',
	},
};

module.exports = defaults;
