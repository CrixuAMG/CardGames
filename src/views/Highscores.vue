<script setup>
import { computed } from 'vue';

import { GAMES } from '@/lib/games/registry';
import { clearScores, GAME_META, topScores } from '@/lib/stats';

const sections = computed(() => GAMES.map(game => ({
    ...GAMES.find(g => g.key === game.key),
    meta:       GAME_META[game.key],
    top:        topScores(game.key, 5),
})));

const hasScores = computed(() => sections.value.some(section => section.top.length));

function formatDate (timestamp) {
    return new Date(timestamp).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}

function metricLabel (section) {
    if (section.meta?.metric === 'lower') {
        return 'snelste win (weinig beurten)';
    }

    return 'hoogste score';
}
</script>

<template>
    <div class="highscores">
        <header class="highscores__header">
            <router-link class="btn highscores__back" to="/">↩ Spellen</router-link>

            <div class="highscores__title">
                <span class="highscores__logo">🏆</span>
                <h1>Highscores</h1>
            </div>

            <button v-if="hasScores" class="btn highscores__clear" type="button" @click="clearScores()">
                Wissen
            </button>
        </header>

        <p v-if="!hasScores" class="highscores__empty">
            Nog geen scores! Speel een spel en zet je beste prestatie op de lijst. 🎮
        </p>

        <div v-else class="highscores__grid">
            <section v-for="section in sections" :key="section.key" class="highscores__card">
                <header class="highscores__card-head">
                    <span class="highscores__card-emoji">{{ section.emoji }}</span>
                    <div>
                        <h2>{{ section.name }}</h2>
                        <p>{{ metricLabel(section) }}</p>
                    </div>
                </header>

                <div v-if="section.top.length" class="highscores__best">
                    <span class="highscores__best-score">{{ section.meta?.metric === 'lower' ? section.top[0].score : section.top[0].score }}</span>
                    <span class="highscores__best-winner">{{ section.top[0].winner }}</span>
                    <span class="highscores__best-date">{{ formatDate(section.top[0].date) }}</span>
                </div>

                <ol v-if="section.top.length" class="highscores__list">
                    <li v-for="(entry, index) in section.top" :key="entry.date + index" class="highscores__row" :class="{ 'highscores__row--top': index === 0 }">
                        <span class="highscores__rank">{{ index + 1 }}</span>
                        <span class="highscores__name">{{ entry.winner }}</span>
                        <span class="highscores__value">{{ entry.score }}</span>
                    </li>
                </ol>
            </section>
        </div>
    </div>
</template>