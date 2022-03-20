<template>
    <img src="/img/logo-light.svg" alt="Logo" id="app-logo">

    <div id="game-picker" class="game-picker">
        <game-card :game="game" v-for="game in Games"
                   class="game-picker__option"/>
    </div>
</template>

<script>
import Games from "../lib/Game/Games";
import GameCard from '../components/GameSelection/GameCard';

export default {
    name:       "GamePicker",
    components: { GameCard },
    data () {
        return {
            Games: Games,
        };
    },
};
</script>
