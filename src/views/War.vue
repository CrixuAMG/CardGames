<script setup>
import { computed, inject, onMounted, onUnmounted, provide, ref, watch } from 'vue';

import GameShell from '@/components/GameShell.vue';
import GameOver from '@/components/Game/GameOver.vue';
import PlayerSpot from '@/components/War/PlayerSpot.vue';
import { createWarGame } from '@/lib/games/war';

const ROUND_SECONDS = 12;

const username = inject('username');

const gameRef = ref(null);
provide('game', gameRef);

const phase = ref('idle');      // idle | dealing | revealing | done
const pool = ref({});           // playerId -> reveal index of the current round
const progress = ref(-1);       // revealed up to this index
const warBanner = ref(false);
const prediction = ref(null);   // 'win' | 'lose' | null

provide('warPhase', phase);
provide('warPool', pool);
provide('warProgress', progress);

const state = computed(() => gameRef.value?.state);
const players = computed(() => state.value?.players ?? []);
const contenders = computed(() => state.value?.players.filter(p => p.pile.length > 0) ?? []);
const canPlay = computed(() => state.value?.status === 'playing' && contenders.value.length > 1);
const human = computed(() => state.value?.players.find(p => p.isHuman) ?? null);
const humanActive = computed(() => canPlay.value && human.value !== null && human.value.pile.length > 0);
const awaitingFlip = computed(() => canPlay.value && (phase.value === 'idle' || phase.value === 'done'));
const potCount = computed(() => state.value?.lastRound?.pot.length ?? 0);
const humanScore = computed(() => human.value?.score ?? 0);
const predictedCorrect = computed(() => phase.value === 'done' && state.value?.lastRound?.predictionCorrect === true);

const timeLeft = ref(ROUND_SECONDS);
const potPulse = ref(false);
let timer = null;

function stopTimer () {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function startTimer () {
    stopTimer();
    timeLeft.value = ROUND_SECONDS;

    timer = setInterval(() => {
        timeLeft.value = Math.max(0, timeLeft.value - 0.1);

        if (timeLeft.value === 0) {
            stopTimer();

            if (awaitingFlip.value) {
                flipCards();
            }
        }
    }, 100);
}

watch(awaitingFlip, on => {
    if (on) {
        startTimer();
    } else {
        stopTimer();
    }
}, { immediate: true });

watch(potCount, () => {
    potPulse.value = true;
    setTimeout(() => {
        potPulse.value = false;
    }, 650);
});

function resetBoard () {
    phase.value = 'idle';
    pool.value = {};
    progress.value = -1;
    warBanner.value = false;
}

function startGame () {
    const opponents = parseInt(localStorage.getItem('opponents')) || 1;

    stopTimer();
    resetBoard();
    prediction.value = null;

    gameRef.value = createWarGame({
        opponents,
        humanAlias: username?.value || 'Jij',
    });

    gameRef.value.start();
}

onMounted(startGame);
onUnmounted(stopTimer);

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function flipCards () {
    if (phase.value === 'dealing' || phase.value === 'revealing') {
        return;
    }

    if (!gameRef.value) {
        startGame();
        return;
    }

    stopTimer();

    const roundPlayers = contenders.value.map(p => p.id);
    pool.value = Object.fromEntries(roundPlayers.map((id, index) => [id, index]));

    if (prediction.value) {
        gameRef.value.predict(prediction.value);
    }

    gameRef.value.round();

    phase.value = 'dealing';
    await wait(420);

    phase.value = 'revealing';
    progress.value = -1;

    for (let index = 0; index < roundPlayers.length; index += 1) {
        await wait(340);
        progress.value = index;
    }

    if (state.value?.lastRound?.wars?.length) {
        warBanner.value = true;
        await wait(1200);
        warBanner.value = false;
    }

    phase.value = 'done';
    prediction.value = null;
}

function choosePrediction (outcome) {
    if (!humanActive.value || !awaitingFlip.value) {
        return;
    }

    prediction.value = prediction.value === outcome ? null : outcome;
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
                        <p>
                            Ronde {{ state.roundCount }} — {{ contenders.length }} spelers in de race
                            · Jij: {{ humanScore }} punten
                        </p>
                    </div>
                </div>

                <div class="war__controls">
                    <div v-if="humanActive && awaitingFlip" class="war__predict">
                        <span class="war__predict-label">Voorspel deze ronde:</span>
                        <button
                            class="war__predict-btn"
                            :class="{ 'war__predict-btn--on': prediction === 'win' }"
                            type="button"
                            @click="choosePrediction('win')"
                        >
                            Win
                        </button>
                        <button
                            class="war__predict-btn"
                            :class="{ 'war__predict-btn--on': prediction === 'lose' }"
                            type="button"
                            @click="choosePrediction('lose')"
                        >
                            Verlies
                        </button>
                        <span class="war__predict-bonus" title="Voorspelling goed? +3 punten">+3</span>
                    </div>

                    <div v-if="awaitingFlip" class="war__timer" aria-hidden="true">
                        <div class="war__timer-bar">
                            <div
                                class="war__timer-fill"
                                :style="{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }"
                            />
                        </div>
                        <span class="war__timer-value">⏱ {{ Math.ceil(timeLeft) }}s</span>
                    </div>

                    <button class="btn btn--primary war__play" type="button" :disabled="!awaitingFlip" @click="flipCards">
                        Draai kaarten!
                    </button>
                </div>
            </header>

            <div class="war__board">
                <div class="war__spots">
                    <player-spot v-for="player in players" :key="player.id" :player="player"/>
                </div>

                <div class="war__pot" :class="{ 'war__pot--pulse': potPulse }">
                    <span class="war__pot-title">Pot</span>
                    <div class="war__pot-stack">
                        <div
                            v-for="n in Math.min(5, Math.max(potCount, 1))"
                            :key="`${state.roundCount}-${n}`"
                            class="war__pot-card"
                            :style="{ transform: `translateY(${Math.abs(n - 3) * 0.25}rem) rotate(${(n - 3) * 4}deg)` }"
                        >
                            ♦
                        </div>
                    </div>
                    <span class="war__pot-count">{{ potCount }} kaarten</span>
                </div>

                <div v-if="warBanner" class="war__banner">
                    ⚔️ OORLOG! ⚔️
                </div>

                <div v-if="predictedCorrect" class="war__predict-hit">
                    🎯 Goed voorspeld! +3
                </div>
            </div>

            <footer v-if="state.lastRound" class="war__round-info">
                <div class="war__pot-info">
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
