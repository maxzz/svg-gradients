<template>
    <div class="sample">
        <svg
            viewBox="0 0 10 10"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            class="main-svg"
        >
            <defs>
                <radialGradient
                    id="myGradient"
                    :fx="defs.fx.value"
                    :fy="defs.fy.value"
                    :fr="defs.fr.value"
                    :cx="defs.cx.value"
                    :cy="defs.cy.value"
                    :r="defs.r.value"
                >
                    <stop offset="0%" stop-color="gold" />
                    <stop offset="10%" stop-color="gold" />

                    <stop offset="10%" stop-color="green" />
                    <stop offset="30%" stop-color="green" />

                    <stop offset="30%" stop-color="black" />
                    <stop offset="40%" stop-color="black" />

                    <stop offset="40%" stop-color="red" />
                    <stop offset="100%" stop-color="red" />
                </radialGradient>
            </defs>

            <!-- using my radial gradient -->
            <circle cx="5" cy="5" r="4" fill="url('#myGradient')" />
        </svg>

        <div class="controls">
            <template v-for="(def, key) of defs" :key="key">
                <input
                    type="range"
                    v-model="def.value"
                    :min="def.min"
                    :max="def.max"
                    :step="def.step"
                />
                <div class="ct-title">{{ def.label }}</div>
                <input type="text" class="ct-val" v-model="def.value" />
            </template>
        </div>

        <PaletteEditor />
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import PaletteEditor from "./PaletteEditor.vue";

export default defineComponent({
    components: { PaletteEditor },
    data: function () {
        return {};
    },
    setup() {
        type SliderValue = {
            label: string;
            value: number;
            min: number;
            max: number;
            step: number;
        };

        type Sliders = {
            cx: SliderValue;
            cy: SliderValue;
            r: SliderValue;
            fx: SliderValue;
            fy: SliderValue;
            fr: SliderValue;
        };

        let defs = reactive<Sliders>({
            fx: {
                label: "fx",
                value: 0.811,
                min: 0.01,
                max: 2,
                step: 0.001,
            },
            fy: {
                label: "fy",
                value: 0.53,
                min: 0.01,
                max: 2,
                step: 0.001,
            },
            fr: {
                label: "fr",
                value: 0.01,
                min: 0.01,
                max: 1,
                step: 0.01,
            },
            cx: {
                label: "cx",
                value: 0.06,
                min: 0.01,
                max: 4,
                step: 0.01,
            },
            cy: {
                label: "cy",
                value: 0.56,
                min: 0.01,
                max: 4,
                step: 0.01,
            },
            r: {
                label: "r",
                value: 0.84,
                min: 0.01,
                max: 4,
                step: 0.01,
            },
        });

        return {
            defs,
        };
    },
});
</script>

<style lang="scss">
.sample {
    text-align: center;
}

.controls {
    display: grid;
    justify-content: center;
    justify-items: center;
    gap: 0.4em 1em;
    grid-template-columns: 120px min-content 40px;

    .ct-title {
        justify-self: center;
    }

    .ct-val {
        width: 3em;
        text-align: center;
    }
}

.main-svg {
    width: 300px;
    height: 300px;
    background-color: tomato;
}
</style>
