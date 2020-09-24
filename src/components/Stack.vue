<template>
    <div class="stack">
        <div class="stack-cards-wrapper">
            <!--            <div class="stack-card" v-for="card in cards" :style="style(card)"></div>-->

            <card :card="card" :style="style(card)" v-for="card in cards"></card>
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
    methods:    {
        style() {
            return `transform: rotate(${_.random(-5, 5, false)}deg) translateY(-50%) translateX(-50%);`;
        },
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
