<template>
    <div id="game-data" class="game-data">
        <div id="deck-counter">
            <div class="game-data-title">
                Cards left:
            </div>
            <div class="game-data-data">
                {{ cardsRemaining }}
            </div>
        </div>
        <div id="turn-counter">
            <div class="game-data-title">
                Turn:
            </div>
            <div class="game-data-data">
                {{ turnCounter || 0 }}
            </div>
        </div>
        <div id="turn-for">
            <div class="game-data-title">
                Turn for:
            </div>
            <div class="game-data-data">
                {{ turnForText }}
            </div>
        </div>
    </div>
</template>

<script>
import GameManager from '../lib/Game/GameManager';

export default {
    name: "GameData",
    data () {
        return {
            cardsRemaining: null,
            turnCounter:    null,
            turnFor:        null,
            turnForText:    null,
        };
    },
    mounted () {
        this.emitter.$on('game::recalculate:deck-remaining', () => {
            this.cardsRemaining = Cards.deck.length;

            if (!this.cardsRemaining) {
                this.emitter.$emit('game::deck-is-empty');
            }
        });

        this.emitter.$on('game::next-turn', () => {
            this.turnCounter = GameManager.turnCounter;
            this.turnFor     = GameManager.turnFor;
            this.turnForText = GameManager.getPlayerAlias();
        });
    }
};
</script>
