import Cards from "@/lib/Cards/Cards";
import { filter } from 'lodash-es';

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

        if (Card) {
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
                // @ts-ignore
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
        console.log('START GAME');

        this.instance.emitter.$emit('cards::build::draw-stack');

        console.log(this);

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

        console.log(this.playerCount + ' players have been registered');

        return this.playerCount;
    },

    getPlayerAlias() {
        const player = this.players?.[this.turnFor];

        return player?.alias || `Opponent ${this.turnFor}`;
    },
};


window.GameManager = GameManager;

export default GameManager;
