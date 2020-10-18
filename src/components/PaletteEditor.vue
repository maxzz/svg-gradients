<template>
    <div class="palette-editor">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 80"
            class="palette-svg"
        >
            <defs>
                <!-- <linearGradient id="pal">
                    <stop offset="0%" stop-color="red" />
                    <stop offset="100%" stop-color="gold" />
                </linearGradient> -->

                <linearGradient id="pal">
                    <stop v-for="(stripe, index) of stripes" :key="index" :offset="stripe.val" :stop-color="stripe.color"/>
                </linearGradient>
            </defs>
            <rect x="5%" y="50%" width="90%" height="40%" fill="url(#pal)" />
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    setup() {
        type ColorStop = {
            val: string;
            color: string;
        };

        let stripes = ref<ColorStop[]>([
            {
                val: '0%',
                color: 'red',
            },
            {
                val: '100%',
                color: 'gold',
            },
        ]);

        return {
            stripes,
        };
    },
});
</script>

<style lang="scss">
.palette-editor {
    position: relative;
    margin: 0 auto;
    width: 90vw;
    height: 100px;
    background-color: rgba(255, 99, 71, 0.329);
}
.palette-svg {
    width: 200px;
    height: 80px;
    background-color: olive;
}
</style>
