import * as _ from 'lodash';
import Card from "./Card";
import ICards from "@/lib/Interfaces/ICards";
import ICard from "@/lib/Interfaces/ICard";
import GameManager from "@/lib/Game/GameManager";

let Cards: ICards = {
    collection: [],
    deck: [],
    useDeck: false,
    get(shuffle: boolean = true, setupDeck: boolean = false): Card[] {
        let cards = this.useDeck ? this.deck : this.collection;

        if (shuffle) {
            cards = _.shuffle(cards);
        }

        if (setupDeck) {
            this.useDeck = setupDeck;
            this.deck = cards;
        }

        return cards;
    },

    async take(amount: number, exclude: Card[] = []) {
        let cards = [];
        let cardsFromDeck = this.get();

        if (!cardsFromDeck.length) {
            await GameManager.Ruleset.deckIsEmpty(this.deck);
        }

        cardsFromDeck = this.get();

        for (let i = 0; i < amount; i++) {
            let card = _.first(cardsFromDeck);
            cardsFromDeck = _.remove(cardsFromDeck, (cardFromDeck: ICard) => {
                return cardFromDeck.isNot(card);
            });
            cardsFromDeck = this.get();

            if (!card || typeof card === 'undefined') {
                if (!cards.length) {
                    await GameManager.Ruleset.deckIsEmpty(this.deck);
                }

                cardsFromDeck = this.get();

                // TODO Return?
            }

            let addCard = true;
            _.forEach(exclude, (cardToExclude: Card) => {
                if (cardToExclude.suit) {

                } else {
                    if (cardToExclude.value === card.value) {
                        addCard = false;
                    }
                }
            });

            if (!addCard) {
                i--;

                return;
            }

            this.deck = _.filter(this.deck, (cardInDeck: Card) => {
                return cardInDeck.isNot(card);
            });

            cards.push(card);
        }

        return cards;
    }
};

const Suits = [
    'heart',
    'clover',
    'tile',
    'pike',
];
let cardsToSetup = [
    {
        value: 1,
        name: 'A'
    },
    {
        value: 2,
        name: '2'
    },
    {
        value: 3,
        name: '3'
    },
    {
        value: 4,
        name: '4'
    },
    {
        value: 5,
        name: '5'
    },
    {
        value: 6,
        name: '6'
    },
    {
        value: 7,
        name: '7'
    },
    {
        value: 8,
        name: '8'
    },
    {
        value: 9,
        name: '9'
    },
    {
        value: 10,
        name: '10'
    },
    {
        value: 11,
        name: 'J'
    },
    {
        value: 12,
        name: 'Q'
    },
    {
        value: 13,
        name: 'K'
    },
];

_.forEach(Suits, Suit => {
    _.forEach(cardsToSetup, cardToSetup => {
        Cards.collection.push(new Card({
            ...cardToSetup,
            suit: Suit
        }))
    });
});

Cards.collection.push(new Card({
    value: 'JOKER',
    name: 'JOKER',
    suit: 'black'
}));

Cards.collection.push(new Card({
    value: 'JOKER',
    name: 'JOKER',
    suit: 'red'
}));

window.Cards = Cards;

export default Cards;
