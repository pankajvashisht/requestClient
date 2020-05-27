# requestClient

[![npm version]

Promise based HTTP client for the browser and node.js

## Features

- Make [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) from the browser
- Make [http](http://nodejs.org/api/http.html) requests from node.js
- Supports the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- middleware request and response
- Transform request and response data
- Run time middleware
- Automatic transforms for JSON data
- Rollbar Error tracking
- Error expend _Error with details_
- React Hooks
- Event Emitter
- Client side support for protecting against [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Latest ✔                                                                                 | Latest ✔                                                                                    | Latest ✔                                                                                 | Latest ✔                                                                              | Latest ✔                                                                           | 11 ✔                                                                                                                         |

## Installing

Using npm:

```bash
$ npm install requestClient
```

Using bower:

```bash
$ bower install requestClient
```

Using yarn:

```bash
$ yarn add requestClient
```

## Example

### nodejs usage

```js
const requestClient = require('requestClient');

requestClient
	.get('/url')
	.then(function (response) {
		// handle success
		console.log(response);
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	});

// Get request with query parameters

requestClient
	.get('/url', {
		params: {
			key: value,
		},
	})
	.then(function (response) {
		// handle success
		console.log(response);
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	});

// Modern browser request with async and await
// with async await always used the try catch for error handling

async const method = () => {
	try {
		const response = await requestClient.get('/url');
		console.log(response);
	} catch (error) {
		console.error(error);
	}
}

// handle the multiple request togather. Its similar like promise.all
requestClient
	.resolve([requestClient.get('/url'), requestClient.get('/url')])
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});

// if you want to expand the requestClient.resolve result then use the requestClient.expend

requestClient
	.resolve([requestClient.get('/url'), requestClient.get('/url')])
	.then(
		requestClient.expend(function (acct, perms) {
			// Both requests are now complete
		})
	);
```

### Request method aliases

// you will send array or parameter

##### requestClient.request(config)

##### requestClient.get(url[, config])

##### requestClient.delete(url[, config])

##### requestClient.head(url[, config])

##### requestClient.options(url[, config])

##### requestClient.post(url[, data[, config]])

##### requestClient.put(url[, data[, config]])

##### requestClient.patch(url[, data[, config]])

###### NOTE

When using the alias methods `url`, `method`, and `data` properties don't need to be specified in config.

```js
// Set the default comman configuration for all requests

requestClient.defaultConfig({
	baseURL: 'https://something.com/apis/v2',
	headers: {
		common: { 'Content-Type': 'application/json' },
	},
	timeout: 0,
});

// config the rollbar error tracking

requestClient.defaultConfig({
	rollbarToken: '',
	rollbarConfig: {
		status: [403, 500], // track particular http error code in rollbar otherwise it will track all error code and exception
	},
});

// config the errorExpend
// without errorExpend you will get the error response like axios

//The response for a request contains the following information.
.catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });

requestClient.defaultConfig({
	errorExpand: true,
});
// after the config you will get

{
  clientError: true,
  errorDetails: {
    code: 403,
    success: false,
    error_message: 'This email account does not exist',
    body: []
  },
  message: 'Forbidden',
  serverError: false,
  status: 403
}

// if you want the message key from server side message so just add the
requestClient.defaultConfig({
    errorExpand: true,
    errorMessageKey: 'error_message' // key from server side which sended by the backend developer with message
});
// and result will be
{
  clientError: true,
  errorDetails: {
    code: 403,
    success: false,
    error_message: 'This email account does not exist',
    body: []
  },
  message: 'This email account does not exist',
  serverError: false,
  status: 403
}
```

## Middleware

You can middleware requests or responses before they are handled by `then` or `catch`.

```js
// Request middleware

requestClient.middleware.request.use(
	function (config) {
		config.headers.comman['Authorization'] = 'key';
		return config;
	},
	function (error) {
		Promise.reject(error);
	}
);

// Response middleware
const successResponce = (response) => {
	// do something
	return response;
};
requestClient.middleware.response.use(
	(response) => successResponce(response),
	(error) => Promise.reject(error)
);
```

## Additional middleware

You can run middlware before requests or responses middleware calling

When user want to do something before server requests

```js
const checkStatus = (config, next) => {
	// todo
	next();
};
const allTaskDone = (config, next) => {
	// todo
	next();
};
requestClient.use([checkStatus, allTaskDone]);
```

> Note: you will not modified the config in the additional middleware.

## New instance

You can add interceptors to a custom instance of requestClient.

```js
const request = requestClient.createInstance({
	baseURL: '',
});
request.middleware.request.use(function () {
	/*...*/
});
```

## Handling Errors

```js
requestClient.get('/user/12345').catch(function (error) {
	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		console.log(error.response.data);
		console.log(error.response.status);
		console.log(error.response.headers);
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		console.log(error.request);
	} else {
		// Something happened in setting up the request that triggered an Error
		console.log('Error', error.message);
	}
	console.log(error.config);
});
```

Using `toJSON` you get an object with more information about the HTTP error.

```js
requestClient.get('/user/12345').catch(function (error) {
	console.log(error.toJSON());
});
```

## Using application/x-www-form-urlencoded format

By default, requestClient serializes JavaScript objects to `JSON`. To send data in the `application/x-www-form-urlencoded` format instead, you can use one of the following options.

## License

[MIT](LICENSE)
