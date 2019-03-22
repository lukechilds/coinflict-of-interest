const dataCache = new Map();

const getData = async username => {
	const url = `https://hive.one/api/top-people/${username}`;

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
