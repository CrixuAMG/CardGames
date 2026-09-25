import { reactive } from 'vue';

import { SUIT_META, createDeck, shuffle } from '@/lib/cards';
import { createPlayers } from '@/lib/games/players';
import { eventHub } from '@/lib/eventHub';

export const HAND_SIZE = 7;

export const RULES = [
    'Leg een kaart met dezelfde kleur of waarde als de bovenste kaart.',
    '2: volgende speler trekt 2 kaarten (of stapelt met een 2/Joker).',
    '7 (zeven kleven): je mag nog een kaart spelen.',
    '8 (acht wacht): de volgende speler slaat een beurt over.',
    'Aas: de speelrichting draait om.',
    'Boer (J): mag altijd gespeeld worden, kies een nieuwe kleur.',
    'Joker: mag altijd gespeeld worden, volgende speler trekt 5 kaarten.',
    'Kun je niet spelen? Trek een kaart van de stapel; kun je hem leggen, doe dat dan.',
];

const isPenalty = card => card.value === 2 || card.isJoker();
const randomSuit = () => ['heart', 'tile', 'clover', 'pike'][Math.floor(Math.random() * 4)];
const suitLabel = suit => SUIT_META[suit]?.label ?? suit;

function log (message) {
    eventHub.$emit('log', { message });
}

function toast (text, { canClose = true } = {}) {
    eventHub.$emit('toast::add', { text, canClose });
}

