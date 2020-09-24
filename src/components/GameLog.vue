<template>
    <div id="game-log">
        <div v-for="log in logs">
            {{ log.message }}
        </div>
    </div>
</template>

<script>
export default {
    name: "GameLog",
    data() {
        return {
            logs: []
        }
    },
    mounted() {
        this.$root.$on('game::start', () => {
            this.logs = [];
        });

        this.$root.$on('log', (data) => {
            this.logs.push(data);

            setTimeout(() => {
                let gameLog       = document.querySelector('#game-log');
                gameLog.scrollTop = gameLog.scrollHeight;
            }, 1);
        });
    }
}
</script>
