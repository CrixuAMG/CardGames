import { faker } from '@faker-js/faker';

export function createPlayers (opponents, humanAlias = 'Jij') {
    const players = [{
        id:       1,
        alias:    humanAlias || 'Jij',
        cards:    [],
        pile:     [],
        isHuman:  true,
        isOut:    false,
    }];

    for (let i = 0; i < opponents; i++) {
        players.push({
            id:       i + 2,
            alias:    faker.person.firstName(),
            cards:    [],
            pile:     [],
            isHuman:  false,
            isOut:    false,
        });
    }

    return players;
}