import buildBiasElement from './build-bias-element';

const injectChartProfilePage = async () => {
	const profileHeaderCard = document.querySelector('.ProfileHeaderCard');

	if (!(profileHeaderCard && !profileHeaderCard.dataset.coinflict)) {
		return;
	}
	profileHeaderCard.dataset.coinflict = true;

	const username = profileHeaderCard.querySelector('[data-screen-name]').dataset.screenName;
	const biases = await buildBiasElement(username);

	const bio = profileHeaderCard.querySelector('.ProfileHeaderCard-bio');
	bio.parentNode.insertBefore(biases, bio.nextSibling);
};

export default injectChartProfilePage;
