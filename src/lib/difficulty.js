import { useDataStoreRef } from '@/CustomRefs/DataStoreRef';

export const DIFFICULTIES = [
    { key: 'easy',    label: 'Makkelijk', emoji: '🐣' },
    { key: 'normal',  label: 'Normaal',   emoji: '🎯' },
    { key: 'hard',    label: 'Moeilijk',  emoji: '😈' },
];

export function useDifficulty () {
    return useDataStoreRef('cg:difficulty', 'normal');
}