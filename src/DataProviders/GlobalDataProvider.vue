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

        provide('username', username);
    },
};
</script>

<style scoped>

</style>
