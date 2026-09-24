import { createRouter, createWebHistory } from 'vue-router';

import GamePicker from '../views/GamePicker.vue';
import Pesten from '../views/Pesten.vue';
import War from '../views/War.vue';

const routes = [
    {
        path:      '/',
        name:      'GamePicker',
        component: GamePicker,
    },
    {
        path:      '/pesten',
        name:      'Pesten',
        component: Pesten,
    },
    {
        path:      '/war',
        name:      'War',
        component: War,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;