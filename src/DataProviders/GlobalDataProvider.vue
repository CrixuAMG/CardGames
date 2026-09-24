<template>
    <slot/>
</template>

<script>
import { useDataStoreRef } from '../CustomRefs/DataStoreRef';
import { provide } from 'vue';

export default {
    name: "GlobalDataProvider",
    setup () {
        const username = useDataStoreRef('username', null);
        const difficulty = useDataStoreRef('cg:difficulty', 'normal');

        provide('username', username);
        provide('difficulty', difficulty);
    },
};
</script>

<style scoped>

</style>
