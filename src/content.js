import preloadTweetData from './preload-tweet-data';
import injectChart from './inject-chart';

const observer = new MutationObserver(() => {
	preloadTweetData();
	injectChart();
});
observer.observe(document.body, {childList: true, subtree: true});

preloadTweetData();
