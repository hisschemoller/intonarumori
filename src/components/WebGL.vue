<template>
  <div class="canvas-container" ref="canvas-container"></div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import setupWebGL from '../world/webgl';
import { setup as setupPhysics } from '../world/physics';

export default defineComponent({
  mounted() {
    const rootEl = this.$refs['canvas-container'] as HTMLDivElement;
    setupPhysics().then((physicsWorld) => {
      setupWebGL(rootEl, physicsWorld);
    });
  },
});

</script>

<style scoped>
.canvas-container {
  right: 0;
  position: absolute;
  top: 0;
  z-index: -1;
}
</style>
