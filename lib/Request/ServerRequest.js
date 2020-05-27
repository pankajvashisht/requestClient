'use strict';
const mergeConfig = require('../helper/mergeConfig');
const hookMiddleware = require('../hooks/hookMiddleware');
const dispatchRequest = require('../helper/dispatchRequest');
const rollBarConfig = require('../plugin/rollbar');
class ServerRequest {
	constructor(config) {
		this.config = {};
		if (typeof config === 'object') {
			this.config = config;
		}
		if (config.rollbarToken) {
			this.configRollbar(config.rollbarToken);
		}
		this.request.bind(this);
		this.middlewares = [dispatchRequest];
		this.additionalMiddleware = [];
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
		if (Array.isArray(fn)) {
			fn.forEach((callback) => {
				this.additionalMiddleware.push(callback);
			});
		} else {
			this.additionalMiddleware.push(fn);
		}
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
		this.runMiddleware(0, this.additionalMiddleware.length);
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
		return promise;
	}
	get getConfig() {
		return this.config;
	}
}

ServerRequest.prototype.runMiddleware = function (index, count) {
	if (index < count) {
		this.additionalMiddleware[index].apply(null, [
			this.config,
			() => this.runMiddleware(index + 1, count),
		]);
	}
};

ServerRequest.prototype.configRollbar = function (token) {
	this.config.rollbar = rollBarConfig(token);
};

ServerRequest.prototype.resolve = function (promises) {
	return Promise.all(promises);
};

ServerRequest.prototype.expand = function (callbackMethod) {
	return function (array) {
		return callbackMethod.apply(null, array);
	};
};

module.exports = ServerRequest;
