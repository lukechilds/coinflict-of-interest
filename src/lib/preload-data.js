import camelcase from 'camelcase';
import getData from './get-data';

const scrapeDataAttribute = dataAttribute => {
	return [...document.querySelectorAll(`[data-${dataAttribute}]`)].map(el => {
		return el.dataset[camelcase(dataAttribute)];
	});
};

const preloadData = () => {
	new Set([
		...scrapeDataAttribute('user-id'),
		...scrapeDataAttribute('mention-user-id')
	]).forEach(getData);
};

export default preloadData;
