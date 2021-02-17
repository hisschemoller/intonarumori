import { MutationTree } from 'vuex';
import { State } from './state';
import { MIDIMessage } from '../app/midi-types';

export enum MutationType {
  HandleMIDIMessage = 'HANDLE_MIDI_MESSAGE',
  PlaySound = 'PLAY_SOUND',
  Reset = 'RESET',
  SelectMIDIInput = 'SELECT_MIDI_INPUT',
  SetBluetoothStatus = 'SET_BLUETOOTH_STATUS',
  ToggleSettings = 'TOGGLE_SETTINGS',
  UpdateMIDIPorts = 'UPDATE_MIDI_PORTS',
}

export type Mutations = {
  [MutationType.HandleMIDIMessage](state: State, message: MIDIMessage): void;
  [MutationType.PlaySound](state: State, message: MIDIMessage): void;
  [MutationType.Reset](state: State): void;
  [MutationType.SelectMIDIInput](state: State, name: string): void;
  [MutationType.SetBluetoothStatus](state: State, status: number): void;
  [MutationType.ToggleSettings](state: State, isVisible: boolean): void;
  [MutationType.UpdateMIDIPorts](state: State, midiInputs: string[]): void;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.HandleMIDIMessage](state, message) {
    state.midiMessage = message;
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
  [MutationType.ToggleSettings](state, isVisible) {
    state.isSettingsVisible = isVisible;
  },
  [MutationType.UpdateMIDIPorts](state, midiInputs) {
    state.midiInputs = midiInputs;
  },
};
