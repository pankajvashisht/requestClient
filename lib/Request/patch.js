const Request = require('./request');
const patch = (config) => {
	config.method = 'put';
	return Request(config);
};

module.exports = patch;
