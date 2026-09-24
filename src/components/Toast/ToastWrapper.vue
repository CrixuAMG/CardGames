<script setup>
import { onBeforeUnmount, onMounted } from 'vue';

import { eventHub } from '@/lib/eventHub';
import Toast from '@/lib/Toast/Toast';

function onToast (options) {
    new Toast(options);
}

onMounted(() => {
    eventHub.$on('toast::add', onToast);
});

onBeforeUnmount(() => {
    eventHub.$off('toast::add', onToast);
});
</script>

<template>
    <div class="toast-wrapper"/>
</template>