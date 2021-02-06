export type State = {
  isSettingsVisible: boolean;
  midiInputs: string[];
  midiSelectedInput: string;
};

export const state: State = {
  isSettingsVisible: true,
  midiInputs: [],
  midiSelectedInput: '',
};
