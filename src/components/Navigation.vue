<template>
  <ToolBar>
    <template #right>
      <Button
        @click="toggleControls(true)"
        class="p-button p-button-icon-only p-button-rounded p-button-text">
        <i class="pi pi-sliders-v"></i>
      </Button>
      <Button
        @click="toggleSettings(true)"
        class="p-button p-button-icon-only p-button-rounded p-button-text">
        <i class="pi pi-cog"></i>
      </Button>
    </template>
  </ToolBar>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';
import ToolBar from 'primevue/toolbar';
import Button from 'primevue/button';
import { MutationType } from '../store/mutations';

export default defineComponent({
  components: {
    Button,
    ToolBar,
  },
  methods: {
    ...mapMutations({
      toggleControls: MutationType.ToggleControls,
      toggleSettings: MutationType.ToggleSettings,
    }),
  },
});

</script>

<style scoped>
body .p-toolbar {
  background-color: transparent;
}
</style>
