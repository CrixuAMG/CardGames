import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { Drag, Drop } from 'vue-drag-drop';
import eventHub from "@/lib/eventHub";

const app = createApp(App);
app.use(store)
    .use(router)
    .component('drag', Drag)
    .component('drop', Drop)
    .mount('#app');

app.config.globalProperties.emitter = eventHub;
