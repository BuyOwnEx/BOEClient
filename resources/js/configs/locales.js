import en from '../translations/en';
import es from '../translations/es';
import pt from '../translations/pt';
import de from '../translations/de';
import fr from '../translations/fr';
import ar from '../translations/ar';
import ko from '../translations/ko';
import ru from '../translations/ru';
import zh from '../translations/zh';
import ja from '../translations/ja';
import pl from '../translations/pl';

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
