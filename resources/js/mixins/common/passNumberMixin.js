export default {
	methods: {
		passNumbers(val) {
			const invalid = ['-', '+', 'e'];
			if (invalid.includes(val.key)) val.preventDefault();
		},
	}
}