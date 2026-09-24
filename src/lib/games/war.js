import { reactive } from 'vue';

import { createDeck, shuffle } from '@/lib/cards';
import { createPlayers } from '@/lib/games/players';
import { eventHub } from '@/lib/eventHub';

const WAR_FEE = 3;
const RANK_VALUE = value => (value === 1 ? 14 : value);
const PREDICT_BONUS = 3;
const rankLabel = value => (value === 1 ? 'A' : value);

function toast (text, { canClose = true } = {}) {
    eventHub.$emit('toast::add', { text, canClose });
}

export function createWarGame ({ opponents, humanAlias }) {
    const players = createPlayers(opponents, humanAlias);

    const state = reactive({
        kind:         'war',
        status:       'idle',
        players,
        roundCount:   0,
        lastRound:    null,
        winner:       null,
        prediction:   null,
    });

    function emitUpdate () {
        eventHub.$emit('war::update', state);
    }

    function start () {
        const deck = shuffle(createDeck({ jokers: false }));

        state.players.forEach(p => {
            p.pile = [];
            p.isOut = false;
            p.score = 0;
        });

        let index = 0;
        while (deck.length) {
            const p = state.players[index % state.players.length];
            p.pile.unshift(deck.pop());
            index += 1;
        }

        state.roundCount = 0;
        state.lastRound = null;
        state.prediction = null;
        state.winner = null;
        state.status = 'playing';
        emitUpdate();
    }

    function remainingPlayers () {
        return state.players.filter(p => p.pile.length > 0);
    }

    function predict (outcome) {
        if (state.status !== 'playing' || state.prediction) {
            return;
        }

        if (!['win', 'lose'].includes(outcome)) {
            return;
        }

        state.prediction = outcome;
    }

    function round () {
        if (state.status !== 'playing') {
            return;
        }

        const contenders = remainingPlayers();

        if (contenders.length <= 1) {
            if (contenders.length === 1) {
                finish(contenders[0]);
            }

            return;
        }

        state.roundCount += 1;

        const reveals = {};
        const pot = [];

        contenders.forEach(p => {
            const card = p.pile.shift();
            reveals[p.id] = card;
            pot.push(card);
        });

        const result = resolveBattles(contenders, reveals, pot, []);
        const message = String(result.message);

        if (result.winner) {
            result.winner.score += 1 + result.wars.length;
        }

        const human = state.players.find(p => p.isHuman) ?? null;
        const humanInRound = human ? contenders.includes(human) : false;
        let predictionCorrect = false;

        if (humanInRound && state.prediction) {
            const wonBattle = result.winner?.id === human.id;
            const resolved = result.winner !== null;
            predictionCorrect = state.prediction === 'win'
                ? wonBattle
                : (resolved && !wonBattle);

            if (predictionCorrect) {
                human.score += PREDICT_BONUS;
                toast(`🎯 Goed voorspeld, ${human.alias}! +${PREDICT_BONUS} punten.`);
            }
        }

        state.prediction = null;

        state.lastRound = {
            round:            state.roundCount,
            reveals,
            pot,
            winner:           result.winner,
            wars:             result.wars,
            predictionCorrect,
            message:          predictionCorrect ? `${message} (+${PREDICT_BONUS} voorspelling.)` : message,
        };

        emitUpdate();

        const survivors = remainingPlayers();

        if (survivors.length === 1) {
            finish(survivors[0]);
        }
    }

    function resolveBattles (contenders, reveals, pot, wars) {
        const current = { ...reveals };
        let active = contenders.slice();
        let winner = null;

        while (active.length > 1) {
            const high = Math.max(...active.map(p => RANK_VALUE(current[p.id]?.value ?? 0)));
            const leaders = active.filter(p => RANK_VALUE(current[p.id].value) === high);

            if (leaders.length === 1) {
                winner = leaders[0];
                break;
            }

            const warCards = [];
            const war = { players: leaders.map(p => p.id), staked: 0, reveals: {} };

            leaders.forEach(p => {
                const staked = p.pile.splice(0, Math.min(WAR_FEE, p.pile.length));
                warCards.push(...staked);
                war.staked += staked.length;

                const faceUp = p.pile.shift();
                war.reveals[p.id] = faceUp ?? null;
                warCards.push(...(faceUp ? [faceUp] : []));
            });

            wars.push(war);
            pot.push(...warCards);

            const withCards = leaders.filter(p => war.reveals[p.id]);
            active = withCards;

            if (active.length === 0) {
                leaderlessResolution(pot);
                return {
                    winner: null,
                    wars,
                    message: 'De oorlog eindigt in een patstelling: het potje wordt eerlijk verdeeld.',
                };
            }

            active.forEach(p => {
                current[p.id] = war.reveals[p.id];
            });
        }

        if (!winner && active.length === 1) {
            winner = active[0];
        }

        if (winner) {
            winner.pile.push(...shuffle(pot));
        }

        return {
            winner,
            wars,
            message: winner
                ? `${winner.alias} wint de ronde en neemt ${pot.length} kaarten.`
                : 'Geen winnaar deze ronde.',
        };
    }

    function leaderlessResolution (pot) {
        const survivors = remainingPlayers();

        while (pot.length) {
            survivors.forEach(p => {
                if (pot.length) {
                    p.pile.push(pot.pop());
                }
            });
        }
    }

    function finish (winner) {
        state.status = 'finished';
        state.winner = winner;
        state.score = winner.score;
        toast(`🏆 ${winner.alias} heeft alle kaarten gewonnen!`, { canClose: false });
        eventHub.$emit('game::finished', state);
    }

    return {
        state,
        start,
        round,
        predict,
    };
}

export { rankLabel };