module.exports = require('./lib/requestClient');
const requestClient = require('./lib/requestClient');

requestClient.defaultConfig({
	baseURL: 'http://3.12.247.224/apis/v1/',
});
requestClient.middleware.request.use(
	function (config) {
		console.log('1');
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
