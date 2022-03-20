import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import eventHub from "@/lib/eventHub";

const app = createApp(App);
app.use(store)
    .use(router)
    .mount('#app');

app.config.globalProperties.emitter = eventHub;
