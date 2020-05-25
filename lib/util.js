const httpsTest = /https:?/;
const isAbsoluteURL = (url) => {
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

const isHttps = (protocol) => {
	return httpsTest.test(protocol);
};

const getMethod = ['delete', 'get', 'head', 'options'];
const postMethod = ['post', 'put', 'patch'];

module.exports = {
	isAbsoluteURL,
	isHttps,
	getMethod,
	postMethod,
};
