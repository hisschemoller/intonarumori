import { GetterTree } from 'vuex';
import { State } from './state';

export type Getters = {
  // getTorqueControlFixed(state: State): (index: number) => string;
};

export const getters: GetterTree<State, State> & Getters = {
  // getTorqueControlFixed:
  // (state) => (index: number) => state.wheels[index].torqueControl.toFixed(0),
};
