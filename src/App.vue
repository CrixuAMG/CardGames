<script setup>
import GlobalDataProvider from '@/DataProviders/GlobalDataProvider.vue';
import StatsTracker from '@/components/Game/StatsTracker.vue';
</script>

<template>
    <global-data-provider>
        <stats-tracker>
            <router-view/>
        </stats-tracker>
    </global-data-provider>
</template>