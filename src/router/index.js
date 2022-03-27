import { createRouter, createWebHistory } from 'vue-router';
import War from '../views/War.vue';
import GamePicker from '../views/GamePicker.vue';
import Pesten from '../views/Pesten.vue';

const routes = [
    {
        path:      '/',
        name:      'GamePicker',
        component: GamePicker
    },
    {
        path:      '/war',
        name:      'War',
        component: War
    },
    {
        path:      '/pesten',
        name:      'Pesten',
        component: Pesten
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes:  routes,
});

export default router;
