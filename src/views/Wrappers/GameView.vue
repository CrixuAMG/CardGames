<template>
    <div id="game-view">
        <toast-wrapper/>

        <div id="game-template">
            <slot/>
        </div>

        <pause-menu/>
    </div>
</template>

<script>
import ToastWrapper from '../../components/Toast/ToastWrapper';
import { onMounted, onUnmounted } from 'vue';
import PauseMenu from '../../components/Game/PauseMenu';

export default {
    name:       "GameView",
    components: {
        PauseMenu,
        ToastWrapper,
    },
    setup () {
        const onKeyPress = (event) => {
            const pauseMenu = document.querySelector('#pause-menu');

            if (event.code === 'KeyP') {
                pauseMenu.open
                    ? (() => {
                        GameManager.pause(false);
                        pauseMenu.close();
                    })()
                    : (() => {
                        GameManager.pause(true);
                        pauseMenu.showModal();
                    })();
            }
        };

        onMounted(() => {
            document.addEventListener('keypress', onKeyPress);
        });

        onUnmounted(() => {
            document.removeEventListener('keypress', onKeyPress);
        });
    }
};
</script>

<style scoped lang="scss">
#game-view {
    height: 100%;
    width: 100%;

    #game-template {
        height: inherit;
        width: inherit;
    }
}
</style>
