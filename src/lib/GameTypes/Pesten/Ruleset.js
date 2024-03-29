import Cards from '@/lib/Cards/Cards';
import GameManager from '@/lib/Game/GameManager';
import { filter, forEach, last, random, shuffle } from 'lodash-es';

let Ruleset = {
    CardsPile:                   [],
    nextTurnOnDrawCardFromStack: false,

    setup: function () {
        this.CardsPile = [];

        this.registerEventHandlers();
    },

    registerEventHandlers () {
        GameManager.instance.emitter.$on('stack::add-card', (Card) => {
            this.CardsPile.push(Card);
        });

        GameManager.instance.emitter.$on('stack::remove-card', (Card) => {
            this.CardsPile = filter(this.CardsPile, (cardInStack) => {
                return cardInStack.is(Card);
            });
        });
    },

    startGame () {
        GameManager.instance.emitter.$emit('cards::build::draw-stack');

        for (let player = 1; player <= GameManager.playerCount; player++) {
            GameManager.instance.emitter.$emit('cards::draw-cards-from-deck', {
                player: player,
                amount: 7,
            });
        }

        GameManager.instance.emitter.$emit('game::start');

        this.nextTurn();
    },

    nextTurn (Player, Card) {
        GameManager.updateTurn();

        let emitEvent = true;

        if (typeof Card !== 'undefined') {
            this.cardIsPlayed(Player, Card);

            if (typeof Player !== "undefined" && this.beforeTurn && typeof this.beforeTurn === 'function') {
                emitEvent = this.beforeTurn(Player);
            }
        }

        GameManager.instance.emitter.$emit('game::recalculate:deck-remaining');

        if (!GameManager.Cards.deck.length) {
            this.deckIsEmpty(this.CardsPile);
        }

        if (typeof Player !== "undefined" && typeof this.afterTurn === 'function') {
            this.afterTurn(Player);
        }

        if (emitEvent) {
            setTimeout(() => {
                GameManager.instance.emitter.$emit('game::next-turn', this.turnFor);
            }, 1500);
        }
    },

    beforeTurn: (Player) => {
        if (!Player.cards.length) {
            GameManager.instance.emitter.$emit('toast::add', {
                text:     `Player ${Player.playerId} won the game!`,
                canClose: false,
            });

            return false;
        }

        if (!GameManager.playedCards.length) {
            return true;
        }

        let lastPlayedCard = last(GameManager.playedCards);
        let logEvent;

        if (lastPlayedCard) {
            if (lastPlayedCard.value === 2) {
                logEvent = { message: GameManager.getPlayerAlias() + ' plays a DRAW TWO!' };
                GameManager.instance.emitter.$emit('log', logEvent);

                GameManager.instance.emitter.$emit('cards::draw-cards-from-deck', {
                    player: Player.playerId >= GameManager.playerCount - 1
                                ? Player.playerId - 1
                                : Player.playerId + 1,
                    amount: 2
                });

                if (GameManager.currentPlayer()?.isHumanPlayer) {
                    GameManager.instance.emitter.$emit('toast::add', {
                        text: '2! Trek 2 kaarten!',
                    });
                }
            }

            if (lastPlayedCard.value === 8) {
                logEvent = { message: GameManager.getPlayerAlias() + ' plays a SKIP!' };
                GameManager.instance.emitter.$emit('log', logEvent);

                GameManager.Ruleset.nextTurn();

                return false;
            }

            if (lastPlayedCard.value === 14 || lastPlayedCard.value === 7) {
                logEvent = { message: GameManager.getPlayerAlias() + ' can play again!' };
                GameManager.instance.emitter.$emit('log', logEvent);

                GameManager.updateTurn();

                return true;
            }

            if (lastPlayedCard.value === 1) {
                logEvent = { message: GameManager.getPlayerAlias() + ' plays a REVERSE!' };
                GameManager.instance.emitter.$emit('log', logEvent);

                GameManager.reverseDirection();
            }

            if (lastPlayedCard.value === 'JOKER') {
                logEvent = { message: GameManager.getPlayerAlias() + ' plays a JOKER!' };
                GameManager.instance.emitter.$emit('log', logEvent);

                GameManager.instance.emitter.$emit('cards::draw-cards-from-deck', {
                    player: Player.playerId >= GameManager.playerCount - 1
                                ? Player.playerId - 1
                                : Player.playerId + 1,
                    amount: 5
                });

                if (GameManager.currentPlayer()?.isHumanPlayer) {
                    GameManager.instance.emitter.$emit('toast::add', {
                        text: 'JOKER! Trek 5 kaarten!',
                    });
                }
            }
        }

        return true;
    },

    cardIsPlayable: (Card) => {
        if (!GameManager.playedCards.length) {
            return true;
        }

        let lastPlayedCard = last(GameManager.playedCards);

        if (lastPlayedCard.value === 'JOKER') {
            return true;
        }

        if (Card.suit === lastPlayedCard.suit) {
            return true;
        }

        if (Card.value === lastPlayedCard.value) {
            return true;
        }

        if (Card.value === 11) {
            return true;
        }

        return Card.value === 'JOKER';
    },

    deckIsEmpty: (cards = []) => {
        forEach(cards, (card) => {
            GameManager.instance.emitter.$emit('stack::remove-card', card);
        });

        Cards.deck = shuffle(cards);
    },

    cardToPlay: (Player, Cards = []) => {
        let playableCards = filter(Cards, Card => GameManager.Ruleset.cardIsPlayable(Card));

        if (!playableCards.length) {
            let cardsTakenFromPile = GameManager.Cards.take(1);

            forEach(cardsTakenFromPile, card => {
                Cards.push(card);
            });

            GameManager.Ruleset.nextTurn(Player);

            return;
        }

        return playableCards[random(0, playableCards.length - 1)];
    },

    cardIsPlayed (Player, Card) {
        GameManager.playedCards.push(Card);
        GameManager.instance.emitter.$emit('stack::add-card', Card);
        GameManager.instance.emitter.$emit('card::to-history', {
            player: Player,
            card:   Card
        });
    },
};

export default Ruleset;
