import { GetterTree } from 'vuex';
import { State } from './state';

export type Getters = {
  getTorqueControlFixed(state: State): (id: string) => string;
};

export const getters: GetterTree<State, State> & Getters = {
  getTorqueControlFixed: (state) => (id: string) => state.wheels.byId[id].torqueControl.toFixed(1),
};
