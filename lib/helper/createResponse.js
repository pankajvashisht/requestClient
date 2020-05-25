module.exports = function (response) {
	let data = response;
	if (typeof data === 'string') {
		try {
			// parse json
			data = JSON.parse(data);
		} catch (e) {}
	}
	return data;
};
