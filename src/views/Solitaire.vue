<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';

import Card from '@/components/Card.vue';
import GameOver from '@/components/Game/GameOver.vue';
import GameShell from '@/components/GameShell.vue';
import { SUITS } from '@/lib/cards';
import { createSolitaireGame } from '@/lib/games/solitaire';

const FACE_UP_DY = 2.4;
const FACE_DOWN_DY = 0.6;

const username = inject('username');
const paused = inject('paused');

const game = createSolitaireGame({ humanAlias: username?.value || 'Jij' });
const state = game.state;

const selected = ref(null);
let tickTimer = null;

const stockBack = { suit: 'heart', value: 1, name: 'A' };

const wasteTop = computed(() => state.waste[state.waste.length - 1] ?? null);

function foundationCards (index) {
    return state.foundations[SUITS[index]];
}

function foundationTop (index) {
    const cards = foundationCards(index);
    return cards.length ? cards[cards.length - 1] : null;
}

function isSelected (source) {
    const sel = selected.value;
    if (!sel) {
        return false;
    }

    if (source.kind !== sel.kind) {
        return false;
    }

    if (source.kind === 'waste') {
        return true;
    }

    if (source.kind === 'foundation') {
        return source.index === sel.index;
    }

    return source.index === sel.index && source.offset === sel.offset;
}

function selectCard (source) {
    if (state.status !== 'playing') {
        return;
    }

    if (isSelected(source)) {
        selected.value = null;
        return;
    }

    selected.value = source;
}

function clearSelection () {
    selected.value = null;
}

function canHold (target) {
    return Boolean(selected.value && game.canMove(selected.value, target));
}

function dropTo (target) {
    if (!selected.value) {
        return;
    }

    if (game.tryMove(selected.value, target)) {
        selected.value = null;
    }
}

function autoHome (source) {
    for (let index = 0; index < SUITS.length; index += 1) {
        if (game.canMove(source, { kind: 'foundation', index })) {
            game.tryMove(source, { kind: 'foundation', index });
            clearSelection();
            return;
        }
    }

    if (source.kind === 'foundation') {
        for (let index = 0; index < 7; index += 1) {
            if (game.canMove(source, { kind: 'tableau', index })) {
                game.tryMove(source, { kind: 'tableau', index });
                clearSelection();
                return;
            }
        }
    }
}

function onCardClick (pileIndex, slotIndex) {
    const slot = state.tableau[pileIndex][slotIndex];

    if (!slot || !slot.faceUp) {
        return;
    }

    selectCard({ kind: 'tableau', index: pileIndex, offset: slotIndex });
}

function onEmptyPileClick (pileIndex) {
    if (!selected.value) {
        return;
    }

    dropTo({ kind: 'tableau', index: pileIndex });
}

function slotTop (pileIndex) {
    const pile = state.tableau[pileIndex];
    return pile.length ? pile.length - 1 : -1;
}

function startGame () {
    game.start();
    clearSelection();
}

onMounted(() => {
    startGame();

    tickTimer = setInterval(() => {
        if (!paused.value && state.status === 'playing') {
            game.elapse(1);
        }
    }, 1000);
});

onBeforeUnmount(() => {
    clearInterval(tickTimer);
});
</script>

<template>
    <game-shell>
        <div v-if="state" class="solitaire">
            <header class="solitaire__top">
                <div class="solitaire__title">
                    <span class="solitaire__emoji">♠</span>
                    <div>
                        <h1>Patience</h1>
                        <p>Leg alle kaarten op de Azen.</p>
                    </div>
                </div>

                <div class="solitaire__stats">
                    <span class="solitaire__stat">★ {{ state.score }}</span>
                    <span class="solitaire__stat">✍️ {{ state.moves }} zetten</span>
                    <span class="solitaire__stat">⏱ {{ state.time }}s</span>
                </div>

                <button class="btn solitaire__restart" type="button" @click="startGame">
                    ↻ Opnieuw
                </button>
            </header>

            <div class="solitaire__table">
                <div class="solitaire__upper">
                    <div class="solitaire__stock-side">
                        <button
                            class="solitaire__slot"
                            type="button"
                            :disabled="state.status !== 'playing'"
                            @click="game.drawStock()"
                        >
                            <card v-if="state.stock.length" :card="stockBack" size="small" :face-up="false"/>
                            <span v-else-if="state.waste.length" class="solitaire__recycle">↻</span>
                            <span v-else class="solitaire__empty"/>
                        </button>

                        <div class="solitaire__slot">
                            <card
                                v-if="wasteTop"
                                :card="wasteTop"
                                size="small"
                                :class="{ 'solitaire__card--selected': isSelected({ kind: 'waste' }) }"
                                @click="selectCard({ kind: 'waste' })"
                                @dblclick="autoHome({ kind: 'waste' })"
                            />
                            <span v-else class="solitaire__empty"/>
                        </div>
                    </div>

                    <div class="solitaire__foundations">
                        <div
                            v-for="(suit, index) in SUITS"
                            :key="suit"
                            class="solitaire__slot solitaire__slot--foundation"
                            :class="{ 'solitaire__slot--target': canHold({ kind: 'foundation', index }) }"
                            @click="dropTo({ kind: 'foundation', index })"
                        >
                            <card
                                v-if="foundationTop(index)"
                                :card="foundationTop(index)"
                                size="small"
                                :class="{ 'solitaire__card--selected': isSelected({ kind: 'foundation', index }) }"
                                @click.stop="selectCard({ kind: 'foundation', index })"
                                @dblclick.stop="autoHome({ kind: 'foundation', index })"
                            />
                            <span v-else class="solitaire__empty">{{ { heart: '♥', tile: '♦', clover: '♣', pike: '♠' }[suit] }}</span>
                            <span class="solitaire__foundation-done">{{ foundationCards(index).length }}</span>
                        </div>
                    </div>
                </div>

                <div class="solitaire__tableau">
                    <div
                        v-for="(pile, pileIndex) in state.tableau"
                        :key="pileIndex"
                        class="solitaire__pile"
                        :class="{ 'solitaire__pile--target': canHold({ kind: 'tableau', index: pileIndex }) }"
                        @click="onEmptyPileClick(pileIndex)"
                    >
                        <div
                            v-for="(slot, slotIndex) in pile"
                            :key="slot.card.id"
                            class="solitaire__pile-slot"
                            :style="{
                                top: `${slotIndex * (slot.faceUp ? FACE_UP_DY : FACE_DOWN_DY)}rem`,
                                zIndex: slotIndex,
                            }"
                        >
                            <card
                                :card="slot.card"
                                :face-up="slot.faceUp"
                                size="small"
                                :class="{
                                    'solitaire__card--selected': isSelected({ kind: 'tableau', index: pileIndex, offset: slotIndex }),
                                    'solitaire__card--top': slotIndex === slotTop(pileIndex),
                                }"
                                @click.stop="onCardClick(pileIndex, slotIndex)"
                                @dblclick.stop="slotIndex === slotTop(pileIndex) && autoHome({ kind: 'tableau', index: pileIndex, offset: slotIndex })"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </game-shell>

    <game-over
        v-if="state?.status === 'finished' && state.winner"
        :winner="state.winner"
        restart-label="Nog een keer"
        @restart="startGame"
    />
</template>