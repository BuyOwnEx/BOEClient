import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { castToVueI18n, createI18n } from 'vue-i18n-bridge';

import config from '../configs';

const { locale, availableLocales, fallbackLocale } = config.locales;

Vue.use(VueI18n, { bridge: true});

const messages = {};
availableLocales.forEach((l) => {
	messages[l.code] = l.messages;
});

export const i18n = castToVueI18n(
    createI18n(
        {
            legacy: true,
            locale: locale,
            messages: messages,
            missingWarn: false,
            fallbackWarn: false,
            warnHtmlMessage: false
        },
        VueI18n,
    ),
)
i18n.fallbackLocale = fallbackLocale;
i18n.locales = availableLocales;
i18n.pluralizationRules = {
    'ru': function(choice, choicesLength) {
        if (choice === 0) {
            return 0;
        }
        const teen = choice > 10 && choice < 20;
        const endsWithOne = choice % 10 === 1;
        if (choicesLength < 4) {
            return (!teen && endsWithOne) ? 1 : 2;
        }
        if (!teen && endsWithOne) {
            return 1;
        }
        if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
            return 2;
        }
        return (choicesLength < 4) ? 2 : 3;
    }
}

export default i18n;
