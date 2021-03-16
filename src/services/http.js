// import AsyncStorage from '@react-native-community/async-storage';

const joinURL = (baseURL, url = '') => {
	return url.startsWith('?') ? `${baseURL}${url}` : `${baseURL}/${url}`;
};

let Headers = {
	'Content-Type': 'application/json',
};

class Service {
	constructor(props = {}) {
		this.baseURL =
			'https://bookestan.com/AudioBook/AudioBookWebservices/webservices/index.php';
		this.token = props.token;
	}

	request(url, method = 'POST', data = null, otherOptions = {}) {
		url = joinURL(this.baseURL, url);
		const {json = true} = otherOptions;
		if (this.token) {
			Headers['Authorization'] = this.token;
		}
		if (otherOptions.headers) {
			Headers = {
				...Headers,
				...otherOptions.headers,
			};
		}
		const options = {
			headers: Headers,
			method,
		};
		if (data && json) {
			options.body = JSON.stringify({...data});
		} else if (data && !otherOptions.json) {
			options.body = data;
		}
		console.log(url, options);
		return fetch(url, options);
	}

	getAll(url, data = {}) {
		const method = 'POST';
		this.request(url, method, data);
	}

	get(url) {
		const method = 'GET';
		return this.request(url, method, null)
			.then((res) => {
				console.log('GET', res);
				return res.json();
			})
			.catch((err) => {
				console.log('ERR:', err);
				return {Status: 0, error: 'Network request failed'};
			});
	}

	post(url, data) {
		const method = 'POST';
		return this.request(url, method, data)
			.then(async (res) => {
				console.log('poS', res);
				const result = await res.json();
				return {res: result, status: res.status};
			})
			.catch((err) => {
				console.log('ERR:', err);
				return {Status: 0, Body: 'Network request failed'};
			});
	}

	put(url, data) {
		const method = 'PUT';
		return this.request(url, method, data)
			.then((res) => res.json())
			.catch((err) => {
				console.log('ERR:', err);
				return {Status: 0, Body: 'Network request failed'};
			});
	}

	uploadFile(url, data) {
		const method = 'POST';

		const options = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				accept: '*',
			},
			json: false,
		};
		console.log(data);
		return this.request(url, method, data, options);
	}

	delete(url, data) {
		const method = 'DELETE';
		return this.request(url, method, data)
			.then((res) => res.json())
			.catch((err) => {
				console.log('ERR:', err);
				return {Status: 0, Body: 'Network request failed'};
			});
	}
}

export default Service;
