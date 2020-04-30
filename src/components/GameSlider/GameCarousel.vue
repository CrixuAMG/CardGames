<template>
    <div id="game-carousel" data-flickity='{ "wrapAround": true }'>
        <div class="game-carousel-slide" v-for="game in Games">
            <div class="game-title">
                {{ game.name }}
            </div>

            <div class="game-info">
                <div class="game-description">

                </div>

                <div class="game-opponents">
                    Min opponents: {{ game.opponents.min }}<br>
                    Max opponents: {{ game.opponents.max }}
                </div>

                <div class="game-play-button" @click="goToGame(game)">
                    Play
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Flickity from 'flickity';
    import Games from "../../lib/Game/Games";

    export default {
        name: "GameCarousel",
        data() {
            return {
                Games: Games
            }
        },
        methods: {
            setupCarousel() {
                let elem = document.querySelector('#game-carousel');
                let flkty = new Flickity(elem, {
                    // options
                    cellAlign: 'center',
                    wrapAround: true
                });

                console.log(flkty);
            },
            goToGame(game) {
                this.$router.push(game);
            }
        },
        mounted() {
            this.setupCarousel();
        }
    }
</script>

<style lang="scss" scoped>
    #game-carousel {
        background: #EEE;
        width: 100%;
        height: 300px;
    }

    #game-carousel .game-carousel-slide {
        width: 66%;
        height: 300px;
        margin-right: 10px;
        background: #8C8;
        border-radius: 5px;
        counter-increment: carousel-cell;
        text-align: center;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;

        .game-title {
            font-size: 48px;
            font-weight: 600;
        }

        .game-info {
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
        }

        .game-play-button {
            display: block;
            margin: 15px auto 0;
            border: 1px solid grey;
            border-radius: 10%;
            padding: 5px 10px;
            width: max-content;
            cursor: pointer;
        }
    }
</style>
