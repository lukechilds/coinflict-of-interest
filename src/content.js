import preloadData from './preload-data';
import injectChartProfileHover from './inject-chart-profile-hover';

const observer = new MutationObserver(() => {
	preloadData();
	injectChartProfileHover();
});
observer.observe(document.body, {childList: true, subtree: true});

preloadData();
