<template>
    <div class="palette-editor">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 80"
            class="palette-svg"
        >
            <defs>
                <linearGradient id="pal">
                    <stop
                        v-for="(stripe, index) of currentStripes"
                        :key="index"
                        :offset="`${stripe.val}%`"
                        :stop-color="stripe.color"
                    />
                </linearGradient>
            </defs>

            <template
                v-for="(stripe, index) of currentStripes"
                :key="index"
            >
                <circle :cx="posCircle(stripe.val)" cy="20" r="5%" fill="gray" stroke-width=1 stroke="red" />
                <rect :x="`${posPin(stripe.val)}`" y="20" width="1%" height="40" fill="red" />
            </template>

            <rect x="5%" y="50%" width="90%" height="40%" fill="url(#pal)" />
        </svg>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

type ColorStop = {
    val: string;
    color: string;
};

const enum SIZES {
    pinWidth = 1,
    pinWidthHalf = 0.5,
    left = 5,
    leftCircle = left + pinWidth / 2,
    right = 5,
    newRange = 100 - left - right - pinWidth,
}

const defaultPalette = [
    {
        val: "0",
        color: "red",
    },
    {
        val: "50",
        color: "blue",
    },
    {
        val: "60",
        color: "blue",
    },
    {
        val: "60",
        color: "green",
    },
    {
        val: "100",
        color: "gold",
    },
];

export default defineComponent({
    setup() {
        let stripes = ref<ColorStop[]>([]);

        const currentStripes = computed(() => {
            return stripes.value.length ? stripes.value : defaultPalette;
        });

        function pos(val: string | number): number {
            return +val * SIZES.newRange / 100; // val * (<new range=89> = 100 - <left=5> - <right=5> - <pin width=1>) / <old range=100>
        }
        function posCircle(val: string | number): string {
            return `${SIZES.leftCircle + pos(val)}%`; // val * (<new range=89> = 100 - <left=5> - <right=5> - <pin width=1>) / <old range=100> + <left=5> + <pin width=1> / 2
        }
        function posPin(val: string | number): string {
            return `${SIZES.left + pos(val)}%`; // val * (<new range=89> = 100 - <left=5> - <right=5> - <pin width=1>) / <old range=100> + <left=5>
        }

        return {
            stripes,
            currentStripes,
            posPin,
            posCircle,
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
