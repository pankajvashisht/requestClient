const requestClient = require('../index');
requestClient.defaultConfig({
	baseURL: 'http://3.12.247.224/apis/v1/',
});
const first = (config, next) => {
	console.log(1, config);
	next();
};
const second = (config, next) => {
	console.log(2);
	next();
};

requestClient.use([first, second]);

requestClient.middleware.request.use(
	function (config) {
		console.log(config);
		return config;
	},
	function (error) {
		Promise.reject(error);
	}
);
requestClient
	.get('/app-information')
	.then((data) => {
		//console.log(data);
	})
	.catch((response) => {
		console.log(response);
	});
