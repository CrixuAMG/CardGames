import GameManager from "../../Game/GameManager";

let Ruleset = {};
Ruleset.nextTurnOnDrawCardFromStack = false;
Ruleset.beforeTurn = (Player) => {
    if (!Player.cards.length) {
        console.log('PLAYER ' + Player.playerId + ' WON THE GAME!!');

        return false;
    }

    let lastPlayedCard = _.last(GameManager.playedCards);

    if (lastPlayedCard) {
        if (lastPlayedCard.value === 2) {
            console.log(Player.playerId + ' plays a DRAW TWO!');
            GameManager.instance.$root.$emit('log', {message: Player.playerId + ' plays a DRAW TWO!'});

            GameManager.instance.$root.$emit('cards::draw-cards-from-deck', {
                player: Player.playerId >= GameManager.playerCount
                    ? Player.playerId - 1
                    : Player.playerId + 1,
                amount: 2
            });
        }

        if (lastPlayedCard.value === 8) {
            console.log(Player.playerId + ' plays a SKIP!');
            GameManager.instance.$root.$emit('log', {message: Player.playerId + ' plays a SKIP!'});

            GameManager.nextTurn();

            return false;
        }

        if (lastPlayedCard.value === 14 || lastPlayedCard.value === 7) {
            console.log(Player.playerId + ' can play again!');
            GameManager.instance.$root.$emit('log', {message: Player.playerId + ' can play again!'});

            if (GameManager.turnDirection === 'ASC') {
                if (GameManager.turnFor - 1 < 1) {
                    GameManager.turnFor = GameManager.playerCount;
                } else {
                    GameManager.turnFor -= 1;
                }
            } else {
                if (GameManager.turnFor + 1 > GameManager.playerCount) {
                    GameManager.turnFor = 1;
                } else {
                    GameManager.turnFor += 1;
                }
            }

            return true;
        }

        if (lastPlayedCard.value === 1) {
            console.log(Player.playerId + ' plays a REVERSE!');
            GameManager.instance.$root.$emit('log', {message: Player.playerId + ' plays a REVERSE!'});

            GameManager.reverseDirection();
        }

        if (lastPlayedCard.value === 'JOKER') {
            console.log(Player.playerId + ' plays a JOKER!');
            GameManager.instance.$root.$emit('log', {message: Player.playerId + ' plays a JOKER!'});

            GameManager.instance.$root.$emit('cards::draw-cards-from-deck', {
                player: Player.playerId >= GameManager.playerCount
                    ? Player.playerId - 1
                    : Player.playerId + 1,
                amount: 5
            });
        }
    }

    return true;
};
Ruleset.cardIsPlayable = (Card) => {
    if (GameManager.playedCards.length) {
        let lastPlayedCard = _.last(GameManager.playedCards);

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
    }

    return true;
};
Ruleset.deckIsEmpty = function (cards) {
    _.forEach(cards, card => {
        GameManager.instance.$root.$emit('stack::remove-card', card);
    });

    Cards.deck = _.shuffle(cards);
};

export default Ruleset;
