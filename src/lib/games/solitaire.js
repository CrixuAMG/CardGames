import { reactive } from 'vue';

import { createDeck, shuffle, SUITS, SUIT_META } from '@/lib/cards';
import { eventHub } from '@/lib/eventHub';

const FOUNDATION_BONUS = 10;
const DRAW_COST = 2;

function toast (text, { canClose = true } = {}) {
    eventHub.$emit('toast::add', { text, canClose });
}

export function createSolitaireGame ({ humanAlias = 'Jij' } = {}) {
    const human = {
        id:      1,
        alias:   humanAlias || 'Jij',
        cards:   [],
        pile:    [],
        isHuman: true,
        isOut:   false,
        score:   0,
    };

    const state = reactive({
        kind:      'solitaire',
        status:    'idle',
        human,
        stock:     [],
        waste:     [],
        foundations: { heart: [], tile: [], clover: [], pike: [] },
        tableau:   [[], [], [], [], [], [], []],
        score:     0,
        moves:     0,
        time:      0,
        winner:    null,
    });

    function emitUpdate () {
        eventHub.$emit('solitaire::update', state);
    }

    function start () {
        const deck = shuffle(createDeck({ jokers: false }));

        state.stock = [];
        state.waste = [];
        SUITS.forEach(suit => {
            state.foundations[suit] = [];
        });
        state.tableau = Array.from({ length: 7 }, () => []);

        let cursor = 0;
        for (let pile = 0; pile < 7; pile += 1) {
            for (let depth = 0; depth <= pile; depth += 1) {
                state.tableau[pile].push({
                    card:   deck[cursor],
                    faceUp: depth === pile,
                });
                cursor += 1;
            }
        }

        state.stock = deck.slice(cursor);
        state.score = 0;
        state.moves = 0;
        state.time = 0;
        state.winner = null;
        state.status = 'playing';
        emitUpdate();
    }

    function elapse (seconds = 1) {
        if (state.status !== 'playing') {
            return;
        }

        state.time += seconds;
        emitUpdate();
    }

    function foundationSize () {
        return SUITS.reduce((total, suit) => total + state.foundations[suit].length, 0);
    }

    function topTableau (pile) {
        const slots = state.tableau[pile];
        return slots.length ? slots[slots.length - 1] : null;
    }

    function canPlaceOnTableau (card, pile) {
        const top = topTableau(pile);

        if (!top) {
            return card.value === 13;
        }

        if (!top.faceUp) {
            return false;
        }

        const sameColor = SUIT_META[top.card.suit].color === SUIT_META[card.suit].color;

        return top.card.value === card.value + 1 && !sameColor;
    }

    function canPlaceOnFoundation (card, suit) {
        const foundation = state.foundations[suit];

        if (!foundation.length) {
            return card.suit === suit && card.value === 1;
        }

        const top = foundation[foundation.length - 1];

        return top.suit === suit && top.value === card.value - 1;
    }

    function sourceCards (from) {
        if (from.kind === 'waste') {
            if (!state.waste.length) {
                return null;
            }

            return { cards: [state.waste[state.waste.length - 1]] };
        }

        if (from.kind === 'foundation') {
            const foundation = state.foundations[SUITS[from.index]];

            if (!foundation.length) {
                return null;
            }

            return { cards: [foundation[foundation.length - 1]] };
        }

        if (from.kind === 'tableau') {
            const pile = state.tableau[from.index];
            const start = from.offset ?? pile.length - 1;

            if (start < 0 || start >= pile.length) {
                return null;
            }

            for (let i = start; i < pile.length; i += 1) {
                if (!pile[i].faceUp) {
                    return null;
                }
            }

            return { cards: pile.slice(start).map(slot => slot.card) };
        }

        return null;
    }

    function canMove (from, to) {
        const source = sourceCards(from);

        if (!source || !source.cards.length) {
            return false;
        }

        if (from.kind === 'tableau' && to.kind === 'tableau' && from.index === to.index) {
            return false;
        }

        const moving = source.cards[source.cards.length - 1];

        if (to.kind === 'tableau') {
            return canPlaceOnTableau(moving, to.index);
        }

        if (to.kind === 'foundation') {
            if (source.cards.length !== 1) {
                return false;
            }

            return canPlaceOnFoundation(moving, SUITS[to.index]);
        }

        return false;
    }

    function removeSource (from) {
        if (from.kind === 'waste') {
            state.waste.pop();
            return;
        }

        if (from.kind === 'foundation') {
            state.foundations[SUITS[from.index]].pop();
            return;
        }

        const pile = state.tableau[from.index];
        pile.splice(from.offset ?? pile.length - 1);

        const newTop = pile[pile.length - 1];
        if (newTop && !newTop.faceUp) {
            newTop.faceUp = true;
        }
    }

    function tryMove (from, to) {
        if (state.status !== 'playing' || !canMove(from, to)) {
            return false;
        }

        const source = sourceCards(from);
        const stack = source.cards;

        removeSource(from);

        if (to.kind === 'tableau') {
            stack.forEach(card => {
                state.tableau[to.index].push({ card, faceUp: true });
            });
            state.score = Math.max(0, state.score - (from.kind === 'foundation' ? FOUNDATION_BONUS : 0));
        } else {
            stack.forEach(card => {
                state.foundations[SUITS[to.index]].push(card);
            });
            state.score += FOUNDATION_BONUS * stack.length;
        }

        state.moves += 1;
        emitUpdate();

        if (foundationSize() === 52) {
            finish();
        }

        return true;
    }

    function drawStock () {
        if (state.status !== 'playing') {
            return;
        }

        if (state.stock.length) {
            state.waste.push(state.stock.pop());
            state.score = Math.max(0, state.score - DRAW_COST);
        } else if (state.waste.length) {
            state.stock = state.waste.slice().reverse();
            state.waste = [];
        } else {
            return;
        }

        state.moves += 1;
        emitUpdate();
    }

    function finish () {
        state.score += Math.max(0, 300 - state.time * 2);
        human.score = state.score;
        state.status = 'finished';
        state.winner = human;
        toast(`🏆 Patience voltooid! Score: ${state.score}`, { canClose: false });
        eventHub.$emit('game::finished', state);
    }

    return {
        state,
        start,
        elapse,
        drawStock,
        canMove,
        tryMove,
    };
}