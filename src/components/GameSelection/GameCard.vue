<script setup>
import { ref, watch } from 'vue';

import { useRouter } from 'vue-router';

const props = defineProps({
    game: {
        type:     Object,
        required: true,
    },
});

const router = useRouter();

const opponents = ref(props.game.opponents.min);
const showSettings = ref(false);

watch(opponents, value => {
    if (value < props.game.opponents.min) {
        opponents.value = props.game.opponents.min;
    } else if (value > props.game.opponents.max) {
        opponents.value = props.game.opponents.max;
    }
});

function startGame () {
    localStorage.setItem('opponents', String(opponents.value));
    router.push(props.game.route);
}
</script>

<template>
    <article class="game-card">
        <button class="game-card__main" type="button" @click="showSettings = true">
            <span class="game-card__emoji">{{ game.emoji }}</span>

            <div class="game-card__body">
                <h2>{{ game.name }}</h2>
                <p class="game-card__tagline">{{ game.tagline }}</p>
                <p class="game-card__description">{{ game.description }}</p>
            </div>

            <div class="game-card__actions">
                <span class="game-card__play-btn">Speel nu →</span>
            </div>
        </button>

        <Teleport to="body">
            <div v-if="showSettings" class="game-settings" @click.self="showSettings = false">
                <div class="game-settings__panel">
                    <button class="game-settings__close" type="button" @click="showSettings = false">×</button>

                    <span class="game-settings__emoji">{{ game.emoji }}</span>
                    <h2>{{ game.name }}</h2>

                    <label v-if="game.opponents.max > 0" for="opponents">
                        Aantal tegenstanders ({{ game.opponents.min }} – {{ game.opponents.max }})
                    </label>
                    <input
                        v-if="game.opponents.max > 0"
                        id="opponents"
                        v-model.number="opponents"
                        class="game-settings__input"
                        type="number"
                        :min="game.opponents.min"
                        :max="game.opponents.max"
                    >

                    <button class="btn btn--primary" type="button" @click="startGame">
                        Start spel!
                    </button>
                </div>
            </div>
        </Teleport>
    </article>
</template>