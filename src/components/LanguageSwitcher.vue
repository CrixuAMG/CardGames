<script setup>
import { computed, inject } from 'vue';

import { useI18n } from 'vue-i18n';

import i18n, { syncLocale } from '@/i18n';
import { LOCALES } from '@/i18n/locale';

const storedLocale = inject('locale', null);

const { t, locale } = useI18n();

const selected = computed({
    get: () => locale.value,
    set: value => {
        syncLocale(value);

        if (storedLocale) {
            storedLocale.value = value;
        }
    },
});

function changeLocale (value) {
    selected.value = value;
}
</script>

<template>
    <label class="language-switcher">
        <span class="language-switcher__label">{{ t('common.language') }}</span>

        <select :value="selected" class="language-switcher__select" @change="changeLocale($event.target.value)">
            <option v-for="item in LOCALES" :key="item.key" :value="item.key">
                {{ item.label }}
            </option>
        </select>
    </label>
</template>
