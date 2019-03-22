import getData from './get-data';

const preloadData = () => {
	const elements = Array.from(document.querySelectorAll('[data-screen-name]'));

	new Set(elements.map(element => element.dataset.screenName)).forEach(getData);
};

export default preloadData;
