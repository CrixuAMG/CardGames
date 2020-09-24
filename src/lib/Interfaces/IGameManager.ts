import Card from "@/lib/Cards/Card";
import IPlayer from "@/lib/Interfaces/IPlayer";
import IRuleset from "@/lib/Interfaces/IRuleset";
import ICards from "@/lib/Interfaces/ICards";
import {IVueInstance} from "@/lib/Interfaces/Vue";

interface IGameManager {
    Ruleset: IRuleset;
    turnCounter: number;
    instance: IVueInstance;
    turnDirection: string;
    playerCount: number;
    players: any[];
    Cards: ICards;
    turnFor: number | null;
    playedCards: any[];
    CardsPile: Card[];

    reverseDirection(): void;

    registerEventHandlers(): void;

    nextTurn(Player?: IPlayer, Card?: Card): void;

    registerPlayer(player: IPlayer): number;

    setup(instance: IPlayer, IRuleset: object): void;

    startGame(): void;
}

export default IGameManager;
