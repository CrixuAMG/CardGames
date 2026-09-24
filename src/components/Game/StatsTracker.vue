<script setup>
import { onBeforeUnmount, onMounted } from 'vue';

import { eventHub } from '@/lib/eventHub';
import { recordScore } from '@/lib/stats';

function onGameFinished (state) {
    recordScore(state);
}

onMounted(() => {
    eventHub.$on('game::finished', onGameFinished);
});

onBeforeUnmount(() => {
    eventHub.$off('game::finished', onGameFinished);
});
</script>

<template>
    <slot/>
</template>