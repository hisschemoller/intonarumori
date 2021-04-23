<template>
  <div class="canvas-container" ref="canvas-container"></div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import setupEnable3d from '../enable3d/enable3d';

export default defineComponent({
  mounted() {
    const rootEl = this.$refs['canvas-container'] as HTMLDivElement;
    setupEnable3d(rootEl);
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
