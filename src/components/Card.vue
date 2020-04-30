<template>
    <drag class="card" :class="[card.suit, `card-${card.value.toString().toLowerCase()}`]" @drag="drag"
          @dragend="dragend" :draggable="draggable" :transfer-data="card" tag="div">
        <div class="card-top-mark">
            <div class="card-name">
                {{ card.name }}
            </div>

            <suit :card="card"></suit>
        </div>

        <div class="card-middle-mark">
            <div :class="[`mark-${mark}`]" v-for="(mark, index) in amountOfIcons" v-if="card.value <= 10">
<!--                <suit :card="card"></suit>-->
            </div>
        </div>

        <div class="card-bottom-mark">
            <div class="card-name">
                {{ card.name }}
            </div>

            <suit :card="card"></suit>
        </div>
    </drag>
</template>

<script>
    import Suit from "./Suit";

    export default {
        name: "Card",
        components: {Suit},
        props: {
            card: {
                type: Object,
                required: true
            },
            draggable: {
                type: Boolean,
                default: false
            },
        },
        computed: {
            amountOfIcons() {
                if (Number.isInteger(this.card.value)) {
                    return this.card.value;
                }

                return 1;
            }
        },
        methods: {
            drag(card, event) {
                this.$emit('drag', event);
            },
            dragend(card, event) {
                this.$emit('dragend', event);
            }
        }
    }
</script>
