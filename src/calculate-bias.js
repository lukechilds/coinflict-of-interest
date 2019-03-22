const calculateBias = data => {
	const SUPPORTED_CURRENCIES = ['BTC', 'ETH', 'XRP', 'BCH'];
	const BIAS_REDUCER = 0.5;
	const BIAS_MIN_THRESHOLD = 10;

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
			const bias = (currency.influence < 1) ? 0 : Math.pow(currency.influence, influenceComparedToLargest);

			return {...currency, bias};
	});

	// Convert bias into percentages
	const totalBiasSum = currencies
		.map(currency => currency.bias)
		.reduce((a, b) => a + b);

	currencies = currencies
		.map(currency => {
			let bias = (currency.bias / totalBiasSum) * 100;

			return {...currency, bias};
		});

	return currencies;
};

export default calculateBias;
