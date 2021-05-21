<template>
  <ToolBar>
    <template #right>
      <Button
        @click="toggleControls"
        class="p-button p-button-icon-only p-button-rounded p-button-text">
        <i class="pi pi-sliders-v"></i>
      </Button>
      <Button
        @click="toggleSettings"
        class="p-button p-button-icon-only p-button-rounded p-button-text">
        <i class="pi pi-cog"></i>
      </Button>
    </template>
  </ToolBar>
</template>

<script lang="ts">

import { computed, defineComponent } from 'vue';
import { mapMutations } from 'vuex';
import ToolBar from 'primevue/toolbar';
import Button from 'primevue/button';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';

export default defineComponent({
  components: {
    Button,
    ToolBar,
  },
  // methods: {
  //   ...mapMutations({
  //     toggleControls: MutationType.ToggleControls,
  //     toggleSettings: MutationType.ToggleSettings,
  //   }),
  // },
  setup() {
    const store = useStore();

    // const toggleControls = computed({
    //   get: () => store.state.isControlsVisible,
    //   set: () => store.commit(MutationType.ToggleControls, !store.state.isControlsVisible),
    // });

    const toggleControls = () => store.commit(
      MutationType.ToggleControls, !store.state.isControlsVisible,
    );

    const toggleSettings = () => store.commit(
      MutationType.ToggleSettings, !store.state.isSettingsVisible,
    );

    // const toggleSettings = computed({
    //   get: () => store.state.isSettingsVisible,
    //   set: () => store.commit(MutationType.ToggleSettings, !store.state.isSettingsVisible),
    // });

    return { toggleControls, toggleSettings };
  },
});

</script>

<style scoped>
body .p-toolbar {
  background-color: transparent;
}
</style>
