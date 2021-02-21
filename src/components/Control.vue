<template>
  <Slider
    :max="127"
    :min="0"
    orientation="vertical"
    v-model="torqueControl"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Slider from 'primevue/slider';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';
import { MIDIMessageType } from '../app/midi-types';

export default defineComponent({
  components: {
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

    return { torqueControl };
  },
});

</script>
