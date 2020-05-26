const httpsTest = /https:?/;
const isAbsoluteURL = (url) => {
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

const isHttps = (protocol) => {
	return httpsTest.test(protocol);
};

const getMethod = ['delete', 'get', 'head', 'options'];
const postMethod = ['post', 'put', 'patch'];
const isArrayBufferView = (val) => {
	let result;
	if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
		result = ArrayBuffer.isView(val);
	} else {
		result = val && val.buffer && val.buffer instanceof ArrayBuffer;
	}
	return result;
};
module.exports = {
	isAbsoluteURL,
	isHttps,
	getMethod,
	postMethod,
	isArrayBufferView,
};
