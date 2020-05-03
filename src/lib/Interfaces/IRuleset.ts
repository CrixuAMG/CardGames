import Card from "@/lib/Cards/Card";

interface IRuleset {
    deckIsEmpty: (cards: Card[]) => void;
    cardIsPlayable: (Card: Card) => (boolean | boolean);
    beforeTurn: (Player: { playerId: number }) => (boolean);
    nextTurnOnDrawCardFromStack: boolean;
}

export default IRuleset;