export function createPestenGame ({ opponents, humanAlias }) {
    const players = createPlayers(opponents, humanAlias);

    const state = reactive({
        kind:            'pesten',
        status:          'idle',
        players,
        currentPlayerId: null,
        direction:       1,
        turnCount:       0,
        deck:            [],
        discard:         [],
        currentSuit:     null,
        pendingDraw:     0,
        signal:          0,
        winner:          null,
        suits:           SUIT_META,
    });

    const player = id => state.players.find(p => p.id === id);
    const directionSign = () => (state.direction === 1 ? 1 : -1);

    function emitTurn () {
        state.signal += 1;
        eventHub.$emit('game::turn', state);
    }

    function reshuffleDiscard () {
        if (state.discard.length <= 1) {
            return;
        }

        const top = state.discard.pop();
        state.deck.push(...shuffle(state.discard));
        state.discard = [top];
        log('De trekstapel is opnieuw geschud met de aflegstapel.');
    }

    function drawFromDeck (n = 1) {
        const drawn = [];

        while (n > 0) {
            if (state.deck.length === 0) {
                reshuffleDiscard();
            }

            if (state.deck.length === 0) {
                return drawn;
            }

            drawn.push(state.deck.pop());
            n -= 1;
        }

        return drawn;
    }

    function canPlay (card) {
        return canPlayCard(state, card);
    }

    function advance (fromId = state.currentPlayerId, steps = 1) {
        const ids = state.players.map(p => p.id);
        const index = ids.indexOf(fromId);
        const step = directionSign() * steps;
        const nextIndex = (index + step + ids.length) % ids.length;

        state.currentPlayerId = ids[nextIndex];
        state.turnCount += 1;
    }

    function finishGame (winner) {
        state.status = 'finished';
        state.winner = winner;
        state.score = state.turnCount;
        toast(`🏆 ${winner.alias} heeft gewonnen!`, { canClose: false });
        eventHub.$emit('game::finished', state);
    }

    function checkWin (playerId) {
        const p = player(playerId);

        if (!p.cards.length) {
            finishGame(p);
            return true;
        }

        if (p.cards.length === 1) {
            toast(`📢 ${p.alias} heeft nog maar één kaart! PESTEN!`);
        }

        return false;
    }

    function setSuit (suit) {
        state.currentSuit = suit;
        log(`De nieuwe kleur is ${suitLabel(suit)}.`);
        emitTurn();
    }

    function start () {
        state.deck = shuffle(createDeck({ jokers: true }));
        state.players.forEach(player => {
            player.cards = drawFromDeck(HAND_SIZE);
        });

        const first = drawFromDeck(1)[0];
        state.discard = [first];
        state.currentSuit = first.isJoker() ? randomSuit() : first.suit;
        state.currentPlayerId = state.players[0].id;
        state.pendingDraw = 0;
        state.direction = 1;
        state.turnCount = 1;
        state.status = 'playing';

        applyFirstCard(first);

        log(`Het spel begint! Eerste kaart: ${first}.`);
        eventHub.$emit('game::start', state);
        emitTurn();
    }

    function playCard (playerId, card, suitChoice = null) {
        if (state.status !== 'playing' || state.currentPlayerId !== playerId) {
            return false;
        }

        if (!canPlay(card)) {
            return false;
        }

        const p = player(playerId);
        const index = p.cards.findIndex(c => c.is(card));

        if (index === -1) {
            return false;
        }

        p.cards.splice(index, 1);
        state.discard.push(card);
        eventHub.$emit('card::to-history', { player: p, card });

        let effect = 'next';

        if (card.isJoker()) {
            state.pendingDraw += 5;
            state.currentSuit = suitChoice || randomSuit();
            log(`${p.alias} speelt een JOKER! Volgende speler trekt er 5 (of stapelt).`);
        } else if (card.value === 11) {
            const chosen = suitChoice || card.suit;
            state.currentSuit = chosen;
            log(suitChoice
                ? `${p.alias} kiest ${suitLabel(chosen)}.`
                : `${p.alias} speelt een Boer.`);
        } else if (card.value === 2) {
            state.pendingDraw += 2;
            state.currentSuit = card.suit;
            log(`${p.alias} speelt een 2! (straf: ${state.pendingDraw} kaarten)`);
        } else if (card.value === 8) {
            effect = 'skip';
            log(`${p.alias} speelt een 8! Volgende speler slaat over.`);
        } else if (card.value === 1) {
            state.direction = -state.direction;
            log(`${p.alias} draait de speelrichting om!`);
        } else if (card.value === 7) {
            effect = 'again';
            log(`${p.alias} speelt een 7 en mag nog een keer!`);
        } else {
            state.currentSuit = card.suit;
        }

        if (checkWin(playerId)) {
            return true;
        }

        if (effect === 'again') {
            state.currentPlayerId = playerId;
            state.turnCount += 1;
        } else if (effect === 'skip') {
            advance(playerId, 2);
        } else {
            advance(playerId, 1);
        }

        emitTurn();
        return true;
    }

    function applyFirstCard (first) {
        if (first.isJoker()) {
            state.pendingDraw = 5;
            log('De eerste kaart is een JOKER! Eerste speler trekt er 5 (of stapelt).');
        } else if (first.value === 2) {
            state.pendingDraw = 2;
            log('De eerste kaart is een 2! Eerste speler trekt er 2 (of stapelt).');
        } else if (first.value === 8) {
            advance(state.currentPlayerId, 2);
            log('De eerste kaart is een 8! De eerste speler slaat over.');
        } else if (first.value === 1) {
            state.direction = -state.direction;
            log('De eerste kaart is een Aas! De speelrichting draait om.');
        } else if (first.value === 7) {
            log('De eerste kaart is een 7. De eerste speler mag meteen spelen.');
        } else if (first.value === 11) {
            log('De eerste kaart is een Boer. De eerste speler speelt op die kleur.');
        }
    }

    function hasPlayableCard (playerId) {
        return player(playerId).cards.some(card => canPlayCard(state, card));
    }

    function payPenalty (playerId) {
        const p = player(playerId);
        const amount = state.pendingDraw;

        state.pendingDraw = 0;

        const cards = drawFromDeck(amount);
        p.cards.push(...cards);

        log(`${p.alias} trekt ${cards.length} kaarten.`);

        if (checkWin(playerId)) {
            return;
        }

        advance(playerId, 1);
        emitTurn();
    }

    function drawAndPass (playerId) {
        const p = player(playerId);

        if (state.pendingDraw > 0) {
            payPenalty(playerId);
            return;
        }

        if (hasPlayableCard(playerId)) {
            return;
        }

        const card = drawFromDeck(1)[0];

        if (!card) {
            advance(playerId, 1);
            emitTurn();
            return;
        }

        p.cards.push(card);
        eventHub.$emit('card::drawn', { playerId, card });

        if (canPlay(card)) {
            log(`${p.alias} trekt en kan direct spelen: ${card}.`);
            playCard(playerId, card);
            return;
        }

        log(`${p.alias} kan niet spelen en trekt een kaart.`);
        advance(playerId, 1);
        emitTurn();
    }

    return {
        state,
        start,
        canPlay,
        playCard,
        payPenalty,
        drawAndPass,
        setSuit,
        hasPlayableCard,
    };
}

