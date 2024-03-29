<template>
    <div class="game-card" :id="`game-card-${randomId}`">
        <div class="game-name">
            {{ game.name }}
        </div>

        <div class="game-description">
            {{ game.description }}
        </div>

        <button class="game-play"
                @click="selectGame">
            {{ $t('general.play') }}
        </button>

        <dialog>
            <div class="game-details">
                <h4>
                    Game settings
                </h4>

                <div @click="closeDialog">
                    &times;
                </div>
            </div>

            <div id="game-picker__details">
                Min: {{ game.opponents.min }}<br>
                Max: {{ game.opponents.max }}
            </div>

            <label for="opponents">
                Opponents
            </label>
            <input id="opponents" v-model="opponents" name="opponents" type="number">

            <button @click="goToGame">
                Play!
            </button>
        </dialog>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash-es';

export default {
    name:  "GameCard",
    props: {
        game: {
            required: true,
        }
    },
    data () {
        return {
            opponents: 1,
            randomId:  Math.random().toString(36).slice(-10),
        };
    },
    watch:   {
        selectedGame: {
            deep:      true,
            immediate: true,
            handler:   function () {
                this.checkOpponents();
            }
        },
        opponents:    function () {
            if (this.opponents < this.game.opponents.min) {
                this.opponents = this.game.opponents.min;
            } else if (this.opponents > this.game.opponents.max) {
                this.opponents = this.game.opponents.max;
            }
        }
    },
    methods: {
        goToGame () {
            let GameOptions = cloneDeep(this.game);

            localStorage.setItem('opponents', this.opponents);

            this.$router.push(GameOptions.route);
        },
        selectGame () {
            document.querySelector(`#game-card-${this.randomId} dialog`).showModal();
        },
        closeDialog () {
            document.querySelector(`#game-card-${this.randomId} dialog`).close();
        },
        checkOpponents () {
            if (!this.selectedGame) {
                return false;
            }

            if (this.opponents >= this.game.opponents.min && this.opponents <= this.game.opponents.max) {
                return;
            }

            this.opponents = this.game.opponents.min;
        },
    },
};
</script>

<style scoped lang="scss">
.game-card {
    display: block;
    cursor: pointer;
    margin-bottom: 5px;
    padding: 1rem 2rem;
    border-radius: 5px;
    border: 3px solid #0e0e0e;
    width: 100%;
    transition: all 300ms ease-in-out;
    background-color: #F18B45;
    box-shadow: 0 0 3rem rgba(0, 0, 0, 0.4),
    inset 0 0 3rem rgba(0, 0, 0, 0.1);

    .game-name {
        font-size: 3rem;
        font-weight: bold;
    }

    .game-description {
        min-height: 2rem;
    }

    .game-play {
        margin-left: auto;
        background-color: #eee;
    }

    dialog {
        background-color: #F18B45;
        border-radius: 1rem;
        min-width: 30rem;

        .game-details {
            display: flex;
            justify-content: space-between;

            h4 {
                margin-top: 0;
                margin-bottom: 1rem;
            }
        }

        label {
            width: 100%;
            display: block;
            margin-top: 1rem;
        }

        input {
            width: 100%;
        }

        button {
            margin-left: auto;
        }
    }
}
</style>
