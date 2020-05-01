import Card from "@/lib/Cards/Card";
import {Component} from "vue";

interface Ruleset {
    deckIsEmpty: (cards: Card[]) => void;
    cardIsPlayable: (Card: Card) => (boolean | boolean);
    beforeTurn: (Player{playerId: number}) => (boolean);
    nextTurnOnDrawCardFromStack: boolean;
}

export default Ruleset;
