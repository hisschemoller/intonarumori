<template>
  <div class="p-d-flex p-flex-wrap-reverse p-jc-center">
    <div
      class="pad"
      v-for="(bumper, index) in bumpers"
      :key="index"
      @mousedown="onMouseEvent(index, 100)"
      @mouseup="onMouseEvent(index, 0)">
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';

export default defineComponent({
  setup() {
    const store = useStore();
    const numPads = store.state.bumpers.length;

    document.addEventListener('keydown', (e) => {
      const padIndex: number = e.key.charCodeAt(0) - 49;
      if (padIndex >= 0 && padIndex < numPads) {
        store.commit(
          MutationType.TriggerNote, { padIndex, velocity: 100 },
        );
      }
    });

    document.addEventListener('keyup', (e) => {
      const padIndex: number = e.key.charCodeAt(0) - 49;
      if (padIndex >= 0 && padIndex < numPads) {
        store.commit(
          MutationType.TriggerNote, { padIndex, velocity: 0 },
        );
      }
    });

    const onMouseEvent = (padIndex: number, velocity: number) => {
      store.commit(
        MutationType.TriggerNote, { padIndex, velocity },
      );
    };

    return {
      bumpers: computed(() => store.state.bumpers),
      onMouseEvent,
    };
  },
});
</script>

<style scoped>
  .pad {
    background-color: var(--blue-100);
    border: 2px solid #fff;
    cursor: pointer;
    display: flex;
    height: 70px;
    text-align: center;
    width: 25%;
  }
</style>
