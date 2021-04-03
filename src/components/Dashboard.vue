<template>
  <div class="dashboard">
    <div class="dashboard-main">
      <slot name="main"></slot>
    </div>
    <div
      class="dashboard-sidebar"
      :class="{ show: isVisible }"
      >
      <slot name="sidebar"></slot>
      <Button
        class="dashboard-sidebar-close p-button p-button-icon-only p-button-rounded p-button-text"
        @click="isVisible = false">
        <i class="pi pi-times"></i>
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Button from 'primevue/button';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';

export default defineComponent({
  components: {
    Button,
  },
  setup() {
    const store = useStore();

    const isVisible = computed({
      get: () => store.state.isControlsVisible,
      set: (value) => store.commit(MutationType.ToggleControls, value),
    });

    return {
      isVisible,
    };
  },
});
</script>

<style scoped>
  .dashboard {
    bottom: 0;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: -1;
  }
  .dashboard-main {
    flex-basis: auto;
    flex-grow: 1;
    position: relative;
  }
  .dashboard-sidebar {
    flex-grow: 0;
    height: 0;
    position: relative;
    transition: height 0.2s ease-out;
  }
  .dashboard-sidebar.show {
    height: 18rem;
    transition: height 0.2s ease-in;
  }
  .dashboard-sidebar-close {
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
</style>
