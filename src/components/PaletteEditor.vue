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
                <circle :cx="posCircle(stripe.val)" cy="25" r="6" :fill="stripe.color" stroke-width="1" stroke="black"
                    @mousedown="onMouseDown"
                    @mouseup="onMouseUp"
                    @mouseover="onMouseOver"
                />
                <rect :x="`${posPin(stripe.val)}`" y="31" width=".5%" height="40" fill="black" /> <!-- <circle y=25> + <circle r=6> -->
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
    pinWidth = .5, // in percents; should be matched with html
    left = 5,
    leftCircle = left + pinWidth / 2,
    right = 5,
    newRange = 100 - left - right - pinWidth,
    oldRange = 100,
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

        const pos = (val: string | number): number => +val * SIZES.newRange / SIZES.oldRange;
        const posCircle = (val: string | number): string => `${SIZES.leftCircle + pos(val)}%`;
        const posPin = (val: string | number): string => `${SIZES.left + pos(val)}%`;

        function onMouseDown(ev: MouseEvent) {
            console.log('d');
        }
        function onMouseUp(ev: MouseEvent) {
            console.log('u');
        }
        function onMouseOver(ev: MouseEvent) {
            console.log('o');
        }

        return {
            stripes,
            currentStripes,
            
            posPin,
            posCircle,

            onMouseDown,
            onMouseUp,
            onMouseOver,
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
