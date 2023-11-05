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

const supported = ['en', 'es', 'pt', 'de', 'fr', 'ar', 'ko', 'ru', 'zh', 'ja', 'pl'];
let locale = 'en';

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

	fallbackLocale: 'en',

	availableLocales: [{
		code: 'en',
		flag: 'us',
		label: 'English',
		isRtl: false,
		messages: en,
	}, {
		code: 'es',
		flag: 'es',
		label: 'Español',
		isRtl: false,
		messages: es,
	}, {
		code: 'pt',
		flag: 'pt',
		label: 'Português',
		isRtl: false,
		messages: pt,
	}, {
		code: 'de',
		flag: 'de',
		label: 'Deutsche',
		isRtl: false,
		messages: de,
	}, {
		code: 'fr',
		flag: 'fr',
		label: 'Français',
		isRtl: false,
		messages: fr,
	}, {
		code: 'ar',
		flag: 'sa',
		label: 'العربية',
		isRtl: true,
		messages: ar,
	}, {
		code: 'ko',
		flag: 'kr',
		label: '한국어',
		isRtl: false,
		messages: ko,
	}, {
		code: 'ru',
		flag: 'ru',
		label: 'Русский',
		isRtl: false,
		messages: ru,
	}, {
		code: 'zh',
		flag: 'cn',
		label: '中文',
		isRtl: false,
		messages: zh,
	}, {
		code: 'ja',
		flag: 'jp',
		label: '日本語',
		isRtl: false,
		messages: ja,
	}, {
		code: 'pl',
		flag: 'pl',
		label: 'Polskie',
		isRtl: false,
		messages: pl,
	}],
};
