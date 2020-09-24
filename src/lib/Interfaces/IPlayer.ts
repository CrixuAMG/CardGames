import Card from "@/lib/Cards/Card";

interface IPlayer {
    $root: {
        $on: (key: string, value?: any) => void,
        $emit: (key: string, value?: any) => void
    },
    playerId: number,
    cards: Card[]
}

export default IPlayer;
