import preloadData from './lib/preload-data';
import injectChartProfilePage from './lib/inject-chart-profile-page';
import injectChartProfileHover from './lib/inject-chart-profile-hover';

const injectData = () => {
	injectChartProfilePage();
	injectChartProfileHover();
	preloadData();
};

injectData();

const observer = new MutationObserver(injectData);
observer.observe(document.body, {childList: true, subtree: true});
