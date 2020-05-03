import Card from "@/lib/Cards/Card";
import IPlayer from "@/lib/Interfaces/IPlayer";

interface IGameManager {
    Ruleset: {};
    turnCounter: number;
    instance: {
        $root: {
            $on: () => {}
        }
    };
    turnDirection: string;
    playerCount: number;
    players: any[];

    reverseDirection(): void;

    playedCards: any[];

    registerEventHandlers(): void;

    CardsPile: Card[];

    nextTurn(Player?: IPlayer, Card?: Card): void;

    registerPlayer(player: IPlayer): number;

    setup(instance: IPlayer, IRuleset: object): void;

    startGame(): void;

    Cards: {};
    turnFor: number | null
}

export default IGameManager;
