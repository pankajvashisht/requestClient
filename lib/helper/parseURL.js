'use strict';

function encode(val) {
	return encodeURIComponent(val)
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
	var serializedParams;
	switch (true) {
		case paramsSerializer:
			serializedParams = paramsSerializer(params);
			break;
		case typeof URLSearchParams !== 'undefined' &&
			params instanceof URLSearchParams:
			serializedParams = params.toString();
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
				parseData.push(`${encode(param)}'='${encode(value)}`);
			});
			serializedParams = parseData.join('&');
			break;
	}
	if (serializedParams) {
		let hashIndex = url.indexOf('#');
		if (hashIndex !== -1) {
			url = url.slice(0, hashIndex);
		}
		url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	}
	return url;
};
