const https = require('https');
const http = require('http');
const url = require('url');
const mergeUrl = require('../helper/mergeUrl');
const responseError = require('../helper/createErrorObject');
const { isHttps } = require('../util');
const package = require('../../package.json');
function Server(config) {
	return new Promise((resolve, reject) => {
		const { headers = {}, data = {}, socketPath = null } = config;
		if (!headers['User-Agent'] && !headers['user-agent']) {
			headers['User-Agent'] = 'requestClient/' + package.version;
		}
		// add basic auth
		let auth = undefined;
		if (config.auth) {
			const username = config.auth.username || '';
			const password = config.auth.password || '';
			auth = username + ':' + password;
			delete headers.Authorization;
		}
		const { protocol, hostname, path, port } = url.parse(config.url);
		const agent = isHttps(protocol) ? config.httpsAgent : config.httpAgent;
		const options = {
			path,
			method: config.method.toUpperCase(),
			headers: headers,
			agent,
			agents: { http: config.httpAgent, https: config.httpsAgent },
			auth: auth,
		};

		if (socketPath) {
			options.socketPath = socketPath;
		} else {
			options.hostname = hostname;
			options.port = port;
		}
		const transport = isHttps(protocol) ? https : http;
		const request = transport.request(options, function (res) {
			if (request.aborted) return;
			const lastRequest = res.req || req;
			const response = {
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: res.headers,
				config: config,
				request: lastRequest,
			};
			const responseData = [];
			res.on('data', function (data) {
				responseData.push(data);
				if (
					config.maxContentLength > -1 &&
					Buffer.concat(responseData).length > config.maxContentLength
				) {
					res.destroy();
					reject(
						responseError(
							'maxContentLength size of ' +
								config.maxContentLength +
								' exceeded',
							config,
							null,
							lastRequest
						)
					);
				}
			});
			request.on('error', function (error) {
				if (request.aborted && error.code !== 'ERR_FR_TOO_MANY_REDIRECTS')
					return;
				reject(responseError(error, config, null, request));
			});
			res.on('end', function () {
				let responseResult = Buffer.concat(responseData);
				if (config.responseType !== 'arraybuffer') {
					responseResult = responseResult.toString(config.responseEncoding);
				}
				response.data = responseResult;
				if (response.status >= 200 && response.status < 300) {
					resolve(response);
				} else {
					reject(
						responseError(
							'Request failed with status code ' + response.status,
							response.config,
							null,
							response.request,
							response
						)
					);
				}
			});
			// Handle request timeout
			if (config.timeout) {
				request.setTimeout(config.timeout, function () {
					request.abort();
					reject(
						responseError(
							'timeout of ' + config.timeout + 'ms exceeded',
							config,
							'ECONNABORTED',
							req
						)
					);
				});
			}
		});
		request.write(data);
		request.end();
	});
}

module.exports = Server;
