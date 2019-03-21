import getData from './get-data';

const preloadTweetData = () => {
	Array.from(document.querySelectorAll('.tweet')).forEach(tweet => {
		if (tweet.dataset.coinflictPreloaded) {
			return false;
		}

		const username = tweet.dataset.screenName;
		getData(username);

		tweet.dataset.coinflictPreloaded = true;
	});
};

export default preloadTweetData;
