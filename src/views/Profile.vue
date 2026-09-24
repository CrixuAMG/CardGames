<script setup>
import { computed, inject, ref } from 'vue';

import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { DIFFICULTIES } from '@/lib/difficulty';
import { GAMES } from '@/lib/games/registry';
import { bestScore, GAME_META } from '@/lib/stats';

const username = inject('username');
const difficulty = inject('difficulty');

const editingName = ref(false);
const nameDraft = ref('');

const displayName = computed(() => username.value || 'Jij');

const bestScores = computed(() => GAMES.map(game => ({
    ...game,
    meta: GAME_META[game.key],
    best: bestScore(game.key),
})));

const hasAnyScore = computed(() => bestScores.value.some(section => section.best));

function startEdit () {
    nameDraft.value = username.value || '';
    editingName.value = true;
}

function saveName () {
    const trimmed = nameDraft.value.trim();

    if (trimmed) {
        username.value = trimmed;
    }

    editingName.value = false;
}

function formatDate (timestamp) {
    return new Date(timestamp).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}
</script>

<template>
    <div class="profile">
        <header class="profile__header">
            <router-link class="btn profile__back" to="/">↩ Spellen</router-link>

            <div class="profile__title">
                <span class="profile__logo">👤</span>
                <h1>Profiel</h1>
            </div>
        </header>

        <div class="profile__grid">
            <section class="profile__card">
                <header class="profile__card-head">
                    <span class="profile__avatar-big">{{ displayName[0] }}</span>
                    <div>
                        <h2>{{ displayName }}</h2>
                        <p>Speler</p>
                    </div>
                </header>

                <div class="profile__name-edit">
                    <button v-if="!editingName" class="btn" type="button" @click="startEdit">
                        Naam aanpassen
                    </button>

                    <div v-else class="profile__name-form">
                        <input
                            v-model="nameDraft"
                            class="profile__input"
                            type="text"
                            maxlength="20"
                            placeholder="Je naam"
                            @keydown.enter="saveName"
                        >
                        <button class="btn btn--primary" type="button" @click="saveName">
                            Opslaan
                        </button>
                    </div>
                </div>
            </section>

            <section class="profile__card">
                <header class="profile__card-head">
                    <span class="profile__card-emoji">⚙️</span>
                    <h2>Instellingen</h2>
                </header>

                <div class="profile__setting">
                    <span>Moeilijkheidsgraad computer</span>
                    <select v-model="difficulty.value" class="profile__select">
                        <option v-for="d in DIFFICULTIES" :key="d.key" :value="d.key">
                            {{ d.emoji }} {{ d.label }}
                        </option>
                    </select>
                </div>

                <div class="profile__setting">
                    <span>Taal</span>
                    <language-switcher/>
                </div>
            </section>

            <section class="profile__card profile__card--scores">
                <header class="profile__card-head">
                    <span class="profile__card-emoji">🏆</span>
                    <h2>Beste scores</h2>
                    <router-link class="profile__scores-link" to="/highscores">Bekijk alle →</router-link>
                </header>

                <p v-if="!hasAnyScore" class="profile__empty">
                    Nog geen scores. Speel een spel om hier je beste prestatie te zien! 🎮
                </p>

                <div v-else class="profile__scores">
                    <div v-for="section in bestScores" :key="section.key" class="profile__score-row">
                        <span class="profile__score-emoji">{{ section.emoji }}</span>

                        <div class="profile__score-meta">
                            <span class="profile__score-name">{{ section.name }}</span>
                            <span v-if="section.best" class="profile__score-date">{{ formatDate(section.best.date) }}</span>
                            <span v-else class="profile__score-date">—</span>
                        </div>

                        <span class="profile__score-value">
                            {{ section.best ? section.best.score : '–' }}
                        </span>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>