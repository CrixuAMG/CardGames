<script setup>
import { inject, onBeforeUnmount, onMounted } from 'vue';

import Card from '@/components/Card.vue';
import GameOver from '@/components/Game/GameOver.vue';
import GameShell from '@/components/GameShell.vue';
import { createMemoryGame } from '@/lib/games/memory';

const username = inject('username');
const paused = inject('paused');

const game = createMemoryGame({
    pairs:      8,
    humanAlias: username?.value || 'Jij',
});

const state = game.state;

let unmatchTimer = null;
let tickTimer = null;

function scheduleUnmatch () {
    clearTimeout(unmatchTimer);

    unmatchTimer = setTimeout(() => {
        game.unmatch();
    }, 850);
}

function onTileClick (index) {
    game.flip(index);

    if (state.mismatch) {
        scheduleUnmatch();
    }
}

function startGame () {
    game.start();
}

onMounted(() => {
    startGame();

    tickTimer = setInterval(() => {
        if (!paused.value && state.status === 'playing') {
            game.elapse(1);
        }
    }, 1000);
});

onBeforeUnmount(() => {
    clearTimeout(unmatchTimer);
    clearInterval(tickTimer);
});
</script>

<template>
    <game-shell>
        <div v-if="state" class="memory">
            <header class="memory__top">
                <div class="memory__title">
                    <span class="memory__emoji">🧠</span>
                    <div>
                        <h1>Memory</h1>
                        <p>Vind alle paren!</p>
                    </div>
                </div>

                <div class="memory__stats">
                    <span class="memory__stat">🎯 {{ state.moves }} zetten</span>
                    <span class="memory__stat">✅ {{ state.matches }}/{{ state.pairs }}</span>
                    <span class="memory__stat">⏱ {{ state.time }}s</span>
                    <span class="memory__stat memory__stat--score">★ {{ state.score }}</span>
                </div>

                <button class="btn memory__restart" type="button" @click="startGame">
                    ↻ Opnieuw
                </button>
            </header>

            <div class="memory__board">
                <button
                    v-for="tile in state.board"
                    :key="tile.id"
                    class="memory__tile"
                    :class="{
                        'memory__tile--up': tile.isFaceUp,
                        'memory__tile--matched': tile.isMatched,
                        'memory__tile--wrong': state.mismatch && tile.isFaceUp,
                    }"
                    :disabled="state.status !== 'playing' || tile.isMatched"
                    type="button"
                    @click="onTileClick(tile.id)"
                >
                    <span class="memory__tile-inner">
                        <span class="memory__face memory__face--back">
                            <span class="memory__back-glyph">?</span>
                        </span>
                        <span class="memory__face memory__face--front">
                            <card :card="tile.card" size="small" :face-up="true"/>
                        </span>
                    </span>
                </button>
            </div>
        </div>
    </game-shell>

    <game-over
        v-if="state?.status === 'finished' && state.winner"
        :winner="state.winner"
        restart-label="Nog een keer"
        @restart="startGame"
    />
</template>