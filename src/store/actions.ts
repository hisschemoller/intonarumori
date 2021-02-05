import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';

export enum ActionTypes {
  ToggleSettings = 'TOGGLE_SETTINGS',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
}

export type Actions = {
  [ActionTypes.ToggleSettings](context: ActionAugments, isVisible: boolean): void;
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.ToggleSettings]({ commit }, isVisible) {
    commit(MutationType.ToggleSettings, isVisible);
  },
};
