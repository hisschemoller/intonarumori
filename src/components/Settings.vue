<template>
<Dialog header="Intonarumori 1" v-model:visible="isVisible">
  <div class="p-text-left">Eight wheels spin at different speeds to create forever changing
    patterns. Connect a MIDI controller via USB or Bluetooth below. Read the <a
    href="https://github.com/hisschemoller/intonarumori/blob/master/README.md" target="_blank">user
    guide online</a>.
  </div>
  <div class="p-grid">
    <div class="p-col-12 p-sm-6 p-d-flex p-flex-column">
      <div class="subheader">Bluetooth</div>
      <Button @click="connectBLE">Connect...</Button>
      <div class="status">{{ bluetoothMessage }}</div>
    </div>
    <div class="p-col-12 p-sm-6 p-d-flex p-flex-column">
      <div class="subheader">MIDI</div>
      <Dropdown
        :options="midiInputNames"
        placeholder="No input selected..."
        v-model="midiSelectedInput"
      ></Dropdown>
      <div class="status">Status</div>
    </div>
    <!-- <div class="p-col-12 p-d-flex p-ai-center">
      <Button @click="reset" class="p-mr-2">Reset</Button>
      Clear all data and start fresh.
    </div> -->
  </div>
  <template #footer>
    <Button label="Close" icon="pi pi-check" autofocus @click="isVisible = false" />
  </template>
</Dialog>
</template>

<script lang="ts">

import { computed, defineComponent } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';
import { BluetoothStatus, connect as connectBluetooth } from '../app/bluetooth';

export default defineComponent({
  components: {
    Button,
    Dialog,
    Dropdown,
  },
  setup() {
    const store = useStore();

    // settings panel
    const isVisible = computed({
      get: () => store.state.isSettingsVisible,
      set: (value) => store.commit(MutationType.ToggleSettings, value),
    });

    // midi inputs
    const midiInputNames = computed(() => store.state.midiInputs);
    const midiSelectedInput = computed({
      get: () => store.state.midiSelectedInput,
      set: (value) => store.commit(MutationType.SelectMIDIInput, value),
    });

    // bluetooth
    const connectBLE = () => {
      connectBluetooth();
    };
    const bluetoothMessage = computed(() => {
      switch (store.state.bluetoothStatus) {
        case BluetoothStatus.Connecting: return 'Connecting...';
        case BluetoothStatus.Connected: return 'Bluetooth connected!';
        case BluetoothStatus.Disconnected: return 'Bluetooth disconnected.';
        case BluetoothStatus.Error: return 'Bluetooth error!';
        default: return 'Not connected';
      }
    });

    // reset
    // const reset = () => {
    //   store.commit(MutationType.Reset, undefined);
    // };

    return {
      bluetoothMessage,
      connectBLE,
      isVisible,
      midiInputNames,
      midiSelectedInput,
      // reset,
    };
  },
});

</script>

<style>
.p-dialog {
  max-width: 500px;
}
.p-grid .p-dropdown-panel .p-dropdown-items .p-dropdown-item,
.p-dropdown .p-inputtext {
  padding-bottom: 0.65rem;
  padding-top: 0.65rem;
}
#app .p-dialog-title {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 400;
}
.subheader {
  color: var(--primary-color);
  margin: 10px 0 10px 0;
}
.status {
  color: var(--bluegray-500);
  margin-top: 10px;
}
@media screen and (min-width: 576px) {
  .subheader {
    margin-top: 20px;
  }
}
</style>
