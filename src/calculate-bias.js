const calculateBias = data => {
	const SUPPORTED_CURRENCIES = ['BTC', 'ETH', 'XRP', 'BCH'];
	const EXPONENT_MULITIPLIER = 0.8;
	const BIAS_MIN_THRESHOLD = 5;

	// Create correctly ordered array of currency objects
	let currencies = [];
	for (const symbol of SUPPORTED_CURRENCIES) {
		const currency = data.clusters.find(cluster => cluster.abbr === symbol);

		if (currency) {
			currencies.push(currency);
		}
	}

	// Format the currency objects
	currencies = currencies.map(currency => ({
		symbol: currency.abbr,
		name: currency.display,
		influence: currency.score
	}));

	// Derive bias from influence
	const largestInfluence = Math.max(...currencies.map(currency => currency.influence));
	currencies = currencies.map(currency => {
			const influenceComparedToLargest = (currency.influence / largestInfluence);
			const exponent = influenceComparedToLargest * EXPONENT_MULITIPLIER;
			const bias = (currency.influence < 1) ? 0 : Math.pow(currency.influence, exponent);

			return {...currency, bias};
	});

	// Zero values below threshold
	let totalBiasSum = currencies
		.map(currency => currency.bias)
		.reduce((a, b) => a + b);

	currencies = currencies.map(currency => {
		let biasAsPercentage = (currency.bias / totalBiasSum) * 100;
		const bias = (biasAsPercentage < BIAS_MIN_THRESHOLD) ? 0 : currency.bias;

		return {...currency, bias};
	});

	// Convert bias into percentages
	totalBiasSum = currencies
		.map(currency => currency.bias)
		.reduce((a, b) => a + b);

	currencies = currencies.map(currency => {
		const bias = (currency.bias / totalBiasSum) * 100;

		return {...currency, bias};
	});

	return currencies;
};

export default calculateBias;
