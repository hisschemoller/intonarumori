import { MutationTree } from 'vuex';
import { State } from './state';
import { MIDIMessage, MIDIMessageType } from '../app/midi-types';

export enum MutationType {
  HandleMIDIMessage = 'HANDLE_MIDI_MESSAGE',
  Initialise = 'INITIALISE',
  PlaySound = 'PLAY_SOUND',
  Reset = 'RESET',
  SelectMIDIInput = 'SELECT_MIDI_INPUT',
  SetBluetoothStatus = 'SET_BLUETOOTH_STATUS',
  ToggleControls = 'TOGGLE_CONTROLS',
  ToggleSettings = 'TOGGLE_SETTINGS',
  UpdateMIDIPorts = 'UPDATE_MIDI_PORTS',
}

export type Mutations = {
  [MutationType.HandleMIDIMessage](state: State, message: MIDIMessage): void;
  [MutationType.Initialise](state: State): void;
  [MutationType.PlaySound](state: State, message: MIDIMessage): void;
  [MutationType.Reset](state: State): void;
  [MutationType.SelectMIDIInput](state: State, name: string): void;
  [MutationType.SetBluetoothStatus](state: State, status: number): void;
  [MutationType.ToggleControls](state: State, isVisible: boolean): void;
  [MutationType.ToggleSettings](state: State, isVisible: boolean): void;
  [MutationType.UpdateMIDIPorts](state: State, midiInputs: string[]): void;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.HandleMIDIMessage](state, message) {
    const { type, data0, data1 } = message;
    if (type === MIDIMessageType.CONTROL_CHANGE
      && state.wheels.allIds.includes(data0.toString())) {
      state.wheels.byId[data0.toString()].torqueControl = data1;
    }
  },
  [MutationType.Initialise](state) {
    state.wheels.allIds = state.midiControllers.map((value) => value.toString());
    state.wheels.byId = state.midiControllers.reduce((accumulator, value) => ({
      ...accumulator,
      [value.toString()]: {
        torqueControl: 0,
      },
    }), {});
  },
  [MutationType.PlaySound](state, message) {
    state.midiSoundMessage = message;
  },
  [MutationType.Reset](state) {
    state.midiSelectedInput = '';
  },
  [MutationType.SelectMIDIInput](state, name) {
    state.midiSelectedInput = name;
  },
  [MutationType.SetBluetoothStatus](state, status) {
    state.bluetoothStatus = status;
  },
  [MutationType.ToggleControls](state, isVisible) {
    state.isControlsVisible = isVisible;
  },
  [MutationType.ToggleSettings](state, isVisible) {
    state.isSettingsVisible = isVisible;
  },
  [MutationType.UpdateMIDIPorts](state, midiInputs) {
    state.midiInputs = midiInputs;
  },
};
