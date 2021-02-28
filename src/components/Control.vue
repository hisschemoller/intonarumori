<template>
  <div class="p-d-flex p-flex-column">
    <Chip
      class="p-mb-3"
    >{{torqueControlFixed}}</Chip>
    <Slider
      :max="127"
      :min="0"
      orientation="vertical"
      v-model="torqueControl"
      class="p-as-center p-mb-2"
    />
    <ToggleButton
      v-model="isEnabled"
      onIcon="pi pi-check"
      offIcon="pi pi-times"
      class="p-mb-5"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Chip from 'primevue/chip';
import Slider from 'primevue/slider';
import ToggleButton from 'primevue/togglebutton';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';
import { MIDIMessageType } from '../app/midi-types';

export default defineComponent({
  components: {
    Chip,
    Slider,
    ToggleButton,
  },
  props: {
    index: {
      default: 0,
      type: Number,
    },
  },
  setup(props) {
    const store = useStore();

    // torque slider control
    const torqueCC = store.state.midiTorqueCCs[props.index];
    const torqueControl = computed({
      get: () => store.state.wheels[props.index].torqueControl,
      set: (value) => store.commit(MutationType.HandleMIDIMessage, {
        type: MIDIMessageType.CONTROL_CHANGE,
        channel: 1,
        data0: torqueCC,
        data1: value,
      }),
    });

    const torqueControlFixed = computed(
      () => store.getters.getTorqueControlFixed(props.index),
    );

    // torque toggle control
    const isEnabledCC = store.state.midiHingeCCs[props.index];
    const isEnabled = computed({
      get: () => store.state.wheels[props.index].hingeControl === 127,
      set: (value) => store.commit(MutationType.HandleMIDIMessage, {
        type: MIDIMessageType.CONTROL_CHANGE,
        channel: 1,
        data0: isEnabledCC,
        data1: value ? 127 : 0,
      }),
    });

    return { isEnabled, torqueControl, torqueControlFixed };
  },
});

</script>

<style scoped>
.p-chip {
  border-radius: 0;
  display: block;
  font-size: 0.8rem;
  padding: 0.2rem 0;
  text-align: center;
  width: 2rem;
}
.p-togglebutton {
  margin: 0 3px;
  padding: 0.2rem 0 !important;
  width: 26px !important;
}
@media screen and (min-width: 480px) {
  .p-chip {
    border-radius: 16px;
    font-size: 0.9rem;
    margin: 0 2px;
    width: 36px;
  }
  .p-togglebutton {
    margin: 0 2px;
    padding: 6px 0 !important;
    width: 2rem !important;
  }
}
</style>
