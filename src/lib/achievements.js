import { useDataStoreRef } from '@/CustomRefs/DataStoreRef';
import { eventHub } from '@/lib/eventHub';

const STORAGE_KEY = 'cg:achievements';

export const ACHIEVEMENTS = [
    {
        id:          'first-win',
        emoji:       '🎉',
        title:       'Eerste overwinning',
        description: 'Win je eerste spel.',
        test:        ({ humanWon }) => humanWon,
    },
    {
        id:          'pesten-champ',
        emoji:       '🌶️',
        title:       'Pesten-kampioen',
        description: 'Win een potje Pesten.',
        test:        ({ state, humanWon }) => humanWon && state.kind === 'pesten',
    },
    {
        id:          'war-hero',
        emoji:       '⚔️',
        title:       'Oorlogsheld',
        description: 'Win een potje Oorlog.',
        test:        ({ state, humanWon }) => humanWon && state.kind === 'war',
    },
    {
        id:          'memory-ace',
        emoji:       '🧠',
        title:       'Geheugenkampioen',
        description: 'Voltooi een spel Memory.',
        test:        ({ state, humanWon }) => humanWon && state.kind === 'memory',
    },
    {
        id:          'patience-king',
        emoji:       '👑',
        title:       'Patience-koning',
        description: 'Voltooi een spel Patience.',
        test:        ({ state, humanWon }) => humanWon && state.kind === 'solitaire',
    },
    {
        id:          'war-predictor',
        emoji:       '🎯',
        title:       'Visionair',
        description: 'Voorspel een Oorlog-ronde juist.',
        test:        ({ state }) => state.kind === 'war' && Boolean(state.lastRound?.predictionCorrect),
    },
    {
        id:          'memory-pro',
        emoji:       '⚡',
        title:       'Memory-expert',
        description: 'Haal 750 of meer punten in Memory.',
        test:        ({ state, humanWon }) => humanWon && state.kind === 'memory' && state.score >= 750,
    },
    {
        id:          'solitaire-hero',
        emoji:       '💎',
        title:       'Solitaire-topper',
        description: 'Voltooi Patience met 400 of meer punten.',
        test:        ({ state, humanWon }) => humanWon && state.kind === 'solitaire' && state.score >= 400,
    },
    {
        id:          'winner-five',
        emoji:       '🏆',
        title:       'Winnaar',
        description: 'Win in totaal 5 spellen.',
        test:        ({ counts }) => counts.wins >= 5,
    },
    {
        id:          'addict',
        emoji:       '🎲',
        title:       'Verslaafd',
        description: 'Speel in totaal 10 spellen.',
        test:        ({ counts }) => counts.gamesPlayed >= 10,
    },
    {
        id:          'platinum',
        emoji:       '🥇',
        title:       'Platinum',
        description: 'Verdien alle andere prestaties.',
        test:        () => false,
    },
];

const baseAchievements = () => ACHIEVEMENTS.filter(achievement => achievement.id !== 'platinum');

export function achievementStore () {
    return useDataStoreRef(STORAGE_KEY, { unlocked: [], gamesPlayed: 0, wins: 0 });
}

export function isUnlocked (store, id) {
    return Boolean(store?.unlocked?.some(entry => entry.id === id));
}

export function unlockedCount (store) {
    return store?.unlocked?.length ?? 0;
}

export function evaluateAchievements (state) {
    if (!state || !state.kind) {
        return [];
    }

    const ref = achievementStore();
    const store = ref.value;
    const unlocked = Array.isArray(store?.unlocked) ? store.unlocked : [];
    const unlockedIds = new Set(unlocked.map(entry => entry.id));

    const humanWon = Boolean(state.winner) && state.winner.isHuman !== false;
    const counts = {
        gamesPlayed: (Number(store?.gamesPlayed) || 0) + 1,
        wins:        (Number(store?.wins) || 0) + (humanWon ? 1 : 0),
    };

    const context = { state, counts, humanWon };
    const newly = [];

    baseAchievements().forEach(achievement => {
        if (!unlockedIds.has(achievement.id) && achievement.test(context)) {
            unlocked.push({ id: achievement.id, date: Date.now() });
            newly.push(achievement);
        }
    });

    const allUnlocked = baseAchievements().every(achievement => unlocked.some(entry => entry.id === achievement.id));

    if (allUnlocked && !unlocked.some(entry => entry.id === 'platinum')) {
        unlocked.push({ id: 'platinum', date: Date.now() });
        newly.push(ACHIEVEMENTS.find(achievement => achievement.id === 'platinum'));
    }

    ref.value = { unlocked, gamesPlayed: counts.gamesPlayed, wins: counts.wins };

    newly.forEach(achievement => {
        eventHub.$emit('toast::add', {
            text:    `🏅 Prestatie: ${achievement.emoji} ${achievement.title}`,
            canClose: false,
        });
    });

    return newly;
}