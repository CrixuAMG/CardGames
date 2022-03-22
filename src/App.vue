<template>
    <global-data-provider>
        <router-view/>
    </global-data-provider>
</template>

<script>
import GlobalDataProvider from './DataProviders/GlobalDataProvider';

export default {
    components: { GlobalDataProvider }
};
</script>

<style lang="scss">
@import "styles/build";
</style>
