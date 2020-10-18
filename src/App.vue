<template>
    <RadialGradientEditor />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RadialGradientEditor from "./components/RadialGradientEditor.vue";

export default defineComponent({
    name: "App",
    components: {
        RadialGradientEditor,
    },
});
</script>

<style lang="scss">
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    color: #2c3e50;
}
</style>
