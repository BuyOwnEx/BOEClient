import en from '../translations/js/en.js';
import es from '../translations/js/es.js';
import pt from '../translations/js/pt.js';
import de from '../translations/js/de.js';
import fr from '../translations/js/fr.js';
import ar from '../translations/js/ar.js';
import ko from '../translations/js/ko.js';
import ru from '../translations/js/ru.js';
import zh from '../translations/js/zh.js';
import ja from '../translations/js/ja.js';
import pl from '../translations/js/pl.js';

import custom_en from '../translations/js/custom/en.js';
import custom_es from '../translations/js/custom/es.js';
import custom_pt from '../translations/js/custom/pt.js';
import custom_de from '../translations/js/custom/de.js';
import custom_fr from '../translations/js/custom/fr.js';
import custom_ar from '../translations/js/custom/ar.js';
import custom_ko from '../translations/js/custom/ko.js';
import custom_ru from '../translations/js/custom/ru.js';
import custom_zh from '../translations/js/custom/zh.js';
import custom_ja from '../translations/js/custom/ja.js';
import custom_pl from '../translations/js/custom/pl.js';

const supported = import.meta.env.VITE_CONFIG_AVAILABLE_LOCALES.split(",");
let locale = import.meta.env.VITE_CONFIG_DEFAULT_LOCALE;

try {
	// get locale from backend
	if(window.locale)
	{
		locale = window.locale;
	}
	else // get browser default language
	{
		const { 0: browserLang } = navigator.language.split('-');

		if (supported.includes(browserLang)) locale = browserLang;
	}

} catch (e) {
	console.log(e);
}

export default {
	locale,

	fallbackLocale: import.meta.env.VITE_CONFIG_FALLBACK_LOCALE,

	availableLocales: [{
		code: 'en',
		flag: 'us',
		label: 'English',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_en: en,
		used: supported.includes('en'),
	}, {
		code: 'es',
		flag: 'es',
		label: 'Español',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_es: es,
		used: supported.includes('es'),
	}, {
		code: 'pt',
		flag: 'pt',
		label: 'Português',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_pt: pt,
		used: supported.includes('pt'),
	}, {
		code: 'de',
		flag: 'de',
		label: 'Deutsche',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_de: de,
		used: supported.includes('de'),
	}, {
		code: 'fr',
		flag: 'fr',
		label: 'Français',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_fr: fr,
		used: supported.includes('fr'),
	}, {
		code: 'ar',
		flag: 'sa',
		label: 'العربية',
		isRtl: true,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_ar: ar,
		used: supported.includes('ar'),
	}, {
		code: 'ko',
		flag: 'kr',
		label: '한국어',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_ko: ko,
		used: supported.includes('ko'),
	}, {
		code: 'ru',
		flag: 'ru',
		label: 'Русский',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_ru: ru,
		used: supported.includes('ru'),
	}, {
		code: 'zh',
		flag: 'cn',
		label: '中文',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_zh: zh,
		used: supported.includes('zh'),
	}, {
		code: 'ja',
		flag: 'jp',
		label: '日本語',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_ja: ja,
		used: supported.includes('ja'),
	}, {
		code: 'pl',
		flag: 'pl',
		label: 'Polskie',
		isRtl: false,
		messages: import.meta.env.VITE_CONFIG_USE_CUSTOM_TRANSLATE === 'true' ? custom_pl: pl,
		used: supported.includes('pl'),
	}],
};
