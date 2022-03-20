<template>
    <div :id="`player-${playerId}`" :class="{'turn-for': canPlay}" class="opponent">
        OPPONENT {{ playerId }} ({{ cards.length }} cards)
    </div>
</template>

<script>
import GameManager from '@/lib/Game/GameManager';

export default {
    name: "Opponent",

    data () {
        return {
            playerId: null,
            canPlay:  false,
            cards:    []
        };
    },

    watch: {
        canPlay (newValue) {
            if (newValue) {
                this.playCard();
            }
        }
    },

    methods: {
        playCard () {
            if (!this.cards.length) {
                console.log(`Player ${this.playerId} won the game!`);
                GameManager.instance.$root.$emit(`Player ${this.playerId} won the game!`);

                return;
            }

            let playableCards = _.filter(this.cards, Card => {
                return GameManager.Ruleset.cardIsPlayable(Card);
            });

            if (!playableCards.length) {
                console.log('OPPONENT ' + this.playerId + ' CANNOT PLAY ANY CARDS');
                GameManager.instance.$root.$emit('OPPONENT ' + this.playerId + ' CANNOT PLAY ANY CARDS');

                let cards = GameManager.Cards.take(1);

                if (cards) {
                    this.$root.$emit('Player ' + this.playerId + ' draws ' + cards.length + ' cards');

                    _.forEach(cards, card => {
                        this.cards.push(card);
                    });
                }

                GameManager.nextTurn(this);

                return;
            }

            let Card = playableCards[_.random(0, playableCards.length - 1)];

            this.cards = _.filter(this.cards, cardInHand => {
                return cardInHand.isNot(Card);
            });

            this.canPlay = false;
            GameManager.nextTurn(this, Card);
        }
    },

    created () {
        this.$root.$on('game::has-been-setup', () => {
            this.playerId = GameManager.registerPlayer(this);
        });

        this.$root.$on('game::next-turn', () => {
            this.canPlay = GameManager.turnFor === this.playerId;
        });

        this.$root.$on('cards::draw-cards-from-deck', async (data) => {
            if (data.player === this.playerId) {
                let cards = await Cards.take(data.amount);

                _.forEach(cards, card => {
                    this.cards.push(card);
                });

                this.$root.$emit('Player ' + this.playerId + ' draws ' + data.amount + ' cards');

                if (data.nextTurnOnDrawCardFromStack) {
                    GameManager.nextTurn();
                }
            }
        });
    }
};
</script>
