const requestClient = require('../index');
requestClient.defaultConfig({
	baseURL: 'http://3.22.163.113/apis/v1/',
	headers: {},
	errorExpand: true,
});
const axios = requestClient.createInstance({
	baseURL: 'http://pomurski-taborniki.eu/nature/apis/',
	headers: {},
	rollbarToken: 'bfca8b19cee44b6cb854bcb4cab26e97',
	rollbarConfig: {
		status: [403, 500],
	},
});
const first = (config, next) => {
	console.log(1);
	next();
};
const second = (config, next) => {
	console.log(2);
	next();
};

axios.use([first, second]);

requestClient.middleware.request.use(
	function (config) {
		config.headers['authorization_key'] =
			'c5ae472377553a6923cadbbdf5e642bdfb6ee245';
		return config;
	},
	function (error) {
		Promise.reject(error);
	}
);
axios
	.post('/forgot_password', { email: 'pankaj@gmail.com' })
	.then(({ status }) => {
		console.log(status);
	})
	.catch(({ response }) => {
		console.log(response);
	});
