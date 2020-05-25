'use strict';

module.exports = function mergeConfig(defaultConfig, config) {
	Object.assign(defaultConfig, config);
	return defaultConfig;
};
