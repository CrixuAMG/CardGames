import Card from "@/lib/Cards/Card";
import IPlayer from "@/lib/Interfaces/IPlayer";

interface IRuleset {
    deckIsEmpty: (cards: Card[]) => void;
    cardIsPlayable: (Card: Card) => (boolean | boolean);
    afterTurn: (Player: IPlayer) => (boolean);
    beforeTurn: (Player: IPlayer) => (boolean);
    nextTurnOnDrawCardFromStack: boolean;
}

export default IRuleset;
