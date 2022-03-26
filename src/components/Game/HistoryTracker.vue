<template>
    <div id="history-tracker" :class="{open: opened}">
        <div id="history-container">
            <template v-for="(historyItem, index) in history" :key="index">
                <div class="card-history-wrapper">
                    <div class="card-history-wrapper-player">
                        {{ historyItem.player.alias }}
                    </div>

                    <card :card="historyItem.card" :draggable="false"/>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { nextTick, provide, ref } from 'vue';
import eventHub from '../../lib/eventHub';
import Card from '../Card';

export default {
    name:       "HistoryTracker",
    components: { Card },
    setup () {
        const history = ref([]);
        const opened  = ref(false);

        eventHub.$on('card::to-history', ({
                                              card,
                                              player
                                          }) => {
            history.value = [
                ...history.value,
                {
                    card,
                    player
                },
            ];

            nextTick(() => {
                const historyTracker = document.querySelector('#history-tracker');
                if (historyTracker.scrollLeft !== 0) {
                    historyTracker.scrollTo(historyTracker.scrollLeft + 1, 0);
                }
            });
        });

        provide('historyOpened', opened);

        return {
            history,
            opened,
        };
    },
};
</script>

<style lang="scss" scoped>
#history-tracker {
    position: fixed;
    z-index: 10;
    inset: 0 0 auto 0;
    width: 100vw;
    transition: all 0.75s ease-in-out;
    transform: translateY(-95%);
    background-color: #eee;

    &.open, &:hover {
        transform: translateY(0);
    }

    #history-container {
        display: flex;
        flex-flow: row-reverse nowrap;
        overflow-x: scroll;
        overflow-y: visible;

        .card-history-wrapper {
            display: flex;
            flex-flow: column nowrap;

            .card-history-wrapper-player {
                text-align: center;
                font-weight: bold;
                margin-top: 0.5rem;
                margin-bottom: 0.2rem;
            }

            .card {
                pointer-events: none;
            }
        }
    }
}
</style>