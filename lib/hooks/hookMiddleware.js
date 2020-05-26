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

	use(fulfilled, rejected) {
		this.handleMiddleware.push({
			fulfilled,
			rejected,
		});
		return this.handleMiddleware.length - 1;
	}
}

module.exports = hookMiddleware;
