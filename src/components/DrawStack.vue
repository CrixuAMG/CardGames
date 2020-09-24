<template>
    <div class="draw-stack">
        <div :style="style" @click="drawFromStack" class="stack-card" v-for="card in cards">
            <div class="card-background"></div>
        </div>
    </div>
</template>

<script>
import Ruleset from "../lib/GameTypes/MauMau/Ruleset";

export default {
    name:    "DrawStack",
    methods: {
        style() {
            return `transform: rotate(${_.random(-10, 10)};)`;
        },
        drawFromStack() {
            this.$root.$emit('cards::draw-cards-from-deck', {
                player:   GameManager.turnFor,
                amount:   1,
                nextTurn: Ruleset.nextTurnOnDrawCardFromStack
            });
        }
    },
    data() {
        return {
            cards: []
        }
    },
    mounted() {
        this.$root.$on('cards::build::draw-stack', () => {
            this.cards = Cards.get();
        });
    }
}
</script>
