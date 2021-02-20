import { MIDIMessage } from '../app/midi-types';

export type State = {
  bluetoothStatus: number;
  isControlsVisible: boolean;
  isSettingsVisible: boolean;
  midiInputs: string[];
  midiMessage: MIDIMessage;
  midiSoundMessage: MIDIMessage;
  midiSelectedInput: string;
};

export const state: State = {
  bluetoothStatus: 0,
  isControlsVisible: false,
  isSettingsVisible: true,
  midiInputs: [],
  midiMessage: {
    type: 0,
    channel: 0,
    data0: 0,
    data1: 0,
  },
  midiSoundMessage: {
    type: 0,
    channel: 0,
    data0: 0,
    data1: 0,
  },
  midiSelectedInput: '',
};
