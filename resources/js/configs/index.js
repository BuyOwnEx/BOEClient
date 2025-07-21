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
		company_address: import.meta.env.VITE_COMPANY_ADDRESS,
		company_phone: import.meta.env.VITE_COMPANY_PHONE,
		company_email: import.meta.env.VITE_COMPANY_EMAIL,
		type: import.meta.env.VITE_CONFIG_PRODUCT_TYPE, // possible values: "start", "startPlus", "full"
		startPage: import.meta.env.VITE_CONFIG_START_PAGE, // possible values: "trading", "login", "landing"
		startAuthedPage: import.meta.env.VITE_CONFIG_START_AUTHED_PAGE, // possible values: "trading", "profile"
		showCurrencies: import.meta.env.VITE_CONFIG_SHOW_CURRENCIES === "true",
		enabledSupport: import.meta.env.VITE_CONFIG_ENABLED_SUPPORT === "true",
		disabledMarketsShow: import.meta.env.VITE_CONFIG_DISABLED_MARKETS_SHOW === "true",
		disabledTradingShow: import.meta.env.VITE_CONFIG_DISABLED_TRADING_SHOW === "true",
		disabledBalanceShow: import.meta.env.VITE_CONFIG_DISABLED_BALANCE_SHOW === "true",
		disabledOrdersShow: import.meta.env.VITE_CONFIG_DISABLED_ORDERS_SHOW === "true",
		disabledDealsShow: import.meta.env.VITE_CONFIG_DISABLED_DEALS_SHOW === "true",
		disabledRefsShow: import.meta.env.VITE_CONFIG_DISABLED_REFS_SHOW === "true",
		disabledStatusPageShow: import.meta.env.VITE_CONFIG_DISABLED_STATUS_PAGE_SHOW === "true",
		disabledFeesPageShow: import.meta.env.VITE_CONFIG_DISABLED_FEES_PAGE_SHOW === "true",
		disabledContactsPageShow: import.meta.env.VITE_CONFIG_DISABLED_CONTACTS_PAGE_SHOW === "true",
		disabledApiPageShow: import.meta.env.VITE_CONFIG_DISABLED_API_PAGE_SHOW === "true",
		enabledLegalWithdrawReason: import.meta.env.VITE_CONFIG_ENABLED_LEGAL_WITHDRAW_REASON === "true",
		enabledContactRequest: import.meta.env.VITE_CONFIG_ENABLED_CONTRACT_REQUEST === "true",
		kybLocalUploadType: import.meta.env.VITE_CONFIG_KYB_LOCAL_UPLOAD_TYPE,
		fiatReplenishUseProps: import.meta.env.VITE_CONFIG_FIAT_REPLENISH_USE_PROPS === "true",
		fiatUseKGProps: import.meta.env.VITE_CONFIG_FIAT_USE_KG_PROPS === "true",
		fiatUseRUProps: import.meta.env.VITE_CONFIG_FIAT_USE_RU_PROPS === "true",
		fiatUseSwiftProps: import.meta.env.VITE_CONFIG_FIAT_USE_SWIFT_PROPS === "true",
		copyright: import.meta.env.VITE_CONFIG_COPYRIGHT,
		copy_start_year: import.meta.env.VITE_CONFIG_COPY_START_YEAR,
		all_rights_text: import.meta.env.VITE_CONFIG_ALL_RIGHTS_TEXT,
		force_agree: import.meta.env.VITE_CONFIG_FORCE_AGREE === "true",
		terms_all_expanded: import.meta.env.VITE_TERMS_ALL_EXPANDED === "true",
		policy_all_expanded: import.meta.env.VITE_POLICY_ALL_EXPANDED === "true",
		api_all_expanded: import.meta.env.VITE_API_ALL_EXPANDED === "true",
		contacts_all_expanded: import.meta.env.VITE_CONTACTS_ALL_EXPANDED === "true",
		deals_show_fee_in_market: import.meta.env.VITE_DEALS_SHOW_FEE_IN_MARKET === "true",
		captcha_enabled: import.meta.env.VITE_CAPTCHA_ENABLED === "true",
		captcha_type: import.meta.env.VITE_CAPTCHA_TYPE,
		captcha_id: import.meta.env.VITE_CAPTCHA_ID,
	},
	icons,
	theme,
	toolbar,
	locales,
	currencies,
	navigation,
};
