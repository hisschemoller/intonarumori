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
  midiControllers: number[];
  midiInputs: string[];
  midiSoundMessage: MIDIMessage;
  midiSelectedInput: string;
  wheels: NormalizedObjects<BumpwheelDataType>;
};

export const state: State = {
  bluetoothStatus: 0,
  isControlsVisible: false,
  isSettingsVisible: true,
  midiControllers: [4, 5, 6, 7, 117, 118, 119, 3],
  midiInputs: [],
  midiSoundMessage: {
    type: 0,
    channel: 0,
    data0: 0,
    data1: 0,
  },
  midiSelectedInput: '',
  wheels: {
    allIds: [],
    byId: {},
  },
};
