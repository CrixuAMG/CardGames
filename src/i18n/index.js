import { createI18n } from 'vue-i18n';
import English from './en';
import Dutch from './nl';
import { LOCALES } from './locale';

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('cg:locale') : null;
const initial = LOCALES.some(locale => locale.key === stored) ? stored : 'nl';

const messages = {
    nl: Dutch,
    en: English,
};

const i18n = createI18n({
    globalInjection: true,
    legacy:          false,
    locale:          initial,
    fallbackLocale:  'nl',
    messages:        messages
});

export function syncLocale (locale) {
    i18n.global.locale.value = locale;

    if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
    }
}

syncLocale(initial);

export default i18n;