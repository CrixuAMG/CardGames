<script setup>
import { ref } from 'vue';

defineProps({
    rules: {
        type:     Array,
        required: true,
    },
    title: {
        type:    String,
        default: 'Spelregels',
    },
});

const open = ref(false);
</script>

<template>
    <Teleport to="body">
        <button class="rules-btn" type="button" @click="open = true">
            📖 Regels
        </button>

        <div v-if="open" class="rules" @click.self="open = false">
            <div class="rules__panel">
                <div class="rules__header">
                    <h3>{{ title }}</h3>
                    <button class="rules__close" type="button" @click="open = false">×</button>
                </div>

                <ol class="rules__list">
                    <li v-for="(rule, index) in rules" :key="index">
                        {{ rule }}
                    </li>
                </ol>

                <button class="btn btn--primary" type="button" @click="open = false">Begrepen!</button>
            </div>
        </div>
    </Teleport>
</template>