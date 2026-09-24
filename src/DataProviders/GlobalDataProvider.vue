<template>
    <slot/>
</template>

<script>
import { useDataStoreRef } from '../CustomRefs/DataStoreRef';
import { provide } from 'vue';
import { useLocale } from '../i18n/locale';

export default {
    name: "GlobalDataProvider",
    setup () {
        const username = useDataStoreRef('username', null);
        const difficulty = useDataStoreRef('cg:difficulty', 'normal');
        const locale = useLocale();

        provide('username', username);
        provide('difficulty', difficulty);
        provide('locale', locale);
    },
};
</script>

<style scoped>

</style>
