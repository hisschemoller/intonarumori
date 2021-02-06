<template>
<div id="settings" class="dialog" v-show="showSettings">
  <div class="dialog__layer" @click="hideSettings"></div>
  <div class="dialog__window">
    <div class="dialog__header">
      <h1 class="dialog__header-title">App Settings</h1>
    </div>
    <div class="dialog__viewport">
      <div class="dialog__content">
        <p>App settings in this panel.</p>
        <div class="settings__section">
          <div class="settings__section-left">
            <div class="settings__section-header">Bluetooth</div>
            <button type="button" class="btn ble-connect">Connect...</button>
            <div class="settings__status ble-status">Not connected</div>
          </div>
          <div class="settings__section-right">
            <div class="settings__section-header">MIDI</div>
            <select class="midiin-select">
              <option value="null">No input selected...</option>
            </select>
            <div class="settings__status midiin-status"></div>
          </div>
        </div>
        <div class="settings__section">
          <button type="button" class="btn btn-reset">Reset</button>
          <span class="settings__btn_description">Clear all data and start fresh.</span>
        </div>
      </div>
    </div>
    <div class="dialog__controls">
      <div class="settings__section">
        <div class="settings__section-left">
          <div></div>
        </div>
        <div class="settings__section-right">
          <button type="button" class="btn dialog__resolve" @click="hideSettings">Close</button>
        </div>
      </div>
    </div>
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
    const hideSettings = () => {
      store.commit(MutationType.ToggleSettings, false);
    };
    const showSettings = computed(() => store.state.isSettingsVisible);
    return { hideSettings, showSettings };
  },
});

</script>

<style>
#settings .dialog__window {
  width: 500px;
}
.settings__section {
  align-items: baseline;
  border-top: 1px solid var(--color-darkest);
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0 0 0;
  padding-top: 10px;
  width: 100%;
}
.settings__section-left,
.settings__section-right {
  flex-basis: 50%;
  min-width: 200px;
}
.settings__section-right select {
  border: 1px solid var(--color-darkest);
  border-radius: 0;
  background-color: transparent;
  font-size: 16px;
  -moz-appearance: none;
  padding: 8px 16px;
}
.settings__section-header {
  margin: 10px 0;
}
.settings__status {
  color: var(--color-mid);
  margin-top: 10px;
}
.settings__section .btn {
  margin-right: 10px;
}
.settings__btn_description {
  margin-top: 10px;
}
</style>
