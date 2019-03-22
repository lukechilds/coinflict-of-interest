import getData from './get-data';

const preloadData = () => {
	// Get all usernames we can find with data-screen-name
	const usernames = [...document.querySelectorAll('[data-screen-name]')]
		.map(element => element.dataset.screenName);

	// Also scrape usernames from mentions and other user id links
	const linkUsernames = [...document.querySelectorAll('a[data-user-id], a[data-mentioned-user-id]')]
		.map(a => a.href.split('/').pop());

	new Set([...usernames, ...linkUsernames]).forEach(getData);
};

export default preloadData;
