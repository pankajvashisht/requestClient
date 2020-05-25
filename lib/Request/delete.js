const Request = require('./request');
const deleteMethod = (config) => {
	config.method = 'delete';
	return Request(config);
};

module.exports = deleteMethod;
