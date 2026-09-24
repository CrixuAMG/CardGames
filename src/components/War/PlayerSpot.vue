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
const game = computed(() => gameRef.value);

const lastRound = computed(() => game.value?.state.lastRound);
const revealed = computed(() => lastRound.value?.reveals?.[props.player.id] ?? null);
const warsInvolved = computed(() => (
    lastRound.value?.wars?.filter(war => war.players.includes(props.player.id)) ?? []
));
const wonRound = computed(() => lastRound.value?.winner?.id === props.player.id);
</script>

<template>
    <div
        v-if="player"
        class="war-spot"
        :class="{
            'war-spot--human': player.isHuman,
            'war-spot--out': player.isOut || player.pile.length === 0,
            'war-spot--win': wonRound,
            'war-spot--war': warsInvolved.length > 0,
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
            <div class="war-spot__count">{{ player.pile.length }}</div>
        </div>

        <div class="war-spot__cards">
            <template v-if="player.pile.length">
                <div class="war-spot__backs">
                    <div v-for="n in Math.min(4, player.pile.length)" :key="n" class="war-spot__back-card">
                        ♦
                    </div>
                    <span v-if="player.pile.length > 4" class="war-spot__pile-count">
                        +{{ player.pile.length - 4 }}
                    </span>
                </div>

                <card
                    v-if="revealed"
                    :card="revealed"
                    size="table"
                    :face-up="true"
                    class="war-spot__reveal"
                />
                <div v-else class="war-spot__placeholder">
                    ?
                </div>

                <div v-if="warsInvolved.length" class="war-spot__war-badge" title="Oorlog!">
                    ⚔️ ×{{ warsInvolved.length }}
                </div>
            </template>

            <div v-else class="war-spot__empty">—</div>
        </div>
    </div>
</template>