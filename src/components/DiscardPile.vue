<script setup>
import { computed, inject } from 'vue';

import Card from '@/components/Card.vue';
import { SUIT_META } from '@/lib/cards';

const gameRef = inject('game');
const game = computed(() => gameRef.value);
const state = computed(() => game.value?.state);

const visible = computed(() => state.value?.discard.slice(-5) ?? []);
const top = computed(() => state.value?.discard[state.value.discard.length - 1] ?? null);
const currentSuitLabel = computed(() => (state.value?.currentSuit ? SUIT_META[state.value.currentSuit]?.label : ''));

const rotations = new Map();

function rotationFor (card) {
    if (!rotations.has(card.id)) {
        rotations.set(card.id, (Math.random() - 0.5) * 12);
    }

    return rotations.get(card.id);
}
</script>

<template>
    <div v-if="state" class="discard-pile">
        <div class="discard-pile__stack">
            <card
                v-for="card in visible"
                :key="card.id"
                :card="card"
                class="discard-pile__card"
                :class="{ 'discard-pile__card--top': card.is(top) }"
                size="table"
                :style="{ transform: `rotate(${rotationFor(card)}deg) translateY(${visible.indexOf(card) * -3}px)` }"
            />
        </div>

        <div v-if="currentSuitLabel" class="discard-pile__suit-tag">
            Kleur: {{ currentSuitLabel }}
        </div>
    </div>
</template>