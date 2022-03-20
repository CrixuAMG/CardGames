<template>
    <div class="stack">
        <div class="stack-cards-wrapper">
            <card v-for="(card, index) in cards" :key="index" :card="card" :style="style"></card>
        </div>

        <drop id="stack-dropzone" :class="{overlay: overlay}" @dragend="drop"
              @dragenter="overlay = true" @dragleave="overlay = false" @drop="drop"></drop>
    </div>
</template>

<script>
import Card from "./Card";

export default {
    name:       "Stack",
    components: { Card },
    data () {
        return {
            overlay: false,
            cards:   []
        };
    },

    computed: {
        style () {
            return `transform: rotate(${_.random(-5, 5, false)}deg) translateY(-50%) translateX(-50%);`;
        },
    },

    methods: {
        drop (event) {
            this.overlay = false;
        }
    },

    mounted () {
        this.emitter.$on('stack::add-card', (Card) => {
            this.cards = GameManager.CardsPile;
        });

        this.emitter.$on('stack::remove-card', (Card) => {
            this.cards = GameManager.CardsPile;
        });

        this.emitter.$on('game::deck-is-empty', () => {
            GameManager.Ruleset.deckIsEmpty(this.cards);
        });
    }
};
</script>
