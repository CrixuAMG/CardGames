import ICard from "@/lib/Interfaces/ICard";

class Card {
    private _name: string;
    private _identifier: string;
    private _value: number | string;
    private _suit: string;

    get suit(): string {
        return this._suit;
    }

    get value(): number | string {
        return this._value;
    }

    get identifier(): string {
        return this._identifier;
    }

    get name(): string {
        return this._name;
    }

    constructor(data: ICard) {
        if (data.suit) {
            this._suit = data.suit;
        }

        if (data.value) {
            this._value = data.value;
        }

        if (data.name) {
            this._name = data.name;
        }

        this._identifier = this.getIdentifier();

        return this;
    };

    is(Card: { identifier: string }): boolean {
        return this._identifier === Card.identifier;
    }

    isNot(Card: { identifier: string }): boolean {
        return !this.is(Card);
    }

    getIdentifier(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

export default Card;
