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
		enabledLegalWithdrawReason: import.meta.env.VITE_CONFIG_ENABLED_LEGAL_WITHDRAW_REASON === "true",
		copyright: import.meta.env.VITE_CONFIG_COPYRIGHT,
		copy_start_year: import.meta.env.VITE_CONFIG_COPY_START_YEAR,
		all_rights_text: import.meta.env.VITE_CONFIG_ALL_RIGHTS_TEXT,
		force_agree: import.meta.env.VITE_CONFIG_FORCE_AGREE === "true",
		terms_all_expanded: import.meta.env.VITE_TERMS_ALL_EXPANDED === "true",
		policy_all_expanded: import.meta.env.VITE_POLICY_ALL_EXPANDED === "true",
		api_all_expanded: import.meta.env.VITE_API_ALL_EXPANDED === "true",
		contacts_all_expanded: import.meta.env.VITE_CONTACTS_ALL_EXPANDED === "true",
	},
	icons,
	theme,
	toolbar,
	locales,
	currencies,
	navigation,
};
