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
  [MutationType.ToggleControls](state: State, isVisible: boolean): void;
  [MutationType.ToggleSettings](state: State, isVisible: boolean): void;
  [MutationType.UpdateMIDIPorts](state: State, midiInputs: string[]): void;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.HandleMIDIMessage](state, message) {
    const { type, data0, data1 } = message;
    switch (type) {
      case MIDIMessageType.CONTROL_CHANGE:
        if (state.midiTorqueCCs.indexOf(data0) !== -1) {
          state.wheels[state.midiTorqueCCs.indexOf(data0)].torqueControl = data1;
        } else if (state.midiHingeCCs.indexOf(data0) !== -1) {
          state.wheels[state.midiHingeCCs.indexOf(data0)].hingeControl = data1;
        }
        break;

      case MIDIMessageType.NOTE_OFF:
      case MIDIMessageType.NOTE_ON: {
        // eslint-disable-next-line no-case-declarations
        const index = KiboMIDINotes.indexOf(data0);
        if (index !== -1) {
          state.wheels[index].isKiboPadPressed = type === MIDIMessageType.NOTE_ON;
        }
        break;
      }

      case MIDIMessageType.PROGRAM_CHANGE: {
        // eslint-disable-next-line no-case-declarations
        const {
          kiboKnobProgramChangeValue: oldValue,
          kiboKnobProgramChangeTime: oldTime,
        } = state;
        // eslint-disable-next-line no-case-declarations
        let change = data0 - oldValue;
        if (data0 === 127 && oldValue === 0) {
          change = -1;
        } else if (data0 === 0 && oldValue === 127) {
          change = 1;
        }

        // change ten times as fast when knob events are less than 150ms apart
        const time = Date.now();
        if (time - oldTime < 150) {
          change *= 10;
        }
        state.kiboKnobProgramChangeValue = data0;
        state.kiboKnobProgramChangeTime = time;
        state.wheels.forEach((wheel, index) => {
          if (wheel.isKiboPadPressed) {
            state.wheels[index].torqueControl = Math.max(
              0, Math.min(wheel.torqueControl + change, 127),
            );
          }
        });
        break;
      }

      default:
        break;
    }
  },
  [MutationType.Initialise](state) {
    state.wheels = state.midiTorqueCCs.map(() => ({
      hingeControl: 127,
      isKiboPadPressed: false,
      torqueControl: ((((Math.random() * -0.1) - 4) + 1) / -19) * 127,
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
