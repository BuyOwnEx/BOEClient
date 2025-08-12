export default function (number, separator) {
	let parts = ((number || number === 0 ? number : '') + '').split('.');
	if(parts.length) {
		parts[0] = parts[0].replace(/(\d)(?=(\d{3})+\b)/g, '$1' + (separator || ','))
	}
	return parts.join('.');
};