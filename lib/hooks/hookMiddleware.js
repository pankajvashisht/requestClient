'use strict';
class hookMiddleware {
	constructor() {
		this.addMiddleware = [];
	}
	runMiddleware(fn) {
		this.addMiddleware.forEach(function (value) {
			if (value !== null) {
				fn(value);
			}
		});
	}

	use(resolved, rejected) {
		this.addMiddleware.push({ resolved, rejected });
		return this.addMiddleware.length - 1;
	}
}

module.exports = hookMiddleware;
