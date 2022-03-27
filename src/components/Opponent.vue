<template>
    <div :id="`player-${playerId}`" :class="{'turn-for': canPlay}" class="opponent">
        {{ alias }} ({{ cards.length }} cards)
    </div>
</template>

<script>
import GameManager from '@/lib/Game/GameManager';
import { cloneDeep, filter } from 'lodash-es';
import { faker } from '@faker-js/faker';

export default {
    name: "Opponent",

    data () {
        return {
            playerId: null,
            canPlay:  false,
            cards:    [],
            paused:   false,
            alias:    null,
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
        async playCard () {
            const cards = cloneDeep(this.cards);

            if (!cards.length) {
                GameManager.instance.emitter.$emit('toast::add', {
                    text:     `Player ${this.playerId} won the game!`,
                    canClose: false,
                });

                return;
            }

            const Card = GameManager.Ruleset.cardToPlay(this, cards);

            if (!Card) {
                GameManager.instance.emitter.$emit('toast::add', {
                    text: `${this.alias}: getting a new card from the stack!`,
                });
                let cards = await Cards.take(1);

                this.cards = this.cards.concat(cards);

                if (!GameManager.Ruleset.nextTurnOnDrawCardFromStack) {
                    setTimeout(() => {
                        this.playCard();
                    }, 1500);
                }

                return;
            }

            this.cards = filter(cards, cardInHand => cardInHand.isNot(Card))
                .filter(cardInHand => !!cardInHand);

            this.canPlay = false;
            GameManager.Ruleset.nextTurn(this, Card);
        },
    },

    created () {
        this.emitter.$on('game::has-been-setup', () => {
            this.alias = faker.name.firstName();

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
                    GameManager.Ruleset.nextTurn();
                }
            }
        });
    }
};
</script>
