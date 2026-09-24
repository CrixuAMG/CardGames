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
const hoverIndex = ref(-1);
const handHovered = ref(false);

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

function cardStyle (index) {
    if (!handHovered.value) {
        return undefined;
    }

    const count = cards.value.length;
    const mid = (count - 1) / 2;
    const offset = index - mid;
    const reach = Math.max(1, mid);
    const t = Math.abs(offset) / reach;

    const angle = -offset * (3.2 + t * 3);
    const lift = 16 * (1 - t * 0.45);
    const isHovered = hoverIndex.value === index;
    const origin = offset < 0 ? 'left' : offset > 0 ? 'right' : 'center';

    return {
        transform: `rotate(${angle}deg) translateY(-${isHovered ? lift + 26 : lift}px) scale(${isHovered ? 1.15 : 1.04})`,
        transformOrigin: `${origin} bottom`,
        zIndex: isHovered ? 999 : index + 1,
    };
}

function onRowMouseOver (event) {
    const cardEl = event.target.closest?.('.hand__cards .card') ?? null;
    hoverIndex.value = cardEl ? Number(cardEl.getAttribute('data-index')) : -1;
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

        <div
            class="hand__cards"
            @mouseenter="handHovered = true"
            @mouseleave="handHovered = false; hoverIndex = -1"
            @mouseover="onRowMouseOver"
        >
            <card
                v-for="(card, index) in cards"
                :key="card.id"
                :card="card"
                :playable="playability[card.id]"
                :data-index="index"
                :style="cardStyle(index)"
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