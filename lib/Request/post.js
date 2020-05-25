const Request = require('./request');
const post = (config) => {
	config.method = 'post';
	return Request(config);
};

module.exports = post;
