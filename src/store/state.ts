export type State = {
  bluetoothStatus: number;
  isSettingsVisible: boolean;
  midiInputs: string[];
  midiSelectedInput: string;
};

export const state: State = {
  bluetoothStatus: 0,
  isSettingsVisible: true,
  midiInputs: [],
  midiSelectedInput: '',
};
