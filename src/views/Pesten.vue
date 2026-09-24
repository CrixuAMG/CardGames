<script setup>
import { computed, inject, onMounted, provide, ref } from 'vue';

import DiscardPile from '@/components/DiscardPile.vue';
import DrawPile from '@/components/DrawPile.vue';
import GameData from '@/components/GameData.vue';
import GameShell from '@/components/GameShell.vue';
import Hand from '@/components/Hand.vue';
import Opponent from '@/components/Opponent.vue';
import GameOver from '@/components/Game/GameOver.vue';
import RulesPanel from '@/components/Game/RulesPanel.vue';
import { RULES, createPestenGame } from '@/lib/games/pesten';

const username = inject('username');

const gameRef = ref(null);
provide('game', gameRef);

const state = computed(() => gameRef.value?.state);
const opponents = computed(() => state.value?.players.slice(1) ?? []);

function startGame () {
    const opponentsCount = parseInt(localStorage.getItem('opponents')) || 1;

    gameRef.value = createPestenGame({
        opponents: opponentsCount,
        humanAlias: username?.value || 'Jij',
    });

    gameRef.value.start();
}

onMounted(startGame);
</script>

<template>
    <game-shell>
        <div v-if="state" class="pesten">
            <header class="pesten__top">
                <game-data/>

                <div class="pesten__opponents">
                    <opponent v-for="player in opponents" :key="player.id" :player-id="player.id"/>
                </div>
            </header>

            <main class="pesten__table">
                <discard-pile/>
                <draw-pile/>
            </main>

            <hand/>

            <rules-panel :rules="RULES" title="Spelregels Pesten"/>
        </div>
    </game-shell>

    <game-over
        v-if="state?.status === 'finished' && state.winner"
        :winner="state.winner"
        restart-label="Nog een keer spelen"
        @restart="startGame"
    />
</template>