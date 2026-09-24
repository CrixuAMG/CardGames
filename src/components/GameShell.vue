<script setup>
import { onMounted, onUnmounted, provide, ref } from 'vue';

import HistoryTracker from '@/components/Game/HistoryTracker.vue';
import PauseMenu from '@/components/Game/PauseMenu.vue';
import ToastWrapper from '@/components/Toast/ToastWrapper.vue';

const paused = ref(false);
const menuOpen = ref(false);

provide('paused', paused);

function resume () {
    menuOpen.value = false;
    paused.value = false;
}

function togglePause () {
    menuOpen.value = !menuOpen.value;
    paused.value = menuOpen.value;
}

function onKeyDown (event) {
    if (event.code === 'KeyP') {
        togglePause();
    }
}

onMounted(() => {
    document.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
    <div class="game-shell">
        <history-tracker/>
        <toast-wrapper/>

        <slot/>

        <pause-menu :open="menuOpen" @resume="resume"/>
    </div>
</template>