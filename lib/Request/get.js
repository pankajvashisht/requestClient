const Request = require('./request');
const get = (config) => {
	config.method = 'get';
	return Request(config);
};

module.exports = get;