export const AI_DELAY = 1100;

export const AI_DELAYS = {
    easy:   1600,
    normal: 1100,
    hard:   700,
};

function nextPlayer (state) {
    const ids = state.players.map(p => p.id);
    const index = ids.indexOf(state.currentPlayerId);
    const step = state.direction === 1 ? 1 : -1;

    return state.players[(index + step + ids.length) % ids.length];
}

export function canPlayCard (state, card) {
    if (!card) {
        return false;
    }

    if (state.pendingDraw > 0) {
        return isPenalty(card);
    }

    const top = state.discard[state.discard.length - 1] ?? null;

    if (!top) {
        return true;
    }

    if (card.isJoker()) {
        return true;
    }

    if (card.value === 11) {
        return true;
    }

    if (card.suit === state.currentSuit) {
        return true;
    }

    return card.value === top.value;
}

export function chooseSuitFor (state, player, difficulty = 'normal') {
    if (difficulty === 'easy') {
        return randomSuit();
    }

    if (difficulty === 'hard') {
        const next = nextPlayer(state);

        if (next) {
            const counts = { heart: 0, tile: 0, clover: 0, pike: 0 };
            next.cards.forEach(card => {
                if (counts[card.suit] != null) {
                    counts[card.suit] += 1;
                }
            });

            return Object.entries(counts).sort((a, b) => a[1] - b[1])[0]?.[0] ?? randomSuit();
        }
    }

    const counts = { heart: 0, tile: 0, clover: 0, pike: 0 };

    player.cards.forEach(card => {
        if (counts[card.suit] != null) {
            counts[card.suit] += 1;
        }
    });

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? randomSuit();
}

export function choosePlayableCard (state, player, difficulty = 'normal') {
    const playable = player.cards.filter(card => canPlayCard(state, card));

    if (!playable.length) {
        return null;
    }

    if (state.pendingDraw > 0) {
        const joker = playable.find(card => card.isJoker());
        const two = playable.find(card => card.value === 2);

        if (difficulty === 'easy') {
            return joker || playable[0];
        }

        return joker || two || playable[0];
    }

    if (difficulty === 'easy') {
        return playable[Math.floor(Math.random() * playable.length)];
    }

    const eight = playable.find(card => card.value === 8);
    const joker = playable.find(card => card.isJoker());
    const two = playable.find(card => card.value === 2);
    const jack = playable.find(card => card.value === 11);

    if (difficulty === 'hard') {
        const next = nextPlayer(state);

        if (next && next.cards.length <= 2) {
            if (eight) {
                return eight;
            }
            if (joker) {
                return joker;
            }
            if (two) {
                return two;
            }
        }

        const regular = playable.filter(card => card.value !== 2 && !card.isJoker() && card.value !== 8 && card.value !== 11);

        if (regular.length) {
            return regular.sort((a, b) => b.value - a.value)[0];
        }

        if (jack) {
            return jack;
        }

        if (eight) {
            return eight;
        }

        return playable[0];
    }

    if (eight) {
        return eight;
    }

    const regular = playable.filter(card => card.value !== 2 && !card.isJoker());

    if (regular.length) {
        return regular[Math.floor(Math.random() * regular.length)];
    }

    return playable[0];
}
