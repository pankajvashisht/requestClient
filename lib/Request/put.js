const Request = require('./request');
const put = (config) => {
	config.method = 'put';
	return Request(config);
};

module.exports = put;
