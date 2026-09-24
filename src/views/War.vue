<script setup>
import { computed, inject, onMounted, provide, ref } from 'vue';

import GameShell from '@/components/GameShell.vue';
import GameOver from '@/components/Game/GameOver.vue';
import PlayerSpot from '@/components/War/PlayerSpot.vue';
import { createWarGame } from '@/lib/games/war';

const username = inject('username');

const gameRef = ref(null);
provide('game', gameRef);

const state = computed(() => gameRef.value?.state);
const players = computed(() => state.value?.players ?? []);
const contenders = computed(() => state.value?.players.filter(p => p.pile.length > 0) ?? []);
const canPlay = computed(() => state.value?.status === 'playing' && contenders.value.length > 1);

function startGame () {
    const opponents = parseInt(localStorage.getItem('opponents')) || 1;

    gameRef.value = createWarGame({
        opponents,
        humanAlias: username?.value || 'Jij',
    });

    gameRef.value.start();
}

onMounted(startGame);

function flipCards () {
    if (!gameRef.value) {
        startGame();
    }

    gameRef.value?.round();
}
</script>

<template>
    <game-shell>
        <div v-if="state" class="war">
            <header class="war__top">
                <div class="war__title">
                    <span class="war__emoji">⚔️</span>
                    <div>
                        <h1>Oorlog</h1>
                        <p>Ronde {{ state.roundCount }} — {{ contenders.length }} spelers in de race</p>
                    </div>
                </div>

                <button class="btn btn--primary war__play" type="button" :disabled="!canPlay" @click="flipCards">
                    Draai kaarten!
                </button>
            </header>

            <div class="war__spots">
                <player-spot v-for="player in players" :key="player.id" :player="player"/>
            </div>

            <footer v-if="state.lastRound" class="war__round-info">
                <div class="war__pot">
                    <span class="war__pot-label">Pot</span>
                    <span class="war__pot-value">{{ state.lastRound.pot.length }} kaarten</span>
                </div>
                <p class="war__message">{{ state.lastRound.message }}</p>
            </footer>
        </div>
    </game-shell>

    <game-over
        v-if="state?.status === 'finished' && state.winner"
        :winner="state.winner"
        restart-label="Nieuwe oorlog"
        @restart="startGame"
    />
</template>