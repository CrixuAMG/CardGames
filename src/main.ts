import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import * as lodash from 'lodash';
import {Drag, Drop} from 'vue-drag-drop';

Vue.component('drag', Drag);
Vue.component('drop', Drop);

declare var global: any;
declare global {
    interface Window {
        Cards: object;
        GameManager: object;
    }
}

global._ = lodash;

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
