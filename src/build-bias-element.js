import escapeHtml from 'escape-html';
import getData from './get-data';
import calculateBias from './calculate-bias';

const buildBiasElement = async username => {
	const data = await getData(username);

	const container = document.createElement('div');
	container.innerHTML = `
	<div class="ProfileCardBias ProfileCardStats">
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
			biases.append(container.children[0]);
		});
	} else {
		biases.append(document.createTextNode('No bias data available for this user.'));
	}

	return biases;
};

export default buildBiasElement;
