import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';

export enum ActionType {
  LoadAudioData = 'LOAD_AUDIO_DATA',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
}

export type Actions = {
  [ActionType.LoadAudioData](context: ActionAugments): void;
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionType.LoadAudioData]({ commit }) {
    fetch('json/audiofiles.json')
      .then((response) => response.json())
      .then((json) => commit(MutationType.SetAudioData, json));
  },
};
