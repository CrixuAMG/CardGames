<script setup>
import { computed, inject } from 'vue';

const gameRef = inject('game');
const game = computed(() => gameRef.value);
const state = computed(() => game.value?.state);

const currentPlayer = computed(() => state.value?.players.find(p => p.id === state.value?.currentPlayerId));
const directionLabel = computed(() => (state.value?.direction === 1 ? 'Met de klok mee' : 'Tegen de klok in'));
</script>

<template>
    <div v-if="game" class="game-data">
        <div class="game-data__row">
            <span class="game-data__label">Beurt</span>
            <span class="game-data__value">{{ currentPlayer?.alias ?? '—' }}</span>
        </div>
        <div class="game-data__row">
            <span class="game-data__label">Richting</span>
            <span class="game-data__value">{{ directionLabel }}</span>
        </div>
        <div class="game-data__row">
            <span class="game-data__label">Ronde</span>
            <span class="game-data__value">{{ state.turnCount }}</span>
        </div>
        <div class="game-data__row">
            <span class="game-data__label">Stapel</span>
            <span class="game-data__value">{{ state.deck.length }} kaarten</span>
        </div>
    </div>
</template>