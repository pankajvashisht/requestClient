const fetch = require('../helper/fetchPollyfill');

const browerRequest = (config) => {
	const { headers = {}, data, baseURL, socketPath = null } = config;
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

	const requestUrl = mergeUrl(baseURL, urls);

	// parse url
	const { protocol, hostname, port } = url.parse(requestUrl);
	const agent = isHttps.test(protocol) ? config.httpsAgent : config.httpAgent;
	const options = {
		method: config.method.toUpperCase(),
		headers: headers,
		agent,
		agents: { http: config.httpAgent, https: config.httpsAgent },
		auth: auth,
		body: JSON.stringify(data),
	};

	if (socketPath) {
		options.socketPath = socketPath;
	} else {
		options.hostname = hostname;
		options.port = port;
	}
	return fetch(requestUrl, options);
};
window.browerRequest = browerRequest;
