<script setup>
import Card from '@/components/Card.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    winner: {
        type:     Object,
        required: true,
    },
    restartLabel: {
        type:    String,
        default: 'Nog een keer',
    },
});

const emit = defineEmits(['restart']);

const router = useRouter();

function goHome () {
    router.replace({ name: 'GamePicker' });
}
</script>

<template>
    <Teleport to="body">
        <div class="game-over">
            <div class="game-over__panel">
                <div class="game-over__trophy">🏆</div>
                <h2>{{ winner.alias }} heeft gewonnen!</h2>
                <p class="game-over__sub">Gefeliciteerd!</p>

                <div class="game-over__cards">
                    <card v-for="n in 3" :key="n" :card="{ name: '★', glyph: '★', suit: 'heart', value: 21, isJoker: () => true }" size="table"/>
                </div>

                <div class="game-over__actions">
                    <button class="btn btn--primary" @click="$emit('restart')">
                        {{ restartLabel }}
                    </button>
                    <button class="btn" @click="goHome">
                        Naar overzicht
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>