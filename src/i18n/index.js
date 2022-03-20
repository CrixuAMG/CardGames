import { createI18n } from 'vue-i18n';
import Dutch from './nl';

const messages = {
    nl: Dutch,
};

const i18n = createI18n({
    globalInjection: true,
    legacy:          false,
    locale:          'nl',
    messages:        messages
});

export default i18n;
