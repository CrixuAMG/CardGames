import Cards from "@/lib/Cards/Cards";
import { forEach } from 'lodash-es';

let GameManager = {
    turnCounter:   0,
    turnFor:       null,
    turnDirection: 'ASC',
    playerCount:   0,
    instance:      {},
    Cards:         Cards,
    Ruleset:       {},
    playedCards:   [],
    players:       [],
    paused:        false,

    setup (instance, Ruleset) {
        this.instance    = instance;
        this.Cards       = Cards;
        this.Ruleset     = Ruleset;
        this.players     = [];
        this.playerCount = 0;

        Ruleset.setup();

        this.instance.emitter.$emit('game::has-been-setup');
    },

    startGame () {
        this.Ruleset.startGame();
    },

    directionIsAscending () {
        return this.turnDirection === 'ASC';
    },

    reverseDirection () {
        if (this.directionIsAscending()) {
            this.turnDirection = 'DESC';
        } else {
            this.turnDirection = 'ASC';
        }
    },

    registerPlayer (player) {
        this.playerCount += 1;
        this.players[this.playerCount] = player;

        this.players = this.players.filter(player => !!player);

        return this.playerCount;
    },

    getPlayerAlias (player) {
        return player?.alias || this.currentPlayer()?.alias;
    },

    pause (isPaused) {
        this.paused = isPaused;

        forEach(this.players, player => {
            player.paused = this.paused;
        });
    },

    updateTurn () {
        let turnFor = this.turnFor;
        if (turnFor === null) {
            turnFor = 0;
        }

        if (this.turnDirection === 'ASC') {
            if (turnFor + 1 > this.playerCount) {
                turnFor = 1;
            } else {
                turnFor += 1;
            }
        } else {
            if (turnFor - 1 < 1) {
                turnFor = this.playerCount;
            } else {
                turnFor -= 1;
            }
        }

        this.turnFor = turnFor;
    },

    getPlayer (id) {
        if (this.turnFor === null) {
            return {};
        }

        return this.players?.[id];
    },

    currentPlayer () {
        return this.getPlayer(this.turnFor - 1);
    },

    previousPlayer () {
        let id = this.directionIsAscending() ? this.turnFor - 1 : this.turnFor + 1;
        if (id > GameManager.playerCount) {
            id = 0;
        } else if (id < 0) {
            id = GameManager.playerCount;
        }

        return this.getPlayer(id);
    },

    nextPlayer () {
        let id = this.directionIsAscending() ? this.turnFor + 1 : this.turnFor - 1;
        if (id > GameManager.playerCount) {
            id = 0;
        } else if (id < 0) {
            id = GameManager.playerCount;
        }

        return this.getPlayer(id);
    },
};

window.GameManager = GameManager;

export default GameManager;
