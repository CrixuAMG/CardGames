<script setup>
import { computed, inject, onUnmounted, ref, watch } from 'vue';

import { AI_DELAYS, choosePlayableCard, chooseSuitFor } from '@/lib/games/pesten';

const props = defineProps({
    playerId: {
        type:     Number,
        required: true,
    },
});

const gameRef = inject('game');
const paused = inject('paused');
const difficulty = inject('difficulty');

const game = computed(() => gameRef.value);
const state = computed(() => game.value?.state);
const player = computed(() => state.value?.players.find(p => p.id === props.playerId));

const isTheirTurn = computed(() => (
    state.value?.currentPlayerId === props.playerId
    && state.value?.status === 'playing'
));

const level = computed(() => difficulty?.value || 'normal');

let timer = null;

function scheduleTurn () {
    if (timer || !isTheirTurn.value || paused.value) {
        return;
    }

    timer = setTimeout(() => {
        timer = null;

        if (!isTheirTurn.value || paused.value || !game.value) {
            return;
        }

        takeTurn();
    }, AI_DELAYS[level.value] ?? AI_DELAYS.normal);
}

function takeTurn () {
    const p = player.value;

    const card = choosePlayableCard(state.value, p, level.value);

    if (card) {
        const needsSuit = card.isJoker() || card.value === 11;
        game.value.playCard(p.id, card, needsSuit ? chooseSuitFor(state.value, p, level.value) : null);
        return;
    }

    if (state.value.pendingDraw > 0) {
        game.value.payPenalty(p.id);
        return;
    }

    game.value.drawAndPass(p.id);
}

watch(() => state.value?.signal, scheduleTurn, { immediate: true });
watch(paused, scheduleTurn);

onUnmounted(() => {
    if (timer) {
        clearTimeout(timer);
    }
});
</script>

<template>
    <div v-if="player" class="opponent" :class="{ 'opponent--active': isTheirTurn, 'opponent--penalty': state.pendingDraw > 0 && isTheirTurn }">
        <div class="opponent__avatar" :style="{ '--hue': ((player.id * 47) % 360) }">
            {{ player.alias[0] }}
        </div>

        <div class="opponent__meta">
            <div class="opponent__name">{{ player.alias }}</div>
            <div class="opponent__cards">
                <span class="opponent__mini-card" v-for="i in Math.min(player.cards.length, 10)" :key="'c' + i" />
                <span v-if="player.cards.length > 10" class="opponent__extra">+{{ player.cards.length - 10 }}</span>
            </div>
        </div>

        <div class="opponent__count">
            {{ player.cards.length }}
        </div>
    </div>
</template>