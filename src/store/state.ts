import AudioData from '../interfaces/audioData';
import { MIDIMessage } from '../app/midi-types';
import { BumperDataType } from '../world/populations/bumper-data-type';

export interface NormalizedObjects<T> {
  allIds: string[];
  byId: { [id: string]: T };
}

export type State = {
  audioData: AudioData[];
  audioDataIndex: number;
  bluetoothStatus: number;
  isControlsVisible: boolean;
  isSettingsVisible: boolean;
  kiboKnobProgramChangeValue: number;
  kiboKnobProgramChangeTime: number;
  midiInputs: string[];
  midiSoundMessage: MIDIMessage;
  midiSelectedInput: string;
  bumpers: BumperDataType[];
};

export const state: State = {
  audioData: [],
  audioDataIndex: 0,
  bluetoothStatus: 0,
  isControlsVisible: false,
  isSettingsVisible: true,
  kiboKnobProgramChangeValue: 0,
  kiboKnobProgramChangeTime: 0,
  midiInputs: [],
  midiSoundMessage: {
    type: 0,
    channel: 0,
    data0: 0,
    data1: 0,
  },
  midiSelectedInput: '',
  bumpers: [],
};
