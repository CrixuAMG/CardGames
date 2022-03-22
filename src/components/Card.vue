<template>
    <drag :class="[card.suit, `card-${card.value.toString().toLowerCase()}`, {'not-playable': draggable === false}]"
          :draggable="draggable"
          :transfer-data="card" class="card" tag="div" @drag="drag" @dragend="dragend">
        <div class="card-top-mark">
            <div class="card-name">
                {{ card.name }}
            </div>

            <suit :card="card"></suit>
        </div>

        <div class="card-middle-mark">
            <div v-for="(mark, index) in amountOfIcons" v-if="card.value <= 10" :key="index" :class="[`mark-${mark}`]">
                 <suit :card="card"/>
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
import Drag from '@/modules/vue-drag-drop/Drag';

export default {
    name:       "Card",
    components: { Suit, Drag },
    props:      {
        card:      {
            type:     Object,
            required: true
        },
        draggable: {
            type:    Boolean,
            default: false
        },
    },
    computed:   {
        amountOfIcons () {
            if (Number.isInteger(this.card.value)) {
                return this.card.value;
            }

            return 1;
        },
    },
    methods:    {
        drag (card, event) {
            this.$emit('drag', event);
        },
        dragend (card, event) {
            this.$emit('dragend', event);
        }
    }
};
</script>
