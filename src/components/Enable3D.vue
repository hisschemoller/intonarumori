<template>
  <div class="canvas-container" ref="canvas-container"></div>
</template>

<script lang="ts">

import { computed, defineComponent, watch } from 'vue';
import { useStore } from '../store';
import setupEnable3d from '../enable3d/enable3d';

let rootEl: HTMLDivElement;

export default defineComponent({
  mounted() {
    rootEl = this.$refs['canvas-container'] as HTMLDivElement;
  },

  setup() {
    const store = useStore();
    let isSetup = false;

    const settingsVisibleRef = computed(() => store.state.isSettingsVisible);
    watch(settingsVisibleRef, () => {
      if (!isSetup) {
        isSetup = true;
        setupEnable3d(rootEl);
      }
    });
    return {};
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
