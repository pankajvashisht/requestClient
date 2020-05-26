'use strict';
const Rollbar = require('rollbar');

module.exports = function (token) {
	return new Rollbar(token);
};
