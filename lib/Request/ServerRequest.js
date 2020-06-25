'use strict';
const EventEmitter = require('events');
const mergeConfig = require('../helper/mergeConfig');
const hookMiddleware = require('../hooks/hookMiddleware');
const dispatchRequest = require('../helper/dispatchRequest');
const rollBarConfig = require('../plugin/rollbar');
class ServerRequest extends EventEmitter {
	constructor(config) {
		super();
		this.config = {};
		if (typeof config === 'object') {
			this.config = config;
		}
		if (config.rollbarToken) {
			this.configRollbar(config.rollbarToken);
		}
		this.request.bind(this);
		this.triggerError.bind(this);
		this.middlewares = [dispatchRequest, undefined];
		this.additionalMiddleware = [];
		this.additionalConfig = [];
		this.middleware = {
			request: new hookMiddleware(),
			response: new hookMiddleware(),
		};
	}

	defaultConfig(config) {
		this.config = { ...this.config, ...config };
		if (config.rollbarToken && config.rollbarToken.length) {
			this.configRollbar(config.rollbarToken);
		}
		return this;
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
		config = { ...this.config, ...config };
		if (config.method) {
			config.method = config.method.toLowerCase();
		} else if (this.config.method) {
			config.method = this.config.method.toLowerCase();
		} else {
			config.method = 'get';
		}
		this.runMiddleware(0, this.additionalMiddleware.length);
		const middleware = [...this.middlewares];
		var promise = Promise.resolve(config);
		this.middleware.request.runMiddleware(function (callback) {
			middleware.unshift(callback.resolved, callback.rejected);
		});
		this.middleware.response.runMiddleware(function (callback) {
			middleware.push(callback.resolved, callback.rejected);
		});
		let totalMethod = middleware.length;
		while (middleware.length) {
			promise = promise.then(middleware.shift(), middleware.shift());
			totalMethod -= 2;
		}
		// event trigger for error
		this.triggerError(promise);
		return promise;
	}
	get getDefaultConfig() {
		return this.config;
	}
	get getAllConfig() {
		return this.additionalConfig;
	}
	triggerError(promise) {
		promise.catch((err) => {
			try {
				this.emit('error', err);
			} catch (err) {}
		});
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

ServerRequest.prototype.setConfig = function (key, value) {
	this.additionalConfig = { ...this.additionalConfig, [key]: value };
};

ServerRequest.prototype.getConfig = function (key) {
	return this.additionalConfig[key] || {};
};

ServerRequest.prototype.removeConfig = function (key) {
	delete this.additionalConfig[key];
};

module.exports = ServerRequest;
