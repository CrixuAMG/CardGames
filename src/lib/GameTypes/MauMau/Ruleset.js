import Cards from '@/lib/Cards/Cards';
import GameManager from '@/lib/Game/GameManager';
import { forEach, last, shuffle } from 'lodash-es';

let Ruleset = {
    nextTurnOnDrawCardFromStack: false,

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
            }

            if (lastPlayedCard.value === 8) {
                logEvent = { message: GameManager.getPlayerAlias() + ' plays a SKIP!' };
                GameManager.instance.emitter.$emit('log', logEvent);

                GameManager.nextTurn();

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
    }
};

export default Ruleset;
