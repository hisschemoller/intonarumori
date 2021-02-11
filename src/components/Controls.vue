<template>
  <div id="controls">
    <Button
      type="button"
      @click="toggleSettings(true)"
      class="p-button-lg p-component p-button-icon-only p-button-rounded p-button-text">
      <i class="pi pi-cog"></i>
    </Button>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
import Button from 'primevue/button';
import { MutationType } from '../store/mutations';

export default defineComponent({
  components: {
    Button,
  },
  methods: {
    ...mapMutations({
      toggleSettings: MutationType.ToggleSettings,
    }),
  },
});

</script>

<style scoped>
#controls {
  right: 0;
  position: absolute;
  top: 0;
}
#controls button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  outline: none;
  padding: 10px;
  position: absolute;
  right: 20px;
  top: 20px;
}
</style>
