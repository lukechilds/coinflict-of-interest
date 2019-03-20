const injectChart = () => {
	const profileHoverContainer = document.querySelector('#profile-hover-container');
	const profileCard = profileHoverContainer.querySelector('.profile-card');

	if (!(profileCard && !profileCard.dataset.coinbias)) {
		return;
	}
	profileCard.dataset.coinbias = true;

	const biases = document.createElement('div');
	biases.innerHTML = `
	<div class="ProfileCardStats">
		<span class="ProfileCardStats-statLabel u-block">Bias</span>
		[charts]
	</div>`;

	const profileCardStats = profileCard.querySelector('.ProfileCardStats');
	profileCardStats.parentNode.insertBefore(biases, profileCardStats);
};

observer = new MutationObserver(injectChart);
observer.observe(document.body, {childList: true, subtree: true});
