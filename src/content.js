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

	const gravitySouth = profileCard.classList.contains('gravity-south');
	const offset = gravitySouth ? biases.offsetHeight : 0;
	profileHoverContainer.style.transform = `translateY(-${offset}px)`;
};

observer = new MutationObserver(injectChart);
observer.observe(document.body, {childList: true, subtree: true});
