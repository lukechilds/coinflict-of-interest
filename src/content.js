import preloadData from './preload-data';
import injectChartProfilePage from './inject-chart-profile-page';
import injectChartProfileHover from './inject-chart-profile-hover';

const injectData = () => {
	injectChartProfilePage();
	injectChartProfileHover();
	preloadData();
};

injectData();

const observer = new MutationObserver(injectData);
observer.observe(document.body, {childList: true, subtree: true});
