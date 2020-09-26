import Cards from "@/lib/Cards/Cards";
import IGameManager from "@/lib/Interfaces/IGameManager";
import IRuleset from "@/lib/Interfaces/IRuleset";
import IPlayer from "@/lib/Interfaces/IPlayer";
import ICard from '../Interfaces/ICard';
import Card from "@/lib/Cards/Card";

let GameManager: IGameManager;
GameManager = {
    turnCounter: 0,
    turnFor: null,
    turnDirection: 'ASC',
    playerCount: 0,
    instance: {} as IPlayer,
    Cards: Cards,
    CardsPile: [],
    Ruleset: {} as IRuleset,
    playedCards: [],
    players: [],

    registerEventHandlers() {
        this.instance.$root.$on('stack::add-card', (Card: Card) => {
            this.CardsPile.push(Card);
        });

        this.instance.$root.$on('stack::remove-card', (Card: Card) => {
            this.CardsPile = _.filter(this.CardsPile, (cardInStack: Card) => {
                return cardInStack.is(Card);
            });
        });
    },

    setup(instance: IPlayer, Ruleset: IRuleset) {
        this.instance = instance;
        this.Cards = Cards;
        this.Ruleset = Ruleset;
        this.CardsPile = [];
        this.players = [];
        this.playerCount = 0;

        this.registerEventHandlers();

        console.log('here');

        this.instance.$root.$emit('game::has-been-setup');
    },

    nextTurn(Player?: IPlayer, Card?: ICard) {
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
            this.instance.$root.$emit('stack::add-card', Card);

            if (typeof Player !== "undefined" && this.Ruleset.beforeTurn && typeof this.Ruleset.beforeTurn === 'function') {
                emitEvent = this.Ruleset.beforeTurn(Player);
            }
        }

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

        this.instance.$root.$emit('cards::build::draw-stack');

        for (let player = 1; player <= this.playerCount; player++) {
            this.instance.$root.$emit('cards::draw-cards-from-deck', {
                player: player,
                amount: 7
            });
        }

        this.instance.$root.$emit('game::start');

        this.nextTurn();
    },

    registerPlayer(player: IPlayer) {
        this.playerCount += 1;
        this.players[this.playerCount] = player;

        console.log(this.playerCount + ' players have been registered');

        return this.playerCount;
    }
};

window.GameManager = GameManager;

export default GameManager;
