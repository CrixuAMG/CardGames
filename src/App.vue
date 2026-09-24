<script setup>
import GlobalDataProvider from '@/DataProviders/GlobalDataProvider.vue';
</script>

<template>
    <global-data-provider>
        <router-view/>
    </global-data-provider>
</template>