<template>
<Dialog header="App Settings" v-model:visible="isVisible">
  <div class="p-text-left">App settings in this panel.</div>
  <div class="section">
    <div class="section-left">
      <div class="section-header">Bluetooth</div>
      <Button @click="connectBLE" class="p-button-lg" style="width: 100%;">Connect...</Button>
      <div class="status">{{ bluetoothMessage }}</div>
    </div>
    <div class="section-right">
      <div class="section-header">MIDI</div>
      <Dropdown
        :options="midiInputNames"
        placeholder="No input selected..."
        v-model="midiSelectedInput"
        style="width: 100%;"
      ></Dropdown>
      <div class="status">Status</div>
    </div>
  </div>
  <div class="section">
      <Button @click="reset" class="p-mr-2">Reset</Button>
      Clear all data and start fresh.
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
    // const selectMIDIInput = (name: string) => {
    //   store.commit(MutationType.SelectMIDIInput, name);
    // };
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
    const reset = () => {
      store.commit(MutationType.Reset, undefined);
    };

    return {
      bluetoothMessage,
      connectBLE,
      isVisible,
      midiInputNames,
      midiSelectedInput,
      reset,
    };
  },
});

</script>

<style scoped>
/* #settings .dialog__window {
  width: 500px;
} */
.section {
  align-items: baseline;
  /* border-top: 1px solid var(--color-darkest); */
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0 0 0;
  padding-top: 10px;
  width: 100%;
}
.section-left {
  flex-basis: 48%;
  padding-right: 4%;
  min-width: 200px;
}
.section-right {
  flex-basis: 48%;
  min-width: 200px;
}
/* .settings__section-right select {
  border: 1px solid var(--color-darkest);
  border-radius: 0;
  background-color: transparent;
  font-size: 16px;
  -moz-appearance: none;
  padding: 8px 16px;
} */
.section-header {
  font-weight: 700;
  margin: 10px 0;
}
.status {
  color: var(--color-mid);
  margin-top: 10px;
}
/* .settings__section .btn {
  margin-right: 10px;
}
.settings__btn_description {
  margin-top: 10px;
} */
</style>
