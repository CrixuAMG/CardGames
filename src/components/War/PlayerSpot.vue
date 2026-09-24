<script setup>
import { computed, inject } from 'vue';

import Card from '@/components/Card.vue';

const props = defineProps({
    player: {
        type:     Object,
        required: true,
    },
});

const gameRef = inject('game');
const phase = inject('warPhase');
const pool = inject('warPool');
const progress = inject('warProgress');

const game = computed(() => gameRef.value);

const lastRound = computed(() => game.value?.state.lastRound);
const revealed = computed(() => lastRound.value?.reveals?.[props.player.id] ?? null);
const warsInvolved = computed(() => lastRound.value?.wars?.filter(war => war.players.includes(props.player.id)) ?? []);
const wonRound = computed(() => lastRound.value?.winner?.id === props.player.id);

const myIndex = computed(() => pool.value[props.player.id] ?? -1);
const inRound = computed(() => myIndex.value >= 0);
const showFlip = computed(() => inRound.value && phase.value !== 'idle');
const flipped = computed(() => {
    if (phase.value === 'done') {
        return true;
    }

    if (phase.value === 'revealing') {
        return progress.value >= myIndex.value;
    }

    return false;
});
const dealing = computed(() => phase.value === 'dealing');
const score = computed(() => props.player.score ?? 0);
</script>

<template>
    <div
        v-if="player"
        class="war-spot"
        :class="{
            'war-spot--human': player.isHuman,
            'war-spot--out': player.isOut || player.pile.length === 0,
            'war-spot--win': wonRound && phase === 'done',
            'war-spot--war': warsInvolved.length > 0,
            'war-spot--dealing': dealing,
        }"
    >
        <div class="war-spot__header">
            <div class="war-spot__avatar" :style="{ '--hue': ((player.id * 47) % 360) }">
                {{ player.alias[0] }}
            </div>
            <div class="war-spot__name">
                {{ player.alias }}
                <span class="war-spot__tag" v-if="player.isHuman">jij</span>
                <span class="war-spot__tag war-spot__tag--out" v-if="player.isOut || player.pile.length === 0">af</span>
            </div>
            <div class="war-spot__badges">
                <span class="war-spot__score" title="Punten">★ {{ score }}</span>
                <span class="war-spot__count">{{ player.pile.length }}</span>
            </div>
        </div>

        <div class="war-spot__cards">
            <template v-if="player.pile.length || showFlip">
                <div v-if="player.pile.length" class="war-spot__backs">
                    <div v-for="n in Math.min(4, player.pile.length)" :key="n" class="war-spot__back-card">
                        ♦
                    </div>
                    <span v-if="player.pile.length > 4" class="war-spot__pile-count">
                        +{{ player.pile.length - 4 }}
                    </span>
                </div>

                <div class="war-spot__reveal-area">
                    <div v-if="showFlip" class="war-spot__flip" :class="{ 'war-spot__flip--flipped': flipped }">
                        <div class="war-spot__flip-inner">
                            <div class="war-spot__flip-face war-spot__flip-back">
                                <div class="card card--table card--face-down">
                                    <div class="card__back">
                                        <div class="card__back-inner">♦</div>
                                    </div>
                                </div>
                            </div>
                            <div class="war-spot__flip-face war-spot__flip-front">
                                <card v-if="revealed" :card="revealed" size="table"/>
                                <div v-else class="war-spot__placeholder">
                                    ?
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="war-spot__placeholder">
                        ?
                    </div>

                    <span v-if="warsInvolved.length && phase === 'done'" class="war-spot__war-badge" title="Oorlog!">
                        ⚔️ ×{{ warsInvolved.length }}
                    </span>
                </div>
            </template>

            <div v-else class="war-spot__empty">—</div>
        </div>
    </div>
</template>
