'use strict';
const mergeConfig = require('../helper/mergeConfig');
const { Request } = require('./request');
class ServerRequest {
	constructor(config) {
		this.config = {};
		if (typeof config === 'object') {
			this.config = config;
		}
		this.request.bind(this);
	}

	defaultConfig(config) {
		if (typeof config === 'object') {
			this.config = mergeConfig(this.config, config);
		}
		return this.config;
	}
	request(config) {
		if (typeof config === 'string') {
			config = arguments[1] || {};
			config.url = arguments[0];
		} else {
			config = config || {};
		}
		const newConfig = this.defaultConfig(config);
		if (newConfig.method) {
			newConfig.method = newConfig.method.toLowerCase();
		} else if (this.config.method) {
			newConfig.method = this.config.method.toLowerCase();
		} else {
			newConfig.method = 'get';
		}
		return Request(newConfig);
	}
	get getConfig() {
		return this.config;
	}
}

module.exports = ServerRequest;
