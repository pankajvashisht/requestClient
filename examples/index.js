const requestClient = require('../index');
requestClient.defaultConfig({
	baseURL: 'http://3.22.163.113/apis/v1/',
	headers: {},
});
const first = (config, next) => {
	console.log(1);
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
		config.headers['authorization_key'] =
			'c5ae472377553a6923cadbbdf5e642bdfb6ee245';
		console.log(config);
		return config;
	},
	function (error) {
		Promise.reject(error);
	}
);
requestClient
	.post('/add-goal', { goal_id: 4 })
	.then(({ status }) => {
		console.log(status);
	})
	.catch((response) => {
		console.log(response);
	});
