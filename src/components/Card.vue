<script setup>
import { computed } from 'vue';

const props = defineProps({
    card: {
        type:     Object,
        required: true,
    },
    faceUp: {
        type:    Boolean,
        default: true,
    },
    size: {
        type:    String,
        default: 'hand',
        validator: value => ['hand', 'table', 'small', 'tiny'].includes(value),
    },
    playable: {
        type:    Boolean,
        default: false,
    },
});

const emit = defineEmits(['card-click']);

const isJoker = computed(() => props.card.isJoker?.());
const colorClass = computed(() => `suit-${props.card.suit}`);

function onCardClick () {
    emit('card-click', props.card);
}
</script>

<template>
    <div
        class="card"
        :class="[`card--${size}`, colorClass, { 'card--face-down': !faceUp, 'card--playable': playable, 'card--clickable': playable }]"
        @click="onCardClick"
    >
        <template v-if="faceUp">
            <div class="card__corner card__corner--top">
                <span class="card__rank">{{ card.name }}</span>
                <span class="card__suit-icon">{{ card.glyph }}</span>
            </div>

            <div class="card__center">
                <span v-if="isJoker" class="card__joker-label">JOKER</span>
                <span v-else class="card__center-icon">{{ card.glyph }}</span>
            </div>

            <div class="card__corner card__corner--bottom">
                <span class="card__rank">{{ card.name }}</span>
                <span class="card__suit-icon">{{ card.glyph }}</span>
            </div>
        </template>

        <div v-else class="card__back">
            <div class="card__back-inner">♦</div>
        </div>
    </div>
</template>