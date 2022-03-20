import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import eventHub from "@/lib/eventHub";
import i18n from './i18n';

const app = createApp(App);
app.use(store)
    .use(router)
    .use(i18n)
    .mount('#app');

app.config.globalProperties.emitter = eventHub;
