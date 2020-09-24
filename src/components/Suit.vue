<template>
    <div class="card-suit" v-if="card.suit === 'heart'">
        &heartsuit;
    </div>
    <div class="card-suit" v-else-if="card.suit === 'pike'">
        &spadesuit;
    </div>
    <div class="card-suit" v-else-if="card.suit === 'clover'">
        &clubsuit;
    </div>
    <div class="card-suit" v-else-if="card.suit === 'tile'">
        &diamondsuit;
    </div>
</template>

<script>
export default {
    name:  "Suit",
    props: {
        card: {
            required: true,
            type:     Object
        }
    }
}
</script>
