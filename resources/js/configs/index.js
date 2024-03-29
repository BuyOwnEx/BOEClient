import icons from './icons';
import theme from './theme';
import locales from './locales';
import currencies from './currencies';
import navigation from './navigation';

export default {
	product: {
		name: import.meta.env.VITE_CONFIG_APP_NAME,
		version: import.meta.env.VITE_CONFIG_APP_VERSION,
		slogan: import.meta.env.VITE_CONFIG_SLOGAN,
		type: import.meta.env.VITE_CONFIG_PRODUCT_TYPE, // possible values: "start", "startPlus", "full"
		showCurrencies: import.meta.env.VITE_CONFIG_SHOW_CURRENCIES === "true",
		enabledSupport: import.meta.env.VITE_CONFIG_ENABLED_SUPPORT === "true",
		copyright: import.meta.env.VITE_CONFIG_COPYRIGHT,
		copy_start_year: import.meta.env.VITE_CONFIG_COPY_START_YEAR,
		all_rights_text: import.meta.env.VITE_CONFIG_ALL_RIGHTS_TEXT
	},
	icons,
	theme,
	toolbar,
	locales,
	currencies,
	navigation,
};
