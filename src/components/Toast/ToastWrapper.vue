<template>
    <div class="toast-wrapper"/>
</template>

<script>
import Toast from '../../lib/Toast/Toast';
import eventHub from '../../lib/eventHub';
import { ref } from 'vue';

export default {
    name: "ToastWrapper",
    setup () {
        const toastsPerformed = ref([]);

        eventHub.$on('toast::add', (options) => {
            toastsPerformed.value = [
                ...toastsPerformed.value,
                new Toast(options),
            ];
        });

        return {
            toastsPerformed,
        };
    },
};
</script>

<style lang="scss">
.toast-wrapper {
    position: fixed;
    height: 100%;
    width: 100%;
    inset: 0;
    z-index: 1;
    pointer-events: none;

    .toast-container {
        position: fixed;
        margin: 1rem;
        display: flex;
        flex-flow: column nowrap;
        gap: 1rem;
        transition: transform 300ms ease-in-out;
        overflow: hidden;

        &[data-position="top-center"] .toast {
            transform: translateY(-100vh);
        }

        &[data-position="bottom-center"] .toast {
            transform: translateY(100vh);
        }

        &[data-position^="top"] {
            top: 0;
        }

        &[data-position^="bottom"] {
            bottom: 0;
        }

        &[data-position$="-right"] {
            right: 0;

            .toast {
                transform: translateX(110%);
            }
        }

        &[data-position$="-left"] {
            left: 0;

            .toast {
                transform: translateX(-110%);
            }
        }

        &[data-position$="-center"] {
            left: 50%;
            transform: translateX(-50%);
        }

        .toast {
            box-sizing: border-box;
            padding: 1rem;
            background-color: #eee;
            border: 1px solid #333;
            border-radius: 0.5rem;
            position: relative;
            width: 100%;
            min-width: 30rem;
            max-width: 30rem;
            cursor: pointer;
            user-select: none;
            pointer-events: all;

            &:after {
                content: "\00D7";
                position: absolute;
                inset: 0.75rem 0.75rem auto auto;
                height: max-content;
                line-height: 0.7;
            }

            &.show {
                transform: translate(0, 0);
            }

            &.progress::before {
                content: "";
                position: absolute;
                height: 2px;
                width: calc(100% * var(--progress));
                background-color: blue;
                bottom: 0;
                left: 0;
                right: 0;
            }
        }
    }
}
</style>
