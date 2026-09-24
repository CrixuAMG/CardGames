<script setup>
import { computed, inject } from 'vue';

const gameRef = inject('game');
const paused = inject('paused');

const game = computed(() => gameRef.value);
const state = computed(() => game.value?.state);

const remaining = computed(() => state.value?.deck.length ?? 0);
const isMyTurn = computed(() => (
    game.value
    && state.value?.currentPlayerId === 1
    && state.value?.status === 'playing'
    && !paused.value
));

function onDraw () {
    if (!isMyTurn.value) {
        return;
    }

    const wasJoker = state.value?.discard[state.value.discard.length - 1]?.isJoker();

    if (state.value?.pendingDraw > 0) {
        game.value.payPenalty(1, wasJoker ? undefined : null);
        return;
    }

    game.value.drawAndPass(1);
}
</script>

<template>
    <div class="draw-pile" :class="{ 'draw-pile--interactive': isMyTurn }" @click="onDraw">
        <div class="draw-pile__back">
            <div class="draw-pile__back-inner">♦</div>
        </div>
        <div class="draw-pile__count" :class="{ 'draw-pile__count--hot': remaining <= 10 }">
            {{ remaining }}
        </div>
        <div class="draw-pile__hint">
            {{ isMyTurn ? (state.pendingDraw > 0 ? 'Trek!' : 'Trek een kaart') : 'Trekstapel' }}
        </div>
    </div>
</template>