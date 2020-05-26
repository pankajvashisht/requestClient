'use strict';
const mergeConfig = require('../helper/mergeConfig');
const { Request } = require('./request');
const hookMiddleware = require('../hooks/hookMiddleware');
const dispatchRequest = require('../helper/dispatchRequest');
class ServerRequest {
	constructor(config) {
		this.config = {};
		if (typeof config === 'object') {
			this.config = config;
		}
		this.request.bind(this);
		this.middlewares = [dispatchRequest];
		this.middleware = {
			request: new hookMiddleware(),
			response: new hookMiddleware(),
		};
	}

	defaultConfig(config) {
		if (typeof config === 'object') {
			this.config = mergeConfig(this.config, config);
		}
		return this.config;
	}
	use(fn) {
		this.middlewares.push(fn);
	}
	request(config) {
		if (typeof config === 'string') {
			config = arguments[1] || {};
			config.url = arguments[0];
		} else {
			config = config || {};
		}
		config = this.defaultConfig(config);
		if (config.method) {
			config.method = config.method.toLowerCase();
		} else if (this.config.method) {
			config.method = this.config.method.toLowerCase();
		} else {
			config.method = 'get';
		}
		const middleware = this.middlewares;
		var promise = Promise.resolve(config);
		this.middleware.request.runMiddleware(function (callback) {
			middleware.unshift(callback.fulfilled, callback.rejected);
		});
		this.middleware.response.runMiddleware(function (callback) {
			middleware.push(callback.fulfilled, callback.rejected);
		});
		let totalMethod = middleware.length;
		while (totalMethod) {
			promise = promise.then(middleware.shift(), middleware.shift());
			totalMethod--;
		}
		console.log('4', promise);
		return promise;
	}
	get getConfig() {
		return this.config;
	}
}

module.exports = ServerRequest;
