<template>
    <div class="mau-mau">
        <div class="d-flex flex-row justify-between">
            <game-data></game-data>

            <game-log></game-log>

            <div class="opponents">
                <opponent></opponent>
                <opponent></opponent>
                <opponent></opponent>
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
    import Ruleset from "../lib/GameTypes/MauMau/Ruleset";
    import GameLog from "../components/GameLog";

    export default {
        name: "MauMau",
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
                hand: [],
            }
        },

        mounted() {
            this.setup();
        }
    }
</script>
