<template>
  <div class="controls">
    <!-- 1 cx -->
    <input type="range" v-model="cx" min="0.01" max="4" step=".01" />
    <div class="ct-title">cx:</div>
    <input type="text" class="ct-val" v-model="cx" />
    <!-- 2 cy -->
    <input type="range" v-model="cy" min="0.01" max="4" step=".01" />
    <div class="ct-title">cy:</div>
    <input type="text" class="ct-val" v-model="cy" />
    <!-- 3 fr -->
    <input type="range" v-model="fr" min="0.01" max="1" step=".01" />
    <div class="ct-title">fr:</div>
    <input type="text" class="ct-val" v-model="fr" />
    <!-- 4 fx -->
    <input type="range" v-model="fx" min="0.01" max="2" step=".001" />
    <div class="ct-title">fx:</div>
    <input type="text" class="ct-val" v-model="fx" />
    <!-- 5 fy -->
    <input type="range" v-model="fy" min="0.01" max="2" step=".001" />
    <div class="ct-title">fy:</div>
    <input type="text" class="ct-val" v-model="fy" />
    <!-- 6 r -->
    <input type="range" v-model="radius" min="0.01" max="4" step=".01" />
    <div class="ct-title">radius:</div>
    <input type="text" class="ct-val" v-model="radius" />
  </div>
  <div class="sample">
    <svg
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <radialGradient
          id="myGradient"
          :r="radius"
          :cx="cx"
          :cy="cy"
          :fr="fr"
          :fx="fx"
          :fy="fy"
        >
          <stop offset="10%" stop-color="gold" />
          <stop offset="95%" stop-color="red" />
        </radialGradient>
      </defs>

      <!-- using my radial gradient -->
      <circle cx="5" cy="5" r="4" fill="url('#myGradient')" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {},
  data: function () {
    return {
      cx: 0.5,
      cy: 0.5,
      fr: 0.28,
      fx: 0.5,
      fy: 0.5,
      radius: 0.5,
    };
  },
  watch: {
    radius: function radius(v) {
      console.log(`bb ${v}1`);
    },
  },
};
</script>

<style lang="scss">
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

svg {
  width: 300px;
  height: 300px;
}
</style>
