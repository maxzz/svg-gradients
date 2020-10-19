<template>
    <div class="palette-editor">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 80"
            class="palette-svg"
            ref="svg"
            @mousedown="onDragPinStart"
            @mousemove="onDragPin"
            @mouseup="onDragPinEnd"
            @mouseleave="onDragPinEnd"
        >
            <defs>
                <linearGradient id="pal">
                    <stop
                        v-for="(stripe, index) of currentStripes"
                        :key="index"
                        :offset="`${stripe.val * 100}%`"
                        :stop-color="stripe.color"
                    />
                </linearGradient>
            </defs>

            <template v-for="(stripe, index) of currentStripes" :key="index">
                <g class="draggable-group">
                    <circle
                        :cx="posCircle(stripe.val)"
                        cy="25"
                        r="6"
                        :fill="stripe.color"
                        stroke-width="1"
                        stroke="black"
                    />
                    <rect
                        :x="`${posPin(stripe.val)}`"
                        y="31"
                        width=".5%"
                        height="40"
                        fill="black"
                    />
                    <!-- 31 = <circle y=25> + <circle r=6> -->
                </g>
            </template>

            <rect x="5%" y="50%" width="90%" height="40%" fill="url(#pal)" />
        </svg>

        <canvas ref="canvas" width="200" height="80" @mousemove="canvasMousemove"></canvas>

        <PaletteView :stops="[ { stop: 0, color: 'red', }, { stop: 1, color: 'gold', }, ]" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch, watchEffect } from "vue";
import PaletteView from "./PaletteView.vue";

type ColorStop = {
    val: number; // [0..1]
    color: string;
};

const enum SIZES {
    pinWidth = 0.5, // in percents; should be matched with html
    left = 5,
    leftCircle = left + pinWidth / 2,
    right = 5,
    newRange = 100 - left - right - pinWidth,
    oldRange = 100,
}

const defaultPalette: ColorStop[] = [
    {
        val: 0,
        color: "red",
    },
    {
        val: .5,
        color: "blue",
    },
    {
        val: .6,
        color: "blue",
    },
    {
        val: .6,
        color: "green",
    },
    {
        val: 1,
        color: "gold",
    },
];

type colorStop = {
    stop: number; // [0..1]
    color: string;
};

function GradientReader(colorStops: colorStop[]) {

    let canvas = document.createElement('canvas');     // create canvas element
    let ctx = canvas.getContext('2d')!;                // get context
    let gr = ctx.createLinearGradient(0, 0, 101, 0);   // create a gradient

    canvas.width = 101;                                // 101 pixels incl.
    canvas.height = 1;                                 // as the gradient

    for (let i = 0, cs; cs; cs = colorStops[i++]) {    // add color stops
        gr.addColorStop(cs.stop, cs.color);
    }

    ctx.fillStyle = gr;                                // set as fill style
    ctx.fillRect(0, 0, 101, 1);                        // draw a single line

    // method to get color of gradient at % position [0, 100]
    this.getColor = function(pst: number) {
        return ctx.getImageData(pst | 0, 0, 1, 1).data;
    };
}

function useDragSvg(svg: Ref<SVGSVGElement>) {

    function getMousePosition(svg: SVGSVGElement, evt: MouseEvent) {
        var CTM = svg.getScreenCTM()!;

        if (((evt as any) as TouchEvent).touches) {
            evt = (((evt as any) as TouchEvent).touches[0] as any) as MouseEvent;
        }

        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d,
        };
    }

    let selectedElement: SVGGraphicsElement, offset: {x: number, y: number}, transform: SVGTransform;

    function initialiseDragging(svg: SVGSVGElement, evt: MouseEvent) {
        offset = getMousePosition(svg, evt);
        // Make sure the first transform on the element is a translate transform
        var transforms = selectedElement.transform.baseVal;
        if ((transforms as any).length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            // Create an transform that translates by (0, 0)
            var translate = svg.createSVGTransform();
            translate.setTranslate(0, 0);
            selectedElement.transform.baseVal.insertItemBefore(translate, 0);
        }
        // Get initial translation
        transform = transforms.getItem(0);
        offset.x -= transform.matrix.e;
        offset.y -= transform.matrix.f;
    }

    function onDragPinStart(evt: MouseEvent) {
        //event.target && ((event.target as HTMLElement).style.opacity = '.5');

        if ((evt.target as HTMLElement)?.classList.contains("draggable")) {
            selectedElement = evt.target as SVGGraphicsElement;
            initialiseDragging(svg.value, evt);
            console.log("drag start", svg.value);
        } else if (((evt.target as Node)?.parentNode as HTMLElement)?.classList.contains("draggable-group")) {
            selectedElement = (evt.target as Node)?.parentNode as SVGGraphicsElement;
            initialiseDragging(svg.value, evt);
            console.log("drag start", svg.value);
        }
    }
    function onDragPin(evt: MouseEvent) {
        if (selectedElement) {
            evt.preventDefault();
            var coord = getMousePosition(svg.value, evt);
            //transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
            transform.setTranslate(coord.x - offset.x, 0);

            console.log("drag", coord.x, offset.x, coord.x - offset.x);
        }
    }
    function onDragPinEnd(evt: MouseEvent) {
        if (selectedElement) {
            console.log("drag end");
            selectedElement = null as any;
        }
    }

    return {
        onDragPinStart,
        onDragPin,
        onDragPinEnd,
    };
}

