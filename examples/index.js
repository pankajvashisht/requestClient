const nivedan = require('../index');
// nivedan
// 	.get('https://api.github.com/users/mzabriskie')
// 	.then((data) => {
// 		console.log(data);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});
nivedan.defaultConfig({
	baseURL: 'http://3.22.163.113/apis/v1/',
	headers: {},
	errorExpand: true,
});
const axios = nivedan.createInstance({
	baseURL: 'http://pomurski-taborniki.eu/nature/apis/',
	headers: {},
	rollbarToken: '',
	rollbarConfig: {
		status: [403, 500],
	},
	errorExpand: true,
	dataOnly: true,
	errorMessageKey: 'error_message',
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

axios.middleware.request.use(
	function (config) {
		console.log('i am running first');
		console.log(config);
		config.headers['authorization_key'] =
			'c5ae472377553a6923cadbbdf5e642bdfb6ee245';
		return config;
	},
	function (error) {
		Promise.reject(error);
	},
);
axios.middleware.response.use(
	function (response) {
		return response;
	},
	function (error) {
		return Promise.reject(error);
	},
);
axios
	.post('/forgot_password', { email: 'pankaj@gmail.com' })
	.then(({ status }) => {
		//console.log(status);
		axios.emit('event', 'pankaj vashisht');
	})
	.catch((response) => {
		axios.emit('event', 'pankaj vashisht');
		console.log(response);
	});

axios
	.get('https://api.github.com/users/pankajvashisht')
	.then((data) => {
		console.log('dsdsd', data);
	})
	.catch((err) => {
		console.log(err);
	});

axios.on('event', (name) => {
	console.log(name);
});
