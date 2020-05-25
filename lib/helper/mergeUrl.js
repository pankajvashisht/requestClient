'use strict';
const { isAbsoluteURL } = require('../util');
module.exports = function mergeUrl(baseURL, endPoints) {
	if (baseURL && !isAbsoluteURL(endPoints)) {
		return endPoints
			? baseURL.replace(/\/+$/, '') + '/' + endPoints.replace(/^\/+/, '')
			: baseURL;
	}
	return endPoints;
};
