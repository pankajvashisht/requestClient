'use strict';
class hookMiddleware {
	constructor() {
		this.handleMiddleware = [];
	}
	runMiddleware(fn) {
		this.handleMiddleware.forEach(function (value) {
			if (value !== null) {
				fn(value);
			}
		});
	}

	use(resolved, rejected) {
		this.handleMiddleware.push({
			resolved,
			rejected,
		});
		return this.handleMiddleware.length - 1;
	}
}

module.exports = hookMiddleware;
