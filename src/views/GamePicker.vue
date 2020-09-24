<template>
    <div class="game-picker" id="game-picker">
        <div :class="{'selected': isSelected(game)}" @click="selectGame(game)" class="game-picker__option"
             v-for="game in Games">
            {{ game.name }}
        </div>

        <div id="game-picker__details" v-if="selectedGame">
            <h5>
                Opponents:
            </h5>

            Min: {{ selectedGame.opponents.min }}
            Max: {{ selectedGame.opponents.max }}
        </div>

        <label for="opponents">
            Opponents
            <input name="opponents" type="number" v-model="opponents">
        </label>

        <button @click="goToGame">
            Play!
        </button>
    </div>
</template>

<script>
import Games from "../lib/Game/Games";

export default {
    name:    "GamePicker",
    data() {
        return {
            Games:        Games,
            selectedGame: null,
            opponents:    null,
        }
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
            if (!this.selectedGame) {
                return false;
            }

            if (this.opponents < this.selectedGame.opponents.min) {
                this.opponents = this.selectedGame.opponents.min;

                return;
            }

            if (this.opponents > this.selectedGame.opponents.max) {
                this.opponents = this.selectedGame.opponents.max;


            }
        }
    },
    methods: {
        goToGame() {
            let GameOptions = _.cloneDeep(this.selectedGame);

            localStorage.setItem('opponents', this.opponents);

            this.$router.push(GameOptions);
        },
        selectGame(Game) {
            this.selectedGame = Game;
        },
        checkOpponents() {
            if (!this.selectedGame) {
                return false;
            }

            if (this.opponents >= this.selectedGame.opponents.min && this.opponents <= this.selectedGame.opponents.max) {
                return;
            }

            this.opponents = this.selectedGame.opponents.min;
        },
        isSelected(Game) {
            if (!this.selectedGame) {
                return false;
            }

            return this.selectedGame.name === Game.name;
        }
    },
    mounted() {
        this.selectedGame = _.first(this.Games);
    }
}
</script>
