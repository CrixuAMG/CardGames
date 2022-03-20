<template>
    <div class="war">
        <div class="cards"></div>

        <hand :cards="hand"></hand>
    </div>
</template>

<script>
import Cards from "../lib/Cards/Cards";
import Hand from "../components/Hand";

export default {
    name:       "War",
    components: { Hand },
    methods:    {
        setup () {
            let cards        = {};
            cards.createCard = function (Card) {
                let card = document.createElement('div');
                card.classList.add(Card.suit);
                card.classList.add('card');

                let topMark = document.createElement('div');
                topMark.classList.add('card-top-mark');
                topMark.innerText = Card.name;

                card.append(topMark);

                let bottomMark = document.createElement('div');
                bottomMark.classList.add('card-bottom-mark');
                bottomMark.innerText = Card.name;

                card.append(bottomMark);

                cardWrapper.append(card);
            };

            let cardWrapper = document.querySelector('.cards');

            Cards.get(true, true);

            _.forEach(Cards.take(3), Card => {
                cards.createCard(Card);
            });

            this.hand = Cards.take(7);
        }
    },
    data () {
        return {
            hand:      [],
            opponents: 3
        };
    },

    mounted () {
        this.opponents = localStorage.getItem('opponents');
        this.setup();
    }
};
</script>

<style lang="scss">
body {
    background-color: forestgreen;
    height: 100vh;
}

.war {
    display: flex;
    flex-flow: column;

    .cards {
        display: flex;
        flex-flow: row wrap;
        max-width: 100%;
        margin: auto auto;
        height: max-content;
        width: max-content;

        .card {
            &:hover {
                transform: rotate(-5deg) scale(1.2);
                z-index: 999;
            }
        }
    }
}
</style>
