import Cards from "@/lib/Cards/Cards";
import { filter, forEach } from 'lodash-es';

let GameManager = {
    turnCounter:   0,
    turnFor:       null,
    turnDirection: 'ASC',
    playerCount:   0,
    instance:      {},
    Cards:         Cards,
    CardsPile:     [],
    Ruleset:       {},
    playedCards:   [],
    players:       [],
    paused:        false,

    registerEventHandlers () {
        this.instance.emitter.$on('stack::add-card', (Card) => {
            this.CardsPile.push(Card);
        });

        this.instance.emitter.$on('stack::remove-card', (Card) => {
            this.CardsPile = filter(this.CardsPile, (cardInStack) => {
                return cardInStack.is(Card);
            });
        });
    },

    setup (instance, Ruleset) {
        this.instance    = instance;
        this.Cards       = Cards;
        this.Ruleset     = Ruleset;
        this.CardsPile   = [];
        this.players     = [];
        this.playerCount = 0;

        this.registerEventHandlers();

        this.instance.emitter.$emit('game::has-been-setup');
    },

    nextTurn (Player, Card) {
        this.updateTurn();

        let emitEvent = true;

        if (typeof Card !== 'undefined') {
            this.Ruleset.cardIsPlayed(Player, Card);

            if (typeof Player !== "undefined" && this.Ruleset.beforeTurn && typeof this.Ruleset.beforeTurn === 'function') {
                emitEvent = this.Ruleset.beforeTurn(Player);
            }
        }

        this.instance.emitter.$emit('game::recalculate:deck-remaining');

        if (!this.Cards.deck.length) {
            this.Ruleset.deckIsEmpty(this.CardsPile);
        }

        if (typeof Player !== "undefined" && typeof this.Ruleset.afterTurn === 'function') {
            this.Ruleset.afterTurn(Player);
        }

        if (emitEvent) {
            setTimeout(() => {
                this.instance.emitter.$emit('game::next-turn', this.turnFor);
            }, 1500);
        }
    },

    directionIsAscending () {
        return this.turnDirection === 'ASC';
    },

    reverseDirection () {
        if (this.directionIsAscending()) {
            this.turnDirection = 'DESC';
        } else {
            this.turnDirection = 'ASC';
        }
    },

    startGame () {
        this.instance.emitter.$emit('cards::build::draw-stack');

        for (let player = 1; player <= this.playerCount; player++) {
            this.instance.emitter.$emit('cards::draw-cards-from-deck', {
                player: player,
                amount: 7,
            });
        }

        this.instance.emitter.$emit('game::start');

        this.nextTurn();
    },

    registerPlayer (player) {
        this.playerCount += 1;
        this.players[this.playerCount] = player;

        this.players = this.players.filter(player => !!player);

        return this.playerCount;
    },

    getPlayerAlias (player) {
        return player?.alias || this.currentPlayer()?.alias;
    },

    pause (isPaused) {
        this.paused = isPaused;

        forEach(this.players, player => {
            player.paused = this.paused;
        });
    },

    updateTurn () {
        let turnFor = this.turnFor;
        if (turnFor === null) {
            turnFor = 0;
        }

        if (this.turnDirection === 'ASC') {
            if (turnFor + 1 > this.playerCount) {
                turnFor = 1;
            } else {
                turnFor += 1;
            }
        } else {
            if (turnFor - 1 < 1) {
                turnFor = this.playerCount;
            } else {
                turnFor -= 1;
            }
        }

        this.turnFor = turnFor;
    },

    getPlayer (id) {
        if (this.turnFor === null) {
            return {};
        }

        return this.players?.[id];
    },

    currentPlayer () {
        return this.getPlayer(this.turnFor - 1);
    },

    previousPlayer () {
        let id = this.directionIsAscending() ? this.turnFor - 1 : this.turnFor + 1;
        if (id > GameManager.playerCount) {
            id = 0;
        } else if (id < 0) {
            id = GameManager.playerCount;
        }

        return this.getPlayer(id);
    },

    nextPlayer () {
        let id = this.directionIsAscending() ? this.turnFor + 1 : this.turnFor - 1;
        if (id > GameManager.playerCount) {
            id = 0;
        } else if (id < 0) {
            id = GameManager.playerCount;
        }

        return this.getPlayer(id);
    },
};

window.GameManager = GameManager;

export default GameManager;
