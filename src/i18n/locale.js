import { useDataStoreRef } from '@/CustomRefs/DataStoreRef';

export const LOCALES = [
    { key: 'nl', label: 'Nederlands' },
    { key: 'en', label: 'English' },
];

export function useLocale () {
    return useDataStoreRef('cg:locale', 'nl');
}