import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import War from '../views/War.vue';
import MauMau from '../views/MauMau.vue';
import GamePicker from '../views/GamePicker.vue';
import Pesten from '../views/Pesten.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'GamePicker',
        component: GamePicker
    },
    {
        path: '/war',
        name: 'War',
        component: War
    },
    {
        path: '/mau-mau',
        name: 'MauMau',
        component: MauMau
    },
    {
        path: '/pesten',
        name: 'Pesten',
        component: Pesten
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
