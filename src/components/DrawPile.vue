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

const human = computed(() => state.value?.players[0]);
const hasPlayable = computed(() => (
    Boolean(human.value?.cards.some(card => game.value?.canPlay(card)))
));

function onDraw () {
    if (!isMyTurn.value) {
        return;
    }

    if (state.value?.pendingDraw > 0) {
        game.value.payPenalty(1);
        return;
    }

    if (hasPlayable.value) {
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
            {{ isMyTurn ? (state.pendingDraw > 0 ? 'Trek!' : hasPlayable ? 'Je moet spelen' : 'Trek een kaart') : 'Trekstapel' }}
        </div>
    </div>
</template>