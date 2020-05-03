import ICard from "@/lib/Interfaces/ICard";

interface ICards {
    collection: ICard[];
    deck: ICard[];
    useDeck: boolean;
    get: (shuffle?: boolean, setupdDeck?: boolean) => ICard[];
    take: (amount: number, exclude: ICard[]) => ICard[];
}

export default ICards;
