import configs from '../../configs';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

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
	flash: null
};

export default {
	namespaced: true,
	state,
	mutations,
	getters,
	actions
};
