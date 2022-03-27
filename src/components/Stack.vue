<template>
    <div class="stack">
        <div class="stack-cards-wrapper">
            <span v-for="(card, index) in cards" :key="index" :style="card.style">
                <card :card="card"/>
            </span>
        </div>

        <drop id="stack-dropzone" :class="{overlay: overlay}" @dragend="drop"
              @dragenter="overlay = true" @dragleave="overlay = false" @drop="drop"/>
    </div>
</template>

<script>
import Card from "./Card";
import { random } from 'lodash-es';
import Drop from '@/modules/vue-drag-drop/Drop';

export default {
    name:       "Stack",
    components: {
        Card,
        Drop,
    },
    data () {
        return {
            overlay: false,
            cards:   [],
        };
    },

    methods: {
        drop () {
            this.overlay = false;
        },
        style () {
            return `transform: rotate(${random(-5, 5, false)}deg) translateY(-50%) translateX(-50%);`;
        },
    },

    mounted () {
        this.emitter.$on('stack::add-card', (Card) => {
            Card.style = this.style();

            this.cards.push(Card);
        });

        this.emitter.$on('stack::remove-card', (Card) => {
            this.cards = GameManager.Ruleset.CardsPile;
        });

        this.emitter.$on('game::deck-is-empty', () => {
            GameManager.Ruleset.deckIsEmpty(this.cards);
        });
    }
};
</script>
