<template>
    <div>
        <canvas ref="canvas" @mousemove="canvasMousemove" style="width: 300px; height: 20px;" ></canvas>
        <!-- <canvas ref="canvas" width="200" height="80" @mousemove="canvasMousemove" @resize="canvasResize" style="display: block; width: 100px; height: 20px;" ></canvas> -->
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, PropType } from "vue";

export type ColorStop = {
    stop: number; // [0..1]
    color: string;
};

declare var ResizeObserver;

export default defineComponent({
    //props: [ 'stops' ],
    props: {
        stops: {
            type: Object as PropType<ColorStop[]>,
            // type: Array as () => ColorStop[],
            required: false,
            default: () => [ { stop: 0, color: 'green', }, { stop: 1, color: 'gold', }, ]
        },
    },
    setup(props: { stops: ColorStop[] }, { emit } ) { //: Readonly<{ stops: Ref<ColorStop[]> }>

        const canvas = ref<HTMLCanvasElement>(null as any);
        const canvasCtx = ref<CanvasRenderingContext2D>(null as any);

        onMounted(() => {
            canvasCtx.value = canvas.value.getContext('2d');

            console.log('MOUNTED VIEW', props.stops, 'canvas', canvas.value, 'ctx', canvasCtx.value);

            drawStops(canvasCtx.value, props.stops);

            let ro = new ResizeObserver(entries => {
                console.log('observe');
                canvasResize();
            });
            ro.observe(canvas.value);
        });

        function canvasResize() {
            // 0. resizeCanvasToDisplaySize: look up the size the canvas is being displayed and if it's resolution does not match change it.
            if (!canvas.value) {
                return;
            }

            const width = canvas.value.clientWidth;
            const height = canvas.value.clientHeight;

            if (canvas.value.width !== width || canvas.value.height !== height) {
                canvas.value.width = width;
                canvas.value.height = height;

                console.log('VIEW redraw'); //TODO: color should be detected on a separate canvas to avoid stretch issues.

                drawStops(canvasCtx.value, props.stops);
            }
        }

        function drawStops(ctx: CanvasRenderingContext2D, stops: ColorStop[]) {
            let w = canvas.value.width;
            let h = canvas.value.height;

            let gr = ctx.createLinearGradient(0, 0, w, 1);

            stops.forEach((_) => gr.addColorStop(_.stop, _.color));
            ctx.fillStyle = gr;
            ctx.fillRect(0, 0, w, h);
        }

        function canvasMousemove(evt: MouseEvent) {
            let x = Math.abs(evt.offsetX); // to avoid -0
            let d = canvasCtx.value.getImageData(x, 0, 1, 1).data;
            let color = `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3]})`;

            let pos = Math.ceil( x / canvas.value.width * 100);
            emit('over', { pos, color, x });
        }

        return {
            canvas,
            canvasMousemove,
        };
    },
});
</script>

<style scoped>
</style>