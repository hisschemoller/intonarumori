import { MIDIMessage } from '../app/midi-types';

export type State = {
  bluetoothStatus: number;
  isSettingsVisible: boolean;
  midiInputs: string[];
  midiMessage: MIDIMessage;
  midiMsgData1: number;
  midiMsgType: number;
  midiSelectedInput: string;
};

export const state: State = {
  bluetoothStatus: 0,
  isSettingsVisible: true,
  midiInputs: [],
  midiMessage: {
    type: 0,
    data0: 0,
    data1: 0,
  },
  midiMsgData1: 0,
  midiMsgType: 0,
  midiSelectedInput: '',
};
