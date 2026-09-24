<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

import Card from '@/components/Card.vue';
import { eventHub } from '@/lib/eventHub';

const history = ref([]);
const open = ref(false);

function onCardPlayed ({ card, player }) {
    history.value.push({ card, player, key: `${card.id}-${Date.now()}` });
}

function onKeyDown (event) {
    if (event.code === 'KeyH') {
        open.value = !open.value;
    }
}

onMounted(() => {
    eventHub.$on('card::to-history', onCardPlayed);
    document.addEventListener('keydown', onKeyDown);
});

onBeforeUnmount(() => {
    eventHub.$off('card::to-history', onCardPlayed);
    document.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
    <div class="history" :class="{ 'history--open': open }">
        <button class="history__toggle" type="button" @click="open = !open">
            {{ history.length }} gespeelde kaarten
        </button>

        <div class="history__track">
            <div v-for="entry in history.slice(-30)" :key="entry.key" class="history__entry">
                <card :card="entry.card" size="tiny"/>
                <span class="history__player">{{ entry.player.alias }}</span>
            </div>
        </div>
    </div>
</template>