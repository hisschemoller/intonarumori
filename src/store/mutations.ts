import { MutationTree } from 'vuex';
import { State } from './state';

export enum MutationType {
  ToggleSettings = 'TOGGLE_SETTINGS',
  SelectMIDIInput = 'SELECT_MIDI_INPUT',
  UpdateMIDIPorts = 'UPDATE_MIDI_PORTS',
}

export type Mutations = {
  [MutationType.ToggleSettings](state: State, isVisible: boolean): void;
  [MutationType.SelectMIDIInput](state: State, name: string): void;
  [MutationType.UpdateMIDIPorts](state: State, midiInputs: string[]): void;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.ToggleSettings](state, isVisible) {
    state.isSettingsVisible = isVisible;
  },
  [MutationType.SelectMIDIInput](state, name) {
    state.midiSelectedInput = name;
  },
  [MutationType.UpdateMIDIPorts](state, midiInputs) {
    state.midiInputs = midiInputs;
  },
};
