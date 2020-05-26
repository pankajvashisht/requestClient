const mergeUrl = require('./mergeUrl');
const parseURL = require('./parseURL');
const parseData = require('./parseData');
const dispatchRequest = require('./dispatchRequest');
const createErrorObject = require('./createErrorObject');
const createResponse = require('./createResponse');
const mergeConfig = require('./mergeConfig');
const parseHeaders = require('./parseHeaders');
module.exports = {
	mergeUrl,
	parseURL,
	parseData,
	dispatchRequest,
	createErrorObject,
	createResponse,
	mergeConfig,
	parseHeaders,
};
