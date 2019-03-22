import buildBiasElement from './build-bias-element';

const injectChartProfileHover = async () => {
	const profileHoverContainer = document.querySelector('#profile-hover-container');
	const profileCard = profileHoverContainer.querySelector('.profile-card');

	if (!(profileCard && !profileCard.dataset.coinflict)) {
		return;
	}

	profileCard.dataset.coinflict = true;

	const username = profileCard.querySelector('[data-screen-name]').dataset.screenName;
	const biases = await buildBiasElement(username);

	const negativeMargin = 12;
	biases.style.marginTop = `-${negativeMargin}px`;

	const profileCardStats = profileCard.querySelector('.ProfileCardStats');
	profileCardStats.parentNode.insertBefore(biases, profileCardStats);

	const gravitySouth = profileCard.classList.contains('gravity-south');
	const offset = gravitySouth ? (biases.offsetHeight - negativeMargin) : 0;
	profileHoverContainer.style.transform = `translateY(-${offset}px)`;
};

export default injectChartProfileHover;
