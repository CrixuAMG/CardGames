<template>
    <div id="game-data" class="game-data">
        <div id="deck-counter">
            Cards left: {{ cardsRemaining }}
        </div>
        <div id="turn-counter">
            Turn: {{ turnCounter }}
        </div>
        <div id="turn-for">
            Turn for: Player {{ turnFor }}
        </div>
    </div>
</template>

<script>
    export default {
        name: "GameData",
        data() {
            return {
                cardsRemaining: null,
                turnCounter: null,
                turnFor: null
            }
        },
        mounted() {
            this.$root.$on('game::recalculate:deck-remaining', () => {
                this.cardsRemaining = Cards.deck.length;

                if (!this.cardsRemaining) {
                    this.$root.$emit('game::deck-is-empty');
                }
            });

            this.$root.$on('game::next-turn', () => {
                this.turnCounter = GameManager.turnCounter;
                this.turnFor = GameManager.turnFor;
            });
        }
    }
</script>
