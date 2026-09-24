export const GAMES = [
    {
        key:          'pesten',
        name:         'Pesten',
        tagline:      'Het klassieke Nederlandse kaartspel',
        description:  'Pest je tegenstanders met 2\'en, 8\'en, boeren en jokers. Wie het eerst al zijn kaarten kwijt is, wint!',
        emoji:        '🃏',
        gradient:     'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
        route:        { name: 'Pesten' },
        opponents:    { min: 1, max: 7 },
    },
    {
        key:          'war',
        name:         'Oorlog',
        tagline:      'Het legendarische vechtkaartspel',
        description:  'Iedereen draait een kaart om, de hoogste kaart wint de pot. Bij gelijkspel: OORLOG!',
        emoji:        '⚔️',
        gradient:     'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        route:        { name: 'War' },
        opponents:    { min: 1, max: 5 },
    },
];

export function getGame (key) {
    return GAMES.find(game => game.key === key);
}