<script setup>
import { computed, inject, ref } from 'vue';

import Card from '@/components/Card.vue';
import { SUITS, SUIT_META } from '@/lib/cards';

const gameRef = inject('game');
const username = inject('username');
const paused = inject('paused');

const game = computed(() => gameRef.value);
const human = computed(() => game.value?.state.players[0]);

const pendingCard = ref(null);
const chooseSuitMode = ref(false);

const isActive = computed(() => (
    game.value
    && game.value.state.status === 'playing'
    && game.value.state.currentPlayerId === 1
    && !paused.value
));

const cards = computed(() => human.value?.cards ?? []);
const pendingDraw = computed(() => game.value?.state.pendingDraw ?? 0);

const playability = computed(() => {
    const map = {};

    cards.value.forEach(card => {
        map[card.id] = isActive.value && game.value.canPlay(card);
    });

    return map;
});

function onCardClick (card) {
    if (!isActive.value || !game.value.canPlay(card)) {
        return;
    }

    if (card.value === 11 || card.isJoker()) {
        pendingCard.value = card;
        chooseSuitMode.value = true;
        return;
    }

    game.value.playCard(1, card);
}

function onSuitPicked (suit) {
    if (!pendingCard.value) {
        return;
    }

    game.value.playCard(1, pendingCard.value, suit);
    pendingCard.value = null;
    chooseSuitMode.value = false;
}

function hasPlayableCard () {
    return cards.value.some(card => isActive.value && game.value?.canPlay(card));
}
</script>

<template>
    <div class="hand" :class="{ 'hand--active': isActive }">
        <div class="hand__status">
            <template v-if="game?.state.status === 'finished'">Gespeeld!</template>
            <template v-else-if="!isActive">Wachten op de andere spelers…</template>
            <template v-else-if="pendingDraw > 0">
                Je moet {{ pendingDraw }} kaart{{ pendingDraw === 1 ? '' : 'en' }} trekken
                of stapelen met een 2/Joker!
            </template>
            <template v-else-if="!hasPlayableCard()">Klik op de stapel om een kaart te trekken.</template>
            <template v-else>Jouw beurt — speel een kaart!</template>
        </div>

        <div class="hand__cards">
            <card
                v-for="card in cards"
                :key="card.id"
                :card="card"
                :playable="playability[card.id]"
                @card-click="onCardClick"
            />
        </div>

        <div v-if="chooseSuitMode" class="suit-picker">
            <div class="suit-picker__panel">
                <h4>Kies een kleur</h4>
                <div class="suit-picker__options">
                    <button
                        v-for="suit in SUITS"
                        :key="suit"
                        class="suit-picker__option"
                        :class="`suit-${suit}`"
                        @click="onSuitPicked(suit)"
                    >
                        {{ SUIT_META[suit].glyph }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>