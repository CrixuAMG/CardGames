<template>
    <div :id="`player-${playerId}`" :class="{'turn-for': canPlay}" class="opponent">
        OPPONENT {{ playerId }} ({{ cards.length }} cards)
    </div>
</template>

<script>
import GameManager from '@/lib/Game/GameManager';
import { cloneDeep, filter, forEach, random } from 'lodash-es';

export default {
    name: "Opponent",

    data () {
        return {
            playerId: null,
            canPlay:  false,
            cards:    [],
            paused:   false,
        };
    },

    watch: {
        canPlay () {
            if (!this.paused && this.canPlay) {
                this.playCard();
            }
        },
        paused () {
            if (!this.paused && this.canPlay) {
                this.playCard();
            }
        },
    },

    methods: {
        playCard () {
            const cards = cloneDeep(this.cards);
            if (!cards.length) {
                GameManager.instance.emitter.$emit('toast::add', {
                    text:     `Player ${this.playerId} won the game!`,
                    canClose: false,
                });

                return;
            }

            let playableCards = filter(cards, Card => GameManager.Ruleset.cardIsPlayable(Card));

            if (!playableCards.length) {
                console.log('OPPONENT ' + this.playerId + ' CANNOT PLAY ANY CARDS');
                GameManager.instance.emitter.$emit('OPPONENT ' + this.playerId + ' CANNOT PLAY ANY CARDS');

                let cardsTakenFromPile = GameManager.Cards.take(1);

                if (cardsTakenFromPile) {
                    this.emitter.$emit('Player ' + this.playerId + ' draws ' + cardsTakenFromPile.length + ' cards');

                    forEach(cardsTakenFromPile, card => {
                        console.log(card);
                        cards.push(card);
                    });
                }

                GameManager.nextTurn(this);

                return;
            }

            let Card = playableCards[random(0, playableCards.length - 1)];

            this.cards = filter(cards, cardInHand => cardInHand.isNot(Card))
                .filter(cardInHand => !!cardInHand);

            this.canPlay = false;
            GameManager.nextTurn(this, Card);
        }
    },

    created () {
        this.emitter.$on('game::has-been-setup', () => {
            this.playerId = GameManager.registerPlayer(this);
        });

        this.emitter.$on('game::next-turn', () => {
            this.canPlay = GameManager.turnFor === this.playerId;
        });

        this.emitter.$on('cards::draw-cards-from-deck', async (data) => {
            if (data.player === this.playerId) {
                let cards = await Cards.take(data.amount);

                this.cards = this.cards.concat(cards);

                this.emitter.$emit('Player ' + this.playerId + ' draws ' + data.amount + ' cards');

                if (data.nextTurnOnDrawCardFromStack) {
                    GameManager.nextTurn();
                }
            }
        });
    }
};
</script>
