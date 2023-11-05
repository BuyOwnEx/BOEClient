import configs from '../../configs';
import mutations from './mutations';
import getters from './getters';

const { product, time, theme, currencies } = configs;

const { globalTheme, menuTheme, toolbarTheme, isToolbarDetached, isContentBoxed, isRTL } = theme;
const { currency, availableCurrencies } = currencies;

const state = {
	product,
	time,
	currency,
	availableCurrencies,

	globalTheme,
	menuTheme,
	toolbarTheme,
	isToolbarDetached,
	isContentBoxed,
	isRTL,

	trader: null,
};

export default {
	namespaced: true,
	state,
	mutations,
	getters,
};
