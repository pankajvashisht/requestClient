'use strict';

function encode(val) {
	var newValue = val.replace(/"/g, '');
	return encodeURIComponent(newValue)
		.replace(/%40/gi, '@')
		.replace(/%3A/gi, ':')
		.replace(/%24/g, '$')
		.replace(/%2C/gi, ',')
		.replace(/%20/g, '+')
		.replace(/%5B/gi, '[')
		.replace(/%5D/gi, ']');
}

module.exports = function parseURL(url, params, paramsSerializer) {
	if (!params) {
		return url;
	}
	var parseParams;
	switch (true) {
		case paramsSerializer:
			parseParams = paramsSerializer(params);
			break;
		case typeof URLSearchParams !== 'undefined' &&
			params instanceof URLSearchParams:
			parseParams = params.toString();
		default:
			const parseData = [];
			if (typeof params !== 'object') {
				params = [params];
			}
			Object.keys(params).forEach((param) => {
				let value = params[param];
				if (toString.call(value) === '[object Date]') {
					value = value.toISOString();
				} else if (value !== null || typeof value === 'object') {
					value = JSON.stringify(value);
				}
				parseData.push(`${encode(param)}=${encode(value)}`);
			});
			parseParams = parseData.join('&');
			break;
	}
	if (parseParams) {
		let hashIndex = url.indexOf('#');
		if (hashIndex !== -1) {
			url = url.slice(0, hashIndex);
		}
		url += (url.indexOf('?') === -1 ? '?' : '&') + parseParams;
	}
	return url;
};
