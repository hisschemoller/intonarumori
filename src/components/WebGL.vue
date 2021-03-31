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
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  top: 0;
}
</style>
