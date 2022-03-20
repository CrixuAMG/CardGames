<template>
    <div v-if="card.suit === 'heart'" class="card-suit">
        &heartsuit;
    </div>
    <div v-else-if="card.suit === 'pike'" class="card-suit">
        &spadesuit;
    </div>
    <div v-else-if="card.suit === 'clover'" class="card-suit">
        &clubsuit;
    </div>
    <div v-else-if="card.suit === 'tile'" class="card-suit">
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
};
</script>
