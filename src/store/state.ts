import { MIDIMessage } from '../app/midi-types';
import { BumpwheelDataType } from '../world/populations/bumpwheel-data-type';

export interface NormalizedObjects<T> {
  allIds: string[];
  byId: { [id: string]: T };
}

export type State = {
  bluetoothStatus: number;
  isControlsVisible: boolean;
  isSettingsVisible: boolean;
  kiboKnobProgramChangeValue: number;
  kiboKnobProgramChangeTime: number;
  midiHingeCCs: number[];
  midiTorqueCCs: number[];
  midiInputs: string[];
  midiSoundMessage: MIDIMessage;
  midiSelectedInput: string;
  wheels: BumpwheelDataType[];
};

export const state: State = {
  bluetoothStatus: 0,
  isControlsVisible: false,
  isSettingsVisible: true,
  kiboKnobProgramChangeValue: 0,
  kiboKnobProgramChangeTime: 0,
  midiHingeCCs: [102, 103, 104, 105, 106, 107, 108, 109],
  midiTorqueCCs: [1, 2, 3, 4, 5, 6, 7, 8],
  midiInputs: [],
  midiSoundMessage: {
    type: 0,
    channel: 0,
    data0: 0,
    data1: 0,
  },
  midiSelectedInput: '',
  wheels: [],
};
