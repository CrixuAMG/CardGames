import Card from "@/lib/Cards/Card";
import IRuleset from "@/lib/Interfaces/IRuleset";
import ICards from "@/lib/Interfaces/ICards";
import IPlayer from './IPlayer';

interface IGameManager {
    Ruleset: IRuleset;
    turnCounter: number;
    instance: IPlayer;
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
