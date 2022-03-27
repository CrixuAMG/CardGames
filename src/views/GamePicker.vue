<template>
    <img src="/img/logo-light.svg" alt="Logo" id="app-logo">

    <dialog id="username-form" @close="onDialogClose">
        <form method="dialog">
            <input type="text" v-model="localUsername" name="username">

            <button type="submit">
                Save
            </button>
        </form>
    </dialog>

    <div id="game-picker" class="game-picker">
        <game-card :game="game" v-for="game in Games"
                   class="game-picker__option"/>
    </div>
</template>

<script>
import Games from "../lib/Game/Games";
import GameCard from '../components/GameSelection/GameCard';
import { inject, watch, ref } from 'vue';

export default {
    name:       "GamePicker",
    components: { GameCard },
    setup () {
        const username      = inject('username');
        const localUsername = ref(null);

        const checkUsername = () => {
            const element = document.querySelector('#username-form');

            if (!element) return setTimeout(checkUsername, 100);

            if (!username.value) {
                !element.open ? element.showModal() : undefined;
            }
        };

        watch(() => username, checkUsername, {
            immediate: true,
            deep:      true,
        });

        const onDialogClose = () => {
            if (localUsername.value) {
                username.value = localUsername.value;
            }
        };

        return {
            Games: Games,

            username,
            localUsername,

            onDialogClose,
        };
    },
};
</script>
