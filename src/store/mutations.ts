import { MutationTree } from 'vuex';
import { State } from './state';

export enum MutationType {
  ToggleSettings = 'TOGGLE_SETTINGS',
}

export type Mutations = {
  [MutationType.ToggleSettings](state: State, isVisible: boolean): void;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.ToggleSettings](state, isVisible) {
    state.isSettingsVisible = isVisible;
  },
};
