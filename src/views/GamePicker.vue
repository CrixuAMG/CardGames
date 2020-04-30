<template>
    <div id="home">
        <div id="game-picker">
            <game-carousel></game-carousel>
        </div>
    </div>
</template>

<script>
    import GameCarousel from "../components/GameSlider/GameCarousel";
    export default {
        name: "GamePicker",
        components: {GameCarousel},
    }
</script>
