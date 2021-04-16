import Vue from 'vue';

Vue.prototype.$clipboard = function(copyText, toastText) {
	const el = document.createElement('textarea');

	console.log(copyText, toastText, el)

	el.value = copyText;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);

	this.$store.commit('snackbar/SHOW_MESSAGE', {
		text: toastText,
		timeout: 1000,
	});
};
