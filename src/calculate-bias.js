// EXPONENT_MULITIPLIER is used to tweak how heavily the difference between the
// influence affects the bias result.
// Setting EXPONENT_MULITIPLIER to 0 will mean all biases are equal.
// Setting EXPONENT_MULITIPLIER to a large enough number will mean the bias will sway
// 100% towards the currency with the most influence.

// BIAS_MIN_THRESHOLD is used to set a percentage at which biases will be
// considered 0 if they are below.

const calculateBias = data => {
	const SUPPORTED_CURRENCIES = ['BTC', 'ETH', 'XRP', 'BCH'];
	const EXPONENT_MULITIPLIER = 0.8;
	const BIAS_MIN_THRESHOLD = 5;

	// Create correctly ordered array of currency objects
	let currencies = [];
	for (const symbol of SUPPORTED_CURRENCIES) {
		const currency = data.data.score.find(cluster => cluster.abbr === symbol);

		if (currency) {
			currencies.push({
				symbol: currency.abbr,
				name: currency.display,
				influence: currency.score
			});
		}
	}

	// Derive bias from influence
	const largestInfluence = Math.max(...currencies.map(currency => currency.influence));
	currencies = currencies.map(currency => {
		const influenceComparedToLargest = (currency.influence / largestInfluence);
		const exponent = influenceComparedToLargest * EXPONENT_MULITIPLIER;
		const bias = (currency.influence < 1) ? 0 : currency.influence ** exponent;

		return {...currency, bias};
	});

	// Zero values below threshold
	let totalBiasSum = currencies
		.map(currency => currency.bias)
		.reduce((a, b) => a + b);

	currencies = currencies.map(currency => {
		const biasAsPercentage = (currency.bias / totalBiasSum) * 100;
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
