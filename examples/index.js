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
	dataOnly: true,
});
nivedan.setConfig('dev', {
	name: 'PankajVashisht',
	age: '25',
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
	allowSuccessStatus: (status) => status < 500,
});
const first = (config, next) => {
	console.log(1);
	next();
};
const second = (config, next) => {
	console.log(2);
	next();
};

// axios.use([first, second]);

// axios.middleware.request.use(
// 	function (config) {
// 		console.log('i am running first');
// 		config.headers['authorization_key'] =
// 			'c5ae472377553a6923cadbbdf5e642bdfb6ee245';
// 		return config;
// 	},
// 	function (error) {
// 		Promise.reject(error);
// 	},
// );
// axios.middleware.response.use(
// 	function (response) {
// 		return response;
// 	},
// 	function (error) {
// 		return Promise.reject(error);
// 	},
// );
// axios
// 	.post('/forgot_password', { email: 'pankaj@gmail.com' })
// 	.then((data) => {
// 		console.log(data);
// 		//axios.emit('event', 'pankaj vashisht');
// 	})
// 	.catch((response) => {
// 		//	axios.emit('event', 'pankaj vashisht');
// 	});

// axios
// 	.get('https://api.github.com/users/pankajvashisht')
// 	.then((data) => {
// 		//console.log('dsdsd', data);
// 	})
// 	.catch((err) => {
// 		//console.log(err);
// 	});
nivedan
	.resolve([
		nivedan.get('https://api.github.com/users/pankajvashishts', {
			params: {
				id: '123',
				name: 'pankaj',
			},
		}),
		nivedan.get('https://api.github.com/users/pankajvashisht-ucreate'),
	])
	.then(
		nivedan.expand(function (acct, perms) {
			//console.log(perms);
		})
	)
	.catch((error) => {
		console.log('first');
	});
axios.on('event', (name) => {
	console.log(name);
});
nivedan.on('error', (data) => {
	console.log('enter');
	console.log('checking', data);
});
console.log(nivedan.getConfig('dev'));
