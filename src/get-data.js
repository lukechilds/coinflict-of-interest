const dataCache = new Map();

const getData = async username => {
	const url = `https://hive.one/api/top-people/${username}`;

	const cachedData = dataCache.get(url);
	if (typeof cachedData !== 'undefined') {
		return cachedData;
	}

	const response = await fetch(url);

	if (response.status === 404) {
		dataCache.set(url, false);
		return false;
	}

	const data = await response.json();
	dataCache.set(url, data);
	return data;
};

export default getData;
