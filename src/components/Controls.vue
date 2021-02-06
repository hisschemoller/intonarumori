<template>
  <div id="controls">
    <button type="button" @click="toggleSettings(true)"><span class="icon-cog"></span></button>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
import { MutationType } from '../store/mutations';

export default defineComponent({
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
