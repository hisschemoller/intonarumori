<template>
  <div class="p-d-flex p-flex-column">
    <Chip
      class="p-mb-2"
    >{{torqueControlFixed}}</Chip>
    <Slider
      :max="127"
      :min="0"
      orientation="vertical"
      v-model="torqueControl"
      class="p-as-center"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Chip from 'primevue/chip';
import Slider from 'primevue/slider';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';
import { MIDIMessageType } from '../app/midi-types';

export default defineComponent({
  components: {
    Chip,
    Slider,
  },
  props: {
    id: String,
  },
  setup(props) {
    const store = useStore();

    // torque slider control
    const torqueControl = computed({
      get: () => store.state.wheels.byId[props.id as string].torqueControl,
      set: (value) => store.commit(MutationType.HandleMIDIMessage, {
        type: MIDIMessageType.CONTROL_CHANGE,
        channel: 1,
        data0: parseInt(props.id as string, 10),
        data1: value,
      }),
    });

    const torqueControlFixed = computed(
      () => store.getters.getTorqueControlFixed(props.id as string),
    );

    return { torqueControl, torqueControlFixed };
  },
});

</script>

<style scoped>
.p-chip {
  display: block;
  font-size: 0.9rem;
  padding: 0.2rem 0;
  text-align: center;
  width: 50px;
}
</style>
