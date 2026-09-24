import { useDataStoreRef } from '@/CustomRefs/DataStoreRef';

const STORAGE_KEY = 'cg:scores';
const MAX_ENTRIES = 100;

export const GAME_META = {
    pesten:    { title: 'Pesten',   metric: 'lower' },
    war:       { title: 'Oorlog',   metric: 'higher' },
    memory:    { title: 'Memory',   metric: 'higher' },
    solitaire: { title: 'Patience', metric: 'higher' },
};

function scoresRef () {
    return useDataStoreRef(STORAGE_KEY, []);
}

export function loadScores () {
    const list = scoresRef().value;

    return Array.isArray(list) ? list : [];
}

export function recordScore (state) {
    if (!state || !state.kind || !state.winner) {
        return null;
    }

    const entry = {
        kind:   state.kind,
        winner: state.winner.alias || 'Jij',
        score:  Number.isFinite(state.score) ? state.score : 0,
        time:   Number.isFinite(state.time) ? state.time : 0,
        date:   Date.now(),
    };

    const list = [...loadScores(), entry].slice(-MAX_ENTRIES);
    scoresRef().value = list;

    return entry;
}

export function clearScores () {
    scoresRef().value = [];
}

function isBetter (kind, candidate, current) {
    const meta = GAME_META[kind];

    if (!candidate) {
        return false;
    }

    if (!current) {
        return true;
    }

    return meta?.metric === 'lower'
        ? candidate.score < current.score
        : candidate.score > current.score;
}

export function bestScore (kind) {
    return loadScores()
        .filter(entry => entry.kind === kind)
        .reduce((best, entry) => (isBetter(kind, entry, best) ? entry : best), null);
}

export function topScores (kind, limit = 5) {
    const meta = GAME_META[kind];

    return loadScores()
        .filter(entry => entry.kind === kind)
        .sort((a, b) => (meta?.metric === 'lower'
            ? a.score - b.score
            : b.score - a.score))
        .slice(0, limit);
}