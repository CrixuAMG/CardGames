<script setup>
import { computed } from 'vue';

import { ACHIEVEMENTS, achievementStore, isUnlocked } from '@/lib/achievements';

const store = achievementStore();

const progress = computed(() => ({
    unlocked: store.value?.unlocked?.length ?? 0,
    total:    ACHIEVEMENTS.length,
    percent:  Math.round(((store.value?.unlocked?.length ?? 0) / ACHIEVEMENTS.length) * 100),
}));
</script>

<template>
    <div class="achievements">
        <header class="achievements__header">
            <router-link class="btn achievements__back" to="/">↩ Spellen</router-link>

            <div class="achievements__title">
                <span class="achievements__logo">🏅</span>
                <h1>Prestaties</h1>
            </div>

            <span class="achievements__counter">{{ progress.unlocked }} / {{ progress.total }}</span>
        </header>

        <div class="achievements__progress">
            <div class="achievements__progress-bar">
                <div class="achievements__progress-fill" :style="{ width: `${progress.percent}%` }"/>
            </div>
            <span>{{ progress.percent }}% behaald</span>
        </div>

        <div class="achievements__grid">
            <article
                v-for="achievement in ACHIEVEMENTS"
                :key="achievement.id"
                class="achievement"
                :class="{ 'achievement--locked': !isUnlocked(store.value, achievement.id), 'achievement--platinum': achievement.id === 'platinum' }"
            >
                <div class="achievement__head">
                    <span class="achievement__emoji">{{ achievement.emoji }}</span>
                    <span v-if="isUnlocked(store.value, achievement.id)" class="achievement__check" title="Behaald">✔</span>
                    <span v-else class="achievement__lock" title="Nog niet behaald">🔒</span>
                </div>

                <h2>{{ achievement.title }}</h2>
                <p>{{ achievement.description }}</p>
            </article>
        </div>
    </div>
</template>