import fetch from './webextension-fetch';

const dataCache = new Map();

const getAvailableUsers = fetch('https://hive.one/api/influencers/scores/people/available/').then(async res => {
	const body = await res.json();

	return body.data.available;
});

const getData = async userId => {
	const availableUsers = await getAvailableUsers;

	if (!availableUsers.includes(userId)) {
		return false;
	}

	const url = `https://hive.one/api/influencers/scores/person/id/${userId}/`;

	const cachedData = dataCache.get(url);
	if (typeof cachedData !== 'undefined') {
		return cachedData;
	}

	const result = fetch(url)
		.then(async response => {
			if (response.status === 404) {
				return false;
			}

			const data = await response.json();
			return data;
		});

	dataCache.set(url, result);

	return result;
};

export default getData;
