import preloadData from './preload-data';
import injectChart from './inject-chart';

const observer = new MutationObserver(() => {
	preloadData();
	injectChart();
});
observer.observe(document.body, {childList: true, subtree: true});

preloadData();
