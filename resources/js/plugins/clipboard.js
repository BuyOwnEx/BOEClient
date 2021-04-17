import Vue from 'vue';

Vue.prototype.$clipboard = function(copyText, toastText) {
	const el = document.createElement('textarea');

	el.style.position = 'fixed';
	el.style.left = '50%';
	el.style.display = 'block';
	el.style.top = '32%';
	el.style.height = '200px';
	el.style.width = '200px';
	el.style.zIndex = '1000000000';
	console.log(copyText, toastText, el);

	el.value = copyText;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	// document.body.removeChild(el);

	this.$store.commit('snackbar/SHOW_MESSAGE', {
		text: toastText,
		timeout: 1000,
	});
};
