<script setup>
import { useRouter } from 'vue-router';

defineProps({
    open: {
        type:    Boolean,
        default: false,
    },
});

const emit = defineEmits(['resume']);

const router = useRouter();

function goHome () {
    emit('resume');
    router.replace({ name: 'GamePicker' });
}
</script>

<template>
    <Teleport to="body">
        <div v-if="open" class="pause-menu" @click.self="$emit('resume')">
            <div class="pause-menu__panel">
                <h3>Pauze</h3>
                <p class="pause-menu__hint">Druk op <kbd>P</kbd> om door te gaan</p>

                <div class="pause-menu__actions">
                    <button class="btn btn--primary" @click="$emit('resume')">
                        Verder spelen
                    </button>
                    <button class="btn" @click="goHome">
                        Naar overzicht
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>