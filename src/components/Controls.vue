<template>
  <Sidebar
    v-model:visible="isVisible"
    :dismissable="false"
    :modal="false"
    position="bottom"
  >
    <div class="p-d-flex p-jc-center">
      <TabView>
        <TabPanel header="Controls">
          <div class="p-d-flex p-jc-center">
          </div>
        </TabPanel>
        <TabPanel header="Sounds">
            <Listbox
              :options="audioData"
              optionLabel="title"
              v-model="audioDataIndex"
            />
        </TabPanel>
      </TabView>
    </div>
  </Sidebar>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import Sidebar from 'primevue/sidebar';
import Listbox from 'primevue/listbox';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';

export default defineComponent({
  components: {
    Listbox,
    Sidebar,
    TabPanel,
    TabView,
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
    const { audioData } = toRefs(store.state);

    return {
      audioData, audioDataIndex, isVisible,
    };
  },
});

</script>

<style>
#app .p-sidebar-bottom {
  height: 18rem;
}
#app .p-tabview {
  width: 286px;
}
#app .p-tabview-panels {
  padding-left: 0;
  padding-right: 0;
}
#app .p-listbox-item {
  padding-bottom: 0.7rem;
  padding-top: 0.7rem;
}
</style>
