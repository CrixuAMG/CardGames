<template>
    <div class="pesten">
        <div class="d-flex flex-row justify-between">
            <game-data></game-data>

            <game-log></game-log>

            <div class="opponents">
                <opponent v-for="(opponent, index) in opponents" :key="index"></opponent>
            </div>
        </div>

        <stack></stack>
        <draw-stack></draw-stack>


        <hand></hand>
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
        name: "Pesten",
        components: {GameLog, Opponent, GameData, DrawStack, Stack, Hand},
        methods: {
            setup() {
                Cards.get(true, true);
                GameManager.setup(this, Ruleset);

                GameManager.startGame();
            },
        },
        data() {
            return {
                opponents: 3
            }
        },

        mounted() {
            this.opponents = localStorage.getItem('opponents');

            this.setup();
        }
    }
</script>
