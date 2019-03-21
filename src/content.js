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
		if (tweet.dataset.coinflictPreloaded) {
			return false;
		}

		const username = tweet.dataset.screenName;
		getData(username);

		tweet.dataset.coinflictPreloaded = true;
	});
};

const escapeHtml = string => string.replace(/["'&<>]/g, '');

const calculateBias = data => {
	const SUPPORTED_CURRENCIES = ['BTC', 'ETH', 'XRP', 'BCH'];
	const BIAS_REDUCER = 0.5;
	const BIAS_MIN_THRESHOLD = 10;

	let currencies = data.clusters
		.map(currency => ({
			symbol: currency.abbr,
			name: currency.display,
			influence: currency.score
		}))
		.filter(currency => SUPPORTED_CURRENCIES.includes(currency.symbol))
		.sort((a, b) => {
			if (a.influence > b.influence) {
				return -1;
			}
			if (a.influence < b.influence) {
				return 1;
			}
			return 0;
		})
		.map((currency, index) => {
			const multiplier = Math.pow(BIAS_REDUCER, index);
			const bias = currency.influence * multiplier;

			return {...currency, bias};
		});

	const totalBiasSum = currencies
		.map(currency => currency.bias)
		.reduce((a, b) => a + b);

	currencies = currencies
		.map(currency => {
			let bias = (currency.bias / totalBiasSum) * 100;
			bias = (bias < BIAS_MIN_THRESHOLD) ? 0 : bias;

			return {...currency, bias};
		});

	return SUPPORTED_CURRENCIES
		.map(symbol => currencies.find(currency => currency.symbol === symbol));
}

const injectChart = async () => {
	const profileHoverContainer = document.querySelector('#profile-hover-container');
	const profileCard = profileHoverContainer.querySelector('.profile-card');

	if (!(profileCard && !profileCard.dataset.coinflict)) {
		return;
	}
	profileCard.dataset.coinflict = true;

	const username = profileCard.querySelector('[data-screen-name]').dataset.screenName;
	const data = await getData(username);

	const negativeMargin = 12;
	const container = document.createElement('div');
	container.innerHTML = `
	<div class="ProfileCardBias ProfileCardStats">
		<style>
			.ProfileCardBias {
				margin-top: -${negativeMargin}px;
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
		<div><strong>Bias</strong></div>
	</div>`;
	const biases = container.children[0];

	if (data) {
		const currencies = calculateBias(data);

		currencies.forEach(currency => {
			const container = document.createElement('div');
			container.innerHTML = `
			<div class="bias">
				<span class="ProfileCardStats-statLabel u-block">${escapeHtml(currency.name)}</span>
				<div class="bias-amount-container">
					<div class="bias-amount u-bgUserColor" style="width: ${Number(currency.bias)}%;"></div>
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
	const offset = gravitySouth ? (biases.offsetHeight - negativeMargin) : 0;
	profileHoverContainer.style.transform = `translateY(-${offset}px)`;
};

observer = new MutationObserver(() => {
	preloadTweetData();
	injectChart();
});
observer.observe(document.body, {childList: true, subtree: true});

preloadTweetData();
