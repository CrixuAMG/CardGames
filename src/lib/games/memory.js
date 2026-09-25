import { reactive } from 'vue';

import { Card, createDeck, shuffle } from '@/lib/cards';
import { eventHub } from '@/lib/eventHub';

const SCORE_BASE = 1000;
const MOVE_COST = 10;
const SECOND_COST = 4;

function toast (text, { canClose = true } = {}) {
    eventHub.$emit('toast::add', { text, canClose });
}

export function createMemoryGame ({ pairs = 8, humanAlias = 'Jij' } = {}) {
    const sources = shuffle(createDeck({ jokers: false })).slice(0, pairs);
    const layout = shuffle(sources.flatMap(card => [
        new Card({ suit: card.suit, value: card.value }),
        new Card({ suit: card.suit, value: card.value }),
    ]));

    const board = layout.map((card, index) => ({
        id:         index,
        card,
        isFaceUp:   false,
        isMatched:  false,
    }));

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
        kind:     'memory',
        status:   'idle',
        board,
        pairs,
        human,
        moves:    0,
        matches:  0,
        time:     0,
        score:    0,
        picks:    [],
        mismatch: false,
        winner:   null,
    });

    function emitUpdate () {
        eventHub.$emit('memory::update', state);
    }

    function computeScore () {
        return Math.max(0, SCORE_BASE - state.moves * MOVE_COST - state.time * SECOND_COST);
    }

    function start () {
        state.moves = 0;
        state.matches = 0;
        state.time = 0;
        state.score = 0;
        state.picks = [];
        state.mismatch = false;
        state.winner = null;
        state.status = 'playing';

        const shuffled = shuffle(layout);
        state.board.forEach((tile, index) => {
            tile.card = shuffled[index];
            tile.isFaceUp = false;
            tile.isMatched = false;
        });

        emitUpdate();
    }

    function elapse (seconds = 1) {
        if (state.status !== 'playing') {
            return;
        }

        state.time += seconds;
        state.score = computeScore();
        emitUpdate();
    }

    function flip (index) {
        if (state.status !== 'playing' || state.mismatch || state.picks.length >= 2) {
            return;
        }

        const tile = state.board[index];
        if (!tile || tile.isMatched || tile.isFaceUp || state.picks.includes(index)) {
            return;
        }

        tile.isFaceUp = true;
        state.picks.push(index);

        if (state.picks.length === 2) {
            state.moves += 1;
            const [first, second] = state.picks.map(i => state.board[i]);

            if (first.card.value === second.card.value && first.card.suit === second.card.suit) {
                first.isMatched = true;
                second.isMatched = true;
                state.matches += 1;
                state.picks = [];
                state.score = computeScore();

                if (state.matches === state.pairs) {
                    emitUpdate();
                    finish();
                    return;
                }

                toast(`✅ Gevonden! ${state.matches}/${state.pairs}`);
            } else {
                state.mismatch = true;
                toast('Niet gelijk…', { canClose: false });
            }
        }

        emitUpdate();
    }

    function unmatch () {
        if (!state.mismatch) {
            return;
        }

        state.picks.forEach(index => {
            state.board[index].isFaceUp = false;
        });

        state.picks = [];
        state.mismatch = false;
        emitUpdate();
    }

    function finish () {
        human.score = computeScore();
        state.score = human.score;
        state.status = 'finished';
        state.winner = human;
        toast(`🏆 Gefeliciteerd! Score: ${human.score}`, { canClose: false });
        eventHub.$emit('game::finished', state);
    }

    return {
        state,
        start,
        elapse,
        flip,
        unmatch,
    };
}