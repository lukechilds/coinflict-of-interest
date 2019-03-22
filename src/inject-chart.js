import escapeHtml from 'escape-html';
import getData from './get-data';
import calculateBias from './calculate-bias';

const injectChart = async () => {
	const profileHoverContainer = document.querySelector('#profile-hover-container');
	const profileCard = profileHoverContainer.querySelector('.profile-card');

	if (!(profileCard && !profileCard.dataset.coinflict)) {
		return;
	}
	profileCard.dataset.coinflict = true;

	const username = profileCard.querySelector('[data-screen-name]').dataset.screenName;
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
			biases.appendChild(container.children[0]);
		});
	} else {
		biases.appendChild(document.createTextNode('No bias data available for this user.'));
	}

	const negativeMargin = 12;
	biases.style.marginTop = `-${negativeMargin}px`;

	const profileCardStats = profileCard.querySelector('.ProfileCardStats');
	profileCardStats.parentNode.insertBefore(biases, profileCardStats);

	const gravitySouth = profileCard.classList.contains('gravity-south');
	const offset = gravitySouth ? (biases.offsetHeight - negativeMargin) : 0;
	profileHoverContainer.style.transform = `translateY(-${offset}px)`;
};

export default injectChart;
