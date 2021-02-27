<template>
  <Sidebar
    v-model:visible="isVisible"
    :dismissable="false"
    :modal="false"
    position="bottom"
  >
    <div class="p-d-flex p-jc-center">
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
import { computed, defineComponent } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';
import Control from './Control.vue';

export default defineComponent({
  components: {
    Control,
    Sidebar,
  },
  setup() {
    const store = useStore();

    // controls sidebar
    const isVisible = computed({
      get: () => store.state.isControlsVisible,
      set: (value) => store.commit(MutationType.ToggleControls, value),
    });

    // controls
    const { wheels } = store.state;

    return { isVisible, wheels };
  },
});

</script>

<style scoped>
.p-sidebar-bottom {
  height: 12rem;
}
</style>
