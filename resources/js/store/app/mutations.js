import Vuetify from '../../plugins/vuetify';

export default {
	/**
		* Theme and Layout
		*/
	setGlobalTheme: (state, theme) => {
		Vuetify.framework.theme.dark = theme === 'dark';
		state.globalTheme = theme;
	},
	setRTL: (state, isRTL) => {
		Vuetify.framework.rtl = isRTL;
		state.isRTL = isRTL;
	},
	setContentBoxed: (state, isBoxed) => {
		state.isContentBoxed = isBoxed;
	},
	setMenuTheme: (state, theme) => {
		state.menuTheme = theme;
	},
	setToolbarTheme: (state, theme) => {
		state.toolbarTheme = theme;
	},
	setTimeZone: (state, zone) => {
		state.time.zone = zone;
	},
	setTimeFormat: (state, format) => {
		state.time.format = format;
	},
	setCurrency: (state, currency) => {
		state.currency = currency;
	},
	setToolbarDetached: (state, isDetached) => {
		state.isToolbarDetached = isDetached;
	},
	setAuthUser: (state, data) => {
		state.trader = data.user;
		data.vm.$eventHub.$emit('set-user', { user: data.user });
	},
	setConfig: (state, data) => {
		state.config = data.config;
		data.vm.$eventHub.$emit('set-config', { config: data.config });
	},
	setUser2FA: (state, status) => {
		state.trader.g2fa = status;
	},
};
