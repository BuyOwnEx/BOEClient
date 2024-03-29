export default {
	methods: {
		validate2FA(val) {
			const valid = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete'];
			if (!valid.includes(val.key)) val.preventDefault();
		},
		validateOnlyNumbers(val) {
			const valid = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete'];
			if (!valid.includes(val.key)) val.preventDefault();
		},
		validateNumber(evt) {
			evt = evt ? evt : window.event;
			let charCode = evt.which ? evt.which : evt.keyCode;
			if (
				charCode > 31 &&
				(charCode < 48 || charCode > 57) &&
				(charCode < 96 || charCode > 105) &&
				charCode !== 46 &&
				charCode !== 35 &&
				charCode !== 36 &&
				charCode !== 37 &&
				charCode !== 39 &&
				evt.key !== '.'
			) {
				evt.preventDefault();
			} else {
				return true;
			}
		},
	}
}