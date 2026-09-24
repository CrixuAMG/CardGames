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
    {
        key:          'memory',
        name:         'Memory',
        tagline:      'Train je geheugen, vind alle paren',
        description:  'Draai kaarten om en zoek de bijpassende paren. Hoe sneller je klaar bent, hoe hoger je score!',
        emoji:        '🧠',
        gradient:     'linear-gradient(135deg, #12b2d9 0%, #7f6cff 100%)',
        route:        { name: 'Memory' },
        opponents:    { min: 0, max: 0 },
    },
    {
        key:          'solitaire',
        name:         'Patience',
        tagline:      'Het klassieke solitaire',
        description:  'Stapel de kaarten aflopend en wisselend van kleur, en bouw de azen op. Kun jij het bord leeg krijgen?',
        emoji:        '♠️',
        gradient:     'linear-gradient(135deg, #1fa856 0%, #0c8f5f 100%)',
        route:        { name: 'Solitaire' },
        opponents:    { min: 0, max: 0 },
    },
];

export function getGame (key) {
    return GAMES.find(game => game.key === key);
}