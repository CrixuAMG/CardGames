<template>
    <div :id="`player-${playerId}`" :class="{'turn-for': canPlay}" class="opponent">
        OPPONENT {{ playerId }} ({{ cards.length }} cards)
    </div>
</template>

<script>
import GameManager from '@/lib/Game/GameManager';
import { cloneDeep, filter, findIndex, forEach, random } from 'lodash-es';

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
            const cards = cloneDeep(this.cards);
            if (!cards.length) {
                console.log(`Player ${this.playerId} won the game!`);
                GameManager.instance.emitter.$emit(`Player ${this.playerId} won the game!`);

                return;
            }

            console.log(cards);
            let playableCards = filter(cards, Card => GameManager.Ruleset.cardIsPlayable(Card));

            if (!playableCards.length) {
                console.log('OPPONENT ' + this.playerId + ' CANNOT PLAY ANY CARDS');
                GameManager.instance.emitter.$emit('OPPONENT ' + this.playerId + ' CANNOT PLAY ANY CARDS');

                let cardsTakenFromPile = GameManager.Cards.take(1);

                if (cardsTakenFromPile) {
                    this.emitter.$emit('Player ' + this.playerId + ' draws ' + cardsTakenFromPile.length + ' cards');

                    forEach(cardsTakenFromPile, card => {
                        cards.push(card);
                    });
                }

                GameManager.nextTurn(this);

                return;
            }

            let Card = playableCards[random(0, playableCards.length - 1)];

            const cardIndex = findIndex(cards, cardInHand => cardInHand.is(Card));

            delete cards[cardIndex];

            this.cards = cards;

            this.canPlay = false;
            GameManager.nextTurn(this, Card);
        }
    },

    created () {
        this.emitter.$on('game::has-been-setup', () => {
            const playerId = GameManager.registerPlayer(this);

            console.log(playerId);

            this.playerId = playerId;
        });

        this.emitter.$on('game::next-turn', () => {
            this.canPlay = GameManager.turnFor === this.playerId;
        });

        this.emitter.$on('cards::draw-cards-from-deck', async (data) => {
            if (data.player === this.playerId) {
                let cards = await Cards.take(data.amount);

                forEach(cards, card => {
                    this.cards.push(card);
                });

                this.emitter.$emit('Player ' + this.playerId + ' draws ' + data.amount + ' cards');

                if (data.nextTurnOnDrawCardFromStack) {
                    GameManager.nextTurn();
                }
            }
        });
    }
};
</script>
