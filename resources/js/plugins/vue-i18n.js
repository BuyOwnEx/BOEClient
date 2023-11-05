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

export default i18n;
