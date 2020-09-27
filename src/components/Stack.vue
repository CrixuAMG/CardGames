<template>
    <div class="stack">
        <div class="stack-cards-wrapper">
            <card :card="card" :style="style" :key="index" v-for="(card, index) in cards"></card>
        </div>

        <drop :class="{overlay: overlay}" @dragend="drop" @dragenter="overlay = true"
              @dragleave="overlay = false" @drop="drop" id="stack-dropzone"></drop>
    </div>
</template>

<script>
import Card from "./Card";

export default {
    name:       "Stack",
    components: {Card},
    data() {
        return {
            overlay: false,
            cards:   []
        }
    },
    
    computed: {
        style() {
            return `transform: rotate(${_.random(-5, 5, false)}deg) translateY(-50%) translateX(-50%);`;
        },
    },

    methods:    {
        drop(event) {
            this.overlay = false;
        }
    },

    mounted() {
        this.$root.$on('stack::add-card', (Card) => {
            this.cards = GameManager.CardsPile;
        });

        this.$root.$on('stack::remove-card', (Card) => {
            this.cards = GameManager.CardsPile;
        });

        this.$root.$on('game::deck-is-empty', () => {
            GameManager.Ruleset.deckIsEmpty(this.cards);
        });
    }
}
</script>
