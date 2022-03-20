<template>
    <div class="pesten">
        <div class="d-flex flex-row justify-between">
            <game-data/>

            <game-log/>

            <div class="opponents">
                <opponent v-for="(opponent, index) in opponents" :key="index"/>
            </div>
        </div>

        <stack/>
        <draw-stack/>

        <hand/>
    </div>
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

export default {
    name:       "Pesten",
    components: {
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
            }, 1000);
        },

        range (size, startAt = 0) {
            console.log(size);

            return [...Array(size).keys()].map(i => i + startAt);
        },
    },

    data () {
        return {
            opponents: 3,
        };
    },

    mounted () {
        this.opponents = this.range(
            parseInt(localStorage.getItem('opponents'))
        );

        if (!this.opponents || this.opponents.length < 1) {
            this.$router.replace({
                name: 'GamePicker',
            });
        }

        this.setup();
    }
};
</script>
