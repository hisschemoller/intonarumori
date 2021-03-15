<template>
  <Sidebar
    v-model:visible="isVisible"
    :dismissable="false"
    :modal="false"
    position="bottom"
  >
    <div class="p-d-flex p-jc-center">
      <Listbox
        :options="audioData"
        optionLabel="title"
        v-model="audioDataIndex"
      />
      <Control
        v-for="(wheel, index) in wheels"
        :key="index"
        :index="index"
        class="p-ml-0 p-mr-0 p-flex-column"
      />
    </div>
  </Sidebar>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import Sidebar from 'primevue/sidebar';
import Listbox from 'primevue/listbox';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';
import Control from './Control.vue';

export default defineComponent({
  components: {
    Control,
    Listbox,
    Sidebar,
  },
  setup() {
    const store = useStore();

    // controls sidebar
    const isVisible = computed({
      get: () => store.state.isControlsVisible,
      set: (value) => store.commit(MutationType.ToggleControls, value),
    });

    // audioData
    const audioDataIndex = computed({
      get: () => store.state.audioData[store.state.audioDataIndex],
      set: (value) => store.commit(
        MutationType.SetSelectedSoundset, store.state.audioData.indexOf(value),
      ),
    });

    // audioData, controls
    const { audioData, wheels } = toRefs(store.state);

    return {
      audioData, audioDataIndex, isVisible, wheels,
    };
  },
});

</script>

<style scoped>
.p-sidebar-bottom {
  height: 15rem;
}
</style>
