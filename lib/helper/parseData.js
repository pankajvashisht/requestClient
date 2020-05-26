'use strict';
const { isArrayBufferView } = require('../util');
module.exports = function parseData(data, headers) {
	switch (true) {
		case (typeof FormData !== 'undefined' && data instanceof FormData) ||
			toString.call(data) === '[object ArrayBuffer]' ||
			(data !== null &&
				!typeof data === 'undefined' &&
				data.constructor !== null &&
				!typeof data.constructor === 'undefined' &&
				typeof data.constructor.isBuffer === 'function' &&
				data.constructor.isBuffer(data)) ||
			(typeof data === 'object' &&
				data !== null &&
				toString.call(data) === '[object Function]') ||
			toString.call(data) === '[object File]' ||
			toString.call(data) === '[object Blob]':
			return { data, headers };
		case isArrayBufferView(data):
			return { data: data.buffer, headers };

		case typeof URLSearchParams !== 'undefined' &&
			data instanceof URLSearchParams:
			headers['Content-Type'] =
				'application/x-www-form-urlencoded;charset=utf-8';
			return { data: data.toString(), headers };
		case data !== null && typeof data === 'object':
			headers['Content-Type'] = 'application/json;charset=utf-8';
			return { data: JSON.stringify(data), headers };
		default:
			return { data, headers };
	}
};
