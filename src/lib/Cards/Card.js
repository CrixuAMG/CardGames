class Card {
    constructor (data) {
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

    _name;
    _identifier;
    _value;
    _suit;

    get name () {
        return this._name;
    }

    get identifier () {
        return this._identifier;
    }

    get value () {
        return this._value;
    }

    get suit () {
        return this._suit;
    }

    is (Card) {
        return this._identifier === Card.identifier;
    }

    isNot (Card) {
        return !this.is(Card);
    }

    getIdentifier () {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

export default Card;
