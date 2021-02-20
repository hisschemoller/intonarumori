<template>
  <Sidebar
    position="bottom"
    v-model:visible="isVisible"
  >
    Content
  </Sidebar>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Sidebar from 'primevue/sidebar';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';

export default defineComponent({
  components: {
    Sidebar,
  },
  setup() {
    const store = useStore();

    // controls sidebar
    const isVisible = computed({
      get: () => store.state.isControlsVisible,
      set: (value) => store.commit(MutationType.ToggleControls, value),
    });

    return { isVisible };
  },
});

</script>
