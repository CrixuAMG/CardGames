import { createRouter, createWebHistory } from 'vue-router';

import GamePicker from '../views/GamePicker.vue';
import Pesten from '../views/Pesten.vue';
import War from '../views/War.vue';
import Memory from '../views/Memory.vue';
import Solitaire from '../views/Solitaire.vue';
import Highscores from '../views/Highscores.vue';

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
    {
        path:      '/memory',
        name:      'Memory',
        component: Memory,
    },
    {
        path:      '/solitaire',
        name:      'Solitaire',
        component: Solitaire,
    },
    {
        path:      '/highscores',
        name:      'Highscores',
        component: Highscores,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;