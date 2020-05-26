const { parseHeaders, responseError } = require('../helper');
const browser = (config) => {
	return new Promise((resolve, reject) => {
		const { headers = {}, url, data = null, socketPath = null } = config;
		if (!headers['User-Agent'] && !headers['user-agent']) {
			headers['User-Agent'] = 'requestClient/' + package.version;
		}
		// add basic auth
		if (config.auth) {
			const username = config.auth.username || '';
			const password = config.auth.password || '';
			headers.Authorization = 'Basic ' + btoa(username + ':' + password);
		}
		if (socketPath) {
			options.socketPath = socketPath;
		} else {
			options.hostname = hostname;
			options.port = port;
		}
		const request = new XMLHttpRequest();
		request.open(config.method.toUpperCase(), url, true);
		request.timeout = config.timeout;
		request.onreadystatechange = function () {
			if (!request || request.readyState !== 4) {
				return;
			}
			if (
				request.status === 0 &&
				!(request.responseURL && request.responseURL.indexOf('file:') === 0)
			) {
				return;
			}
			var responseHeaders =
				'getAllResponseHeaders' in request
					? parseHeaders(request.getAllResponseHeaders())
					: null;
			const responseData =
				!config.responseType || config.responseType === 'text'
					? request.responseText
					: request.response;
			const response = {
				data: responseData,
				status: request.status,
				statusText: request.statusText,
				headers: responseHeaders,
				config: config,
				request: request,
			};
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
			request = null;
		};
		request.onabort = () => {
			if (!request) {
				return;
			}
			reject(responseError('Request aborted', config, 'ECONNABORTED', request));
			request = null;
		};
		request.onerror = () => {
			reject(responseError('Network Error', config, null, request));
			request = null;
		};
		request.ontimeout = () => {
			let ErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
			if (config.timeoutErrorMessage) {
				ErrorMessage = config.timeoutErrorMessage;
			}
			reject(responseError(ErrorMessage, config, 'ECONNABORTED', request));
			request = null;
		};
		if ('setRequestHeader' in request) {
			Object.keys(headers).forEach((key) => {
				if (
					typeof data === 'undefined' &&
					key.toLowerCase() === 'content-type'
				) {
					// Remove Content-Type if data is undefined
					delete headers[key];
				} else {
					const value = headers[key];
					request.setRequestHeader(key, value);
				}
			});
		}
		if (typeof config.withCredentials !== 'object') {
			request.withCredentials = !!config.withCredentials;
		}

		if (config.responseType) {
			try {
				request.responseType = config.responseType;
			} catch (e) {
				// Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
				// But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
				if (config.responseType !== 'json') {
					throw e;
				}
			}
		}
		if (typeof config.onDownloadProgress === 'function') {
			request.addEventListener('progress', config.onDownloadProgress);
		}
		if (typeof config.onUploadProgress === 'function' && request.upload) {
			request.upload.addEventListener('progress', config.onUploadProgress);
		}
		if (typeof config.loadstart === 'function') {
			request.addEventListener('loadstart', config.loadstart);
		}
		if (typeof config.load === 'function') {
			request.addEventListener('load', config.load);
		}
		if (typeof config.loadend === 'function') {
			request.addEventListener('loadend', config.loadend);
		}
		request.send(data);
	});
};
module.exports = browser;
