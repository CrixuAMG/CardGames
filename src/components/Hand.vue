<template>
    <div :id="`player-${playerId}`" :class="{'can-play': canPlay}" class="hand">
        <span v-for="(card, index) in cards" :key="index">
            <card :card="card" :draggable="canPlayCard(card)" @click.native="playCard(card)"
                  :style="style(index)" @drag="draggingCard(card, index)" @dragend="dragend(card, $event)"
                  :class="{'from-deck': card.isFromDeck}"/>
        </span>
    </div>
</template>

<script>
import GameManager from '@/lib/Game/GameManager';
import Card from "./Card";
import { filter, forEach } from 'lodash-es';
import { inject } from 'vue';

export default {
    name:       "Hand",
    components: { Card },
    watch:      {
        canPlay (newValue) {
            if (newValue && !this.paused) {
                this.canDrag = newValue;
            }
        },
        paused (newValue) {
            if (!newValue && this.canPlay) {
                this.canDrag = true;
            }
        },
    },
    data () {
        return {
            alias:              inject('username'),
            paused:             false,
            canPlay:            false,
            canDrag:            false,
            draggingCardObject: null,
            playerId:           null,
            cards:              [],
            isHumanPlayer:      true,
        };
    },
    methods: {
        canPlayCard (Card) {
            if (!this.canPlay || !Card) {
                return false;
            }

            return GameManager.Ruleset.cardIsPlayable(Card);
        },
        style (index) {
            let degreesToRotate = (((this.cards.length / 2) / this.cards.length) * 100) - (((this.cards.length - index) / this.cards.length) * 100);

            let style = `transform: rotate(${degreesToRotate}deg);`;

            if (this.cards.length >= 8 && this.cards.length < 10) {
                style += ` margin: 0 -6rem`;
            } else {
                style += ` margin: 0 -8rem`;
            }

            return style;
        },
        draggingCard (Card, index) {
            if (!this.canDrag) {
                return;
            }

            this.canDrag            = false;
            this.draggingCardObject = Card;

            // this.$emit('remove', Card);
        },
        dragend (Card, event) {
            this.canDrag            = true;
            this.draggingCardObject = null;

            if (event?.dataTransfer?.dropEffect === 'none') {
                // this.$emit('add', Card);

                return;
            }

            this.playCard(Card);
        },
        playCard (Card) {
            if (!this.canPlayCard(Card)) {
                return;
            }

            this.cards = filter(this.cards, cardInHand => {
                return cardInHand.isNot(Card);
            });

            this.canPlay = false;

            GameManager.nextTurn(this, Card);
        }
    },
    mounted () {
        this.emitter.$on('game::has-been-setup', () => {
            this.playerId = GameManager.registerPlayer(this);
        });

        this.emitter.$on('game::next-turn', () => {
            this.canPlay = GameManager.turnFor === this.playerId;

            if (this.canPlay) {
                if (!this.cards.length) {
                    GameManager.instance.emitter.$emit('toast::add', {
                        text:     `Player ${this.playerId} won the game!`,
                        canClose: false,
                    });

                    return;
                }

                let playableCards = filter(this.cards, Card => {
                    return GameManager.Ruleset.cardIsPlayable(Card);
                });

                if (!playableCards.length) {
                    let cards = GameManager.Cards.take(1);

                    this.emitter.$emit('Player ' + this.playerId + ' draws ' + cards.length + ' cards');

                    if (cards.length) {
                        forEach(cards, card => {
                            this.cards.push(card);
                        });
                    }

                    GameManager.nextTurn(this);
                }
            }
        });

        this.emitter.$on('cards::draw-cards-from-deck', async (data) => {
            if (data.player === this.playerId) {
                let cards = await Cards.take(data.amount);

                if (cards.length) {
                    const hasAlreadyDrawnCards = this.cards.length > 0;
                    this.cards                 = this.cards.concat(cards.map(card => {
                        if (hasAlreadyDrawnCards) {
                            card.isFromDeck = true;
                        }

                        return card;
                    }));

                    this.emitter.$emit('Player ' + this.playerId + ' draws ' + data.amount + ' cards');
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

    &:after {
        content: '';
        transition: all 1s;
        bottom: -2rem;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% + 15rem);
        position: absolute;
        height: calc(100% + 4rem);
        z-index: -1;
        clip-path: circle(22% 0, 84% 0, 100% 40%, 84% 100%, 22% 100%, 0 40%);
        filter: blur(10rem);
        background-color: transparent;
    }

    &.can-play {
        $animationDuration: 6s;

        &:after {
            background-color: #fff;
            animation-name: fadeInOut;
            animation-duration: $animationDuration;
            animation-iteration-count: infinite;
            animation-delay: $animationDuration;

            @keyframes fadeInOut {
                0% {
                    background-color: rgba(255, 255, 255, 1);
                }
                50% {
                    background-color: rgba(255, 255, 255, 0);
                }
                100% {
                    background-color: rgba(255, 255, 255, 1);
                }
            }
        }

        .card {
            &:hover {
                transform: rotate(0deg) translateY(-80px) scale(1.1) !important;
                z-index: 999;
            }
        }
    }

    .card {
        margin: 0 -50px;
        transition: all 0.3s ease-in-out;
        transform: inherit;

        &.from-deck {
            animation: card;
            animation-duration: 0.5s;

            @keyframes card {
                from {
                    transform: translateX(-50%) translateY(-100px);
                }
                50% {
                    transform: translateX(-50%) translateY(10vh);
                }
                to {
                    transform: unset;
                }
            }
        }
    }
}
</style>