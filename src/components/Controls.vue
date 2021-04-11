<template>
  <div class="p-d-flex p-jc-center p-pt-4">
    <TabView>
      <TabPanel header="Pads">
        <Pads />
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
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import Listbox from 'primevue/listbox';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';
import Pads from './Pads.vue';

export default defineComponent({
  components: {
    Listbox,
    Pads,
    TabPanel,
    TabView,
  },
  setup() {
    const store = useStore();

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
      audioData, audioDataIndex,
    };
  },
});

</script>

<style>
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