export default defineComponent({
    components: { PaletteView },
    setup() {
        let stripes = ref<ColorStop[]>([]);

        const currentStripes = computed(() => {
            return stripes.value.length ? stripes.value : defaultPalette;
        });

        const pos = (val: string | number): number => (+val * SIZES.newRange) / SIZES.oldRange;
        const posCircle = (val: number): string => `${SIZES.leftCircle + pos(val * 100)}%`;
        const posPin = (val: number): string => `${SIZES.left + pos(val * 100)}%`;

        const svg = ref<SVGSVGElement>(null as any);
        const { onDragPinStart, onDragPinEnd, onDragPin } = useDragSvg(svg);

        const canvas = ref<HTMLCanvasElement>(null as any);
        const canvasCtx = ref<CanvasRenderingContext2D>(null as any);

        onMounted(() => {
            canvasCtx.value = canvas.value.getContext('2d');

            console.log('mounted', currentStripes.value, 'canvas', canvas.value, 'ctx', canvasCtx.value);

            drawStripes(canvasCtx.value, currentStripes.value);

            // let ctx = canvasCtx.value;
            // let w = canvas.value.width;
            // let h = canvas.value.height;

            // ctx.beginPath();
            // ctx.rect(0, 0, w, h);
            // ctx.stroke();

            //drawStripes(ctx);
        });

        function drawStripes(ctx: CanvasRenderingContext2D, stripes: ColorStop[]) {
            console.log('draw');

            let w = canvas.value.width;
            let h = canvas.value.height;

            let gr = ctx.createLinearGradient(0, 0, w, 1);

            stripes.forEach((_) => gr.addColorStop(_.val, _.color));
            ctx.fillStyle = gr;
            ctx.fillRect(0, 40, w, h);

            ctx.beginPath();
            ctx.rect(0, 0, 20, 20);
            ctx.fillStyle = currentColor.value;
            ctx.fill();
        }

        watchEffect(() => {
            //console.log('watchEffect', currentStripes.value, 'canvas', canvas.value, 'ctx', canvasCtx.value);

            if (canvasCtx.value) {
                drawStripes(canvasCtx.value, currentStripes.value);
            }
        });

        // watch(currentStripes, () => {
        //     console.log('WATCH currentStripes', currentStripes.value, 'canvas', canvas.value, 'ctx', canvasCtx.value);
        // });

        // watch(stripes, () => {
        //     console.log('WATCH stripes', currentStripes.value, 'canvas', canvas.value, 'ctx', canvasCtx.value);
        // });

        // watch(canvas, () => {
        //     console.log('WATCH canvas', currentStripes.value, 'canvas', canvas.value, 'ctx', canvasCtx.value);
        // });

        // watch(canvasCtx, () => {
        //     console.log('WATCH canvasCtx', currentStripes.value, 'canvas', canvas.value, 'ctx', canvasCtx.value);
        // });

        let currentPos = ref<number>(0);
        let currentColor = ref<string>('');

        function canvasMousemove(evt: MouseEvent) {

            currentPos.value = evt.offsetX;

            let data = canvasCtx.value.getImageData(evt.offsetX, 50, 1, 1).data;

            currentColor.value = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`;

            drawStripes(canvasCtx.value, currentStripes.value);

            console.log('mousemove', evt.offsetX, evt.offsetY, data, currentColor.value);
        }

        return {
            stripes,
            currentStripes,

            posPin,
            posCircle,

            onDragPinStart,
            onDragPinEnd,
            onDragPin,

            canvasMousemove,

            svg,
            canvas,
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
