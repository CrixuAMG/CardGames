import ICard from "@/lib/Interfaces/ICard";

class Card {
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

    private _name: string;

    get name(): string {
        return this._name;
    }

    private _identifier: string;

    get identifier(): string {
        return this._identifier;
    }

    private _value: number | string;

    get value(): number | string {
        return this._value;
    }

    private _suit: string;

    get suit(): string {
        return this._suit;
    }

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
