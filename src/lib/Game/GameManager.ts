import Cards from "@/lib/Cards/Cards";
import {Component} from "vue";
import Card from "@/lib/Cards/Card";

let GameManager = {
    turnCounter: 0,
    turnFor: <number | null>null,
    turnDirection: 'ASC',
    playerCount: 0,
    instance: null,
    Cards: Cards,
    CardsPile: [],
    Ruleset: {},
    playedCards: [],
    players: [],

    registerEventHandlers() {
        // @ts-ignore
        this.instance.$root.$on('stack::add-card', (Card) => {
            this.CardsPile.push(Card);
        });

        // @ts-ignore
        this.instance.$root.$on('stack::remove-card', (Card) => {
            this.CardsPile = _.filter(this.CardsPile, (cardInStack) => {
                return cardInStack.indentifier === Card.identifier;
            });
        });
    },

    setup(instance: {playerId: number}, Ruleset: object) {
        this.instance = instance;
        this.Cards = Cards;
        this.Ruleset = Ruleset;
        this.CardsPile = [];
        this.players = [];
        this.playerCount = null;

        this.registerEventHandlers();

        // @ts-ignore
        this.instance.$root.$emit('game::has-been-setup');
    },

    nextTurn(Player?: {playerId: number}, Card?: Card) {
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
            // @ts-ignore
            this.instance.$root.$emit('stack::add-card', Card);

            emitEvent = this.Ruleset.beforeTurn(Player);
        }

        // @ts-ignore
        this.instance.$root.$emit('game::recalculate:deck-remaining');

        if (!this.Cards.deck.length) {
            this.Ruleset.deckIsEmpty(this.CardsPile);
        }

        if (emitEvent) {
            setTimeout(() => {
                // @ts-ignore
                this.instance.$root.$emit('game::next-turn', this.turnFor);
            }, 1000);
        }
    },

    reverseDirection() {
        if (this.turnDirection === 'ASC') {
            this.turnDirection = 'DESC';
        } else {
            this.turnDirection = 'ASC';
        }
    },

    startGame() {
        console.log('START GAME');

        // @ts-ignore
        this.instance.$root.$emit('cards::build::draw-stack');

        for (let player = 1; player <= this.playerCount; player++) {
            this.instance.$root.$emit('cards::draw-cards-from-deck', {
                player: player,
                amount: 7
            });
        }

        // @ts-ignore
        this.instance.$root.$emit('game::start');

        this.nextTurn();
    },

    registerPlayer(player: {playerId: number}) {
        this.playerCount += 1;
        this.players[this.playerCount] = player;

        // @ts-ignore
        console.log(this.playerCount + ' players have been registered');

        return this.playerCount;
    }
};

window.GameManager = GameManager;

export default GameManager;
