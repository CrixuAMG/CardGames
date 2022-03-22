<template>
    <game-view>
        <div class="pesten">
            <div class="d-flex flex-row justify-between">
                <game-data/>

                <game-log/>

                <opponents-wrapper>
                    <opponent v-for="(opponent, index) in opponents" :key="index"/>
                </opponents-wrapper>
            </div>

            <stack/>
            <draw-stack/>

            <hand/>
        </div>
    </game-view>
</template>

<script>
import Cards from "../lib/Cards/Cards";
import Hand from "../components/Hand";
import Stack from "../components/Stack";
import DrawStack from "../components/DrawStack";
import GameData from "../components/GameData";
import GameManager from "../lib/Game/GameManager";
import Opponent from "../components/Opponent";
import Ruleset from "../lib/GameTypes/Pesten/Ruleset";
import GameLog from "../components/GameLog";
import OpponentsWrapper from '../components/OpponentsWrapper';
import GameView from './Wrappers/GameView';

export default {
    name:       "Pesten",
    components: {
        GameView,
        OpponentsWrapper,
        GameLog,
        Opponent,
        GameData,
        DrawStack,
        Stack,
        Hand
    },
    methods:    {
        async setup () {
            Cards.get(true, true);
            await GameManager.setup(this, Ruleset);

            setTimeout(() => {
                GameManager.startGame();

                this.emitter.$emit('toast::add', {
                    text:     'Welkom! Het spel is begonnen!',
                    position: 'top-center',
                    canClose: true,
                });
            }, 1000);
        },

        range (size, startAt = 0) {
            return [...Array(size).keys()].map(i => i + startAt);
        },
    },

    data () {
        return {
            opponents: null,
        };
    },

    created () {
        this.opponents = this.range(
            parseInt(localStorage.getItem('opponents'))
        );
    },

    mounted () {
        if (!this.opponents || this.opponents.length < 1) {
            this.$router.replace({
                name: 'GamePicker',
            });
        }

        this.setup();
    }
};
</script>

<style lang="scss" scoped>
@import "../styles/games/Pesten";
</style>
