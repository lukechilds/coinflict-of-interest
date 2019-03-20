const dataCache = new Map();

const getData = async username => {
	const url = `https://hive.one/api/top-people/${username}`;

	const cachedData = dataCache.get(url);
	if (typeof cachedData !== 'undefined') {
		return cachedData;
	}

	const response = await fetch(url);

	if (response.status === 404) {
		dataCache.set(url, false);
		return false;
	}

	const data = await response.json();
	dataCache.set(url, data);
	return data;
};

const preloadTweetData = () => {
	Array.from(document.querySelectorAll('.tweet')).forEach(tweet => {
		if (tweet.dataset.coinbiasPreloaded) {
			return false;
		}

		const username = tweet.dataset.screenName;
		getData(username);

		tweet.dataset.coinbiasPreloaded = true;
	});
};

const escapeHtml = string => string.replace(/["'&<>]/g, '');

const injectChart = async () => {
	const profileHoverContainer = document.querySelector('#profile-hover-container');
	const profileCard = profileHoverContainer.querySelector('.profile-card');

	if (!(profileCard && !profileCard.dataset.coinbias)) {
		return;
	}
	profileCard.dataset.coinbias = true;

	const username = profileCard.querySelector('[data-screen-name]').dataset.screenName;
	const data = await getData(username);

	const container = document.createElement('div');
	container.innerHTML = `
	<div class="ProfileCardBias ProfileCardStats">
		<style>
			.ProfileCardBias {
				padding-bottom: 8px;
			}

			.ProfileCardBias .bias:not(:last-of-type) {
				margin-bottom: 4px;
			}

			.ProfileCardBias .bias-amount-container {
				position: relative;
				width: 100%;
				height: 8px;
				background: #ccc;
				border-radius: 4px;
			}

			.ProfileCardBias .bias-amount {
				position: absolute;
				top: 0;
				left: 0;
				height: 100%;
				border-radius: 4px;
			}
		</style>
		<div><strong>Coinbias</strong></div>
	</div>`;
	const biases = container.children[0];

	if (data) {
		const currencies = data.clusters
			.filter(currency => ['BTC', 'ETH', 'XRP', 'BCH'].includes(currency.abbr));

		const totalScore = currencies
			.map(currency => Number(currency.score))
			.reduce((a, b) => a + b);

		currencies.forEach(currency => {
			const biasThreshold = 5;
			let bias = (Number(currency.score) / totalScore) * 100;
			bias = (bias < biasThreshold) ? 0 : bias;

			const container = document.createElement('div');
			container.innerHTML = `
			<div class="bias">
				<span class="ProfileCardStats-statLabel u-block">${escapeHtml(currency.display)}</span>
				<div class="bias-amount-container">
					<div class="bias-amount u-bgUserColor" style="width: ${bias}%;"></div>
				</div>
			</div>`;
			biases.appendChild(container.children[0]);
		});
	} else {
		biases.appendChild(document.createTextNode('No bias data available for this user.'));
	}

	const profileCardStats = profileCard.querySelector('.ProfileCardStats');
	profileCardStats.parentNode.insertBefore(biases, profileCardStats);

	const gravitySouth = profileCard.classList.contains('gravity-south');
	const offset = gravitySouth ? biases.offsetHeight : 0;
	profileHoverContainer.style.transform = `translateY(-${offset}px)`;
};

observer = new MutationObserver(() => {
	preloadTweetData();
	injectChart();
});
observer.observe(document.body, {childList: true, subtree: true});
