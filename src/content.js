import preloadData from './preload-data';
import injectChartProfileHover from './inject-chart-profile-hover';
import injectChartProfilePage from './inject-chart-profile-page';

const observer = new MutationObserver(() => {
	preloadData();
	injectChartProfileHover();
	injectChartProfilePage();
});
observer.observe(document.body, {childList: true, subtree: true});

preloadData();
injectChartProfilePage();
