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
};

export default calculateBias;
