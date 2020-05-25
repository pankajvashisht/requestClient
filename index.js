module.exports = require('./lib/requestClient');
const requestClient = require('./lib/requestClient');

requestClient.defaultConfig({
	baseURL: 'http://3.12.247.224/apis/v1/',
});

requestClient
	.get('/app-information')
	.then(({ data, status }) => {
		console.log(data.message);
	})
	.catch(({ response }) => {
		console.log(response);
	});
