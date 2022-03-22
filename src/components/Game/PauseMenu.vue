<template>
    <dialog id="pause-menu">
        <h3>Paused</h3>

        <ul>
            <li @click="exitGame">
                Return home
            </li>
            <li @click="resume">
                Resume
            </li>
        </ul>
    </dialog>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
    name: "PauseMenu",
    setup () {
        const router = useRouter();

        const unPause = () => {
            GameManager.pause(false);
        };

        const resume   = () => {
            unPause();

            document.querySelector('#pause-menu').close();
        };
        const exitGame = () => {
            unPause();

            router.replace({
                name:   'GamePicker',
                params: {},
                query:  {},
            });
        };

        return {
            resume,
            exitGame,
        };
    }
};
</script>

<style scoped lang="scss">
#pause-menu {
    width: 30rem;
    height: 15rem;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;

    h3 {
        margin: 0;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;

        li {
            cursor: pointer;
            transition: transform 0.3s ease-in-out;

            &:not(:last-of-type) {
                margin-bottom: 1rem;
            }

            &:hover {
                text-decoration: underline;
                transform: translateX(1rem);
            }
        }
    }
}
</style>
