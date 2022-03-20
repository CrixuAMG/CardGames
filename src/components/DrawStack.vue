<template>
    <div class="draw-stack">
        <div v-for="card in cards" :style="style" class="stack-card" @click="drawFromStack">
            <div class="card-background"></div>
        </div>
    </div>
</template>

<script>
import Ruleset from "../lib/GameTypes/MauMau/Ruleset";
import { random } from 'lodash-es';

export default {
    name:    "DrawStack",
    methods: {
        style () {
            return `transform: rotate(${random(-10, 10)};)`;
        },
        drawFromStack () {
            this.emitter.$emit('cards::draw-cards-from-deck', {
                player:   GameManager.turnFor,
                amount:   1,
                nextTurn: Ruleset.nextTurnOnDrawCardFromStack
            });
        }
    },
    data () {
        return {
            cards: []
        };
    },
    mounted () {
        this.emitter.$on('cards::build::draw-stack', () => {
            this.cards = Cards.get();
        });
    }
};
</script>
