<script setup>
import { computed, inject, onMounted, ref } from 'vue';

import GameCard from '@/components/GameSelection/GameCard.vue';
import { DIFFICULTIES } from '@/lib/difficulty';
import { GAMES } from '@/lib/games/registry';

const username = inject('username');
const difficulty = inject('difficulty');

const nameDraft = ref('');
const showNamePrompt = ref(false);

const displayName = computed(() => username.value || 'Speler');

onMounted(() => {
    if (!username.value) {
        showNamePrompt.value = true;
    }
});

function saveName () {
    if (nameDraft.value.trim()) {
        username.value = nameDraft.value.trim();
    }

    showNamePrompt.value = false;
}
</script>

<template>
    <div class="game-picker">
        <header class="game-picker__header">
            <div class="game-picker__brand">
                <span class="game-picker__logo">🂠</span>
                <h1>Card Games</h1>
            </div>

            <div class="game-picker__actions">
                <router-link class="btn game-picker__scores" to="/highscores">🏆 Highscores</router-link>
                <router-link class="btn game-picker__scores" to="/achievements">🏅 Prestaties</router-link>

                <div class="game-picker__difficulty" title="Moeilijkheidsgraad van de computer">
                    <span class="game-picker__difficulty-label">{{ DIFFICULTIES.find(d => d.key === difficulty.value)?.emoji }} 🤖</span>
                    <select v-model="difficulty.value" class="game-picker__difficulty-select">
                        <option v-for="d in DIFFICULTIES" :key="d.key" :value="d.key">
                            {{ d.label }}
                        </option>
                    </select>
                </div>

                <div class="game-picker__player" title="Je naam aanpassen" @click="showNamePrompt = true">
                    <span class="game-picker__avatar">{{ displayName[0] }}</span>
                    <span>{{ displayName }}</span>
                </div>
            </div>
        </header>

        <p class="game-picker__intro">
            Kies een spel en pest je vrienden — of laat de computer het winnen!
        </p>

        <div class="game-picker__grid">
            <game-card v-for="game in GAMES" :key="game.key" :game="game"/>
        </div>

        <Teleport to="body">
            <div v-if="showNamePrompt" class="name-prompt" @click.self="saveName">
                <div class="name-prompt__panel" @submit.prevent="saveName" @keydown.enter="saveName">
                    <h2>Welkom! 👋</h2>
                    <p>Hoe heet je? Zo weten de andere spelers wie ze verslaan.</p>

                    <input
                        v-model="nameDraft"
                        class="name-prompt__input"
                        type="text"
                        placeholder="Je naam"
                        autofocus
                    >

                    <button class="btn btn--primary" type="button" @click="saveName">
                        Start
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>