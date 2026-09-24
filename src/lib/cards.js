import { shuffle as lodashShuffle } from 'lodash-es';

export const SUITS = ['heart', 'tile', 'clover', 'pike'];

export const SUIT_META = {
    heart:  { glyph: '♥', label: 'Harten', color: 'red' },
    tile:   { glyph: '♦', label: 'Ruiten', color: 'red' },
    clover: { glyph: '♣', label: 'Klaveren', color: 'black' },
    pike:   { glyph: '♠', label: 'Schoppen', color: 'black' },
    black:  { glyph: '★', label: 'Zwarte Joker', color: 'black' },
    red:    { glyph: '★', label: 'Rode Joker', color: 'red' },
};

const RANKS = [
    { value: 1, name: 'A' },
    { value: 2, name: '2' },
    { value: 3, name: '3' },
    { value: 4, name: '4' },
    { value: 5, name: '5' },
    { value: 6, name: '6' },
    { value: 7, name: '7' },
    { value: 8, name: '8' },
    { value: 9, name: '9' },
    { value: 10, name: '10' },
    { value: 11, name: 'J' },
    { value: 12, name: 'Q' },
    { value: 13, name: 'K' },
];

export class Card {
    constructor ({ suit, value, name }) {
        this.suit = suit;
        this.value = value;
        this.name = name;
        this.id = `${suit}:${value}:${Math.random().toString(36).slice(2, 9)}`;
    }

    is (card) {
        return Boolean(card && this.id === card.id);
    }

    isJoker () {
        return this.value === 'JOKER';
    }

    get glyph () {
        return SUIT_META[this.suit]?.glyph ?? '';
    }

    get color () {
        return SUIT_META[this.suit]?.color ?? 'black';
    }

    get label () {
        return SUIT_META[this.suit]?.label ?? '';
    }

    toString () {
        return `${this.isJoker() ? 'Joker' : `${this.name} ${this.label}`}`;
    }
}

export function createDeck ({ jokers = true } = {}) {
    const deck = [];

    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push(new Card({ suit, value: rank.value, name: rank.name }));
        }
    }

    if (jokers) {
        deck.push(new Card({ suit: 'black', value: 'JOKER', name: 'JOKER' }));
        deck.push(new Card({ suit: 'red', value: 'JOKER', name: 'JOKER' }));
    }

    return deck;
}

export function shuffle (cards) {
    return lodashShuffle(cards);
}