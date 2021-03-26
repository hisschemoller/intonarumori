import { MutationTree } from 'vuex';
import { State } from './state';
import {
  KiboMIDINotes,
  MIDIMessage,
  MIDIMessageType,
} from '../app/midi-types';
import AudioData from '../interfaces/audioData';

export enum MutationType {
  HandleMIDIMessage = 'HANDLE_MIDI_MESSAGE',
  Initialise = 'INITIALISE',
  PlaySound = 'PLAY_SOUND',
  Reset = 'RESET',
  SelectMIDIInput = 'SELECT_MIDI_INPUT',
  SetAudioData = 'SET_AUDIO_DATA',
  SetBluetoothStatus = 'SET_BLUETOOTH_STATUS',
  SetSelectedSoundset = 'SET_SELECTED_SOUNDSET',
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
  [MutationType.SetAudioData](state: State, data: AudioData[]): void;
  [MutationType.SetBluetoothStatus](state: State, status: number): void;
  [MutationType.SetSelectedSoundset](state: State, index: number): void;
  [MutationType.ToggleControls](state: State, isVisible: boolean): void;
  [MutationType.ToggleSettings](state: State, isVisible: boolean): void;
  [MutationType.UpdateMIDIPorts](state: State, midiInputs: string[]): void;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.HandleMIDIMessage](state, message) {
    const { type, data0, data1 } = message;
    switch (type) {
      case MIDIMessageType.NOTE_OFF:
      case MIDIMessageType.NOTE_ON: {
        // eslint-disable-next-line no-case-declarations
        const index = KiboMIDINotes.indexOf(data0);
        if (index !== -1) {
          // state.bumpers[index].isKiboPadPressed = type === MIDIMessageType.NOTE_ON;
          state.bumpers[index].kiboPadVelocity = data1;
        }
        break;
      }

      case MIDIMessageType.PROGRAM_CHANGE: {
        break;
      }

      default:
        break;
    }
  },
  [MutationType.Initialise](state) {
    state.bumpers = KiboMIDINotes.map(() => ({
      isKiboPadPressed: false,
      kiboPadVelocity: 0,
    }));
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
  [MutationType.SetAudioData](state, data) {
    state.audioData = data;
  },
  [MutationType.SetBluetoothStatus](state, status) {
    state.bluetoothStatus = status;
  },
  [MutationType.SetSelectedSoundset](state, index) {
    console.log(index);
    state.audioDataIndex = index;
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
