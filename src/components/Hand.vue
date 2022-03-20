<template>
    <div :id="`player-${playerId}`" :class="{'can-play': canPlay}" class="hand">
        <card v-for="(card, index) in cards" :card="card" :draggable="canPlayCard(card)"
              :style="style(index)" @drag="draggingCard(card, index)" @dragend="dragend(card, $event)"
              @click.native="playCard(card)"></card>
    </div>
</template>

<script>
import GameManager from '@/lib/Game/GameManager';
import Card from "./Card";

export default {
    name:       "Hand",
    components: { Card },
    watch:      {
        canPlay (newValue) {
            this.canDrag = newValue;
        }
    },
    data () {
        return {
            canPlay:            false,
            canDrag:            false,
            draggingCardObject: null,
            playerId:           null,
            cards:              []
        };
    },
    methods: {
        canPlayCard (Card) {
            if (!this.canPlay) {
                return false;
            }

            return GameManager.Ruleset.cardIsPlayable(Card);
        },
        style (index) {
            let degreesToRotate = (((this.cards.length / 2) / this.cards.length) * 100) - (((this.cards.length - index) / this.cards.length) * 100);

            let style = `transform: rotate(${degreesToRotate}deg);`;

            if (this.cards.length >= 8 && this.cards.length < 10) {
                style += ` margin: 0 -60px`;
            } else {
                style += ` margin: 0 -80px`;
            }

            return style;
        },
        draggingCard (Card, index) {
            if (!this.canDrag) {
                return;
            }

            this.canDrag            = false;
            this.draggingCardObject = Card;

            console.log('DRAGGING ' + Card.name + ' of ' + Card.suit + 's');
            // this.$emit('remove', Card);
        },
        dragend (Card, event) {
            this.canDrag            = true;
            this.draggingCardObject = null;

            if (event.dataTransfer.dropEffect === 'none') {
                // this.$emit('add', Card);

                return;
            }

            this.playCard(Card);
        },
        playCard (Card) {
            if (!this.canPlayCard(Card)) {
                return;
            }

            this.cards = _.filter(this.cards, cardInHand => {
                return cardInHand.isNot(Card);
            });

            this.canPlay = false;

            GameManager.nextTurn(this, Card);
        }
    },
    mounted () {
        this.$root.$on('game::has-been-setup', () => {
            this.playerId = GameManager.registerPlayer(this);
        });

        this.$root.$on('game::next-turn', () => {
            this.canPlay = GameManager.turnFor === this.playerId;

            if (this.canPlay) {
                if (!this.cards.length) {
                    console.log(`Player ${this.playerId} won the game!`);
                    GameManager.instance.$root.$emit(`Player ${this.playerId} won the game!`);

                    return;
                }

                let playableCards = _.filter(this.cards, Card => {
                    return GameManager.Ruleset.cardIsPlayable(Card);
                });

                if (!playableCards.length) {
                    console.log('PLAYER ' + this.playerId + ' CANNOT PLAY ANY CARDS');
                    GameManager.instance.$root.$emit('Player ' + this.playerId + ' CANNOT PLAY ANY CARDS');

                    let cards = GameManager.Cards.take(1);

                    this.$root.$emit('Player ' + this.playerId + ' draws ' + cards.length + ' cards');

                    if (cards.length) {
                        _.forEach(cards, card => {
                            this.cards.push(card);
                        });
                    }

                    GameManager.nextTurn(this);
                }
            }
        });

        this.$root.$on('cards::draw-cards-from-deck', async (data) => {
            if (data.player === this.playerId) {
                let cards = await Cards.take(data.amount);

                if (cards.length) {
                    _.forEach(cards, card => {
                        this.cards.push(card);
                    });

                    this.$root.$emit('Player ' + this.playerId + ' draws ' + data.amount + ' cards');
                }

                if (data.nextTurn) {
                    GameManager.nextTurn();
                }
            }
        });
    }
};
</script>

<style lang="scss" scoped>
.hand {
    display: flex;
    flex-flow: row nowrap;
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 90vw;
    justify-content: center;
    width: max-content;

    /*
    &.can-play {
        &:after {
            border: 10px solid #3bffd1;
            border-radius: 15px;
            content: '';
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% + 250px);
            position: absolute;
            height: calc(100% + 0px);
            z-index: -1;
            transition: all 1s;
        }
    }
     */

    .card {
        margin: 0 -50px;

        &:hover {
            transform: rotate(0deg) translateY(-80px) scale(1.1) !important;
            z-index: 999;
        }
    }
}
</style>