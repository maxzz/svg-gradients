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
                <circle :cx="`${+stripe.val + 5}%`" cy="20" r="5%" />
                <rect :x="`${stripe.val}%`" y="0" width="2" height="40" fill="red" />
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

const defaultPalette = [
    {
        val: "0",
        color: "red",
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

        return {
            stripes,
            currentStripes,
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
