const requestClient = require('../index');
requestClient.defaultConfig({
	baseURL: 'http://3.12.247.224/apis/v1/',
});
requestClient.middleware.request.use(
	function (config) {
		return config;
	},
	function (error) {
		Promise.reject(error);
	}
);
requestClient
	.get('/app-information')
	.then((data) => {
		console.log(data);
	})
	.catch((response) => {
		console.log(response);
	});
