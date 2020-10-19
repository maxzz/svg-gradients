<template>
    <div>
        <canvas ref="canvas" width="200" height="80" @mousemove="canvasMousemove"></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";

export type ColorStop = {
    stop: number; // [0..1]
    color: string;
};

export default defineComponent({
    props: [ 'stops' ],
    // props: {
    //     stops: {
    //         type: Object,
    //         required: false,
    //         default: () => [ { stop: 0, color: 'red', }, { stop: 1, color: 'gold', }, ]
    //     },
    // },
    setup(props: { stops: ColorStop[] }, { emit } ) { //: Readonly<{ stops: Ref<ColorStop[]> }>

        const canvas = ref<HTMLCanvasElement>(null as any);
        const canvasCtx = ref<CanvasRenderingContext2D>(null as any);

        onMounted(() => {
            canvasCtx.value = canvas.value.getContext('2d');

            console.log('MOUNTED VIEW', props.stops, 'canvas', canvas.value, 'ctx', canvasCtx.value);

            drawStops(canvasCtx.value, props.stops);
        });

        function drawStops(ctx: CanvasRenderingContext2D, stops: ColorStop[]) {
            let w = canvas.value.width;
            let h = canvas.value.height;

            let gr = ctx.createLinearGradient(0, 0, w, 1);

            stops.forEach((_) => gr.addColorStop(_.stop, _.color));
            ctx.fillStyle = gr;
            ctx.fillRect(0, 0, w, h);
        }

        function canvasMousemove(evt: MouseEvent) {
            let pos = evt.offsetX;
            let d = canvasCtx.value.getImageData(pos, 0, 1, 1).data;
            let color = `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3]})`;
            emit('over', { pos, color });
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