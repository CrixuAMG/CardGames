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
        if (typeof Player !== "undefined" && this.Ruleset.afterTurn && typeof this.Ruleset.afterTurn === 'function') {
            this.Ruleset.afterTurn(Player);
        }

        if (this.turnFor === null) {
            this.turnFor = 0;
        }

        if (this.turnDirection === 'ASC') {
            if (this.turnFor + 1 > this.playerCount) {
                this.turnFor = 1;
            } else {
                this.turnFor += 1;
            }
        } else {
            if (this.turnFor - 1 < 1) {
                this.turnFor = this.playerCount;
            } else {
                this.turnFor -= 1;
            }
        }

        this.turnCounter += 1;

        let emitEvent = true;

        if (typeof Card !== 'undefined') {
            this.playedCards.push(Card);
            this.instance.emitter.$emit('stack::add-card', Card);

            if (typeof Player !== "undefined" && this.Ruleset.beforeTurn && typeof this.Ruleset.beforeTurn === 'function') {
                emitEvent = this.Ruleset.beforeTurn(Player);
            }
        }

        this.instance.emitter.$emit('game::recalculate:deck-remaining');

        if (!this.Cards.deck.length) {
            this.Ruleset.deckIsEmpty(this.CardsPile);
        }

        if (emitEvent) {
            setTimeout(() => {
                this.instance.emitter.$emit('game::next-turn', this.turnFor);
            }, 1000);
        }
    },

    reverseDirection () {
        if (this.turnDirection === 'ASC') {
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

    currentPlayer () {
        if (this.turnFor === null) {
            return {};
        }

        return this.players?.[this.turnFor - 1];
    },

    getPlayerAlias () {
        return this.currentPlayer()?.alias || `Opponent ${this.turnFor}`;
    },

    pause (isPaused) {
        this.paused = isPaused;

        forEach(this.players, player => {
            player.paused = this.paused;
        });
    },
};


window.GameManager = GameManager;

export default GameManager;
